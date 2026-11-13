// Ngân hàng thương mại: xét duyệt và tạo tiền, thu nợ, lãi tiền gửi, dự trữ, lãi lỗ.
// Quy tắc và nguồn: docs/design/gd1.md mục 7.

import { accumulate, recordDecision } from '../../causal/causal';
import type { Engine } from '../../core/engine';
import { f64, i32, u8 } from '../../core/table';
import { BANK, CB_REF, GOV_REF, ref, type World } from '../../core/world';
import { tx } from '../../ledger/kinds';
import { cbLend, cbRepay, cbTradeBond, createLoan, issueBond, MED_DEP, serviceLoan, transfer } from '../../ledger/ledger';
import { kappaOf, ownersIndex, restructure } from './firms';
import { B, bankEquity, F, firmRef, foldedStep, H, hhRef, INDUSTRY, R, st, STREAM, vatRate } from './schema';

const K_INT_DEP = tx('interest_dep');
const K_INT_ADV = tx('interest_adv');
const K_INT_RES = tx('interest_res');
const K_CIT = tx('cit');
const K_DIV = tx('dividend');
const K_PIT = tx('pit');
const K_RECAP = tx('bank_recap');
const K_OTHER = tx('other');

export function lendingRate(w: World, eng: Engine, bank: number, leverage: number): number {
  const b = B(w);
  return eng.law(w, 'cb.rate.refinancing') + b.margin[bank] + eng.param(w, 'bank.riskPremium') * Math.min(1.5, Math.max(0, leverage));
}

export function depositRate(w: World, eng: Engine): number {
  let r = Math.max(0, eng.law(w, 'cb.rate.refinancing') - eng.param(w, 'bank.depSpread'));
  const cap = eng.law(w, 'cb.deposit.cap');
  if (cap > 0) r = Math.min(r, cap);
  return r;
}

/** Nghĩa vụ trả nợ tháng tới của từng doanh nghiệp (gốc + lãi). */
export function serviceByFirm(w: World): Float64Array {
  const L = w.tables.loan;
  const out = new Float64Array(w.tables.firm.n);
  const br = i32(L, 'borrower');
  const al = u8(L, 'alive');
  const p = f64(L, 'principal');
  const inst = f64(L, 'instalment');
  const rate = f64(L, 'rate');
  for (let r = 0; r < L.n; r++) {
    if (!al[r] || br[r] >>> 24 !== 1) continue;
    out[br[r] & 0xffffff] += Math.min(p[r], inst[r]) + (p[r] * rate[r]) / 12;
  }
  return out;
}

// =====================================================================
// Pha credit
// =====================================================================
export function creditMarket(w: World, eng: Engine): void {
  const f = F(w);
  const b = B(w);
  const s = st(w);
  const carMin = eng.law(w, 'bank.car.min');
  const roomOn = eng.law(w, 'cb.room.enabled') >= 0.5;
  const room = eng.law(w, 'cb.credit.room');
  const rr = eng.law(w, 'cb.reserve.ratio');
  const intermediary = eng.variant(w, 'bank.lending') === 'intermediary';
  const dscr = eng.param(w, 'bank.dscr');
  const maxLev = eng.param(w, 'bank.maxLeverage');
  const mWc = eng.param(w, 'bank.loanMonthsWc');
  const mInv = eng.param(w, 'bank.loanMonthsInv');
  const buffer = eng.param(w, 'firm.liqBuffer');
  const pK = s.pSector[INDUSTRY] / (1 + vatRate(w, eng, INDUSTRY));
  const service = serviceByFirm(w);
  const uBar = eng.param(w, 'firm.uBar');
  const aL0 = eng.param(w, 'firm.aL');

  // sức cho vay còn lại của từng ngân hàng theo từng ràng buộc
  const capCar = new Float64Array(b.n);
  const capRoom = new Float64Array(b.n);
  const capRes = new Float64Array(b.n);
  for (let k = 0; k < b.n; k++) {
    const eq = bankEquity(b, k);
    capCar[k] = b.alive[k] ? eq / carMin - b.loans[k] : 0;
    const base = Math.max(b.loansYearStart[k], 0.05 * b.depLiab[k]);
    capRoom[k] = roomOn ? base * (1 + room) - b.loans[k] : Infinity;
    capRes[k] = intermediary ? b.reserves[k] - rr * b.depLiab[k] : Infinity;
  }

  // hồ sơ: doanh nghiệp chính thức thiếu tiền cho lương, nợ đến hạn và máy định mua
  const apps: Array<{ firm: number; sound: number; wc: number; inv: number }> = [];
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i]) continue;
    f.service[i] = service[i];
    if (!f.formal[i]) continue;
    const wageBill = f.nTarget[i] * f.wage[i];
    const invCost = f.iPlan[i] * pK;
    const need = wageBill * (1 + buffer) + service[i] + invCost - f.dep[i];
    if (need < 1_000_000) continue;
    const inv = Math.min(need, invCost);
    const assets = f.dep[i] + f.invValue[i] + f.capValue[i];
    apps.push({ firm: i, sound: assets > 0 ? (assets - f.debt[i]) / assets : -1, wc: need - inv, inv });
  }
  // hồ sơ lành mạnh được xét trước; khi vốn hoặc room không đủ, hồ sơ yếu bị loại trước (BAM, K+S)
  apps.sort((x, y) => y.sound - x.sound || x.firm - y.firm);

  for (const a of apps) {
    const i = a.firm;
    const assets = f.dep[i] + f.invValue[i] + f.capValue[i];
    const lev = assets > 0 ? f.debt[i] / assets : 1;
    // hỏi ngân hàng của mình và một ngân hàng khác, chọn lãi thấp hơn (Caiani: χ = 3)
    const own = f.bank[i];
    let other = Math.floor(R(w, STREAM.bankPick, i) * b.n);
    if (!b.alive[other]) other = own;
    const r1 = lendingRate(w, eng, own, lev);
    const r2 = lendingRate(w, eng, other, lev);
    const banks = r2 < r1 ? [other, own] : [own, other];
    const rates = r2 < r1 ? [r2, r1] : [r1, r2];
    const requested = a.wc + a.inv;
    s.m.loanDemand += requested;
    let wc = a.wc;
    let inv = a.inv;
    let granted = 0;
    const cuts: Record<string, number> = {};
    // Dòng tiền để xét khả năng trả nợ. Doanh nghiệp dưới hai năm tuổi chưa có lịch sử:
    // ngân hàng xét theo phương án kinh doanh, tức dòng tiền khi máy định mua chạy ở công suất bình thường. [TTK]
    const young = w.meta.tick - f.born[i] < 24;
    const planned = ((f.K[i] + f.iPlan[i]) / kappaOf(w, eng, f.sector[i])) * uBar * aL0;
    const ocf = Math.max(f.ocf[i], 0.1 * f.salesE[i] * f.price[i], young ? planned * Math.max(0, f.price[i] - f.wage[i] / aL0) * 0.7 : 0);

    for (let t = 0; t < 2 && wc + inv >= 1_000_000; t++) {
      const k = banks[t];
      if (t === 1 && k === banks[0]) break;
      const rate = rates[t];
      for (const kind of [1, 0] as const) {
        let amount = kind === 1 ? inv : wc;
        if (amount < 500_000) continue;
        const months = kind === 1 ? mInv : mWc;
        const cut = (reason: string, cap: number) => {
          if (cap < amount) {
            cuts[reason] = (cuts[reason] ?? 0) + (amount - Math.max(0, cap));
            amount = Math.max(0, cap);
          }
        };
        // 1. khả năng trả nợ của người vay
        const perDong = 1 / months + rate / 12;
        cut('cr_repay', (ocf / dscr - f.service[i]) / perDong);
        // 2. đòn bẩy của người vay
        cut('cr_leverage', (maxLev * assets - f.debt[i]) / (1 - maxLev));
        // 3. vốn của ngân hàng
        cut('cr_capital', capCar[k]);
        // 4. room tín dụng
        cut('cr_room', capRoom[k]);
        // 5. biến thể "ngân hàng là trung gian": chỉ cho vay phần dự trữ dư
        cut('cr_reserves', capRes[k]);
        amount = Math.floor(amount);
        if (amount < 500_000) continue;
        const loan = createLoan(w, k, firmRef(i), amount, { rate, months, kind });
        if (loan < 0) continue;
        granted += amount;
        capCar[k] -= amount;
        capRoom[k] -= amount;
        capRes[k] -= amount;
        f.service[i] += amount * perDong;
        f.lastRate[i] = rate;
        if (kind === 1) inv -= amount;
        else wc -= amount;
        // phần bị cắt ở ngân hàng này được hỏi lại ở ngân hàng kia; bỏ ghi nhận cắt nếu sẽ thử tiếp
      }
    }
    s.m.loanGranted += granted;
    const denied = requested - granted;
    if (denied >= 1_000_000) {
      s.m.loanDenied += denied;
      s.m.rejectedSound += a.sound;
      s.m.rejectedN++;
      // chia phần bị từ chối theo lý do, tỷ lệ với mức cắt đã ghi
      let total = 0;
      for (const k in cuts) total += cuts[k];
      const parts = Object.entries(cuts).map(([reason, x]) => ({ reason, amount: total > 0 ? (-denied * x) / total : 0 }));
      recordDecision(w, firmRef(i), 'bank.credit', 'loan', requested, granted, parts);
      for (const p of parts) accumulate(w, 'credit.denied', p.reason, -p.amount);
    } else {
      s.m.grantedSound += a.sound;
      s.m.grantedN++;
    }
    if (f.lastRate[i] === 0) f.lastRate[i] = rates[0];
  }
}

// =====================================================================
// Pha debt: thu nợ, trả lãi tiền gửi
// =====================================================================
export function debtService(w: World, eng: Engine): void {
  const f = F(w);
  const h = H(w);
  const L = w.tables.loan;
  const al = u8(L, 'alive');
  const br = i32(L, 'borrower');
  // Doanh nghiệp còn vốn ròng dương nhưng trả nợ xong thì không đủ quỹ lương tháng tới:
  // xin ngân hàng giãn nợ trước khi phải cắt người. Mỗi doanh nghiệp tối đa một lần mỗi năm. [TTK]
  const months = eng.param(w, 'bank.loanMonthsInv');
  const s = st(w);
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || !f.formal[i] || f.debt[i] <= 0 || w.meta.tick - f.lastRestr[i] < 12) continue;
    if (f.dep[i] - f.service[i] >= f.workers[i] * f.wage[i]) continue;
    if (f.dep[i] + f.invValue[i] + f.capValue[i] - f.debt[i] <= 0) continue;
    restructure(w, i, months, true);
    f.lastRestr[i] = w.meta.tick;
    s.m.restructured++;
  }
  for (let r = 0; r < L.n; r++) {
    if (!al[r]) continue;
    const res = serviceLoan(w, r);
    if (br[r] >>> 24 === 1) f.intPaid[br[r] & 0xffffff] += res.paidInterest;
  }
  // lãi tiền gửi cho hộ (tiền gửi của doanh nghiệp coi như không kỳ hạn, lãi 0: đơn giản hoá)
  const rd = depositRate(w, eng) / 12;
  if (rd > 0) {
    for (let i = 0; i < h.n; i++) {
      const amt = Math.floor(h.dep[i] * rd);
      if (amt <= 0) continue;
      const paid = transfer(w, ref(BANK, h.bank[i]), hhRef(i), amt, MED_DEP, K_INT_DEP);
      h.income[i] += paid;
    }
  }
}

// =====================================================================
// Pha banking: lãi lỗ, thuế, cổ tức, xử lý vốn âm, biên lãi, dự trữ bắt buộc
// =====================================================================
export function bankHousekeeping(w: World, eng: Engine): void {
  const b = B(w);
  const h = H(w);
  const s = st(w);
  const rr = eng.law(w, 'cb.reserve.ratio');
  const rRef = eng.law(w, 'cb.rate.refinancing');
  const rRes = eng.law(w, 'cb.reserve.interest');
  const carMin = eng.law(w, 'bank.car.min');
  const carTarget = eng.param(w, 'bank.carTarget');
  const rho = eng.param(w, 'bank.dividend');
  const quarterEnd = (w.meta.tick + 1) % 3 === 0;
  const owners = quarterEnd ? ownersIndex(w, 1) : null;
  const divTax = eng.law(w, 'pit.rate.dividend');
  const bailIn = eng.variant(w, 'bank.failure') === 'bailin';
  const month = (w.meta.startMonth - 1 + w.meta.tick) % 12;
  const omo = eng.law(w, 'cb.omo.auto') >= 0.5;
  // trái phiếu từng ngân hàng đang giữ, lô đáo hạn xa nhất bán trước
  const Bd = w.tables.bond;
  const bondFace = f64(Bd, 'face');
  const bondsOf: number[][] = Array.from({ length: b.n }, () => []);
  if (omo) {
    const holder = i32(Bd, 'holder');
    const alive = u8(Bd, 'alive');
    const mat = i32(Bd, 'maturity');
    for (let r = 0; r < Bd.n; r++) if (alive[r] && holder[r] >>> 24 === BANK) bondsOf[holder[r] & 0xffffff].push(r);
    for (const l of bondsOf) l.sort((x, y) => mat[x] - mat[y] || x - y);
  }

  for (let k = 0; k < b.n; k++) {
    if (!b.alive[k]) continue;
    const me = ref(BANK, k);
    // lãi với NHNN: trả lãi tái cấp vốn, nhận lãi trên dự trữ bắt buộc
    if (b.cbAdv[k] > 0) transfer(w, me, CB_REF, (b.cbAdv[k] * rRef) / 12, MED_DEP, K_INT_ADV);
    const required = rr * b.depLiab[k];
    if (rRes > 0) transfer(w, CB_REF, me, (Math.min(required, b.reserves[k]) * rRes) / 12, MED_DEP, K_INT_RES);

    // lãi trước thuế tháng này = thay đổi vốn, trừ phần Nhà nước bơm
    const profit = bankEquity(b, k) - b.equityStart[k] - b.recap[k];
    b.profit[k] = profit;
    b.recap[k] = 0;
    let after = profit;
    if (profit > 0) after -= transfer(w, me, GOV_REF, profit * eng.law(w, 'cit.rate.standard'), MED_DEP, K_CIT);
    if (profit > 0) s.m.taxCit += profit - after;
    b.profitQ[k] += after;

    // cổ tức theo quý, chỉ khi vốn trên mục tiêu (Caiani: ρ_b = 0,6)
    if (quarterEnd) {
      const eq = bankEquity(b, k);
      const spare = eq - carTarget * b.loans[k];
      // vốn vượt gấp đôi mục tiêu thì trả dần lại cho chủ sở hữu, để vốn không nằm chết trong ngân hàng [TTK]
      const idle = Math.max(0, eq - 2 * carTarget * b.loans[k]);
      const div = Math.floor(Math.min(rho * Math.max(0, b.profitQ[k]) + 0.25 * idle, Math.max(0, spare)));
      b.profitQ[k] = 0;
      if (div > 0) {
        if (b.stateOwned[k]) transfer(w, me, GOV_REF, div, MED_DEP, K_DIV);
        else {
          for (let q = owners!.start[k]; q < owners!.start[k + 1]; q++) {
            const row = owners!.rows[q];
            const o = i32(w.tables.share, 'owner')[row];
            const paid = transfer(w, me, hhRef(o), div * f64(w.tables.share, 'frac')[row], MED_DEP, K_DIV);
            const t = transfer(w, hhRef(o), GOV_REF, paid * divTax, MED_DEP, K_PIT);
            s.m.taxPit += t;
            h.income[o] += paid - t;
          }
        }
      }
    }

    // vốn âm hoặc dưới nửa mức tối thiểu: Nhà nước tái cấp vốn (mặc định) hoặc người gửi tiền gánh lỗ (biến thể)
    const eq = bankEquity(b, k);
    if (eq < 0.5 * carMin * b.loans[k]) {
      const need = Math.ceil(carMin * 1.25 * b.loans[k] - eq);
      if (bailIn && b.depLiab[k] > 0) {
        const cut = Math.min(0.9, need / b.depLiab[k]);
        for (let i = 0; i < h.n; i++) if (h.bank[i] === k && h.dep[i] > 0) transfer(w, hhRef(i), me, h.dep[i] * cut, MED_DEP, K_OTHER);
        const f = F(w);
        for (let i = 0; i < f.n; i++) if (f.bank[i] === k && f.dep[i] > 0) transfer(w, firmRef(i), me, f.dep[i] * cut, MED_DEP, K_OTHER);
        eng.event(w, { type: 'shock', id: 'bank.bailin', label: `Ngân hàng ${k + 1} mất vốn, người gửi tiền gánh ${(cut * 100).toFixed(1)}%`, by: 'Mô hình' });
      } else {
        const paid = transfer(w, GOV_REF, me, need, MED_DEP, K_RECAP, 0, true);
        b.recap[k] += paid;
        if (paid < need) {
          // kho bạc không đủ: NHNN mua trái phiếu để có tiền cứu ngân hàng
          issueBond(w, CB_REF, need - paid, rRef, 60);
          b.recap[k] += transfer(w, GOV_REF, me, need - paid, MED_DEP, K_RECAP, 0, true);
        }
        b.stateOwned[k] = 1;
        const S = w.tables.share;
        for (let r = 0; r < S.n; r++) if (u8(S, 'kind')[r] === 1 && i32(S, 'entity')[r] === k) u8(S, 'alive')[r] = 0;
        eng.event(w, { type: 'shock', id: 'bank.recap', label: `Nhà nước tái cấp vốn ngân hàng ${k + 1}`, by: 'Mô hình' });
      }
    }

    // biên lãi suất tự chỉnh theo vốn so với mục tiêu (Caiani 3.12)
    const car = b.loans[k] > 0 ? bankEquity(b, k) / b.loans[k] : 1;
    const step = foldedStep(w, eng, STREAM.margin, k) * 0.05;
    b.margin[k] = Math.max(0.01, Math.min(0.2, b.margin[k] + (car > carTarget ? -step : step)));

    // dự trữ bắt buộc: thiếu thì vay tái cấp vốn, thừa thì trả bớt
    // Nghiệp vụ thị trường mở (mặc định bật): ngân hàng bán lại trái phiếu chính phủ cho NHNN để có dự trữ.
    // Hết trái phiếu, hoặc NHNN tắt kênh này, thì vay tái cấp vốn.
    const req = rr * b.depLiab[k];
    if (omo) {
      let need = req * 1.1 + b.cbAdv[k] - b.reserves[k];
      const list = bondsOf[k];
      while (need > 0 && list.length) {
        const r = list.pop()!;
        const face = bondFace[r];
        if (cbTradeBond(w, r, true)) need -= face;
      }
    }
    if (b.cbAdv[k] > 0 && b.reserves[k] > req) cbRepay(w, k, b.reserves[k] - req);
    if (b.reserves[k] < req) cbLend(w, k, req - b.reserves[k]);

    if (month === 11) b.loansYearStart[k] = b.loans[k];
    b.equityStart[k] = bankEquity(b, k);
  }
}
