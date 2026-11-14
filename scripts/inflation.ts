// Vì sao lạm phát bình quân cao: phân rã CPI và lương theo mã lý do, các năm 11-40.
// Dùng: npx tsx scripts/inflation.ts [số seed] [k=v ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import { F, st } from '../src/engine/modules/gd1/schema';
const N = Number(process.argv[2] ?? 5);
const cpiAcc: Record<string, number[]> = {};
const wAcc: Record<string, number[]> = {};
const rows: string[] = [];
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine();
  eng.checkEvery = 0;
  const params: Record<string, number> = {};
  const laws: Record<string, number> = {};
  for (const a of process.argv.slice(3)) { const [k, v] = a.split('='); if (eng.laws.has(k)) laws[k] = Number(v); else params[k] = Number(v); }
  const w = eng.newWorld({ seed, scale: 'M', params, laws });
  const cpiP: Record<string, number> = {};
  const wP: Record<string, number> = {};
  let mu0 = 0, mu1 = 0;
  for (let t = 0; t < 480; t++) {
    eng.step(w);
    if (t === 119 || t === 479) { const f = F(w); let a = 0, b = 0; for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i]) { a += f.markup[i] * f.sales[i]; b += f.sales[i]; } if (t === 119) mu0 = a / b; else mu1 = a / b; }
    if (t < 120) continue;
    const prev = eng.value(w, 'cpi', t - 1);
    const c = w.causal.contrib.cpi?.[t] ?? {};
    for (const k in c) cpiP[k] = (cpiP[k] ?? 0) + c[k] / prev;
    // quyết định lương của tháng này, theo số lao động của doanh nghiệp chính thức
    const f = F(w);
    let tot = 0;
    for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i]) tot += f.workers[i];
    const D = w.causal.decisions;
    for (let j = D.length - 1; j >= 0 && D[j].tick === t; j--) {
      const d = D[j];
      if (d.rule !== 'firm.wage' || d.before <= 0) continue;
      const i = d.agent & 0xffffff;
      if (!f.formal[i]) continue;
      for (const p of d.parts) wP[p.reason] = (wP[p.reason] ?? 0) + ((p.amount / d.before) * f.workers[i]) / Math.max(1, tot);
    }
  }
  for (const k in cpiP) (cpiAcc[k] ??= []).push((cpiP[k] / 30) * 100);
  for (const k in wP) (wAcc[k] ??= []).push((wP[k] / 30) * 100);
  const g = (id: string) => (Math.pow(eng.value(w, id, 479) / eng.value(w, id, 119), 1 / 30) - 1) * 100;
  const avg = (id: string) => { let x = 0; for (let t = 120; t < 480; t++) x += eng.value(w, id, t); return x / 360; };
  rows.push(`seed ${seed}: CPI ${g('cpi').toFixed(1)}%/năm, lương DN ${g('wage.formal').toFixed(1)}, lương HKD ${g('wage.informal').toFixed(1)}, M2 ${g('money.m2').toFixed(1)}, GDP thực ${g('gdp.real').toFixed(1)}, nợ công ${g('gov.debt').toFixed(1)}; thất nghiệp ${(avg('unemployment') * 100).toFixed(1)}%, kỳ vọng ${(avg('inflation.expected') * 100).toFixed(1)}%, niềm tin ${avg('trust').toFixed(2)}, lãi TCV ${(avg('cb.rate.refinancing' in {} ? '' : 'rate.lending') * 100).toFixed(1)}% (cho vay), bội chi/GDP ${((-avg('gov.balance') / avg('gdp.nominal')) * 100).toFixed(1)}%, biên lãi ${mu0.toFixed(2)} -> ${mu1.toFixed(2)}, mục tiêu ${(eng.law(w, 'cb.inflation.target') * 100).toFixed(1)}%, chỗ trống ${avg('vacancies').toFixed(1)}`);
  void st;
}
const show = (title: string, acc: Record<string, number[]>) => {
  console.log(title);
  const eng = gd1Engine();
  const e = Object.entries(acc).map(([k, x]) => [k, x.reduce((a, b) => a + b, 0) / N] as const).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  let tot = 0;
  for (const [k, m] of e) { tot += m; console.log(`  ${m >= 0 ? '+' : ''}${m.toFixed(2)} điểm/năm  ${k.padEnd(16)} ${eng.reasons.get(k)?.label ?? ''}`); }
  console.log(`  = ${tot.toFixed(2)} điểm/năm`);
};
rows.forEach((r) => console.log(r));
show('CPI theo lý do (bình quân các seed, năm 11-40):', cpiAcc);
show('Lương doanh nghiệp theo lý do:', wAcc);
