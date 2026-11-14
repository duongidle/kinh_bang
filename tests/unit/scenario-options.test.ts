// Phân rã ba chỉ số của Chính phủ và tiền lương, người bán chuyển một phần thuế vào giá, lương bám lạm phát,
// và bảng so sánh song song các lựa chọn của kịch bản.
import { describe, expect, it } from 'vitest';
import { contributions } from '@/engine/causal/causal';
import { gd1Engine } from '@/engine/modules/gd1/index';
import type { ScenarioDef } from '@/engine/scenario/types';
import { Session } from '@/engine/session/session';
import type { OptionsReport } from '@/protocol';

describe('phân rã theo lý do', () => {
  it('lương thực, bội chi/GDP, nợ công/GDP: các phần cộng lại đúng bằng mức đổi', () => {
    const eng = gd1Engine();
    const w = eng.newWorld({ seed: 3, scale: 'S' });
    eng.run(w, 12);
    eng.setLaw(w, 'gov.purchase.share', 0.08, 'test');
    eng.run(w, 24);
    const t0 = 12;
    const t1 = 35;
    const other: Record<string, number> = {};
    for (const id of ['wage.real', 'gov.deficitGdp', 'gov.debtGdp']) {
      const parts = contributions(w, id, t0, t1);
      const sum = Object.values(parts).reduce((a, b) => a + b, 0);
      const delta = eng.value(w, id, t1) - eng.value(w, id, t0);
      expect(Math.abs(sum - delta)).toBeLessThanOrEqual(1e-9 * Math.max(1e-12, Math.abs(delta)) + 1e-15);
      const abs = Object.values(parts).reduce((a, b) => a + Math.abs(b), 0);
      other[id] = abs > 0 ? Math.abs(parts.other ?? 0) / abs : 0;
      if (id !== 'gov.debtGdp') expect(other[id]).toBeLessThan(1e-6);
    }
    // gov.debtGdp: phần "other" chỉ được báo cáo, không đòi hỏi
    expect(Number.isFinite(other['gov.debtGdp'])).toBe(true);
  });
});

describe('người bán chỉ chuyển một phần thuế vào giá', () => {
  it('tăng GTGT: giá có thuế tăng ít hơn ở mặc định so với chuyển hết, và cả hai đều tăng', () => {
    const eng = gd1Engine();
    const a = eng.newWorld({ seed: 5, scale: 'S' });
    eng.run(a, 24);
    const b = eng.fork(a);
    b.params['firm.taxPassThrough'] = 1;
    for (const w of [a, b]) {
      eng.setLaw(w, 'vat.rate.standard', 0.2, 'test');
      eng.run(w, 1);
    }
    const rise = (w: typeof a) => eng.value(w, 'price.formal.taxed', 24) / eng.value(w, 'price.formal.taxed', 23) - 1;
    expect(rise(a)).toBeGreaterThan(0);
    expect(rise(b)).toBeGreaterThan(0);
    expect(rise(a)).toBeLessThan(rise(b));
  });
});

describe('lương bám lạm phát', () => {
  const reasons = (variant: string) => {
    const eng = gd1Engine();
    const w = eng.newWorld({ seed: 2, scale: 'S', laws: { 'cb.monetize': 1, 'gov.purchase.share': 0.1 } });
    eng.setVariant(w, 'firm.wageIndexBase', variant);
    eng.run(w, 36);
    const set = new Set<string>();
    for (const d of w.causal.decisions) if (d.rule === 'firm.wage') for (const p of d.parts) set.add(p.reason);
    return set;
  };
  it('mặc định bám lạm phát đã qua (w_index), biến thể expected bám kỳ vọng (w_index_exp)', () => {
    const base = reasons('base');
    expect(base.has('w_index')).toBe(true);
    expect(base.has('w_index_exp')).toBe(false);
    const exp = reasons('expected');
    expect(exp.has('w_index_exp')).toBe(true);
    expect(exp.has('w_index')).toBe(false);
  });
});

describe('so sánh song song các lựa chọn', () => {
  const claim = (text: string) => ({ text, test: () => ({ ok: true, detail: 'thử' }) });
  const def: ScenarioDef = {
    id: 'thu-nhieu-nhanh',
    title: 'Thử nhiều nhánh',
    role: 'fiscal',
    scale: 'S',
    question: '',
    intro: '',
    prereq: [],
    warmup: 12,
    months: 24,
    goals: [],
    predict: [],
    demo: [{ at: 0, laws: { 'vat.rate.standard': 0.2 } }],
    options: [
      { id: 'mua', label: 'Mua hàng', note: 'Chính phủ mua thêm.', steps: [{ at: 6, laws: { 'gov.purchase.share': 0.12 } }], claims: [claim('riêng mua')] },
      { id: 'khong', label: 'Không chi', note: 'Không làm gì thêm.', steps: [], claims: [claim('riêng không')] },
    ],
    compare: [
      { indicator: 'gdp.real', label: 'GDP thực', kind: 'rel', from: 12, to: 24 },
      { indicator: 'gov.deficitGdp', label: 'Bội chi/GDP', kind: 'pt', from: 12, to: 24 },
    ],
    claims: [claim('chung')],
    explanation: '',
    simplifications: [],
  };
  it('hai nhánh khác nhau, thế giới đang chạy không bị đụng, hỏi hai lần cho cùng số', () => {
    const s = new Session([def]);
    s.handle({ type: 'init', scale: 'S', seed: 6, scenario: def.id });
    s.handle({ type: 'step', months: 5 });
    const h0 = s.eng.hash(s.w);
    const r1 = s.scenarioOptions();
    expect(s.eng.hash(s.w)).toBe(h0);
    expect(r1.rows).toHaveLength(2);
    expect(r1.player).toBeUndefined();
    for (const r of r1.rows) {
      expect(r.values).toHaveLength(2);
      for (const v of r.values) expect(Number.isFinite(v)).toBe(true);
      expect(r.common).toHaveLength(1);
      expect(r.claims).toHaveLength(1);
    }
    expect(r1.rows[0].values).not.toEqual(r1.rows[1].values);
    const r2 = JSON.parse(JSON.stringify(s.scenarioOptions())) as OptionsReport;
    expect(r2).toEqual(JSON.parse(JSON.stringify(r1)));
    expect(s.eng.hash(s.w)).toBe(h0);
    // qua giao thức, và có dòng của người chơi khi đã hết kịch bản
    s.handle({ type: 'step', months: 24 });
    const m = s.handle({ type: 'query', rid: 1, q: { kind: 'scenarioOptions' } });
    expect(m[0].type).toBe('result');
    expect((m[0] as { data: OptionsReport }).data.player?.values).toHaveLength(2);
  });
  it('kịch bản không có lựa chọn thì báo lỗi bằng tiếng Việt', () => {
    const s = new Session([{ ...def, options: undefined }]);
    s.handle({ type: 'init', scale: 'S', seed: 6, scenario: def.id });
    expect(() => s.scenarioOptions()).toThrow(/không có nhiều lựa chọn/);
  });
});
