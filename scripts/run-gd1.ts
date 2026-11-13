// Chạy thử GĐ1, in trung bình theo năm. Dùng: npx tsx scripts/run-gd1.ts [quy mô] [seed] [số tháng] [mỗi mấy năm in một dòng] [luật hoặc tham số=giá trị ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import type { ScaleId } from '../src/engine/core/world';

const scale = (process.argv[2] ?? 'M') as ScaleId;
const seed = Number(process.argv[3] ?? 1);
const months = Number(process.argv[4] ?? 120);
const every = Number(process.argv[5] ?? 1);
const eng = gd1Engine();
const laws: Record<string, number> = {};
const params: Record<string, number> = {};
for (const a of process.argv.slice(6)) {
  const [k, v] = a.split('=');
  if (eng.laws.has(k)) laws[k] = Number(v);
  else params[k] = Number(v);
}
const w = eng.newWorld({ seed, scale, laws, params });
const t0 = Date.now();
try {
  eng.run(w, months);
} catch (e) {
  console.log('LỖI ở tháng', w.meta.tick, (e as Error).message.slice(0, 1500));
}
const T = w.meta.tick;
const S = (id: string) => eng.seriesOf(w, id);
const avg = (a: Float64Array, y: number) => {
  let s = 0;
  let n = 0;
  for (let t = y * 12; t < Math.min(T, y * 12 + 12); t++) {
    s += a[t];
    n++;
  }
  return n ? s / n : NaN;
};
const gdp = S('gdp.nominal');
const pct = (x: number) => (x * 100).toFixed(1);
const cols: Array<[string, (y: number) => string]> = [
  ['năm', (y) => String(y + 1)],
  ['GDPthực', (y) => (avg(S('gdp.real'), y) / 1e9).toFixed(2)],
  ['lạmphát', (y) => pct(S('cpi')[Math.min(T - 1, y * 12 + 11)] / (y > 0 ? S('cpi')[y * 12 - 1] : 100) - 1)],
  ['thấtng', (y) => pct(avg(S('unemployment'), y))],
  ['phiCT', (y) => pct(avg(S('informal.share'), y))],
  ['lươngCT', (y) => (avg(S('wage.formal'), y) / 1e6).toFixed(1)],
  ['lươngPCT', (y) => (avg(S('wage.informal'), y) / 1e6).toFixed(1)],
  ['thu/GDP', (y) => pct(avg(S('gov.revenue'), y) / avg(gdp, y))],
  ['chi/GDP', (y) => pct(avg(S('gov.spending'), y) / avg(gdp, y))],
  ['muahàng', (y) => pct(eng.law(w, 'gov.purchase.share', Math.min(T - 1, y * 12 + 6)))],
  ['nợ/GDP', (y) => pct(avg(S('gov.debtGdp'), y))],
  ['C/GDP', (y) => pct(avg(S('consumption'), y) / avg(gdp, y))],
  ['I/GDP', (y) => pct(avg(S('investment'), y) / avg(gdp, y))],
  ['lương/GDP', (y) => pct(avg(S('wage.share'), y))],
  ['tiềnmặt', (y) => pct(avg(S('money.cashShare'), y))],
  ['GiniCC', (y) => avg(S('gini.wealth'), y).toFixed(2)],
  ['GiniTN', (y) => avg(S('gini.income'), y).toFixed(2)],
  ['DN', (y) => avg(S('firms.formal'), y).toFixed(0)],
  ['HKD', (y) => avg(S('firms.hkd'), y).toFixed(0)],
  ['tựlàm', (y) => avg(S('firms.solo'), y).toFixed(0)],
  ['phásản', (y) => (avg(S('firms.bankrupt'), y) * 12).toFixed(0)],
  ['DNmới', (y) => (avg(S('firms.entries'), y) * 12).toFixed(0)],
  ['CAR', (y) => pct(avg(S('bank.car'), y))],
  ['côngsuất', (y) => pct(avg(S('utilisation'), y))],
  ['tíndụng', (y) => (avg(S('credit'), y) / 1e9).toFixed(1)],
  ['bịtừchối', (y) => pct(avg(S('credit.denied'), y) / Math.max(1, avg(S('credit.demand'), y)))],
  ['thiếuhàng', (y) => pct(avg(S('unmet'), y) / avg(gdp, y))],
];
console.log(cols.map((c) => c[0]).join('\t'));
for (let y = 0; y * 12 < T; y++) if (y < 3 || (y + 1) % every === 0) console.log(cols.map((c) => c[1](y)).join('\t'));
console.log(`${Date.now() - t0}ms`);
