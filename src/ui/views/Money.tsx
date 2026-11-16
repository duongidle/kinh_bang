// Bảng nguồn tạo và huỷ tiền, lấy thẳng từ sổ cái.
import { useState } from 'react';
import type { MoneyResult } from '../../protocol';
import { engine } from '../client';
import { fmtDelta, money } from '../format';
import { useStore } from '../store';
import { useQuery } from './useQuery';

// ---------- bảng nguồn tạo và huỷ tiền ----------
export function Money() {
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
