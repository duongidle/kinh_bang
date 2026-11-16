// Báo cáo kịch bản, kèm bảng so sánh song song các lựa chọn.
import { useState } from 'react';
import type { OptionsReport, ScenarioReport } from '../../protocol';
import { engine } from '../client';
import { fmtDelta, num } from '../format';
import { useStore } from '../store';

export function Report({ data }: { data: ScenarioReport }) {
  const preds = useStore((s) => s.predictions);
  const catalog = useStore((s) => s.catalog)!;
  const whatIf = useStore((s) => s.whatIf);
  const toMenu = useStore((s) => s.toMenu);
  const scenario = useStore((s) => s.scenario);
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
      {scenario?.options && <Options />}
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

/** Bảng so sánh song song các lựa chọn của kịch bản. Chạy lại nhiều nhánh nên mất vài giây. */
function Options() {
  const [state, setState] = useState<{ busy: boolean; data?: OptionsReport; error?: string }>({ busy: false });
  const run = () => {
    setState({ busy: true });
    engine
      .query<OptionsReport>({ kind: 'scenarioOptions' })
      .then((data) => setState({ busy: false, data }))
      .catch((e: Error) => setState({ busy: false, error: e.message }));
  };
  const cell = (kind: 'rel' | 'pt', v: number) => {
    if (!Number.isFinite(v)) return '–';
    if (kind === 'rel') return `${v > 0 ? '+' : v < 0 ? '−' : ''}${num(Math.abs(v) * 100, 1)}%`;
    return fmtDelta(v, '%');
  };
  const d = state.data;
  return (
    <>
      <h3>So sánh các lựa chọn</h3>
      <p className="hint">Mỗi lựa chọn chạy từ cùng một điểm xuất phát, cùng seed. Số đo so với thế giới đối chứng.</p>
      <div className="row">
        <button onClick={run} disabled={state.busy}>
          {state.busy ? 'Đang chạy...' : d ? 'Chạy lại' : 'Chạy so sánh'}
        </button>
      </div>
      {state.error && <p className="error">{state.error}</p>}
      {d && (
        <>
          <table className="kv cmp">
            <thead>
              <tr>
                <th>Lựa chọn</th>
                {d.columns.map((c) => (
                  <td key={c.indicator + c.label}>{c.label}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r) => (
                <tr key={r.id}>
                  <th>
                    {r.label}
                    <br />
                    <small>{r.note}</small>
                  </th>
                  {r.values.map((v, k) => (
                    <td key={k}>{cell(d.columns[k].kind, v)}</td>
                  ))}
                </tr>
              ))}
              {d.player && (
                <tr>
                  <th>Ván của cậu</th>
                  {d.player.values.map((v, k) => (
                    <td key={k}>{cell(d.columns[k].kind, v)}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
          {d.rows.map((r) => (
            <div key={r.id}>
              <h4>{r.label}</h4>
              <ul className="claims">
                {[...r.common, ...r.claims].map((c, k) => (
                  <li key={k} className={c.ok ? 'ok' : 'no'}>
                    <span>{c.text}</span>
                    <small>
                      {c.ok ? 'Đúng' : 'Không đúng'}: {c.detail}.
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </>
  );
}
