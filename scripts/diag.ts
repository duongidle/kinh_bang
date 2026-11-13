// Soi cung cầu theo ngành và phân khúc, ngân sách hộ, thu ngân sách. Dùng: npx tsx scripts/diag.ts [seed] [tháng in, cách nhau dấu phẩy] [k=v ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
import { F, H, st } from '../src/engine/modules/gd1/schema';
const seed = Number(process.argv[2] ?? 1);
const at = (process.argv[3] ?? '0,1,2,5,11,23').split(',').map(Number);
const eng = gd1Engine();
const laws: Record<string, number> = {}; const params: Record<string, number> = {};
for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); if (eng.laws.has(k)) laws[k] = Number(v); else params[k] = Number(v); }
const w = eng.newWorld({ seed, scale: 'M', laws, params });
const T = Math.max(...at) + 1;
const M = (x: number) => (x / 1e6).toFixed(0);
console.log('omega', st(w).omega.map((x) => x.toFixed(2)).join(' '), 'rBar', eng.param(w, 'firm.rBar').toFixed(4), 'pK', st(w).pK);
for (let t = 0; t < T; t++) {
  eng.step(w);
  if (!at.includes(t)) continue;
  const f = F(w); const h = H(w); const s = st(w);
  const g = Array.from({ length: 6 }, () => ({ n: 0, wk: 0, out: 0, sales: 0, inv: 0, so: 0, p: 0, salesE: 0, nT: 0, capW: 0, vac: 0, mu: 0 }));
  for (let i = 0; i < f.n; i++) { if (!f.alive[i]) continue; const x = g[(f.formal[i] ? 3 : 0) + f.sector[i]]; x.n++; x.wk += f.workers[i]; x.out += f.output[i]; x.sales += f.sales[i]; x.inv += f.inv[i]; x.so += f.stockout[i]; x.p += f.priceG[i] * f.sales[i]; x.salesE += f.salesE[i]; x.nT += f.nTarget[i]; x.vac += f.unfilled[i]; x.mu += f.markup[i]; if (f.formal[i]) x.capW += f.K[i] / eng.param(w, `firm.kappa.${['agri', 'industry', 'services'][f.sector[i]]}`); }
  console.log(`--- t=${t} u=${(s.unemp * 100).toFixed(1)}% cpi=${s.cpi.toFixed(1)} unmet=${M(s.m.unmet)} spill=${M(s.m.spill)} cons=${M(s.m.consNom[0])}/${M(s.m.consNom[1])}/${M(s.m.consNom[2])} gov=${M(s.m.govNom)} inv=${M(s.m.invNom)} needLeft=${[0, 1, 2].map((k) => M(h.need[k].reduce((a, b) => a + b, 0))).join('/')}`);
  ['I-NN', 'I-CN', 'I-DV', 'F-NN', 'F-CN', 'F-DV'].forEach((nm, k) => { const x = g[k]; console.log(`${nm} n${x.n} wk${x.wk} nT${x.nT} capW${x.capW.toFixed(0)} out${x.out.toFixed(0)} sales${x.sales.toFixed(0)} sE${x.salesE.toFixed(0)} inv${x.inv.toFixed(0)} so${x.so} unf${x.vac} p${x.sales > 0 ? (x.p / x.sales / 1e3).toFixed(0) : '-'} mu${(x.mu / Math.max(1, x.n)).toFixed(2)}`); });
  let inc = 0, bud = 0, con = 0, wl = 0; for (let i = 0; i < h.n; i++) { inc += h.income[i]; bud += h.budget[i]; con += h.cons[i]; wl += h.cash[i] + h.dep[i]; }
  const m = s.m;
  console.log(`hộ: thu nhập ${M(inc)} ngân sách ${M(bud)} tiêu ${M(con)} của cải ${M(wl)} | thuế vat ${M(m.taxVat)} pit ${M(m.taxPit)} cit ${M(m.taxCit)} hkd ${M(m.taxHkd)} ex ${M(m.taxExcise)} phí ${M(m.taxFees)} | lương công ${M(m.wagesPublic)} tư ${M(m.wagesPrivate)} | vay xin ${M(m.loanDemand)} được ${M(m.loanGranted)}`);
  const acc: Record<string, number> = {};
  for (const d of w.causal.decisions) if (d.tick === t && d.rule === 'bank.credit') for (const p of d.parts) acc[p.reason] = (acc[p.reason] ?? 0) + p.amount / 1e6;
  console.log('từ chối:', Object.entries(acc).map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
}
