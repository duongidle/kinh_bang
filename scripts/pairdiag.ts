// Soi một thí nghiệm chạy đôi: hiệu của nhiều chỉ số theo từng năm, trung bình nhiều seed kèm khoảng tin cậy 95%.
// Dùng: npx tsx scripts/pairdiag.ts <k126|k122> [số seed] [số năm] [k=v cho cả hai nhánh ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
const which = process.argv[2] ?? 'k126';
const N = Number(process.argv[3] ?? 8);
const Y = Number(process.argv[4] ?? 5);
const LEVEL = new Set(['inflation.yoy', 'unemployment', 'informal.share', 'informal.consShare', 'gov.revenueGdp', 'utilisation', 'bank.car', 'rate.lending']);
const IDS: Record<string, string[]> = {
  k126: ['gov.revenueGdp', 'gov.tax.hkd', 'informal.consShare', 'informal.share', 'price.informal.taxed', 'price.formal.taxed', 'gdp.real', 'consumption.real', 'unemployment', 'firms.hkd', 'firms.solo', 'income.real.informal', 'gov.balance'],
  k122: ['credit', 'credit.new', 'credit.denied', 'investment', 'gdp.real', 'consumption.real', 'unemployment', 'utilisation', 'informal.share', 'firms.formal', 'firms.bankrupt', 'firms.entries', 'inflation.yoy', 'wage.real', 'profits.formal.real', 'rate.lending', 'money.m2', 'unmet', 'employment.formal'],
};
const acc: Record<string, number[]> = {};
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine();
  eng.checkEvery = 0;
  const base = eng.newWorld({ seed, scale: 'M' });
  eng.run(base, 120);
  for (const a of process.argv.slice(5)) {
    const [k, v] = a.split('=');
    if (eng.laws.has(k)) eng.setLaw(base, k, Number(v), 'soi');
    else base.params[k] = Number(v);
  }
  if (which === 'k126') {
    eng.setLaw(base, 'hkd.threshold', 100e6, 'soi');
    base.params['gov.indexation'] = 0;
  }
  const alt = eng.fork(base);
  if (which === 'k126') eng.setVariant(alt, 'tax.compliance', 'full');
  else eng.setVariant(alt, 'bank.lending', 'intermediary');
  eng.run(base, Y * 12);
  eng.run(alt, Y * 12);
  for (const id of IDS[which])
    for (let y = 0; y < Y; y++) {
      let a = 0;
      let b = 0;
      for (let t = 120 + y * 12; t < 132 + y * 12; t++) {
        a += eng.value(alt, id, t);
        b += eng.value(base, id, t);
      }
      (acc[`${id}`] ??= []).push(LEVEL.has(id) ? ((a - b) / 12) * 100 : (a / b - 1) * 100);
    }
}
console.log(''.padEnd(24), Array.from({ length: Y }, (_, y) => `năm ${y + 1}`.padStart(16)).join(''));
for (const k in acc) {
  let line = k.padEnd(24);
  for (let y = 0; y < Y; y++) {
    const x = acc[k].filter((_, j) => j % Y === y);
    const m = x.reduce((a, b) => a + b, 0) / N;
    const sd = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (N - 1));
    line += `${m.toFixed(2)}±${((1.96 * sd) / Math.sqrt(N)).toFixed(2)}`.padStart(16);
  }
  console.log(line + (LEVEL.has(k) ? '  điểm' : '  %'));
}
