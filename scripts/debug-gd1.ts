import { gd1Engine } from '../src/engine/modules/gd1/index';
import { F, H, st } from '../src/engine/modules/gd1/schema';
const eng = gd1Engine(); (globalThis as any).__dbg = process.env.DBG;
const w = eng.newWorld({ seed: 1, scale: 'M' });
const pr = (t: number) => {
  const f = F(w); const h = H(w); const s = st(w);
  let dep = 0, debt = 0, inv = 0, sales = 0, out = 0, wk = 0, nf = 0, hdep = 0, hsales = 0, hout = 0, hwk = 0, budget = 0, cons = 0, hw = 0, distress=0, salesE=0;
  for (let i = 0; i < f.n; i++) { if (!f.alive[i]) continue; if (f.formal[i]) { nf++; dep += f.dep[i]; debt += f.debt[i]; inv += f.inv[i]; sales += f.sales[i]; out += f.output[i]; wk += f.workers[i]; distress+=f.distress[i]; salesE+=f.salesE[i]; } else { hdep += f.cash[i] + f.dep[i]; hsales += f.sales[i]; hout += f.output[i]; hwk += f.workers[i]; } }
  for (let i = 0; i < h.n; i++) { budget += h.budget[i]; cons += h.cons[i]; hw += h.cash[i] + h.dep[i]; }
  console.log(t, 'F:', nf, 'wk', wk, 'dep', (dep / 1e6).toFixed(0), 'debt', (debt / 1e6).toFixed(0), 'inv', inv.toFixed(0), 'sales', sales.toFixed(0), 'salesE', salesE.toFixed(0), 'out', out.toFixed(0), 'distress', distress, '| H: wk', hwk, 'money', (hdep / 1e6).toFixed(0), 'sales', hsales.toFixed(0), 'out', hout.toFixed(0), '| hh budget', (budget / 1e6).toFixed(0), 'cons', (cons / 1e6).toFixed(0), 'wealth', (hw / 1e6).toFixed(0), 'bankrupt', s.m.bankrupt, 'fires', s.m.fires, 'hires', s.m.hires, 'loanD', (s.m.loanDemand/1e6).toFixed(0), 'granted', (s.m.loanGranted/1e6).toFixed(0), 'cons by sec', s.m.consNom.map(x=>(x/1e6).toFixed(0)).join('/'), 'p', s.pSector.map(x=>(x/1e3).toFixed(0)).join('/'));
};
pr(-1);
for (let t = 0; t < Number(process.argv[2] ?? 8); t++) { eng.step(w); pr(t); }
