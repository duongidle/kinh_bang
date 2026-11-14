// Chính phủ và NHNN: lương công chức, mua hàng, trợ cấp, trái phiếu, in tiền, khoá sổ tháng.
// Quy tắc và nguồn: docs/design/gd1.md mục 8, 9, 10.

import type { Engine } from '../../core/engine';
import { f64, i32, u8 } from '../../core/table';
import { BANK, CB, CB_REF, GOV_REF, ref, type World } from '../../core/world';
import { TX_KINDS, tx } from '../../ledger/kinds';
import { issueBond, MED_DEP, payCoupon, redeemBond, transfer } from '../../ledger/ledger';
import { sellGoods } from './firms';
import { B, F, firmRef, H, hhRef, INDUSTRY, minWageOf, NSECTOR, pitOnWage, PUBLIC, R, SERVICES, st, STREAM, taxWedge, UNEMPLOYED } from './schema';
import type { Gd1State } from './schema';

const K_WAGE_PUB = tx('wage_public');
const K_PIT = tx('pit');
const K_GOV_BUY = tx('gov_purchase');
const K_TRANSFER = tx('transfer_social');
const K_CB_PROFIT = tx('cb_profit');

/** Dấu người ban hành của việc tự chỉnh ngưỡng theo lạm phát; gov.revenueUse dùng nó để không coi đó là đổi thuế. */
export const INDEXATION_BY = 'Điều chỉnh theo lạm phát (tự động)';

/** Luật thuế: đổi một trong các luật này (ngoài tự chỉnh theo lạm phát) hoặc đổi tax.compliance thì gov.revenueUse kích hoạt. */
const isTaxLaw = (id: string): boolean => id.startsWith('vat.') || id.startsWith('pit.') || id.startsWith('cit.') || id === 'hkd.threshold' || id === 'tax.indirect.other';

const TAX_THRESHOLDS = ['pit.deduction.self', 'pit.deduction.dependent', 'pit.limit.1', 'pit.limit.2', 'pit.limit.3', 'pit.limit.4', 'hkd.threshold', 'cit.limit.small', 'cit.limit.mid'];

// =====================================================================
// Pha policy
// =====================================================================
export function policy(w: World, eng: Engine): void {
  const s = st(w);
  // lương công chức bám lương bình quân khu vực chính thức, không dưới lương tối thiểu vùng II
  s.publicWage = Math.round(Math.max(minWageOf(w, eng, 2), eng.law(w, 'gov.wage.premium') * s.wageRef));
  s.purchaseBudget = eng.law(w, 'gov.purchase.share') * s.gdpEma;

  // Điều chỉnh các ngưỡng tính bằng đồng theo lạm phát (bật tắt bằng tham số gov.indexation).
  // Ngưỡng thuế: khi CPI đã tăng quá 20% kể từ lần chỉnh trước (Luật Thuế TNCN có điều khoản này cho mức giảm trừ;
  // mô hình áp chung cho các ngưỡng thuế khác: đơn giản hoá). Lương tối thiểu vùng: mỗi tháng 1 theo lạm phát năm trước.
  if (eng.param(w, 'gov.indexation') >= 0.5 && w.meta.tick > 0) {
    const by = INDEXATION_BY;
    const ratio = s.cpi / s.cpiTaxBase;
    if (ratio > 1.2) {
      for (const id of TAX_THRESHOLDS) eng.setLaw(w, id, Math.round((eng.law(w, id) * ratio) / 1000) * 1000, by);
      s.cpiTaxBase = s.cpi;
    }
    if ((w.meta.startMonth - 1 + w.meta.tick) % 12 === 0) {
      const pi = yoyInflation(s);
      if (pi > 0) for (let z = 1; z <= 4; z++) eng.setLaw(w, `minwage.zone.${z}`, Math.round((eng.law(w, `minwage.zone.${z}`) * (1 + pi)) / 1000) * 1000, by);
    }
  }

  revenueUse(w, eng, s);

  // Bộ Tài chính tự động (khi người chơi không giữ vai): dự toán hằng năm.
  // Mỗi tháng 1 chỉnh mức mua hàng để bội chi 12 tháng qua tiến về mục tiêu. [TTK]
  // Lý do phải có: chi theo tỷ lệ GDP cố định thì không có gì neo cân đối ngân sách, nợ hoặc thặng dư dồn mãi.
  if (eng.param(w, 'gov.autopilot') >= 0.5 && (w.meta.startMonth - 1 + w.meta.tick) % 12 === 0 && s.balHist.length >= 12) {
    // nhìn 36 tháng gần nhất và chỉnh chậm (tối đa 0,3 điểm % GDP mỗi năm) để không chạy theo chu kỳ
    let bal = 0;
    let gdp = 0;
    for (let k = 0; k < s.balHist.length; k++) {
      bal += s.balHist[k];
      gdp += s.gdpHist[k];
    }
    if (gdp > 0) {
      const gap = bal / gdp + eng.law(w, 'gov.deficit.target'); // dương: bội chi nhỏ hơn mục tiêu, còn dư địa chi
      const cur = eng.law(w, 'gov.purchase.share');
      const next = Math.round(Math.max(0, Math.min(0.3, cur + Math.max(-0.003, Math.min(0.003, 0.25 * gap)))) * 1000) / 1000;
      if (next !== cur) eng.setLaw(w, 'gov.purchase.share', next, 'Bộ Tài chính tự động');
    }
  }

  // NHNN tự động (khi người chơi không giữ vai): quy tắc phản ứng với lạm phát, xét mỗi quý
  if (eng.param(w, 'cb.autopilot') >= 0.5 && w.meta.tick % 3 === 0 && w.meta.tick >= 12) {
    const target = eng.law(w, 'cb.inflation.target');
    const pi = yoyInflation(s);
    const neutral = target + 0.0;
    const want = Math.max(0.005, Math.min(0.3, neutral + eng.param(w, 'cb.taylorPi') * (pi - target)));
    const cur = eng.law(w, 'cb.rate.refinancing');
    const next = Math.round((cur + eng.param(w, 'cb.taylorSpeed') * (want - cur)) * 400) / 400;
    if (next !== cur) eng.setLaw(w, 'cb.rate.refinancing', next, 'NHNN tự động');
  }
}

// =====================================================================
// Quy tắc gov.revenueUse (sai-khac.md D14): tiền thuế thu thêm đi đâu
// =====================================================================
const K_VAT = tx('vat');
const K_PIT_T = tx('pit');
const K_CIT = tx('cit');
const K_HKD = tx('hkd_tax');
const K_EXCISE = tx('excise');

/** Thu thuế tháng này theo sổ cái: GTGT, TNCN, TNDN, thuế hộ kinh doanh, thuế gián thu khác (không gồm phí và đất). */
function taxRevenueNow(w: World): number {
  const v = w.ledger.volume;
  return v[K_VAT] + v[K_PIT_T] + v[K_CIT] + v[K_HKD] + v[K_EXCISE];
}

function sumLast(a: number[], n: number): number {
  let x = 0;
  for (let k = Math.max(0, a.length - n); k < a.length; k++) x += a[k];
  return x;
}

/**
 * Đặt hệ số chi lại s.respend cho tháng này, rồi nhân vào lương công chức và ngân sách mua hàng.
 * Hai mức trợ cấp nhân ở payPublic và bondAuction. Không đổi giá trị luật nào.
 */
function revenueUse(w: World, eng: Engine, s: Gd1State): void {
  const variant = eng.variant(w, 'gov.revenueUse');
  // Phát hiện kích hoạt: mục override thuế mới (không phải tự chỉnh theo lạm phát, không phải điều kiện ban đầu) hoặc đổi tax.compliance.
  let ovCount = 0;
  for (const id in w.lawOverrides) {
    if (!isTaxLaw(id)) continue;
    for (const o of w.lawOverrides[id]) if (o.fromTick > 0 && o.by !== INDEXATION_BY) ovCount++;
  }
  const comp = eng.variant(w, 'tax.compliance');
  let triggered = false;
  if (w.meta.tick > 0 && (ovCount > s.taxOvSeen || comp !== s.compSeen)) triggered = true;
  s.taxOvSeen = ovCount;
  s.compSeen = comp;
  if (triggered && s.revBase < 0 && s.taxHist.length >= 3) {
    const g = sumLast(s.gdpHist, 12);
    if (g > 0) {
      s.revBase = sumLast(s.taxHist, 12) / g;
      if (variant === 'base') eng.event(w, { type: 'policy', id: 'gov.revenueUse', label: 'Chính phủ bắt đầu chi lại phần thu thêm từ thuế (hụt thu thì vay bù)', by: 'Mô hình' });
      else if (variant === 'balanced') eng.event(w, { type: 'policy', id: 'gov.revenueUse', label: 'Chính phủ bắt đầu chi lại phần thu thêm từ thuế (hụt thu thì cắt chi)', by: 'Mô hình' });
    }
  }
  s.respend = 1;
  s.respendAmt = 0;
  if (s.revBase < 0 || variant === 'keep') return;

  const h = H(w);
  const dole = eng.law(w, 'gov.transfer.unemployed') * s.wageRef;
  let nUnemp = 0;
  if (dole > 0) for (let i = 0; i < h.n; i++) if (h.employer[i] === UNEMPLOYED) nUnemp++;
  const spend = s.nPublic * s.publicWage + s.purchaseBudget + h.n * eng.law(w, 'gov.transfer.universal') + dole * nUnemp;
  const g = sumLast(s.gdpHist, 12);
  if (!(g > 0)) return;
  const extra = (sumLast(s.taxHist, 12) / g - s.revBase) * s.gdpEma;
  const x = spend > 0 ? extra / spend : 0;
  s.respend = variant === 'balanced' ? Math.max(0, 1 + x) : 1 + Math.max(0, x);
  if (s.respend === 1) return;
  s.respendAmt = (s.respend - 1) * spend;
  s.publicWage = Math.max(minWageOf(w, eng, 2), Math.round(s.publicWage * s.respend));
  s.purchaseBudget = Math.round(s.purchaseBudget * s.respend);
}

export function yoyInflation(s: Gd1State): number {
  const hst = s.cpiHist;
  if (hst.length < 2) return 0;
  const back = Math.min(12, hst.length - 1);
  return Math.pow(hst[hst.length - 1] / hst[hst.length - 1 - back], 12 / back) - 1;
}

// =====================================================================
// Pha pay: lương công chức và trợ cấp
// =====================================================================
export function payPublic(w: World, eng: Engine): void {
  const h = H(w);
  const s = st(w);
  const wage = s.publicWage;
  let dole = eng.law(w, 'gov.transfer.unemployed') * s.wageRef;
  let universal = eng.law(w, 'gov.transfer.universal');
  if (s.respend !== 1) {
    dole = Math.round(dole * s.respend);
    universal = Math.round(universal * s.respend);
  }

  // Kho bạc không đủ cho lương và trợ cấp tháng này: nếu được phép thì NHNN mua trái phiếu ngay.
  let need = s.nPublic * wage + h.n * universal;
  if (dole > 0) for (let i = 0; i < h.n; i++) if (h.employer[i] === UNEMPLOYED) need += dole;
  const tga = f64(w.tables.gov, 'tga')[0];
  if (tga < need && eng.law(w, 'cb.monetize') >= 0.5) {
    issueBond(w, CB_REF, need - tga, eng.law(w, 'cb.rate.refinancing'), 60);
    s.m.bondSoldCb += need - tga;
  }

  let arrears = 0;
  for (let i = 0; i < h.n; i++) {
    if (h.employer[i] === PUBLIC) {
      const paid = transfer(w, GOV_REF, hhRef(i), wage, MED_DEP, K_WAGE_PUB, 0, true);
      arrears += wage - paid;
      h.wage[i] = wage;
      h.grossWage[i] = paid;
      s.m.wagesPublic += paid;
      s.m.govSpend += paid;
      const tax = paid > eng.law(w, 'pit.deduction.self') ? pitOnWage(w, eng, paid, h.dependents[i]) : 0;
      const t = tax > 0 ? transfer(w, hhRef(i), GOV_REF, tax, MED_DEP, K_PIT) : 0;
      s.m.taxPit += t;
      h.pitPaid[i] = t;
      h.income[i] += paid - t;
    } else if (h.employer[i] === UNEMPLOYED && dole > 0) {
      const paid = transfer(w, GOV_REF, hhRef(i), dole, MED_DEP, K_TRANSFER, 0, true);
      h.income[i] += paid;
      s.m.govSpend += paid;
    }
    if (universal > 0) {
      const paid = transfer(w, GOV_REF, hhRef(i), universal, MED_DEP, K_TRANSFER, 0, true);
      h.income[i] += paid;
      s.m.govSpend += paid;
    }
  }
  if (arrears > 0 && s.govArrears === 0) eng.event(w, { type: 'shock', id: 'gov.arrears', label: 'Kho bạc cạn, nợ lương công chức', by: 'Mô hình' });
  s.govArrears = arrears;
}

// =====================================================================
// Pha goods (trước hộ gia đình): Chính phủ mua hàng hoá dịch vụ
// =====================================================================
export const GOV_MIX = [0.1, 0.4, 0.5]; // nông nghiệp, công nghiệp, dịch vụ

export function govPurchases(w: World, eng: Engine): void {
  const f = F(w);
  const s = st(w);
  const tga = f64(w.tables.gov, 'tga');
  const budget = Math.min(s.purchaseBudget, Math.max(0, tga[0]));
  if (budget < s.purchaseBudget) s.m.purchaseCut += s.purchaseBudget - budget;
  if (budget <= 0) return;
  const bySector: number[][] = [[], [], []];
  for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i] && f.inv[i] > 0.5) bySector[f.sector[i]].push(i);
  for (let sec = 0; sec < NSECTOR; sec++) {
    let left = budget * GOV_MIX[sec];
    const list = bySector[sec];
    const vat = taxWedge(w, eng, sec, true);
    for (let k = 0; k < 12 && left > 10_000 && list.length; k++) {
      // xem 5 người bán, mua ở nơi rẻ nhất còn hàng
      let best = -1;
      for (let j = 0; j < 5; j++) {
        const c = list[Math.floor(R(w, STREAM.govBuy, sec, k * 8 + j) * list.length)];
        if (f.inv[c] > 0.5 && (best < 0 || f.priceG[c] < f.priceG[best])) best = c;
      }
      if (best < 0) break;
      const q = Math.min(f.inv[best], left / f.priceG[best]);
      const paid = transfer(w, GOV_REF, firmRef(best), q * f.priceG[best], MED_DEP, K_GOV_BUY, 0, true);
      if (paid <= 0) break;
      sellGoods(f, best, paid / f.priceG[best], paid, vat);
      left -= paid;
      s.m.govNom += paid;
      s.m.govSpend += paid;
    }
  }
}

// =====================================================================
// Pha debt: lãi và gốc trái phiếu
// =====================================================================
export function bondService(w: World, eng: Engine): void {
  const Bd = w.tables.bond;
  const al = u8(Bd, 'alive');
  const mat = i32(Bd, 'maturity');
  const holder = i32(Bd, 'holder');
  const s = st(w);
  const tga = f64(w.tables.gov, 'tga');
  for (let r = 0; r < Bd.n; r++) {
    if (!al[r]) continue;
    const c = payCoupon(w, r);
    if (holder[r] >>> 24 !== CB) s.m.govSpend += c;
    if (mat[r] <= w.meta.tick) {
      const face = f64(Bd, 'face')[r];
      if (tga[0] < face) {
        // không đủ tiền trả gốc: đảo nợ với chính người đang giữ (đơn giản hoá)
        mat[r] = w.meta.tick + 60;
        f64(Bd, 'rate')[r] = eng.law(w, 'cb.rate.refinancing') + eng.law(w, 'gov.bond.spread');
      } else redeemBond(w, r);
    }
  }
}

// =====================================================================
// Pha banking (sau ngân hàng): đấu thầu trái phiếu, NHNN nộp lợi nhuận
// =====================================================================
export function bondAuction(w: World, eng: Engine): void {
  const b = B(w);
  const s = st(w);
  const tga = f64(w.tables.gov, 'tga')[0];
  const rr = eng.law(w, 'cb.reserve.ratio');
  const rRef = eng.law(w, 'cb.rate.refinancing');
  const spread = eng.law(w, 'gov.bond.spread');

  // mục tiêu: kho bạc đủ cho chi tiêu tháng tới
  const h = H(w);
  const universal = eng.law(w, 'gov.transfer.universal');
  let outlays = s.nPublic * s.publicWage + s.purchaseBudget + h.n * (s.respend !== 1 ? Math.round(universal * s.respend) : universal);
  const Bd = w.tables.bond;
  for (let r = 0; r < Bd.n; r++) {
    if (!u8(Bd, 'alive')[r]) continue;
    outlays += (f64(Bd, 'face')[r] * f64(Bd, 'rate')[r]) / 12;
    if (i32(Bd, 'maturity')[r] <= w.meta.tick + 1) outlays += f64(Bd, 'face')[r];
  }
  let need = Math.floor(outlays * 1.1 - tga);
  if (need > 1_000_000) {
    // ngân hàng mua bằng dự trữ dư nếu lợi suất không thấp hơn lãi suất tái cấp vốn
    if (spread >= 0) {
      const excess = new Float64Array(b.n);
      let total = 0;
      for (let k = 0; k < b.n; k++) {
        if (!b.alive[k]) continue;
        excess[k] = Math.max(0, b.reserves[k] - rr * b.depLiab[k] * 1.1 - b.cbAdv[k]);
        total += excess[k];
      }
      const sell = Math.min(need, total);
      if (sell > 1_000_000) {
        for (let k = 0; k < b.n; k++) {
          const amt = Math.floor((sell * excess[k]) / total);
          if (amt < 100_000) continue;
          issueBond(w, ref(BANK, k), amt, rRef + spread, 60);
          need -= amt;
          s.m.bondSoldBanks += amt;
        }
      }
    }
    // phần bán không hết: NHNN mua nếu người chơi cho phép (in tiền); không thì tháng tới phải cắt mua hàng
    if (need > 1_000_000 && eng.law(w, 'cb.monetize') >= 0.5) {
      issueBond(w, CB_REF, need, rRef, 60);
      s.m.bondSoldCb += need;
    }
  }

  // tháng 12: NHNN nộp lợi nhuận về ngân sách
  const month = (w.meta.startMonth - 1 + w.meta.tick) % 12;
  const eq = f64(w.tables.cb, 'equity')[0];
  if (month === 11 && eq > 0) transfer(w, CB_REF, GOV_REF, eq, MED_DEP, K_CB_PROFIT);
}

// =====================================================================
// Pha close: giá bình quân, CPI, niềm tin vào mục tiêu lạm phát, các mức tham chiếu
// =====================================================================
export function closeMonth(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const s = st(w);

  // giá bình quân theo ngành, trọng số là lượng bán
  const sumPQ = [0, 0, 0];
  const sumQ = [0, 0, 0];
  const sumP = [0, 0, 0];
  const cnt = [0, 0, 0];
  let wSum = 0;
  let wN = 0;
  let wAllSum = 0;
  let wAllN = 0;
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    const sec = f.sector[i];
    sumPQ[sec] += f.priceG[i] * f.sales[i];
    sumQ[sec] += f.sales[i];
    sumP[sec] += f.priceG[i];
    cnt[sec]++;
    const hired = f.formal[i] ? f.workers[i] : Math.max(0, f.workers[i] - 1);
    if (f.formal[i]) {
      wSum += f.wage[i] * hired;
      wN += hired;
    }
    if (!f.formal[i]) {
      wAllSum += f.wage[i] * hired;
      wAllN += hired;
    }
  }
  s.pSectorPrev = s.pSector.slice();
  for (let k = 0; k < NSECTOR; k++) {
    if (sumQ[k] > 0) s.pSector[k] = sumPQ[k] / sumQ[k];
    else if (cnt[k] > 0) s.pSector[k] = sumP[k] / cnt[k];
  }
  // giá bình quân theo phân khúc, và giá máy chưa thuế (hàng công nghiệp của doanh nghiệp)
  {
    const pq = [0, 0, 0, 0, 0, 0];
    const qq = [0, 0, 0, 0, 0, 0];
    let kq = 0;
    let kpq = 0;
    for (let i = 0; i < f.n; i++) {
      if (!f.alive[i]) continue;
      const g = (f.formal[i] ? 3 : 0) + f.sector[i];
      const wgt = Math.max(f.sales[i], 1e-6);
      pq[g] += f.priceG[i] * wgt;
      qq[g] += wgt;
      if (f.formal[i] && f.sector[i] === INDUSTRY) {
        kpq += f.price[i] * wgt;
        kq += wgt;
      }
    }
    for (let g = 0; g < 6; g++) if (qq[g] > 0) s.pSeg[g < 3 ? 0 : 1][g % 3] = pq[g] / qq[g];
    if (kq > 0) s.pK = kpq / kq;
  }
  // CPI: chỉ số Laspeyres nối chuỗi, rổ cập nhật mỗi năm
  let num = 0;
  let den = 0;
  for (let k = 0; k < NSECTOR; k++) {
    num += s.cpiBase[k] * s.pSector[k];
    den += s.cpiBase[k] * s.pSectorPrev[k];
  }
  s.cpiPrev = s.cpi;
  if (den > 0 && w.meta.tick > 0) s.cpi *= num / den;
  s.cpiHist.push(s.cpi);
  if (s.cpiHist.length > 14) s.cpiHist.shift();
  s.pHist.push(s.pSector.slice());
  if (s.pHist.length > 5) s.pHist.shift();
  const month = (w.meta.startMonth - 1 + w.meta.tick) % 12;
  s.basketAcc[0] += s.m.consReal[0];
  s.basketAcc[1] += s.m.consReal[1];
  s.basketAcc[2] += s.m.consReal[2];
  if (month === 11) {
    const tot = s.basketAcc[0] + s.basketAcc[1] + s.basketAcc[2];
    if (tot > 0) s.cpiBase = s.basketAcc.map((x) => x / (12 * h.n));
    s.basketAcc = [0, 0, 0];
  }

  // niềm tin vào mục tiêu lạm phát (gd1 mục 10)
  if (w.meta.tick >= 6) {
    const gap = Math.abs(yoyInflation(s) - eng.law(w, 'cb.inflation.target'));
    const band = eng.param(w, 'exp.trustBand');
    if (gap <= band) s.trust += eng.param(w, 'exp.trustGain') * (1 - s.trust);
    else s.trust -= eng.param(w, 'exp.trustLoss') * Math.min(3, gap / band) * s.trust;
    s.trust = Math.max(0, Math.min(1, s.trust));
  }

  if (wN > 0) s.wageAvg = wSum / wN;
  if (wAllN > 0) s.wageInf = wAllSum / wAllN;
  s.wageAvgAll = wN + wAllN > 0 ? (wSum + wAllSum) / (wN + wAllN) : s.wageAvg;
  if (month === 11 || w.meta.tick === 0) s.wageRef = s.wageAvg; // mức tham chiếu lương công chức xét lại mỗi năm
  let u = 0;
  let below = 0;
  for (let i = 0; i < h.n; i++) if (h.employer[i] === UNEMPLOYED) u++;
  for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i] && f.workers[i] > 0 && f.wage[i] < minWageOf(w, eng, f.zone[i]) - 0.5) below++;
  s.m.belowMin = below;
  s.unemp = u / h.n;
  // tồn kho toàn nền kinh tế và GDP thực (giá gốc; dịch vụ tính theo lượng bán được)
  let invTotal = 0;
  for (let i = 0; i < f.n; i++) invTotal += f.invValue[i];
  s.invTotalPrev = s.invTotal;
  s.invTotal = invTotal;
  s.salesReal = sumQ;
  s.gdpReal = s.p0[0] * s.m.outputReal[0] + s.p0[1] * s.m.outputReal[1] + s.p0[2] * sumQ[SERVICES] + (s.publicWage > 0 ? (s.m.wagesPublic / s.publicWage) * s.publicWage0 : 0);
  const gdp = gdpNominal(s);
  // cân đối ngân sách tháng này, lấy từ sổ cái: mọi dòng thu trừ mọi dòng chi (không tính vay và trả gốc)
  {
    const L = w.ledger;
    let bal = 0;
    for (let k = 0; k < L.nkind; k++) if (TX_KINDS[k].flow) bal += L.flow[3 * L.nkind + k];
    s.balHist.push(bal);
    s.gdpHist.push(gdp);
    s.taxHist.push(taxRevenueNow(w));
    if (s.balHist.length > 36) {
      s.balHist.shift();
      s.gdpHist.shift();
      s.taxHist.shift();
    }
  }
  s.gdpEma += 0.25 * (gdp - s.gdpEma);
}

/** GDP theo chi tiêu: tiêu dùng + Chính phủ (mua hàng, lương công chức) + đầu tư + thay đổi tồn kho. */
export function gdpNominal(s: Gd1State): number {
  const m = s.m;
  return m.consNom[0] + m.consNom[1] + m.consNom[2] + m.govNom + m.wagesPublic + m.invNom + (s.invTotal - s.invTotalPrev);
}
