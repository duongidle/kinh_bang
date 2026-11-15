import { describe, it, expect } from 'vitest';
import { num, money, fmt, fmtDelta, fmtPctChange } from '../../src/ui/format';

describe('format: số kiểu Việt Nam', () => {
  it('dấu chấm ngăn nghìn, dấu phẩy thập phân', () => {
    expect(num(1234567.5, 1)).toBe('1.234.567,5');
    expect(num(1234567)).toBe('1.234.567');
    expect(num(0.5, 2)).toBe('0,50');
  });
  it('không hữu hạn thì hiện dấu gạch', () => {
    expect(num(NaN)).toBe('–');
    expect(money(Infinity)).toBe('–');
  });
});

describe('format: tiền', () => {
  it('đúng bốn hậu tố', () => {
    expect(money(1.5e12)).toBe('1,50 nghìn tỷ đồng');
    expect(money(820e9)).toBe('820 tỷ đồng');
    expect(money(12.5e9)).toBe('12,5 tỷ đồng');
    expect(money(3.4e6)).toBe('3,4 triệu đồng');
    expect(money(950)).toBe('950 đồng');
  });
  it('fmt gọi money cho đơn vị đồng', () => {
    expect(fmt(2e9, 'đồng')).toBe('2,0 tỷ đồng');
  });
});

describe('format: mức đổi', () => {
  it('hiệu của hai tỷ lệ ghi điểm phần trăm', () => {
    expect(fmtDelta(0.02, '%')).toBe('+2,00 điểm phần trăm');
    expect(fmtDelta(-0.005, 'tỷ lệ')).toBe('−0,50 điểm phần trăm');
    expect(fmtDelta(0.01, '%/năm')).toBe('+1,00 điểm phần trăm');
  });
  it('các nhánh khác giữ nguyên', () => {
    expect(fmtDelta(5e9, 'đồng')).toBe('+5,0 tỷ đồng');
    expect(fmtDelta(NaN, '%')).toBe('–');
  });
  it('fmtPctChange: có dấu, một chữ số thập phân', () => {
    expect(fmtPctChange(0.025)).toBe('+2,5%');
    expect(fmtPctChange(-0.003)).toBe('−0,3%');
    expect(fmtPctChange(0)).toBe('0,0%');
    expect(fmtPctChange(NaN)).toBe('–');
    expect(fmtPctChange(Infinity)).toBe('–');
    expect(fmtPctChange(0.072)).toBe('+7,2%');
  });
});
