// Mức đổi 12 tháng của một chuỗi chỉ số, cho ô số ở dải chỉ số.

/** Điểm cuối so với điểm cách nó 12 tháng. Dưới 13 điểm thì không có.
 *  abs: hiệu tuyệt đối. rel: mức đổi tương đối; mẫu số bằng 0 hoặc không hữu hạn thì không có. */
export function delta12(series: ArrayLike<number>, kind: 'abs' | 'rel'): number | undefined {
  const n = series.length;
  if (n < 13) return undefined;
  const last = series[n - 1];
  const prev = series[n - 13];
  if (!Number.isFinite(last) || !Number.isFinite(prev)) return undefined;
  if (kind === 'abs') return last - prev;
  if (prev === 0) return undefined;
  const r = last / prev - 1;
  return Number.isFinite(r) ? r : undefined;
}

/** Tỷ lệ và phần trăm so bằng hiệu (điểm phần trăm); còn lại so bằng mức đổi tương đối. */
export function deltaKindOf(unit: string): 'abs' | 'rel' {
  return unit === '%' || unit === 'tỷ lệ' ? 'abs' : 'rel';
}
