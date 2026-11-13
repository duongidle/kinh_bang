// Doanh nghiệp và hộ kinh doanh: kế hoạch, lương, giá, đầu tư, sản xuất, lãi lỗ, phá sản, gia nhập.
// Quy tắc và nguồn: docs/design/gd1.md mục 5 và 6.

import { accumulate, recordDecision } from '../../causal/causal';
import type { Engine } from '../../core/engine';
import { addRow, f64, i32, u8 } from '../../core/table';
import { GOV_REF, type World } from '../../core/world';
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
  payFlex,
  pitOnWage,
  PUBLIC,
  R,
  SECTOR_KEY,
  SERVICES,
  shuffled,
  st,
  STREAM,
  UNEMPLOYED,
  vatRate,
} from './schema';

const K_WAGE = tx('wage');
const K_INVEST = tx('investment');
const K_DIV = tx('dividend');
const K_PIT = tx('pit');
const K_CIT = tx('cit');
const K_VAT = tx('vat');
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
  const delta = eng.param(w, 'firm.depreciation');
  const g1 = eng.param(w, 'firm.gamma1');
  const g2 = eng.param(w, 'firm.gamma2');
  const uBar = eng.param(w, 'firm.uBar');
  const rBar = eng.param(w, 'firm.rBar');
  const wageIndex = eng.param(w, 'firm.wageIndex');
  const flexWage = eng.variant(w, 'firm.wage') === 'flex';
  const month = (w.meta.startMonth - 1 + w.meta.tick) % 12;
  const target = eng.law(w, 'cb.inflation.target');
  const piE = s.trust * target + (1 - s.trust) * averageAdaptive(w);
  const useExpect = eng.variant(w, 'exp.inflation') !== 'off';
  const piExp = useExpect ? (eng.variant(w, 'exp.inflation') === 'anchored' ? target : piE) : 0;

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
    const yStar = Math.max(0, f.salesE[i] * (1 + nu) - stock);
    let nT = Math.ceil(yStar / aL - 1e-9);
    nT = Math.max(1, Math.min(nT, Math.floor(capW + 1e-9)));
    if (!f.formal[i]) nT = Math.max(1, nT);
    f.nTarget[i] = nT;

    // --- lương (gd1 mục 5.3) ---
    const w0 = f.wage[i];
    let w1 = w0;
    const parts: Array<{ reason: string; amount: number }> = [];
    if (f.solo[i]) {
      // người tự làm không trả lương cho ai
    } else if (f.unfilled[i] > 0 && f.workers[i] < nT) {
      const up = w1 * foldedStep(w, eng, STREAM.wage, i) * 2;
      w1 += up;
      parts.push({ reason: 'w_shortage', amount: up });
    } else if (flexWage && f.unfilled[i] === 0 && s.unemp > 0.08) {
      const down = -w1 * foldedStep(w, eng, STREAM.wage, i, 2);
      w1 += down;
      parts.push({ reason: 'w_slack', amount: down });
    }
    if (!f.solo[i] && i % 12 === month && piExp > 0 && f.born[i] < w.meta.tick - 6) {
      const up = w1 * wageIndex * piExp;
      w1 += up;
      parts.push({ reason: 'w_index', amount: up });
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
    const yNorm = Math.max(aL, f.salesE[i]);
    const ucWage = (f.solo[i] ? s.wageInf : f.wage[i]) / aL; // người tự làm tính công mình theo lương phi chính thức
    const ucCap = f.formal[i] ? (delta * f.capValue[i] + (f.debt[i] * f.lastRate[i]) / 12) / yNorm : 0;
    const expectFactor = 1 + piExp / 12;
    const p0 = f.priceG[i];
    const vat = f.formal[i] ? vatRate(w, eng, sec) : 0;
    const mu0 = f.markup[i];
    let mu1 = mu0;
    const tight = sec === SERVICES ? f.sales[i] >= 0.97 * f.output[i] && f.output[i] > 0 : f.inv[i] < nu * f.salesE[i];
    const step = foldedStep(w, eng, STREAM.markup, i);
    if (w.meta.tick > 0) mu1 = tight ? mu0 * (1 + step) + step * 0.2 : mu0 * (1 - step);
    mu1 = Math.max(0, Math.min(3, mu1));
    const ucPrevWage = f.ucWage[i];
    const ucPrevCap = f.ucCap[i];
    const priceNet = (1 + mu1) * (ucWage + ucCap) * expectFactor;
    const pG = Math.max(1, Math.round(priceNet * (1 + vat)));
    if (w.meta.tick > 0 && pG !== p0 && p0 > 0) {
      // Chia mức đổi giá theo lý do: đổi lần lượt từng đầu vào theo thứ tự cố định
      // (lương → chi phí vốn → biên lãi → kỳ vọng → thuế). Thứ tự ghi trong sổ quy tắc.
      const vatPrev = f.price[i] > 0 ? p0 / f.price[i] - 1 : vat;
      const base0 = (1 + mu0) * (ucPrevWage + ucPrevCap);
      const a = (1 + mu0) * (ucWage + ucPrevCap);
      const b = (1 + mu0) * (ucWage + ucCap);
      const c = (1 + mu1) * (ucWage + ucCap);
      const d = c * expectFactor;
      const scale0 = base0 > 0 ? f.price[i] / base0 : 1; // phần kỳ vọng đã nằm trong giá cũ
      const g0 = 1 + vatPrev;
      recordDecision(
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
          { reason: 'p_expect', amount: (d - c * scale0) * g0 },
          { reason: 'p_vat', amount: d * (vat - vatPrev) },
        ],
        f.sales[i],
      );
    }
    f.markup[i] = mu1;
    f.ucWage[i] = ucWage;
    f.ucCap[i] = ucCap;
    f.uc[i] = ucWage + ucCap;
    f.pricePrev[i] = p0;
    f.price[i] = priceNet;
    f.priceG[i] = pG;

    // --- đầu tư (Caiani 3.9) ---
    if (f.formal[i]) {
      const kappa = kappaOf(w, eng, sec);
      const u = capW > 0 ? Math.min(1.2, f.output[i] / (aL * capW)) : 1;
      f.util[i] = u;
      const r = f.capValue[i] > 0 ? f.ocf[i] / f.capValue[i] : rBar;
      f.profitRate[i] = r;
      let g = g1 * ((r - rBar) / rBar) + g2 * ((u - uBar) / uBar);
      g = Math.max(-delta, Math.min(0.04, g));
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
    const yStar = Math.max(0, f.salesE[i] * (1 + eng.param(w, 'firm.nu')) - stock);
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
    // tiền dành cho máy: phần vượt quỹ lương và nghĩa vụ nợ tháng này
    let funds = f.dep[i] - f.workers[i] * f.wage[i] * buffer - f.service[i];
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
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    f.rev12[i] += f.revenue[i] - f.rev12[i] / 12;
    if (f.formal[i]) {
      if (f.vatDue[i] >= 1) {
        const paid = transfer(w, firmRef(i), GOV_REF, f.vatDue[i], MED_DEP, K_VAT, 0, true);
        f.vatDue[i] -= paid;
        s.m.taxVat += paid;
      }
    } else {
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
      const keep = Math.max(0, f.workers[i] - 1) * f.wage[i] * (buffer + 0.5);
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
      const free = f.dep[i] - f.workers[i] * f.wage[i] * buffer - f.service[i];
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

  // --- phá sản doanh nghiệp chính thức (Caiani 3.3) ---
  const loanOverdue = overdueByFirm(w);
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || !f.formal[i]) continue;
    const netWorth = f.dep[i] + f.cash[i] + f.invValue[i] + f.capValue[i] - f.debt[i];
    if (loanOverdue[i] > 0) f.distress[i]++;
    else if (f.distress[i] > 0 && f.wagesPaid[i] >= f.workers[i] * f.wage[i] * 0.999) f.distress[i] = 0;
    // doanh nghiệp không còn người, không còn tiền trả một tháng lương: giải thể
    const idle = f.workers[i] === 0 && f.dep[i] + f.cash[i] < f.wage[i] && w.meta.tick - f.born[i] > 6;
    const bust = f.distress[i] > maxDistress || netWorth < 0 || idle;
    if (!bust) continue;
    if (noBankruptcy) {
      // Biến thể: Nhà nước cứu mọi doanh nghiệp (ràng buộc ngân sách mềm).
      const need = Math.max(0, -netWorth) + f.workers[i] * f.wage[i] * 2 + f.service[i] * 2;
      transfer(w, GOV_REF, firmRef(i), need, MED_DEP, tx('transfer_social'), 0, true);
      f.distress[i] = 0;
      continue;
    }
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
    if (o < 0 || h.cash[o] + h.dep[o] < 4 * s.wageInf || R(w, STREAM.hkdHire, i) > 0.25) continue;
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
    if (h.employer[i] !== UNEMPLOYED) continue;
    h.uMonths[i]++;
    h.resWage[i] = Math.max(foodCost * 1.2, h.resWage[i] * (1 - eng.param(w, 'hh.resWageDecay')));
    if (!useFallback || h.ownBiz[i] >= 0) continue;
    if (h.uMonths[i] >= T && h.cash[i] + h.dep[i] < kMonths * foodCost * 2) startSolo(w, eng, i);
  }

  // --- gia nhập doanh nghiệp chính thức ---
  entry(w, eng);
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
  // 2. thanh lý tồn kho và máy cho doanh nghiệp cùng ngành với giá chiết khấu
  const value = (f.invValue[i] + f.capValue[i]) * (1 - haircut);
  let buyer = -1;
  for (let k = 0; k < f.n; k++)
    if (k !== i && f.alive[k] && f.formal[k] && f.sector[k] === f.sector[i] && f.dep[k] > value * 1.5 && (buyer < 0 || f.dep[k] > f.dep[buyer])) buyer = k;
  if (buyer >= 0 && value >= 1) {
    const paid = transfer(w, firmRef(buyer), firmRef(i), value, MED_DEP, K_LIQ);
    if (paid > 0) {
      f.inv[buyer] += f.inv[i];
      f.invValue[buyer] += f.invValue[i] * (1 - haircut);
      f.K[buyer] += f.K[i];
      f.capValue[buyer] += f.capValue[i] * (1 - haircut);
    }
  }
  // tài sản thực của doanh nghiệp vỡ nợ bị xoá sổ (phần chiết khấu là mất mát thật)
  s.m.dInvValue -= buyer >= 0 ? f.invValue[i] * haircut : f.invValue[i];
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

/** Người thất nghiệp mở hộ kinh doanh một người. */
function startSolo(w: World, eng: Engine, hh: number): void {
  const h = H(w);
  const s = st(w);
  const sec = R(w, STREAM.fallback, hh) < 0.35 ? AGRI : SERVICES;
  const a = eng.param(w, 'firm.aL') * eng.param(w, 'hkd.soloProductivity');
  const price = s.pSector[sec] > 0 ? s.pSector[sec] * 0.95 : 100_000;
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
}

/** Doanh nghiệp chính thức mới: người sáng lập là các hộ giàu, tự bỏ vốn (gd1 mục 5.7). */
function entry(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);
  const base = eng.param(w, 'firm.entryRate');
  const minCap = eng.param(w, 'firm.entryCapital');
  const rBar = eng.param(w, 'firm.rBar');
  const count = new Int32Array(NSECTOR);
  const profit = new Float64Array(NSECTOR);
  const capital = new Float64Array(NSECTOR);
  for (let i = 0; i < f.n; i++)
    if (f.alive[i] && f.formal[i]) {
      count[f.sector[i]]++;
      profit[f.sector[i]] += f.ocf[i];
      capital[f.sector[i]] += f.capValue[i];
    }
  for (let sec = 0; sec < NSECTOR; sec++) {
    const r = capital[sec] > 0 ? profit[sec] / capital[sec] : rBar;
    const expected = base * Math.max(1, count[sec]) * Math.max(0, Math.min(3, r / rBar));
    let n = Math.floor(expected);
    if (R(w, STREAM.entry, sec) < expected - n) n++;
    for (let e = 0; e < n; e++) {
      // chọn người sáng lập: 5 hộ giàu nhất trong 40 hộ lấy ngẫu nhiên
      const picks: number[] = [];
      for (let k = 0; k < 40; k++) {
        const c = Math.floor(R(w, STREAM.founder, sec * 100 + e, k) * h.n);
        if (!picks.includes(c)) picks.push(c);
      }
      picks.sort((a, b) => h.dep[b] - h.dep[a] || a - b);
      const founders = picks.slice(0, 5);
      let pooled = 0;
      for (const o of founders) pooled += Math.floor(h.dep[o] * 0.5);
      if (pooled < minCap) continue;
      const bank = h.bank[founders[0]];
      const wage = Math.max(s.wageAvg, minWageOf(w, eng, 1));
      const pNet = s.pSector[sec] / (1 + vatRate(w, eng, sec));
      const firm = addRow(w.tables.firm, {
        bank,
        sector: sec,
        formal: 1,
        zone: 1 + Math.floor(R(w, STREAM.entry, sec, 7 + e) * 4),
        born: w.meta.tick,
        wage,
        price: pNet,
        priceG: s.pSector[sec],
        pricePrev: s.pSector[sec],
        markup: eng.param(w, 'firm.markup0'),
        salesE: eng.param(w, 'firm.aL') * 2,
        nTarget: 2,
        ocf: 0,
        lastRate: 0.08,
        cell: w.tables.firm.n,
      });
      for (const o of founders) {
        const put = Math.floor(h.dep[o] * 0.5);
        const paid = transfer(w, hhRef(o), firmRef(firm), put, MED_DEP, K_EQUITY);
        addRow(w.tables.share, { kind: 0, entity: firm, owner: o, frac: paid / pooled });
      }
      s.m.entries++;
    }
  }
}
