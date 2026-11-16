// Dải chỉ số ở dưới khung: mười ô số, bấm vào mở chuỗi nhân quả. Số lấy từ tin tick, không tính lại.
import { StatTile } from '../design';
import { delta12, deltaKindOf } from '../delta';
import { useStore } from '../store';

const STRIP = ['gdp.real', 'inflation.yoy', 'unemployment', 'wage.real', 'money.m2', 'credit', 'gov.deficitGdp', 'gov.debtGdp', 'gini.wealth', 'informal.share'];
const SHORT: Record<string, string> = {
  'gdp.real': 'GDP thực',
  'inflation.yoy': 'Lạm phát',
  unemployment: 'Thất nghiệp',
  'wage.real': 'Lương thực',
  'money.m2': 'Tổng tiền',
  credit: 'Dư nợ',
  'gov.deficitGdp': 'Bội chi/GDP',
  'gov.debtGdp': 'Nợ công/GDP',
  'gini.wealth': 'Gini của cải',
  'informal.share': 'Phi chính thức',
};

export function Strip({ inert }: { inert?: boolean }) {
  const catalog = useStore((s) => s.catalog)!;
  const tick = useStore((s) => s.tick)!;
  const index = useStore((s) => s.index);
  const series = useStore((s) => s.series);
  const openLeft = useStore((s) => s.openLeft);
  useStore((s) => s.hist.n);
  return (
    <footer className="kb-strip" inert={inert}>
      {STRIP.map((id) => {
        const i = index.get(id);
        if (i === undefined) return null;
        const def = catalog.indicators[i];
        const kind = deltaKindOf(def.unit);
        const all = series(id);
        return (
          <StatTile
            key={id}
            label={SHORT[id] ?? def.label}
            value={tick.values[i]}
            unit={def.unit}
            deltaKind={kind}
            delta12={delta12(all, kind)}
            goodWhen={def.good > 0 ? 'up' : def.good < 0 ? 'down' : undefined}
            series={Array.from(all.subarray(Math.max(0, all.length - 60)))}
            onExplain={() => openLeft({ kind: 'causal', indicator: id })}
          />
        );
      })}
    </footer>
  );
}
