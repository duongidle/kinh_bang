import { gd1Engine } from '../src/engine/modules/gd1/index';
const eng = gd1Engine(); eng.checkEvery = 12;
const w = eng.newWorld({ seed: 3, scale: 'M' });
eng.run(w, 480);
for (let y = 0; y < 40; y += 3) { const t = y * 12 + 11; console.log(y + 1, 'refi', (eng.law(w, 'cb.rate.refinancing', t) * 100).toFixed(2), 'pi', (eng.value(w, 'inflation.yoy', t) * 100).toFixed(1), 'piE', (eng.value(w, 'inflation.expected', t) * 100).toFixed(1), 'trust', eng.value(w, 'trust', t).toFixed(2), 'G', eng.law(w, 'gov.purchase.share', t), 'lend', (eng.value(w, 'rate.lending', t) * 100).toFixed(1)); }
