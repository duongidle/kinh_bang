// Chạy thử bộ kiểm định với ít seed để hiệu chỉnh. Dùng: npx tsx scripts/validate.ts [số seed] [base|exp|all] [quy mô]
import { baselineChecks, experimentChecks, type Check } from '../tests/validation/gd1-lib';
const n = Number(process.argv[2] ?? 5);
const what = process.argv[3] ?? 'all';
const scale = (process.argv[4] ?? 'M') as 'S' | 'M' | 'L';
const seeds = Array.from({ length: n }, (_, i) => i + 1);
const show = (cs: Check[]) => { for (const c of cs) console.log(`${c.pass ? 'QUA ' : 'HỎNG'} ${c.id.padEnd(6)} ${c.perSeed.filter((p) => p.ok).length}/${c.perSeed.length}  ${c.claim}\n        ${c.perSeed.slice(0, 4).map((p) => p.value).join(' | ')}`); };
const t0 = Date.now();
if (what !== 'exp') { const r = baselineChecks(seeds, scale); show(r.checks); console.log(r.table.map((x) => x.join('\t')).join('\n')); }
if (what !== 'base') show(experimentChecks(seeds, scale));
console.log(`${((Date.now() - t0) / 1000).toFixed(0)} giây`);
