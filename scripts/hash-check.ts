// Mã băm gốc của U2: in một dòng "<tên> <hash>" cho chín ván cố định (sáu ván đầu chạy 24 tháng, ba ván sau có lệnh giữa ván hoặc chạy hết kịch bản), qua Session như Worker.
// Dùng: npx tsx scripts/hash-check.ts. Sáu dòng đầu phải trùng scripts/hash-baseline-u2.txt, ba dòng sau trùng scripts/hash-baseline-u2b.txt (không đưa vào npm test).
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

// Ba ván thêm cho sửa D17 và cờ đã sửa (scripts/hash-baseline-u2b.txt): có lệnh policy giữa ván, và chạy hết kịch bản.
const extra: Array<[string, (s: Session) => void]> = [
  ['tu-do-S-seed1-vat-thang6', (s) => vatAt6(s, { type: 'init', scale: 'S', seed: 1 })],
  ['tu-do-M-seed2-vat-thang6', (s) => vatAt6(s, { type: 'init', scale: 'M', seed: 2 })],
  [
    'kb-that-lung-buoc-bung-seed1',
    (s) => {
      const def = SCENARIOS.find((d) => d.id === 'that-lung-buoc-bung');
      if (!def) throw new Error('Không có kịch bản that-lung-buoc-bung');
      s.handle({ type: 'init', scale: 'S', seed: 1, scenario: def.id });
      s.handle({ type: 'step', months: def.months, frame: false });
    },
  ],
];

function vatAt6(s: Session, init: Init): void {
  s.handle(init);
  s.handle({ type: 'step', months: 6, frame: false });
  s.handle({ type: 'policy', id: 'vat.rate.standard', value: 0.12 });
  s.handle({ type: 'step', months: 18, frame: false });
}

function hashOf(name: string, s: Session): void {
  const r = s.handle({ type: 'query', rid: 1, q: { kind: 'hash' } })[0];
  if (r.type !== 'result') throw new Error(`${name}: ${r.type === 'error' ? r.message : r.type}`);
  console.log(`${name} ${(r.data as QueryData as { hash: string }).hash}`);
}

for (const [name, init] of cases) {
  const s = new Session(SCENARIOS);
  s.handle(init);
  s.handle({ type: 'step', months: 24, frame: false });
  hashOf(name, s);
}
for (const [name, run] of extra) {
  const s = new Session(SCENARIOS);
  run(s);
  hashOf(name, s);
}
