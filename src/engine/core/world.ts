import { createTable, type ColSpec, type Table } from './table';

// ---- Khu vực và mã tham chiếu tác nhân ----
export const HH = 0;
export const FIRM = 1;
export const BANK = 2;
export const GOV = 3;
export const CB = 4;
export const NSEC = 5;
export const SECTOR_TABLE = ['hh', 'firm', 'bank', 'gov', 'cb'] as const;
export const SECTOR_LABEL = ['Hộ gia đình', 'Doanh nghiệp', 'Ngân hàng', 'Chính phủ', 'NHNN'] as const;

/** Mã tham chiếu tác nhân: khu vực ở 4 bit cao, số thứ tự ở 24 bit thấp. */
export const ref = (sector: number, id: number): number => (sector << 24) | id;
export const refSector = (r: number): number => r >>> 24;
export const refId = (r: number): number => r & 0xffffff;
export const GOV_REF = ref(GOV, 0);
export const CB_REF = ref(CB, 0);

// ---- Lược đồ gốc: những cột sổ cái cần biết ----
const HH_BASE: ColSpec[] = [
  { name: 'cash', type: 'f64' },
  { name: 'dep', type: 'f64' },
  { name: 'bank', type: 'i32' },
  { name: 'debt', type: 'f64' },
  { name: 'bonds', type: 'f64' },
];
const FIRM_BASE: ColSpec[] = [
  ...HH_BASE,
  { name: 'alive', type: 'u8', def: 1 },
  { name: 'invValue', type: 'f64' }, // tồn kho theo giá vốn
  { name: 'capValue', type: 'f64' }, // máy móc theo giá trị sổ sách
];
const BANK_BASE: ColSpec[] = [
  { name: 'reserves', type: 'f64' },
  { name: 'depLiab', type: 'f64' },
  { name: 'loans', type: 'f64' },
  { name: 'bonds', type: 'f64' },
  { name: 'cbAdv', type: 'f64' },
  { name: 'alive', type: 'u8', def: 1 },
];
const GOV_BASE: ColSpec[] = [
  { name: 'tga', type: 'f64' },
  { name: 'bondsOut', type: 'f64' },
];
const CB_BASE: ColSpec[] = [
  { name: 'bonds', type: 'f64' },
  { name: 'adv', type: 'f64' },
  { name: 'cashOut', type: 'f64' },
  { name: 'resLiab', type: 'f64' },
  { name: 'tgaLiab', type: 'f64' },
  { name: 'equity', type: 'f64' },
];
const LOAN_BASE: ColSpec[] = [
  { name: 'bank', type: 'i32' },
  { name: 'borrower', type: 'i32' }, // mã tham chiếu
  { name: 'principal', type: 'f64' }, // dư nợ gốc
  { name: 'rate', type: 'f64' }, // lãi suất năm
  { name: 'instalment', type: 'f64' }, // gốc trả mỗi tháng
  { name: 'left', type: 'i32' }, // số tháng còn lại
  { name: 'kind', type: 'u8' },
  { name: 'collateral', type: 'f64' }, // để sẵn cho GĐ3
  { name: 'overdue', type: 'i32' },
  { name: 'alive', type: 'u8', def: 1 },
  { name: 'origTick', type: 'i32' },
];
const BOND_BASE: ColSpec[] = [
  { name: 'holder', type: 'i32' },
  { name: 'face', type: 'f64' },
  { name: 'rate', type: 'f64' },
  { name: 'maturity', type: 'i32' },
  { name: 'alive', type: 'u8', def: 1 },
];

export type ScaleId = 'S' | 'M' | 'L';

export interface PolicyEvent {
  tick: number;
  type: 'policy' | 'shock' | 'lab' | 'player';
  id: string; // mã luật, mã cú sốc...
  before?: number;
  after?: number;
  label: string;
  by: string;
}

export interface LedgerState {
  // Vòng đệm bút toán chi tiết
  cap: number;
  head: number; // vị trí ghi kế tiếp
  count: number; // tổng số bút toán từng ghi
  tTick: Int32Array;
  tKind: Uint8Array;
  tFrom: Int32Array;
  tTo: Int32Array;
  tAmount: Float64Array;
  tMedium: Uint8Array;
  tCause: Int32Array;
  // Dòng tiền tháng hiện tại: [khu vực * NKIND + loại]
  flow: Float64Array;
  money: Float64Array; // thay đổi lượng tiền của công chúng theo loại giao dịch
  volume: Float64Array; // tổng giá trị theo loại
  // Lịch sử theo tháng (giữ mãi)
  flowHist: Float64Array;
  moneyHist: Float64Array;
  volumeHist: Float64Array;
  histTicks: number;
  nfaStart: Float64Array; // tài sản tài chính ròng đầu tháng theo khu vực
  nkind: number;
}

export interface DecisionPart {
  reason: string;
  amount: number;
  ref?: number;
}
export interface Decision {
  id: number;
  tick: number;
  agent: number;
  rule: string;
  variable: string;
  before: number;
  after: number;
  parts: DecisionPart[];
  weight?: number; // trọng số của tác nhân trong chỉ số liên quan
}

export interface CausalState {
  nextId: number;
  decisions: Decision[]; // cửa sổ gần đây
  keepTicks: number;
  /** contrib[chỉ số][tháng] = { lý do: mức đóng góp } */
  contrib: Record<string, Array<Record<string, number>>>;
  /** Ô tích luỹ trong tháng, module ghi vào, chỉ số đọc khi khoá sổ. */
  acc: Record<string, Record<string, number>>;
}

export interface SeriesState {
  ids: string[];
  cap: number;
  data: Float64Array; // [tick * ids.length + i]
}

export interface WorldMeta {
  schema: number;
  modules: string[];
  seed: number;
  tick: number;
  startYear: number;
  startMonth: number; // 1..12
  scale: ScaleId;
  nHouseholds: number;
  modified: boolean;
  variants: Record<string, string>;
  scenario?: string;
}

export interface World {
  meta: WorldMeta;
  tables: Record<string, Table>;
  ledger: LedgerState;
  causal: CausalState;
  lawOverrides: Record<string, Array<{ fromTick: number; value: number; by: string }>>;
  params: Record<string, number>; // tham số hành vi đang dùng (sandbox có thể đổi)
  series: SeriesState;
  events: PolicyEvent[];
  ext: Record<string, any>; // trạng thái nhỏ riêng của module, dạng JSON
}

export interface WorldInit {
  seed: number;
  scale: ScaleId;
  nHouseholds: number;
  modules: string[];
  startYear?: number;
  startMonth?: number;
  ledgerCap?: number;
  nkind: number;
  keepDecisionTicks?: number;
}

export function createWorld(init: WorldInit): World {
  const cap = init.ledgerCap ?? 1 << 16;
  const nk = init.nkind;
  const tables: Record<string, Table> = {
    hh: createTable('hh', HH_BASE, Math.max(64, init.nHouseholds)),
    firm: createTable('firm', FIRM_BASE, 64),
    bank: createTable('bank', BANK_BASE, 16),
    gov: createTable('gov', GOV_BASE, 1),
    cb: createTable('cb', CB_BASE, 1),
    loan: createTable('loan', LOAN_BASE, 256),
    bond: createTable('bond', BOND_BASE, 64),
  };
  return {
    meta: {
      schema: 1,
      modules: init.modules,
      seed: init.seed,
      tick: 0,
      startYear: init.startYear ?? 2026,
      startMonth: init.startMonth ?? 1,
      scale: init.scale,
      nHouseholds: init.nHouseholds,
      modified: false,
      variants: {},
    },
    tables,
    ledger: {
      cap,
      head: 0,
      count: 0,
      tTick: new Int32Array(cap),
      tKind: new Uint8Array(cap),
      tFrom: new Int32Array(cap),
      tTo: new Int32Array(cap),
      tAmount: new Float64Array(cap),
      tMedium: new Uint8Array(cap),
      tCause: new Int32Array(cap),
      flow: new Float64Array(NSEC * nk),
      money: new Float64Array(nk),
      volume: new Float64Array(nk),
      flowHist: new Float64Array(NSEC * nk * 128),
      moneyHist: new Float64Array(nk * 128),
      volumeHist: new Float64Array(nk * 128),
      histTicks: 0,
      nfaStart: new Float64Array(NSEC),
      nkind: nk,
    },
    causal: { nextId: 1, decisions: [], keepTicks: init.keepDecisionTicks ?? 24, contrib: {}, acc: {} },
    lawOverrides: {},
    params: {},
    series: { ids: [], cap: 128, data: new Float64Array(0) },
    events: [],
    ext: {},
  };
}

// ---- Lịch ----
export function dateOf(w: World, tick = w.meta.tick): { year: number; month: number; iso: string } {
  const m0 = w.meta.startMonth - 1 + tick;
  const year = w.meta.startYear + Math.floor(m0 / 12);
  const month = (m0 % 12) + 1;
  return { year, month, iso: `${year}-${String(month).padStart(2, '0')}-01` };
}
export function monthOfYear(w: World): number {
  return dateOf(w).month;
}
