// Lớp mỏng bọc phiên làm việc của engine trong Web Worker (gd0 mục 7.2).
// Không có logic kinh tế ở đây: nhận lệnh, gọi Session, gửi tin về, chuyển quyền sở hữu bộ đệm thay vì sao chép.

import { SCENARIOS } from '../content/scenarios';
import { Session } from '../engine/session/session';
import type { Command, EngineMsg } from '../protocol';

const session = new Session(SCENARIOS);
const ctx = self as unknown as { postMessage(m: EngineMsg, transfer: Transferable[]): void; onmessage: ((e: MessageEvent<Command>) => void) | null };

function buffersOf(m: EngineMsg): Transferable[] {
  const out = new Set<ArrayBuffer>();
  const walk = (v: unknown, depth: number) => {
    if (!v || typeof v !== 'object' || depth > 4) return;
    if (ArrayBuffer.isView(v)) {
      if (v.buffer instanceof ArrayBuffer) out.add(v.buffer);
      return;
    }
    if (Array.isArray(v)) return; // mảng thường không chứa bộ đệm lớn
    for (const k in v as Record<string, unknown>) walk((v as Record<string, unknown>)[k], depth + 1);
  };
  walk(m, 0);
  return [...out];
}

ctx.onmessage = (e) => {
  const cmd = e.data;
  const t = performance.now();
  const msgs = session.handle(cmd);
  const dt = performance.now() - t;
  for (const m of msgs) {
    if (m.type === 'tick' && cmd.type === 'step') m.ms = dt / Math.max(1, cmd.months);
    ctx.postMessage(m, buffersOf(m));
  }
};
