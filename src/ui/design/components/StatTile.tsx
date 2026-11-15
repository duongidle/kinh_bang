import { fmt, fmtDelta, fmtPctChange } from '../../format';
import { cx } from './util';

export interface StatTileProps {
  label: string;
  value: number;
  /** Đơn vị như fmt() của format.ts nhận: '%', 'đồng', 'chỉ số', ... */
  unit: string;
  /** Mức đổi so với 12 tháng trước. Do nơi gọi đưa vào, thành phần không tự tính. */
  delta12?: number;
  /** abs: hiệu tuyệt đối (tỷ lệ thì ghi điểm phần trăm). rel: mức đổi tương đối, ghi %. */
  deltaKind?: 'abs' | 'rel';
  /** Chiều đổi nào là tốt. Không có thì mức đổi tô màu chữ phụ. */
  goodWhen?: 'up' | 'down';
  /** Đường nhỏ: vẽ đúng giá trị nhận, không làm trơn. */
  series?: number[];
  onExplain?: () => void;
}

function Sparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const finite = series.filter(Number.isFinite);
  if (finite.length < 2) return null;
  const lo = Math.min(...finite);
  const hi = Math.max(...finite);
  const W = 100;
  const H = 24;
  const x = (i: number) => (i / (series.length - 1)) * W;
  const y = (v: number) => (hi === lo ? H / 2 : H - ((v - lo) / (hi - lo)) * H);
  // Điểm không hữu hạn ngắt đường, không nối qua.
  const parts: string[] = [];
  let run: string[] = [];
  series.forEach((v, i) => {
    if (Number.isFinite(v)) run.push(`${x(i).toFixed(2)},${y(v).toFixed(2)}`);
    else if (run.length) {
      parts.push(run.join(' '));
      run = [];
    }
  });
  if (run.length) parts.push(run.join(' '));
  return (
    <svg className="kb-stat__spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {parts.map((p, i) => (
        <polyline key={i} points={p} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function StatTile({ label, value, unit, delta12, deltaKind = 'abs', goodWhen, series, onExplain }: StatTileProps) {
  const valueText = fmt(value, unit);
  const hasDelta = delta12 !== undefined && Number.isFinite(delta12);
  const deltaText = hasDelta ? (deltaKind === 'rel' ? fmtPctChange(delta12) : fmtDelta(delta12, unit)) : '';
  const dir = hasDelta ? Math.sign(delta12) : 0;
  const tone = !goodWhen || dir === 0 ? 'neutral' : (goodWhen === 'up') === dir > 0 ? 'good' : 'bad';
  const arrow = dir > 0 ? '▲' : dir < 0 ? '▼' : '';

  const body = (
    <>
      <span className="kb-stat__label">{label}</span>
      <span className="kb-stat__value kb-num">{valueText}</span>
      {hasDelta && (
        <span className={cx('kb-stat__delta', `kb-stat__delta--${tone}`)}>
          {arrow && <span aria-hidden="true">{arrow}</span>}
          <span className="kb-num">{deltaText}</span>
          <span className="kb-stat__vs"> so với 12 tháng trước</span>
        </span>
      )}
      {series && <Sparkline series={series} />}
    </>
  );

  if (onExplain) {
    const aria = `${label}: ${valueText}${hasDelta ? `, ${deltaText} so với 12 tháng trước` : ''}. Bấm để xem vì sao`;
    return (
      <button type="button" className="kb-stat kb-stat--button" aria-label={aria} onClick={onExplain}>
        {body}
      </button>
    );
  }
  return <div className="kb-stat">{body}</div>;
}
