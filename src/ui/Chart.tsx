// Biểu đồ chuỗi thời gian bằng uPlot.
import { useEffect, useRef, useState } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { fmtAxis, monthLabel } from './format';
import { themes } from './design/tokens';
import { onThemeChange, resolvedTheme } from './theme';

/** Vạch chia trục tung: khoảng 4 vạch nằm trong miền nhìn, bước tròn (1, 2, 5). */
function niceSplits(lo: number, hi: number): number[] {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / pow;
  const step = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * pow;
  const out: number[] = [];
  for (let x = Math.ceil(lo / step - 1e-9) * step; x <= hi + step * 1e-9; x += step) out.push(Math.round(x / step) * step);
  return out;
}

export interface Line {
  label: string;
  data: ArrayLike<number>;
  color?: string;
  dash?: number[];
}

export function Chart({ lines, from = 0, unit, height = 180, marks = [] }: { lines: Line[]; from?: number; unit: string; height?: number; marks?: number[] }) {
  const el = useRef<HTMLDivElement>(null);
  const plot = useRef<uPlot | null>(null);
  const n = lines[0]?.data.length ?? 0;
  const [themeTick, setThemeTick] = useState(0);
  useEffect(() => onThemeChange(() => setThemeTick((k) => k + 1)), []);

  useEffect(() => {
    if (!el.current) return;
    const css = getComputedStyle(document.documentElement);
    const fb = themes[resolvedTheme()];
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const axis = token('--color-text-3', fb.text3);
    const grid = token('--color-line', fb.line);
    const palette = [token('--color-accent', fb.accent), token('--color-text-2', fb.text2), token('--color-flow-wage', fb.flowWage), token('--color-flow-credit', fb.flowCredit)];
    const u = new uPlot(
      {
        width: el.current.clientWidth || 320,
        height,
        legend: { show: lines.length > 1, live: false },
        cursor: { y: false },
        scales: { x: { time: false } },
        axes: [
          { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { show: false }, values: (_u, v) => v.map((x) => (Number.isInteger(x) ? monthLabel(x) : '')), font: '11px system-ui', space: 70 },
          { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { show: false }, splits: (_u, _i, lo, hi) => niceSplits(lo, hi), values: (_u, v, _i, _s, incr) => fmtAxis(v, v.length > 1 ? v[1] - v[0] : incr, unit), font: '11px system-ui', size: 62 },
        ],
        series: [{}, ...lines.map((l, i) => ({ label: l.label, stroke: l.color ?? palette[i % palette.length], width: 1.6, dash: l.dash, points: { show: false } }))],
        hooks: {
          draw: [
            (up) => {
              const c = up.ctx;
              c.save();
              c.strokeStyle = palette[0];
              c.globalAlpha = 0.45;
              c.setLineDash([3, 3]);
              for (const m of marks) {
                const x = Math.round(up.valToPos(m, 'x', true));
                if (x < up.bbox.left || x > up.bbox.left + up.bbox.width) continue;
                c.beginPath();
                c.moveTo(x, up.bbox.top);
                c.lineTo(x, up.bbox.top + up.bbox.height);
                c.stroke();
              }
              c.restore();
            },
          ],
        },
      },
      [[], ...lines.map(() => [])] as unknown as uPlot.AlignedData,
      el.current,
    );
    plot.current = u;
    const ro = new ResizeObserver(() => el.current && u.setSize({ width: el.current.clientWidth, height }));
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      u.destroy();
      plot.current = null;
    };
  }, [lines.length, unit, height, marks.join(','), themeTick]);

  useEffect(() => {
    const u = plot.current;
    if (!u) return;
    const xs = new Float64Array(n);
    for (let i = 0; i < n; i++) xs[i] = from + i;
    u.setData([xs, ...lines.map((l) => (l.data instanceof Float64Array ? l.data : Float64Array.from(l.data as number[])))] as unknown as uPlot.AlignedData);
  });

  return <div ref={el} className="chart" />;
}

/** Đường nhỏ không trục, cho dải chỉ số. */
export function Spark({ data, good }: { data: ArrayLike<number>; good: number }) {
  const n = data.length;
  if (n < 2) return <svg className="spark" viewBox="0 0 60 18" />;
  const k = Math.max(0, n - 60);
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = k; i < n; i++) {
    lo = Math.min(lo, data[i]);
    hi = Math.max(hi, data[i]);
  }
  const span = hi - lo || 1;
  let d = '';
  for (let i = k; i < n; i++) d += `${i === k ? 'M' : 'L'}${(((i - k) / Math.max(1, n - k - 1)) * 60).toFixed(1)},${(16 - ((data[i] - lo) / span) * 14).toFixed(1)}`;
  const dir = Math.sign(data[n - 1] - data[Math.max(k, n - 13)]) * good;
  return (
    <svg className={`spark ${dir > 0 ? 'up' : dir < 0 ? 'down' : ''}`} viewBox="0 0 60 18" aria-hidden="true">
      <path d={d} fill="none" strokeWidth="1.4" />
    </svg>
  );
}
