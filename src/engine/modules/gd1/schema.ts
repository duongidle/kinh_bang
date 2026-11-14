// Lược đồ dữ liệu và hàm dùng chung của GĐ1.

import type { Engine } from '../../core/engine';
import { rand, randNormal, streamId } from '../../core/rng';
import { addColumns, createTable, f64, i32, u8, type ColSpec } from '../../core/table';
import { FIRM, HH, ref, type World } from '../../core/world';
import { depositCash, MED_CASH, MED_DEP, transfer, withdrawCash } from '../../ledger/ledger';

export const AGRI = 0;
export const INDUSTRY = 1;
export const SERVICES = 2;
export const NSECTOR = 3;
export const SECTOR_NAME = ['Nông nghiệp', 'Công nghiệp', 'Dịch vụ'] as const;
export const SECTOR_KEY = ['agri', 'industry', 'services'] as const;

export const UNEMPLOYED = -1;
export const PUBLIC = -2;

export const NSEG = 3; // số người bán quen mỗi phân khúc (phi chính thức, chính thức) của mỗi ngành
export const NSELL = 2 * NSEG; // ô 0..NSEG-1: hộ kinh doanh; NSEG..2*NSEG-1: doanh nghiệp
export const SEG_INF = 0;
export const SEG_FORMAL = 1;

const HH_COLS: ColSpec[] = [
  { name: 'employer', type: 'i32', def: UNEMPLOYED }, // id doanh nghiệp, -1 thất nghiệp, -2 Nhà nước
  { name: 'wage', type: 'f64' },
  { name: 'resWage', type: 'f64' },
  { name: 'uMonths', type: 'i32' },
  { name: 'lastUnemp', type: 'i32', def: -999 }, // tháng gần nhất từng thất nghiệp
  { name: 'ownBiz', type: 'i32', def: -1 }, // hộ kinh doanh của mình
  { name: 'dependents', type: 'i32' },
  { name: 'expInc', type: 'f64' }, // thu nhập khả dụng kỳ vọng
  { name: 'piAdapt', type: 'f64' }, // lạm phát thích nghi (năm)
  { name: 'budget', type: 'f64' }, // ngân sách tiêu dùng tháng này
  { name: 'bInc', type: 'f64' }, // các số hạng của ngân sách tháng trước, để phân rã
  { name: 'bWealth', type: 'f64' },
  { name: 'mConf', type: 'f64', def: 1 },
  { name: 'mInfl', type: 'f64', def: 1 },
  { name: 'income', type: 'f64' }, // thu nhập khả dụng tháng này
  { name: 'grossWage', type: 'f64' },
  { name: 'pitPaid', type: 'f64' }, // thuế TNCN từ lương tháng này
  { name: 'cons', type: 'f64' }, // chi tiêu tháng này
  { name: 'consCash', type: 'f64' },
  { name: 'cons0', type: 'f64' },
  { name: 'cons1', type: 'f64' },
  { name: 'cons2', type: 'f64' },
  { name: 'need0', type: 'f64' }, // ngân sách còn lại theo ngành trong lúc đi mua
  { name: 'need1', type: 'f64' },
  { name: 'need2', type: 'f64' },
  { name: 'cell', type: 'i32' },
  { name: 'named', type: 'i32', def: -1 },
  ...Array.from({ length: NSECTOR * NSELL }, (_, k): ColSpec => ({ name: `sl${k}`, type: 'i32', def: -1 })),
];

const FIRM_COLS: ColSpec[] = [
  { name: 'sector', type: 'u8' },
  { name: 'formal', type: 'u8', def: 1 },
  { name: 'owner', type: 'i32', def: -1 }, // chủ hộ kinh doanh
  { name: 'stateOwned', type: 'u8' },
  { name: 'zone', type: 'u8', def: 1 },
  { name: 'born', type: 'i32' },
  { name: 'died', type: 'i32', def: -1 },
  { name: 'solo', type: 'u8' }, // người tự làm do hết đường
  { name: 'n', type: 'i32' }, // số lao động (kể cả chủ hộ kinh doanh)
  { name: 'nTarget', type: 'i32' },
  { name: 'vac', type: 'i32' },
  { name: 'vacLeft', type: 'i32' },
  { name: 'unfilled', type: 'i32' }, // chỗ trống không tuyển được tháng trước
  { name: 'wage', type: 'f64' },
  { name: 'price', type: 'f64' }, // giá chưa thuế
  { name: 'priceG', type: 'f64' }, // giá bán gồm thuế
  { name: 'pricePrev', type: 'f64' },
  { name: 'markup', type: 'f64' },
  { name: 'uc', type: 'f64' }, // chi phí đơn vị
  { name: 'ucWage', type: 'f64' },
  { name: 'ucCap', type: 'f64' },
  { name: 'inv', type: 'f64' }, // tồn kho (đơn vị)
  { name: 'K', type: 'f64' }, // máy (đơn vị)
  { name: 'salesE', type: 'f64' }, // doanh số kỳ vọng (đơn vị)
  { name: 'sales', type: 'f64' }, // bán tháng này (đơn vị)
  { name: 'salesPrev', type: 'f64' },
  { name: 'revenue', type: 'f64' }, // doanh thu chưa thuế tháng này
  { name: 'rev12', type: 'f64' }, // doanh thu 12 tháng (ước lượng trượt)
  { name: 'output', type: 'f64' },
  { name: 'stockout', type: 'u8' },
  { name: 'vatDue', type: 'f64' },
  { name: 'wagesPaid', type: 'f64' },
  { name: 'intPaid', type: 'f64' },
  { name: 'deprec', type: 'f64' },
  { name: 'invStart', type: 'f64' },
  { name: 'profit', type: 'f64' }, // lãi trước thuế tháng này
  { name: 'profitQ', type: 'f64' }, // lãi sau thuế cộng dồn trong quý
  { name: 'ocf', type: 'f64' }, // dòng tiền hoạt động kỳ vọng
  { name: 'profitRate', type: 'f64' },
  { name: 'util', type: 'f64' },
  { name: 'iPlan', type: 'f64' }, // máy định mua
  { name: 'distress', type: 'i32' },
  { name: 'service', type: 'f64' }, // nghĩa vụ trả nợ tháng
  { name: 'lastRate', type: 'f64' },
  { name: 'lastRestr', type: 'i32', def: -999 }, // tháng gần nhất được giãn nợ
  { name: 'cell', type: 'i32' },
  { name: 'named', type: 'i32', def: -1 },
];

const BANK_COLS: ColSpec[] = [
  { name: 'stateOwned', type: 'u8' },
  { name: 'margin', type: 'f64' },
  { name: 'loansYearStart', type: 'f64' },
  { name: 'profit', type: 'f64' }, // lãi trước thuế tháng này
  { name: 'profitQ', type: 'f64' },
  { name: 'equityStart', type: 'f64' },
  { name: 'recap', type: 'f64' },
  { name: 'cell', type: 'i32' },
];

export function setupSchema(w: World): void {
  addColumns(w.tables.hh, HH_COLS);
  addColumns(w.tables.firm, FIRM_COLS);
  addColumns(w.tables.bank, BANK_COLS);
  // Sổ cổ đông: ai sở hữu bao nhiêu phần của doanh nghiệp hoặc ngân hàng nào.
  w.tables.share = createTable(
    'share',
    [
      { name: 'kind', type: 'u8' }, // 0 doanh nghiệp, 1 ngân hàng
      { name: 'entity', type: 'i32' },
      { name: 'owner', type: 'i32' }, // id hộ
      { name: 'frac', type: 'f64' },
      { name: 'alive', type: 'u8', def: 1 },
    ],
    256,
  );
}

// ---------- truy cập cột ----------
export function H(w: World) {
  const t = w.tables.hh;
  return {
    t,
    n: t.n,
    cash: f64(t, 'cash'),
    dep: f64(t, 'dep'),
    bank: i32(t, 'bank'),
    employer: i32(t, 'employer'),
    wage: f64(t, 'wage'),
    resWage: f64(t, 'resWage'),
    uMonths: i32(t, 'uMonths'),
    lastUnemp: i32(t, 'lastUnemp'),
    ownBiz: i32(t, 'ownBiz'),
    dependents: i32(t, 'dependents'),
    expInc: f64(t, 'expInc'),
    piAdapt: f64(t, 'piAdapt'),
    budget: f64(t, 'budget'),
    bInc: f64(t, 'bInc'),
    bWealth: f64(t, 'bWealth'),
    mConf: f64(t, 'mConf'),
    mInfl: f64(t, 'mInfl'),
    income: f64(t, 'income'),
    grossWage: f64(t, 'grossWage'),
    pitPaid: f64(t, 'pitPaid'),
    cons: f64(t, 'cons'),
    consCash: f64(t, 'consCash'),
    consS: [f64(t, 'cons0'), f64(t, 'cons1'), f64(t, 'cons2')],
    need: [f64(t, 'need0'), f64(t, 'need1'), f64(t, 'need2')],
    sellers: Array.from({ length: NSECTOR * NSELL }, (_, k) => i32(t, `sl${k}`)),
  };
}

export function F(w: World) {
  const t = w.tables.firm;
  return {
    t,
    n: t.n,
    cash: f64(t, 'cash'),
    dep: f64(t, 'dep'),
    bank: i32(t, 'bank'),
    debt: f64(t, 'debt'),
    alive: u8(t, 'alive'),
    invValue: f64(t, 'invValue'),
    capValue: f64(t, 'capValue'),
    sector: u8(t, 'sector'),
    formal: u8(t, 'formal'),
    owner: i32(t, 'owner'),
    stateOwned: u8(t, 'stateOwned'),
    zone: u8(t, 'zone'),
    born: i32(t, 'born'),
    died: i32(t, 'died'),
    solo: u8(t, 'solo'),
    workers: i32(t, 'n'),
    nTarget: i32(t, 'nTarget'),
    vac: i32(t, 'vac'),
    vacLeft: i32(t, 'vacLeft'),
    unfilled: i32(t, 'unfilled'),
    wage: f64(t, 'wage'),
    price: f64(t, 'price'),
    priceG: f64(t, 'priceG'),
    pricePrev: f64(t, 'pricePrev'),
    markup: f64(t, 'markup'),
    uc: f64(t, 'uc'),
    ucWage: f64(t, 'ucWage'),
    ucCap: f64(t, 'ucCap'),
    inv: f64(t, 'inv'),
    K: f64(t, 'K'),
    salesE: f64(t, 'salesE'),
    sales: f64(t, 'sales'),
    salesPrev: f64(t, 'salesPrev'),
    revenue: f64(t, 'revenue'),
    rev12: f64(t, 'rev12'),
    output: f64(t, 'output'),
    stockout: u8(t, 'stockout'),
    vatDue: f64(t, 'vatDue'),
    wagesPaid: f64(t, 'wagesPaid'),
    intPaid: f64(t, 'intPaid'),
    deprec: f64(t, 'deprec'),
    invStart: f64(t, 'invStart'),
    profit: f64(t, 'profit'),
    profitQ: f64(t, 'profitQ'),
    ocf: f64(t, 'ocf'),
    profitRate: f64(t, 'profitRate'),
    util: f64(t, 'util'),
    iPlan: f64(t, 'iPlan'),
    distress: i32(t, 'distress'),
    service: f64(t, 'service'),
    lastRate: f64(t, 'lastRate'),
    lastRestr: i32(t, 'lastRestr'),
  };
}

export function B(w: World) {
  const t = w.tables.bank;
  return {
    t,
    n: t.n,
    reserves: f64(t, 'reserves'),
    depLiab: f64(t, 'depLiab'),
    loans: f64(t, 'loans'),
    bonds: f64(t, 'bonds'),
    cbAdv: f64(t, 'cbAdv'),
    alive: u8(t, 'alive'),
    stateOwned: u8(t, 'stateOwned'),
    margin: f64(t, 'margin'),
    loansYearStart: f64(t, 'loansYearStart'),
    profit: f64(t, 'profit'),
    profitQ: f64(t, 'profitQ'),
    equityStart: f64(t, 'equityStart'),
    recap: f64(t, 'recap'),
  };
}

export const bankEquity = (b: ReturnType<typeof B>, i: number): number => b.reserves[i] + b.loans[i] + b.bonds[i] - b.depLiab[i] - b.cbAdv[i];

/** Trạng thái nhỏ của module, lưu trong world.ext.gd1. */
export interface Gd1State {
  cpi: number;
  cpiBase: number[]; // rổ hàng: lượng mỗi ngành
  pSector: number[]; // giá bình quân gồm thuế theo ngành, tháng này
  pSectorPrev: number[];
  cpiHist: number[]; // 13 tháng gần nhất
  cpiPrev: number;
  balHist: number[]; // cân đối ngân sách 12 tháng gần nhất
  gdpHist: number[];
  cpiTaxBase: number; // CPI ở lần chỉnh ngưỡng thuế gần nhất
  omega: number[]; // trọng số sở thích hàng phi chính thức theo ngành, hiệu chỉnh theo cơ cấu ban đầu
  pSeg: number[][]; // giá bình quân gồm thuế theo [phân khúc][ngành]
  pK: number; // giá máy chưa thuế bình quân
  budgetAvg: number; // ngân sách tiêu dùng bình quân tháng trước
  pHist: number[][]; // giá theo ngành, 5 tháng gần nhất
  p0: number[]; // giá gốc theo ngành, để tính GDP thực
  basketAcc: number[];
  wageRef: number; // mức tham chiếu lương công chức, xét lại mỗi năm
  wageInf: number; // lương bình quân ở hộ kinh doanh
  publicWage0: number;
  gdpReal: number;
  invTotal: number; // tổng giá trị tồn kho cuối tháng
  invTotalPrev: number;
  salesReal: number[];
  prev: Record<string, Record<string, number>>; // phần phân rã tháng trước của các chỉ số dạng dòng
  trust: number;
  wageAvg: number; // lương bình quân khu vực chính thức
  wageAvgAll: number;
  publicWage: number;
  gdpEma: number; // GDP danh nghĩa tháng, làm trơn
  unemp: number;
  govArrears: number;
  purchaseBudget: number;
  nPublic: number;
  // bộ đếm trong tháng
  m: {
    consReal: number[];
    consNom: number[];
    govNom: number;
    invNom: number;
    invReal: number;
    outputReal: number[];
    outputValue: number;
    unsold: number;
    unmet: number;
    wagesPrivate: number;
    wagesPublic: number;
    vacancies: number;
    hires: number;
    fires: number;
    bankrupt: number;
    entries: number;
    entriesHkd: number;
    restructured: number;
    loanDemand: number;
    loanGranted: number;
    loanDenied: number;
    rejectedSound: number;
    rejectedN: number;
    grantedSound: number;
    grantedN: number;
    taxVat: number;
    taxPit: number;
    taxCit: number;
    taxHkd: number;
    taxExcise: number;
    taxFees: number;
    omo: number; // trái phiếu NHNN mua lại từ ngân hàng trong tháng
    consInf: number; // tiêu dùng của hộ ở hộ kinh doanh
    spill: number; // phần cầu chuyển sang phân khúc kia vì hết hàng
    govSpend: number;
    govRevenue: number;
    bondSoldBanks: number;
    bondSoldCb: number;
    purchaseCut: number;
    dInvValue: number;
    deprec: number;
    belowMin: number;
  };
  names: Array<{ kind: 'hh' | 'firm'; id: number; name: string; story: string }>;
  news: Array<{ tick: number; text: string; indicator?: string }>;
  basketYear: number;
}

export function st(w: World): Gd1State {
  return w.ext.gd1 as Gd1State;
}

export function resetMonth(s: Gd1State): void {
  s.m = {
    consReal: [0, 0, 0],
    consNom: [0, 0, 0],
    govNom: 0,
    invNom: 0,
    invReal: 0,
    outputReal: [0, 0, 0],
    outputValue: 0,
    unsold: 0,
    unmet: 0,
    wagesPrivate: 0,
    wagesPublic: 0,
    vacancies: 0,
    hires: 0,
    fires: 0,
    bankrupt: 0,
    entries: 0,
    entriesHkd: 0,
    restructured: 0,
    loanDemand: 0,
    loanGranted: 0,
    loanDenied: 0,
    rejectedSound: 0,
    rejectedN: 0,
    grantedSound: 0,
    grantedN: 0,
    taxVat: 0,
    taxPit: 0,
    taxCit: 0,
    taxHkd: 0,
    taxExcise: 0,
    taxFees: 0,
    omo: 0,
    consInf: 0,
    spill: 0,
    govSpend: 0,
    govRevenue: 0,
    bondSoldBanks: 0,
    bondSoldCb: 0,
    purchaseCut: 0,
    dInvValue: 0,
    deprec: 0,
    belowMin: 0,
  };
}

// ---------- tiện ích ----------
/** Bước điều chỉnh dương, phân phối chuẩn gấp (Caiani). */
export function foldedStep(w: World, eng: Engine, stream: number, entity: number, k = 0): number {
  return Math.abs(randNormal(w.meta.seed, stream, entity, w.meta.tick, k)) * eng.param(w, 'firm.adjSigma');
}

export const R = (w: World, stream: number, entity: number, k = 0): number => rand(w.meta.seed, stream, entity, w.meta.tick, k);

/** Hoán vị tất định của 0..n-1 cho tháng này (Fisher-Yates với rand không trạng thái). */
export function shuffled(w: World, stream: number, n: number): Int32Array {
  const a = new Int32Array(n);
  for (let i = 0; i < n; i++) a[i] = i;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand(w.meta.seed, stream, i, w.meta.tick) * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/** Trả tiền, tự rút hoặc nộp tiền mặt để đủ phương tiện mong muốn. Trả về số tiền đã trả. */
export function payFlex(w: World, from: number, to: number, amount: number, medium: number, kind: number, cause = 0): number {
  amount = Math.floor(amount);
  if (amount <= 0) return 0;
  const sector = from >>> 24;
  if (sector === HH || sector === FIRM) {
    const t = sector === HH ? w.tables.hh : w.tables.firm;
    const id = from & 0xffffff;
    const cash = f64(t, 'cash')[id];
    const dep = f64(t, 'dep')[id];
    if (medium === MED_CASH && cash < amount) withdrawCash(w, from, amount - cash);
    else if (medium === MED_DEP && dep < amount) depositCash(w, from, amount - dep);
  }
  return transfer(w, from, to, amount, medium, kind, cause, true);
}

export const hhRef = (i: number) => ref(HH, i);
export const firmRef = (i: number) => ref(FIRM, i);

export const STREAM = {
  init: streamId('gd1.init'),
  shopOrder: streamId('gd1.shop.order'),
  search: streamId('gd1.shop.search'),
  searchPick: streamId('gd1.shop.pick'),
  stockoutSwitch: streamId('gd1.shop.stockout'),
  jobOrder: streamId('gd1.job.order'),
  jobPick: streamId('gd1.job.pick'),
  onJob: streamId('gd1.job.onjob'),
  fire: streamId('gd1.fire'),
  wage: streamId('gd1.wage'),
  markup: streamId('gd1.markup'),
  bankPick: streamId('gd1.bank.pick'),
  margin: streamId('gd1.bank.margin'),
  entry: streamId('gd1.entry'),
  founder: streamId('gd1.founder'),
  capSeller: streamId('gd1.capital.seller'),
  govBuy: streamId('gd1.gov.buy'),
  bankSwitch: streamId('gd1.bank.switch'),
  fallback: streamId('gd1.fallback'),
  hkdHire: streamId('gd1.hkd'),
  announce: streamId('gd1.announce'),
};

export function minWageOf(w: World, eng: Engine, zone: number): number {
  return eng.law(w, `minwage.zone.${zone}`);
}

/** Thuế TNCN một tháng trên lương, theo biểu luỹ tiến từng phần. */
export function pitOnWage(w: World, eng: Engine, gross: number, dependents: number): number {
  let taxable = gross - eng.law(w, 'pit.deduction.self') - dependents * eng.law(w, 'pit.deduction.dependent');
  if (taxable <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (let b = 1; b <= 5; b++) {
    const upper = b < 5 ? eng.law(w, `pit.limit.${b}`) : Infinity;
    const slice = Math.min(taxable, upper - lower);
    if (slice <= 0) break;
    tax += slice * eng.law(w, `pit.rate.${b}`);
    taxable -= slice;
    lower = upper;
    if (taxable <= 0) break;
  }
  return Math.floor(tax);
}

export function vatRate(w: World, eng: Engine, sector: number): number {
  return sector === AGRI ? eng.law(w, 'vat.rate.agri') : eng.law(w, 'vat.rate.standard');
}

/** Thuế gián thu khác nằm trong giá hàng công nghiệp và dịch vụ; người bán nào cũng chịu (sai-khac.md S3). */
export function exciseRate(w: World, eng: Engine, sector: number): number {
  return sector === AGRI ? 0 : eng.law(w, 'tax.indirect.other');
}

/** Tổng thuế tính trên giá chưa thuế của một người bán: GTGT (chỉ doanh nghiệp) + thuế gián thu khác. */
export function taxWedge(w: World, eng: Engine, sector: number, formal: boolean): number {
  return (formal ? vatRate(w, eng, sector) : 0) + exciseRate(w, eng, sector);
}
