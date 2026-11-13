// Khung chuỗi nhân quả (gd0 mục 5).
// Lớp 2: bản ghi quyết định. Lớp 3: phân rã chỉ số theo lý do, lưu theo tháng.
// Hàm explain() dựng cây nhân quả từ các bảng đó; không có quan hệ nào viết tay.

import type { Engine, Upstream } from '../core/engine';
import type { Decision, DecisionPart, PolicyEvent, World } from '../core/world';

/** Ghi một quyết định. `parts` phải cộng đúng bằng after - before. */
export function recordDecision(
  w: World,
  agent: number,
  rule: string,
  variable: string,
  before: number,
  after: number,
  parts: DecisionPart[],
  weight?: number,
): number {
  const delta = after - before;
  let sum = 0;
  for (const p of parts) sum += p.amount;
  const rest = delta - sum;
  if (Math.abs(rest) > 1e-9 * Math.max(1, Math.abs(delta))) parts.push({ reason: 'other', amount: rest });
  const id = w.causal.nextId++;
  w.causal.decisions.push({ id, tick: w.meta.tick, agent, rule, variable, before, after, parts, weight });
  return id;
}

/** Cộng dồn một đóng góp trong tháng cho một kênh; chỉ số đọc lại khi khoá sổ. */
export function accumulate(w: World, channel: string, reason: string, amount: number): void {
  if (amount === 0) return;
  const c = (w.causal.acc[channel] ??= {});
  c[reason] = (c[reason] ?? 0) + amount;
}

export function takeAcc(w: World, channel: string): Record<string, number> {
  return { ...(w.causal.acc[channel] ?? {}) };
}

/** Cuối tháng: dọn bản ghi quyết định quá hạn, xoá ô tích luỹ. */
export function closeCausal(w: World): void {
  const C = w.causal;
  C.acc = {};
  const cut = w.meta.tick - C.keepTicks;
  if (C.decisions.length && C.decisions[0].tick < cut) {
    let i = 0;
    while (i < C.decisions.length && C.decisions[i].tick < cut) i++;
    C.decisions.splice(0, i);
  }
}

/** Chia mức thay đổi của tích a*b thành phần do a và phần do b (đổi lần lượt, lấy trung bình hai thứ tự). */
export function splitProduct(a0: number, a1: number, b0: number, b1: number): [number, number] {
  const da = a1 - a0;
  const db = b1 - b0;
  return [da * (b0 + b1) * 0.5, db * (a0 + a1) * 0.5];
}

// ---------- dựng chuỗi ----------
export interface CausalNode {
  kind: 'indicator' | 'law' | 'event' | 'root' | 'loop';
  id: string;
  label: string;
  unit?: string;
  from?: number;
  to?: number;
  t0?: number;
  t1?: number;
  delta?: number;
  events?: PolicyEvent[];
  children: Array<{ reason: string; label: string; amount: number; share: number; nodes: CausalNode[] }>;
}

export interface ExplainOptions {
  depth?: number;
  minShare?: number;
}

/** Tổng đóng góp theo lý do của một chỉ số trong các tháng (t0, t1]. */
export function contributions(w: World, indicator: string, t0: number, t1: number): Record<string, number> {
  const rows = w.causal.contrib[indicator];
  const out: Record<string, number> = {};
  if (!rows) return out;
  for (let t = Math.max(0, t0 + 1); t <= t1; t++) {
    const r = rows[t];
    if (!r) continue;
    for (const k in r) out[k] = (out[k] ?? 0) + r[k];
  }
  return out;
}

export function explain(eng: Engine, w: World, indicator: string, t0: number, t1: number, opt: ExplainOptions = {}): CausalNode {
  return explainNode(eng, w, indicator, t0, t1, opt.depth ?? 4, opt.minShare ?? 0.1, []);
}

function explainNode(eng: Engine, w: World, indicator: string, t0: number, t1: number, depth: number, minShare: number, path: string[]): CausalNode {
  const def = eng.indicators[eng.indicatorIndex.get(indicator)!];
  t0 = Math.max(0, t0);
  t1 = Math.min(w.meta.tick - 1, t1);
  const from = eng.value(w, indicator, t0);
  const to = eng.value(w, indicator, t1);
  const node: CausalNode = { kind: 'indicator', id: indicator, label: def.label, unit: def.unit, from, to, t0, t1, delta: to - from, children: [] };
  if (depth <= 0) return node;
  const parts = contributions(w, indicator, t0, t1);
  let abs = 0;
  for (const k in parts) abs += Math.abs(parts[k]);
  if (abs === 0) return node;
  const entries = Object.entries(parts).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  let restAmount = 0;
  for (const [reason, amount] of entries) {
    const share = Math.abs(amount) / abs;
    if (share < minShare || reason === 'other') {
      restAmount += amount;
      continue;
    }
    const rdef = eng.reasons.get(reason);
    const child = { reason, label: rdef?.label ?? reason, amount, share, nodes: [] as CausalNode[] };
    for (const up of rdef?.upstream ?? []) child.nodes.push(upstreamNode(eng, w, up, t0, t1, depth, minShare, [...path, indicator]));
    node.children.push(child);
  }
  if (restAmount !== 0) node.children.push({ reason: 'other', label: 'các yếu tố khác', amount: restAmount, share: Math.abs(restAmount) / abs, nodes: [] });
  return node;
}

function upstreamNode(eng: Engine, w: World, up: Upstream, t0: number, t1: number, depth: number, minShare: number, path: string[]): CausalNode {
  if (up.kind === 'indicator') {
    const lag = up.lag ?? 0;
    if (path.includes(up.id)) {
      const def = eng.indicators[eng.indicatorIndex.get(up.id)!];
      return { kind: 'loop', id: up.id, label: def?.label ?? up.id, children: [] };
    }
    if (!eng.indicatorIndex.has(up.id)) return { kind: 'root', id: up.id, label: up.id, children: [] };
    return explainNode(eng, w, up.id, t0 - lag, t1 - lag, depth - 1, minShare, path);
  }
  if (up.kind === 'law' || up.kind === 'event') {
    const evs = w.events.filter((e) => e.id === up.id && e.tick <= t1 && e.tick > t0 - 24);
    const label = up.kind === 'law' ? (eng.laws.get(up.id)?.label ?? up.id) : up.id;
    return { kind: up.kind, id: up.id, label, events: evs, children: [] };
  }
  return { kind: 'root', id: up.label, label: up.label, children: [] };
}

/** Các lá của cây: nguyên nhân gốc tìm được. */
export function rootsOf(node: CausalNode, out: CausalNode[] = []): CausalNode[] {
  if (node.kind !== 'indicator') out.push(node);
  for (const c of node.children) for (const n of c.nodes) rootsOf(n, out);
  return out;
}

export type { Decision };
