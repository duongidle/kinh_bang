export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');

/**
 * Đọc số theo kiểu Việt Nam: dấu phẩy là thập phân, dấu chấm ngăn nghìn.
 * "1.234,5" -> 1234.5; "1.234.567" -> 1234567; "2.5" -> 2.5 (một dấu chấm không theo nhóm ba chữ số được hiểu là thập phân).
 * Trả NaN nếu không đọc được.
 */
export function parseViNumber(text: string): number {
  const t = text.trim().replace(/\s/g, '').replace(/^\+/, '').replace(/^[−–]/, '-');
  if (!t) return NaN;
  let s: string;
  if (t.includes(',')) s = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) s = t.replace(/\./g, '');
  else s = t;
  return /^-?\d*\.?\d+$/.test(s) || /^-?\d+\.$/.test(s) ? Number(s) : NaN;
}

/** Số chữ số thập phân suy ra từ bước nhảy, tối đa 3 (num() của format.ts chỉ làm tròn tới 3). */
export function decimalsOf(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;
  let d = 0;
  while (d < 3 && Math.abs(step * 10 ** d - Math.round(step * 10 ** d)) > 1e-9) d++;
  return d;
}
