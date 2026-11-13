import { gd1Engine } from '../src/engine/modules/gd1/index';
import { F, H, st } from '../src/engine/modules/gd1/schema';
const eng = gd1Engine();
const w = eng.newWorld({ seed: 1, scale: 'M' });
const T = Number(process.argv[2] ?? 60);
const acc: Record<string, number> = {}; const un: Record<string, number> = {};
for (let t = 0; t < T; t++) {
  eng.step(w);
  for (const d of w.causal.decisions) if (d.tick === t && d.rule === 'bank.credit') for (const p of d.parts) acc[p.reason] = (acc[p.reason] ?? 0) + p.amount / 1e6;
  const c = w.causal.contrib['unemployment']?.[t] ?? {}; for (const k in c) un[k] = (un[k] ?? 0) + c[k] * 500;
}
console.log('từ chối tín dụng (triệu):', Object.entries(acc).map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
console.log('thất nghiệp theo lý do (người):', Object.entries(un).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
const f = F(w); const h = H(w); const s = st(w);
let rows: string[] = [];
for (let i = 0; i < f.n; i++) if (f.alive[i] && f.formal[i]) rows.push(`${i}:s${f.sector[i]} n${f.workers[i]}/${f.nTarget[i]} capW${(f.K[i] / [500, 700, 500][f.sector[i]]).toFixed(1)} dep${(f.dep[i] / 1e6).toFixed(0)} debt${(f.debt[i] / 1e6).toFixed(0)} sE${f.salesE[i].toFixed(0)} s${f.sales[i].toFixed(0)} inv${f.inv[i].toFixed(0)} p${(f.priceG[i] / 1e3).toFixed(0)} mu${f.markup[i].toFixed(2)} w${(f.wage[i] / 1e6).toFixed(1)} ocf${(f.ocf[i] / 1e6).toFixed(1)} so${f.stockout[i]} unf${f.unfilled[i]}`);
console.log(rows.slice(0, 45).join('\n'));
let hk = { n: 0, w: 0, full: 0, so: 0, cash: 0 }; for (let i = 0; i < f.n; i++) if (f.alive[i] && !f.formal[i] && !f.solo[i]) { hk.n++; hk.w += f.workers[i]; if (f.workers[i] >= 5) hk.full++; hk.so += f.stockout[i]; hk.cash += f.cash[i] + f.dep[i]; }
console.log('HKD', hk, 'wageInf', s.wageInf, 'unemp', s.unemp);
let ur = 0, uw = 0, un2 = 0; for (let i = 0; i < h.n; i++) if (h.employer[i] === -1) { ur += h.resWage[i]; uw += h.cash[i] + h.dep[i]; un2++; } console.log('thất nghiệp: lương đòi TB', (ur / un2 / 1e6).toFixed(2), 'của cải TB', (uw / un2 / 1e6).toFixed(1), 'số', un2);
