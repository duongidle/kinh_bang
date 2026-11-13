// Bảng dạng mảng cột. Dữ liệu thuần, không có phương thức, để đóng gói và sao chép được nguyên khối.

export type ColType = 'f64' | 'i32' | 'u8';
export type Col = Float64Array | Int32Array | Uint8Array;

export interface ColSpec {
  name: string;
  type: ColType;
  def?: number;
}

export interface Table {
  name: string;
  n: number;
  cap: number;
  specs: ColSpec[];
  cols: Record<string, Col>;
}

function alloc(type: ColType, cap: number): Col {
  if (type === 'f64') return new Float64Array(cap);
  if (type === 'i32') return new Int32Array(cap);
  return new Uint8Array(cap);
}

export function createTable(name: string, specs: ColSpec[], cap = 64): Table {
  const cols: Record<string, Col> = {};
  for (const s of specs) cols[s.name] = alloc(s.type, cap);
  return { name, n: 0, cap, specs: specs.map((s) => ({ ...s })), cols };
}

function grow(t: Table, need: number): void {
  let cap = t.cap;
  while (cap < need) cap *= 2;
  for (const s of t.specs) {
    const next = alloc(s.type, cap);
    next.set(t.cols[s.name].subarray(0, t.n) as any);
    t.cols[s.name] = next;
  }
  t.cap = cap;
}

/** Thêm một dòng, trả về chỉ số dòng. Cột không nêu nhận giá trị mặc định. */
export function addRow(t: Table, values: Record<string, number> = {}): number {
  if (t.n + 1 > t.cap) grow(t, t.n + 1);
  const i = t.n++;
  for (const s of t.specs) t.cols[s.name][i] = values[s.name] ?? s.def ?? 0;
  return i;
}

/** Thêm cột mới vào bảng đã có (module gắn thêm ở giai đoạn sau). */
export function addColumns(t: Table, specs: ColSpec[]): void {
  for (const s of specs) {
    if (t.cols[s.name]) continue;
    const c = alloc(s.type, t.cap);
    if (s.def) c.fill(s.def, 0, t.n);
    t.cols[s.name] = c;
    t.specs.push({ ...s });
  }
}

export function f64(t: Table, name: string): Float64Array {
  return t.cols[name] as Float64Array;
}
export function i32(t: Table, name: string): Int32Array {
  return t.cols[name] as Int32Array;
}
export function u8(t: Table, name: string): Uint8Array {
  return t.cols[name] as Uint8Array;
}

export function sumCol(t: Table, name: string): number {
  const c = t.cols[name];
  let s = 0;
  for (let i = 0; i < t.n; i++) s += c[i];
  return s;
}
