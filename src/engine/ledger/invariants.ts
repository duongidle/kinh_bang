// Bốn đẳng thức kế toán (gd0 mục 4.3). Trả về danh sách vi phạm; rỗng là đạt.

import { f64, i32, u8 } from '../core/table';
import { BANK, CB, FIRM, GOV, HH, NSEC, refId, refSector, SECTOR_LABEL, type World } from '../core/world';
import { sectorNfa } from './ledger';

const EPS = 0.5; // tiền là số nguyên; cho phép sai số dấu phẩy động dưới nửa đồng

export function checkInvariants(w: World): string[] {
  const bad: string[] = [];
  const T = w.tables;
  const nb = T.bank.n;
  const near = (a: number, b: number) => Math.abs(a - b) <= EPS + 1e-12 * Math.max(Math.abs(a), Math.abs(b));

  // --- 1. Mỗi công cụ: tổng bên giữ = tổng bên nợ ---
  const depByBank = new Float64Array(nb);
  let cash = 0;
  const debtByBorrower = new Map<number, number>();
  const bondsByHolder = new Map<number, number>();
  for (const [s, t] of [[HH, T.hh], [FIRM, T.firm]] as const) {
    const c = f64(t, 'cash');
    const d = f64(t, 'dep');
    const b = i32(t, 'bank');
    for (let i = 0; i < t.n; i++) {
      cash += c[i];
      depByBank[b[i]] += d[i];
      if (c[i] < -EPS) bad.push(`${SECTOR_LABEL[s]} ${i}: tiền mặt âm ${c[i]}`);
      if (d[i] < -EPS) bad.push(`${SECTOR_LABEL[s]} ${i}: tiền gửi âm ${d[i]}`);
    }
  }
  if (!near(cash, f64(T.cb, 'cashOut')[0])) bad.push(`Tiền mặt: bên giữ ${cash} ≠ NHNN nợ ${f64(T.cb, 'cashOut')[0]}`);
  let res = 0;
  let adv = 0;
  for (let b = 0; b < nb; b++) {
    if (!near(depByBank[b], f64(T.bank, 'depLiab')[b]))
      bad.push(`Tiền gửi ngân hàng ${b}: bên giữ ${depByBank[b]} ≠ bên nợ ${f64(T.bank, 'depLiab')[b]}`);
    res += f64(T.bank, 'reserves')[b];
    adv += f64(T.bank, 'cbAdv')[b];
    if (f64(T.bank, 'reserves')[b] < -EPS) bad.push(`Ngân hàng ${b}: dự trữ âm`);
  }
  if (!near(res, f64(T.cb, 'resLiab')[0])) bad.push(`Dự trữ: ngân hàng giữ ${res} ≠ NHNN nợ ${f64(T.cb, 'resLiab')[0]}`);
  if (!near(adv, f64(T.cb, 'adv')[0])) bad.push(`Tái cấp vốn: ngân hàng nợ ${adv} ≠ NHNN giữ ${f64(T.cb, 'adv')[0]}`);
  if (!near(f64(T.gov, 'tga')[0], f64(T.cb, 'tgaLiab')[0])) bad.push('Tài khoản kho bạc lệch');
  if (f64(T.gov, 'tga')[0] < -EPS) bad.push('Kho bạc âm');

  // khoản vay
  const loansByBank = new Float64Array(nb);
  {
    const L = T.loan;
    const p = f64(L, 'principal');
    const lb = i32(L, 'bank');
    const br = i32(L, 'borrower');
    const al = u8(L, 'alive');
    for (let i = 0; i < L.n; i++) {
      if (!al[i]) {
        if (p[i] > EPS) bad.push(`Khoản vay ${i} đã đóng nhưng còn dư nợ`);
        continue;
      }
      loansByBank[lb[i]] += p[i];
      debtByBorrower.set(br[i], (debtByBorrower.get(br[i]) ?? 0) + p[i]);
    }
  }
  for (let b = 0; b < nb; b++)
    if (!near(loansByBank[b], f64(T.bank, 'loans')[b])) bad.push(`Dư nợ ngân hàng ${b}: ${loansByBank[b]} ≠ ${f64(T.bank, 'loans')[b]}`);
  for (const [s, t] of [[HH, T.hh], [FIRM, T.firm]] as const) {
    const debt = f64(t, 'debt');
    for (let i = 0; i < t.n; i++) {
      const want = debtByBorrower.get((s << 24) | i) ?? 0;
      if (!near(want, debt[i])) bad.push(`${SECTOR_LABEL[s]} ${i}: nợ ${debt[i]} ≠ tổng khoản vay ${want}`);
    }
  }

  // trái phiếu
  let bondsOut = 0;
  {
    const B = T.bond;
    const face = f64(B, 'face');
    const h = i32(B, 'holder');
    const al = u8(B, 'alive');
    for (let i = 0; i < B.n; i++) {
      if (!al[i]) continue;
      bondsOut += face[i];
      bondsByHolder.set(h[i], (bondsByHolder.get(h[i]) ?? 0) + face[i]);
    }
  }
  if (!near(bondsOut, f64(T.gov, 'bondsOut')[0])) bad.push(`Trái phiếu: ${bondsOut} ≠ Chính phủ nợ ${f64(T.gov, 'bondsOut')[0]}`);
  let held = 0;
  for (const [s, t] of [[HH, T.hh], [FIRM, T.firm], [BANK, T.bank], [CB, T.cb]] as const) {
    const col = f64(t, 'bonds');
    for (let i = 0; i < t.n; i++) {
      held += col[i];
      const want = bondsByHolder.get((s << 24) | i) ?? 0;
      if (!near(want, col[i])) bad.push(`${SECTOR_LABEL[s]} ${i}: trái phiếu ${col[i]} ≠ ${want}`);
    }
  }
  if (!near(held, bondsOut)) bad.push('Trái phiếu: tổng bên giữ ≠ tổng phát hành');

  // --- 2. Dòng tiền: thay đổi tài sản tài chính ròng của mỗi khu vực = tổng dòng tiền của nó;
  //        và mỗi loại giao dịch cộng qua các khu vực bằng 0 ---
  const nfa = sectorNfa(w);
  const L = w.ledger;
  for (let s = 0; s < NSEC; s++) {
    let fl = 0;
    for (let k = 0; k < L.nkind; k++) fl += L.flow[s * L.nkind + k];
    const d = nfa[s] - L.nfaStart[s];
    if (Math.abs(d - fl) > EPS + 1e-9 * Math.abs(d)) bad.push(`Dòng tiền ${SECTOR_LABEL[s]}: tài sản ròng đổi ${d} nhưng dòng tiền ghi ${fl}`);
  }
  for (let k = 0; k < L.nkind; k++) {
    let x = 0;
    for (let s = 0; s < NSEC; s++) x += L.flow[s * L.nkind + k];
    if (Math.abs(x) > EPS) bad.push(`Loại giao dịch ${k}: hàng không cộng bằng 0 (${x})`);
  }

  // --- 3. Tổng tài sản tài chính ròng toàn nền kinh tế = 0, nên tổng vốn ròng = tài sản thực ---
  let total = 0;
  for (let s = 0; s < NSEC; s++) total += nfa[s];
  if (Math.abs(total) > EPS * 4) bad.push(`Tổng tài sản tài chính ròng ≠ 0 (${total})`);

  // --- 4. Bảng cân đối NHNN ---
  const c = T.cb;
  const cbNet = f64(c, 'bonds')[0] + f64(c, 'adv')[0] - f64(c, 'cashOut')[0] - f64(c, 'resLiab')[0] - f64(c, 'tgaLiab')[0];
  if (!near(cbNet, f64(c, 'equity')[0])) bad.push(`NHNN: tài sản trừ nợ ${cbNet} ≠ vốn ${f64(c, 'equity')[0]}`);

  void GOV;
  void refId;
  void refSector;
  return bad;
}

export function assertInvariants(w: World): void {
  const bad = checkInvariants(w);
  if (bad.length) throw new Error(`Vỡ đẳng thức kế toán ở tháng ${w.meta.tick}:\n` + bad.slice(0, 10).join('\n'));
}
