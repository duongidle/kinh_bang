// Quy tắc gov.revenueUse (sai-khac.md D14): tiền thuế thu thêm đi đâu.
import { describe, expect, it } from 'vitest';
import { gd1Engine } from '@/engine/modules/gd1/index';
import type { World } from '@/engine/core/world';

const sum = (a: ArrayLike<number>) => Array.from(a).reduce((x, y) => x + y, 0);

/** Chạy 24 tháng, tách ba thế giới (base, keep, balanced), đổi GTGT ở tháng 24, chạy tiếp 24 tháng. */
function threeWays(seed: number, vat: number) {
  const eng = gd1Engine();
  eng.checkEvery = 1; // bốn đẳng thức kế toán kiểm mỗi tháng
  const w0 = eng.newWorld({ seed, scale: 'S' });
  eng.run(w0, 24);
  const out: Record<string, World> = {};
  for (const v of ['base', 'keep', 'balanced']) {
    const w = eng.fork(w0);
    if (v !== 'base') eng.setVariant(w, 'gov.revenueUse', v);
    eng.setLaw(w, 'vat.rate.standard', vat, 'test');
    eng.run(w, 24);
    out[v] = w;
  }
  return { eng, out };
}

describe('gov.revenueUse', () => {
  it('không đổi thuế thì gov.respend = 0 mọi tháng', () => {
    const eng = gd1Engine();
    eng.checkEvery = 1;
    const w = eng.newWorld({ seed: 5, scale: 'S' });
    eng.run(w, 36);
    expect(sum(eng.seriesOf(w, 'gov.respend', 0, 36).map(Math.abs))).toBe(0);
  });

  it('tăng GTGT lên 15%: chi lại nên base chi nhiều hơn keep, và gov.respend > 0', () => {
    const { eng, out } = threeWays(5, 0.15);
    expect(sum(eng.seriesOf(out.base, 'gov.spending', 24, 48))).toBeGreaterThan(sum(eng.seriesOf(out.keep, 'gov.spending', 24, 48)));
    expect(sum(eng.seriesOf(out.base, 'gov.respend', 24, 48))).toBeGreaterThan(0);
    expect(sum(eng.seriesOf(out.keep, 'gov.respend', 24, 48).map(Math.abs))).toBe(0);
  });

  it('hạ GTGT xuống 5%: base chi bằng keep (vay bù), balanced chi thấp hơn', () => {
    const { eng, out } = threeWays(5, 0.05);
    const spend = (w: World) => sum(eng.seriesOf(w, 'gov.spending', 24, 48));
    expect(spend(out.base)).toBe(spend(out.keep));
    expect(sum(eng.seriesOf(out.base, 'gov.respend', 24, 48).map(Math.abs))).toBe(0);
    // 12 tháng đầu sau khi đổi: xa hơn thì một vụ cứu ngân hàng (chi một lần) ở nhánh này mà không ở nhánh kia có thể đảo thứ tự
    const spend12 = (w: World) => sum(eng.seriesOf(w, 'gov.spending', 24, 36));
    expect(spend12(out.balanced)).toBeLessThan(spend12(out.keep));
    expect(sum(eng.seriesOf(out.balanced, 'gov.respend', 24, 48))).toBeLessThan(0);
  });

  it('GTGT 8% về 10% theo lịch luật (tháng 1/2027, không qua override) không kích hoạt', () => {
    const eng = gd1Engine();
    eng.checkEvery = 1;
    const w = eng.newWorld({ seed: 5, scale: 'S' });
    expect(eng.law(w, 'vat.rate.standard', 11)).toBeLessThan(eng.law(w, 'vat.rate.standard', 12));
    eng.run(w, 36);
    expect(sum(eng.seriesOf(w, 'gov.respend', 0, 36).map(Math.abs))).toBe(0);
  });
});
