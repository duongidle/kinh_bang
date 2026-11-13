// Theo dõi một doanh nghiệp qua từng pha. Dùng: npx tsx scripts/trace.ts <seed> <firm> <tháng cuối>
import { gd1Engine } from '../src/engine/modules/gd1/index';
import { PHASES } from '../src/engine/core/engine';
import { F } from '../src/engine/modules/gd1/schema';
const eng = gd1Engine();
const w = eng.newWorld({ seed: Number(process.argv[2] ?? 1), scale: 'M' });
const id = Number(process.argv[3] ?? 20);
const T = Number(process.argv[4] ?? 7);
const m = eng.modules[0];
const M = (x: number) => (x / 1e6).toFixed(1);
for (const ph of PHASES) {
  const orig = m.phases[ph];
  if (!orig) continue;
  m.phases[ph] = (ww, e) => {
    orig(ww, e);
    const f = F(ww);
    if (ww.meta.tick <= T && ww.meta.tick >= T - 3) console.log(`t${ww.meta.tick} ${ph.padEnd(8)} dep ${M(f.dep[id])} debt ${M(f.debt[id])} wk ${f.workers[id]}/${f.nTarget[id]} K ${f.K[id].toFixed(0)} iPlan ${f.iPlan[id].toFixed(0)} inv ${f.inv[id].toFixed(0)} sales ${f.sales[id].toFixed(0)} sE ${f.salesE[id].toFixed(0)} rev ${M(f.revenue[id])} vatDue ${M(f.vatDue[id])} svc ${M(f.service[id])} wage ${M(f.wage[id])} alive ${f.alive[id]}`);
  };
}
eng.run(w, T + 1);
