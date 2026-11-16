// Sổ sách của một tác nhân: bảng cân đối chữ T, quyết định gần đây, giao dịch gần đây.
import type { AgentDetail } from '../../protocol';
import { engine } from '../client';
import { factText, fmtDelta, money, monthLabel, num } from '../format';
import { useStore } from '../store';
import { useQuery } from './useQuery';

// ---------- soi tác nhân: bảng cân đối chữ T ----------
export function Agent({ sector, id }: { sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb'; id: number }) {
  const { data, error } = useQuery(() => engine.query<AgentDetail>({ kind: 'agent', sector, id }), [sector, id]);
  const possess = useStore((s) => s.possess);
  const setRole = useStore((s) => s.setRole);
  const scenario = useStore((s) => s.scenario);
  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="hint">Đang mở sổ…</p>;
  const total = (x: AgentDetail['assets']) => x.reduce((a, b) => a + b.amount, 0);
  return (
    <>
      <h3>{data.title}</h3>
      <p className="lead">{data.subtitle}</p>
      {data.story && <p className="hint">{data.story}</p>}
      {!scenario && data.alive && (sector === 'hh' || sector === 'firm') && (
        <button
          onClick={() => {
            setRole(sector === 'hh' ? 'household' : 'firm');
            possess(sector, id);
          }}
        >
          Điều khiển {sector === 'hh' ? 'hộ' : 'doanh nghiệp'} này
        </button>
      )}
      <div className="taccount" aria-label="Bảng cân đối">
        <div>
          <h4>Có</h4>
          {data.assets.map((a) => (
            <p key={a.label}>
              <span>{a.label}</span>
              <b>{money(a.amount)}</b>
            </p>
          ))}
          <p className="sum">
            <span>Cộng</span>
            <b>{money(total(data.assets))}</b>
          </p>
        </div>
        <div>
          <h4>Nợ</h4>
          {data.liabilities.map((a) => (
            <p key={a.label}>
              <span>{a.label}</span>
              <b>{money(a.amount)}</b>
            </p>
          ))}
          <p>
            <span>Vốn ròng</span>
            <b>{money(data.netWorth)}</b>
          </p>
          <p className="sum">
            <span>Cộng</span>
            <b>{money(total(data.liabilities) + data.netWorth)}</b>
          </p>
        </div>
      </div>
      <p className="hint">Mỗi khoản "có" của bên này là khoản "nợ" của một bên khác. Mở sổ của ngân hàng hay NHNN để thấy mặt bên kia.</p>
      {data.facts.length > 0 && (
        <table className="kv">
          <tbody>
            {data.facts.map((f) => (
              <tr key={f.label}>
                <th>{f.label}</th>
                <td>{factText(f.unit, f.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.decisions.length > 0 && (
        <>
          <h4>Quyết định gần đây và lý do</h4>
          <ul className="decisions">
            {data.decisions.map((d, k) => (
              <li key={k}>
                <strong>
                  {monthLabel(d.tick)} · {d.rule}: {num(d.before)} → {num(d.after)}
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
      {data.tx.length > 0 && (
        <>
          <h4>Giao dịch gần đây</h4>
          <table className="tx">
            <tbody>
              {data.tx.map((t, k) => (
                <tr key={k}>
                  <td>{monthLabel(t.tick)}</td>
                  <td>
                    {t.kind}
                    <small>
                      {t.amount < 0 ? 'cho' : 'từ'} {t.other}
                      {t.medium === 1 ? ', tiền mặt' : ''}
                    </small>
                  </td>
                  <td className={t.amount < 0 ? 'neg' : 'pos'}>{fmtDelta(t.amount, 'đồng')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
