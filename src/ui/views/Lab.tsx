// Phòng thí nghiệm: sửa quy luật kinh tế (biến thể quy tắc) và tham số hành vi.
import { useState } from 'react';
import { useStore } from '../store';

// ---------- Phòng thí nghiệm ----------
export function Lab() {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const lab = useStore((s) => s.lab);
  const param = useStore((s) => s.param);
  const whatIf = useStore((s) => s.whatIf);
  const [q, setQ] = useState('');
  const rules = catalog.rules.filter((r) => r.variants.length > 1);
  const params = catalog.params.filter((p) => !p.id.startsWith('init.') && (q === '' || (p.label + p.id).toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <p className="lead">Ở đây cậu sửa chính các quy luật kinh tế, không phải chính sách. Thế giới sẽ bị đánh dấu "đã sửa luật" suốt ván.</p>
      {tick.modified && <button onClick={() => void whatIf('lab')}>So với thế giới giữ quy luật gốc</button>}
      {rules.map((r) => {
        const cur = tick.variants[r.id] ?? r.variants[0].id;
        return (
          <fieldset key={r.id} className="rule">
            <legend>{r.label}</legend>
            {r.teaches && <p className="hint">Học được gì: {r.teaches}.</p>}
            {r.variants.map((v, k) => (
              <label key={v.id} className={cur === v.id ? 'on' : ''}>
                <input type="radio" name={r.id} checked={cur === v.id} onChange={() => lab(r.id, v.id)} />
                {v.label}
                {k === 0 && <em className="tag">gốc</em>}
              </label>
            ))}
            <p className="src">Nguồn: {r.source}</p>
          </fieldset>
        );
      })}
      <h3>Tham số hành vi</h3>
      <input className="search" placeholder="Tìm tham số…" value={q} onChange={(e) => setQ(e.target.value)} />
      {params.slice(0, q ? 40 : 8).map((p) => (
        <ParamRow key={p.id} id={p.id} label={p.label} source={p.source} note={p.note} value={tick.params[p.id]} onChange={(v) => param(p.id, v)} />
      ))}
      {!q && <p className="hint">Gõ để tìm trong {catalog.params.length} tham số. Mỗi tham số ghi nguồn của nó.</p>}
    </>
  );
}

function ParamRow({ id, label, source, note, value, onChange }: { id: string; label: string; source: string; note?: string; value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const v = draft === null ? NaN : Number(draft.replace(',', '.'));
  return (
    <div className="law">
      <label htmlFor={`p-${id}`}>{label}</label>
      <div className="row">
        <input id={`p-${id}`} inputMode="decimal" value={draft ?? String(Number(value.toPrecision(6))).replace('.', ',')} onChange={(e) => setDraft(e.target.value)} />
        <button
          disabled={!Number.isFinite(v) || v === value}
          onClick={() => {
            onChange(v);
            setDraft(null);
          }}
        >
          Đổi
        </button>
      </div>
      <p className="hint">
        {note ? `${note} ` : ''}
        <span className="src">Nguồn: {source}</span>
      </p>
    </div>
  );
}
