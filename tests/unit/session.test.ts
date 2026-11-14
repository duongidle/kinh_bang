// Giao thức và phiên làm việc của engine: K0.2 (qua tin nhắn cho cùng kết quả), K0.10 (engine sạch), K0.12 (cỡ tin tick),
// thế giới đối chứng, lưu tải, vai người chơi.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { gd1Engine } from '@/engine/modules/gd1/index';
import { F, H } from '@/engine/modules/gd1/schema';
import { Session } from '@/engine/session/session';
import type { ScenarioDef } from '@/engine/scenario/types';
import type { Command, CounterfactualResult, EngineMsg, TickMsg } from '@/protocol';

/** Gửi lệnh như Worker: lệnh và tin trả về đều đi qua structuredClone. */
function send(s: Session, cmd: Command): EngineMsg[] {
  return structuredClone(s.handle(structuredClone(cmd)));
}
const tickOf = (m: EngineMsg[]) => m.find((x) => x.type === 'tick') as TickMsg;
const result = <T>(m: EngineMsg[]) => {
  const r = m[0];
  if (r.type !== 'result') throw new Error(r.type === 'error' ? r.message : r.type);
  return r.data as T;
};

describe('K0.2 qua giao thức cho cùng kết quả với gọi thẳng', () => {
  it('24 tháng, 50 hộ', () => {
    const s = new Session();
    send(s, { type: 'init', scale: 'S', seed: 7 });
    for (let i = 0; i < 6; i++) send(s, { type: 'step', months: 4 });
    const a = result<{ hash: string }>(send(s, { type: 'query', rid: 1, q: { kind: 'hash' } })).hash;
    const eng = gd1Engine();
    const w = eng.newWorld({ seed: 7, scale: 'S' });
    eng.run(w, 24);
    expect(a).toBe(eng.hash(w));
  });
});

describe('K0.10 engine sạch', () => {
  it('không import UI, không dùng API trình duyệt, Math.random hay Date', () => {
    const bad: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts')) {
          const src = readFileSync(p, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
          if (/from ['"][^'"]*\/ui\/|from ['"]react|from ['"]zustand/.test(src)) bad.push(`${p}: import UI`);
          if (/\bMath\.random\b|\bnew Date\b|\bDate\.now\b|\bperformance\.now\b/.test(src)) bad.push(`${p}: thời gian hoặc ngẫu nhiên thật`);
          if (/\b(window|document|navigator|localStorage|indexedDB)\./.test(src)) bad.push(`${p}: API trình duyệt`);
        }
      }
    };
    walk('src/engine');
    walk('src/config');
    expect(bad).toEqual([]);
  });
});

describe('tin tick', () => {
  it('K0.12: không quá 300 KB ở 5000 hộ', () => {
    const s = new Session();
    s.handle({ type: 'init', scale: 'L', seed: 1 });
    const t = tickOf(s.handle({ type: 'step', months: 2 }));
    let bytes = 0;
    const walk = (v: unknown) => {
      if (!v || typeof v !== 'object') return;
      if (ArrayBuffer.isView(v)) bytes += v.byteLength;
      else for (const k in v as object) walk((v as Record<string, unknown>)[k]);
    };
    walk(t);
    bytes += JSON.stringify(t, (_k, v) => (ArrayBuffer.isView(v) ? undefined : v)).length;
    expect(bytes).toBeLessThan(300_000);
    expect(t.frame!.nHh).toBe(5000);
    // tổng theo loại của mẫu giao dịch là tổng đúng của cả tháng
    expect(t.tx!.totals.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });
});

describe('thế giới đối chứng', () => {
  it('bỏ một chính sách thì trùng với ván chưa từng có chính sách đó', () => {
    const s = new Session();
    send(s, { type: 'init', scale: 'S', seed: 3 });
    send(s, { type: 'step', months: 12 });
    const t = tickOf(send(s, { type: 'policy', id: 'vat.rate.standard', value: 0.2 }));
    const idx = t.events.find((e) => e.id === 'vat.rate.standard')!.index;
    expect(idx).toBeGreaterThanOrEqual(0);
    send(s, { type: 'step', months: 24 });
    const cf = result<CounterfactualResult>(send(s, { type: 'counterfactual', rid: 2, skip: [idx] }));
    const eng = gd1Engine();
    const w = eng.newWorld({ seed: 3, scale: 'S' });
    eng.run(w, 36);
    const k = cf.ids.indexOf('cpi');
    const control = cf.control.subarray(k * cf.n, (k + 1) * cf.n);
    const actual = cf.actual.subarray(k * cf.n, (k + 1) * cf.n);
    expect(Array.from(control)).toEqual(Array.from(eng.seriesOf(w, 'cpi', cf.from, 36)));
    expect(actual[cf.n - 1]).toBeGreaterThan(control[cf.n - 1]);
  });
});

describe('thế giới đối chứng của kịch bản', () => {
  const def: ScenarioDef = {
    id: 'thu-cu-soc',
    title: 'Thử cú sốc',
    role: 'observer',
    scale: 'S',
    question: '',
    intro: '',
    prereq: [],
    warmup: 12,
    months: 24,
    shocks: [{ at: 0, laws: { 'vat.rate.standard': 0.2 }, label: 'Tăng GTGT' }],
    control: 'shock',
    goals: [],
    predict: [],
    demo: [],
    claims: [{ text: 'Mức giá cao hơn', test: (c) => ({ ok: true, detail: String(c.eng.value(c.w, 'cpi', c.t1 - 1) / c.eng.value(c.base, 'cpi', c.t1 - 1) - 1) }) }],
    explanation: '',
    simplifications: [],
  };
  it('control = shock: thế giới đối chứng không có cú sốc, nên khác ván thật (không bằng 0)', () => {
    const s = new Session([def]);
    send(s, { type: 'init', scale: 'S', seed: 4, scenario: def.id });
    send(s, { type: 'step', months: 24 });
    const diff = Number(s.scenarioReport().claims[0].detail);
    expect(diff).toBeGreaterThan(0.01); // tăng thuế chuyển trọn vào giá (firm.taxPassUp = 1)
  });
});

describe('lưu và tải qua giao thức', () => {
  it('tải lại rồi chạy tiếp cho cùng kết quả', () => {
    const a = new Session();
    send(a, { type: 'init', scale: 'S', seed: 5 });
    send(a, { type: 'step', months: 10 });
    send(a, { type: 'policy', id: 'cb.rate.refinancing', value: 0.09 });
    const bytes = result<{ bytes: Uint8Array }>(send(a, { type: 'save', rid: 1 })).bytes;
    send(a, { type: 'step', months: 14 });
    const b = new Session();
    send(b, { type: 'load', bytes });
    send(b, { type: 'step', months: 14 });
    const ha = result<{ hash: string }>(send(a, { type: 'query', rid: 2, q: { kind: 'hash' } })).hash;
    const hb = result<{ hash: string }>(send(b, { type: 'query', rid: 2, q: { kind: 'hash' } })).hash;
    expect(hb).toBe(ha);
  });
});

describe('vai người chơi', () => {
  it('đặt giá và lương cho doanh nghiệp, chi tiêu cho hộ: sổ vẫn cân, quyết định có mã lý do của người chơi', () => {
    const s = new Session();
    s.eng.checkEvery = 1;
    s.handle({ type: 'init', scale: 'S', seed: 2 });
    s.handle({ type: 'step', months: 3 });
    const f = F(s.w);
    let firm = 0;
    while (!(f.alive[firm] && f.formal[firm])) firm++;
    s.handle({ type: 'possess', sector: 'firm', id: firm });
    const price = Math.round(f.priceG[firm] * 1.5);
    s.handle({ type: 'orders', orders: { firmPrice: price, firmWage: Math.round(f.wage[firm] * 1.2) } });
    const m = s.handle({ type: 'step', months: 6 });
    expect(m[0].type).toBe('tick');
    expect(F(s.w).priceG[firm]).toBe(price);
    expect(s.w.causal.decisions.some((d) => d.parts.some((p) => p.reason === 'p_player'))).toBe(true);
    expect(tickOf(m).player.auto.price).toBeGreaterThan(0);
    s.handle({ type: 'possess', sector: 'hh', id: 4 });
    s.handle({ type: 'orders', orders: { hhBudget: 1_000_000, hhOpenBiz: true } });
    const m2 = s.handle({ type: 'step', months: 6 });
    expect(m2[0].type).toBe('tick');
    expect(H(s.w).budget[4]).toBeLessThanOrEqual(1_000_000);
    // hộ đã mở việc tự làm (có thể đã bỏ để đi làm thuê khi có việc)
    expect(Array.from(F(s.w).owner.subarray(0, F(s.w).n)).includes(4)).toBe(true);
    expect(s.eng.check(s.w)).toEqual([]);
  });
});
