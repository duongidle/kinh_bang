// Biểu đồ theo nhóm chỉ số.
import { useState } from 'react';
import { Chart } from '../Chart';
import { useStore } from '../store';

// ---------- biểu đồ và xuất CSV ----------
export function Charts() {
  const catalog = useStore((s) => s.catalog)!;
  const series = useStore((s) => s.series);
  const openLeft = useStore((s) => s.openLeft);
  const openScreen = useStore((s) => s.openScreen);
  useStore((s) => s.hist.n);
  const groups = [...new Set(catalog.indicators.map((i) => i.group))];
  const [group, setGroup] = useState(groups[0]);
  return (
    <>
      <div className="seg wrap" role="group">
        {groups.map((g) => (
          <button key={g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>
      {catalog.indicators
        .filter((i) => i.group === group)
        .map((i) => (
          <figure key={i.id}>
            <figcaption>
              <button
                className="link"
                onClick={() => {
                  // Màn hình riêng phủ kín sân khấu: đóng nó để ngăn trái lộ ra.
                  openScreen(null);
                  openLeft({ kind: 'causal', indicator: i.id });
                }}
              >
                {i.label}
              </button>
            </figcaption>
            <Chart lines={[{ label: i.label, data: series(i.id) }]} unit={i.unit} height={120} />
          </figure>
        ))}
    </>
  );
}
