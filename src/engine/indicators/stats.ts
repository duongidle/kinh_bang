// Thống kê dùng cho kiểm định và cho dashboard: lọc Hodrick-Prescott, tương quan, độ lệch chuẩn.
// Hàm thuần, không phụ thuộc engine.

/** Lọc Hodrick-Prescott. Trả về thành phần chu kỳ (chuỗi trừ xu hướng). Chuỗi quý dùng lambda = 1600. */
export function hpCycle(y: ArrayLike<number>, lambda = 1600): Float64Array {
  const n = y.length;
  const out = new Float64Array(n);
  if (n < 5) return out;
  // Giải (I + lambda * D'D) tau = y, ma trận năm đường chéo, bằng khử Gauss trên dải.
  const a = new Float64Array(n); // đường chéo chính
  const b = new Float64Array(n); // chéo +1
  const c = new Float64Array(n); // chéo +2
  for (let i = 0; i < n; i++) {
    a[i] = 1 + lambda * (i === 0 || i === n - 1 ? 1 : i === 1 || i === n - 2 ? 5 : 6);
    b[i] = i < n - 1 ? lambda * (i === 0 || i === n - 2 ? -2 : -4) : 0;
    c[i] = i < n - 2 ? lambda : 0;
  }
  const d = Float64Array.from(y as ArrayLike<number>);
  // ma trận đối xứng: dùng phân rã LDL' cho dải rộng 2
  const l1 = new Float64Array(n);
  const l2 = new Float64Array(n);
  const D = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let di = a[i];
    if (i >= 1) di -= l1[i - 1] * l1[i - 1] * D[i - 1];
    if (i >= 2) di -= l2[i - 2] * l2[i - 2] * D[i - 2];
    D[i] = di;
    if (i < n - 1) {
      let e = b[i];
      if (i >= 1) e -= l1[i - 1] * l2[i - 1] * D[i - 1];
      l1[i] = e / di;
    }
    if (i < n - 2) l2[i] = c[i] / di;
  }
  // L z = d
  for (let i = 0; i < n; i++) {
    if (i >= 1) d[i] -= l1[i - 1] * d[i - 1];
    if (i >= 2) d[i] -= l2[i - 2] * d[i - 2];
  }
  for (let i = 0; i < n; i++) d[i] /= D[i];
  for (let i = n - 1; i >= 0; i--) {
    if (i + 1 < n) d[i] -= l1[i] * d[i + 1];
    if (i + 2 < n) d[i] -= l2[i] * d[i + 2];
  }
  for (let i = 0; i < n; i++) out[i] = y[i] - d[i];
  return out;
}

export function mean(x: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i];
  return x.length ? s / x.length : NaN;
}

export function sd(x: ArrayLike<number>): number {
  const m = mean(x);
  let s = 0;
  for (let i = 0; i < x.length; i++) s += (x[i] - m) ** 2;
  return x.length ? Math.sqrt(s / x.length) : NaN;
}

/** Tương quan giữa x[t] và y[t + lag]. */
export function corr(x: ArrayLike<number>, y: ArrayLike<number>, lag = 0): number {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let t = 0; t < x.length; t++) {
    const u = t + lag;
    if (u < 0 || u >= y.length) continue;
    xs.push(x[t]);
    ys.push(y[u]);
  }
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
}

/** Gộp chuỗi tháng thành quý: tổng (dòng) hoặc trung bình (mức). */
export function toQuarterly(x: ArrayLike<number>, how: 'sum' | 'mean' = 'mean'): Float64Array {
  const n = Math.floor(x.length / 3);
  const out = new Float64Array(n);
  for (let q = 0; q < n; q++) {
    const s = x[3 * q] + x[3 * q + 1] + x[3 * q + 2];
    out[q] = how === 'sum' ? s : s / 3;
  }
  return out;
}

export function logOf(x: ArrayLike<number>): Float64Array {
  const out = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = Math.log(Math.max(x[i], 1e-9));
  return out;
}

export function skewness(x: ArrayLike<number>): number {
  const m = mean(x);
  let m2 = 0;
  let m3 = 0;
  for (let i = 0; i < x.length; i++) {
    m2 += (x[i] - m) ** 2;
    m3 += (x[i] - m) ** 3;
  }
  m2 /= x.length;
  m3 /= x.length;
  return m2 > 0 ? m3 / Math.pow(m2, 1.5) : 0;
}
