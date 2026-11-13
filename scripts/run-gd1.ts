// Chạy thử GĐ1 và in vài chỉ số theo năm. Dùng: npx tsx scripts/run-gd1.ts [quy mô] [seed] [số tháng] [luật=giá trị ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import type { ScaleId } from '../src/engine/core/world';

const scale = (process.argv[2] ?? 'M') as ScaleId;
const seed = Number(process.argv[3] ?? 1);
const months = Number(process.argv[4] ?? 120);
const eng = gd1Engine();
const laws: Record<string, number> = {};
const params: Record<string, number> = {};
for (const a of process.argv.slice(5)) {
  const [k, v] = a.split('=');
  if (eng.laws.has(k)) laws[k] = Number(v);
  else params[k] = Number(v);
}
const w = eng.newWorld({ seed, scale, laws, params });
const cols = ["gov.arrears", "gov.tga", "public.workers", 'gdp.nominal', 'gdp.real', 'cpi', 'inflation.yoy', 'unemployment', 'informal.share', 'wage.formal', 'wage.informal', 'gov.balance', 'gov.revenue', 'gov.debtGdp', 'credit', 'money.cashShare', 'gini.wealth', 'firms.formal', 'firms.hkd', 'firms.solo', 'bank.car', 'utilisation', 'cb.advances', 'gov.purchaseCut', 'unmet'];
const fmt = (id: string, v: number) => {
  const d = eng.indicators[eng.indicatorIndex.get(id)!];
  if (d.unit === 'đồng') return Math.abs(v) >= 1e9 ? (v / 1e9).toFixed(2) + 'B' : (v / 1e6).toFixed(1) + 'M';
  if (d.unit === '%' || d.unit === 'tỷ lệ') return (v * 100).toFixed(1) + '%';
  return v.toFixed(2);
};
console.log(['t', ...cols].join('\t'));
const t0 = Date.now();
for (let t = 0; t < months; t++) {
  try {
    eng.step(w);
  } catch (e) {
    console.log('LỖI ở tháng', t, (e as Error).message.slice(0, 1500));
    break;
  }
  if (t % 12 === 11 || t === 0) console.log([t + 1, ...cols.map((c) => fmt(c, eng.value(w, c)))].join('\t'));
}
const g = eng.value(w, 'gdp.nominal');
console.log(`thu/GDP ${((eng.value(w, 'gov.revenue') / g) * 100).toFixed(1)}%  chi/GDP ${((eng.value(w, 'gov.spending') / g) * 100).toFixed(1)}%  GDP thu nhập lệch ${(eng.value(w, 'gdp.income') - g).toFixed(0)}  ${Date.now() - t0}ms`);
