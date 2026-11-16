// Bảng bên phải, đổi theo vai (gd1 mục 12). Vai nào không do người chơi giữ thì chạy bằng quy tắc tự động.
import { useEffect, useState } from 'react';
import type { LawInfo, ScenarioReport } from '../protocol';
import { engine } from './client';
import { SegmentedControl } from './design';
import { fmt, monthLabel, num } from './format';
import { ROLE_NAME } from './screens/Home';
import { useStore } from './store';

export function RolePanel() {
  const role = useStore((s) => s.role);
  const openLeft = useStore((s) => s.openLeft);
  const openScreen = useStore((s) => s.openScreen);
  const openDialog = useStore((s) => s.openDialog);
  return (
    <aside className="side">
      <ScenarioCard />
      <RoleChoice />
      <nav className="tools" aria-label="Công cụ">
        <button onClick={() => openScreen({ kind: 'charts' })}>Biểu đồ</button>
        <button onClick={() => openLeft({ kind: 'money' })}>Nguồn tiền</button>
        <button onClick={() => openLeft({ kind: 'agents' })}>Soi tác nhân</button>
        <button onClick={() => openScreen({ kind: 'lab' })}>Phòng thí nghiệm</button>
        <button onClick={() => openDialog({ kind: 'notes' })}>Mô hình bỏ qua gì</button>
        <button onClick={() => openDialog({ kind: 'file' })}>Lưu, tải, xuất</button>
      </nav>
      {(role === 'government' || role === 'fiscal' || role === 'monetary') && <PolicyPanel key={role} />}
      {(role === 'household' || role === 'firm') && <AgentPanel />}
      {role === 'observer' && <ObserverPanel />}
      <Predictions />
      <Timeline />
    </aside>
  );
}

/** Lựa chọn con của tab vai (ván tự do), hoặc dòng nói vai của kịch bản. */
function RoleChoice() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const scenario = useStore((s) => s.scenario);
  if (scenario) return <p className="hint">Vai của kịch bản: {ROLE_NAME[scenario.role]}</p>;
  if (role === 'fiscal' || role === 'monetary' || role === 'government')
    return (
      <div className="rolechoice">
        <SegmentedControl
          label="Bạn giữ"
          options={[
            { value: 'fiscal', label: 'Bộ Tài chính' },
            { value: 'monetary', label: 'NHNN' },
            { value: 'government', label: 'Cả hai' },
          ]}
          value={role}
          onChange={setRole}
        />
      </div>
    );
  if (role === 'household' || role === 'firm')
    return (
      <div className="rolechoice">
        <SegmentedControl
          label="Bạn nhập vai"
          options={[
            { value: 'household', label: 'Hộ gia đình' },
            { value: 'firm', label: 'Doanh nghiệp' },
          ]}
          value={role}
          onChange={setRole}
        />
      </div>
    );
  return null;
}

function ScenarioCard() {
  const scenario = useStore((s) => s.scenario);
  const st = useStore((s) => s.tick?.scenario);
  const openScreen = useStore((s) => s.openScreen);
  const [busy, setBusy] = useState(false);
  if (!scenario || !st) return null;
  const report = async () => {
    setBusy(true);
    try {
      const data = await engine.query<ScenarioReport>({ kind: 'scenarioReport' });
      if (data.won) {
        const done = new Set<string>(JSON.parse(localStorage.getItem('kb.done') ?? '[]'));
        done.add(scenario.id);
        localStorage.setItem('kb.done', JSON.stringify([...done]));
      }
      openScreen({ kind: 'report', data });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card scenario">
      <h2>{scenario.title}</h2>
      <p className="q">{scenario.question}</p>
      <ul className="goals">
        {st.goals.map((g) => (
          <li key={g.id} className={g.ok ? 'ok' : 'no'}>
            <span>{g.label}</span>
            <b>{/NaN/.test(g.value) ? 'chưa đủ số liệu' : g.value}</b>
          </li>
        ))}
      </ul>
      {st.done ? (
        <button className="primary" onClick={report} disabled={busy}>
          {busy ? 'Đang dựng thế giới đối chứng…' : 'Xem lời giải thích'}
        </button>
      ) : (
        <p className="hint">Còn {st.monthsLeft} tháng.</p>
      )}
    </section>
  );
}

// ---------- vai Chính phủ: Bộ Tài chính và NHNN ----------
function PolicyPanel() {
  const role = useStore((s) => s.role);
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const param = useStore((s) => s.param);
  const openDialog = useStore((s) => s.openDialog);
  const laws = catalog.laws.filter((l) => role === 'government' || l.owner === role);
  const groups = [...new Set(laws.map((l) => l.group))];
  const [openGroup, setOpenGroup] = useState<string>(groups[0]);
  const auto = (id: string, label: string) => (
    <label className="auto">
      <input type="checkbox" checked={tick.params[id] >= 0.5} onChange={(e) => param(id, e.target.checked ? 1 : 0)} />
      {label}
    </label>
  );
  return (
    <section className="card">
      <h2>{role === 'fiscal' ? 'Bộ Tài chính' : role === 'monetary' ? 'Ngân hàng Nhà nước' : 'Chính phủ'}</h2>
      {role !== 'monetary' && role !== 'government' && auto('cb.autopilot', 'Để máy điều hành NHNN: tự chỉnh lãi suất theo lạm phát')}
      {role !== 'fiscal' && role !== 'government' && auto('gov.autopilot', 'Để máy điều hành Bộ Tài chính: tự chỉnh mua hàng theo mục tiêu bội chi')}
      {role !== 'fiscal' && (
        <button className="link" onClick={() => openDialog({ kind: 'notes', id: 'lai-suat-yeu' })}>
          Vì sao lãi suất yếu, room tín dụng mạnh?
        </button>
      )}
      {groups.map((g) => (
        <details key={g} open={openGroup === g} onToggle={(e) => (e.currentTarget.open ? setOpenGroup(g) : undefined)}>
          <summary>{g}</summary>
          {laws
            .filter((l) => l.group === g)
            .map((l) => (
              <LawRow key={l.id} law={l} />
            ))}
        </details>
      ))}
    </section>
  );
}

function LawRow({ law }: { law: LawInfo }) {
  const value = useStore((s) => s.law(law.id));
  const policy = useStore((s) => s.policy);
  const askGuess = useStore((s) => s.askGuess);
  const [draft, setDraft] = useState<string | null>(null);
  const isRate = law.unit === 'tỷ lệ' || law.unit === '%/năm';
  const isMoney = law.unit.startsWith('đồng');
  const scale = isRate ? 100 : isMoney ? 1e-6 : 1;
  const shown = draft ?? String(Number((value * scale).toFixed(isRate ? 2 : 3))).replace('.', ',');
  const apply = (v: number) => {
    const lo = law.min ?? -Infinity;
    const hi = law.max ?? Infinity;
    const next = Math.max(lo, Math.min(hi, v));
    setDraft(null);
    if (next === value) return;
    policy(law.id, next);
    askGuess(law.label);
  };
  if (law.unit === 'bật/tắt')
    return (
      <div className="law">
        <label className="auto">
          <input type="checkbox" checked={value >= 0.5} onChange={(e) => apply(e.target.checked ? 1 : 0)} />
          {law.label}
        </label>
        {law.note && <p className="hint">{law.note}</p>}
      </div>
    );
  const dirty = draft !== null && Number(draft.replace(',', '.')) / scale !== value;
  return (
    <div className="law">
      <label htmlFor={law.id}>{law.label}</label>
      <div className="row">
        <input id={law.id} inputMode="decimal" value={shown} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && dirty && apply(Number(draft!.replace(',', '.')) / scale)} />
        <span className="unit">{isRate ? '%' : isMoney ? `triệu ${law.unit.replace('đồng', 'đ')}` : law.unit}</span>
        <button className="primary" disabled={!dirty || !Number.isFinite(Number(draft?.replace(',', '.')))} onClick={() => apply(Number(draft!.replace(',', '.')) / scale)}>
          Ban hành
        </button>
      </div>
      <p className="hint">
        {law.note ? `${law.note} ` : ''}
        <span className="src">Nguồn: {law.source}</span>
      </p>
    </div>
  );
}

// ---------- vai Hộ gia đình và Doanh nghiệp ----------
function AgentPanel() {
  const role = useStore((s) => s.role);
  const named = useStore((s) => s.named);
  const player = useStore((s) => s.tick!.player);
  const possess = useStore((s) => s.possess);
  const orders = useStore((s) => s.orders);
  const openLeft = useStore((s) => s.openLeft);
  const scenario = useStore((s) => s.scenario);
  const sector = role === 'household' ? 'hh' : 'firm';
  const id = sector === 'hh' ? player.hh : player.firm;
  const list = named.filter((n) => n.sector === sector);
  if (id < 0)
    return (
      <section className="card">
        <h2>{role === 'household' ? 'Chọn một hộ để sống thử' : 'Chọn một doanh nghiệp để điều hành'}</h2>
        <ul className="pick">
          {list.map((n) => (
            <li key={n.id}>
              <button onClick={() => possess(sector, n.id)}>
                <strong>{n.name}</strong>
                <span>{n.story}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="hint">Hoặc bấm vào một ngôi nhà hay một xưởng trên bản đồ rồi chọn "Điều khiển".</p>
      </section>
    );
  const me = named.find((n) => n.sector === sector && n.id === id);
  const o = player.orders;
  const a = player.auto;
  return (
    <section className="card">
      <h2>{me?.name ?? (sector === 'hh' ? `Hộ ${id + 1}` : `Doanh nghiệp ${id + 1}`)}</h2>
      {me && <p className="hint">{me.story}</p>}
      <div className="row">
        <button onClick={() => openLeft({ kind: 'agent', sector, id })}>Xem sổ sách</button>
        {!scenario?.id && <button onClick={() => possess(null)}>Thả ra</button>}
      </div>
      <p className="hint">Mỗi ô có phương án của quy tắc tự động ở tháng vừa rồi. Bỏ trống là để quy tắc tự lái.</p>
      {sector === 'hh' ? (
        <>
          <Lever label="Chi tiêu tháng" unit="triệu đ" scale={1e-6} auto={a.budget} value={o.hhBudget} onChange={(v) => orders({ hhBudget: v })} />
          <Lever label="Lương thấp nhất chịu nhận" unit="triệu đ" scale={1e-6} auto={NaN} value={o.hhResWage} onChange={(v) => orders({ hhResWage: v })} />
          <div className="row">
            <button onClick={() => orders({ hhQuit: true })}>Nghỉ việc</button>
            <button onClick={() => orders({ hhOpenBiz: true })}>Ra tự làm</button>
          </div>
          <p className="hint">Nghỉ việc và ra tự làm có hiệu lực từ tháng tới.</p>
        </>
      ) : (
        <>
          <Lever label="Giá bán (gồm thuế)" unit="nghìn đ" scale={1e-3} auto={a.price} value={o.firmPrice} onChange={(v) => orders({ firmPrice: v })} />
          <Lever label="Lương trả mỗi người" unit="triệu đ" scale={1e-6} auto={a.wage} value={o.firmWage} onChange={(v) => orders({ firmWage: v })} />
          <Lever label="Số người muốn có" unit="người" scale={1} auto={a.workers} value={o.firmWorkers} onChange={(v) => orders({ firmWorkers: v })} />
          <Lever label="Số máy mua thêm" unit="máy" scale={1} auto={a.invest} value={o.firmInvest} onChange={(v) => orders({ firmInvest: v })} />
        </>
      )}
    </section>
  );
}

function Lever({ label, unit, scale, auto, value, onChange }: { label: string; unit: string; scale: number; auto: number; value: number | null; onChange: (v: number | null) => void }) {
  const [draft, setDraft] = useState<string>(value === null ? '' : String(Number((value * scale).toFixed(3))).replace('.', ','));
  useEffect(() => {
    if (value === null) setDraft('');
  }, [value]);
  const commit = () => {
    const t = draft.trim();
    if (t === '') return onChange(null);
    const v = Number(t.replace(',', '.'));
    if (Number.isFinite(v)) onChange(v / scale);
  };
  return (
    <div className="law">
      <label>{label}</label>
      <div className="row">
        <input inputMode="decimal" placeholder="tự lái" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()} />
        <span className="unit">{unit}</span>
        {value !== null && (
          <button
            onClick={() => {
              setDraft('');
              onChange(null);
            }}
          >
            Tự lái
          </button>
        )}
      </div>
      {Number.isFinite(auto) && auto > 0 && <p className="hint">Quy tắc tự động chọn: {num(auto * scale, scale === 1 ? 1 : 2)} {unit}</p>}
    </div>
  );
}

// ---------- vai Quan sát ----------
function ObserverPanel() {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const openLeft = useStore((s) => s.openLeft);
  const named = useStore((s) => s.named);
  const show = ['gdp.nominal', 'consumption', 'investment', 'gov.spending', 'gov.revenue', 'rate.lending', 'firms.formal', 'firms.hkd', 'firms.solo', 'firms.bankrupt', 'npl', 'bank.car', 'money.cashShare', 'inflation.expected', 'trust', 'gini.income'];
  return (
    <section className="card">
      <h2>Quan sát</h2>
      <table className="kv">
        <tbody>
          {show.map((id) => {
            const i = catalog.indicators.findIndex((x) => x.id === id);
            if (i < 0) return null;
            const d = catalog.indicators[i];
            return (
              <tr key={id}>
                <th>
                  <button className="link" onClick={() => openLeft({ kind: 'causal', indicator: id })}>
                    {d.label}
                  </button>
                </th>
                <td>{fmt(tick.values[i], d.unit)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Những người cậu theo dõi</h3>
      <ul className="pick small">
        {named.map((n) => (
          <li key={`${n.sector}${n.id}`}>
            <button onClick={() => openLeft({ kind: 'agent', sector: n.sector, id: n.id })}>
              <strong>{n.name}</strong>
              <span>{n.story}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- lời đoán và dòng thời gian ----------
const DIR = { up: 'cao hơn', down: 'thấp hơn', flat: 'gần như không đổi' } as const;

function Predictions() {
  const preds = useStore((s) => s.predictions);
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick!.tick);
  if (!preds.length) return null;
  return (
    <section className="card">
      <h2>Lời đoán của cậu</h2>
      {preds
        .slice(-3)
        .reverse()
        .map((p) => (
          <div key={p.id} className="pred">
            <strong>{p.label}</strong>
            {!p.result?.length ? (
              <p className="hint">Sẽ chấm sau {Math.max(0, p.dueTick - tick)} tháng nữa, bằng cách so với thế giới không có quyết định này.</p>
            ) : (
              <ul>
                {p.result.map((r) => {
                  const d = catalog.indicators.find((x) => x.id === r.indicator)!;
                  return (
                    <li key={r.indicator} className={r.guess === r.actual ? 'ok' : 'no'}>
                      {d.label}: cậu đoán {DIR[r.guess]}, thực tế {DIR[r.actual]}.
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
    </section>
  );
}

function Timeline() {
  const events = useStore((s) => s.events);
  const whatIf = useStore((s) => s.whatIf);
  const catalog = useStore((s) => s.catalog)!;
  const [busy, setBusy] = useState(-1);
  const recent = events.slice(-12).reverse();
  if (!recent.length) return null;
  return (
    <section className="card">
      <h2>Dòng sự kiện</h2>
      <ol className="events">
        {recent.map((e, k) => {
          const law = catalog.laws.find((l) => l.id === e.id);
          const unit = law?.unit ?? '';
          return (
            <li key={`${e.tick}-${e.id}-${k}`}>
              <time>{monthLabel(e.tick)}</time>
              <div>
                <span>
                  {e.label}
                  {e.before !== undefined && e.after !== undefined && law ? `: ${fmt(e.before, unit)} → ${fmt(e.after, unit)}` : ''}
                </span>
                <small>{e.by}</small>
                {e.index >= 0 && e.by === 'Người chơi' && (
                  <button
                    className="link"
                    disabled={busy >= 0}
                    onClick={async () => {
                      setBusy(k);
                      await whatIf([e.index]);
                      setBusy(-1);
                    }}
                  >
                    {busy === k ? 'Đang chạy thế giới song song…' : 'Nếu không làm vậy thì sao?'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

