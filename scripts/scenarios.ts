// Chạy thử kiểm định kịch bản. Dùng: npx tsx scripts/scenarios.ts [số seed] [mã kịch bản]
import { checkScenarios } from '../tests/validation/scenarios-lib';
const n = Number(process.argv[2] ?? 5);
const t0 = Date.now();
for (const r of checkScenarios(Array.from({ length: n }, (_, i) => i + 1), process.argv[3])) {
  console.log(`\n${r.id}${r.error ? '  LỖI ' + r.error : ''}`);
  for (const c of r.claims) console.log(`  ${c.pass ? 'QUA ' : 'HỎNG'} ${c.okSeeds}/${c.n}  ${c.text.slice(0, 90)}  [${c.sample}]`);
  for (const g of r.goals) console.log(`  mục tiêu ${g.okSeeds}/${g.n}  ${g.label}`);
}
console.log(`${((Date.now() - t0) / 1000).toFixed(0)} giây`);
