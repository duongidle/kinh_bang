// Cầu nối tới Worker chứa engine. UI chỉ nói chuyện với engine qua đây, bằng các tin có kiểu ở src/protocol.
import type { Command, EngineMsg, Query, QueryData } from '../protocol';

type Listener = (m: EngineMsg) => void;

export class EngineClient {
  private worker: Worker;
  private rid = 1;
  private pending = new Map<number, { resolve: (d: QueryData) => void; reject: (e: Error) => void }>();
  private listeners = new Set<Listener>();

  constructor() {
    this.worker = new Worker(new URL('../worker/worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<EngineMsg>) => {
      const m = e.data;
      if (m.type === 'result') {
        this.pending.get(m.rid)?.resolve(m.data);
        this.pending.delete(m.rid);
        return;
      }
      if (m.type === 'error' && m.rid !== undefined && this.pending.has(m.rid)) {
        this.pending.get(m.rid)!.reject(new Error(m.message));
        this.pending.delete(m.rid);
        return;
      }
      for (const l of this.listeners) l(m);
    };
  }

  on(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  send(cmd: Command, transfer: Transferable[] = []): void {
    this.worker.postMessage(cmd, transfer);
  }

  private ask<T extends QueryData>(make: (rid: number) => Command): Promise<T> {
    const rid = this.rid++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(rid, { resolve: resolve as (d: QueryData) => void, reject });
      this.worker.postMessage(make(rid));
    });
  }

  query<T extends QueryData>(q: Query): Promise<T> {
    return this.ask<T>((rid) => ({ type: 'query', rid, q }));
  }
  counterfactual<T extends QueryData>(skip: number[] | 'lab' | 'player'): Promise<T> {
    return this.ask<T>((rid) => ({ type: 'counterfactual', rid, skip }));
  }
  save(): Promise<{ bytes: Uint8Array }> {
    return this.ask<{ bytes: Uint8Array }>((rid) => ({ type: 'save', rid }));
  }
}

export const engine = new EngineClient();
