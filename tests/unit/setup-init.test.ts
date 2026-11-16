// U2 đợt A: hai truy vấn đọc `events`, `setupInfo` (giao thức 3) và luật đặt ở tháng 0 qua `setup.laws` (gd1-5.md mục 4.4, 10).
import { describe, expect, it } from 'vitest';
import { Session } from '@/engine/session/session';
import type { Command, EngineMsg, EventInfo, SetupInfo, TickMsg } from '@/protocol';

/** Gửi lệnh như Worker: lệnh và tin trả về đều đi qua structuredClone. */
function send(s: Session, cmd: Command): EngineMsg[] {
  return structuredClone(s.handle(structuredClone(cmd)));
}
const tickOf = (m: EngineMsg[]) => m.find((x) => x.type === 'tick') as TickMsg;
const readyOf = (m: EngineMsg[]) => m.find((x) => x.type === 'ready') as Extract<EngineMsg, { type: 'ready' }>;
let rid = 0;
function query<T>(s: Session, q: Extract<Command, { type: 'query' }>['q']): T {
  const r = send(s, { type: 'query', rid: ++rid, q })[0];
  if (r.type !== 'result') throw new Error(r.type === 'error' ? r.message : r.type);
  return r.data as T;
}
const hashOf = (s: Session) => query<{ hash: string }>(s, { kind: 'hash' }).hash;
const VAT = 'vat.rate.standard';
const revenueUse = (s: Session) => query<EventInfo[]>(s, { kind: 'events' }).filter((e) => e.id === 'gov.revenueUse');

describe('truy vấn setupInfo', () => {
  it('chạy được khi chưa init, đủ mọi luật, không dựng thế giới đang chạy', () => {
    const s = new Session();
    const info = query<SetupInfo>(s, { kind: 'setupInfo' });
    expect(s.w).toBeUndefined();
    const ready = readyOf(send(s, { type: 'init', scale: 'S', seed: 1 }));
    expect(info.laws.length).toBe(ready.catalog.laws.length);
    expect(info.laws.map((l) => l.id)).toEqual(ready.catalog.laws.map((l) => l.id));
    expect(info.rules.length).toBeGreaterThan(0);
    for (const r of info.rules) expect(r.variants.length).toBeGreaterThan(1);
  });

  it('value của mỗi luật bằng giá trị trong tin tick đầu tiên của ván S, hạt giống 1', () => {
    const s = new Session();
    const info = query<SetupInfo>(s, { kind: 'setupInfo' });
    const m = send(s, { type: 'init', scale: 'S', seed: 1 });
    const tick = tickOf(m);
    const ids = readyOf(m).catalog.laws.map((l) => l.id);
    ids.forEach((id, k) => {
      expect(info.laws[k].id).toBe(id);
      expect(info.laws[k].value).toBe(tick.laws[k]);
    });
  });
});

describe('luật đặt ở tháng 0 qua setup.laws', () => {
  it('có trong tin tick, trong truy vấn events, và sống qua lưu rồi tải', () => {
    const s = new Session();
    const m = send(s, { type: 'init', scale: 'S', seed: 1, setup: { laws: { [VAT]: 0.12 } } });
    const k = readyOf(m).catalog.laws.findIndex((l) => l.id === VAT);
    expect(tickOf(m).laws[k]).toBe(0.12);
    const ev = query<EventInfo[]>(s, { kind: 'events' }).filter((e) => e.id === VAT);
    expect(ev.length).toBe(1);
    expect(ev[0]).toMatchObject({ tick: 0, by: 'Điều kiện ban đầu', after: 0.12 });

    const saved = send(s, { type: 'save', rid: ++rid })[0];
    if (saved.type !== 'result') throw new Error('save');
    const bytes = (saved.data as { bytes: Uint8Array }).bytes;
    const s2 = new Session();
    const m2 = send(s2, { type: 'load', bytes });
    expect(tickOf(m2).laws[k]).toBe(0.12);
    const ev2 = query<EventInfo[]>(s2, { kind: 'events' }).filter((e) => e.id === VAT);
    expect(ev2.length).toBe(1);
    expect(ev2[0]).toMatchObject({ tick: 0, by: 'Điều kiện ban đầu', after: 0.12 });
  });

  it('đổi thuế ở tháng 0 không kích hoạt gov.revenueUse trong 24 tháng', () => {
    const s = new Session();
    send(s, { type: 'init', scale: 'S', seed: 1, setup: { laws: { [VAT]: 0.12 } } });
    send(s, { type: 'step', months: 24, frame: false });
    expect(revenueUse(s)).toEqual([]);
  });

  // Tháng 1-2 không kích hoạt do lỗi đã biết, sai-khac.md D17; test này chỉ đối chứng với test 4.
  it('đối chiếu: đổi cùng luật bằng lệnh policy ở tháng 3 thì có gov.revenueUse', () => {
    const s = new Session();
    send(s, { type: 'init', scale: 'S', seed: 1 });
    send(s, { type: 'step', months: 3, frame: false });
    send(s, { type: 'policy', id: VAT, value: 0.12 });
    send(s, { type: 'step', months: 24, frame: false });
    expect(revenueUse(s).length).toBeGreaterThan(0);
  });

  it('init không có setup và init có setup rỗng cho cùng mã băm sau 12 tháng', () => {
    const a = new Session();
    send(a, { type: 'init', scale: 'S', seed: 1 });
    send(a, { type: 'step', months: 12, frame: false });
    const b = new Session();
    send(b, { type: 'init', scale: 'S', seed: 1, setup: {} });
    send(b, { type: 'step', months: 12, frame: false });
    expect(hashOf(a)).toBe(hashOf(b));
  });
});
