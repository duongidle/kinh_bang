// Soi kịch bản có nhiều nhánh: hiệu của từng nhánh so với thế giới đối chứng, bình quân nhiều seed.
// Dùng: npx tsx scripts/optdiag.ts <mã kịch bản> <số seed> <chỉ số:rel|pt:a:b> ...
import { revenueUseOptions, SCENARIOS } from '../src/content/scenarios';
import { gd1Engine } from '../src/engine/modules/gd1/index';
import type { Engine } from '../src/engine/core/engine';
import type { World } from '../src/engine/core/world';
import type { Step } from '../src/engine/scenario/types';
const def = SCENARIOS.find((d) => d.id === process.argv[2])!;
const N = Number(process.argv[3] ?? 5);
const TAXES: Record<string, string[]> = { 'thue-nguoi-giau': ['gov.tax.cit', 'gov.tax.pit'], 'keo-vao-luoi-thue': ['gov.tax.hkd'] };
const options = def.options ?? revenueUseOptions(TAXES[def.id], { transfer: [], purchase: [], debt: [] });
const specs = process.argv.slice(4).map((a) => { const [id, kind, x, y] = a.split(':'); return { id, kind, a: Number(x ?? 12), b: Number(y ?? def.months) }; });
const apply = (eng: Engine, w: World, s: Step) => {
  const x = s.dynamic ? s.dynamic(eng, w) : s;
  for (const [k, v] of Object.entries(x.laws ?? {})) eng.setLaw(w, k, v, 'soi');
  for (const [k, v] of Object.entries(x.params ?? {})) w.params[k] = v;
  for (const [k, v] of Object.entries(x.variants ?? {})) eng.setVariant(w, k, v);
};
const mean = (x: ArrayLike<number>) => { let s = 0; for (let i = 0; i < x.length; i++) s += x[i]; return s / x.length; };
const acc: Record<string, number[][]> = {};
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine(); eng.checkEvery = 0;
  const root = eng.newWorld({ seed, scale: def.scale });
  if (def.setup) apply(eng, root, { at: 0, ...def.setup });
  eng.run(root, def.warmup);
  const base = eng.fork(root);
  eng.run(base, def.months);
  for (const o of options) {
    const w = eng.fork(root);
    const steps = [...def.demo, ...o.steps];
    for (let t = 0; t < def.months; t++) { for (const s of steps) if (s.at === t) apply(eng, w, s); eng.step(w); }
    specs.forEach((sp, k) => {
      const x = mean(eng.seriesOf(w, sp.id, def.warmup + sp.a, def.warmup + sp.b));
      const y = mean(eng.seriesOf(base, sp.id, def.warmup + sp.a, def.warmup + sp.b));
      ((acc[o.id] ??= [])[k] ??= []).push(sp.kind === 'rel' ? x / y - 1 : x - y);
    });
  }
}
for (const sp of specs) process.stdout.write(`\t${sp.id}[${sp.a},${sp.b})`);
console.log();
for (const o of options) {
  const cells = specs.map((sp, k) => { const v = acc[o.id][k]; const pos = v.filter((x) => x > 0).length; return `${(mean(v) * 100).toFixed(2)}${sp.kind === 'rel' ? '%' : 'đ'} [${(Math.min(...v) * 100).toFixed(2)}; ${(Math.max(...v) * 100).toFixed(2)}] (${pos}/${v.length} dương)`; });
  console.log(`${o.id}\t${cells.join('\t')}`);
}
