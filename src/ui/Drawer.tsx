// Ngăn chi tiết: chuỗi nhân quả, soi tác nhân, nguồn tiền, Phòng thí nghiệm, ghi chú mô hình, so với thế giới đối chứng,
// báo cáo kịch bản, biểu đồ và xuất CSV, lưu tải.
import { del, get as idbGet, keys as idbKeys, set as idbSet } from 'idb-keyval';
import { useEffect, useMemo, useState } from 'react';
import { NOTES, OMISSIONS } from '../content/notes';
import type { AgentDetail, AgentRow, CausalTree, CounterfactualResult, MoneyResult, ScenarioReport, SeriesResult } from '../protocol';
import { Chart } from './Chart';
import { engine } from './client';
import { fmt, fmtDelta, money, monthLabel, num } from './format';
import { useStore, type Panel } from './store';

const TITLE: Record<Panel['kind'], string> = {
  causal: 'Vì sao?',
  agent: 'Sổ sách',
  money: 'Tiền sinh ra và mất đi ở đâu',
  lab: 'Phòng thí nghiệm',
  notes: 'Mô hình này bỏ qua gì',
  compare: 'Nếu không làm vậy thì sao?',
  report: 'Lời giải thích',
  charts: 'Biểu đồ',
  agents: 'Soi tác nhân',
  file: 'Lưu, tải, xuất',
};

export function Drawer() {
  const panel = useStore((s) => s.panel);
  const open = useStore((s) => s.open);
  if (!panel) return null;
  return (
    <section className="drawer" aria-label={TITLE[panel.kind]}>
      <header>
        <h2>{TITLE[panel.kind]}</h2>
        <button onClick={() => open(null)} aria-label="Đóng">
          Đóng
        </button>
      </header>
      <div className="body">
        {panel.kind === 'causal' && <Causal indicator={panel.indicator} />}
        {panel.kind === 'agent' && <Agent sector={panel.sector} id={panel.id} />}
        {panel.kind === 'money' && <Money />}
        {panel.kind === 'lab' && <Lab />}
        {panel.kind === 'notes' && <Notes focus={panel.id} />}
        {panel.kind === 'compare' && <Compare data={panel.data} focus={panel.focus} />}
        {panel.kind === 'report' && <Report data={panel.data} />}
        {panel.kind === 'charts' && <Charts />}
        {panel.kind === 'agents' && <Agents />}
        {panel.kind === 'file' && <Files />}
      </div>
    </section>
  );
}

/** Gọi lại truy vấn mỗi khi sang tháng mới. */
function useQuery<T>(make: () => Promise<T>, deps: unknown[]): { data?: T; error?: string } {
  const tick = useStore((s) => s.tick?.tick ?? 0);
  const [state, setState] = useState<{ data?: T; error?: string }>({});
  useEffect(() => {
    let live = true;
    make()
      .then((data) => live && setState({ data }))
      .catch((e: Error) => live && setState({ error: e.message }));
    return () => {
      live = false;
    };
  }, [tick, ...deps]);
  return state;
}

// ---------- chuỗi nhân quả ----------
const VIA: Record<string, { id: string; why: string }> = {
  'inflation.yoy': { id: 'cpi', why: 'Lạm phát là tốc độ tăng của chỉ số giá. Phần phân rã dưới đây là của chỉ số giá trong cùng khoảng thời gian.' },
  'inflation.mom': { id: 'cpi', why: 'Lạm phát là tốc độ tăng của chỉ số giá. Phần phân rã dưới đây là của chỉ số giá trong cùng khoảng thời gian.' },
  'gdp.real': { id: 'gdp.nominal', why: 'GDP thực là GDP danh nghĩa đã bỏ phần tăng giá. Phần phân rã dưới đây là của GDP danh nghĩa; xem thêm chỉ số giá để tách phần do giá.' },
  'consumption.real': { id: 'consumption', why: 'Tiêu dùng thực là tiêu dùng danh nghĩa đã bỏ phần tăng giá. Phần phân rã dưới đây là của tiêu dùng danh nghĩa.' },
};
function Causal({ indicator }: { indicator: string }) {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick!.tick);
  const series = useStore((s) => s.series);
  const events = useStore((s) => s.events);
  const open = useStore((s) => s.open);
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
                <button className="link" onClick={() => open({ kind: 'notes', id: 'phan-ra-va-doi-chung' })}>
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

// ---------- soi tác nhân: bảng cân đối chữ T ----------
function Agent({ sector, id }: { sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb'; id: number }) {
  const { data, error } = useQuery(() => engine.query<AgentDetail>({ kind: 'agent', sector, id }), [sector, id]);
  const possess = useStore((s) => s.possess);
  const setRole = useStore((s) => s.setRole);
  const scenario = useStore((s) => s.scenario);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="hint">Đang mở sổ…</p>;
  const total = (x: AgentDetail['assets']) => x.reduce((a, b) => a + b.amount, 0);
  const unitOf = (u: string, v: number) => (u === '%' ? `${num(v * 100, 1)}%` : u === 'đồng' ? money(v) : num(v, Number.isInteger(v) ? 0 : 1));
  return (
    <>
      <h3>{data.title}</h3>
      <p className="lead">{data.subtitle}</p>
      {data.story && <p className="hint">{data.story}</p>}
      {!scenario && data.alive && (sector === 'hh' || sector === 'firm') && (
        <button
          onClick={() => {
            setRole(sector === 'hh' ? 'household' : 'firm');
            possess(sector, id);
          }}
        >
          Điều khiển {sector === 'hh' ? 'hộ' : 'doanh nghiệp'} này
        </button>
      )}
      <div className="taccount" aria-label="Bảng cân đối">
        <div>
          <h4>Có</h4>
          {data.assets.map((a) => (
            <p key={a.label}>
              <span>{a.label}</span>
              <b>{money(a.amount)}</b>
            </p>
          ))}
          <p className="sum">
            <span>Cộng</span>
            <b>{money(total(data.assets))}</b>
          </p>
        </div>
        <div>
          <h4>Nợ</h4>
          {data.liabilities.map((a) => (
            <p key={a.label}>
              <span>{a.label}</span>
              <b>{money(a.amount)}</b>
            </p>
          ))}
          <p>
            <span>Vốn ròng</span>
            <b>{money(data.netWorth)}</b>
          </p>
          <p className="sum">
            <span>Cộng</span>
            <b>{money(total(data.liabilities) + data.netWorth)}</b>
          </p>
        </div>
      </div>
      <p className="hint">Mỗi khoản "có" của bên này là khoản "nợ" của một bên khác. Mở sổ của ngân hàng hay NHNN để thấy mặt bên kia.</p>
      {data.facts.length > 0 && (
        <table className="kv">
          <tbody>
            {data.facts.map((f) => (
              <tr key={f.label}>
                <th>{f.label}</th>
                <td>{unitOf(f.unit, f.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.decisions.length > 0 && (
        <>
          <h4>Quyết định gần đây và lý do</h4>
          <ul className="decisions">
            {data.decisions.map((d, k) => (
              <li key={k}>
                <strong>
                  {monthLabel(d.tick)} · {d.rule}: {num(d.before)} → {num(d.after)}
                </strong>
                {d.parts.map((p, j) => (
                  <span key={j}>
                    {p.amount >= 0 ? '+' : '−'}
                    {num(Math.abs(p.amount))} vì {p.label}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
      {data.tx.length > 0 && (
        <>
          <h4>Giao dịch gần đây</h4>
          <table className="tx">
            <tbody>
              {data.tx.map((t, k) => (
                <tr key={k}>
                  <td>{monthLabel(t.tick)}</td>
                  <td>
                    {t.kind}
                    <small>
                      {t.amount < 0 ? 'cho' : 'từ'} {t.other}
                      {t.medium === 1 ? ', tiền mặt' : ''}
                    </small>
                  </td>
                  <td className={t.amount < 0 ? 'neg' : 'pos'}>{fmtDelta(t.amount, 'đồng')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function Agents() {
  const [sector, setSector] = useState<'hh' | 'firm' | 'bank'>('firm');
  const open = useStore((s) => s.open);
  const { data } = useQuery(() => engine.query<AgentRow[]>({ kind: 'agents', sector }), [sector]);
  return (
    <>
      <div className="seg" role="group">
        {(
          [
            ['firm', 'Doanh nghiệp'],
            ['hh', 'Hộ gia đình'],
            ['bank', 'Ngân hàng'],
          ] as const
        ).map(([k, label]) => (
          <button key={k} className={sector === k ? 'on' : ''} onClick={() => setSector(k)}>
            {label}
          </button>
        ))}
        <button onClick={() => open({ kind: 'agent', sector: 'gov', id: 0 })}>Kho bạc</button>
        <button onClick={() => open({ kind: 'agent', sector: 'cb', id: 0 })}>NHNN</button>
      </div>
      <ul className="pick small">
        {data?.map((r) => (
          <li key={r.id}>
            <button onClick={() => open({ kind: 'agent', sector, id: r.id })}>
              <strong>
                {r.title}
                {r.named && <em className="tag">theo dõi</em>}
              </strong>
              <span>{r.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="hint">Hiện tối đa 200 dòng, xếp theo quy mô. Cũng có thể bấm thẳng vào bản đồ.</p>
    </>
  );
}

// ---------- bảng nguồn tạo và huỷ tiền ----------
function Money() {
  const tick = useStore((s) => s.tick!.tick);
  const [span, setSpan] = useState(12);
  const { data } = useQuery(() => engine.query<MoneyResult>({ kind: 'money', t0: Math.max(0, tick - span), t1: tick }), [span]);
  const max = Math.max(1, ...(data?.rows.map((r) => Math.abs(r.amount)) ?? []));
  return (
    <>
      <p className="lead">Tiền của công chúng là tiền mặt và tiền gửi của hộ và doanh nghiệp. Bảng này lấy thẳng từ sổ cái.</p>
      <div className="seg" role="group">
        {[1, 12, 60].map((m) => (
          <button key={m} className={span === m ? 'on' : ''} onClick={() => setSpan(m)}>
            {m === 1 ? 'Tháng này' : `${m / 12} năm qua`}
          </button>
        ))}
      </div>
      {data && (
        <>
          <table className="money">
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.kind}>
                  <th>{r.label}</th>
                  <td className="bar">
                    <i className={r.amount >= 0 ? 'pos' : 'neg'} style={{ width: `${(Math.abs(r.amount) / max) * 100}%` }} />
                  </td>
                  <td className={r.amount >= 0 ? 'pos' : 'neg'}>{fmtDelta(r.amount, 'đồng')}</td>
                </tr>
              ))}
              <tr className="sum">
                <th>Thay đổi ròng</th>
                <td />
                <td>{fmtDelta(data.total, 'đồng')}</td>
              </tr>
            </tbody>
          </table>
          <p className="hint">
            Hiện có {money(data.cash)} tiền mặt và {money(data.deposits)} tiền gửi. Dòng dương là tiền sinh ra (vay mới, Chính phủ chi), dòng âm là tiền mất đi (trả gốc, nộp thuế).
          </p>
        </>
      )}
    </>
  );
}

// ---------- Phòng thí nghiệm ----------
function Lab() {
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

function Notes({ focus }: { focus?: string }) {
  return (
    <>
      {NOTES.map((n) => (
        <details key={n.id} open={focus === n.id}>
          <summary>{n.title}</summary>
          {n.body.map((p, k) => (
            <p key={k}>{p}</p>
          ))}
        </details>
      ))}
      <h3>Những thứ mô hình ở giai đoạn này chưa có</h3>
      <ul className="plain">
        {OMISSIONS.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <p className="hint">Mô hình là một cách nghĩ, không phải dự báo. Kết quả ở đây đúng với các quy tắc đã đặt, không chắc đúng với nền kinh tế thật.</p>
    </>
  );
}

// ---------- so với thế giới đối chứng ----------
const CMP = ['gdp.real', 'cpi', 'inflation.yoy', 'unemployment', 'wage.real', 'consumption.real', 'investment', 'credit', 'money.m2', 'gov.deficitGdp', 'gov.debt', 'gini.income', 'informal.share'];

function Compare({ data, focus }: { data: CounterfactualResult; focus?: string }) {
  const catalog = useStore((s) => s.catalog)!;
  const [id, setId] = useState(focus ?? 'gdp.real');
  const col = (src: Float64Array, ind: string) => {
    const k = data.ids.indexOf(ind);
    return src.subarray(k * data.n, (k + 1) * data.n);
  };
  const def = catalog.indicators.find((x) => x.id === id)!;
  if (data.n < 2) return <p className="hint">Chưa có gì để so. Hoặc ván này không có quyết định nào của cậu để bỏ đi, hoặc chưa chạy đủ tháng. Nếu là vế sau, chạy thêm vài tháng rồi thử lại.</p>;
  return (
    <>
      <p className="lead">
        Đối chứng: {data.label}. Hai thế giới cùng hạt giống, tách nhau từ {monthLabel(data.from)}. Khác biệt giữa hai đường là do quyết định đó, không phải do may rủi.
      </p>
      <select value={id} onChange={(e) => setId(e.target.value)} aria-label="Chỉ số">
        {catalog.indicators.map((x) => (
          <option key={x.id} value={x.id}>
            {x.group}: {x.label}
          </option>
        ))}
      </select>
      <Chart
        lines={[
          { label: 'Ván của cậu', data: col(data.actual, id) },
          { label: 'Thế giới đối chứng', data: col(data.control, id), dash: [5, 4] },
        ]}
        from={data.from}
        unit={def.unit}
        height={220}
      />
      <table className="kv cmp">
        <thead>
          <tr>
            <th>Tháng cuối</th>
            <td>Ván của cậu</td>
            <td>Đối chứng</td>
            <td>Chênh</td>
          </tr>
        </thead>
        <tbody>
          {CMP.map((ind) => {
            const d = catalog.indicators.find((x) => x.id === ind);
            if (!d) return null;
            const a = col(data.actual, ind)[data.n - 1];
            const b = col(data.control, ind)[data.n - 1];
            const rel = d.unit === 'đồng' || d.unit === 'chỉ số' || d.unit === 'số' || d.unit === 'người';
            return (
              <tr key={ind}>
                <th>
                  <button className="link" onClick={() => setId(ind)}>
                    {d.label}
                  </button>
                </th>
                <td>{fmt(a, d.unit)}</td>
                <td>{fmt(b, d.unit)}</td>
                <td>{rel ? `${a >= b ? '+' : '−'}${num(Math.abs(a / b - 1) * 100, 1)}%` : fmtDelta(a - b, d.unit)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function Report({ data }: { data: ScenarioReport }) {
  const preds = useStore((s) => s.predictions);
  const catalog = useStore((s) => s.catalog)!;
  const whatIf = useStore((s) => s.whatIf);
  const toMenu = useStore((s) => s.toMenu);
  const DIR = { up: 'cao hơn', down: 'thấp hơn', flat: 'gần như không đổi' } as const;
  return (
    <>
      <p className={`verdict ${data.won ? 'ok' : 'no'}`}>{data.won ? 'Đạt mọi mục tiêu.' : 'Chưa đạt hết mục tiêu.'}</p>
      <ul className="goals">
        {data.goals.map((g) => (
          <li key={g.id} className={g.ok ? 'ok' : 'no'}>
            <span>{g.label}</span>
            <b>{g.value}</b>
          </li>
        ))}
      </ul>
      <h3>Chuyện gì đã xảy ra</h3>
      <p>{data.explanation}</p>
      <h3>Kiểm lại trên chính ván của cậu</h3>
      <p className="hint">Mỗi câu dưới đây được đo bằng cách so ván của cậu với một thế giới song song không có hành động đó. Câu nào không đúng ở ván này thì ghi rõ là không đúng.</p>
      <ul className="claims">
        {data.claims.map((c, k) => (
          <li key={k} className={c.ok ? 'ok' : 'no'}>
            <span>{c.text}</span>
            <small>
              {c.ok ? 'Đúng ở ván này' : 'Không đúng ở ván này'}: {c.detail}.
            </small>
          </li>
        ))}
      </ul>
      {preds.some((p) => p.result?.length) && (
        <>
          <h3>Lời đoán của cậu</h3>
          <ul className="claims">
            {preds
              .flatMap((p) => p.result ?? [])
              .map((r, k) => (
                <li key={k} className={r.guess === r.actual ? 'ok' : 'no'}>
                  <span>{catalog.indicators.find((x) => x.id === r.indicator)?.label}</span>
                  <small>
                    Cậu đoán {DIR[r.guess]}, thực tế {DIR[r.actual]}.
                  </small>
                </li>
              ))}
          </ul>
        </>
      )}
      {data.history && (
        <>
          <h3>Ngoài đời</h3>
          <p>{data.history}</p>
        </>
      )}
      <h3>Chỗ mô hình đơn giản hoá</h3>
      <ul className="plain">
        {data.simplifications.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="row">
        <button onClick={() => void whatIf('player')}>Xem hai thế giới cạnh nhau</button>
        <button onClick={toMenu}>Về danh sách kịch bản</button>
      </div>
    </>
  );
}

// ---------- biểu đồ và xuất CSV ----------
function Charts() {
  const catalog = useStore((s) => s.catalog)!;
  const series = useStore((s) => s.series);
  const open = useStore((s) => s.open);
  useStore((s) => s.hist.n);
  const groups = [...new Set(catalog.indicators.map((i) => i.group))];
  const [group, setGroup] = useState(groups[0]);
  return (
    <>
      <div className="seg wrap" role="group">
        {groups.map((g) => (
          <button key={g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>
      {catalog.indicators
        .filter((i) => i.group === group)
        .map((i) => (
          <figure key={i.id}>
            <figcaption>
              <button className="link" onClick={() => open({ kind: 'causal', indicator: i.id })}>
                {i.label}
              </button>
            </figcaption>
            <Chart lines={[{ label: i.label, data: series(i.id) }]} unit={i.unit} height={120} />
          </figure>
        ))}
    </>
  );
}

function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Files() {
  const tick = useStore((s) => s.tick);
  const scenario = useStore((s) => s.scenario);
  const seed = useStore((s) => s.seed);
  const loadBytes = useStore((s) => s.loadBytes);
  const toMenu = useStore((s) => s.toMenu);
  const [saves, setSaves] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const refresh = () => void idbKeys().then((k) => setSaves(k.map(String).filter((x) => x.startsWith('kb:')).sort().reverse()));
  useEffect(refresh, []);
  const name = () => `kb:${scenario?.title ?? 'Tự do'} · hạt giống ${seed} · tháng ${tick?.tick ?? 0}`;
  const save = async () => {
    const { bytes } = await engine.save();
    await idbSet(name(), bytes);
    setMsg('Đã lưu vào trình duyệt này.');
    refresh();
  };
  const exportFile = async () => {
    const { bytes } = await engine.save();
    download(`kinh-bang-thang-${tick?.tick ?? 0}.kinhbang`, bytes as unknown as BlobPart, 'application/octet-stream');
  };
  const exportCsv = async () => {
    const r = await engine.query<SeriesResult>({ kind: 'series' });
    const lines = [['thang', ...r.ids].join(',')];
    for (let t = 0; t < r.n; t++) lines.push([monthLabel(r.from + t), ...r.ids.map((_, k) => r.data[k * r.n + t])].join(','));
    download(`kinh-bang-chuoi-so-lieu.csv`, lines.join('\n'), 'text/csv');
  };
  return (
    <>
      {tick && (
        <div className="row">
          <button className="primary" onClick={() => void save()}>
            Lưu ván
          </button>
          <button onClick={() => void exportFile()}>Xuất file ván</button>
          <button onClick={() => void exportCsv()}>Xuất CSV mọi chỉ số</button>
        </div>
      )}
      {msg && <p className="hint">{msg}</p>}
      <h3>Ván đã lưu trong trình duyệt</h3>
      {saves.length === 0 && <p className="hint">Chưa có ván nào.</p>}
      <ul className="pick small">
        {saves.map((k) => (
          <li key={k} className="save">
            <button
              onClick={async () => {
                const b = await idbGet<Uint8Array>(k);
                if (b) loadBytes(new Uint8Array(b));
              }}
            >
              <strong>{k.slice(3)}</strong>
            </button>
            <button
              onClick={async () => {
                await del(k);
                refresh();
              }}
              aria-label={`Xoá ${k.slice(3)}`}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>
      <h3>Mở từ file</h3>
      <input
        type="file"
        accept=".kinhbang"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) loadBytes(new Uint8Array(await f.arrayBuffer()));
        }}
      />
      {!tick && (
        <p>
          <button onClick={toMenu}>Về màn hình đầu</button>
        </p>
      )}
    </>
  );
}
