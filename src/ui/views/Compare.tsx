// So với thế giới đối chứng.
import { useState } from 'react';
import type { CounterfactualResult } from '../../protocol';
import { Chart } from '../Chart';
import { fmt, fmtDelta, monthLabel, num } from '../format';
import { useStore } from '../store';

// ---------- so với thế giới đối chứng ----------
const CMP = ['gdp.real', 'cpi', 'inflation.yoy', 'unemployment', 'wage.real', 'consumption.real', 'investment', 'credit', 'money.m2', 'gov.deficitGdp', 'gov.debt', 'gini.income', 'informal.share'];

export function Compare({ data, focus }: { data: CounterfactualResult; focus?: string }) {
  const catalog = useStore((s) => s.catalog)!;
  const [id, setId] = useState(focus ?? 'gdp.real');
  const col = (src: Float64Array, ind: string) => {
    const k = data.ids.indexOf(ind);
    return src.subarray(k * data.n, (k + 1) * data.n);
  };
  const def = catalog.indicators.find((x) => x.id === id)!;
  if (data.n < 2) return <p className="hint">Chưa có gì để so. Hoặc ván này không có quyết định nào của cậu để bỏ đi, hoặc chưa chạy đủ tháng. Nếu là vế sau, chạy thêm vài tháng rồi thử lại.</p>;
  return (
    <>
      <p className="lead">
        Đối chứng: {data.label}. Hai thế giới cùng hạt giống, tách nhau từ {monthLabel(data.from)}. Khác biệt giữa hai đường là do quyết định đó, không phải do may rủi.
      </p>
      <select value={id} onChange={(e) => setId(e.target.value)} aria-label="Chỉ số">
        {catalog.indicators.map((x) => (
          <option key={x.id} value={x.id}>
            {x.group}: {x.label}
          </option>
        ))}
      </select>
      <Chart
        lines={[
          { label: 'Ván của cậu', data: col(data.actual, id) },
          { label: 'Thế giới đối chứng', data: col(data.control, id), dash: [5, 4] },
        ]}
        from={data.from}
        unit={def.unit}
        height={220}
      />
      <table className="kv cmp">
        <thead>
          <tr>
            <th>Tháng cuối</th>
            <td>Ván của cậu</td>
            <td>Đối chứng</td>
            <td>Chênh</td>
          </tr>
        </thead>
        <tbody>
          {CMP.map((ind) => {
            const d = catalog.indicators.find((x) => x.id === ind);
            if (!d) return null;
            const a = col(data.actual, ind)[data.n - 1];
            const b = col(data.control, ind)[data.n - 1];
            const rel = d.unit === 'đồng' || d.unit === 'chỉ số' || d.unit === 'số' || d.unit === 'người';
            return (
              <tr key={ind}>
                <th>
                  <button className="link" onClick={() => setId(ind)}>
                    {d.label}
                  </button>
                </th>
                <td>{fmt(a, d.unit)}</td>
                <td>{fmt(b, d.unit)}</td>
                <td>{rel ? `${a >= b ? '+' : '−'}${num(Math.abs(a / b - 1) * 100, 1)}%` : fmtDelta(a - b, d.unit)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
