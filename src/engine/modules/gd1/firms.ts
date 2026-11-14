// Doanh nghiệp và hộ kinh doanh: kế hoạch, lương, giá, đầu tư, sản xuất, lãi lỗ, phá sản, gia nhập.
// Quy tắc và nguồn: docs/design/gd1.md mục 5 và 6.

import { accumulate, recordDecision } from '../../causal/causal';
import type { Engine } from '../../core/engine';
import { addRow, f64, i32, u8 } from '../../core/table';
import { GOV_REF, type World } from '../../core/world';
import { yoyInflation } from './gov';
import { tx } from '../../ledger/kinds';
import { MED_CASH, MED_DEP, repayPrincipal, transfer, writeOffLoan } from '../../ledger/ledger';
import {
  AGRI,
  F,
  foldedStep,
  firmRef,
  H,
  hhRef,
  INDUSTRY,
  minWageOf,
  NSECTOR,
  NSEG,
  payFlex,
  pitOnWage,
  PUBLIC,
  R,
  SECTOR_KEY,
  SEG_FORMAL,
  SEG_INF,
  SERVICES,
  shuffled,
  st,
  STREAM,
  taxWedge,
  UNEMPLOYED,
  vatRate,
} from './schema';

const K_WAGE = tx('wage');
const K_INVEST = tx('investment');
const K_DIV = tx('dividend');
const K_PIT = tx('pit');
const K_CIT = tx('cit');
const K_VAT = tx('vat');
const K_EXCISE = tx('excise');
const K_FEES = tx('fees');
const K_HKD = tx('hkd_tax');
const K_DRAW = tx('owner_draw');
const K_EQUITY = tx('equity');
const K_LIQ = tx('liquidation');

export function kappaOf(w: World, eng: Engine, sector: number): number {
  return eng.param(w, `firm.kappa.${SECTOR_KEY[sector]}`);
}

/** Năng suất lao động hiệu dụng của một đơn vị sản xuất. */
export function aLOf(w: World, eng: Engine, f: ReturnType<typeof F>, i: number): number {
  const a = eng.param(w, 'firm.aL');
  if (f.formal[i]) return a;
  return a * (f.solo[i] ? eng.param(w, 'hkd.soloProductivity') : eng.param(w, 'hkd.productivity'));
}

/** Số lao động tối đa mà máy móc (hoặc quy mô hộ kinh doanh) cho phép. */
export function capacityWorkers(w: World, eng: Engine, f: ReturnType<typeof F>, i: number): number {
  if (!f.formal[i]) return f.solo[i] ? 1 : eng.param(w, 'hkd.maxWorkers');
  return f.K[i] / kappaOf(w, eng, f.sector[i]);
}

/** Sản lượng mong muốn (Caiani 3.2): doanh số kỳ vọng cộng phần bù tồn kho đệm, bù dần theo `adjust`. */
export function desiredOutput(salesE: number, stock: number, nu: number, adjust: number): number {
  return Math.max(0, salesE + adjust * (nu * salesE - stock));
}

// ---------- chỉ mục người lao động theo doanh nghiệp ----------
export interface EmpIndex {
  start: Int32Array;
  list: Int32Array;
}
export function buildEmpIndex(w: World): EmpIndex {
  const h = H(w);
  const nf = w.tables.firm.n;
  const start = new Int32Array(nf + 1);
  for (let i = 0; i < h.n; i++) if (h.employer[i] >= 0) start[h.employer[i] + 1]++;
  for (let f = 0; f < nf; f++) start[f + 1] += start[f];
  const pos = start.slice(0, nf);
  const list = new Int32Array(start[nf]);
  for (let i = 0; i < h.n; i++) if (h.employer[i] >= 0) list[pos[h.employer[i]]++] = i;
  return { start, list };
}

/** Đổi nơi làm của một hộ. Mọi thay đổi việc làm đi qua đây để đếm đúng theo lý do. */
export function setEmployer(w: World, hh: number, employer: number, wage: number, reason: string): void {
  const h = H(w);
  const f = F(w);
  const old = h.employer[hh];
  if (old === employer) {
    h.wage[hh] = wage;
    return;
  }
  if (old >= 0) f.workers[old]--;
  if (old === PUBLIC) st(w).nPublic--;
  if (employer >= 0) f.workers[employer]++;
  if (employer === PUBLIC) st(w).nPublic++;
  h.employer[hh] = employer;
  h.wage[hh] = wage;
  if (old === UNEMPLOYED && employer !== UNEMPLOYED) {
    accumulate(w, 'unemp', reason, -1);
    h.uMonths[hh] = 0;
    h.resWage[hh] = wage;
    st(w).m.hires++;
  } else if (old !== UNEMPLOYED && employer === UNEMPLOYED) {
    accumulate(w, 'unemp', reason, 1);
    h.uMonths[hh] = 0;
    h.lastUnemp[hh] = w.meta.tick;
    st(w).m.fires++;
  }
}

// =====================================================================
// Pha plan: kỳ vọng doanh số, sản lượng, lao động cần, lương, giá, đầu tư
// =====================================================================
export function planFirms(w: World, eng: Engine): void {
  const f = F(w);
  const s = st(w);
  const lambda = eng.param(w, 'firm.lambda');
  const nu = eng.param(w, 'firm.nu');
  const nuS = eng.param(w, 'firm.nuServices');
  const invAdj = eng.param(w, 'firm.invAdjust');
  const gMax = eng.param(w, 'firm.gMax');
  const delta = eng.param(w, 'firm.depreciation');
  const g1 = eng.param(w, 'firm.gamma1');
  const g2 = eng.param(w, 'firm.gamma2');
  const uBar = eng.param(w, 'firm.uBar');
  const rBar = eng.param(w, 'firm.rBar');
  const wageIndex = eng.param(w, 'firm.wageIndex');
  const flexWage = eng.variant(w, 'firm.wage') === 'flex';
  const hkdFlex = eng.param(w, 'hkd.wageFlex') >= 0.5;
  const phillips = eng.param(w, 'firm.wagePhillips');
  const hkdIndex = eng.param(w, 'hkd.wageIndex');
  // mức thất nghiệp bình thường: xu thế làm trơn của chính thất nghiệp trong mô hình (Ball và Mankiw 2002), không đặt tay
  s.uStar = (s.uStar ?? s.unemp) + (s.unemp - (s.uStar ?? s.unemp)) / eng.param(w, 'firm.nairuWindow');
  const uRef = s.uStar;
  const hkdThreshold = eng.law(w, 'hkd.threshold');
  const hkdDeclare = eng.variant(w, 'tax.compliance') === 'full' ? 1 : eng.param(w, 'hkd.declare');
  const normalCost = eng.param(w, 'firm.normalCostPricing') >= 0.5;
  const month = (w.meta.startMonth - 1 + w.meta.tick) % 12;
  const target = eng.law(w, 'cb.inflation.target');
  const piE = s.trust * target + (1 - s.trust) * averageAdaptive(w);
  const useExpect = eng.variant(w, 'exp.inflation') !== 'off';
  const piExp = useExpect ? (eng.variant(w, 'exp.inflation') === 'anchored' ? target : piE) : 0;
  // Đợt xét lương năm bám lạm phát 12 tháng QUA (Rabanal và Sbrancia 2024: lương bám lạm phát CPI năm trước).
  // Biến thể `expected` quay về thiết kế mục 10: bám lạm phát kỳ vọng.
  const wagePast = eng.variant(w, 'firm.wageIndexBase') !== 'expected';
  const piWage = wagePast ? yoyInflation(s) : piExp;
  const taxPassUp = eng.param(w, 'firm.taxPassUp');
  const taxPassDown = eng.param(w, 'firm.taxPassDown');

  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    const sec = f.sector[i];
    const aL = aLOf(w, eng, f, i);

    // --- doanh số kỳ vọng (Caiani 3.1); hết hàng thì coi cầu cao hơn lượng bán được ---
    const observed = f.sales[i] * (f.stockout[i] ? 1.1 : 1);
    f.salesE[i] += lambda * (observed - f.salesE[i]);

    // --- sản lượng và lao động cần (Caiani 3.2) ---
    const capW = capacityWorkers(w, eng, f, i);
    const stock = sec === SERVICES ? 0 : f.inv[i];
    const yStar = desiredOutput(f.salesE[i], stock, sec === SERVICES ? nuS : nu, sec === SERVICES ? 1 : invAdj);
    let nT = Math.ceil(yStar / aL - 1e-9);
    nT = Math.max(1, Math.min(nT, Math.ceil(capW - 1e-9))); // người cuối có thể không đủ máy để làm hết công suất
    if (f.formal[i] && capW < 0.05) nT = 0; // chưa có máy thì chưa thuê ai
    f.nTarget[i] = nT;

    // --- lương (gd1 mục 5.3) ---
    const w0 = f.wage[i];
    let w1 = w0;
    const parts: Array<{ reason: string; amount: number }> = [];
    if (f.solo[i]) {
      // người tự làm không trả lương cho ai
    } else if (f.unfilled[i] > 0 && f.workers[i] < nT) {
      const up = w1 * foldedStep(w, eng, STREAM.wage, i) * eng.param(w, 'firm.wageShortageStep');
      w1 += up;
      parts.push({ reason: 'w_shortage', amount: up });
    } else if ((flexWage || (!f.formal[i] && hkdFlex)) && f.unfilled[i] === 0 && s.unemp > eng.param(w, 'firm.wageSlackU') && f.workers[i] >= nT && f.inv[i] > nu * f.salesE[i]) {
      // Lương giảm được khi thừa người và hàng ế. Mặc định chỉ hộ kinh doanh làm vậy (không hợp đồng);
      // doanh nghiệp chính thức giữ lương cứng chiều xuống, trừ khi bật biến thể.
      const down = -w1 * foldedStep(w, eng, STREAM.wage, i, 2);
      w1 += down;
      parts.push({ reason: 'w_slack', amount: down });
    }
    if (!f.solo[i] && i % 12 === month && f.born[i] < w.meta.tick - 6) {
      // đợt xét lương năm: theo lạm phát kỳ vọng, cộng trừ theo độ căng của thị trường lao động (Caiani 3.15: ngưỡng thất nghiệp υ)
      const up = w1 * (f.formal[i] ? wageIndex : hkdIndex) * Math.max(0, piWage);
      const slack = w1 * phillips * (uRef - s.unemp);
      const adj = Math.max(-up, slack); // lương danh nghĩa không giảm trong đợt xét năm
      if (up !== 0) parts.push({ reason: wagePast ? 'w_index' : 'w_index_exp', amount: up });
      if (adj !== 0) parts.push({ reason: adj > 0 ? 'w_tight' : 'w_slack_review', amount: adj });
      w1 += up + adj;
    }
    if (f.formal[i]) {
      const floor = minWageOf(w, eng, f.zone[i]);
      if (w1 < floor) {
        parts.push({ reason: 'w_minwage', amount: floor - w1 });
        w1 = floor;
      }
    }
    w1 = Math.round(w1);
    if (w1 !== w0) {
      f.wage[i] = w1;
      recordDecision(w, firmRef(i), 'firm.wage', 'wage', w0, w1, parts, f.workers[i]);
    }

    // --- chi phí đơn vị và giá (Caiani 3.6-3.7, thêm khấu hao và lãi vay) ---
    // chi phí máy và lãi vay tính trên sản lượng ở mức sử dụng công suất bình thường (định giá theo chi phí chuẩn),
    // để bán chậm không tự đẩy giá lên
    const yNorm = normalCost ? Math.max(aL, aL * capW * uBar) : Math.max(aL, f.salesE[i]);
    const ucWage = (f.solo[i] ? s.wageInf : f.wage[i]) / aL; // người tự làm tính công mình theo lương phi chính thức
    // lãi vay tính theo số lãi thực trả tháng trước (khoản vay cũ giữ lãi suất cũ), không nhân cả dư nợ với lãi suất mới nhất
    const interest = w.meta.tick > 0 ? f.intPaid[i] : (f.debt[i] * f.lastRate[i]) / 12;
    const ucCap = f.formal[i] ? (delta * f.capValue[i] + interest) / yNorm : 0;
    const expectFactor = 1 + piExp / 12;
    const p0 = f.priceG[i];
    let vat = taxWedge(w, eng, sec, f.formal[i] === 1); // GTGT và thuế gián thu khác trong giá
    // hộ kinh doanh thuộc diện nộp thuế theo doanh thu thì tính thuế đó vào giá
    if (!f.formal[i] && f.rev12[i] * hkdDeclare > hkdThreshold) vat += hkdDeclare * (eng.law(w, `hkd.vat.${SECTOR_KEY[sec]}`) + eng.law(w, `hkd.pit.${SECTOR_KEY[sec]}`));
    const mu0 = f.markup[i];
    let mu1 = mu0;
    const tight = sec === SERVICES ? f.sales[i] >= 0.97 * f.output[i] && f.output[i] > 0 : f.inv[i] < nu * f.salesE[i];
    const step = foldedStep(w, eng, STREAM.markup, i);
    if (w.meta.tick > 0) mu1 = tight ? mu0 * (1 + step) : mu0 * (1 - step);
    mu1 = Math.max(0, Math.min(3, mu1));
    // Thuế trong giá đổi: người bán chỉ chuyển một phần vào giá ngay, phần còn lại ăn vào biên lãi.
    // Tăng thuế chuyển nhiều (`firm.taxPassUp`), giảm thuế chuyển ít (`firm.taxPassDown`): Benzarti và cộng sự 2020.
    // Sau đó biên lãi lại đi theo sức mua như thường (bán chạy thì nâng dần lên).
    const vatWas = f.price[i] > 0 && f.priceG[i] > 0 ? f.priceG[i] / f.price[i] - 1 : vat;
    let muT = mu1;
    const taxPass = vat > vatWas ? taxPassUp : taxPassDown;
    if (w.meta.tick > 0 && taxPass !== 1 && Math.abs(vat - vatWas) > 5e-4) {
      // ngưỡng 0,05 điểm: giá gồm thuế làm tròn tới đồng nên thuế suy ngược từ giá lệch cỡ 0,001 điểm
      muT = Math.max(0, Math.min(3, (1 + mu1) * Math.pow((1 + vat) / (1 + vatWas), taxPass - 1) - 1));
    }
    const ucPrevWage = f.ucWage[i];
    const ucPrevCap = f.ucCap[i];
    const priceNet = (1 + muT) * (ucWage + ucCap) * expectFactor;
    const pG = Math.max(1, Math.round(priceNet * (1 + vat)));
    if (w.meta.tick > 0 && pG !== p0 && p0 > 0) {
      // Chia mức đổi giá theo lý do: đổi lần lượt từng đầu vào theo thứ tự cố định
      // (lương → chi phí vốn → biên lãi → kỳ vọng → thuế). Thứ tự ghi trong sổ quy tắc.
      const vatPrev = f.price[i] > 0 ? p0 / f.price[i] - 1 : vat;
      const base0 = (1 + mu0) * (ucPrevWage + ucPrevCap);
      const a = (1 + mu0) * (ucWage + ucPrevCap);
      const b = (1 + mu0) * (ucWage + ucCap);
      const c = (1 + mu1) * (ucWage + ucCap);
      const c2 = (1 + muT) * (ucWage + ucCap);
      const d = c2 * expectFactor;
      const scale0 = base0 > 0 ? f.price[i] / base0 : 1; // phần kỳ vọng đã nằm trong giá cũ
      const g0 = 1 + vatPrev;
      // Lần tính giá đầu tiên của một nơi bán mới: giá cũ là giá thị trường lúc mở cửa, chưa có chi phí riêng để so.
      if (base0 <= 0) recordDecision(w, firmRef(i), 'firm.price', 'priceG', p0, pG, [{ reason: 'p_new', amount: pG - p0 }], f.sales[i]);
      else recordDecision(
        w,
        firmRef(i),
        'firm.price',
        'priceG',
        p0,
        pG,
        [
          { reason: 'p_wage', amount: (a - base0) * scale0 * g0 },
          { reason: 'p_capital', amount: (b - a) * scale0 * g0 },
          { reason: tight ? 'p_markup_up' : 'p_markup_down', amount: (c - b) * scale0 * g0 },
          { reason: 'p_tax_absorb', amount: (c2 - c) * scale0 * g0 },
          { reason: 'p_expect', amount: (d - c2 * scale0) * g0 },
          { reason: 'p_vat', amount: d * (vat - vatPrev) },
        ],
        f.sales[i],
      );
    }
    f.markup[i] = muT;
    f.ucWage[i] = ucWage;
    f.ucCap[i] = ucCap;
    f.uc[i] = ucWage + ucCap;
    f.pricePrev[i] = p0;
    f.price[i] = priceNet;
    f.priceG[i] = pG;

    // --- đầu tư (Caiani 3.9) ---
    if (f.formal[i]) {
      const kappa = kappaOf(w, eng, sec);
      f.util[i] = capW > 0 ? Math.min(1, f.output[i] / (aL * capW)) : 1;
      // mức sử dụng công suất MONG MUỐN: sản lượng muốn làm so với sức máy (Caiani 3.9 dùng u_D); có thể vượt 1
      const u = capW > 0 ? Math.min(2, yStar / (aL * capW)) : 2;
      const r = f.capValue[i] > 0 ? f.ocf[i] / f.capValue[i] : rBar;
      f.profitRate[i] = r;
      let g = g1 * ((r - rBar) / rBar) + g2 * ((u - uBar) / uBar);
      g = Math.max(-delta, Math.min(gMax, g));
      let want = f.K[i] * (g + delta);
      // doanh nghiệp mới hoặc thiếu máy trầm trọng: mua đủ cho số lao động tối thiểu
      const minK = kappa * Math.max(2, Math.min(f.workers[i] + 1, 3));
      if (f.K[i] < minK) want = Math.max(want, minK - f.K[i]);
      f.iPlan[i] = want > 0.5 ? want : 0;
    } else f.iPlan[i] = 0;
  }
}

function averageAdaptive(w: World): number {
  const h = H(w);
  let x = 0;
  for (let i = 0; i < h.n; i++) x += h.piAdapt[i];
  return h.n ? x / h.n : 0;
}

// =====================================================================
// Pha labor: sa thải, đăng tuyển, tìm việc
// =====================================================================
export function laborMarket(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  const fireMax = eng.param(w, 'firm.fireMax');
  const idx = buildEmpIndex(w);

  // --- sa thải: thừa người so với kế hoạch, hoặc không đủ tiền trả lương ---
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    const n = f.workers[i];
    const funds = f.formal[i] ? f.dep[i] + f.cash[i] : f.cash[i] + f.dep[i];
    const hired = f.formal[i] ? n : n - 1; // chủ hộ kinh doanh không lãnh lương
    const affordable = f.wage[i] > 0 ? Math.floor(funds / f.wage[i]) : hired;
    let excess = n - f.nTarget[i];
    let reason = 'u_fired_demand';
    const cannotPay = f.wage[i] > 0 ? hired - Math.floor(funds / f.wage[i] + 0.3) : 0; // thiếu dưới 30% một suất lương thì chưa cắt người
    if (cannotPay > Math.max(0, excess)) {
      excess = cannotPay;
      reason = 'u_cannot_pay';
    } else if (excess > 0) excess = Math.min(excess, Math.max(1, Math.ceil(n * fireMax)));
    if (excess > 0) {
      let k = 0;
      // sa thải theo thứ tự ngẫu nhiên tất định; không sa thải chủ hộ kinh doanh
      const a = idx.start[i];
      const b = idx.start[i + 1];
      const off = Math.floor(R(w, STREAM.fire, i) * Math.max(1, b - a));
      for (let j = 0; j < b - a && k < excess; j++) {
        const hh = idx.list[a + ((j + off) % (b - a))];
        if (h.ownBiz[hh] === i) continue;
        setEmployer(w, hh, UNEMPLOYED, 0, reason);
        k++;
      }
    }
    // chỉ đăng tuyển số người mà tiền đang có trả nổi lương
    f.vac[i] = Math.max(0, Math.min(f.nTarget[i] - f.workers[i], affordable - (f.formal[i] ? f.workers[i] : f.workers[i] - 1)));
    f.vacLeft[i] = f.vac[i];
    s.m.vacancies += f.vac[i];
  }

  // --- luân chuyển tự nhiên: mỗi tháng một phần nhỏ người làm thuê rời chỗ làm (Caiani: θ) ---
  const turnover = eng.param(w, 'firm.turnover');
  if (turnover > 0)
    for (let i = 0; i < h.n; i++) {
      const e = h.employer[i];
      if (e < 0 || h.ownBiz[i] === e) continue;
      if (R(w, STREAM.fire, i, 3) < turnover) {
        setEmployer(w, i, UNEMPLOYED, 0, 'u_turnover');
        f.vac[e]++;
        f.vacLeft[e]++;
        s.m.vacancies++;
      }
    }

  // --- Nhà nước giữ biên chế theo tỷ lệ lực lượng lao động ---
  const pubTarget = Math.round(h.n * eng.law(w, 'gov.public.share'));
  let pubVac = Math.max(0, pubTarget - s.nPublic);
  if (s.nPublic > pubTarget) {
    let cut = s.nPublic - pubTarget;
    for (let i = 0; i < h.n && cut > 0; i++)
      if (h.employer[i] === PUBLIC) {
        setEmployer(w, i, UNEMPLOYED, 0, 'u_public_cut');
        cut--;
      }
  }
  s.m.vacancies += pubVac;

  // --- danh sách nơi đang tuyển ---
  const open: number[] = [];
  for (let i = 0; i < f.n; i++) if (f.alive[i] && f.vacLeft[i] > 0) open.push(i);
  const nOpen = open.length;
  const M = Math.round(eng.param(w, 'hh.applications'));
  const onJob = eng.param(w, 'hh.onJobSearch');
  const order = shuffled(w, STREAM.jobOrder, h.n);
  const cand = new Int32Array(M);

  for (let q = 0; q < h.n; q++) {
    const i = order[q];
    const e = h.employer[i];
    if (h.ownBiz[i] >= 0 && !f.solo[h.ownBiz[i]]) continue; // chủ hộ kinh doanh có thuê người không đi tìm việc
    if (e === UNEMPLOYED || (h.ownBiz[i] >= 0 && f.solo[h.ownBiz[i]])) {
      // người thất nghiệp và người tự làm do hết đường: hỏi Nhà nước trước nếu đang tuyển, rồi M nơi
      const current = e === UNEMPLOYED ? 0 : soloIncome(w, eng, f, h.ownBiz[i]);
      const want = Math.max(h.resWage[i], current * 1.1);
      if (pubVac > 0 && s.publicWage >= want) {
        leaveSolo(w, i);
        setEmployer(w, i, PUBLIC, s.publicWage, 'u_hired_public');
        pubVac--;
        continue;
      }
      if (!nOpen) continue;
      let nc = 0;
      for (let k = 0; k < M; k++) {
        const c = open[Math.floor(R(w, STREAM.jobPick, i, k) * nOpen)];
        if (f.vacLeft[c] > 0) cand[nc++] = c;
      }
      let best = -1;
      for (let k = 0; k < nc; k++) if (f.wage[cand[k]] >= want && (best < 0 || f.wage[cand[k]] > f.wage[best])) best = cand[k];
      if (best >= 0) {
        leaveSolo(w, i);
        setEmployer(w, i, best, f.wage[best], f.formal[best] ? 'u_hired_formal' : 'u_hired_informal');
        f.vacLeft[best]--;
      }
    } else if (e >= 0 && nOpen && R(w, STREAM.onJob, i) < onJob) {
      const c = open[Math.floor(R(w, STREAM.jobPick, i, 99) * nOpen)];
      if (c !== e && f.vacLeft[c] > 0 && f.wage[c] > h.wage[i] * 1.05) {
        setEmployer(w, i, c, f.wage[c], 'u_job_switch');
        f.vacLeft[c]--;
        h.resWage[i] = f.wage[c];
      }
    }
  }
  for (let i = 0; i < f.n; i++) if (f.alive[i]) f.unfilled[i] = f.vacLeft[i];
}

function soloIncome(w: World, eng: Engine, f: ReturnType<typeof F>, biz: number): number {
  return f.revenue[biz] > 0 ? f.revenue[biz] : aLOf(w, eng, f, biz) * f.price[biz] * 0.7;
}

/** Người tự làm tìm được việc thì đóng hộ kinh doanh một người của mình. */
function leaveSolo(w: World, hh: number): void {
  const h = H(w);
  const biz = h.ownBiz[hh];
  if (biz < 0) return;
  const f = F(w);
  if (!f.solo[biz]) return;
  closeHkd(w, biz, 'u_solo_closed');
}

/** Đóng một hộ kinh doanh: chủ nhận lại tiền, người làm thuê mất việc. */
export function closeHkd(w: World, biz: number, reason: string): void {
  const f = F(w);
  const h = H(w);
  if (!f.alive[biz]) return;
  const owner = f.owner[biz];
  for (let i = 0; i < h.n; i++) {
    if (h.employer[i] !== biz) continue;
    if (i === owner) {
      // chủ chuyển sang trạng thái tìm việc; không tính là bị sa thải
      f.workers[biz]--;
      h.employer[i] = UNEMPLOYED;
      h.wage[i] = 0;
      accumulate(w, 'unemp', reason, 1);
      h.lastUnemp[i] = w.meta.tick;
    } else setEmployer(w, i, UNEMPLOYED, 0, 'u_hkd_closed');
  }
  if (owner >= 0) {
    transfer(w, firmRef(biz), hhRef(owner), f.cash[biz], MED_CASH, K_DRAW);
    transfer(w, firmRef(biz), hhRef(owner), f.dep[biz], MED_DEP, K_DRAW);
    h.ownBiz[owner] = -1;
  }
  st(w).m.dInvValue -= f.invValue[biz];
  f.invValue[biz] = 0;
  f.inv[biz] = 0;
  f.alive[biz] = 0;
  f.died[biz] = w.meta.tick;
}

// =====================================================================
// Pha produce: sản xuất, khấu hao, mua máy
// =====================================================================
export function produce(w: World, eng: Engine): void {
  const f = F(w);
  const s = st(w);
  const delta = eng.param(w, 'firm.depreciation');
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    const sec = f.sector[i];
    const aL = aLOf(w, eng, f, i);
    const capW = capacityWorkers(w, eng, f, i);
    f.invStart[i] = f.invValue[i];
    if (sec === SERVICES) {
      f.inv[i] = 0;
      f.invValue[i] = 0;
      f.invStart[i] = 0;
    }
    const stock = sec === SERVICES ? 0 : f.inv[i];
    const yStar = sec === SERVICES ? desiredOutput(f.salesE[i], 0, eng.param(w, 'firm.nuServices'), 1) : desiredOutput(f.salesE[i], stock, eng.param(w, 'firm.nu'), eng.param(w, 'firm.invAdjust'));
    const y = Math.min(yStar, aL * Math.min(f.workers[i], capW));
    f.output[i] = y;
    f.inv[i] += y;
    // tồn kho ghi theo chi phí lương của số người thực làm
    const hired = f.formal[i] ? f.workers[i] : Math.max(0, f.workers[i] - 1);
    const cost = hired * f.wage[i];
    if (sec !== SERVICES) f.invValue[i] += cost;
    s.m.outputReal[sec] += y;
    // khấu hao
    if (f.formal[i] && f.K[i] > 0) {
      const d = f.capValue[i] * delta;
      f.K[i] *= 1 - delta;
      f.capValue[i] -= d;
      f.deprec[i] = d;
      s.m.deprec += d;
    } else f.deprec[i] = 0;
    f.sales[i] = 0;
    f.revenue[i] = 0;
    f.stockout[i] = 0;
    f.wagesPaid[i] = 0;
    f.intPaid[i] = 0;
  }
  buyCapital(w, eng);
}

/** Doanh nghiệp mua máy từ doanh nghiệp công nghiệp. Giao dịch giữa doanh nghiệp không tính thuế GTGT (đầu vào được khấu trừ). */
function buyCapital(w: World, eng: Engine): void {
  const f = F(w);
  const s = st(w);
  const sellers: number[] = [];
  for (let i = 0; i < f.n; i++) if (f.alive[i] && f.sector[i] === INDUSTRY && f.formal[i] && f.inv[i] > 1) sellers.push(i);
  if (!sellers.length) return;
  const buffer = eng.param(w, 'firm.liqBuffer');
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || f.iPlan[i] <= 0) continue;
    let want = f.iPlan[i];
    // tiền dành cho máy: phần còn lại sau khi để riêng lương tháng này, đệm thanh khoản và nghĩa vụ nợ
    let funds = f.dep[i] - f.workers[i] * f.wage[i] * (1 + buffer) - f.service[i];
    for (let k = 0; k < 5 && want > 0.5 && funds > 0; k++) {
      // xem 5 người bán, mua ở nơi rẻ nhất còn hàng (Caiani mục 2)
      let best = -1;
      for (let j = 0; j < 5; j++) {
        const c = sellers[Math.floor(R(w, STREAM.capSeller, i, k * 8 + j) * sellers.length)];
        if (c !== i && f.inv[c] > 0.5 && (best < 0 || f.price[c] < f.price[best])) best = c;
      }
      if (best < 0) break;
      const p = f.price[best];
      const q = Math.min(want, f.inv[best], funds / p);
      if (q < 0.5) break;
      const paid = transfer(w, firmRef(i), firmRef(best), q * p, MED_DEP, K_INVEST);
      if (paid <= 0) break;
      sellGoods(f, best, q, paid, 0);
      f.K[i] += q;
      f.capValue[i] += paid;
      want -= q;
      funds -= paid;
      s.m.invNom += paid;
      s.m.invReal += q;
    }
  }
}

/** Ghi nhận bán hàng ở phía người bán: giảm tồn kho theo giá vốn bình quân, cộng doanh thu chưa thuế. */
export function sellGoods(f: ReturnType<typeof F>, seller: number, qty: number, paid: number, vat: number): void {
  const unitCost = f.inv[seller] > 0 ? f.invValue[seller] / f.inv[seller] : 0;
  f.inv[seller] -= qty;
  f.invValue[seller] = Math.max(0, f.invValue[seller] - unitCost * qty);
  if (f.inv[seller] < 1e-6) {
    f.inv[seller] = 0;
    f.invValue[seller] = 0;
  }
  const net = paid / (1 + vat);
  f.sales[seller] += qty;
  f.revenue[seller] += net;
  f.vatDue[seller] += paid - net;
}

// =====================================================================
// Pha pay: trả lương doanh nghiệp (lương công chức ở gov.ts)
// =====================================================================
export function payWages(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  for (let i = 0; i < h.n; i++) {
    h.income[i] = 0;
    h.grossWage[i] = 0;
    h.pitPaid[i] = 0;
    const e = h.employer[i];
    if (e < 0) continue;
    if (h.ownBiz[i] === e) continue; // chủ hộ kinh doanh lãnh phần còn lại ở pha profit
    const wage = f.wage[e];
    h.wage[i] = wage;
    const formal = f.formal[e] === 1;
    const fr = firmRef(e);
    const paid = payFlex(w, fr, hhRef(i), wage, formal ? MED_DEP : MED_CASH, K_WAGE);
    f.wagesPaid[e] += paid;
    s.m.wagesPrivate += paid;
    if (paid < wage) f.distress[e] = Math.max(f.distress[e], 1);
    h.grossWage[i] = paid;
    let net = paid;
    if (formal || eng.variant(w, 'tax.compliance') === 'full') {
      const tax = pitOnWageCached(w, eng, paid, h.dependents[i]);
      if (tax > 0) {
        const t = payFlex(w, hhRef(i), GOV_REF, tax, formal ? MED_DEP : MED_CASH, K_PIT);
        net -= t;
        h.pitPaid[i] = t;
        s.m.taxPit += t;
      }
    }
    h.income[i] += net;
  }
}

function pitOnWageCached(w: World, eng: Engine, gross: number, dep: number): number {
  // Phần lớn lương dưới mức giảm trừ; kiểm nhanh trước khi tính biểu thuế.
  if (gross <= eng.law(w, 'pit.deduction.self')) return 0;
  return pitOnWage(w, eng, gross, dep);
}

// =====================================================================
// Pha tax: nộp GTGT, thuế hộ kinh doanh
// =====================================================================
export function payTaxes(w: World, eng: Engine): void {
  const f = F(w);
  const s = st(w);
  const threshold = eng.law(w, 'hkd.threshold');
  const full = eng.variant(w, 'tax.compliance') === 'full';
  const declare = full ? 1 : eng.param(w, 'hkd.declare');
  const exRate = [0, eng.law(w, 'tax.indirect.other'), eng.law(w, 'tax.indirect.other')];
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    f.rev12[i] += f.revenue[i] - f.rev12[i] / 12;
    // thuế thu hộ trong giá bán: GTGT (doanh nghiệp) và thuế gián thu khác (mọi người bán)
    if (f.vatDue[i] >= 1) {
      const vat = f.formal[i] ? vatRate(w, eng, f.sector[i]) : 0;
      const ex = exRate[f.sector[i]];
      const due = f.vatDue[i];
      const vatPart = vat + ex > 0 ? Math.floor((due * vat) / (vat + ex)) : due;
      const exPart = due - vatPart;
      if (vatPart >= 1) {
        const paid = transfer(w, firmRef(i), GOV_REF, vatPart, MED_DEP, K_VAT, 0, true);
        f.vatDue[i] -= paid;
        s.m.taxVat += paid;
      }
      if (exPart >= 1) {
        const paid = f.formal[i] ? transfer(w, firmRef(i), GOV_REF, exPart, MED_DEP, K_EXCISE, 0, true) : payFlex(w, firmRef(i), GOV_REF, exPart, MED_CASH, K_EXCISE);
        f.vatDue[i] -= paid;
        s.m.taxExcise += paid;
      }
    }
    if (!f.formal[i]) {
      // Hộ kinh doanh: doanh thu khai báo cả năm vượt ngưỡng thì nộp tỷ lệ % trên doanh thu khai báo tháng này.
      const declaredYear = f.rev12[i] * declare;
      if (declaredYear > threshold) {
        const key = SECTOR_KEY[f.sector[i]];
        const rate = eng.law(w, `hkd.vat.${key}`) + eng.law(w, `hkd.pit.${key}`);
        const paid = payFlex(w, firmRef(i), GOV_REF, f.revenue[i] * declare * rate, MED_CASH, K_HKD);
        s.m.taxHkd += paid;
        f.intPaid[i] += paid; // tính vào chi phí tháng
      }
    }
  }
}

// =====================================================================
// Pha profit: lãi lỗ, thuế TNDN, cổ tức, chủ hộ kinh doanh rút lãi
// =====================================================================
export function profits(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  const lambda = eng.param(w, 'firm.lambda');
  const rho = eng.param(w, 'firm.dividend');
  const buffer = eng.param(w, 'firm.liqBuffer');
  const quarterEnd = (w.meta.tick + 1) % 3 === 0;
  const pK = s.pK;
  const divTax = eng.law(w, 'pit.rate.dividend');
  const equalDiv = eng.variant(w, 'firm.dividend') === 'equal';
  const owners = quarterEnd ? ownersIndex(w, 0) : null;
  let pool = 0; // biến thể chia đều: gom cổ tức rồi chia cho mọi hộ

  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    const sec = f.sector[i];
    if (sec === SERVICES) {
      s.m.unsold += f.inv[i];
      f.inv[i] = 0;
      f.invValue[i] = 0;
    }
    const dInv = f.invValue[i] - f.invStart[i];
    s.m.dInvValue += dInv;
    const profit = f.revenue[i] - f.wagesPaid[i] - f.deprec[i] - f.intPaid[i] + (sec === SERVICES ? 0 : dInv);
    f.profit[i] = profit;
    const ocf = f.revenue[i] - f.wagesPaid[i] - f.intPaid[i];
    f.ocf[i] += lambda * (ocf - f.ocf[i]);

    if (!f.formal[i]) {
      // chủ hộ kinh doanh rút phần tiền vượt đệm một tháng lương
      const owner = f.owner[i];
      // giữ đủ tiền trả lương cho số người định thuê, kể cả người sắp thuê thêm
      const keep = Math.max(0, Math.max(f.workers[i], f.nTarget[i] + 1) - 1) * f.wage[i] * (buffer + 0.5);
      const draw = Math.floor(f.cash[i] + f.dep[i] - keep);
      if (owner >= 0 && draw > 0) {
        let got = transfer(w, firmRef(i), hhRef(owner), Math.min(draw, f.cash[i]), MED_CASH, K_DRAW);
        if (got < draw) got += transfer(w, firmRef(i), hhRef(owner), draw - got, MED_DEP, K_DRAW, 0, true);
        h.income[owner] += got;
      }
      continue;
    }

    // thuế TNDN tạm nộp hằng tháng trên lợi nhuận dương
    let after = profit;
    if (profit > 0) {
      const rate = f.rev12[i] <= eng.law(w, 'cit.limit.small') ? eng.law(w, 'cit.rate.small') : f.rev12[i] <= eng.law(w, 'cit.limit.mid') ? eng.law(w, 'cit.rate.mid') : eng.law(w, 'cit.rate.standard');
      const paid = transfer(w, firmRef(i), GOV_REF, profit * rate, MED_DEP, K_CIT, 0, true);
      after -= paid;
      s.m.taxCit += paid;
    }
    f.profitQ[i] += after;

    // cổ tức theo quý (Caiani: ρ = 0,9), chỉ chia phần tiền vượt đệm
    if (quarterEnd) {
      // tiền dành cho máy định mua được giữ lại trước khi chia cổ tức
      const free = f.dep[i] - f.workers[i] * f.wage[i] * buffer - f.service[i] - f.iPlan[i] * pK;
      const div = Math.floor(Math.min(rho * Math.max(0, f.profitQ[i]), Math.max(0, free)));
      f.profitQ[i] = 0;
      if (div > 0) {
        if (f.stateOwned[i]) transfer(w, firmRef(i), GOV_REF, div, MED_DEP, K_DIV);
        else if (equalDiv) pool += payDividendTo(w, i, div);
        else {
          const a = owners!.start[i];
          const b = owners!.start[i + 1];
          for (let k = a; k < b; k++) {
            const row = owners!.rows[k];
            const o = i32(w.tables.share, 'owner')[row];
            const amt = Math.floor(div * f64(w.tables.share, 'frac')[row]);
            const paid = transfer(w, firmRef(i), hhRef(o), amt, MED_DEP, K_DIV);
            const t = transfer(w, hhRef(o), GOV_REF, paid * divTax, MED_DEP, K_PIT);
            s.m.taxPit += t;
            h.income[o] += paid - t;
          }
        }
      }
    }
  }
  if (pool > 0) distributeEqually(w, eng, pool);
  collectFees(w, eng);
}

/** Thu từ đất, phí, lệ phí (gộp): một tỷ lệ trên thu nhập khả dụng tháng của hộ (sai-khac.md S3). */
function collectFees(w: World, eng: Engine): void {
  const rate = eng.law(w, 'gov.fees.rate');
  if (rate <= 0) return;
  const h = H(w);
  const s = st(w);
  for (let i = 0; i < h.n; i++) {
    const fee = Math.floor(h.income[i] * rate);
    if (fee < 1) continue;
    const paid = payFlex(w, hhRef(i), GOV_REF, fee, MED_DEP, K_FEES);
    h.income[i] -= paid;
    s.m.taxFees += paid;
  }
}

/** Biến thể Phòng thí nghiệm: cổ tức gom về một quỹ tạm ở kho bạc rồi chia đều. */
function payDividendTo(w: World, firm: number, div: number): number {
  return transfer(w, firmRef(firm), GOV_REF, div, MED_DEP, K_DIV);
}
function distributeEqually(w: World, eng: Engine, pool: number): void {
  const h = H(w);
  const each = Math.floor(pool / h.n);
  const divTax = eng.law(w, 'pit.rate.dividend');
  for (let i = 0; i < h.n; i++) {
    const paid = transfer(w, GOV_REF, hhRef(i), each, MED_DEP, K_DIV, 0, true);
    const t = transfer(w, hhRef(i), GOV_REF, paid * divTax, MED_DEP, K_PIT);
    st(w).m.taxPit += t;
    h.income[i] += paid - t;
  }
}

export interface OwnersIndex {
  start: Int32Array;
  rows: Int32Array;
}
/** Chỉ mục sổ cổ đông theo đơn vị. kind: 0 doanh nghiệp, 1 ngân hàng. */
export function ownersIndex(w: World, kind: number): OwnersIndex {
  const S = w.tables.share;
  const ent = i32(S, 'entity');
  const kd = u8(S, 'kind');
  const al = u8(S, 'alive');
  const n = kind === 0 ? w.tables.firm.n : w.tables.bank.n;
  const start = new Int32Array(n + 1);
  for (let r = 0; r < S.n; r++) if (al[r] && kd[r] === kind) start[ent[r] + 1]++;
  for (let i = 0; i < n; i++) start[i + 1] += start[i];
  const pos = start.slice(0, n);
  const rows = new Int32Array(start[n]);
  for (let r = 0; r < S.n; r++) if (al[r] && kd[r] === kind) rows[pos[ent[r]]++] = r;
  return { start, rows };
}

// =====================================================================
// Pha exit: phá sản, hộ kinh doanh đóng cửa, lối thoát phi chính thức, gia nhập
// =====================================================================
export function exitAndEntry(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  const maxDistress = eng.param(w, 'firm.distressMonths');
  const haircut = eng.param(w, 'firm.haircut');
  const noBankruptcy = eng.variant(w, 'firm.bankruptcy') === 'bailout';
  const restructureOn = eng.param(w, 'bank.restructure') >= 0.5;
  const soloUp = eng.param(w, 'hkd.soloUpgrade');

  // --- phá sản doanh nghiệp chính thức (Caiani 3.3) ---
  const loanOverdue = overdueByFirm(w);
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || !f.formal[i]) continue;
    const netWorth = f.dep[i] + f.cash[i] + f.invValue[i] + f.capValue[i] - f.debt[i];
    if (loanOverdue[i] > 0) f.distress[i]++;
    else if (f.distress[i] > 0 && f.wagesPaid[i] >= f.workers[i] * f.wage[i] * 0.999) f.distress[i] = 0;
    // doanh nghiệp không còn người, không còn tiền trả một tháng lương: giải thể
    const idle = f.workers[i] === 0 && f.dep[i] + f.cash[i] < f.wage[i] && w.meta.tick - f.born[i] > 6;
    // tắt giãn nợ thì quay về quy tắc của thiết kế: chậm trả quá hạn là phá sản
    const bust = netWorth < 0 || idle || (!restructureOn && f.distress[i] > maxDistress && loanOverdue[i] > 0);
    if (!bust) {
      // Chậm trả quá hạn nhưng vốn ròng còn dương: ngân hàng cơ cấu lại nợ (giãn kỳ hạn) thay vì đẩy vào phá sản. [TTK]
      if (restructureOn && f.distress[i] > maxDistress && loanOverdue[i] > 0) {
        restructure(w, i, eng.param(w, 'bank.loanMonthsInv'));
        f.distress[i] = 0;
        s.m.restructured++;
      }
      continue;
    }
    if (noBankruptcy) {
      // Biến thể: Nhà nước cứu mọi doanh nghiệp (ràng buộc ngân sách mềm).
      const need = Math.max(0, -netWorth) + f.workers[i] * f.wage[i] * 2 + f.service[i] * 2;
      transfer(w, GOV_REF, firmRef(i), need, MED_DEP, tx('transfer_social'), 0, true);
      f.distress[i] = 0;
      continue;
    }
    if ((globalThis as any).__dbg) console.log('BUST t', w.meta.tick, 'firm', i, 'sec', f.sector[i], 'workers', f.workers[i], 'nw', (netWorth / 1e6).toFixed(0), 'distress', f.distress[i], 'idle', idle, 'dep', (f.dep[i] / 1e6).toFixed(0), 'debt', (f.debt[i] / 1e6).toFixed(0), 'cap', (f.capValue[i] / 1e6).toFixed(0), 'sales', f.sales[i].toFixed(0), 'salesE', f.salesE[i].toFixed(0), 'price', f.priceG[i], 'mu', f.markup[i].toFixed(2), 'ocf', (f.ocf[i] / 1e6).toFixed(1), 'svc', (f.service[i] / 1e6).toFixed(1));
    bankrupt(w, i, haircut);
  }

  // --- hộ kinh doanh có thuê người nhưng hết việc lâu, hoặc lỗ kéo dài: đóng cửa ---
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || f.formal[i] || f.solo[i]) continue;
    if (f.revenue[i] <= 0) f.distress[i]++;
    else f.distress[i] = 0;
    if (f.distress[i] > 6) closeHkd(w, i, 'u_hkd_closed');
  }

  // --- người tự làm bán hết hàng và có vốn thì thuê người, thành hộ kinh doanh thường [TTK] ---
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || !f.solo[i] || !f.stockout[i]) continue;
    const o = f.owner[i];
    if (o < 0 || h.cash[o] + h.dep[o] < 4 * s.wageInf || R(w, STREAM.hkdHire, i) >= soloUp) continue;
    payFlex(w, hhRef(o), firmRef(i), 2 * s.wageInf, MED_CASH, K_EQUITY);
    f.solo[i] = 0;
    f.wage[i] = Math.round(s.wageInf);
    f.markup[i] = eng.param(w, 'firm.markup0');
  }

  // --- lối thoát phi chính thức (T2): thất nghiệp lâu và sắp hết tiền thì tự làm ---
  const T = eng.param(w, 'hh.fallbackMonths');
  const kMonths = eng.param(w, 'hh.fallbackWealth');
  const foodCost = eng.param(w, 'hh.foodMin') * s.pSector[AGRI];
  const useFallback = eng.variant(w, 'hh.fallback') !== 'off';
  for (let i = 0; i < h.n; i++) {
    if (h.employer[i] !== UNEMPLOYED) {
      // người tự làm một mình vẫn đang tìm việc: lương đòi hỏi tiếp tục hạ dần
      const biz = h.ownBiz[i];
      if (biz >= 0 && f.solo[biz]) h.resWage[i] = Math.max(foodCost * 1.2, h.resWage[i] * (1 - eng.param(w, 'hh.resWageDecay')));
      continue;
    }
    h.uMonths[i]++;
    h.resWage[i] = Math.max(foodCost * 1.2, h.resWage[i] * (1 - eng.param(w, 'hh.resWageDecay')));
    if (!useFallback || h.ownBiz[i] >= 0) continue;
    if (h.uMonths[i] >= T && h.cash[i] + h.dep[i] < kMonths * foodCost * 2) startSolo(w, eng, i);
  }

  // --- gia nhập ---
  hkdEntry(w, eng);
  entry(w, eng);
}

/** Giãn nợ: các khoản vay của doanh nghiệp (chỉ khoản quá hạn, hoặc tất cả) được tính lại kỳ trả gốc trên kỳ hạn mới. */
export function restructure(w: World, firm: number, months: number, all = false): void {
  const L = w.tables.loan;
  const br = i32(L, 'borrower');
  const ov = i32(L, 'overdue');
  const al = u8(L, 'alive');
  const me = firmRef(firm);
  for (let r = 0; r < L.n; r++) {
    if (!al[r] || br[r] !== me || (!all && ov[r] <= 0)) continue;
    f64(L, 'instalment')[r] = Math.ceil(f64(L, 'principal')[r] / months);
    i32(L, 'left')[r] = months;
    ov[r] = 0;
  }
}

function overdueByFirm(w: World): Int32Array {
  const L = w.tables.loan;
  const out = new Int32Array(w.tables.firm.n);
  const br = i32(L, 'borrower');
  const ov = i32(L, 'overdue');
  const al = u8(L, 'alive');
  for (let r = 0; r < L.n; r++) if (al[r] && ov[r] > 0 && br[r] >>> 24 === 1) out[br[r] & 0xffffff] = Math.max(out[br[r] & 0xffffff], ov[r]);
  return out;
}

function bankrupt(w: World, i: number, haircut: number): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  // 1. người lao động mất việc
  for (let k = 0; k < h.n; k++) if (h.employer[k] === i) setEmployer(w, k, UNEMPLOYED, 0, 'u_bankrupt');
  // 2. thanh lý máy với giá chiết khấu cho các doanh nghiệp còn nhiều tiền nhất (tối đa ba nơi mua).
  //    Tồn kho coi như bỏ. Phần chiết khấu và phần không ai mua là mất mát thật.
  const value = f.capValue[i] * (1 - haircut);
  if (value >= 1) {
    const buyers: number[] = [];
    for (let k = 0; k < f.n; k++) if (k !== i && f.alive[k] && f.formal[k] && f.dep[k] > 0) buyers.push(k);
    // nơi đang cần thêm máy được mua trước, rồi tới nơi nhiều tiền
    buyers.sort((x, y) => (f.iPlan[y] > 0 ? 1 : 0) - (f.iPlan[x] > 0 ? 1 : 0) || f.dep[y] - f.dep[x] || x - y);
    let left = 1; // phần máy chưa bán
    for (let q = 0; q < Math.min(3, buyers.length) && left > 0.01; q++) {
      const k = buyers[q];
      const paid = transfer(w, firmRef(k), firmRef(i), Math.min(value * left, 0.5 * f.dep[k]), MED_DEP, K_LIQ);
      if (paid <= 0) continue;
      const frac = paid / value;
      f.K[k] += f.K[i] * frac;
      f.capValue[k] += paid;
      left -= frac;
    }
  }
  s.m.dInvValue -= f.invValue[i];
  f.inv[i] = 0;
  f.invValue[i] = 0;
  f.K[i] = 0;
  f.capValue[i] = 0;
  // 3. trả nợ ngân hàng bằng tiền còn lại, phần thiếu ngân hàng xoá
  const L = w.tables.loan;
  const br = i32(L, 'borrower');
  const al = u8(L, 'alive');
  const me = firmRef(i);
  const mine: number[] = [];
  let debt = 0;
  for (let r = 0; r < L.n; r++)
    if (al[r] && br[r] === me) {
      mine.push(r);
      debt += f64(L, 'principal')[r];
    }
  // nộp phần GTGT còn nợ trước
  if (f.vatDue[i] >= 1) transfer(w, me, GOV_REF, f.vatDue[i], MED_DEP, K_VAT, 0, true);
  f.vatDue[i] = 0;
  const cashOnHand = f.dep[i];
  const ratio = debt > 0 ? Math.min(1, cashOnHand / debt) : 0;
  for (const r of mine) {
    const p = f64(L, 'principal')[r];
    repayPrincipalSafe(w, r, Math.floor(p * ratio));
    writeOffLoan(w, r);
  }
  // 4. phần tiền còn lại (nếu có) về chủ sở hữu
  const S = w.tables.share;
  const ent = i32(S, 'entity');
  const kd = u8(S, 'kind');
  const sal = u8(S, 'alive');
  const left = f.dep[i];
  for (let r = 0; r < S.n; r++)
    if (sal[r] && kd[r] === 0 && ent[r] === i) {
      if (left > 0) transfer(w, me, hhRef(i32(S, 'owner')[r]), left * f64(S, 'frac')[r], MED_DEP, K_DIV);
      sal[r] = 0;
    }
  if (f.dep[i] > 0) transfer(w, me, GOV_REF, f.dep[i], MED_DEP, tx('other'));
  f.alive[i] = 0;
  f.died[i] = w.meta.tick;
  f.workers[i] = 0;
  s.m.bankrupt++;
}

function repayPrincipalSafe(w: World, loan: number, amount: number): void {
  if (amount > 0) repayPrincipal(w, loan, amount);
}

/**
 * Nơi bán mới mở được một số hộ quanh đó biết tới và mua thử [TTK]: mỗi hộ đặt nó vào chỗ của người bán đắt nhất mình đang biết
 * trong cùng loại hàng. Không có bước này thì nơi mới mở không có khách nào, vì hộ chỉ mua ở nơi quen.
 */
export function announce(w: World, eng: Engine, firm: number): void {
  const f = F(w);
  const h = H(w);
  const n = Math.min(h.n, Math.max(1, Math.round(f.salesE[firm] * eng.param(w, 'entry.customersPerUnit'))));
  const g = f.sector[firm] * 2 + (f.formal[firm] ? SEG_FORMAL : SEG_INF);
  const base = g * NSEG;
  for (let k = 0; k < n; k++) {
    const i = Math.floor(R(w, STREAM.announce, firm, k) * h.n);
    let worst = 0;
    let dup = false;
    for (let q = 0; q < NSEG; q++) {
      const c = h.sellers[base + q][i];
      if (c === firm) dup = true;
      const cw = h.sellers[base + worst][i];
      if (c < 0 || !f.alive[c]) worst = q;
      else if (cw >= 0 && f.alive[cw] && f.priceG[c] > f.priceG[cw]) worst = q;
    }
    if (!dup) h.sellers[base + worst][i] = firm;
  }
}

/** Người thất nghiệp mở hộ kinh doanh một người. */
export function startSolo(w: World, eng: Engine, hh: number): void {
  const h = H(w);
  const s = st(w);
  const sec = R(w, STREAM.fallback, hh) < 0.35 ? AGRI : SERVICES;
  const a = eng.param(w, 'firm.aL') * eng.param(w, 'hkd.soloProductivity');
  const price = s.pSeg[0][sec] > 0 ? s.pSeg[0][sec] * 0.95 : s.pSector[sec] * 0.95;
  const biz = addRow(w.tables.firm, {
    bank: h.bank[hh],
    sector: sec,
    formal: 0,
    owner: hh,
    solo: 1,
    born: w.meta.tick,
    n: 0,
    nTarget: 1,
    wage: 0,
    price,
    priceG: price,
    pricePrev: price,
    markup: 0,
    salesE: a * 0.7,
    cell: w.tables.firm.n,
  });
  h.ownBiz[hh] = biz;
  // chủ là người lao động duy nhất
  const f = F(w);
  f.workers[biz] = 1;
  h.employer[hh] = biz;
  h.wage[hh] = 0;
  h.uMonths[hh] = 0;
  accumulate(w, 'unemp', 'u_self_employed', -1);
  announce(w, eng, biz);
}

/**
 * Hộ kinh doanh mới mở vì thấy có lãi [TTK]: khi chủ hộ kinh doanh đang kiếm được nhiều hơn hẳn người làm thuê,
 * một số người làm thuê có vốn ra mở riêng. Không có kênh này thì hộ kinh doanh cũ hưởng lãi cao mãi mà không ai cạnh tranh.
 */
function hkdEntry(w: World, eng: Engine): void {
  const h = H(w);
  const s = st(w);
  let f = F(w);
  let draw = 0;
  let nOwners = 0;
  const count = new Int32Array(NSECTOR);
  const margin = new Float64Array(NSECTOR);
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || f.formal[i] || f.solo[i]) continue;
    draw += f.revenue[i] - f.wagesPaid[i];
    nOwners++;
    count[f.sector[i]]++;
    margin[f.sector[i]] += f.markup[i];
  }
  if (!nOwners || s.wageInf <= 0) return;
  const ratio = draw / nOwners / s.wageInf; // thu nhập chủ so với lương người làm thuê
  const pull = Math.max(0, Math.min(2, (ratio - 1.5) / 1.5));
  const expected = eng.param(w, 'hkd.entryRate') * (h.n / 1000) * pull;
  let n = Math.floor(expected);
  if (R(w, STREAM.entry, 50) < expected - n) n++;
  for (let e = 0; e < n; e++) {
    // người mở: người làm thuê hoặc thất nghiệp có đủ vốn cho hai tháng lương một người làm
    let who = -1;
    for (let k = 0; k < 20 && who < 0; k++) {
      const c = Math.floor(R(w, STREAM.founder, 900 + e, k) * h.n);
      if (h.ownBiz[c] >= 0 || h.employer[c] === PUBLIC) continue;
      if (h.cash[c] + h.dep[c] >= 6 * s.wageInf) who = c;
    }
    if (who < 0) continue;
    // chọn ngành đang có biên lãi cao nhất
    let sec = 0;
    for (let k = 1; k < NSECTOR; k++) if (count[k] > 0 && margin[k] / count[k] > (count[sec] > 0 ? margin[sec] / count[sec] : -1)) sec = k;
    const a = eng.param(w, 'firm.aL') * eng.param(w, 'hkd.productivity');
    const price = s.pSeg[0][sec] > 0 ? s.pSeg[0][sec] : s.pSector[sec];
    const wage = Math.round(s.wageInf);
    const biz = addRow(w.tables.firm, { bank: h.bank[who], sector: sec, formal: 0, owner: who, born: w.meta.tick, nTarget: 1, wage, price, priceG: price, pricePrev: price, markup: Math.max(0, price / (wage / a) - 1), salesE: a, cell: w.tables.firm.n });
    f = F(w);
    if (h.employer[who] === UNEMPLOYED) accumulate(w, 'unemp', 'u_self_employed', -1);
    else if (h.employer[who] >= 0) f.workers[h.employer[who]]--;
    h.employer[who] = biz;
    h.ownBiz[who] = biz;
    h.wage[who] = 0;
    h.uMonths[who] = 0;
    f.workers[biz] = 1;
    payFlex(w, hhRef(who), firmRef(biz), 3 * wage, MED_CASH, K_EQUITY);
    announce(w, eng, biz);
    s.m.entriesHkd++;
  }
}

/** Doanh nghiệp chính thức mới: một nhóm hộ khá giả cùng bỏ vốn (gd1 mục 5.7; sai-khac.md S6). */
function entry(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  const base = eng.param(w, 'firm.entryRate');
  const minCap = (eng.param(w, 'firm.entryCapital') * s.cpi) / 100; // tính theo giá hiện hành
  const rBar = eng.param(w, 'firm.rBar');
  const uBar = eng.param(w, 'firm.uBar');
  const share = eng.param(w, 'firm.founderShare');
  const nFounders = Math.max(1, Math.round(eng.param(w, 'firm.founders')));
  const eqMin = eng.param(w, 'firm.founderEquityMin');
  const pool = Math.max(nFounders, Math.round(eng.param(w, 'firm.founderPool')));
  const pK = s.pK;
  const profit = new Float64Array(NSECTOR);
  const capital = new Float64Array(NSECTOR);
  const used = new Float64Array(NSECTOR);
  const kTotal = new Float64Array(NSECTOR);
  for (let i = 0; i < f.n; i++)
    if (f.alive[i] && f.formal[i]) {
      profit[f.sector[i]] += f.ocf[i];
      capital[f.sector[i]] += f.capValue[i];
      used[f.sector[i]] += f.util[i] * f.K[i];
      kTotal[f.sector[i]] += f.K[i];
    }
  for (let sec = 0; sec < NSECTOR; sec++) {
    // Số doanh nghiệp mới kỳ vọng: theo quy mô dân số, nhân với sức hút của ngành.
    // Ngành lãi trên mức bình thường thì hút người vào; ngành đang thừa máy thì không ai vào. [TTK]
    const r = capital[sec] > 0 ? profit[sec] / capital[sec] : rBar;
    const u = kTotal[sec] > 0 ? used[sec] / kTotal[sec] : 1;
    const pull = Math.max(0, Math.min(2, r / rBar)) * Math.max(0, Math.min(1.5, (u - 0.6) / (uBar - 0.6)));
    const expected = (base * (h.n / 1000) * pull) / NSECTOR;
    let n = Math.floor(expected);
    if (R(w, STREAM.entry, sec) < expected - n) n++;
    // vốn cần: máy cho hai người và sáu tháng lương; phần máy còn thiếu doanh nghiệp tự vay
    const wage = Math.max(s.wageAvg, minWageOf(w, eng, 1));
    const needCap = (kappaOf(w, eng, sec) * 2 * pK) / uBar + 6 * wage;
    for (let e = 0; e < n; e++) {
      // người sáng lập và người góp vốn: những hộ nhiều tiền gửi nhất trong `firm.founderPool` hộ lấy ngẫu nhiên
      const picks: number[] = [];
      for (let k = 0; k < pool; k++) {
        const c = Math.floor(R(w, STREAM.founder, sec * 100 + e, k) * h.n);
        if (!picks.includes(c)) picks.push(c);
      }
      picks.sort((a, b) => h.dep[b] - h.dep[a] || a - b);
      const founders = picks.slice(0, nFounders);
      let pooled = 0;
      for (const o of founders) pooled += Math.floor(h.dep[o] * share);
      // nhóm sáng lập phải tự có một phần vốn cần; phần còn lại vay ngân hàng
      if ((globalThis as any).__dbgEntry) console.log('ENTRY t', w.meta.tick, 'sec', sec, 'pull', pull.toFixed(2), 'r/rBar', (r / rBar).toFixed(2), 'u', u.toFixed(2), 'pooled', (pooled / 1e6).toFixed(0), 'need', (needCap / 1e6).toFixed(0));
      if (pooled < Math.max(minCap, eqMin * needCap)) continue;
      const scale = Math.min(1, needCap / pooled);
      const bank = h.bank[founders[0]];
      const pG = s.pSeg[1][sec] > 0 ? s.pSeg[1][sec] : s.pSector[sec];
      const pNet = pG / (1 + taxWedge(w, eng, sec, true));
      const firm = addRow(w.tables.firm, {
        bank,
        sector: sec,
        formal: 1,
        zone: 1 + Math.floor(R(w, STREAM.entry, sec, 7 + e) * 4),
        born: w.meta.tick,
        wage,
        price: pNet,
        priceG: pG,
        pricePrev: pG,
        markup: eng.param(w, 'firm.markup0'),
        salesE: eng.param(w, 'firm.aL') * 2,
        nTarget: 2,
        ocf: 0,
        lastRate: 0.08,
        cell: w.tables.firm.n,
      });
      let put = 0;
      const paidBy: number[] = [];
      for (const o of founders) {
        const paid = transfer(w, hhRef(o), firmRef(firm), Math.floor(h.dep[o] * share * scale), MED_DEP, K_EQUITY);
        paidBy.push(paid);
        put += paid;
      }
      for (let k = 0; k < founders.length; k++) if (paidBy[k] > 0) addRow(w.tables.share, { kind: 0, entity: firm, owner: founders[k], frac: paidBy[k] / put });
      announce(w, eng, firm);
      s.m.entries++;
    }
  }
}
