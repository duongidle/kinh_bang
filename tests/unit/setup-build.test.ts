// buildSetup: chỉ đưa vào những mục khác mức hiện hành (gd1-5 mục 4.4).
import { describe, expect, it } from 'vitest';
import type { SetupInfo } from '@/protocol';
import { buildSetup, changedCount } from '@/ui/setup';

const law = (id: string, value: number) => ({ id, label: id, unit: 'tỷ lệ', group: 'g', owner: 'fiscal' as const, source: 's', doc: 'd', article: '', effective: '2000-01-01', verification: 'A', value });
const info: SetupInfo = {
  laws: [law('vat.rate.standard', 0.08), law('cb.reserve.ratio', 0.03)],
  rules: [
    { id: 'firm.wage', label: 'Lương', source: 's', variants: [{ id: 'base', label: 'a' }, { id: 'flex', label: 'b' }] },
    { id: 'hh.consume', label: 'Tiêu dùng', source: 's', variants: [{ id: 'x', label: 'a' }, { id: 'y', label: 'b' }, { id: 'z', label: 'c' }] },
  ],
};

describe('buildSetup', () => {
  it('không đổi gì thì trả undefined', () => {
    expect(buildSetup(info, {}, {})).toBeUndefined();
  });
  it('đổi một luật thì chỉ có luật đó', () => {
    expect(buildSetup(info, { 'vat.rate.standard': 0.1 }, {})).toEqual({ laws: { 'vat.rate.standard': 0.1 } });
  });
  it('đặt lại đúng mặc định thì undefined', () => {
    expect(buildSetup(info, { 'vat.rate.standard': 0.08, 'cb.reserve.ratio': 0.03 }, {})).toBeUndefined();
  });
  it('sai số nhỏ hơn 1e-12 coi là mặc định', () => {
    expect(buildSetup(info, { 'vat.rate.standard': 0.08 + 1e-14 }, {})).toBeUndefined();
  });
  it('đổi biến thể thì có variants, không có laws', () => {
    expect(buildSetup(info, {}, { 'firm.wage': 'flex' })).toEqual({ variants: { 'firm.wage': 'flex' } });
  });
  it('biến thể đầu thì không đưa vào', () => {
    expect(buildSetup(info, {}, { 'firm.wage': 'base', 'hh.consume': 'x' })).toBeUndefined();
  });
  it('đổi cả luật và biến thể, id lạ bị bỏ, đếm đúng số mục', () => {
    const s = buildSetup(info, { 'cb.reserve.ratio': 0.05, 'khong.co': 1 }, { 'hh.consume': 'z', 'khong.co': 'q' });
    expect(s).toEqual({ laws: { 'cb.reserve.ratio': 0.05 }, variants: { 'hh.consume': 'z' } });
    expect(changedCount(s)).toBe(2);
    expect(changedCount(undefined)).toBe(0);
  });
});
