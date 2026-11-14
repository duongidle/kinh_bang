// Vì sao Gini của cải phụ thuộc quy mô (K1.13). Dùng: npx tsx scripts/k113.ts <S|M|L> <số seed> [k=v ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import { gini, wealthOf } from '../src/engine/modules/gd1/indicators';
import { F, H } from '../src/engine/modules/gd1/schema';
import { f64, i32, u8 } from '../src/engine/core/table';
const scale = (process.argv[2] ?? 'M') as 'S' | 'M' | 'L';
const N = Number(process.argv[3] ?? 2);
const params: Record<string, number> = {};
for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); params[k] = Number(v); }
console.log('seed\tGini của cải\tGini tiền\tGini thu nhập\t10% giàu nhất\thộ có cổ phần\tphần của cải là cổ phần\tdoanh nghiệp\tGini cổ phần');
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine(); eng.checkEvery = 0;
  const w = eng.newWorld({ seed, scale, params });
  eng.run(w, 360);
  const h = H(w); const f = F(w);
  const S = w.tables.share; const kind = u8(S, 'kind'); const ent = i32(S, 'entity'); const own = i32(S, 'owner'); const frac = f64(S, 'frac'); const al = u8(S, 'alive');
  const eq = new Float64Array(h.n);
  for (let r = 0; r < S.n; r++) {
    if (!al[r] || kind[r] !== 0) continue;
    const e = ent[r]; if (!f.alive[e]) continue;
    const nw = f.cash[e] + f.dep[e] + f.invValue[e] + f.capValue[e] - f.debt[e];
    if (nw > 0) eq[own[r]] += nw * frac[r];
  }
  let owners = 0, eqSum = 0; for (let i = 0; i < h.n; i++) { if (eq[i] > 0) owners++; eqSum += eq[i]; }
  const wl = wealthOf(w); let wSum = 0; for (const x of wl) wSum += x;
  const v = (id: string) => eng.value(w, id, 359);
  console.log([seed, v('gini.wealth').toFixed(2), v('gini.liquid').toFixed(2), v('gini.income').toFixed(2), (v('top10.wealth') * 100).toFixed(0) + '%', ((owners / h.n) * 100).toFixed(0) + '%', ((eqSum / wSum) * 100).toFixed(0) + '%', v('firms.formal'), gini(eq).toFixed(2)].join('\t'));
}
