// Danh sách sự kiện, dùng cho hộp thoại "Mọi sự kiện" và bảng nổi của dòng thời gian.
import { useState } from 'react';
import type { EventInfo } from '../../protocol';
import { fmt, monthLabel } from '../format';
import { useStore } from '../store';

/** `onDone` gọi sau khi màn hình đối chứng đã mở, để nơi chứa danh sách tự đóng. */
export function EventList({ events, onDone }: { events: EventInfo[]; onDone?: () => void }) {
  const whatIf = useStore((s) => s.whatIf);
  const catalog = useStore((s) => s.catalog)!;
  const [busy, setBusy] = useState(-1);
  return (
    <ol className="events kb-events">
      {events.map((e, k) => {
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
                    onDone?.();
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
  );
}
