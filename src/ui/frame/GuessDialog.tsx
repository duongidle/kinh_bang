// Hộp đoán: mở đầu kịch bản (câu hỏi, giới thiệu, lựa chọn) và đoán trước khi chạy. Chỉ hiện khi không có hộp thoại khác đang mở.
import { useEffect, useState } from 'react';
import { Button, Dialog } from '../design';
import { useStore, type Guess } from '../store';

const GUESS_LABEL: Record<Guess, string> = { up: 'Cao hơn', flat: 'Gần như không đổi', down: 'Thấp hơn' };

export function GuessDialog() {
  const pg = useStore((s) => s.pendingGuess);
  const dialog = useStore((s) => s.dialog);
  const catalog = useStore((s) => s.catalog);
  const scenario = useStore((s) => s.scenario);
  const guess = useStore((s) => s.guess);
  const [g, setG] = useState<Record<string, Guess>>({});
  useEffect(() => setG({}), [pg]);
  if (!pg || !catalog || dialog) return null;
  const intro = !pg.skipFromEvents && scenario;
  return (
    <Dialog
      open
      title={intro ? scenario.title : 'Đoán trước khi chạy'}
      onClose={() => guess(null)}
      actions={
        <>
          <Button onClick={() => guess(null)}>Bỏ qua</Button>
          <Button variant="primary" onClick={() => guess(g)} disabled={Object.keys(g).length === 0}>
            Ghi lại và chạy
          </Button>
        </>
      }
    >
      <div className="kb-guess">
        {intro ? (
          <>
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
          <p>Sau 2 năm, so với thế giới không có quyết định "{pg.label}", bạn nghĩ:</p>
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
      </div>
    </Dialog>
  );
}
