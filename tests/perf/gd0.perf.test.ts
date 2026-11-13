// K0.12: 5000 hộ, một tháng không quá 30 ms (nền đồ chơi).
import { describe, expect, it } from 'vitest';
import { toyEngine } from '@/engine/modules/toy';

describe('K0.12 hiệu năng engine', () => {
  it('nền đồ chơi 5000 hộ', () => {
    const eng = toyEngine();
    eng.checkEvery = 12;
    const w = eng.newWorld({ seed: 1, scale: 'L' });
    eng.run(w, 12);
    const t0 = performance.now();
    eng.run(w, 60);
    const ms = (performance.now() - t0) / 60;
    console.log(`toy L: ${ms.toFixed(2)} ms/tháng`);
    expect(ms).toBeLessThan(30);
  });
});
