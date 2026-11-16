// Dòng thời gian ngay dưới dải chỉ số: trục từ tháng 0 tới tháng hiện tại, mỗi tháng có sự kiện là một mốc bấm được.
import { useMemo, useState, type KeyboardEvent } from 'react';
import type { EventInfo } from '../../protocol';
import { Button } from '../design';
import { monthLabel } from '../format';
import { useStore } from '../store';
import { EventList } from './EventList';

type Kind = 'player' | 'scenario' | 'setup' | 'other';
const KIND_OF = (by: string): Kind => (by === 'Người chơi' ? 'player' : by === 'Kịch bản' ? 'scenario' : by === 'Điều kiện ban đầu' ? 'setup' : 'other');
const RANK: Kind[] = ['player', 'scenario', 'setup', 'other'];
// Hình khác nhau cho từng loại, để không chỉ dựa vào màu.
const GLYPH: Record<Kind, string> = { player: '▲', scenario: '●', setup: '◆', other: '·' };

export function TimelineBar() {
  const events = useStore((s) => s.events);
  const tick = useStore((s) => s.tick?.tick ?? 0);
  const openDialog = useStore((s) => s.openDialog);
  const [sel, setSel] = useState<number | null>(null);

  const byTick = useMemo(() => {
    const m = new Map<number, EventInfo[]>();
    for (const e of events) {
      const l = m.get(e.tick);
      if (l) l.push(e);
      else m.set(e.tick, [e]);
    }
    return m;
  }, [events]);
  const span = Math.max(1, tick);
  const pct = (t: number) => `${(Math.min(t, span) / span) * 100}%`;

  const onKey = (e: KeyboardEvent) => {
    if (sel !== null && e.key === 'Escape') {
      // Chỉ đóng bảng nổi, không để Esc đi tiếp tới bộ xử lý đóng ngăn của cả app.
      e.stopPropagation();
      setSel(null);
    }
  };

  return (
    <div className="kb-tl" onKeyDown={onKey}>
      <span className="kb-tl__end kb-num">{monthLabel(0)}</span>
      <div className="kb-tl__track">
        <div className="kb-tl__line" />
        {events.length === 0 && <span className="kb-tl__empty">Chưa có sự kiện</span>}
        {[...byTick.entries()].map(([t, list]) => {
          const kind = RANK.find((k) => list.some((e) => KIND_OF(e.by) === k))!;
          return (
            <button
              key={t}
              type="button"
              className={`kb-tl__mark kb-tl__mark--${kind}${sel === t ? ' kb-tl__mark--on' : ''}`}
              style={{ left: pct(t) }}
              aria-label={`${monthLabel(t)}: ${list.length} sự kiện`}
              aria-expanded={sel === t}
              onClick={() => setSel(sel === t ? null : t)}
            >
              {GLYPH[kind]}
            </button>
          );
        })}
        {sel !== null && byTick.get(sel) && (
          <div className="kb-tl__pop" style={{ '--x': pct(sel) } as React.CSSProperties} role="group" aria-label={`Sự kiện tháng ${monthLabel(sel)}`}>
            <div className="kb-tl__pophead">
              <strong className="kb-num">{monthLabel(sel)}</strong>
              <Button variant="text" onClick={() => setSel(null)}>
                Đóng
              </Button>
            </div>
            <EventList events={byTick.get(sel)!} onDone={() => setSel(null)} />
          </div>
        )}
      </div>
      <span className="kb-tl__end">Bây giờ</span>
      <Button variant="text" onClick={() => openDialog({ kind: 'events' })}>
        Mọi sự kiện ({events.length})
      </Button>
    </div>
  );
}
