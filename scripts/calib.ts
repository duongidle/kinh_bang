// Hiệu chỉnh thô: chạy nhiều seed, in trung bình các năm 11-40 của các chỉ số mục tiêu.
// Dùng: npx tsx scripts/calib.ts [số seed] [số tháng] [quy mô] [luật hoặc tham số=giá trị ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import type { ScaleId } from '../src/engine/core/world';

const nSeeds = Number(process.argv[2] ?? 3);
const months = Number(process.argv[3] ?? 480);
const scale = (process.argv[4] ?? 'M') as ScaleId;
const eng = gd1Engine();
eng.checkEvery = 12;
const laws: Record<string, number> = {};
const params: Record<string, number> = {};
const variants: Record<string, string> = {};
for (const a of process.argv.slice(5)) {
  const [k, v] = a.split('=');
  if (eng.rules.has(k)) variants[k] = v;
  else if (eng.laws.has(k)) laws[k] = Number(v);
  else params[k] = Number(v);
}
const pct = (x: number) => (x * 100).toFixed(1);
const head = ['seed', 'thấtng', 'u.min', 'u.max', 'lạmphát', 'pi.min', 'pi.max', 'phiCT', 'pCT.đầu', 'pCT.cuối', 'thu/GDP', 'bộichi', 'nợ/GDP', 'tiềnmặt', 'GiniCC', 'GiniTN', 'DN', 'HKD', 'tựlàm', 'phásản/n', 'DNmới/n', 'thiếuhàng', 'ế DV', 'từchối', 'GDPthực', 'I/GDP', 'côngsuất', 'lỗi'];
console.log(head.join('\t'));
for (let seed = 1; seed <= nSeeds; seed++) {
  const w = eng.newWorld({ seed, scale, laws, params, variants });
  let err = '';
  try {
    eng.run(w, months);
  } catch (e) {
    err = `t${w.meta.tick} ${(e as Error).message.slice(0, 80)}`;
  }
  const T = w.meta.tick;
  const from = Math.min(120, Math.floor(T / 4));
  const S = (id: string) => eng.seriesOf(w, id);
  const mean = (id: string, a = from, b = T) => {
    const x = S(id);
    let s = 0;
    for (let t = a; t < b; t++) s += x[t];
    return s / Math.max(1, b - a);
  };
  const mm = (id: string) => {
    const x = S(id);
    let lo = Infinity;
    let hi = -Infinity;
    for (let t = from; t < T; t++) {
      lo = Math.min(lo, x[t]);
      hi = Math.max(hi, x[t]);
    }
    return [lo, hi];
  };
  const gdp = mean('gdp.nominal');
  const u = mm('unemployment');
  const pi = mm('inflation.yoy');
  const sum = (id: string) => mean(id) * 12;
  console.log(
    [
      seed,
      pct(mean('unemployment')),
      pct(u[0]),
      pct(u[1]),
      pct(mean('inflation.yoy')),
      pct(pi[0]),
      pct(pi[1]),
      pct(mean('informal.share')),
      pct(mean('informal.share', 0, 12)),
      pct(mean('informal.share', T - 60, T)),
      pct(mean('gov.revenue') / gdp),
      pct(-mean('gov.balance') / gdp),
      pct(mean('gov.debtGdp')),
      pct(mean('money.cashShare')),
      mean('gini.wealth', T - 12, T).toFixed(2),
      mean('gini.income').toFixed(2),
      mean('firms.formal', T - 12, T).toFixed(0),
      mean('firms.hkd', T - 12, T).toFixed(0),
      mean('firms.solo').toFixed(0),
      sum('firms.bankrupt').toFixed(1),
      sum('firms.entries').toFixed(1),
      pct(mean('unmet') / gdp),
      pct((mean('unsold.services') * 100_000) / gdp),
      pct(mean('credit.denied') / Math.max(1, mean('credit.demand'))),
      (mean('gdp.real') / 1e9).toFixed(2),
      pct(mean('investment') / gdp),
      pct(mean('utilisation')),
      err,
    ].join('\t'),
  );
}
