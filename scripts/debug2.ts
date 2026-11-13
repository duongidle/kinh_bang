import { gd1Engine } from '../src/engine/modules/gd1/index';
import { B, bankEquity, F, H } from '../src/engine/modules/gd1/schema';
import { TX_KINDS } from '../src/engine/ledger/kinds';
import { f64 } from '../src/engine/core/table';
const eng = gd1Engine();
const w = eng.newWorld({ seed: 1, scale: 'M' });
const T = Number(process.argv[2] ?? 276);
eng.run(w, T);
const L = w.ledger; const nk = L.nkind;
const names = ['HH', 'FIRM', 'BANK', 'GOV', 'CB'];
for (let k = 0; k < nk; k++) {
  const row = names.map((_, s) => (L.flowHist[((T - 1) * 5 + s) * nk + k] / 1e6).toFixed(0));
  if (row.some((x) => x !== '0' && x !== '-0')) console.log(TX_KINDS[k].id.padEnd(16), row.join('\t'), '| vol', (L.volumeHist[(T - 1) * nk + k] / 1e6).toFixed(0));
}
const b = B(w);
for (let k = 0; k < b.n; k++) console.log('bank', k, 'state', b.stateOwned[k], 'res', (b.reserves[k] / 1e9).toFixed(2), 'loans', (b.loans[k] / 1e9).toFixed(2), 'bonds', (b.bonds[k] / 1e9).toFixed(2), 'dep', (b.depLiab[k] / 1e9).toFixed(2), 'adv', (b.cbAdv[k] / 1e9).toFixed(2), 'eq', (bankEquity(b, k) / 1e9).toFixed(2), 'margin', b.margin[k].toFixed(3));
console.log('gov tga', (f64(w.tables.gov, 'tga')[0] / 1e9).toFixed(2), 'debt', (f64(w.tables.gov, 'bondsOut')[0] / 1e9).toFixed(2), 'cb bonds', (f64(w.tables.cb, 'bonds')[0] / 1e9).toFixed(2), 'cash', (f64(w.tables.cb, 'cashOut')[0] / 1e9).toFixed(2));
const h = H(w); const f = F(w);
let hd = 0, hc = 0, fd = 0, fdebt = 0, cap = 0; for (let i = 0; i < h.n; i++) { hd += h.dep[i]; hc += h.cash[i]; } for (let i = 0; i < f.n; i++) if (f.alive[i]) { fd += f.dep[i] + f.cash[i]; fdebt += f.debt[i]; cap += f.capValue[i]; }
console.log('hh dep', (hd / 1e9).toFixed(2), 'cash', (hc / 1e9).toFixed(2), 'firm money', (fd / 1e9).toFixed(2), 'firm debt', (fdebt / 1e9).toFixed(2), 'cap', (cap / 1e9).toFixed(2));
const ws = Array.from(f.workers.subarray(0, f.n)).filter((_, i) => f.alive[i] && f.formal[i]).sort((a, b) => b - a); console.log('formal sizes', ws.slice(0, 12).join(','), '... median', ws[ws.length >> 1], 'n', ws.length);
{ let mu = 0, n = 0, muH = 0, nH = 0; for (let i = 0; i < f.n; i++) if (f.alive[i]) { if (f.formal[i]) { mu += f.markup[i]; n++; } else { muH += f.markup[i]; nH++; } } console.log('markup formal', (mu / n).toFixed(3), 'hkd', (muH / nH).toFixed(3)); }
