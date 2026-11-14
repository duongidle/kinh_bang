// Định dạng số theo kiểu Việt Nam: dấu phẩy thập phân, dấu chấm ngăn nghìn.
const nf = (d: number) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
const cache = [nf(0), nf(1), nf(2), nf(3)];
export const num = (x: number, d = 0) => (Number.isFinite(x) ? cache[d].format(x) : '–');

export function money(x: number): string {
  if (!Number.isFinite(x)) return '–';
  const a = Math.abs(x);
  if (a >= 1e12) return `${num(x / 1e12, 2)} nghìn tỷ`;
  if (a >= 1e9) return `${num(x / 1e9, a >= 1e11 ? 0 : 1)} tỷ`;
  if (a >= 1e6) return `${num(x / 1e6, a >= 1e8 ? 0 : 1)} triệu`;
  return `${num(x)} đ`;
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

/** Mức thay đổi, có dấu. Tỷ lệ thì tính bằng điểm phần trăm. */
export function fmtDelta(d: number, unit: string): string {
  if (!Number.isFinite(d)) return '–';
  const sign = d > 0 ? '+' : d < 0 ? '−' : '';
  const a = Math.abs(d);
  if (unit === 'đồng') return sign + money(a);
  if (unit === '%' || unit === 'tỷ lệ' || unit === '%/năm') return `${sign}${num(a * 100, 2)} điểm`;
  return sign + num(a, a < 10 ? 2 : 0);
}

export const monthLabel = (tick: number, startYear = 2026) => `${String((tick % 12) + 1).padStart(2, '0')}/${startYear + Math.floor(tick / 12)}`;
