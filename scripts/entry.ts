import { gd1Engine } from '../src/engine/modules/gd1/index';
(globalThis as any).__dbgEntry = 1;
const eng = gd1Engine(); eng.checkEvery = 12;
const w = eng.newWorld({ seed: 1, scale: 'M' });
eng.run(w, Number(process.argv[2] ?? 120));
