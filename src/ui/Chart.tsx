// Biểu đồ chuỗi thời gian bằng uPlot.
import { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { fmt, monthLabel } from './format';

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

  useEffect(() => {
    if (!el.current) return;
    const css = getComputedStyle(document.documentElement);
    const axis = css.getPropertyValue('--muted').trim() || '#888';
    const grid = css.getPropertyValue('--line').trim() || '#333';
    const palette = [css.getPropertyValue('--accent').trim() || '#e8b04a', css.getPropertyValue('--muted').trim() || '#888', '#6fb1e0', '#7fd1a3'];
    const u = new uPlot(
      {
        width: el.current.clientWidth || 320,
        height,
        legend: { show: lines.length > 1, live: false },
        cursor: { y: false },
        scales: { x: { time: false } },
        axes: [
          { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { show: false }, values: (_u, v) => v.map((x) => (Number.isInteger(x) ? monthLabel(x) : '')), font: '11px system-ui', space: 70 },
          { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { show: false }, values: (_u, v) => v.map((x) => fmt(x, unit)), font: '11px system-ui', size: 62 },
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
  }, [lines.length, unit, height, marks.join(',')]);

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
