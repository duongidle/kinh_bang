import { gd1Engine } from '../src/engine/modules/gd1/index';
const acc: Record<string, number[]> = {};
const N = 8;
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine(); eng.checkEvery = 0;
  const base = eng.newWorld({ seed, scale: 'M' });
  eng.run(base, 120); base.params['cb.autopilot'] = 0;
  for (const a of process.argv.slice(2)) { const [k, v] = a.split('='); base.params[k] = Number(v); }
  const alt = eng.fork(base);
  eng.setLaw(alt, 'cb.rate.refinancing', eng.law(alt, 'cb.rate.refinancing') + 0.06);
  eng.run(base, 60); eng.run(alt, 60);
  console.log('seed', seed, 'recap base', base.events.filter((e) => e.id === 'bank.recap').length, 'alt', alt.events.filter((e) => e.id === 'bank.recap').length);
  for (const id of ['inflation.yoy', 'unemployment', 'consumption.real', 'gdp.real', 'money.m2', 'gov.debt', 'gov.balance', 'bank.car', 'cb.bonds'])
    for (let y = 0; y < 5; y++) {
      let a = 0, b = 0; for (let t = 120 + y * 12; t < 132 + y * 12; t++) { a += eng.value(alt, id, t); b += eng.value(base, id, t); }
      const d = id === 'inflation.yoy' || id === 'unemployment' || id === 'bank.car' ? (a - b) / 12 * 100 : (a / b - 1) * 100;
      (acc[`${id} y${y + 1}`] ??= []).push(d);
    }
}
for (const k in acc) { const x = acc[k]; const m = x.reduce((a, b) => a + b, 0) / N; const sd = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (N - 1)); console.log(k.padEnd(24), m.toFixed(2), '±', (1.96 * sd / Math.sqrt(N)).toFixed(2), ' ', x.filter((v) => v < 0).length + '/' + N + ' âm'); }
