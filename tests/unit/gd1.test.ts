// Test nhanh của GĐ1: kế toán, tất định, lưu/tải, biến thể. Kiểm định thống kê nằm ở tests/validation.
import { describe, expect, it } from 'vitest';
import type { ScaleId } from '@/engine/core/world';
import { gd1Engine } from '@/engine/modules/gd1/index';

const run = (scale: ScaleId, seed: number, months: number, variants: Record<string, string> = {}, laws: Record<string, number> = {}) => {
  const eng = gd1Engine(); // checkEvery = 1: vỡ một trong bốn đẳng thức là ném lỗi (K1.1)
  const w = eng.newWorld({ seed, scale, variants, laws });
  eng.run(w, months);
  return { eng, w };
};

describe('GĐ1 kế toán', () => {
  for (const [scale, months] of [['S', 120], ['M', 120], ['L', 12]] as const) {
    it(`K1.1-K1.3, K1.30 ở quy mô ${scale}`, () => {
      const { eng, w } = run(scale, 11, months);
      const m2 = eng.seriesOf(w, 'money.m2');
      const gdp = eng.seriesOf(w, 'gdp.nominal');
      const inc = eng.seriesOf(w, 'gdp.income');
      const below = eng.seriesOf(w, 'wage.belowMin');
      const nk = w.ledger.nkind;
      for (let t = 1; t < months; t++) {
        // K1.2: thay đổi tiền của công chúng = tổng các kênh tạo và huỷ tiền ghi trong sổ cái
        let d = 0;
        for (let k = 0; k < nk; k++) d += w.ledger.moneyHist[t * nk + k];
        expect(Math.abs(m2[t] - m2[t - 1] - d)).toBeLessThan(1);
        // K1.3: GDP theo chi tiêu = GDP theo thu nhập
        expect(Math.abs(gdp[t] - inc[t])).toBeLessThan(1e-6 * gdp[t] + 10);
        // K1.30: không doanh nghiệp nào trả dưới lương tối thiểu vùng
        expect(below[t]).toBe(0);
      }
      expect(eng.check(w)).toEqual([]);
    });
  }
  it('K1.4 phá sản và gia nhập có xảy ra mà sổ vẫn cân', () => {
    const { eng, w } = run('M', 5, 180);
    const sum = (id: string) => eng.seriesOf(w, id).reduce((a, b) => a + b, 0);
    expect(sum('firms.bankrupt')).toBeGreaterThan(0);
    expect(sum('firms.entries')).toBeGreaterThan(0);
  });
});

describe('GĐ1 tất định', () => {
  it('cùng seed cùng kết quả; lưu rồi tải không đổi tương lai; tách nhánh độc lập', () => {
    const a = run('M', 3, 36);
    const b = run('M', 3, 36);
    expect(a.eng.hash(a.w)).toBe(b.eng.hash(b.w));
    const bytes = a.eng.save(a.w);
    const fork = a.eng.fork(a.w);
    a.eng.run(a.w, 24);
    const c = a.eng.load(bytes);
    a.eng.run(c, 24);
    expect(a.eng.hash(c)).toBe(a.eng.hash(a.w));
    a.eng.setLaw(fork, 'cb.rate.refinancing', 0.1);
    a.eng.run(fork, 24);
    expect(a.eng.hash(fork)).not.toBe(a.eng.hash(a.w));
    expect(run('M', 4, 36).eng.hash(run('M', 4, 36).w)).not.toBe(a.eng.hash(b.w));
  });
});

describe('GĐ1 biến thể Phòng thí nghiệm và công cụ chính sách giữ sổ cân', () => {
  const eng0 = gd1Engine();
  for (const r of eng0.rules.values())
    for (const v of r.variants.slice(1))
      it(`${r.id} = ${v.id}`, () => {
        const { w } = run('S', 2, 48, { [r.id]: v.id });
        expect(w.meta.modified).toBe(true);
      });
  it('in tiền, phát tiền, tắt thị trường mở, tắt room', () => {
    run('S', 2, 48, {}, { 'cb.monetize': 1, 'gov.transfer.universal': 1_000_000, 'cb.omo.auto': 0, 'cb.room.enabled': 0, 'gov.transfer.unemployed': 0.4 });
  });
});
