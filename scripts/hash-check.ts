// Mã băm gốc của U2: in một dòng "<tên> <hash>" cho sáu ván cố định, chạy 24 tháng qua Session như Worker.
// Dùng: npx tsx scripts/hash-check.ts. Kết quả phải trùng scripts/hash-baseline-u2.txt (không đưa vào npm test).
import { SCENARIOS } from '../src/content/scenarios';
import { Session } from '../src/engine/session/session';
import type { Command, QueryData } from '../src/protocol';

type Init = Extract<Command, { type: 'init' }>;
const cases: Array<[string, Init]> = [
  ['tu-do-S-seed1', { type: 'init', scale: 'S', seed: 1 }],
  ['tu-do-S-seed2', { type: 'init', scale: 'S', seed: 2 }],
  ['tu-do-S-seed3', { type: 'init', scale: 'S', seed: 3 }],
  ['tu-do-M-seed1', { type: 'init', scale: 'M', seed: 1 }],
  ['tu-do-S-seed1-vat12', { type: 'init', scale: 'S', seed: 1, setup: { laws: { 'vat.rate.standard': 0.12 } } }],
  ['mot-khoan-vay-seed1', { type: 'init', scale: 'S', seed: 1, scenario: 'mot-khoan-vay' }],
];

for (const [name, init] of cases) {
  const s = new Session(SCENARIOS);
  s.handle(init);
  s.handle({ type: 'step', months: 24, frame: false });
  const r = s.handle({ type: 'query', rid: 1, q: { kind: 'hash' } })[0];
  if (r.type !== 'result') throw new Error(`${name}: ${r.type === 'error' ? r.message : r.type}`);
  console.log(`${name} ${(r.data as QueryData as { hash: string }).hash}`);
}
