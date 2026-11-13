import { gd1Engine } from '../src/engine/modules/gd1/index';
import { F, H, st } from '../src/engine/modules/gd1/schema';
const eng = gd1Engine();
const w = eng.newWorld({ seed: 1, scale: 'M' });
const T = Number(process.argv[2] ?? 12);
const un: Record<string, number> = {};
for (let t = 0; t < T; t++) {
  eng.step(w);
  const c = w.causal.contrib['unemployment']?.[t] ?? {}; for (const k in c) un[k] = (un[k] ?? 0) + c[k] * 500;
  const f = F(w); const h = H(w);
  let solo = 0, soloRev = 0, soloWant = 0, hkdVac = 0, hkdW = 0, nh = 0, fVac = 0, cashShort = 0;
  for (let i = 0; i < f.n; i++) { if (!f.alive[i]) continue; if (f.solo[i]) { solo++; soloRev += f.revenue[i]; soloWant += h.resWage[f.owner[i]]; } else if (!f.formal[i]) { hkdVac += f.unfilled[i]; hkdW += f.wage[i]; nh++; if (f.nTarget[i] - f.workers[i] > f.vac[i]) cashShort++; } else fVac += f.unfilled[i]; }
  if (t % 3 === 2) console.log(`t${t} solo ${solo} dthu TB ${(soloRev / Math.max(1, solo) / 1e6).toFixed(2)} đòi TB ${(soloWant / Math.max(1, solo) / 1e6).toFixed(2)} | HKD chỗ trống ${hkdVac} lương TB ${(hkdW / nh / 1e6).toFixed(2)} thiếu tiền đăng tuyển ${cashShort} | DN chỗ trống ${fVac} | u ${(st(w).unemp * 100).toFixed(1)}`);
}
console.log(Object.entries(un).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
