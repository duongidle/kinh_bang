import { describe, it, expect } from 'vitest';
import { parseViNumber, decimalsOf } from '../../src/ui/design/components/util';

describe('đọc số kiểu Việt Nam (ô nhập số)', () => {
  it('dấu phẩy là thập phân, dấu chấm ngăn nghìn', () => {
    expect(parseViNumber('1.234,5')).toBe(1234.5);
    expect(parseViNumber('0,25')).toBe(0.25);
    expect(parseViNumber('1.234.567')).toBe(1234567);
    expect(parseViNumber('-3,5')).toBe(-3.5);
    expect(parseViNumber('−3,5')).toBe(-3.5);
  });
  it('một dấu chấm không theo nhóm ba chữ số là thập phân', () => {
    expect(parseViNumber('2.5')).toBe(2.5);
  });
  it('không đọc được thì NaN', () => {
    expect(parseViNumber('')).toBeNaN();
    expect(parseViNumber('abc')).toBeNaN();
    expect(parseViNumber('1,2,3')).toBeNaN();
  });
  it('số chữ số thập phân theo bước nhảy', () => {
    expect(decimalsOf(1)).toBe(0);
    expect(decimalsOf(0.1)).toBe(1);
    expect(decimalsOf(0.25)).toBe(2);
    expect(decimalsOf(0.005)).toBe(3);
  });
});
