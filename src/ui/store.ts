// State của UI (Zustand) và vòng chạy: UI ra lệnh `step`, engine trả tin `tick`, rồi UI hẹn lệnh kế tiếp theo tốc độ.
import { create } from 'zustand';
import type { Catalog, CounterfactualResult, EngineMsg, EventInfo, MapFrame, NamedAgent, NewsItem, PlayerOrders, Role, ScaleId, ScenarioInfo, ScenarioReport, SeriesResult, TickMsg, TxSample } from '../protocol';
import { engine } from './client';
import { setStartYear } from './format';

export type Speed = 0 | 1 | 4 | 16 | 99;
export type Panel =
  | { kind: 'causal'; indicator: string }
  | { kind: 'agent'; sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb'; id: number }
  | { kind: 'money' }
  | { kind: 'lab' }
  | { kind: 'notes'; id?: string }
  | { kind: 'compare'; data: CounterfactualResult; focus?: string }
  | { kind: 'report'; data: ScenarioReport }
  | { kind: 'charts' }
  | { kind: 'agents' }
  | { kind: 'file' };

export type Guess = 'up' | 'down' | 'flat';
export interface Prediction {
  id: number;
  tick: number;
  label: string;
  /** Lệnh trong nhật ký để dựng đối chứng; rỗng với kịch bản (đối chứng theo kịch bản). */
  skip: number[];
  guesses: Record<string, Guess>;
  dueTick: number;
  result?: Array<{ indicator: string; guess: Guess; actual: Guess; delta: number }>;
}

interface State {
  phase: 'menu' | 'loading' | 'play';
  catalog?: Catalog;
  index: Map<string, number>;
  lawIndex: Map<string, number>;
  named: NamedAgent[];
  scenario?: ScenarioInfo;
  seed: number;
  scale: ScaleId;
  tick?: TickMsg;
  frame?: MapFrame;
  tx?: TxSample;
  txTick: number;
  hist: { n: number; cols: Float64Array[] };
  events: EventInfo[];
  news: NewsItem[];
  role: Role;
  speed: Speed;
  busy: boolean;
  panel: Panel | null;
  predictions: Prediction[];
  pendingGuess: { label: string; indicators: string[]; skipFromEvents: boolean } | null;
  askGuess(label: string): void;
  error: string | null;
  violation: string[] | null;
  startYear: number;

  start(o: { scale: ScaleId; seed: number; scenario?: string }): void;
  toMenu(): void;
  setSpeed(s: Speed): void;
  stepOnce(months?: number): void;
  setRole(r: Role): void;
  policy(id: string, value: number): void;
  param(id: string, value: number): void;
  lab(rule: string, variant: string): void;
  possess(sector: 'hh' | 'firm' | null, id?: number): void;
  orders(o: Partial<PlayerOrders>): void;
  open(p: Panel | null): void;
  value(id: string): number;
  series(id: string): Float64Array;
  law(id: string): number;
  whatIf(skip: number[] | 'lab' | 'player', focus?: string): Promise<void>;
  guess(g: Record<string, Guess> | null): void;
  loadBytes(bytes: Uint8Array): void;
  dismissError(): void;
}

const DELAY: Record<Speed, number> = { 0: 0, 1: 3000, 4: 750, 16: 190, 99: 0 };
let timer: ReturnType<typeof setTimeout> | undefined;
let predId = 1;
let lastIdx: number[] = []; // các lệnh chính sách gần nhất của người chơi, để dựng đối chứng cho lời đoán
const dirOf = (d: number, scale: number): Guess => (Math.abs(d) < 0.005 * Math.max(1e-9, Math.abs(scale)) ? 'flat' : d > 0 ? 'up' : 'down');

export const useStore = create<State>((set, get) => {
  const schedule = () => {
    clearTimeout(timer);
    const s = get();
    if (s.phase !== 'play' || s.speed === 0 || s.busy || s.tick?.scenario?.done || s.pendingGuess) return;
    timer = setTimeout(() => get().stepOnce(s.speed === 99 ? 6 : 1), DELAY[s.speed]);
  };

  const refill = async () => {
    const r = await engine.query<SeriesResult>({ kind: 'series' });
    const cols = r.ids.map((_, k) => {
      const c = new Float64Array(Math.max(256, r.n * 2));
      c.set(r.data.subarray(k * r.n, (k + 1) * r.n));
      return c;
    });
    set({ hist: { n: r.n, cols } });
  };

  const checkPredictions = async (tick: number) => {
    for (const p of get().predictions) {
      if (p.result || tick < p.dueTick) continue;
      p.result = []; // đánh dấu đang tính
      try {
        const cf = await engine.counterfactual<CounterfactualResult>(p.skip.length ? p.skip : 'player');
        const result = Object.entries(p.guesses).map(([indicator, guess]) => {
          const k = cf.ids.indexOf(indicator);
          const a = cf.actual[(k + 1) * cf.n - 1];
          const b = cf.control[(k + 1) * cf.n - 1];
          return { indicator, guess, actual: dirOf(a - b, b), delta: a - b };
        });
        set({ predictions: get().predictions.map((x) => (x.id === p.id ? { ...x, result } : x)) });
      } catch {
        set({ predictions: get().predictions.filter((x) => x.id !== p.id) });
      }
    }
  };

  engine.on((m: EngineMsg) => {
    if (m.type === 'ready') {
      const index = new Map(m.catalog.indicators.map((x, i) => [x.id, i]));
      const lawIndex = new Map(m.catalog.laws.map((x, i) => [x.id, i]));
      const role: Role = m.scenario?.role ?? 'observer';
      set({ catalog: m.catalog, index, lawIndex, named: m.named, scenario: m.scenario, seed: m.seed, scale: m.scale, phase: 'play', role, events: [], news: [], predictions: [], hist: { n: 0, cols: [] }, panel: null, busy: false });
      const pr = m.scenario?.predict ?? [];
      if (pr.length) set({ pendingGuess: { label: m.scenario!.title, indicators: pr.map((x) => x.indicator), skipFromEvents: false } });
      void refill();
      return;
    }
    if (m.type === 'tick') {
      const s = get();
      if (m.tick > 0) setStartYear(m.year - Math.floor((m.tick - 1) / 12));
      const h = s.hist;
      if (m.tick === h.n + 1 && h.cols.length === m.values.length) {
        if (h.n >= h.cols[0].length)
          h.cols = h.cols.map((c) => {
            const b = new Float64Array(c.length * 2);
            b.set(c);
            return b;
          });
        for (let i = 0; i < m.values.length; i++) h.cols[i][h.n] = m.values[i];
        set({ hist: { n: h.n + 1, cols: h.cols } });
      } else if (m.tick !== h.n) void refill();
      const idx = m.events.filter((e) => e.index >= 0 && e.by === 'Người chơi').map((e) => e.index);
      if (idx.length) lastIdx = idx;
      // Lệnh chính sách gửi lại tin tick của tháng đó: bỏ bản tin đã có.
      const seen = new Set(s.news.map((x) => `${x.tick}|${x.text}`));
      const fresh = m.news.filter((x) => !seen.has(`${x.tick}|${x.text}`));
      set({
        tick: m,
        frame: m.frame ?? s.frame,
        tx: m.tx ?? s.tx,
        txTick: m.tx ? m.tick : s.txTick,
        events: m.events.length ? [...s.events, ...m.events] : s.events,
        news: fresh.length ? [...fresh.reverse(), ...s.news].slice(0, 60) : s.news,
        busy: false,
      });
      void checkPredictions(m.tick);
      if (m.scenario?.done && s.speed !== 0) set({ speed: 0 });
      schedule();
      return;
    }
    if (m.type === 'error') {
      // Tải file hỏng giữa ván: ván cũ còn nguyên, quay lại chơi tiếp và báo lỗi.
      const s = get();
      set({ error: m.message, busy: false, phase: s.phase === 'loading' && s.tick ? 'play' : s.phase });
    }
    if (m.type === 'violation') set({ violation: m.problems, busy: false, speed: 0 });
  });

  return {
    phase: 'menu',
    index: new Map(),
    lawIndex: new Map(),
    named: [],
    seed: 1,
    scale: 'M',
    txTick: 0,
    hist: { n: 0, cols: [] },
    events: [],
    news: [],
    role: 'observer',
    speed: 0,
    busy: false,
    panel: null,
    predictions: [],
    pendingGuess: null,
    error: null,
    violation: null,
    startYear: 2026,

    start(o) {
      clearTimeout(timer);
      set({ phase: 'loading', speed: 0, tick: undefined, frame: undefined, tx: undefined, error: null, violation: null });
      engine.send({ type: 'init', scale: o.scale, seed: o.seed, scenario: o.scenario });
    },
    toMenu() {
      clearTimeout(timer);
      set({ phase: 'menu', speed: 0, panel: null });
    },
    setSpeed(speed) {
      set({ speed });
      schedule();
    },
    stepOnce(months = 1) {
      if (get().busy || get().phase !== 'play') return;
      set({ busy: true });
      engine.send({ type: 'step', months, frame: true });
    },
    setRole(role) {
      set({ role });
      if (role !== 'household' && role !== 'firm' && (get().tick?.player.hh ?? -1) + (get().tick?.player.firm ?? -1) > -2) engine.send({ type: 'possess', sector: null });
    },
    policy(id, value) {
      engine.send({ type: 'policy', id, value });
    },
    param(id, value) {
      engine.send({ type: 'param', id, value });
    },
    lab(rule, variant) {
      engine.send({ type: 'lab', rule, variant });
    },
    possess(sector, id) {
      engine.send({ type: 'possess', sector, id });
    },
    orders(o) {
      engine.send({ type: 'orders', orders: o });
    },
    open(panel) {
      set({ panel });
    },
    value(id) {
      const s = get();
      const i = s.index.get(id);
      return i === undefined || !s.tick ? NaN : s.tick.values[i];
    },
    series(id) {
      const s = get();
      const i = s.index.get(id);
      if (i === undefined || !s.hist.cols[i]) return new Float64Array(0);
      return s.hist.cols[i].subarray(0, s.hist.n);
    },
    law(id) {
      const s = get();
      const i = s.lawIndex.get(id);
      return i === undefined || !s.tick ? NaN : s.tick.laws[i];
    },
    async whatIf(skip, focus) {
      try {
        const data = await engine.counterfactual<CounterfactualResult>(skip);
        set({ panel: { kind: 'compare', data, focus } });
      } catch (e) {
        set({ error: (e as Error).message });
      }
    },
    askGuess(label) {
      set({ pendingGuess: { label, indicators: ['cpi', 'unemployment', 'gdp.real'], skipFromEvents: true } });
    },
    guess(g) {
      const pg = get().pendingGuess;
      if (!pg) return;
      const tick = get().tick?.tick ?? 0;
      if (g && Object.keys(g).length) {
        const sc = get().scenario;
        const p: Prediction = { id: predId++, tick, label: pg.label, skip: pg.skipFromEvents ? lastIdx : [], guesses: g, dueTick: sc && !pg.skipFromEvents ? tick + sc.months : tick + 24 };
        set({ predictions: [...get().predictions, p] });
      }
      set({ pendingGuess: null });
      schedule();
    },
    loadBytes(bytes) {
      clearTimeout(timer);
      set({ phase: 'loading', speed: 0 });
      engine.send({ type: 'load', bytes }, [bytes.buffer as ArrayBuffer]);
    },
    dismissError() {
      set({ error: null, violation: null });
    },
  };
});

// Chỉ khi chạy dev: cho phép đo và thử từ console.
if (import.meta.env.DEV) (window as unknown as { __store: typeof useStore }).__store = useStore;
