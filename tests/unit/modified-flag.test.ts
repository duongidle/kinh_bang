// sai-khac.md D18: người chơi đổi tham số hành vi thì bật cờ "đã sửa quy luật"; đối chứng "thế giới gốc" bỏ cả lệnh đó.
import { describe, expect, it } from 'vitest';
import { Session } from '@/engine/session/session';
import type { Command, CounterfactualResult, EngineMsg, SeriesResult, TickMsg } from '@/protocol';

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
function fresh(setup?: Extract<Command, { type: 'init' }>['setup']): Session {
  const s = new Session();
  send(s, { type: 'init', scale: 'S', seed: 1, setup });
  return s;
}

describe('cờ modified khi đổi tham số hành vi', () => {
  it('người chơi đổi hh.alpha1 sang giá trị khác mặc định thì modified = true', () => {
    const s = fresh();
    expect(tickOf(send(s, { type: 'param', id: 'hh.alpha1', value: 0.45 })).modified).toBe(true);
  });

  it('cb.autopilot và gov.autopilot là chọn ai điều hành, không bật cờ', () => {
    const s = fresh();
    expect(tickOf(send(s, { type: 'param', id: 'cb.autopilot', value: 1 })).modified).toBe(false);
    expect(tickOf(send(s, { type: 'param', id: 'gov.autopilot', value: 1 })).modified).toBe(false);
  });

  it('đặt tham số bằng đúng giá trị hiện tại thì không bật cờ', () => {
    const s = fresh();
    const cur = tickOf(send(s, { type: 'step', months: 1, frame: false })).params['hh.alpha1'];
    expect(tickOf(send(s, { type: 'param', id: 'hh.alpha1', value: cur })).modified).toBe(false);
  });

  it('tham số đặt bởi điều kiện ban đầu (setup.params) không bật cờ', () => {
    const s = fresh({ params: { 'hh.alpha1': 0.45 } });
    expect(tickOf(send(s, { type: 'step', months: 1, frame: false })).modified).toBe(false);
  });
});

describe('đối chứng "thế giới gốc" (skip = lab)', () => {
  it('bỏ cả lệnh param của người chơi: trùng với ván không có lệnh nào', () => {
    const s = fresh();
    send(s, { type: 'step', months: 2, frame: false });
    send(s, { type: 'param', id: 'hh.alpha1', value: 0.45 });
    send(s, { type: 'step', months: 12, frame: false });
    const cf = result<CounterfactualResult>(send(s, { type: 'counterfactual', rid: 1, skip: 'lab' }));
    const ref = fresh();
    send(ref, { type: 'step', months: 14, frame: false });
    const series = result<SeriesResult>(send(ref, { type: 'query', rid: 2, q: { kind: 'series', ids: ['gdp.nominal'] } }));
    const k = cf.ids.indexOf('gdp.nominal');
    const control = cf.control.subarray(k * cf.n, (k + 1) * cf.n);
    expect(control[cf.n - 1]).toBe(series.data[series.n - 1]);
    // ván thật đã khác thế giới gốc; nếu không thì phép so trên không chứng minh gì
    expect(cf.actual[k * cf.n + cf.n - 1]).not.toBe(control[cf.n - 1]);
  });
});
