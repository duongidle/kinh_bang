// Khung ứng dụng (gd1-5 mục 4.2): thanh trên, dải cảnh báo, sân khấu (ngăn trái, bản đồ, bảng vai), dải chỉ số, dòng thời gian.
// Màn hình riêng phủ sân khấu và dải chỉ số. Hộp thoại dùng <dialog>.
import { useEffect, useState } from 'react';
import { monthLabel } from './format';
import { Dialogs } from './frame/Dialogs';
import { GuessDialog } from './frame/GuessDialog';
import { Banners } from './frame/Banners';
import { LeftPanel } from './frame/LeftPanel';
import { ScreenView } from './frame/ScreenView';
import { Strip } from './frame/Strip';
import { TimelineBar } from './frame/TimelineBar';
import { TopBar } from './frame/TopBar';
import { FLOW_LEGEND, IsoMap } from './iso/IsoMap';
import { RolePanel } from './RolePanel';
import { Home } from './screens/Home';
import { useStore } from './store';

export function App() {
  const phase = useStore((s) => s.phase);
  return phase === 'menu' ? <Home /> : <Play />;
}

function Play() {
  const phase = useStore((s) => s.phase);
  const tick = useStore((s) => s.tick);
  const hasLeft = useStore((s) => s.left.length > 0);
  const hasScreen = useStore((s) => s.screen !== null);
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
        // Hộp thoại đang mở thì để chính nó xử lý Esc.
        if (document.querySelector('dialog[open]')) return;
        if (s.screen) s.openScreen(null);
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
    <div className="app kb-app">
      <TopBar />
      <Banners />
      <div className={hasLeft ? 'kb-stage kb-stage--left' : 'kb-stage'} inert={hasScreen}>
        {hasLeft && (
          <div className="kb-stage__left">
            <LeftPanel />
          </div>
        )}
        <div className="kb-stage__map">
          <IsoMap />
          <Legend />
          <News />
        </div>
        <RolePanel />
      </div>
      <Strip inert={hasScreen} />
      <TimelineBar />
      <ScreenView />
      <Dialogs />
      <GuessDialog />
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
  const [open, setOpen] = useState(true);
  if (!news.length) return null;
  return (
    <div className="news">
      <button type="button" className="news__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        Bản tin ({news.length})
      </button>
      {open && (
        <ol aria-label="Bản tin">
          {news.slice(0, 5).map((n, i) => (
            <li key={`${n.tick}-${i}`} className={n.tone > 0 ? 'good' : n.tone < 0 ? 'bad' : ''}>
              <time>{monthLabel(n.tick)}</time>
              {n.tone !== 0 && (
                <span className="news__mark" aria-hidden="true">
                  {n.tone > 0 ? '▲' : '▼'}
                </span>
              )}
              {n.indicator ? <button onClick={() => openLeft({ kind: 'causal', indicator: n.indicator! })}>{n.text}</button> : <span>{n.text}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
