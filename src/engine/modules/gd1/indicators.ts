// Chỉ số của GĐ1 và hàm phân rã (gd1 mục 11).
// Phân rã lấy từ sổ cái (dòng tiền theo loại giao dịch) và từ bản ghi quyết định; không có hệ số đặt tay.

import { takeAcc } from '../../causal/causal';
import type { IndicatorDef } from '../../core/engine';
import { f64, i32, u8 } from '../../core/table';
import type { World } from '../../core/world';
import { TX_KINDS, tx } from '../../ledger/kinds';
import { gdpNominal, yoyInflation } from './gov';
import { B, bankEquity, F, H, NSECTOR, st, UNEMPLOYED } from './schema';

type Ind = IndicatorDef;
const vol = (w: World, kind: string) => w.ledger.volume[tx(kind)];

/** Với chỉ số dạng dòng (giá trị tháng này = tổng các phần): mức thay đổi của từng phần so với tháng trước. */
function flowContrib(w: World, key: string, parts: Record<string, number>): Record<string, number> {
  const s = st(w);
  const prev = s.prev[key] ?? {};
  const out: Record<string, number> = {};
  for (const k of new Set([...Object.keys(parts), ...Object.keys(prev)])) {
    const d = (parts[k] ?? 0) - (prev[k] ?? 0);
    if (d !== 0) out[k] = d;
  }
  s.prev[key] = parts;
  return out;
}

export function gini(values: Float64Array | number[]): number {
  const a = Float64Array.from(values).sort();
  const n = a.length;
  let sum = 0;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const v = Math.max(0, a[i]);
    sum += v;
    acc += v * (i + 1);
  }
  return sum > 0 ? (2 * acc) / (n * sum) - (n + 1) / n : 0;
}

function wealthOf(w: World): Float64Array {
  const h = H(w);
  const out = new Float64Array(h.n);
  for (let i = 0; i < h.n; i++) out[i] = h.cash[i] + h.dep[i];
  return out;
}

/** Nhóm loại giao dịch làm đổi lượng tiền của công chúng thành các kênh dễ đọc (bảng nguồn tiền, S3). */
export const MONEY_CHANNEL: Record<string, string> = {
  loan_new: 'm_loan_new',
  loan_repay: 'm_loan_repay',
  wage_public: 'm_gov_spend',
  gov_purchase: 'm_gov_spend',
  transfer_social: 'm_gov_spend',
  vat: 'm_tax',
  pit: 'm_tax',
  cit: 'm_tax',
  hkd_tax: 'm_tax',
  interest_loan: 'm_bank_interest',
  interest_dep: 'm_bank_interest',
  dividend: 'm_dividend',
  bond_issue: 'm_bond',
  bond_redeem: 'm_bond',
  interest_bond: 'm_bond',
  init: 'm_init',
};

export function moneyChannels(w: World, tick?: number): Record<string, number> {
  const L = w.ledger;
  const out: Record<string, number> = {};
  for (let k = 0; k < L.nkind; k++) {
    const v = tick === undefined ? L.money[k] : L.moneyHist[tick * L.nkind + k];
    if (v === 0) continue;
    const ch = MONEY_CHANNEL[TX_KINDS[k].id] ?? 'm_other';
    out[ch] = (out[ch] ?? 0) + v;
  }
  return out;
}

function cpiContrib(w: World, prev: number, cur: number): Record<string, number> {
  // Mỗi quyết định giá của tháng này góp vào CPI theo thị phần của người bán trong ngành và trọng số ngành trong rổ.
  const s = st(w);
  const f = F(w);
  let den = 0;
  for (let k = 0; k < NSECTOR; k++) den += s.cpiBase[k] * s.pSectorPrev[k];
  const out: Record<string, number> = {};
  if (den <= 0) return out;
  const D = w.causal.decisions;
  for (let j = D.length - 1; j >= 0 && D[j].tick === w.meta.tick; j--) {
    const d = D[j];
    if (d.rule !== 'firm.price') continue;
    const i = d.agent & 0xffffff;
    const sec = f.sector[i];
    const q = s.salesReal[sec];
    if (q <= 0) continue;
    const weight = (prev * s.cpiBase[sec] * (f.sales[i] / q)) / den;
    for (const p of d.parts) out[p.reason] = (out[p.reason] ?? 0) + weight * p.amount;
  }
  let sum = 0;
  for (const k in out) sum += out[k];
  out.p_mix = cur - prev - sum; // người mua đổi nơi mua, người bán mới và cũ thay nhau
  return out;
}

function nplRatio(w: World, months: number): number {
  const L = w.tables.loan;
  const al = u8(L, 'alive');
  const ov = i32(L, 'overdue');
  const p = f64(L, 'principal');
  let bad = 0;
  let all = 0;
  for (let r = 0; r < L.n; r++) {
    if (!al[r]) continue;
    all += p[r];
    if (ov[r] >= months) bad += p[r];
  }
  return all > 0 ? bad / all : 0;
}

function countFirms(w: World, pred: (f: ReturnType<typeof F>, i: number) => boolean): number {
  const f = F(w);
  let c = 0;
  for (let i = 0; i < f.n; i++) if (f.alive[i] && pred(f, i)) c++;
  return c;
}

function informalShare(w: World): number {
  const h = H(w);
  const f = F(w);
  let inf = 0;
  let emp = 0;
  for (let i = 0; i < h.n; i++) {
    const e = h.employer[i];
    if (e === UNEMPLOYED) continue;
    emp++;
    if (e >= 0 && !f.formal[e]) inf++;
  }
  return emp > 0 ? inf / emp : 0;
}

function bondsHeldByCb(w: World): number {
  return f64(w.tables.cb, 'bonds')[0];
}

const debt = (w: World) => f64(w.tables.gov, 'bondsOut')[0];
const credit = (w: World) => {
  const b = B(w);
  let x = 0;
  for (let k = 0; k < b.n; k++) x += b.loans[k];
  return x;
};
const money = (w: World) => {
  let cash = 0;
  let dep = 0;
  for (const t of [w.tables.hh, w.tables.firm]) {
    const c = f64(t, 'cash');
    const d = f64(t, 'dep');
    for (let i = 0; i < t.n; i++) {
      cash += c[i];
      dep += d[i];
    }
  }
  return { cash, dep };
};
const taxes = (w: World) => vol(w, 'vat') + vol(w, 'pit') + vol(w, 'cit') + vol(w, 'hkd_tax');
const govRevenue = (w: World) => {
  // mọi dòng tiền vào kho bạc trừ vay nợ: thuế, cổ tức doanh nghiệp và ngân hàng nhà nước, lợi nhuận NHNN
  const L = w.ledger;
  let x = 0;
  for (let k = 0; k < L.nkind; k++) if (TX_KINDS[k].flow && L.flow[3 * L.nkind + k] > 0) x += L.flow[3 * L.nkind + k];
  return x;
};
const govSpending = (w: World) => {
  const L = w.ledger;
  let x = 0;
  for (let k = 0; k < L.nkind; k++) if (TX_KINDS[k].flow && L.flow[3 * L.nkind + k] < 0) x -= L.flow[3 * L.nkind + k];
  return x;
};

export const GD1_INDICATORS: Ind[] = [
  // ---------- sản lượng ----------
  {
    id: 'gdp.nominal',
    label: 'GDP danh nghĩa (tháng)',
    unit: 'đồng',
    group: 'Sản lượng',
    good: 1,
    compute: (w) => gdpNominal(st(w)),
    contrib(w) {
      const s = st(w);
      const m = s.m;
      return flowContrib(w, 'gdp', {
        gdp_c: m.consNom[0] + m.consNom[1] + m.consNom[2],
        gdp_g: m.govNom + m.wagesPublic,
        gdp_i: m.invNom,
        gdp_inv: s.invTotal - s.invTotalPrev,
      });
    },
  },
  {
    id: 'gdp.income',
    label: 'GDP theo thu nhập (tháng)',
    unit: 'đồng',
    group: 'Sản lượng',
    compute(w) {
      // lương + thuế GTGT phát sinh + thặng dư của mọi đơn vị sản xuất (doanh thu chưa thuế − lương + thay đổi tồn kho)
      const s = st(w);
      const f = F(w);
      let x = s.m.wagesPrivate + s.m.wagesPublic + s.m.dInvValue;
      let gross = 0;
      for (let i = 0; i < f.n; i++) {
        if (!f.alive[i] && f.died[i] !== w.meta.tick) continue;
        x += f.revenue[i] - f.wagesPaid[i];
        gross += f.revenue[i];
      }
      const m = s.m;
      const sold = m.consNom[0] + m.consNom[1] + m.consNom[2] + m.govNom + m.invNom;
      return x + (sold - gross); // phần chênh giữa tiền người mua trả và doanh thu chưa thuế là thuế GTGT
    },
  },
  { id: 'gdp.real', label: 'GDP thực (giá gốc, tháng)', unit: 'đồng', group: 'Sản lượng', good: 1, compute: (w) => st(w).gdpReal },
  {
    id: 'consumption',
    label: 'Tiêu dùng của hộ (tháng)',
    unit: 'đồng',
    group: 'Sản lượng',
    good: 1,
    compute: (w) => vol(w, 'consumption'),
    contrib(w, prev, cur) {
      // thay đổi ngân sách tiêu dùng chia theo lý do; phần còn lại là muốn mua mà không mua được
      const parts = takeAcc(w, 'cons.budget');
      let sum = 0;
      for (const k in parts) sum += parts[k];
      if (w.meta.tick > 0) parts.c_supply = cur - prev - sum;
      return w.meta.tick > 0 ? parts : {};
    },
  },
  { id: 'investment', label: 'Đầu tư máy móc (tháng)', unit: 'đồng', group: 'Sản lượng', good: 1, compute: (w) => st(w).m.invNom },
  { id: 'inventories', label: 'Giá trị tồn kho', unit: 'đồng', group: 'Sản lượng', compute: (w) => st(w).invTotal },
  { id: 'unsold.services', label: 'Dịch vụ làm ra không bán được', unit: 'số', group: 'Sản lượng', good: -1, compute: (w) => st(w).m.unsold },
  { id: 'unmet', label: 'Nhu cầu mua không được đáp ứng', unit: 'đồng', group: 'Sản lượng', good: -1, compute: (w) => st(w).m.unmet },
  {
    id: 'utilisation',
    label: 'Sử dụng công suất máy',
    unit: 'tỷ lệ',
    group: 'Sản lượng',
    compute(w) {
      const f = F(w);
      let u = 0;
      let k = 0;
      for (let i = 0; i < f.n; i++)
        if (f.alive[i] && f.formal[i] && f.K[i] > 0) {
          u += f.util[i] * f.K[i];
          k += f.K[i];
        }
      return k > 0 ? u / k : 0;
    },
  },

  // ---------- giá ----------
  { id: 'cpi', label: 'Chỉ số giá tiêu dùng', unit: 'chỉ số', group: 'Giá', good: 0, compute: (w) => st(w).cpi, contrib: cpiContrib },
  { id: 'inflation.yoy', label: 'Lạm phát so với cùng kỳ năm trước', unit: '%', group: 'Giá', good: -1, compute: (w) => yoyInflation(st(w)) },
  {
    id: 'inflation.mom',
    label: 'Lạm phát tháng',
    unit: '%',
    group: 'Giá',
    good: -1,
    compute: (w) => (st(w).cpiPrev > 0 ? st(w).cpi / st(w).cpiPrev - 1 : 0),
  },
  {
    id: 'inflation.expected',
    label: 'Lạm phát kỳ vọng của hộ',
    unit: '%',
    group: 'Giá',
    good: -1,
    compute(w) {
      const h = H(w);
      const s = st(w);
      let x = 0;
      for (let i = 0; i < h.n; i++) x += h.piAdapt[i];
      return s.trust * (w.params['_target'] ?? 0) + (1 - s.trust) * (h.n ? x / h.n : 0);
    },
  },
  { id: 'trust', label: 'Mức tin vào mục tiêu lạm phát', unit: 'tỷ lệ', group: 'Giá', good: 1, compute: (w) => st(w).trust },
  { id: 'price.agri', label: 'Giá lương thực bình quân', unit: 'đồng', group: 'Giá', compute: (w) => st(w).pSector[0] },
  { id: 'price.industry', label: 'Giá hàng công nghiệp bình quân', unit: 'đồng', group: 'Giá', compute: (w) => st(w).pSector[1] },
  { id: 'price.services', label: 'Giá dịch vụ bình quân', unit: 'đồng', group: 'Giá', compute: (w) => st(w).pSector[2] },

  // ---------- lao động ----------
  {
    id: 'unemployment',
    label: 'Tỷ lệ thất nghiệp',
    unit: '%',
    group: 'Lao động',
    good: -1,
    compute: (w) => st(w).unemp,
    contrib(w) {
      const a = takeAcc(w, 'unemp');
      const n = w.tables.hh.n;
      for (const k in a) a[k] /= n;
      return a;
    },
  },
  { id: 'informal.share', label: 'Tỷ lệ lao động phi chính thức', unit: '%', group: 'Lao động', compute: informalShare },
  { id: 'public.workers', label: 'Số công chức', unit: 'người', group: 'Lao động', compute: (w) => st(w).nPublic },
  { id: 'wage.formal', label: 'Lương bình quân ở doanh nghiệp', unit: 'đồng', group: 'Lao động', good: 1, compute: (w) => st(w).wageAvg },
  { id: 'wage.informal', label: 'Lương bình quân ở hộ kinh doanh', unit: 'đồng', group: 'Lao động', good: 1, compute: (w) => st(w).wageInf },
  { id: 'wage.real', label: 'Lương thực bình quân (giá gốc)', unit: 'đồng', group: 'Lao động', good: 1, compute: (w) => (st(w).wageAvgAll * 100) / st(w).cpi },
  { id: 'vacancies', label: 'Chỗ làm đang tuyển', unit: 'số', group: 'Lao động', compute: (w) => st(w).m.vacancies },
  { id: 'wage.belowMin', label: 'Doanh nghiệp trả dưới lương tối thiểu', unit: 'số', group: 'Lao động', good: -1, compute: (w) => st(w).m.belowMin },

  // ---------- tiền và tín dụng ----------
  {
    id: 'money.m2',
    label: 'Tổng phương tiện thanh toán',
    unit: 'đồng',
    group: 'Tiền và tín dụng',
    compute(w) {
      const m = money(w);
      return m.cash + m.dep;
    },
    contrib: (w) => moneyChannels(w),
  },
  { id: 'money.cash', label: 'Tiền mặt lưu thông', unit: 'đồng', group: 'Tiền và tín dụng', compute: (w) => money(w).cash },
  {
    id: 'money.cashShare',
    label: 'Tiền mặt trên tổng phương tiện thanh toán',
    unit: '%',
    group: 'Tiền và tín dụng',
    compute(w) {
      const m = money(w);
      return m.cash + m.dep > 0 ? m.cash / (m.cash + m.dep) : 0;
    },
  },
  {
    id: 'credit',
    label: 'Dư nợ tín dụng',
    unit: 'đồng',
    group: 'Tiền và tín dụng',
    compute: credit,
    contrib: (w) => ({ cr_new: vol(w, 'loan_new'), cr_repaid: -vol(w, 'loan_repay'), cr_writeoff: -vol(w, 'writeoff') }),
  },
  { id: 'credit.new', label: 'Vay mới trong tháng', unit: 'đồng', group: 'Tiền và tín dụng', compute: (w) => vol(w, 'loan_new') },
  {
    id: 'credit.denied',
    label: 'Số tiền xin vay bị từ chối',
    unit: 'đồng',
    group: 'Tiền và tín dụng',
    good: -1,
    compute: (w) => st(w).m.loanDenied,
    contrib: (w) => flowContrib(w, 'denied', takeAcc(w, 'credit.denied')),
  },
  { id: 'credit.demand', label: 'Số tiền doanh nghiệp xin vay', unit: 'đồng', group: 'Tiền và tín dụng', compute: (w) => st(w).m.loanDemand },
  {
    id: 'credit.soundGap',
    label: 'Độ lành mạnh: nhóm được vay trừ nhóm bị từ chối',
    unit: 'tỷ lệ',
    group: 'Tiền và tín dụng',
    compute(w) {
      const m = st(w).m;
      return m.rejectedN > 0 && m.grantedN > 0 ? m.grantedSound / m.grantedN - m.rejectedSound / m.rejectedN : NaN;
    },
  },
  { id: 'npl', label: 'Tỷ lệ nợ xấu', unit: '%', group: 'Tiền và tín dụng', good: -1, compute: (w) => nplRatio(w, w.params['bank.nplMonths'] ?? 3) },
  {
    id: 'bank.car',
    label: 'Tỷ lệ an toàn vốn toàn hệ thống',
    unit: '%',
    group: 'Tiền và tín dụng',
    good: 1,
    compute(w) {
      const b = B(w);
      let eq = 0;
      let loans = 0;
      for (let k = 0; k < b.n; k++) {
        eq += bankEquity(b, k);
        loans += b.loans[k];
      }
      return loans > 0 ? eq / loans : 0;
    },
  },
  {
    id: 'bank.margin',
    label: 'Biên lãi suất cho vay bình quân',
    unit: '%',
    group: 'Tiền và tín dụng',
    compute(w) {
      const b = B(w);
      let x = 0;
      for (let k = 0; k < b.n; k++) x += b.margin[k];
      return b.n ? x / b.n : 0;
    },
  },
  { id: 'bank.reserves', label: 'Dự trữ của ngân hàng tại NHNN', unit: 'đồng', group: 'Tiền và tín dụng', compute: (w) => f64(w.tables.cb, 'resLiab')[0] },
  { id: 'cb.advances', label: 'Dư nợ tái cấp vốn', unit: 'đồng', group: 'Tiền và tín dụng', compute: (w) => f64(w.tables.cb, 'adv')[0] },
  { id: 'cb.bonds', label: 'Trái phiếu NHNN đang giữ', unit: 'đồng', group: 'Tiền và tín dụng', compute: bondsHeldByCb },

  // ---------- ngân sách ----------
  {
    id: 'gov.revenue',
    label: 'Thu ngân sách (tháng)',
    unit: 'đồng',
    group: 'Ngân sách',
    good: 1,
    compute: govRevenue,
    contrib: (w) =>
      flowContrib(w, 'rev', {
        t_vat: vol(w, 'vat'),
        t_pit: vol(w, 'pit'),
        t_cit: vol(w, 'cit'),
        t_hkd: vol(w, 'hkd_tax'),
        t_other: govRevenue(w) - taxes(w),
      }),
  },
  { id: 'gov.spending', label: 'Chi ngân sách (tháng)', unit: 'đồng', group: 'Ngân sách', compute: govSpending },
  { id: 'gov.balance', label: 'Cân đối ngân sách (tháng)', unit: 'đồng', group: 'Ngân sách', good: 1, compute: (w) => govRevenue(w) - govSpending(w) },
  { id: 'gov.tax.vat', label: 'Thu thuế GTGT', unit: 'đồng', group: 'Ngân sách', compute: (w) => vol(w, 'vat') },
  { id: 'gov.tax.pit', label: 'Thu thuế TNCN', unit: 'đồng', group: 'Ngân sách', compute: (w) => vol(w, 'pit') },
  { id: 'gov.tax.cit', label: 'Thu thuế TNDN', unit: 'đồng', group: 'Ngân sách', compute: (w) => vol(w, 'cit') },
  { id: 'gov.tax.hkd', label: 'Thu thuế hộ kinh doanh', unit: 'đồng', group: 'Ngân sách', compute: (w) => vol(w, 'hkd_tax') },
  { id: 'gov.debt', label: 'Nợ công', unit: 'đồng', group: 'Ngân sách', good: -1, compute: debt },
  { id: 'gov.debtGdp', label: 'Nợ công so với GDP năm', unit: '%', group: 'Ngân sách', good: -1, compute: (w) => (st(w).gdpEma > 0 ? debt(w) / (12 * st(w).gdpEma) : 0) },
  { id: 'gov.tga', label: 'Tiền trong kho bạc', unit: 'đồng', group: 'Ngân sách', compute: (w) => f64(w.tables.gov, 'tga')[0] },
  { id: 'gov.purchaseCut', label: 'Phần mua hàng phải cắt vì thiếu tiền', unit: 'đồng', group: 'Ngân sách', good: -1, compute: (w) => st(w).m.purchaseCut },
  { id: 'gov.arrears', label: 'Nợ lương công chức', unit: 'đồng', group: 'Ngân sách', good: -1, compute: (w) => st(w).govArrears },
  { id: 'gov.bondsToCb', label: 'Trái phiếu bán thẳng cho NHNN (tháng)', unit: 'đồng', group: 'Ngân sách', compute: (w) => st(w).m.bondSoldCb },

  // ---------- phân phối ----------
  { id: 'gini.wealth', label: 'Gini của cải', unit: 'chỉ số', group: 'Phân phối', good: -1, compute: (w) => gini(wealthOf(w)) },
  { id: 'gini.income', label: 'Gini thu nhập sau thuế', unit: 'chỉ số', group: 'Phân phối', good: -1, compute: (w) => gini(H(w).income.subarray(0, H(w).n)) },
  {
    id: 'gini.incomeGross',
    label: 'Gini lương trước thuế',
    unit: 'chỉ số',
    group: 'Phân phối',
    compute: (w) => gini(H(w).grossWage.subarray(0, H(w).n)),
  },
  {
    id: 'top10.wealth',
    label: 'Phần của cải của nhóm 10% giàu nhất',
    unit: '%',
    group: 'Phân phối',
    good: -1,
    compute(w) {
      const a = wealthOf(w).sort();
      let top = 0;
      let all = 0;
      const cut = Math.floor(a.length * 0.9);
      for (let i = 0; i < a.length; i++) {
        all += a[i];
        if (i >= cut) top += a[i];
      }
      return all > 0 ? top / all : 0;
    },
  },
  {
    id: 'wage.share',
    label: 'Phần lương trong GDP',
    unit: '%',
    group: 'Phân phối',
    compute(w) {
      const s = st(w);
      const g = gdpNominal(s);
      return g > 0 ? (s.m.wagesPrivate + s.m.wagesPublic) / g : 0;
    },
  },

  // ---------- doanh nghiệp ----------
  { id: 'firms.formal', label: 'Số doanh nghiệp', unit: 'số', group: 'Doanh nghiệp', compute: (w) => countFirms(w, (f, i) => f.formal[i] === 1) },
  { id: 'firms.hkd', label: 'Số hộ kinh doanh có thuê người', unit: 'số', group: 'Doanh nghiệp', compute: (w) => countFirms(w, (f, i) => !f.formal[i] && !f.solo[i]) },
  { id: 'firms.solo', label: 'Số người tự làm', unit: 'số', group: 'Doanh nghiệp', compute: (w) => countFirms(w, (f, i) => f.solo[i] === 1) },
  { id: 'firms.bankrupt', label: 'Doanh nghiệp phá sản (tháng)', unit: 'số', group: 'Doanh nghiệp', good: -1, compute: (w) => st(w).m.bankrupt },
  { id: 'firms.entries', label: 'Doanh nghiệp mới (tháng)', unit: 'số', group: 'Doanh nghiệp', good: 1, compute: (w) => st(w).m.entries },
  {
    id: 'firms.sizeSkew',
    label: 'Độ lệch của phân phối quy mô doanh nghiệp',
    unit: 'chỉ số',
    group: 'Doanh nghiệp',
    compute(w) {
      const f = F(w);
      const xs: number[] = [];
      for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i]) xs.push(f.workers[i]);
      const n = xs.length;
      if (n < 3) return 0;
      const mean = xs.reduce((a, b) => a + b, 0) / n;
      let m2 = 0;
      let m3 = 0;
      for (const x of xs) {
        m2 += (x - mean) ** 2;
        m3 += (x - mean) ** 3;
      }
      m2 /= n;
      m3 /= n;
      return m2 > 0 ? m3 / Math.pow(m2, 1.5) : 0;
    },
  },
  {
    id: 'rate.lending',
    label: 'Lãi suất cho vay bình quân',
    unit: '%',
    group: 'Tiền và tín dụng',
    compute(w) {
      const L = w.tables.loan;
      const al = u8(L, 'alive');
      const p = f64(L, 'principal');
      const r = f64(L, 'rate');
      let x = 0;
      let all = 0;
      for (let k = 0; k < L.n; k++)
        if (al[k]) {
          x += p[k] * r[k];
          all += p[k];
        }
      return all > 0 ? x / all : 0;
    },
  },
  { id: 'cb.holdsShare', label: 'Phần nợ công do NHNN giữ', unit: '%', group: 'Ngân sách', compute: (w) => (debt(w) > 0 ? bondsHeldByCb(w) / debt(w) : 0) },
];


