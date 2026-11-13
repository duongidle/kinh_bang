// Kiểm định GĐ0 (docs/design/gd0.md mục 10).
import { describe, expect, it } from 'vitest';
import { resolveVersion } from '@/config/law';
import { VN_LAWS } from '@/config/vn/laws';
import { contributions, explain, rootsOf } from '@/engine/causal/causal';
import { Engine, type EngineModule } from '@/engine/core/engine';
import { pack, unpack } from '@/engine/core/pack';
import { rand } from '@/engine/core/rng';
import { addColumns, addRow, f64 } from '@/engine/core/table';
import { BANK, CB_REF, FIRM, GOV_REF, HH, ref, type ScaleId } from '@/engine/core/world';
import { checkInvariants } from '@/engine/ledger/invariants';
import { NKIND, tx } from '@/engine/ledger/kinds';
import * as L from '@/engine/ledger/ledger';
import { toyEngine, toyModule } from '@/engine/modules/toy';

const SCALES: ScaleId[] = ['S', 'M', 'L'];

describe('K0.1 tất định', () => {
  for (const scale of SCALES) {
    it(`cùng seed cùng kết quả, quy mô ${scale}`, () => {
      const eng = toyEngine();
      const a = eng.newWorld({ seed: 7, scale });
      const b = eng.newWorld({ seed: 7, scale });
      eng.run(a, 120);
      eng.run(b, 120);
      expect(eng.hash(a)).toBe(eng.hash(b));
      const c = eng.newWorld({ seed: 8, scale });
      eng.run(c, 120);
      expect(eng.hash(c)).not.toBe(eng.hash(a));
    });
  }
  it('rand không có trạng thái', () => {
    expect(rand(1, 2, 3, 4, 5)).toBe(rand(1, 2, 3, 4, 5));
    expect(rand(1, 2, 3, 4, 5)).not.toBe(rand(1, 2, 3, 4, 6));
    let s = 0;
    for (let i = 0; i < 20000; i++) s += rand(9, 1, i, 0);
    expect(s / 20000).toBeGreaterThan(0.49);
    expect(s / 20000).toBeLessThan(0.51);
  });
});

describe('K0.3 lưu rồi tải không đổi tương lai', () => {
  it('lưu ở tháng 60, tải, chạy tới 120', () => {
    const eng = toyEngine();
    const a = eng.newWorld({ seed: 3, scale: 'M' });
    eng.run(a, 60);
    const bytes = eng.save(a);
    eng.run(a, 60);
    const b = eng.load(bytes);
    eng.run(b, 60);
    expect(eng.hash(b)).toBe(eng.hash(a));
  });
  it('pack và unpack giữ nguyên mảng số', () => {
    const o = { a: new Float64Array([1.5, -2, 3e15]), b: { c: new Int32Array([1, -7]), d: 'chữ' }, e: new Uint8Array([1, 2, 3]) };
    const r = unpack<typeof o>(pack(o));
    expect(Array.from(r.a)).toEqual([1.5, -2, 3e15]);
    expect(Array.from(r.b.c)).toEqual([1, -7]);
    expect(r.b.d).toBe('chữ');
    expect(Array.from(r.e)).toEqual([1, 2, 3]);
  });
});

describe('K0.4 tách nhánh sạch', () => {
  it('nhánh không can thiệp trùng gốc', () => {
    const eng = toyEngine();
    const a = eng.newWorld({ seed: 5, scale: 'M' });
    eng.run(a, 30);
    const b = eng.fork(a);
    eng.run(a, 30);
    eng.run(b, 30);
    expect(eng.hash(b)).toBe(eng.hash(a));
  });
  it('nhánh có can thiệp: lựa chọn ngẫu nhiên của tác nhân vẫn giống gốc', () => {
    const eng = toyEngine();
    const a = eng.newWorld({ seed: 5, scale: 'S' });
    eng.run(a, 10);
    const b = eng.fork(a);
    eng.setLaw(b, 'gov.wage.premium', 2);
    eng.step(a);
    eng.step(b);
    // Cùng hộ, cùng tháng: cùng chọn một cửa hàng ở cả hai thế giới.
    const shops = (w: typeof a) => {
      const out: number[] = [];
      const Lg = w.ledger;
      for (let i = 0; i < Lg.count && i < Lg.cap; i++)
        if (Lg.tTick[i] === 10 && Lg.tKind[i] === tx('consumption')) out.push(Lg.tFrom[i] * 1000 + (Lg.tTo[i] & 0xffffff));
      return out;
    };
    expect(shops(b)).toEqual(shops(a));
    expect(eng.hash(b)).not.toBe(eng.hash(a));
  });
});

describe('K0.5 sổ cái không rò', () => {
  it('10^5 phép nguyên thuỷ ngẫu nhiên giữ bốn đẳng thức', () => {
    const blank: EngineModule = {
      id: 'blank',
      stage: 0,
      dependsOn: [],
      schemaVersion: 1,
      setup() {},
      init(w) {
        for (let b = 0; b < 3; b++) addRow(w.tables.bank);
        addRow(w.tables.gov);
        addRow(w.tables.cb);
        for (let b = 0; b < 3; b++) L.seedReserves(w, b, 5e8);
        for (let i = 0; i < 20; i++) {
          addRow(w.tables.hh, { bank: i % 3 });
          L.seedDeposit(w, ref(HH, i), 2e7);
          L.seedCash(w, ref(HH, i), 3e6);
        }
        for (let i = 0; i < 6; i++) {
          addRow(w.tables.firm, { bank: (i + 1) % 3 });
          L.seedDeposit(w, ref(FIRM, i), 1e8);
        }
      },
      phases: {},
    };
    const eng = new Engine([blank]);
    const w = eng.newWorld({ seed: 1, scale: 'S' });
    expect(checkInvariants(w)).toEqual([]);
    L.beginTick(w);
    const R = (k: number, n: number) => Math.floor(rand(99, 0, k, 0) * n);
    const agent = (k: number) => {
      const s = R(k, 10);
      if (s < 5) return ref(HH, R(k + 1, 20));
      if (s < 8) return ref(FIRM, R(k + 1, 6));
      if (s < 9) return ref(BANK, R(k + 1, 3));
      return GOV_REF;
    };
    for (let i = 0; i < 100000; i++) {
      const k = i * 7;
      const op = R(k, 12);
      const amt = 1 + R(k + 2, 5e6);
      if (op <= 3) L.transfer(w, agent(k + 3), agent(k + 5), amt, R(k + 6, 2), tx('other'), 0, R(k + 4, 2) === 1);
      else if (op === 4) L.withdrawCash(w, ref(HH, R(k + 1, 20)), amt);
      else if (op === 5) L.depositCash(w, ref(HH, R(k + 1, 20)), amt);
      else if (op === 6) L.createLoan(w, R(k + 1, 3), ref(FIRM, R(k + 3, 6)), amt * 10, { rate: 0.1, months: 12 });
      else if (op === 7) {
        const n = w.tables.loan.n;
        if (n) L.serviceLoan(w, R(k + 1, n));
      } else if (op === 8) {
        const n = w.tables.loan.n;
        if (n) L.writeOffLoan(w, R(k + 1, n), amt);
      } else if (op === 9) L.issueBond(w, R(k + 1, 2) ? CB_REF : ref(BANK, R(k + 3, 3)), amt * 5, 0.03, 12);
      else if (op === 10) {
        const n = w.tables.bond.n;
        if (n) {
          const b = R(k + 1, n);
          L.payCoupon(w, b);
          if (R(k + 3, 3) === 0) L.redeemBond(w, b);
        }
      } else L.cbRepay(w, R(k + 1, 3), amt * 3);
      if (i % 5000 === 0) expect(checkInvariants(w)).toEqual([]);
    }
    expect(checkInvariants(w)).toEqual([]);
    for (const t of [w.tables.hh, w.tables.firm]) {
      for (let i = 0; i < t.n; i++) {
        expect(f64(t, 'cash')[i]).toBeGreaterThanOrEqual(0);
        expect(f64(t, 'dep')[i]).toBeGreaterThanOrEqual(0);
      }
    }
    expect(Number.isInteger(f64(w.tables.cb, 'cashOut')[0])).toBe(true);
  });

  it('cho vay tạo tiền gửi, trả gốc huỷ tiền', () => {
    const eng = toyEngine();
    const w = eng.newWorld({ seed: 1, scale: 'S' });
    const m0 = L.publicMoney(w).deposits;
    const loan = L.createLoan(w, 0, ref(FIRM, 0), 100e6, { rate: 0.12, months: 10 });
    expect(L.publicMoney(w).deposits).toBe(m0 + 100e6);
    const r = L.serviceLoan(w, loan);
    expect(r.paidPrincipal).toBe(10e6);
    expect(r.paidInterest).toBe(1e6);
    // gốc bị huỷ; lãi rời khỏi tay công chúng sang vốn ngân hàng
    expect(L.publicMoney(w).deposits).toBe(m0 + 100e6 - 10e6 - 1e6);
    expect(checkInvariants(w)).toEqual([]);
  });
});

describe('K0.6 và K0.7 chuỗi nhân quả', () => {
  const eng = toyEngine();
  const w = eng.newWorld({ seed: 11, scale: 'M' });
  eng.run(w, 10);
  const twin = eng.fork(w);
  eng.setLaw(w, 'gov.wage.premium', 1.5);
  eng.run(w, 8);
  eng.run(twin, 8);

  it('phân rã cộng đúng bằng mức thay đổi', () => {
    for (const [t0, t1] of [[9, 10], [9, 17], [3, 12], [0, 17]]) {
      const parts = contributions(w, 'toy.consumption', t0, t1);
      const sum = Object.values(parts).reduce((a, b) => a + b, 0);
      const delta = eng.value(w, 'toy.consumption', t1) - eng.value(w, 'toy.consumption', t0);
      expect(Math.abs(sum - delta)).toBeLessThan(1);
    }
  });

  it('chuỗi kết thúc ở đúng chính sách đã tiêm', () => {
    const tree = explain(eng, w, 'toy.consumption', 9, 17);
    expect(tree.delta).toBeGreaterThan(0);
    const roots = rootsOf(tree);
    const law = roots.find((r) => r.kind === 'law' && r.id === 'gov.wage.premium');
    expect(law).toBeTruthy();
    expect(law!.events!.length).toBe(1);
    expect(law!.events![0].after).toBe(1.5);
    // vòng phản hồi (tiêu dùng → doanh thu → lương → tiêu dùng) được nhận ra
    expect(tree.children.some((c) => c.reason === 'toy_public_income')).toBe(true);
  });

  it('đối chứng bỏ chính sách: chỉ số về quỹ đạo gốc', () => {
    const base = eng.newWorld({ seed: 11, scale: 'M' });
    eng.run(base, 18);
    expect(eng.value(twin, 'toy.consumption', 17)).toBe(eng.value(base, 'toy.consumption', 17));
    expect(eng.value(w, 'toy.consumption', 17)).toBeGreaterThan(eng.value(twin, 'toy.consumption', 17));
  });
});

describe('K0.8 luật theo ngày', () => {
  it('thuế GTGT 8% tới hết 2026, 10% từ 2027', () => {
    const eng = toyEngine();
    const w = eng.newWorld({ seed: 1, scale: 'S', startYear: 2026, startMonth: 12 });
    expect(eng.law(w, 'vat.rate.standard')).toBe(0.08);
    eng.step(w);
    expect(eng.law(w, 'vat.rate.standard')).toBe(0.1);
    const p = VN_LAWS.find((l) => l.id === 'vat.rate.standard')!;
    expect(resolveVersion(p, '2026-12-31').value).toBe(0.08);
    expect(resolveVersion(p, '2027-01-01').value).toBe(0.1);
    expect(resolveVersion(p, '2020-05-01').value).toBe(0.1);
  });
  it('mọi tham số có nguồn, ngày, mức xác minh; mức C phải gắn nhãn', () => {
    const ids = new Set<string>();
    for (const p of VN_LAWS) {
      expect(ids.has(p.id), p.id).toBe(false);
      ids.add(p.id);
      expect(p.versions.length).toBeGreaterThan(0);
      for (const v of p.versions) {
        expect(v.source.doc.length, p.id).toBeGreaterThan(3);
        expect(v.from, p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(['A', 'B', 'C']).toContain(v.verification);
        if (v.verification === 'C') expect(v.chuaXacMinh, p.id).toBe(true);
        else expect(v.chuaXacMinh, p.id).toBeUndefined();
      }
    }
  });
  it('người chơi đổi luật thành một sự kiện gốc', () => {
    const eng = toyEngine();
    const w = eng.newWorld({ seed: 1, scale: 'S' });
    eng.run(w, 3);
    eng.setLaw(w, 'vat.rate.standard', 0.12);
    expect(eng.law(w, 'vat.rate.standard')).toBe(0.12);
    expect(eng.law(w, 'vat.rate.standard', 2)).toBe(0.08);
    expect(w.events.at(-1)).toMatchObject({ tick: 3, type: 'policy', id: 'vat.rate.standard', before: 0.08, after: 0.12 });
  });
});

describe('K0.9 module gắn thêm không sửa lõi', () => {
  it('module giả thêm cột, pha, chỉ số', () => {
    const extra: EngineModule = {
      id: 'extra',
      stage: 9,
      dependsOn: ['toy'],
      schemaVersion: 1,
      setup: (w) => addColumns(w.tables.hh, [{ name: 'happy', type: 'f64', def: 1 }]),
      init() {},
      phases: {
        close(w) {
          const h = f64(w.tables.hh, 'happy');
          for (let i = 0; i < w.tables.hh.n; i++) h[i] += 1;
        },
      },
      indicators: [{ id: 'extra.happy', label: 'Vui', unit: 'số', group: 'x', compute: (w) => f64(w.tables.hh, 'happy')[0] }],
    };
    const eng = toyEngine([extra]);
    const w = eng.newWorld({ seed: 1, scale: 'S' });
    eng.run(w, 5);
    expect(eng.value(w, 'extra.happy')).toBe(6);
    expect(() => new Engine([extra])).toThrow();
  });
});

describe('K0.11 cờ sửa luật kinh tế', () => {
  it('chọn biến thể khác gốc thì modified bật và không tự tắt', () => {
    const eng = toyEngine();
    const w = eng.newWorld({ seed: 1, scale: 'S' });
    expect(w.meta.modified).toBe(false);
    eng.setVariant(w, 'toy.consume', 'all');
    expect(w.meta.modified).toBe(true);
    eng.setVariant(w, 'toy.consume', 'base');
    expect(w.meta.modified).toBe(true);
    expect(eng.variant(w, 'toy.consume')).toBe('base');
    const r = eng.load(eng.save(w));
    expect(r.meta.modified).toBe(true);
  });
});

describe('sổ loại giao dịch', () => {
  it('đủ nhỏ để lưu trong một byte và không trùng', () => {
    expect(NKIND).toBeLessThan(256);
    expect(toyModule.id).toBe('toy');
  });
});
