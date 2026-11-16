// Định dạng số theo kiểu Việt Nam: dấu phẩy thập phân, dấu chấm ngăn nghìn.
const nf = (d: number) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
const cache = [nf(0), nf(1), nf(2), nf(3)];
export const num = (x: number, d = 0) => (Number.isFinite(x) ? cache[d].format(x) : '–');

export function money(x: number): string {
  if (!Number.isFinite(x)) return '–';
  const a = Math.abs(x);
  if (a >= 1e12) return `${num(x / 1e12, 2)} nghìn tỷ đồng`;
  if (a >= 1e9) return `${num(x / 1e9, a >= 1e11 ? 0 : 1)} tỷ đồng`;
  if (a >= 1e6) return `${num(x / 1e6, a >= 1e8 ? 0 : 1)} triệu đồng`;
  return `${num(x)} đồng`;
}

/** Hiện một giá trị theo đơn vị của chỉ số hoặc luật. */
export function fmt(x: number, unit: string): string {
  if (!Number.isFinite(x)) return '–';
  if (unit === 'đồng' || unit.startsWith('đồng/')) return money(x);
  if (unit === '%' || unit === 'tỷ lệ' || unit === '%/năm') return `${num(x * 100, Math.abs(x) < 0.1 ? 2 : 1)}%`;
  if (unit === 'chỉ số') return num(x, Math.abs(x) < 10 ? 2 : 1);
  if (unit === 'bật/tắt') return x >= 0.5 ? 'Bật' : 'Tắt';
  return num(x, Number.isInteger(x) ? 0 : 1);
}

/** Một dòng "sự thật" của tác nhân (AgentDetail.facts) theo đơn vị của nó. */
export const factText = (unit: string, v: number): string => (unit === '%' ? `${num(v * 100, 1)}%` : unit === 'đồng' ? money(v) : num(v, Number.isInteger(v) ? 0 : 1));

/** Mức thay đổi, có dấu. Tỷ lệ thì tính bằng điểm phần trăm. */
export function fmtDelta(d: number, unit: string): string {
  if (!Number.isFinite(d)) return '–';
  const sign = d > 0 ? '+' : d < 0 ? '−' : '';
  const a = Math.abs(d);
  if (unit === 'đồng') return sign + money(a);
  if (unit === '%' || unit === 'tỷ lệ' || unit === '%/năm') return `${sign}${num(a * 100, 2)} điểm phần trăm`;
  return sign + num(a, a < 10 ? 2 : a < 100 ? 1 : 0);
}

/** Mức đổi tương đối (0,025 = +2,5%). Có dấu, một chữ số thập phân. Hiệu của hai tỷ lệ thì dùng fmtDelta (điểm phần trăm). */
export function fmtPctChange(rel: number): string {
  if (!Number.isFinite(rel)) return '–';
  const p = Math.round(Math.abs(rel) * 1000) / 10;
  const sign = p === 0 ? '' : rel > 0 ? '+' : '−';
  return `${sign}${num(p, 1)}%`;
}

// Năm bắt đầu lấy từ engine (tin tick), không đoán.
let START_YEAR = 2026;
export const setStartYear = (y: number) => {
  START_YEAR = y;
};
export const monthLabel = (tick: number, startYear = START_YEAR) => `${String((tick % 12) + 1).padStart(2, '0')}/${startYear + Math.floor(tick / 12)}`;

/** Nhãn trục tung: số chữ số tuỳ theo bước chia, để các vạch không trùng nhãn. */
export function fmtAxis(splits: number[], incr: number, unit: string): string[] {
  const out = (x: number, d: number) => num(x, Math.max(0, Math.min(3, d)));
  const digitsFor = (step: number) => (step > 0 && Number.isFinite(step) ? Math.ceil(-Math.log10(step) - 1e-9) : 0);
  if (unit === 'đồng' || unit.startsWith('đồng/')) {
    const top = Math.max(...splits.map((x) => Math.abs(x)));
    const [div, suf] = top >= 1e12 ? [1e12, 'nghìn tỷ'] : top >= 1e9 ? [1e9, 'tỷ'] : top >= 1e6 ? [1e6, 'triệu'] : [1, 'đ'];
    return splits.map((x) => `${out(x / div, digitsFor(incr / div))} ${suf}`);
  }
  if (unit === '%' || unit === 'tỷ lệ' || unit === '%/năm') return splits.map((x) => `${out(x * 100, digitsFor(incr * 100))}%`);
  return splits.map((x) => out(x, digitsFor(incr)));
}
