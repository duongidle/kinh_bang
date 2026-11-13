// Vòng lặp tháng, sổ module, luật, tham số, chỉ số, biến thể quy tắc.

import { resolveVersion, type LawParam } from '../../config/law';
import { VN_LAWS } from '../../config/vn/laws';
import { closeCausal } from '../causal/causal';
import { assertInvariants, checkInvariants } from '../ledger/invariants';
import { NKIND } from '../ledger/kinds';
import { beginTick, endTick } from '../ledger/ledger';
import { clone, hashBytes, pack, unpack } from './pack';
import { createWorld, dateOf, type PolicyEvent, type ScaleId, type World } from './world';

// ---------- pha ----------
export const PHASES = [
  'policy', // luật mới, lệnh người chơi, quy tắc tự động của Chính phủ và NHNN
  'expect', // cập nhật kỳ vọng
  'plan', // kế hoạch doanh nghiệp
  'credit', // xin vay, xét duyệt
  'labor', // sa thải, tuyển, tìm việc
  'produce', // sản xuất, lắp máy
  'pay', // lương, chuyển giao
  'goods', // mua hàng
  'tax', // nộp thuế
  'debt', // trả nợ, lãi
  'profit', // lãi lỗ, cổ tức
  'exit', // phá sản, gia nhập
  'banking', // dự trữ, tái cấp vốn, trái phiếu
  'close', // tổng hợp cuối tháng của module
] as const;
export type PhaseId = (typeof PHASES)[number];

// ---------- định nghĩa đăng ký ----------
export interface IndicatorDef {
  id: string;
  label: string;
  unit: 'đồng' | '%' | 'chỉ số' | 'người' | 'số' | 'tỷ lệ';
  group: string;
  compute(w: World): number;
  /** Chia mức thay đổi tháng này theo lý do. Engine tự thêm phần còn lại vào 'other'. */
  contrib?(w: World, prev: number, cur: number): Record<string, number>;
  /** Chỉ số tốt lên khi tăng (1), khi giảm (-1), hay không rõ (0). Dùng cho màu. */
  good?: 1 | -1 | 0;
}

export type Upstream =
  | { kind: 'indicator'; id: string; lag?: number }
  | { kind: 'law'; id: string }
  | { kind: 'event'; id: string }
  | { kind: 'root'; label: string };

export interface ReasonDef {
  id: string;
  /** Câu mẫu tiếng Việt, ví dụ "chi phí lương mỗi sản phẩm tăng". */
  label: string;
  /** Biến mà quy tắc này đọc. Khai báo cấu trúc, không phải kết quả. */
  upstream: Upstream[];
}

export interface RuleDef {
  id: string;
  label: string;
  source: string;
  teaches?: string;
  variants: Array<{ id: string; label: string }>; // phần tử đầu là gốc
}

export interface ParamDef {
  id: string;
  value: number;
  label: string;
  source: string;
  note?: string;
  min?: number;
  max?: number;
}

export interface ModuleCtx {
  engine: Engine;
}

export interface EngineModule {
  id: string;
  stage: number;
  dependsOn: string[];
  schemaVersion: number;
  params?: ParamDef[];
  /** Thêm bảng và cột. Chạy khi tạo thế giới. */
  setup(w: World): void;
  /** Tạo tác nhân và trạng thái ban đầu. */
  init(w: World, eng: Engine): void;
  phases: Partial<Record<PhaseId, (w: World, eng: Engine) => void>>;
  indicators?: IndicatorDef[];
  reasons?: ReasonDef[];
  rules?: RuleDef[];
}

export interface NewWorldOptions {
  seed: number;
  scale: ScaleId;
  nHouseholds?: number;
  startYear?: number;
  startMonth?: number;
  params?: Record<string, number>;
  variants?: Record<string, string>;
  laws?: Record<string, number>;
  scenario?: string;
}

export const SCALE_HOUSEHOLDS: Record<ScaleId, number> = { S: 50, M: 500, L: 5000 };

export class Engine {
  modules: EngineModule[];
  indicators: IndicatorDef[] = [];
  indicatorIndex = new Map<string, number>();
  reasons = new Map<string, ReasonDef>();
  rules = new Map<string, RuleDef>();
  paramDefs = new Map<string, ParamDef>();
  laws = new Map<string, LawParam>();
  /** Kiểm đẳng thức kế toán mỗi tháng (bật trong test và chế độ phát triển). */
  checkEvery = 1;

  constructor(modules: EngineModule[], laws: LawParam[] = VN_LAWS) {
    const ids = new Set<string>();
    for (const m of modules) {
      for (const d of m.dependsOn) if (!ids.has(d)) throw new Error(`Module ${m.id} cần ${d} nạp trước`);
      ids.add(m.id);
    }
    this.modules = modules;
    for (const l of laws) this.laws.set(l.id, l);
    for (const m of modules) {
      for (const ind of m.indicators ?? []) {
        this.indicatorIndex.set(ind.id, this.indicators.length);
        this.indicators.push(ind);
      }
      for (const r of m.reasons ?? []) this.reasons.set(r.id, r);
      for (const r of m.rules ?? []) this.rules.set(r.id, r);
      for (const p of m.params ?? []) this.paramDefs.set(p.id, p);
    }
    this.reasons.set('other', { id: 'other', label: 'các yếu tố khác', upstream: [] });
  }

  newWorld(o: NewWorldOptions): World {
    const n = o.nHouseholds ?? SCALE_HOUSEHOLDS[o.scale];
    const w = createWorld({
      seed: o.seed,
      scale: o.scale,
      nHouseholds: n,
      modules: this.modules.map((m) => m.id),
      startYear: o.startYear,
      startMonth: o.startMonth,
      nkind: NKIND,
      ledgerCap: n >= 5000 ? 1 << 21 : n >= 500 ? 1 << 19 : 1 << 16,
      keepDecisionTicks: n >= 5000 ? 13 : n >= 500 ? 36 : 600,
    });
    w.meta.scenario = o.scenario;
    for (const p of this.paramDefs.values()) w.params[p.id] = p.value;
    for (const [k, v] of Object.entries(o.params ?? {})) w.params[k] = v;
    w.series.ids = this.indicators.map((i) => i.id);
    w.series.data = new Float64Array(w.series.cap * w.series.ids.length);
    for (const [k, v] of Object.entries(o.laws ?? {})) w.lawOverrides[k] = [{ fromTick: 0, value: v, by: 'Điều kiện ban đầu' }];
    for (const m of this.modules) m.setup(w);
    for (const [k, v] of Object.entries(o.variants ?? {})) this.setVariant(w, k, v);
    beginTick(w);
    for (const m of this.modules) m.init(w, this);
    // Giao dịch khởi tạo không tính vào tháng đầu.
    beginTick(w);
    return w;
  }

  // ---------- luật ----------
  law(w: World, id: string, tick = w.meta.tick): number {
    const ov = w.lawOverrides[id];
    if (ov) {
      for (let i = ov.length - 1; i >= 0; i--) if (ov[i].fromTick <= tick) return ov[i].value;
    }
    const p = this.laws.get(id);
    if (!p) throw new Error(`Không có tham số luật: ${id}`);
    return resolveVersion(p, dateOf(w, tick).iso).value;
  }

  /** Người chơi hoặc kịch bản ban hành giá trị mới, có hiệu lực từ tháng hiện tại. */
  setLaw(w: World, id: string, value: number, by = 'Người chơi'): void {
    const p = this.laws.get(id);
    if (!p) throw new Error(`Không có tham số luật: ${id}`);
    const before = this.law(w, id);
    if (before === value) return;
    (w.lawOverrides[id] ??= []).push({ fromTick: w.meta.tick, value, by });
    this.event(w, { type: 'policy', id, before, after: value, label: p.label, by });
  }

  event(w: World, e: Omit<PolicyEvent, 'tick'>): void {
    w.events.push({ tick: w.meta.tick, ...e });
  }

  // ---------- tham số và biến thể ----------
  param(w: World, id: string): number {
    const v = w.params[id];
    if (v === undefined) throw new Error(`Không có tham số: ${id}`);
    return v;
  }

  variant(w: World, ruleId: string): string {
    return w.meta.variants[ruleId] ?? this.rules.get(ruleId)?.variants[0].id ?? 'base';
  }

  setVariant(w: World, ruleId: string, variantId: string): void {
    const r = this.rules.get(ruleId);
    if (!r) throw new Error(`Không có quy tắc: ${ruleId}`);
    const v = r.variants.find((x) => x.id === variantId);
    if (!v) throw new Error(`Quy tắc ${ruleId} không có biến thể ${variantId}`);
    const base = r.variants[0].id;
    if (variantId === base) delete w.meta.variants[ruleId];
    else {
      w.meta.variants[ruleId] = variantId;
      w.meta.modified = true; // không tự tắt (K0.11)
    }
    this.event(w, { type: 'lab', id: ruleId, label: `${r.label}: ${v.label}`, by: 'Phòng thí nghiệm' });
  }

  // ---------- bước thời gian ----------
  step(w: World): void {
    beginTick(w);
    for (const ph of PHASES) {
      for (const m of this.modules) {
        const f = m.phases[ph];
        if (f) f(w, this);
      }
    }
    this.recordIndicators(w);
    endTick(w);
    if (this.checkEvery > 0 && w.meta.tick % this.checkEvery === 0) assertInvariants(w);
    w.meta.tick++;
  }

  run(w: World, months: number): void {
    for (let i = 0; i < months; i++) this.step(w);
  }

  private recordIndicators(w: World): void {
    const S = w.series;
    const n = S.ids.length;
    const t = w.meta.tick;
    if ((t + 1) * n > S.data.length) {
      S.cap *= 2;
      const next = new Float64Array(S.cap * n);
      next.set(S.data);
      S.data = next;
    }
    for (let i = 0; i < n; i++) {
      const ind = this.indicators[i];
      const cur = ind.compute(w);
      S.data[t * n + i] = cur;
      if (ind.contrib) {
        const prev = t > 0 ? S.data[(t - 1) * n + i] : cur;
        const parts = t > 0 ? ind.contrib(w, prev, cur) : {};
        let sum = 0;
        for (const k in parts) sum += parts[k];
        const rest = cur - prev - sum;
        if (Math.abs(rest) > 1e-12) parts.other = (parts.other ?? 0) + rest;
        (w.causal.contrib[ind.id] ??= [])[t] = parts;
      }
    }
    closeCausal(w);
  }

  // ---------- đọc chuỗi ----------
  value(w: World, id: string, tick = w.meta.tick - 1): number {
    const i = this.indicatorIndex.get(id);
    if (i === undefined) throw new Error(`Không có chỉ số: ${id}`);
    if (tick < 0) return NaN;
    return w.series.data[tick * w.series.ids.length + i];
  }

  seriesOf(w: World, id: string, from = 0, to = w.meta.tick): Float64Array {
    const i = this.indicatorIndex.get(id);
    if (i === undefined) throw new Error(`Không có chỉ số: ${id}`);
    const n = w.series.ids.length;
    const out = new Float64Array(Math.max(0, to - from));
    for (let t = from; t < to; t++) out[t - from] = w.series.data[t * n + i];
    return out;
  }

  // ---------- lưu, tải, tách nhánh ----------
  save(w: World): Uint8Array {
    return pack(w);
  }
  load(bytes: Uint8Array): World {
    const w = unpack<World>(bytes);
    const want = this.modules.map((m) => m.id).join(',');
    if (w.meta.modules.join(',') !== want) throw new Error(`Ván lưu dùng module ${w.meta.modules.join(',')}, engine đang nạp ${want}`);
    return w;
  }
  fork(w: World): World {
    return clone(w);
  }
  hash(w: World): string {
    return hashBytes(pack(w));
  }
  check(w: World): string[] {
    return checkInvariants(w);
  }
}
