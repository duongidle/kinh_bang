// Bảng bên phải, đổi theo vai (gd1 mục 12). Vai nào không do người chơi giữ thì chạy bằng quy tắc tự động.
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { AgentDetail, LawInfo, ScenarioReport } from '../protocol';
import { engine } from './client';
import { Button, SegmentedControl } from './design';
import { factText, fmt, money, monthLabel, num } from './format';
import { LawInput, LawSource, isToggle, lawValueText } from './LawField';
import { groupLaws, type LawOwner } from './lawGroups';
import { ROLE_NAME } from './screens/Home';
import { useStore } from './store';
import { useQuery } from './views/useQuery';

export function RolePanel() {
  const role = useStore((s) => s.role);
  return (
    <aside className="side">
      <ScenarioCard />
      <RoleChoice />
      {(role === 'government' || role === 'fiscal' || role === 'monetary') && <PolicyPanel key={role} />}
      {(role === 'household' || role === 'firm') && <AgentPanel />}
      {role === 'observer' && <ObserverPanel />}
      <Predictions />
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
        <span className="hint">Bạn giữ</span>
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
        <span className="hint">Bạn nhập vai</span>
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
const OWNERS: Record<string, Set<LawOwner>> = {
  fiscal: new Set<LawOwner>(['fiscal']),
  monetary: new Set<LawOwner>(['monetary']),
  government: new Set<LawOwner>(['fiscal', 'monetary']),
};

function PolicyPanel() {
  const role = useStore((s) => s.role);
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const param = useStore((s) => s.param);
  const openDialog = useStore((s) => s.openDialog);
  const groups = useMemo(() => groupLaws(catalog.laws, OWNERS[role] ?? OWNERS.government), [catalog, role]);
  const [openGroup, setOpenGroup] = useState<string | undefined>(groups[0]?.title);
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
        <details key={g.title} open={openGroup === g.title} onToggle={(e) => (e.currentTarget.open ? setOpenGroup(g.title) : undefined)}>
          <summary>{g.title}</summary>
          {g.sections.map((sec) => (
            <Fragment key={sec.title ?? g.title}>
              {sec.title && <h4 className="kb-lawsub">{sec.title}</h4>}
              {sec.laws.map((l) => (
                <LawRow key={l.id} law={l} />
              ))}
            </Fragment>
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
  const [draft, setDraft] = useState<number | null>(null);
  const issue = (v: number) => {
    const next = Math.max(law.min ?? -Infinity, Math.min(law.max ?? Infinity, v));
    setDraft(null);
    if (next === value) return;
    policy(law.id, next);
    askGuess(law.label);
  };
  const toggle = isToggle(law);
  const dirty = draft !== null && draft !== value;
  return (
    <div className="kb-law">
      <div className="kb-law__row">
        <LawInput law={law} value={draft ?? value} onChange={toggle ? issue : setDraft} />
        {!toggle && (
          <Button variant="primary" disabled={!dirty} onClick={() => issue(draft!)}>
            Ban hành
          </Button>
        )}
      </div>
      <p className="kb-law__meta">
        Hiện hành: {lawValueText(law, value)}
        <LawSource law={law} />
      </p>
      {law.note && <p className="kb-law__note">{law.note}</p>}
    </div>
  );
}

// ---------- vai Hộ gia đình và Doanh nghiệp ----------
function AgentPanel() {
  const role = useStore((s) => s.role);
  const named = useStore((s) => s.named);
  const player = useStore((s) => s.tick!.player);
  const possess = useStore((s) => s.possess);
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
  return <AgentMine sector={sector} id={id} />;
}

/** Bảng của người đã nhập vai: tình hình của tôi, quyết định tháng này, lý do của quy tắc tự động. */
function AgentMine({ sector, id }: { sector: 'hh' | 'firm'; id: number }) {
  const named = useStore((s) => s.named);
  const player = useStore((s) => s.tick!.player);
  const possess = useStore((s) => s.possess);
  const orders = useStore((s) => s.orders);
  const openLeft = useStore((s) => s.openLeft);
  const scenario = useStore((s) => s.scenario);
  const { data } = useQuery(() => engine.query<AgentDetail>({ kind: 'agent', sector, id }), [sector, id]);
  const me = named.find((n) => n.sector === sector && n.id === id);
  const o = player.orders;
  const a = player.auto;
  // Các quyết định của quy tắc tự động ở tháng gần nhất có quyết định.
  const last = data?.decisions.reduce((m, d) => Math.max(m, d.tick), -1) ?? -1;
  const latest = data?.decisions.filter((d) => d.tick === last) ?? [];
  return (
    <>
      <section className="card">
        <h2>{me?.name ?? data?.title ?? (sector === 'hh' ? `Hộ ${id + 1}` : `Doanh nghiệp ${id + 1}`)}</h2>
        {me && <p className="hint">{me.story}</p>}
        <h3>Tình hình của tôi</h3>
        {data ? (
          <table className="kv">
            <tbody>
              <tr>
                <th>Vốn ròng</th>
                <td>{money(data.netWorth)}</td>
              </tr>
              {data.facts.map((f) => (
                <tr key={f.label}>
                  <th>{f.label}</th>
                  <td>{factText(f.unit, f.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="hint">Đang mở sổ…</p>
        )}
        <div className="row">
          <button onClick={() => openLeft({ kind: 'agent', sector, id })}>Xem sổ sách</button>
          {!scenario?.id && <button onClick={() => possess(null)}>Thả ra</button>}
        </div>
      </section>
      <section className="card">
        <h2>Quyết định tháng này</h2>
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
      <section className="card">
        <h2>Lý do của quy tắc tự động</h2>
        {!data ? (
          <p className="hint">Đang mở sổ…</p>
        ) : latest.length === 0 ? (
          <p className="hint">Tháng này quy tắc không đổi gì.</p>
        ) : (
          <>
            <p className="hint">Tháng {monthLabel(last)}</p>
            <ul className="decisions">
              {latest.map((d, k) => (
                <li key={k}>
                  <strong>
                    {d.rule}: {num(d.before)} → {num(d.after)}
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
      </section>
    </>
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
      <h3>Bản tin</h3>
      <NewsList />
    </section>
  );
}

/** Toàn bộ bản tin, mới nhất trên. Cùng cách hiện với ô bản tin trên bản đồ. */
function NewsList() {
  const news = useStore((s) => s.news);
  const openLeft = useStore((s) => s.openLeft);
  if (!news.length) return <p className="hint">Chưa có tin.</p>;
  return (
    <ol className="kb-newslist" aria-label="Bản tin">
      {news.map((n, i) => (
        <li key={`${n.tick}-${i}`} className={n.tone > 0 ? 'good' : n.tone < 0 ? 'bad' : ''}>
          <time>{monthLabel(n.tick)}</time>
          {n.tone !== 0 && (
            <span className="kb-newslist__mark" aria-hidden="true">
              {n.tone > 0 ? '▲' : '▼'}
            </span>
          )}
          {n.indicator ? <button onClick={() => openLeft({ kind: 'causal', indicator: n.indicator! })}>{n.text}</button> : <span>{n.text}</span>}
        </li>
      ))}
    </ol>
  );
}

// ---------- lời đoán ----------
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
