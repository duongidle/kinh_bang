// Giao thức engine <-> UI (gd0 mục 7.2). Mọi tin nhắn đi qua Worker đều có kiểu ở đây.
// Đổi cấu trúc tin thì tăng PROTOCOL_VERSION.

export const PROTOCOL_VERSION = 1;

export type ScaleId = 'S' | 'M' | 'L';
export type Role = 'observer' | 'government' | 'fiscal' | 'monetary' | 'household' | 'firm';

export interface Intervention {
  laws?: Record<string, number>;
  params?: Record<string, number>;
  variants?: Record<string, string>;
}

/** Lệnh đứng của người chơi cho tác nhân đang điều khiển. null: để quy tắc tự lái. */
export interface PlayerOrders {
  hhBudget: number | null;
  hhResWage: number | null;
  hhQuit: boolean;
  hhOpenBiz: boolean;
  firmPrice: number | null;
  firmWage: number | null;
  firmWorkers: number | null;
  firmInvest: number | null;
}

export type Query =
  | { kind: 'series'; ids?: string[]; from?: number }
  | { kind: 'explain'; indicator: string; t0: number; t1: number; depth?: number }
  | { kind: 'agent'; sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb'; id: number }
  | { kind: 'agents'; sector: 'hh' | 'firm' | 'bank' }
  | { kind: 'money'; t0: number; t1: number }
  | { kind: 'flows'; t0: number; t1: number }
  | { kind: 'hash' }
  | { kind: 'scenarioReport' };

export type Command =
  | { type: 'init'; scale: ScaleId; seed: number; scenario?: string; setup?: Intervention }
  | { type: 'step'; months: number; frame?: boolean }
  | { type: 'policy'; id: string; value: number }
  | { type: 'param'; id: string; value: number }
  | { type: 'lab'; rule: string; variant: string }
  | { type: 'possess'; sector: 'hh' | 'firm' | null; id?: number }
  | { type: 'orders'; orders: Partial<PlayerOrders> }
  | { type: 'query'; rid: number; q: Query }
  /** Thế giới song song: chạy lại từ trước khi các lệnh `skip` (số thứ tự trong nhật ký lệnh) được ban hành. */
  | { type: 'counterfactual'; rid: number; skip: number[] | 'lab' | 'player' }
  | { type: 'save'; rid: number }
  | { type: 'load'; bytes: Uint8Array };

// ---------- danh mục gửi một lần khi sẵn sàng ----------
export interface IndicatorInfo {
  id: string;
  label: string;
  unit: string;
  group: string;
  good: number;
  explainable: boolean;
}
export interface LawInfo {
  id: string;
  label: string;
  unit: string;
  group: string;
  owner: 'fiscal' | 'monetary';
  min?: number;
  max?: number;
  step?: number;
  note?: string;
  source: string;
  verification: string;
}
export interface RuleInfo {
  id: string;
  label: string;
  source: string;
  teaches?: string;
  variants: Array<{ id: string; label: string }>;
}
export interface ParamInfo {
  id: string;
  label: string;
  source: string;
  note?: string;
}
export interface NamedAgent {
  sector: 'hh' | 'firm';
  id: number;
  name: string;
  story: string;
}
export interface ScenarioInfo {
  id: string;
  title: string;
  role: Role;
  scale: ScaleId;
  question: string;
  intro: string;
  prereq: string[];
  months: number;
  goals: Array<{ id: string; label: string }>;
  predict: Array<{ indicator: string; question: string }>;
  untested?: boolean;
  history?: string;
}

export interface Catalog {
  protocol: number;
  indicators: IndicatorInfo[];
  laws: LawInfo[];
  rules: RuleInfo[];
  params: ParamInfo[];
  txKinds: Array<{ id: string; label: string; flow: boolean }>;
  sectors: string[];
  scenarios: ScenarioInfo[];
}

// ---------- khung bản đồ và mẫu giao dịch ----------
export const HH_UNEMPLOYED = 0;
export const HH_FORMAL = 1;
export const HH_INFORMAL = 2;
export const HH_PUBLIC = 3;
export const HH_OWNER = 4;
export const HH_SOLO = 5;

export interface MapFrame {
  nHh: number;
  hhStatus: Uint8Array; // HH_*
  hhWealth: Uint8Array; // nhóm của cải 0..4 (ngũ phân vị)
  hhEmployer: Int32Array; // id nơi làm, -1 thất nghiệp, -2 Nhà nước
  nFirm: number;
  firmAlive: Uint8Array;
  firmKind: Uint8Array; // 0 doanh nghiệp, 1 hộ kinh doanh, 2 tự làm
  firmSector: Uint8Array;
  firmWorkers: Int32Array;
  firmStock: Float32Array; // tồn kho so với doanh số kỳ vọng
  firmDistress: Uint8Array;
  firmState: Uint8Array; // 1 nếu thuộc Nhà nước
  nBank: number;
  bankCar: Float32Array;
}

export interface TxSample {
  n: number;
  kind: Uint8Array;
  from: Int32Array; // mã tham chiếu: khu vực ở 8 bit cao, số thứ tự ở 24 bit thấp
  to: Int32Array;
  amount: Float64Array;
  /** Tổng đúng theo loại giao dịch của cả tháng. Con số hiển thị lấy từ đây, không từ mẫu. */
  totals: Float64Array;
}

export interface NewsItem {
  tick: number;
  text: string;
  indicator?: string;
  tone: -1 | 0 | 1;
}

export interface EventInfo {
  index: number; // số thứ tự trong nhật ký lệnh, -1 nếu là sự kiện tự động
  tick: number;
  type: string;
  id: string;
  label: string;
  by: string;
  before?: number;
  after?: number;
}

export interface PlayerView {
  hh: number;
  firm: number;
  orders: PlayerOrders;
  auto: { budget: number; price: number; wage: number; workers: number; invest: number };
}

export interface ScenarioState {
  id: string;
  monthsLeft: number;
  done: boolean;
  goals: Array<{ id: string; label: string; ok: boolean; value: string }>;
}

export interface TickMsg {
  type: 'tick';
  tick: number; // số tháng đã chạy xong
  year: number;
  month: number;
  values: Float64Array; // theo thứ tự catalog.indicators, của tháng vừa xong
  laws: Float64Array; // theo thứ tự catalog.laws
  params: Record<string, number>;
  variants: Record<string, string>;
  modified: boolean;
  frame?: MapFrame;
  tx?: TxSample;
  news: NewsItem[];
  events: EventInfo[];
  player: PlayerView;
  scenario?: ScenarioState;
  ms: number; // thời gian engine tính, mili giây mỗi tháng
}

// ---------- kết quả truy vấn ----------
export interface SeriesResult {
  from: number;
  n: number;
  ids: string[];
  data: Float64Array; // [chỉ số][tháng], nối nhau
}
export interface CausalTree {
  kind: 'indicator' | 'law' | 'event' | 'root' | 'loop';
  id: string;
  label: string;
  unit?: string;
  from?: number;
  to?: number;
  t0?: number;
  t1?: number;
  delta?: number;
  events?: EventInfo[];
  children: Array<{ reason: string; label: string; amount: number; share: number; nodes: CausalTree[] }>;
}
export interface SheetLine {
  label: string;
  amount: number;
}
export interface AgentDetail {
  sector: string;
  id: number;
  title: string;
  subtitle: string;
  story?: string;
  alive: boolean;
  facts: Array<{ label: string; value: number; unit: string }>;
  assets: SheetLine[];
  liabilities: SheetLine[];
  netWorth: number;
  decisions: Array<{ tick: number; rule: string; variable: string; before: number; after: number; parts: Array<{ label: string; amount: number }> }>;
  tx: Array<{ tick: number; kind: string; other: string; amount: number; medium: number }>;
}
export interface AgentRow {
  id: number;
  title: string;
  subtitle: string;
  size: number;
  named: boolean;
}
export interface MoneyResult {
  t0: number;
  t1: number;
  rows: Array<{ kind: string; label: string; amount: number }>;
  total: number;
  cash: number;
  deposits: number;
}
export interface FlowsResult {
  sectors: string[];
  rows: Array<{ kind: string; label: string; bySector: number[] }>;
}
export interface CounterfactualResult {
  from: number; // tháng tách nhánh
  n: number;
  ids: string[];
  actual: Float64Array;
  control: Float64Array;
  label: string;
}
export interface ClaimResult {
  text: string;
  ok: boolean;
  detail: string;
}
export interface ScenarioReport {
  id: string;
  won: boolean;
  goals: ScenarioState['goals'];
  claims: ClaimResult[];
  explanation: string;
  history?: string;
  simplifications: string[];
}

export type QueryData = SeriesResult | CausalTree | AgentDetail | AgentRow[] | MoneyResult | FlowsResult | CounterfactualResult | ScenarioReport | { hash: string } | { bytes: Uint8Array };

export type EngineMsg =
  | { type: 'ready'; catalog: Catalog; named: NamedAgent[]; scenario?: ScenarioInfo; seed: number; scale: ScaleId }
  | TickMsg
  | { type: 'result'; rid: number; data: QueryData }
  | { type: 'error'; rid?: number; message: string }
  | { type: 'violation'; tick: number; problems: string[] };
