// Chạy trước, lịch đứng yên (sai-khac.md D16): `prewarm` tháng đầu lịch đứng ở tháng bắt đầu, tick vẫn đếm bình thường.
import { describe, expect, it } from 'vitest';
import { gd1Engine } from '@/engine/modules/gd1/index';
import { dateOf } from '@/engine/core/world';

const VAT = 'vat.rate.standard';

describe('prewarm: lịch đứng yên', () => {
  it('luật giữ phiên bản ban đầu suốt prewarm + 11 tháng, đổi đúng ở prewarm + 12', () => {
    const eng = gd1Engine();
    eng.checkEvery = 0;
    const plain = eng.newWorld({ seed: 3, scale: 'S' });
    const w = eng.newWorld({ seed: 3, scale: 'S', prewarm: 24 });
    const first = eng.law(plain, VAT, 0);
    expect(first).toBe(0.08);
    for (let t = 0; t <= 24 + 11; t++) expect(eng.law(w, VAT, t), `tick ${t}`).toBe(first);
    expect(eng.law(w, VAT, 24 + 12)).toBe(0.1);
    // chạy thật, không chỉ hỏi luật theo tick
    eng.run(w, 24 + 12);
    expect(w.meta.tick).toBe(36);
    expect(eng.law(w, VAT)).toBe(0.1);
    expect(eng.law(w, VAT, 35)).toBe(first);
    // lịch ở tick prewarm trùng lịch ở tick 0 của thế giới không prewarm
    expect(dateOf(w, 24)).toEqual(dateOf(plain, 0));
    expect(dateOf(w, 0)).toEqual(dateOf(plain, 0));
    expect(dateOf(w, 24 + 5)).toEqual(dateOf(plain, 5));
  });

  it('prewarm không phải bội của 12 hoặc âm thì ném lỗi', () => {
    const eng = gd1Engine();
    for (const p of [1, 11, 13, 25, -12, 12.5, NaN]) {
      expect(() => eng.newWorld({ seed: 1, scale: 'S', prewarm: p }), String(p)).toThrow(/bội của 12/);
    }
    expect(() => eng.newWorld({ seed: 1, scale: 'S', prewarm: 0 })).not.toThrow();
    expect(() => eng.newWorld({ seed: 1, scale: 'S', prewarm: 36 })).not.toThrow();
  });

  it('pack và unpack giữ prewarm; fork giữ nguyên; ván lưu cũ không có trường này đọc thành 0', () => {
    const eng = gd1Engine();
    eng.checkEvery = 0;
    const w = eng.newWorld({ seed: 5, scale: 'S', prewarm: 36 });
    eng.run(w, 3);
    const back = eng.load(eng.save(w));
    expect(back.meta.prewarm).toBe(36);
    expect(eng.fork(w).meta.prewarm).toBe(36);
    expect(dateOf(back, 3)).toEqual(dateOf(w, 3));
    const old = eng.fork(w);
    delete (old.meta as Partial<typeof old.meta>).prewarm;
    expect(dateOf(old, 14)).toEqual(dateOf(eng.newWorld({ seed: 5, scale: 'S' }), 14));
  });

  it('prewarm = 0 cho kết quả trùng với không khai (từng bit trạng thái kinh tế)', () => {
    const eng = gd1Engine();
    eng.checkEvery = 0;
    const a = eng.newWorld({ seed: 9, scale: 'S' });
    const b = eng.newWorld({ seed: 9, scale: 'S', prewarm: 0 });
    eng.run(a, 18);
    eng.run(b, 18);
    expect(eng.hash(b)).toBe(eng.hash(a));
  });
});
