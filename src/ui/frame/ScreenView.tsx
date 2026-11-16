// Màn hình riêng: phủ kín vùng sân khấu và dải chỉ số (dưới thanh trên và dải cảnh báo). Mô phỏng không dừng khi mở.
import { Button } from '../design';
import { useStore, type ScreenState } from '../store';
import { Charts } from '../views/Charts';
import { Compare } from '../views/Compare';
import { Lab } from '../views/Lab';
import { Report } from '../views/Report';

const TITLE: Record<ScreenState['kind'], string> = {
  charts: 'Biểu đồ',
  lab: 'Phòng thí nghiệm',
  compare: 'Nếu không làm vậy thì sao?',
  report: 'Lời giải thích',
};

export function ScreenView() {
  const screen = useStore((s) => s.screen);
  const openScreen = useStore((s) => s.openScreen);
  if (!screen) return null;
  return (
    <section className="kb-screen" aria-label={TITLE[screen.kind]}>
      <header className="kb-screen__head">
        <h2>{TITLE[screen.kind]}</h2>
        <Button onClick={() => openScreen(null)}>Đóng</Button>
      </header>
      <div className="kb-screen__body">
        <div className="kb-screen__inner">
          {screen.kind === 'charts' && <Charts />}
          {screen.kind === 'lab' && <Lab />}
          {screen.kind === 'compare' && <Compare data={screen.data} focus={screen.focus} />}
          {screen.kind === 'report' && <Report data={screen.data} />}
        </div>
      </div>
    </section>
  );
}
