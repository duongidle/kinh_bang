// Tăng GTGT lên 20% ở tháng 12: mức giá so với thế giới đối chứng, và phân rã CPI theo lý do.
// Dùng: npx tsx scripts/vatcpi.ts <S|M|L> <số seed> [k=v ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
const scale = (process.argv[2] ?? 'M') as 'S' | 'M' | 'L';
const N = Number(process.argv[3] ?? 5);
const params: Record<string, number> = {};
for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); params[k] = Number(v); }
const H = [1, 3, 6, 12, 24];
const rel: number[][] = H.map(() => []);
const extra: Record<string, number[]> = {};
const parts: Record<string, number[]> = {};
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine(); eng.checkEvery = 0;
  const base = eng.newWorld({ seed, scale, params });
  eng.run(base, 12);
  const alt = eng.fork(base);
  eng.setLaw(alt, 'vat.rate.standard', 0.2, 'thử');
  eng.run(base, 24); eng.run(alt, 24);
  H.forEach((h, k) => rel[k].push(eng.value(alt, 'cpi', 11 + h) / eng.value(base, 'cpi', 11 + h) - 1));
  const avg = (w: typeof base, id: string, a: number, b: number) => { const x = eng.seriesOf(w, id, a, b); let s = 0; for (const v of x) s += v; return s / x.length; };
  for (const id of ['consumption.real', 'gdp.real', 'unemployment', 'wage.formal', 'price.formal.taxed', 'price.informal.taxed', 'price.agri', 'informal.consShare']) {
    const d = id === 'unemployment' || id === 'informal.consShare' ? avg(alt, id, 24, 36) - avg(base, id, 24, 36) : avg(alt, id, 24, 36) / avg(base, id, 24, 36) - 1;
    (extra[id] ??= []).push(d);
  }
  const sum = (w: typeof base) => { const o: Record<string, number> = {}; const rows = w.causal.contrib.cpi ?? []; for (let t = 12; t < 36; t++) for (const k in rows[t] ?? {}) o[k] = (o[k] ?? 0) + rows[t][k] / eng.value(w, 'cpi', 11); return o; };
  const a = sum(alt), b = sum(base);
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) (parts[k] ??= []).push((a[k] ?? 0) - (b[k] ?? 0));
}
const m = (v: number[]) => v.reduce((x, y) => x + y, 0) / v.length;
const line = (name: string, v: number[]) => console.log(`${name.padEnd(30)} ${(m(v) * 100).toFixed(2).padStart(7)}  [${(Math.min(...v) * 100).toFixed(2)}; ${(Math.max(...v) * 100).toFixed(2)}]  dương ${v.filter((x) => x > 0).length}/${v.length}`);
console.log(`== ${scale}, ${N} seed, ${JSON.stringify(params)}: CPI ván tăng thuế so với đối chứng, %`);
H.forEach((h, k) => line(`sau ${h} tháng`, rel[k]));
console.log('-- năm thứ hai, so với đối chứng (% hoặc điểm)');
for (const k in extra) line(k, extra[k]);
console.log('-- phân rã chênh lệch CPI trong 24 tháng, điểm %');
for (const k of Object.keys(parts).sort((x, y) => Math.abs(m(parts[y])) - Math.abs(m(parts[x])))) if (Math.abs(m(parts[k])) > 0.0005) line(k, parts[k]);
