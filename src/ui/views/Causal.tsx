// Chuỗi nhân quả của một chỉ số: biểu đồ có mốc sự kiện, phân rã theo lý do, đối chứng từ các sự kiện.
import { useMemo, useState } from 'react';
import type { CausalTree } from '../../protocol';
import { Chart } from '../Chart';
import { engine } from '../client';
import { fmt, fmtDelta, monthLabel } from '../format';
import { useStore } from '../store';
import { useQuery } from './useQuery';

// ---------- chuỗi nhân quả ----------
const VIA: Record<string, { id: string; why: string }> = {
  'inflation.yoy': { id: 'cpi', why: 'Lạm phát là tốc độ tăng của chỉ số giá. Phần phân rã dưới đây là của chỉ số giá trong cùng khoảng thời gian.' },
  'inflation.mom': { id: 'cpi', why: 'Lạm phát là tốc độ tăng của chỉ số giá. Phần phân rã dưới đây là của chỉ số giá trong cùng khoảng thời gian.' },
  'gdp.real': { id: 'gdp.nominal', why: 'GDP thực là GDP danh nghĩa đã bỏ phần tăng giá. Phần phân rã dưới đây là của GDP danh nghĩa; xem thêm chỉ số giá để tách phần do giá.' },
  'consumption.real': { id: 'consumption', why: 'Tiêu dùng thực là tiêu dùng danh nghĩa đã bỏ phần tăng giá. Phần phân rã dưới đây là của tiêu dùng danh nghĩa.' },
};
export function Causal({ indicator }: { indicator: string }) {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick!.tick);
  const series = useStore((s) => s.series);
  const events = useStore((s) => s.events);
  const openDialog = useStore((s) => s.openDialog);
  const [span, setSpan] = useState(12);
  const def = catalog.indicators.find((x) => x.id === indicator)!;
  const t1 = tick - 1;
  const t0 = Math.max(0, t1 - span);
  // Chỉ số suy ra từ một chỉ số khác thì mượn phần phân rã của chỉ số gốc, và nói rõ điều đó.
  const via = def.explainable ? undefined : VIA[indicator];
  const target = via?.id ?? indicator;
  const tdef = catalog.indicators.find((x) => x.id === target)!;
  const { data, error } = useQuery(() => engine.query<CausalTree>({ kind: 'explain', indicator: target, t0, t1, depth: 3 }), [target, span]);
  const marks = useMemo(() => events.filter((e) => e.by === 'Người chơi' || e.by === 'Kịch bản').map((e) => e.tick), [events]);
  return (
    <>
      <h3>{def.label}</h3>
      <Chart lines={[{ label: def.label, data: series(indicator) }]} unit={def.unit} marks={marks} />
      <div className="seg" role="group" aria-label="Khoảng thời gian">
        {[3, 12, 36, 120].map((m) => (
          <button key={m} className={span === m ? 'on' : ''} onClick={() => setSpan(m)}>
            {m < 12 ? `${m} tháng` : `${m / 12} năm`}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          {via && <p className="hint">{via.why}</p>}
          <p className="lead">
            {via ? `${tdef.label}, từ` : 'Từ'} {monthLabel(data.t0 ?? t0)} tới {monthLabel(data.t1 ?? t1)}: {fmt(data.from ?? NaN, tdef.unit)} → {fmt(data.to ?? NaN, tdef.unit)} ({fmtDelta(data.delta ?? NaN, tdef.unit)}).
          </p>
          {data.children.length === 0 ? (
            <p className="hint">{tdef.explainable ? 'Không có thay đổi đáng kể trong khoảng này.' : 'Chỉ số này chưa có phần phân rã theo lý do. Xem các chỉ số nó phụ thuộc trong mục Biểu đồ.'}</p>
          ) : (
            <>
              <p className="tagline">
                Phân rã: hạch toán các lý do trực tiếp, cộng lại đúng bằng mức thay đổi.{' '}
                <button className="link" onClick={() => openDialog({ kind: 'notes', id: 'phan-ra-va-doi-chung' })}>
                  Khác gì với đối chứng?
                </button>
              </p>
              <Tree node={data} unit={tdef.unit} depth={0} />
            </>
          )}
        </>
      )}
    </>
  );
}

function Tree({ node, unit, depth }: { node: CausalTree; unit: string; depth: number }) {
  const catalog = useStore((s) => s.catalog)!;
  const whatIf = useStore((s) => s.whatIf);
  const [busy, setBusy] = useState(false);
  if (node.kind === 'loop') return <p className="leaf loop">Vòng phản hồi: quay lại "{node.label}".</p>;
  if (node.kind === 'root') return <p className="leaf">Điểm gốc: {node.label}.</p>;
  if (node.kind === 'law' || node.kind === 'event') {
    const evs = node.events ?? [];
    const law = catalog.laws.find((l) => l.id === node.id);
    if (!evs.length) return <p className="leaf">{node.label}: không đổi trong khoảng này.</p>;
    return (
      <div className="leaf policy">
        {evs.map((e, k) => (
          <p key={k}>
            <strong>{monthLabel(e.tick)}</strong> {e.label}
            {e.before !== undefined && e.after !== undefined && law ? `: ${fmt(e.before, law.unit)} → ${fmt(e.after, law.unit)}` : ''} <small>({e.by})</small>
            {e.index >= 0 && (
              <button
                className="link"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await whatIf([e.index]);
                  setBusy(false);
                }}
              >
                {busy ? 'Đang chạy thế giới song song…' : 'Nếu không làm vậy thì sao?'}
              </button>
            )}
          </p>
        ))}
      </div>
    );
  }
  const max = Math.max(1e-12, ...node.children.map((c) => Math.abs(c.amount)));
  return (
    <ul className="tree">
      {depth > 0 && (
        <li className="head">
          {node.label}: {fmtDelta(node.delta ?? NaN, node.unit ?? '')}
        </li>
      )}
      {node.children.map((c) => (
        <li key={c.reason}>
          <div className="reason">
            <span className="bar">
              <i className={c.amount >= 0 ? 'pos' : 'neg'} style={{ width: `${(Math.abs(c.amount) / max) * 100}%` }} />
            </span>
            <b>{fmtDelta(c.amount, depth === 0 ? unit : (node.unit ?? ''))}</b>
            <span>{c.label}</span>
          </div>
          {c.nodes.length > 0 && depth < 2 && (
            <details>
              <summary>Lý do này đến từ đâu</summary>
              {c.nodes.map((n, k) => (
                <Tree key={k} node={n} unit={n.unit ?? ''} depth={depth + 1} />
              ))}
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}
