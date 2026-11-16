import { describe, expect, it } from 'vitest';
import { delta12, deltaKindOf } from '../../src/ui/delta';

const ramp = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i));

describe('delta12', () => {
  it('dưới 13 điểm thì không có', () => {
    expect(delta12(ramp(12, (i) => i), 'abs')).toBeUndefined();
    expect(delta12([], 'rel')).toBeUndefined();
  });
  it('abs: cuối trừ điểm cách 12', () => {
    const s = ramp(13, (i) => 100 + i);
    expect(delta12(s, 'abs')).toBe(12);
    expect(delta12(new Float64Array(ramp(30, (i) => i * 2)), 'abs')).toBe(24);
  });
  it('rel: cuối chia điểm cách 12 trừ 1', () => {
    const s = ramp(13, (i) => (i === 0 ? 100 : i === 12 ? 110 : 105));
    expect(delta12(s, 'rel')).toBeCloseTo(0.1, 12);
  });
  it('rel: mẫu bằng 0 hoặc không hữu hạn thì không có', () => {
    expect(delta12(ramp(13, (i) => (i === 0 ? 0 : 5)), 'rel')).toBeUndefined();
    expect(delta12(ramp(13, (i) => (i === 0 ? NaN : 5)), 'rel')).toBeUndefined();
    expect(delta12(ramp(13, (i) => (i === 12 ? Infinity : 5)), 'rel')).toBeUndefined();
  });
  it('abs vẫn tính được khi điểm đầu bằng 0', () => {
    expect(delta12(ramp(13, (i) => (i === 12 ? 0.05 : 0)), 'abs')).toBeCloseTo(0.05, 12);
  });
});

describe('deltaKindOf', () => {
  it("'%' và 'tỷ lệ' so bằng hiệu, còn lại so tương đối", () => {
    expect(deltaKindOf('%')).toBe('abs');
    expect(deltaKindOf('tỷ lệ')).toBe('abs');
    expect(deltaKindOf('đồng')).toBe('rel');
    expect(deltaKindOf('chỉ số')).toBe('rel');
    expect(deltaKindOf('người')).toBe('rel');
  });
});
