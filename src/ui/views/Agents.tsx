// Soi tác nhân: danh sách doanh nghiệp, hộ, ngân hàng, Kho bạc, NHNN.
import { useState } from 'react';
import type { AgentRow } from '../../protocol';
import { engine } from '../client';
import { useStore } from '../store';
import { useQuery } from './useQuery';

export function Agents() {
  const [sector, setSector] = useState<'hh' | 'firm' | 'bank'>('firm');
  const openLeft = useStore((s) => s.openLeft);
  const { data } = useQuery(() => engine.query<AgentRow[]>({ kind: 'agents', sector }), [sector]);
  return (
    <>
      <div className="seg" role="group">
        {(
          [
            ['firm', 'Doanh nghiệp'],
            ['hh', 'Hộ gia đình'],
            ['bank', 'Ngân hàng'],
          ] as const
        ).map(([k, label]) => (
          <button key={k} className={sector === k ? 'on' : ''} onClick={() => setSector(k)}>
            {label}
          </button>
        ))}
        <button onClick={() => openLeft({ kind: 'agent', sector: 'gov', id: 0 })}>Kho bạc</button>
        <button onClick={() => openLeft({ kind: 'agent', sector: 'cb', id: 0 })}>NHNN</button>
      </div>
      <ul className="pick small">
        {data?.map((r) => (
          <li key={r.id}>
            <button onClick={() => openLeft({ kind: 'agent', sector, id: r.id })}>
              <strong>
                {r.title}
                {r.named && <em className="tag">theo dõi</em>}
              </strong>
              <span>{r.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="hint">Hiện tối đa 200 dòng, xếp theo quy mô. Cũng có thể bấm thẳng vào bản đồ.</p>
    </>
  );
}
