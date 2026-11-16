// Khung ứng dụng (gd0 mục 8.1): thanh trên, bản đồ ở giữa, bảng theo vai bên phải, dải chỉ số ở dưới, ngăn chi tiết.
import { useEffect, useState } from 'react';
import { Spark } from './Chart';
import { Drawer } from './Drawer';
import { fmt, monthLabel } from './format';
import { FLOW_LEGEND, IsoMap } from './iso/IsoMap';
import { RolePanel } from './RolePanel';
import { Banners } from './frame/Banners';
import { TopBar } from './frame/TopBar';
import { Home } from './screens/Home';
import { useStore, type Guess } from './store';

const STRIP = ['gdp.real', 'inflation.yoy', 'unemployment', 'wage.real', 'money.m2', 'credit', 'gov.deficitGdp', 'gov.debtGdp', 'gini.wealth', 'informal.share'];
const SHORT: Record<string, string> = {
  'gdp.real': 'GDP thực',
  'inflation.yoy': 'Lạm phát',
  unemployment: 'Thất nghiệp',
  'wage.real': 'Lương thực',
  'money.m2': 'Tổng tiền',
  credit: 'Dư nợ',
  'gov.deficitGdp': 'Bội chi/GDP',
  'gov.debtGdp': 'Nợ công/GDP',
  'gini.wealth': 'Gini của cải',
  'informal.share': 'Phi chính thức',
};

export function App() {
  const phase = useStore((s) => s.phase);
  return phase === 'menu' ? <Home /> : <Play />;
}

function Play() {
  const phase = useStore((s) => s.phase);
  const tick = useStore((s) => s.tick);
  const error = useStore((s) => s.error);
  const violation = useStore((s) => s.violation);
  const dismiss = useStore((s) => s.dismissError);
  const toMenu = useStore((s) => s.toMenu);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('input, select, textarea')) return;
      const s = useStore.getState();
      if (e.key === ' ') {
        e.preventDefault();
        s.setSpeed(s.speed === 0 ? 1 : 0);
      } else if (e.key === 'Escape') {
        if (s.dialog) s.openDialog(null);
        else if (s.screen) s.openScreen(null);
        else s.closeLeft();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (phase === 'loading' || !tick)
    return (
      <div className="app">
        <div className="loading">
          <p>Đang dựng nền kinh tế…</p>
          {error && (
            <p className="error">
              {error} <button onClick={toMenu}>Về màn hình đầu</button>
            </p>
          )}
        </div>
      </div>
    );
  return (
    <div className="app">
      <TopBar />
      <Banners />
      <div className="stage">
        <div className="mapwrap">
          <IsoMap />
          <Legend />
          <News />
        </div>
        <RolePanel />
        <Drawer />
      </div>
      <Strip />
      <GuessModal />
      {(error || violation) && (
        <div className="toast" role="alert">
          <div>
            {violation ? <strong>Sổ kế toán không cân. Mô phỏng đã dừng.</strong> : null}
            <p>{violation ? violation.join(' ') : error}</p>
          </div>
          <button onClick={dismiss}>Đóng</button>
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <ul className="legend" aria-label="Chú giải dòng tiền">
      {FLOW_LEGEND.map(([k, label]) => (
        <li key={k}>
          <i className={`dot flow-${k}`} />
          {label}
        </li>
      ))}
      <li className="note">Vị trí chỉ để nhìn, chưa có ý nghĩa kinh tế.</li>
    </ul>
  );
}

function News() {
  const news = useStore((s) => s.news);
  const openLeft = useStore((s) => s.openLeft);
  if (!news.length) return null;
  return (
    <ol className="news" aria-label="Bản tin">
      {news.slice(0, 5).map((n, i) => (
        <li key={`${n.tick}-${i}`} className={n.tone > 0 ? 'good' : n.tone < 0 ? 'bad' : ''}>
          <time>{monthLabel(n.tick)}</time>
          {n.indicator ? <button onClick={() => openLeft({ kind: 'causal', indicator: n.indicator! })}>{n.text}</button> : <span>{n.text}</span>}
        </li>
      ))}
    </ol>
  );
}

function Strip() {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const index = useStore((s) => s.index);
  const series = useStore((s) => s.series);
  const openLeft = useStore((s) => s.openLeft);
  useStore((s) => s.hist.n);
  return (
    <footer className="strip">
      {STRIP.map((id) => {
        const i = index.get(id);
        if (i === undefined) return null;
        const def = catalog.indicators[i];
        return (
          <button key={id} onClick={() => openLeft({ kind: 'causal', indicator: id })} title={`${def.label}. Bấm để hỏi vì sao.`}>
            <span className="k">{SHORT[id] ?? def.label}</span>
            <span className="v">{fmt(tick.values[i], def.unit)}</span>
            <Spark data={series(id)} good={def.good} />
          </button>
        );
      })}
    </footer>
  );
}

const GUESS_LABEL: Record<Guess, string> = { up: 'Cao hơn', flat: 'Gần như không đổi', down: 'Thấp hơn' };

function GuessModal() {
  const pg = useStore((s) => s.pendingGuess);
  const catalog = useStore((s) => s.catalog);
  const scenario = useStore((s) => s.scenario);
  const guess = useStore((s) => s.guess);
  const [g, setG] = useState<Record<string, Guess>>({});
  useEffect(() => setG({}), [pg]);
  if (!pg || !catalog) return null;
  const intro = !pg.skipFromEvents && scenario;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Đoán trước khi chạy">
      <div className="card">
        {intro ? (
          <>
            <h2>{scenario.title}</h2>
            <p className="q">{scenario.question}</p>
            <p>{scenario.intro}</p>
            {scenario.options && (
              <>
                <p>Kịch bản này có nhiều lựa chọn. Cuối ván có bảng so sánh song song.</p>
                <ul className="plain">
                  {scenario.options.map((o) => (
                    <li key={o.id}>
                      <b>{o.label}</b>: {o.note}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {scenario.untested && <p className="warn">Kịch bản này nằm ngoài vùng đã kiểm định. Coi kết quả là gợi ý, không phải dự báo.</p>}
            <h3>Đoán trước khi chạy</h3>
          </>
        ) : (
          <>
            <h2>Đoán trước khi chạy</h2>
            <p>Sau 2 năm, so với thế giới không có quyết định "{pg.label}", cậu nghĩ:</p>
          </>
        )}
        {pg.indicators.map((id, k) => {
          const def = catalog.indicators.find((x) => x.id === id);
          const q = intro ? scenario.predict[k]?.question : `${def?.label ?? id} sẽ`;
          return (
            <fieldset key={id}>
              <legend>{q}</legend>
              {(['up', 'flat', 'down'] as Guess[]).map((v) => (
                <label key={v} className={g[id] === v ? 'on' : ''}>
                  <input type="radio" name={id} checked={g[id] === v} onChange={() => setG({ ...g, [id]: v })} />
                  {GUESS_LABEL[v]}
                </label>
              ))}
            </fieldset>
          );
        })}
        <div className="actions">
          <button onClick={() => guess(null)}>Bỏ qua</button>
          <button className="primary" onClick={() => guess(g)} disabled={Object.keys(g).length === 0}>
            Ghi lại và chạy
          </button>
        </div>
      </div>
    </div>
  );
}
