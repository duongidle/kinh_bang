// Sổ cái kế toán kép. Chỉ các hàm trong file này được đổi số dư tiền và tài sản tài chính.
// Xem docs/design/gd0.md mục 4.

import { addRow, f64, i32, u8 } from '../core/table';
import { BANK, CB, FIRM, GOV, HH, NSEC, refId, refSector, type World } from '../core/world';
import { MED_CASH, MED_DEP, TX_KINDS, tx } from './kinds';

const K_LOAN_NEW = tx('loan_new');
const K_LOAN_REPAY = tx('loan_repay');
const K_INT_LOAN = tx('interest_loan');
const K_WRITEOFF = tx('writeoff');
const K_WITHDRAW = tx('cash_withdraw');
const K_DEPOSIT = tx('cash_deposit');
const K_BOND_ISSUE = tx('bond_issue');
const K_BOND_REDEEM = tx('bond_redeem');
const K_BOND_TRADE = tx('bond_trade');
const K_INT_BOND = tx('interest_bond');
const K_CB_LEND = tx('cb_lend');
const K_CB_REPAY = tx('cb_repay');

const isPublic = (sector: number) => sector === HH || sector === FIRM;

// ---------- ghi bút toán ----------
function post(w: World, kind: number, from: number, to: number, amount: number, medium: number, cause: number): void {
  const L = w.ledger;
  const i = L.head;
  L.tTick[i] = w.meta.tick;
  L.tKind[i] = kind;
  L.tFrom[i] = from;
  L.tTo[i] = to;
  L.tAmount[i] = amount;
  L.tMedium[i] = medium;
  L.tCause[i] = cause;
  L.head = (i + 1) % L.cap;
  L.count++;
  L.volume[kind] += amount;
  const fs = refSector(from);
  const ts = refSector(to);
  if (TX_KINDS[kind].flow) {
    L.flow[fs * L.nkind + kind] -= amount;
    L.flow[ts * L.nkind + kind] += amount;
  }
}

function moneyDelta(w: World, kind: number, d: number): void {
  w.ledger.money[kind] += d;
}

// ---------- dự trữ và tái cấp vốn ----------
/** Bảo đảm ngân hàng có đủ dự trữ để chi `amount`; thiếu thì NHNN tự cho vay tái cấp vốn (đơn giản hoá, gd1 mục 8). */
function ensureReserves(w: World, bank: number, amount: number): void {
  const res = f64(w.tables.bank, 'reserves');
  if (res[bank] >= amount) return;
  cbLend(w, bank, amount - res[bank]);
}

export function cbLend(w: World, bank: number, amount: number): number {
  amount = Math.floor(amount);
  if (amount <= 0) return 0;
  const b = w.tables.bank;
  const cb = w.tables.cb;
  f64(b, 'reserves')[bank] += amount;
  f64(b, 'cbAdv')[bank] += amount;
  f64(cb, 'adv')[0] += amount;
  f64(cb, 'resLiab')[0] += amount;
  post(w, K_CB_LEND, (CB << 24) | 0, (BANK << 24) | bank, amount, MED_DEP, 0);
  return amount;
}

export function cbRepay(w: World, bank: number, amount: number): number {
  const b = w.tables.bank;
  const cb = w.tables.cb;
  amount = Math.floor(Math.min(amount, f64(b, 'cbAdv')[bank], f64(b, 'reserves')[bank]));
  if (amount <= 0) return 0;
  f64(b, 'reserves')[bank] -= amount;
  f64(b, 'cbAdv')[bank] -= amount;
  f64(cb, 'adv')[0] -= amount;
  f64(cb, 'resLiab')[0] -= amount;
  post(w, K_CB_REPAY, (BANK << 24) | bank, (CB << 24) | 0, amount, MED_DEP, 0);
  return amount;
}

function moveReserves(w: World, fromBank: number, toBank: number, amount: number): void {
  if (fromBank === toBank) return;
  ensureReserves(w, fromBank, amount);
  const res = f64(w.tables.bank, 'reserves');
  res[fromBank] -= amount;
  res[toBank] += amount;
}

// ---------- số dư khả dụng ----------
export function available(w: World, r: number, medium: number): number {
  const s = refSector(r);
  const id = refId(r);
  if (s === HH || s === FIRM) {
    const t = s === HH ? w.tables.hh : w.tables.firm;
    return medium === MED_CASH ? f64(t, 'cash')[id] : f64(t, 'dep')[id];
  }
  if (s === GOV) return f64(w.tables.gov, 'tga')[0];
  return Infinity; // ngân hàng và NHNN chi bằng dự trữ, có tái cấp vốn tự động
}

// ---------- chuyển tiền ----------
/**
 * Chuyển `amount` đồng từ `from` sang `to`. Trả về số tiền thực chuyển.
 * Không đủ tiền: trả 0, hoặc chuyển phần có được nếu `partial`.
 */
export function transfer(
  w: World,
  from: number,
  to: number,
  amount: number,
  medium: number,
  kind: number,
  cause = 0,
  partial = false,
): number {
  amount = Math.floor(amount);
  if (amount <= 0 || from === to) return 0;
  const fs = refSector(from);
  const fi = refId(from);
  const ts = refSector(to);
  const ti = refId(to);
  const avail = available(w, from, medium);
  if (avail < amount) {
    if (!partial) return 0;
    amount = Math.floor(avail);
    if (amount <= 0) return 0;
  }
  const T = w.tables;
  const cb = T.cb;

  // 1) Rút khỏi bên trả; xác định "nguồn dự trữ": ngân hàng nào mất dự trữ nếu tiền rời khỏi nó.
  //    srcBank = -1: tiền mặt; -2: kho bạc; -3: NHNN.
  let srcBank: number;
  if (fs === HH || fs === FIRM) {
    const t = fs === HH ? T.hh : T.firm;
    if (medium === MED_CASH) {
      f64(t, 'cash')[fi] -= amount;
      srcBank = -1;
    } else {
      f64(t, 'dep')[fi] -= amount;
      srcBank = i32(t, 'bank')[fi];
      f64(T.bank, 'depLiab')[srcBank] -= amount;
    }
  } else if (fs === BANK) {
    srcBank = fi;
  } else if (fs === GOV) {
    f64(T.gov, 'tga')[0] -= amount;
    f64(cb, 'tgaLiab')[0] -= amount;
    srcBank = -2;
  } else {
    f64(cb, 'equity')[0] -= amount;
    srcBank = -3;
  }

  // 2) Ghi cho bên nhận.
  if (ts === HH || ts === FIRM) {
    const t = ts === HH ? T.hh : T.firm;
    if (srcBank === -1) {
      f64(t, 'cash')[ti] += amount;
    } else {
      const dst = i32(t, 'bank')[ti];
      f64(t, 'dep')[ti] += amount;
      f64(T.bank, 'depLiab')[dst] += amount;
      if (srcBank >= 0) moveReserves(w, srcBank, dst, amount);
      else {
        // từ kho bạc hoặc NHNN: dự trữ mới vào ngân hàng nhận
        f64(T.bank, 'reserves')[dst] += amount;
        f64(cb, 'resLiab')[0] += amount;
      }
    }
  } else if (ts === BANK) {
    if (srcBank === -1) {
      // tiền mặt nộp vào ngân hàng thành dự trữ
      f64(T.bank, 'reserves')[ti] += amount;
      f64(cb, 'cashOut')[0] -= amount;
      f64(cb, 'resLiab')[0] += amount;
    } else if (srcBank >= 0) moveReserves(w, srcBank, ti, amount);
    else {
      f64(T.bank, 'reserves')[ti] += amount;
      f64(cb, 'resLiab')[0] += amount;
    }
  } else if (ts === GOV) {
    f64(T.gov, 'tga')[0] += amount;
    f64(cb, 'tgaLiab')[0] += amount;
    if (srcBank === -1) f64(cb, 'cashOut')[0] -= amount;
    else if (srcBank >= 0) {
      ensureReserves(w, srcBank, amount);
      f64(T.bank, 'reserves')[srcBank] -= amount;
      f64(cb, 'resLiab')[0] -= amount;
    }
  } else {
    // bên nhận là NHNN
    f64(cb, 'equity')[0] += amount;
    if (srcBank === -1) f64(cb, 'cashOut')[0] -= amount;
    else if (srcBank >= 0) {
      ensureReserves(w, srcBank, amount);
      f64(T.bank, 'reserves')[srcBank] -= amount;
      f64(cb, 'resLiab')[0] -= amount;
    }
  }

  post(w, kind, from, to, amount, medium, cause);
  const d = (isPublic(ts) ? amount : 0) - (isPublic(fs) ? amount : 0);
  if (d !== 0) moneyDelta(w, kind, d);
  return amount;
}

// ---------- tiền mặt ----------
export function withdrawCash(w: World, r: number, amount: number): number {
  const s = refSector(r);
  const id = refId(r);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  amount = Math.floor(Math.min(amount, f64(t, 'dep')[id]));
  if (amount <= 0) return 0;
  const bank = i32(t, 'bank')[id];
  ensureReserves(w, bank, amount);
  f64(t, 'dep')[id] -= amount;
  f64(t, 'cash')[id] += amount;
  f64(w.tables.bank, 'depLiab')[bank] -= amount;
  f64(w.tables.bank, 'reserves')[bank] -= amount;
  f64(w.tables.cb, 'resLiab')[0] -= amount;
  f64(w.tables.cb, 'cashOut')[0] += amount;
  post(w, K_WITHDRAW, (BANK << 24) | bank, r, amount, MED_CASH, 0);
  return amount;
}

export function depositCash(w: World, r: number, amount: number): number {
  const s = refSector(r);
  const id = refId(r);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  amount = Math.floor(Math.min(amount, f64(t, 'cash')[id]));
  if (amount <= 0) return 0;
  const bank = i32(t, 'bank')[id];
  f64(t, 'cash')[id] -= amount;
  f64(t, 'dep')[id] += amount;
  f64(w.tables.bank, 'depLiab')[bank] += amount;
  f64(w.tables.bank, 'reserves')[bank] += amount;
  f64(w.tables.cb, 'resLiab')[0] += amount;
  f64(w.tables.cb, 'cashOut')[0] -= amount;
  post(w, K_DEPOSIT, r, (BANK << 24) | bank, amount, MED_CASH, 0);
  return amount;
}

// ---------- khoản vay ----------
export interface LoanTerms {
  rate: number; // năm
  months: number;
  kind?: number; // 0 vốn lưu động, 1 đầu tư
  collateral?: number;
}

/** Ngân hàng cho vay: ghi khoản vay và tạo tiền gửi mới cùng lúc. Trả về số dòng khoản vay. */
export function createLoan(w: World, bank: number, borrower: number, principal: number, terms: LoanTerms, cause = 0): number {
  principal = Math.floor(principal);
  if (principal <= 0) return -1;
  const s = refSector(borrower);
  const id = refId(borrower);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  const row = addRow(w.tables.loan, {
    bank,
    borrower,
    principal,
    rate: terms.rate,
    instalment: Math.ceil(principal / terms.months),
    left: terms.months,
    kind: terms.kind ?? 0,
    collateral: terms.collateral ?? 0,
    origTick: w.meta.tick,
  });
  f64(w.tables.bank, 'loans')[bank] += principal;
  f64(t, 'debt')[id] += principal;
  // tiền gửi mới ở ngân hàng của người vay
  const dst = i32(t, 'bank')[id];
  f64(t, 'dep')[id] += principal;
  f64(w.tables.bank, 'depLiab')[dst] += principal;
  if (dst !== bank) moveReserves(w, bank, dst, principal);
  post(w, K_LOAN_NEW, (BANK << 24) | bank, borrower, principal, MED_DEP, cause);
  moneyDelta(w, K_LOAN_NEW, principal);
  return row;
}

/** Trả một kỳ: lãi trên dư nợ rồi gốc. Trả về { interest, principal, due } thực trả và phải trả. */
export function serviceLoan(w: World, loan: number): { paidInterest: number; paidPrincipal: number; due: number } {
  const L = w.tables.loan;
  const principal = f64(L, 'principal');
  if (!u8(L, 'alive')[loan] || principal[loan] <= 0) return { paidInterest: 0, paidPrincipal: 0, due: 0 };
  const bank = i32(L, 'bank')[loan];
  const borrower = i32(L, 'borrower')[loan];
  const interest = Math.floor((principal[loan] * f64(L, 'rate')[loan]) / 12);
  const princDue = Math.min(principal[loan], f64(L, 'instalment')[loan]);
  const bankRef = (BANK << 24) | bank;
  const paidInterest = transfer(w, borrower, bankRef, interest, MED_DEP, K_INT_LOAN, 0, true);
  let paidPrincipal = 0;
  if (paidInterest >= interest) paidPrincipal = repayPrincipal(w, loan, princDue);
  const left = i32(L, 'left');
  if (paidInterest + paidPrincipal < interest + princDue) i32(L, 'overdue')[loan]++;
  else {
    i32(L, 'overdue')[loan] = 0;
    if (left[loan] > 0) left[loan]--;
  }
  if (principal[loan] <= 0) u8(L, 'alive')[loan] = 0;
  return { paidInterest, paidPrincipal, due: interest + princDue };
}

/** Trả gốc: huỷ tiền gửi và giảm dư nợ. */
export function repayPrincipal(w: World, loan: number, amount: number): number {
  const L = w.tables.loan;
  const principal = f64(L, 'principal');
  const bank = i32(L, 'bank')[loan];
  const borrower = i32(L, 'borrower')[loan];
  const s = refSector(borrower);
  const id = refId(borrower);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  amount = Math.floor(Math.min(amount, principal[loan], f64(t, 'dep')[id]));
  if (amount <= 0) return 0;
  const src = i32(t, 'bank')[id];
  f64(t, 'dep')[id] -= amount;
  f64(w.tables.bank, 'depLiab')[src] -= amount;
  if (src !== bank) moveReserves(w, src, bank, amount);
  principal[loan] -= amount;
  f64(w.tables.bank, 'loans')[bank] -= amount;
  f64(t, 'debt')[id] -= amount;
  post(w, K_LOAN_REPAY, borrower, (BANK << 24) | bank, amount, MED_DEP, 0);
  moneyDelta(w, K_LOAN_REPAY, -amount);
  if (principal[loan] <= 0) u8(L, 'alive')[loan] = 0;
  return amount;
}

/** Xoá nợ: ngân hàng mất tài sản, người vay hết nghĩa vụ. */
export function writeOffLoan(w: World, loan: number, amount?: number, cause = 0): number {
  const L = w.tables.loan;
  const principal = f64(L, 'principal');
  const bank = i32(L, 'bank')[loan];
  const borrower = i32(L, 'borrower')[loan];
  const s = refSector(borrower);
  const id = refId(borrower);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  const a = Math.floor(Math.min(amount ?? principal[loan], principal[loan]));
  if (a <= 0) return 0;
  principal[loan] -= a;
  f64(w.tables.bank, 'loans')[bank] -= a;
  f64(t, 'debt')[id] -= a;
  if (principal[loan] <= 0) u8(L, 'alive')[loan] = 0;
  // Ghi như một dòng chuyển giao từ ngân hàng sang người vay để ma trận dòng tiền khớp.
  post(w, K_WRITEOFF, (BANK << 24) | bank, borrower, a, MED_DEP, cause);
  return a;
}

// ---------- trái phiếu chính phủ ----------
function holderBondsCol(w: World, holder: number): { col: Float64Array; id: number } {
  const s = refSector(holder);
  const id = refId(holder);
  const t = s === HH ? w.tables.hh : s === FIRM ? w.tables.firm : s === BANK ? w.tables.bank : w.tables.cb;
  return { col: f64(t, 'bonds'), id };
}

/** Chính phủ phát hành trái phiếu cho `holder` (ngân hàng, NHNN hoặc hộ). NHNN mua là in tiền. */
export function issueBond(w: World, holder: number, face: number, rate: number, months: number, cause = 0): number {
  face = Math.floor(face);
  if (face <= 0) return -1;
  const s = refSector(holder);
  const id = refId(holder);
  const T = w.tables;
  const cb = T.cb;
  if (s === BANK) {
    ensureReserves(w, id, face);
    f64(T.bank, 'reserves')[id] -= face;
    f64(cb, 'resLiab')[0] -= face;
  } else if (s === CB) {
    // NHNN tạo tiền mới: không bên nào mất gì
  } else {
    const t = s === HH ? T.hh : T.firm;
    if (f64(t, 'dep')[id] < face) return -1;
    const bank = i32(t, 'bank')[id];
    f64(t, 'dep')[id] -= face;
    f64(T.bank, 'depLiab')[bank] -= face;
    ensureReserves(w, bank, face);
    f64(T.bank, 'reserves')[bank] -= face;
    f64(cb, 'resLiab')[0] -= face;
    moneyDelta(w, K_BOND_ISSUE, -face);
  }
  f64(T.gov, 'tga')[0] += face;
  f64(cb, 'tgaLiab')[0] += face;
  f64(T.gov, 'bondsOut')[0] += face;
  const h = holderBondsCol(w, holder);
  h.col[h.id] += face;
  const row = addRow(T.bond, { holder, face, rate, maturity: w.meta.tick + months });
  post(w, K_BOND_ISSUE, holder, (GOV << 24) | 0, face, MED_DEP, cause);
  return row;
}

/** Trả lãi một tháng cho một trái phiếu. */
export function payCoupon(w: World, bond: number): number {
  const B = w.tables.bond;
  if (!u8(B, 'alive')[bond]) return 0;
  const amount = Math.floor((f64(B, 'face')[bond] * f64(B, 'rate')[bond]) / 12);
  return transfer(w, (GOV << 24) | 0, i32(B, 'holder')[bond], amount, MED_DEP, K_INT_BOND, 0, true);
}

/** Trả gốc trái phiếu đến hạn. Trả false nếu kho bạc không đủ tiền. */
export function redeemBond(w: World, bond: number): boolean {
  const B = w.tables.bond;
  if (!u8(B, 'alive')[bond]) return true;
  const face = f64(B, 'face')[bond];
  const T = w.tables;
  if (f64(T.gov, 'tga')[0] < face) return false;
  const holder = i32(B, 'holder')[bond];
  const s = refSector(holder);
  const id = refId(holder);
  const cb = T.cb;
  f64(T.gov, 'tga')[0] -= face;
  f64(cb, 'tgaLiab')[0] -= face;
  f64(T.gov, 'bondsOut')[0] -= face;
  const h = holderBondsCol(w, holder);
  h.col[h.id] -= face;
  if (s === BANK) {
    f64(T.bank, 'reserves')[id] += face;
    f64(cb, 'resLiab')[0] += face;
  } else if (s !== CB) {
    const t = s === HH ? T.hh : T.firm;
    const bank = i32(t, 'bank')[id];
    f64(t, 'dep')[id] += face;
    f64(T.bank, 'depLiab')[bank] += face;
    f64(T.bank, 'reserves')[bank] += face;
    f64(cb, 'resLiab')[0] += face;
    moneyDelta(w, K_BOND_REDEEM, face);
  }
  u8(B, 'alive')[bond] = 0;
  post(w, K_BOND_REDEEM, (GOV << 24) | 0, holder, face, MED_DEP, 0);
  return true;
}

/** NHNN mua (hoặc bán) một trái phiếu với ngân hàng theo mệnh giá: nghiệp vụ thị trường mở. */
export function cbTradeBond(w: World, bond: number, toCb: boolean): boolean {
  const B = w.tables.bond;
  if (!u8(B, 'alive')[bond]) return false;
  const holder = i32(B, 'holder')[bond];
  const face = f64(B, 'face')[bond];
  const T = w.tables;
  const cb = T.cb;
  if (toCb) {
    if (refSector(holder) !== BANK) return false;
    const b = refId(holder);
    f64(T.bank, 'bonds')[b] -= face;
    f64(T.bank, 'reserves')[b] += face;
    f64(cb, 'bonds')[0] += face;
    f64(cb, 'resLiab')[0] += face;
    i32(B, 'holder')[bond] = (CB << 24) | 0;
    post(w, K_BOND_TRADE, (CB << 24) | 0, holder, face, MED_DEP, 0);
  }
  return toCb;
}

/** NHNN bán trái phiếu đang giữ cho một ngân hàng. */
export function cbSellBond(w: World, bond: number, bank: number): boolean {
  const B = w.tables.bond;
  if (!u8(B, 'alive')[bond] || refSector(i32(B, 'holder')[bond]) !== CB) return false;
  const face = f64(B, 'face')[bond];
  const T = w.tables;
  ensureReserves(w, bank, face);
  f64(T.bank, 'bonds')[bank] += face;
  f64(T.bank, 'reserves')[bank] -= face;
  f64(T.cb, 'bonds')[0] -= face;
  f64(T.cb, 'resLiab')[0] -= face;
  i32(B, 'holder')[bond] = (BANK << 24) | bank;
  post(w, K_BOND_TRADE, (BANK << 24) | bank, (CB << 24) | 0, face, MED_DEP, 0);
  return true;
}

// ---------- tài sản thực ----------
export function addInventoryValue(w: World, firm: number, value: number): void {
  f64(w.tables.firm, 'invValue')[firm] += value;
}
export function addCapitalValue(w: World, firm: number, value: number): void {
  f64(w.tables.firm, 'capValue')[firm] += value;
}

// ---------- khởi tạo ----------
/** Phát tiền mặt ban đầu: NHNN ghi nợ tiền mặt, giảm vốn. Chỉ dùng khi dựng thế giới. */
export function seedCash(w: World, r: number, amount: number): void {
  amount = Math.floor(amount);
  const s = refSector(r);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  f64(t, 'cash')[refId(r)] += amount;
  f64(w.tables.cb, 'cashOut')[0] += amount;
  f64(w.tables.cb, 'equity')[0] -= amount;
  post(w, tx('init'), (CB << 24) | 0, r, amount, MED_CASH, 0);
  moneyDelta(w, tx('init'), amount);
}

/** Cấp tiền gửi ban đầu kèm dự trữ tương ứng. Chỉ dùng khi dựng thế giới. */
export function seedDeposit(w: World, r: number, amount: number): void {
  amount = Math.floor(amount);
  const s = refSector(r);
  const id = refId(r);
  const t = s === HH ? w.tables.hh : w.tables.firm;
  const bank = i32(t, 'bank')[id];
  f64(t, 'dep')[id] += amount;
  f64(w.tables.bank, 'depLiab')[bank] += amount;
  f64(w.tables.bank, 'reserves')[bank] += amount;
  f64(w.tables.cb, 'resLiab')[0] += amount;
  f64(w.tables.cb, 'equity')[0] -= amount;
  post(w, tx('init'), (CB << 24) | 0, r, amount, MED_DEP, 0);
  moneyDelta(w, tx('init'), amount);
}

/** Cấp dự trữ ban đầu cho ngân hàng (vốn tự có lúc dựng thế giới). */
export function seedReserves(w: World, bank: number, amount: number): void {
  amount = Math.floor(amount);
  f64(w.tables.bank, 'reserves')[bank] += amount;
  f64(w.tables.cb, 'resLiab')[0] += amount;
  f64(w.tables.cb, 'equity')[0] -= amount;
  post(w, tx('init'), (CB << 24) | 0, (BANK << 24) | bank, amount, MED_DEP, 0);
}

// ---------- tổng hợp ----------
/** Tài sản tài chính ròng của từng khu vực. */
export function sectorNfa(w: World): Float64Array {
  const out = new Float64Array(NSEC);
  const T = w.tables;
  for (const [s, t] of [[HH, T.hh], [FIRM, T.firm]] as const) {
    const cash = f64(t, 'cash');
    const dep = f64(t, 'dep');
    const debt = f64(t, 'debt');
    const bonds = f64(t, 'bonds');
    let x = 0;
    for (let i = 0; i < t.n; i++) x += cash[i] + dep[i] + bonds[i] - debt[i];
    out[s] = x;
  }
  {
    const t = T.bank;
    const r = f64(t, 'reserves');
    const l = f64(t, 'loans');
    const b = f64(t, 'bonds');
    const d = f64(t, 'depLiab');
    const a = f64(t, 'cbAdv');
    let x = 0;
    for (let i = 0; i < t.n; i++) x += r[i] + l[i] + b[i] - d[i] - a[i];
    out[BANK] = x;
  }
  out[GOV] = f64(T.gov, 'tga')[0] - f64(T.gov, 'bondsOut')[0];
  const c = T.cb;
  out[CB] = f64(c, 'bonds')[0] + f64(c, 'adv')[0] - f64(c, 'cashOut')[0] - f64(c, 'resLiab')[0] - f64(c, 'tgaLiab')[0];
  return out;
}

/** Tiền của công chúng: tiền mặt và tiền gửi của hộ và doanh nghiệp. */
export function publicMoney(w: World): { cash: number; deposits: number } {
  let cash = 0;
  let deposits = 0;
  for (const t of [w.tables.hh, w.tables.firm]) {
    const c = f64(t, 'cash');
    const d = f64(t, 'dep');
    for (let i = 0; i < t.n; i++) {
      cash += c[i];
      deposits += d[i];
    }
  }
  return { cash, deposits };
}

/** Gọi đầu mỗi tháng. */
export function beginTick(w: World): void {
  const L = w.ledger;
  L.flow.fill(0);
  L.money.fill(0);
  L.volume.fill(0);
  L.nfaStart.set(sectorNfa(w));
}

/** Gọi cuối mỗi tháng: lưu ma trận dòng tiền vào lịch sử. */
export function endTick(w: World): void {
  const L = w.ledger;
  const nk = L.nkind;
  const t = L.histTicks;
  const need = (t + 1) * NSEC * nk;
  if (need > L.flowHist.length) {
    const grow = (a: Float64Array) => {
      const b = new Float64Array(a.length * 2);
      b.set(a);
      return b;
    };
    L.flowHist = grow(L.flowHist);
    L.moneyHist = grow(L.moneyHist);
    L.volumeHist = grow(L.volumeHist);
  }
  L.flowHist.set(L.flow, t * NSEC * nk);
  L.moneyHist.set(L.money, t * nk);
  L.volumeHist.set(L.volume, t * nk);
  L.histTicks = t + 1;
}

export { MED_CASH, MED_DEP };
