// Phiên làm việc của engine: nhận lệnh theo giao thức, trả tin nhắn. Chạy đồng bộ.
// Worker bọc lớp này; test trong Node gọi thẳng (gd0 mục 7.2: "EngineApi đồng bộ").
// Lớp này biết lược đồ của GĐ1 (khung bản đồ, chi tiết tác nhân). Lõi engine thì không.

import type {
  AgentDetail,
  AgentRow,
  Catalog,
  CausalTree,
  ClaimResult,
  Command,
  CounterfactualResult,
  EngineMsg,
  EventInfo,
  FlowsResult,
  MapFrame,
  MoneyResult,
  NamedAgent,
  NewsItem,
  OptionsReport,
  PlayerOrders,
  Query,
  QueryData,
  ScenarioInfo,
  ScenarioReport,
  ScenarioState,
  SeriesResult,
  TickMsg,
  TxSample,
} from '../../protocol';
import { PROTOCOL_VERSION } from '../../protocol';
import { resolveVersion } from '../../config/law';
import { contributions, explain, type CausalNode } from '../causal/causal';
import type { Engine } from '../core/engine';
import { pack, unpack } from '../core/pack';
import { f64, i32, u8 } from '../core/table';
import { BANK, CB, dateOf, FIRM, GOV, HH, NSEC, SECTOR_LABEL, type PolicyEvent, type World } from '../core/world';
import { TX_KINDS } from '../ledger/kinds';
import { publicMoney } from '../ledger/ledger';
import { gd1Engine } from '../modules/gd1/index';
import { playerOf } from '../modules/gd1/player';
import { B, bankEquity, F, H, PUBLIC, SECTOR_NAME, st, UNEMPLOYED } from '../modules/gd1/schema';
import { SCENARIO_PREWARM, type Ctx, type ScenarioDef, type Step } from '../scenario/types';

type StateCmd = Extract<Command, { type: 'policy' | 'param' | 'lab' | 'possess' | 'orders' }>;
interface LogEntry {
  tick: number;
  origin: 'setup' | 'shock' | 'player';
  cmd: StateCmd;
  label?: string;
  dynamic?: Step['dynamic'];
}
interface Snap {
  tick: number;
  bytes: Uint8Array;
}

const SNAP_MAX = { S: 40, M: 10, L: 3 } as const;
const fmtPct = (x: number, d = 1) => `${(x * 100).toFixed(d).replace('.', ',')}%`;

export class Session {
  eng: Engine = gd1Engine();
  w!: World;
  def?: ScenarioDef;
  t0 = 0;
  log: LogEntry[] = [];
  private applied = new Set<number>(); // các lệnh trong nhật ký đã áp vào thế giới đang chạy
  private eventLog = new Map<number, number>(); // vị trí trong w.events -> số thứ tự nhật ký
  private snaps: Snap[] = [];
  /** Thế giới ở tháng t0, lúc người chơi nhận quyền, trước cú sốc của chính tháng đó. Chỉ lưu cho kịch bản có nhiều lựa chọn. */
  private t0World?: Uint8Array;
  /** Kết quả các nhánh (chưa có ván của người chơi) và thế giới đối chứng. Xoá khi mở ván mới hoặc tải ván. */
  private optionsCache?: { control: World; report: OptionsReport };
  private sentEvents = 0;
  private prevNamed: number[] = [];
  /** Thời gian tính mỗi tháng, do lớp bọc (Worker) đo và ghi vào. Engine không đọc đồng hồ. */
  ms = 0;

  constructor(private defs: ScenarioDef[] = []) {
    this.eng.checkEvery = 12; // bản phát hành: kiểm bốn đẳng thức mỗi 12 tháng (gd0 mục 4.3)
  }

  // =====================================================================
  // Lệnh
  // =====================================================================
  handle(cmd: Command): EngineMsg[] {
    try {
      switch (cmd.type) {
        case 'init':
          return this.init(cmd);
        case 'step':
          return this.step(cmd.months, cmd.frame !== false);
        case 'policy':
        case 'param':
        case 'lab':
        case 'possess':
        case 'orders':
          this.player(cmd);
          return [this.tickMsg(true)];
        case 'query':
          return [{ type: 'result', rid: cmd.rid, data: this.query(cmd.q) }];
        case 'counterfactual':
          return [{ type: 'result', rid: cmd.rid, data: this.counterfactual(cmd.skip) }];
        case 'save':
          return [{ type: 'result', rid: cmd.rid, data: { bytes: this.save() } }];
        case 'load':
          this.load(cmd.bytes);
          return [this.readyMsg(), this.tickMsg(true)];
      }
    } catch (e) {
      const message = (e as Error).message;
      if (message.startsWith('Vỡ đẳng thức')) return [{ type: 'violation', tick: this.w?.meta.tick ?? 0, problems: message.split('\n') }];
      return [{ type: 'error', rid: (cmd as { rid?: number }).rid, message }];
    }
  }

  private init(cmd: Extract<Command, { type: 'init' }>): EngineMsg[] {
    const def = cmd.scenario ? this.defs.find((d) => d.id === cmd.scenario) : undefined;
    if (cmd.scenario && !def) throw new Error(`Không có kịch bản: ${cmd.scenario}`);
    this.def = def;
    // Kịch bản chạy trước `prewarm` tháng với lịch đứng yên (sai-khac.md D16); ván tự do không chạy trước.
    const prewarm = def ? (def.prewarm ?? SCENARIO_PREWARM) : 0;
    this.w = this.eng.newWorld({ seed: cmd.seed, scale: def?.scale ?? cmd.scale, scenario: def?.id, startYear: def?.startYear, prewarm });
    this.log = [];
    this.applied.clear();
    this.eventLog.clear();
    this.snaps = [];
    this.t0World = undefined;
    this.optionsCache = undefined;
    this.sentEvents = 0;
    this.prevNamed = [];
    const add = (tick: number, origin: LogEntry['origin'], x: Step | NonNullable<typeof cmd.setup>, label?: string) => {
      for (const [id, value] of Object.entries(x.laws ?? {})) this.log.push({ tick, origin, label, cmd: { type: 'policy', id, value } });
      for (const [id, value] of Object.entries(x.params ?? {})) this.log.push({ tick, origin, label, cmd: { type: 'param', id, value } });
      for (const [rule, variant] of Object.entries(x.variants ?? {})) this.log.push({ tick, origin, label, cmd: { type: 'lab', rule, variant } });
      const s = x as Step;
      if (s.orders) this.log.push({ tick, origin, label, cmd: { type: 'orders', orders: s.orders } });
      if (s.dynamic) this.log.push({ tick, origin, label, dynamic: s.dynamic, cmd: { type: 'orders', orders: {} } });
    };
    if (def?.setup) add(0, 'setup', def.setup);
    if (cmd.setup) add(0, 'setup', cmd.setup);
    this.t0 = prewarm + (def?.warmup ?? 0);
    for (const s of def?.shocks ?? []) add(this.t0 + s.at, 'shock', s, s.label);
    this.applyDue();
    // Tháng cuối của giai đoạn chạy trước: chưa áp cú sốc của tháng t0, để chụp trạng thái xuất phát cho các nhánh.
    for (let i = 0; i < this.t0; i++) {
      this.eng.step(this.w);
      if (i < this.t0 - 1) this.applyDue();
    }
    if (def?.options) this.t0World = pack(this.w);
    if (this.t0 > 0) this.applyDue();
    if (def?.possess) {
      const n = st(this.w).names.find((x) => x.name === def.possess!.name);
      if (n) this.log.push({ tick: this.t0, origin: 'setup', cmd: { type: 'possess', sector: def.possess.sector, id: n.id } });
      this.applyDue();
    }
    this.snapshot(); // không ép: nếu đã có mốc chụp trước cú sốc của tháng này thì giữ mốc đó
    this.sentEvents = this.w.events.length;
    return [this.readyMsg(), this.tickMsg(true)];
  }

  /** Áp các lệnh trong nhật ký đã tới hạn mà chưa áp (cú sốc theo lịch, điều kiện đầu). */
  private applyDue(): void {
    const t = this.w.meta.tick;
    let first = true;
    this.log.forEach((e, i) => {
      if (e.tick > t || this.applied.has(i)) return;
      if (first) this.snapshot();
      first = false;
      this.apply(this.w, e, i);
      this.applied.add(i);
    });
  }

  private apply(w: World, e: LogEntry, index: number, live = true): void {
    const before = w.events.length;
    const by = e.origin === 'player' ? 'Người chơi' : e.origin === 'shock' ? 'Kịch bản' : 'Điều kiện ban đầu';
    if (e.dynamic) {
      const x = e.dynamic(this.eng, w);
      for (const [id, v] of Object.entries(x.laws ?? {})) this.eng.setLaw(w, id, v, by);
      for (const [id, v] of Object.entries(x.params ?? {})) this.setParam(w, id, v, by);
    } else {
      const c = e.cmd;
      if (c.type === 'policy') this.eng.setLaw(w, c.id, c.value, by);
      else if (c.type === 'param') this.setParam(w, c.id, c.value, by);
      else if (c.type === 'lab') this.eng.setVariant(w, c.rule, c.variant);
      else if (c.type === 'possess') {
        const p = playerOf(w);
        p.hh = c.sector === 'hh' ? (c.id ?? -1) : -1;
        p.firm = c.sector === 'firm' ? (c.id ?? -1) : -1;
        Object.assign(p, { hhBudget: null, hhResWage: null, hhQuit: false, hhOpenBiz: false, firmPrice: null, firmWage: null, firmWorkers: null, firmInvest: null });
      } else Object.assign(playerOf(w), c.orders);
    }
    if (live) for (let k = before; k < w.events.length; k++) this.eventLog.set(k, index);
  }

  private setParam(w: World, id: string, value: number, by: string): void {
    const def = this.eng.paramDefs.get(id);
    if (!def) throw new Error(`Không có tham số: ${id}`);
    const before = w.params[id];
    if (before === value) return;
    w.params[id] = value;
    this.eng.event(w, { type: 'player', id, before, after: value, label: def.label, by });
  }

  private player(cmd: StateCmd): void {
    this.snapshot();
    const e: LogEntry = { tick: this.w.meta.tick, origin: 'player', cmd };
    this.log.push(e);
    const i = this.log.length - 1;
    this.apply(this.w, e, i);
    this.applied.add(i);
  }

  /** Một bước của lời giải mẫu hoặc của người chơi, gồm nhiều lệnh. Giá trị động được tính ngay lúc này. */
  act(x: Step | Omit<Step, 'at'>): void {
    const y = x.dynamic ? x.dynamic(this.eng, this.w) : x;
    for (const [id, value] of Object.entries(y.laws ?? {})) this.player({ type: 'policy', id, value });
    for (const [id, value] of Object.entries(y.params ?? {})) this.player({ type: 'param', id, value });
    for (const [rule, variant] of Object.entries(y.variants ?? {})) this.player({ type: 'lab', rule, variant });
    if (x.orders) this.player({ type: 'orders', orders: x.orders });
  }

  private advance(): void {
    this.eng.step(this.w);
    this.applyDue();
  }

  private step(months: number, frame: boolean): EngineMsg[] {
    const n = Math.max(1, Math.min(months, 240));
    for (let i = 0; i < n; i++) {
      if (this.def && this.w.meta.tick >= this.t0 + this.def.months) break;
      this.advance();
    }
    if (this.w.meta.tick % 12 === 0) this.snapshot(); // mốc tự lưu hằng năm
    return [this.tickMsg(frame)];
  }

  // =====================================================================
  // Mốc lưu và thế giới đối chứng
  // =====================================================================
  private snapshot(force = false): void {
    const t = this.w.meta.tick;
    const last = this.snaps[this.snaps.length - 1];
    if (!force && last && last.tick === t) return;
    this.snaps.push({ tick: t, bytes: pack(this.w) });
    const max = SNAP_MAX[this.w.meta.scale];
    if (this.snaps.length > max) this.snaps.splice(1, this.snaps.length - max); // giữ mốc đầu tiên
  }

  /** Chạy lại từ mốc lưu trước lệnh bị bỏ sớm nhất, áp mọi lệnh còn lại đúng tháng của chúng. */
  replay(skip: (e: LogEntry, i: number) => boolean): { w: World; from: number } {
    let tmin = Infinity;
    this.log.forEach((e, i) => {
      if (skip(e, i) && this.applied.has(i)) tmin = Math.min(tmin, e.tick);
    });
    const now = this.w.meta.tick;
    if (tmin === Infinity) tmin = now;
    let snap: Snap | undefined;
    for (const s of this.snaps) if (s.tick <= tmin) snap = s;
    if (!snap) throw new Error('Không còn mốc lưu trước thời điểm này. Thế giới đối chứng chỉ dựng được cho các quyết định gần đây.');
    const w = unpack<World>(snap.bytes);
    const done = new Set<number>();
    // các lệnh trước mốc lưu đã nằm sẵn trong trạng thái
    this.log.forEach((e, i) => {
      if (e.tick < snap!.tick) done.add(i);
    });
    const due = () => {
      this.log.forEach((e, i) => {
        if (done.has(i) || e.tick > w.meta.tick || !this.applied.has(i)) return;
        done.add(i);
        if (!skip(e, i)) this.apply(w, e, i, false);
      });
    };
    due();
    while (w.meta.tick < now) {
      this.eng.step(w);
      due();
    }
    return { w, from: snap.tick };
  }

  private counterfactual(skip: number[] | 'lab' | 'player'): CounterfactualResult {
    const set = Array.isArray(skip) ? new Set(skip) : null;
    const r = this.replay((e, i) => (set ? set.has(i) : skip === 'lab' ? e.cmd.type === 'lab' : e.origin === 'player'));
    const ids = this.eng.indicators.map((x) => x.id);
    const n = this.w.meta.tick - r.from;
    const take = (w: World) => {
      const out = new Float64Array(ids.length * n);
      ids.forEach((id, k) => out.set(this.eng.seriesOf(w, id, r.from, w.meta.tick), k * n));
      return out;
    };
    const label = set ? `Không có: ${[...set].map((i) => this.entryLabel(this.log[i])).join('; ')}` : skip === 'lab' ? 'Thế giới với quy luật gốc' : 'Không có hành động của người chơi';
    return { from: r.from, n, ids, actual: take(this.w), control: take(r.w), label };
  }

  private entryLabel(e: LogEntry): string {
    const c = e.cmd;
    if (e.label) return e.label;
    if (c.type === 'policy') return this.eng.laws.get(c.id)?.label ?? c.id;
    if (c.type === 'param') return this.eng.paramDefs.get(c.id)?.label ?? c.id;
    if (c.type === 'lab') return this.eng.rules.get(c.rule)?.label ?? c.rule;
    return c.type === 'possess' ? 'nhận điều khiển tác nhân' : 'quyết định cho tác nhân';
  }

  // =====================================================================
  // Lưu và tải
  // =====================================================================
  private save(): Uint8Array {
    const log = this.log.filter((e) => !e.dynamic).map((e) => ({ ...e, applied: this.applied.has(this.log.indexOf(e)) }));
    return pack({ kind: 'kinhbang-session', protocol: PROTOCOL_VERSION, scenario: this.def?.id ?? null, t0: this.t0, log, world: this.w, t0World: this.t0World });
  }

  private load(bytes: Uint8Array): void {
    const x = unpack<{ kind?: string; scenario: string | null; t0: number; log: Array<LogEntry & { applied: boolean }>; world: World; t0World?: Uint8Array }>(bytes);
    if (x.kind !== 'kinhbang-session') throw new Error('File này không phải ván Kinh Bang.');
    const want = this.eng.modules.map((m) => m.id).join(',');
    if (x.world.meta.modules.join(',') !== want) throw new Error('Ván lưu dùng bộ module khác.');
    this.w = x.world;
    this.def = this.defs.find((d) => d.id === x.scenario);
    this.t0 = x.t0;
    this.log = x.log.map(({ applied: _a, ...e }) => e);
    this.applied = new Set(x.log.map((e, i) => (e.applied ? i : -1)).filter((i) => i >= 0));
    this.eventLog.clear();
    this.snaps = [];
    this.t0World = x.t0World;
    this.optionsCache = undefined;
    this.snapshot(true);
    this.sentEvents = this.w.events.length;
    this.prevNamed = [];
  }

  // =====================================================================
  // Tin nhắn
  // =====================================================================
  catalog(): Catalog {
    const iso = dateOf(this.w).iso;
    return {
      protocol: PROTOCOL_VERSION,
      indicators: this.eng.indicators.map((i) => ({ id: i.id, label: i.label, unit: i.unit, group: i.group, good: i.good ?? 0, explainable: !!i.contrib })),
      laws: [...this.eng.laws.values()].map((l) => {
        const v = resolveVersion(l, iso);
        return { id: l.id, label: l.label, unit: l.unit, group: l.group, owner: l.owner, min: l.min, max: l.max, step: l.step, note: l.note, source: [v.source.doc, v.source.article].filter(Boolean).join(', '), verification: v.verification };
      }),
      rules: [...this.eng.rules.values()].map((r) => ({ id: r.id, label: r.label, source: r.source, teaches: r.teaches, variants: r.variants })),
      params: [...this.eng.paramDefs.values()].map((p) => ({ id: p.id, label: p.label, source: p.source, note: p.note })),
      txKinds: TX_KINDS.map((k) => ({ id: k.id, label: k.label, flow: k.flow })),
      sectors: [...SECTOR_LABEL],
      scenarios: this.defs.map(scenarioInfo),
    };
  }

  private readyMsg(): EngineMsg {
    const named: NamedAgent[] = st(this.w).names.map((n) => ({ sector: n.kind, id: n.id, name: n.name, story: n.story }));
    return { type: 'ready', catalog: this.catalog(), named, scenario: this.def ? scenarioInfo(this.def) : undefined, seed: this.w.meta.seed, scale: this.w.meta.scale };
  }

  private tickMsg(frame: boolean): TickMsg {
    const w = this.w;
    const eng = this.eng;
    const t = w.meta.tick;
    const d = dateOf(w, Math.max(0, t - 1));
    const n = eng.indicators.length;
    const values = new Float64Array(n);
    if (t > 0) for (let i = 0; i < n; i++) values[i] = w.series.data[(t - 1) * n + i];
    else eng.indicators.forEach((ind, i) => (values[i] = ind.compute(w)));
    const laws = new Float64Array(eng.laws.size);
    let k = 0;
    for (const id of eng.laws.keys()) laws[k++] = eng.law(w, id);
    const p = playerOf(w);
    const orders: PlayerOrders = { hhBudget: p.hhBudget, hhResWage: p.hhResWage, hhQuit: p.hhQuit, hhOpenBiz: p.hhOpenBiz, firmPrice: p.firmPrice, firmWage: p.firmWage, firmWorkers: p.firmWorkers, firmInvest: p.firmInvest };
    const events: EventInfo[] = [];
    for (let i = this.sentEvents; i < w.events.length; i++) events.push(this.eventInfo(w.events[i], i));
    this.sentEvents = w.events.length;
    const params: Record<string, number> = {};
    for (const id of eng.paramDefs.keys()) params[id] = w.params[id];
    return {
      type: 'tick',
      tick: t,
      year: d.year,
      month: d.month,
      values,
      laws,
      params,
      variants: { ...w.meta.variants },
      modified: w.meta.modified,
      frame: frame ? this.frame() : undefined,
      tx: frame && t > 0 ? this.txSample(t - 1) : undefined,
      news: t > 0 ? this.news() : [],
      events,
      player: { hh: p.hh, firm: p.firm, orders, auto: { ...p.auto } },
      scenario: this.scenarioState(),
      ms: this.ms,
    };
  }

  private eventInfo(e: PolicyEvent, pos: number): EventInfo {
    return { index: this.eventLog.get(pos) ?? -1, tick: e.tick, type: e.type, id: e.id, label: e.label, by: e.by, before: e.before, after: e.after };
  }

  private frame(): MapFrame {
    const w = this.w;
    const h = H(w);
    const f = F(w);
    const b = B(w);
    const hhStatus = new Uint8Array(h.n);
    const hhWealth = new Uint8Array(h.n);
    const order = new Int32Array(h.n);
    for (let i = 0; i < h.n; i++) {
      order[i] = i;
      const e = h.employer[i];
      hhStatus[i] = e === UNEMPLOYED ? 0 : e === PUBLIC ? 3 : h.ownBiz[i] === e ? (f.solo[e] ? 5 : 4) : f.formal[e] ? 1 : 2;
    }
    const wealth = (i: number) => h.cash[i] + h.dep[i];
    order.sort((x, y) => wealth(x) - wealth(y));
    for (let r = 0; r < h.n; r++) hhWealth[order[r]] = Math.min(4, Math.floor((r * 5) / h.n));
    const firmKind = new Uint8Array(f.n);
    const firmStock = new Float32Array(f.n);
    for (let i = 0; i < f.n; i++) {
      firmKind[i] = f.formal[i] ? 0 : f.solo[i] ? 2 : 1;
      firmStock[i] = f.salesE[i] > 0 ? Math.min(3, f.inv[i] / f.salesE[i]) : 0;
    }
    const bankCar = new Float32Array(b.n);
    for (let i = 0; i < b.n; i++) bankCar[i] = b.loans[i] > 0 ? bankEquity(b, i) / b.loans[i] : 1;
    const distress = i32(f.t, 'distress');
    const firmDistress = new Uint8Array(f.n);
    for (let i = 0; i < f.n; i++) firmDistress[i] = distress[i] > 0 ? 1 : 0;
    return {
      nHh: h.n,
      hhStatus,
      hhWealth,
      hhEmployer: h.employer.slice(0, h.n),
      nFirm: f.n,
      firmAlive: f.alive.slice(0, f.n),
      firmKind,
      firmSector: f.sector.slice(0, f.n),
      firmWorkers: f.workers.slice(0, f.n),
      firmStock,
      firmDistress,
      firmState: f.stateOwned.slice(0, f.n),
      nBank: b.n,
      bankCar,
    };
  }

  /** Mẫu bút toán của một tháng, lấy theo số tiền, kèm tổng đúng theo loại. */
  private txSample(tick: number, max = 240): TxSample {
    const L = this.w.ledger;
    const nk = L.nkind;
    const totals = new Float64Array(nk);
    totals.set(L.volumeHist.subarray(tick * nk, (tick + 1) * nk));
    const idx: number[] = [];
    const lim = Math.min(L.count, L.cap);
    for (let j = 1; j <= lim; j++) {
      const i = (L.head - j + L.cap) % L.cap;
      if (L.tTick[i] < tick) break;
      if (L.tTick[i] === tick) idx.push(i);
    }
    // lấy mẫu có hệ thống theo số tiền: giao dịch lớn chắc chắn có mặt, giao dịch nhỏ theo xác suất
    let sum = 0;
    for (const i of idx) sum += L.tAmount[i];
    const stepAmt = sum / max;
    const pick: number[] = [];
    let acc = stepAmt / 2;
    for (let j = idx.length - 1; j >= 0; j--) {
      acc += L.tAmount[idx[j]];
      if (acc >= stepAmt) {
        pick.push(idx[j]);
        acc -= stepAmt * Math.max(1, Math.floor(acc / stepAmt));
      }
    }
    const n = pick.length;
    const out: TxSample = { n, kind: new Uint8Array(n), from: new Int32Array(n), to: new Int32Array(n), amount: new Float64Array(n), totals };
    pick.forEach((i, j) => {
      out.kind[j] = L.tKind[i];
      out.from[j] = L.tFrom[i];
      out.to[j] = L.tTo[i];
      out.amount[j] = L.tAmount[i];
    });
    return out;
  }

  // =====================================================================
  // Bản tin: câu chữ sinh từ số liệu và phần phân rã của tháng (đề xuất S7)
  // =====================================================================
  private news(): NewsItem[] {
    const w = this.w;
    const eng = this.eng;
    const t = w.meta.tick - 1;
    const out: NewsItem[] = [];
    const s = st(w);
    const h = H(w);
    const f = F(w);
    // các hộ và doanh nghiệp có tên: đổi trạng thái thì thành tin
    const cur = s.names.map((n) => (n.kind === 'hh' ? h.employer[n.id] : f.alive[n.id] ? f.workers[n.id] : -9));
    if (this.prevNamed.length === cur.length) {
      s.names.forEach((n, i) => {
        const a = this.prevNamed[i];
        const b = cur[i];
        if (n.kind === 'hh' && a !== b) {
          if (b === UNEMPLOYED) out.push({ tick: t, tone: -1, text: `${n.name} mất việc.` });
          else if (a === UNEMPLOYED) out.push({ tick: t, tone: 1, text: `${n.name} có việc trở lại${b === PUBLIC ? ' ở cơ quan Nhà nước' : b >= 0 && f.solo[b] ? ', tự làm một mình' : ''}.` });
        }
        if (n.kind === 'firm' && a !== -9 && b === -9) out.push({ tick: t, tone: -1, text: `${n.name} đóng cửa.` });
      });
    }
    this.prevNamed = cur;
    // mỗi quý: chỉ số nào đổi nhiều nhất, và lý do lớn nhất theo phần phân rã
    if ((t + 1) % 3 === 0 && t >= 3) {
      const cand: Array<{ id: string; rel: number; text: string; tone: -1 | 0 | 1 }> = [];
      const consider = (id: string, kind: 'pct' | 'pt', th: number, name: string) => {
        const a = eng.value(w, id, t - 3);
        const b = eng.value(w, id, t);
        const d = kind === 'pct' ? b / a - 1 : b - a;
        if (!Number.isFinite(d) || Math.abs(d) < th) return;
        const ind = eng.indicators[eng.indicatorIndex.get(id)!];
        const parts = Object.entries(contributions(w, id, t - 3, t)).filter(([k, v]) => k !== 'other' && v * d > 0).sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
        const why = parts.length ? ` Lý do lớn nhất: ${eng.reasons.get(parts[0][0])?.label ?? parts[0][0]}.` : '';
        const amount = kind === 'pct' ? fmtPct(Math.abs(d)) : `${(Math.abs(d) * 100).toFixed(1).replace('.', ',')} điểm`;
        const tone = (Math.sign(d) * (ind.good ?? 0)) as -1 | 0 | 1;
        cand.push({ id, rel: Math.abs(d) / th, tone, text: `${name} ${d > 0 ? 'tăng' : 'giảm'} ${amount} trong ba tháng.${why}` });
      };
      consider('cpi', 'pct', 0.015, 'Giá tiêu dùng');
      consider('unemployment', 'pt', 0.01, 'Tỷ lệ thất nghiệp');
      consider('consumption', 'pct', 0.04, 'Tiêu dùng của các hộ');
      consider('credit', 'pct', 0.04, 'Dư nợ tín dụng');
      cand.sort((x, y) => y.rel - x.rel);
      for (const c of cand.slice(0, 2)) out.push({ tick: t, text: c.text, indicator: c.id, tone: c.tone });
      const nb = eng.value(w, 'firms.bankrupt', t) + eng.value(w, 'firms.bankrupt', t - 1) + eng.value(w, 'firms.bankrupt', t - 2);
      if (nb >= Math.max(3, f.n * 0.01)) out.push({ tick: t, tone: -1, indicator: 'firms.bankrupt', text: `${nb} doanh nghiệp phá sản trong quý.` });
    }
    for (let i = this.sentEvents; i < w.events.length; i++) {
      const e = w.events[i];
      if (e.type === 'shock') out.push({ tick: e.tick, tone: -1, text: `${e.label}.` });
    }
    return out;
  }

  // =====================================================================
  // Kịch bản
  // =====================================================================
  private ctx(base: World = this.w): Ctx {
    return { eng: this.eng, w: this.w, base, t0: this.t0, t1: this.w.meta.tick };
  }

  private scenarioState(): ScenarioState | undefined {
    const def = this.def;
    if (!def) return undefined;
    const c = this.ctx();
    const left = this.t0 + def.months - this.w.meta.tick;
    return { id: def.id, monthsLeft: Math.max(0, left), done: left <= 0, goals: def.goals.map((g) => ({ id: g.id, label: g.label, ...g.test(c) })) };
  }

  /** Lời giải thích cuối kịch bản: từng khẳng định đo trên ván của người chơi so với thế giới đối chứng. */
  scenarioReport(): ScenarioReport {
    const def = this.def;
    if (!def) throw new Error('Ván này không phải kịch bản.');
    const origin = def.control === 'shock' ? 'shock' : 'player';
    const any = this.log.some((e, i) => e.origin === origin && this.applied.has(i));
    const base = any ? this.replay((e) => e.origin === origin).w : this.w;
    const c = this.ctx(base);
    const goals = def.goals.map((g) => ({ id: g.id, label: g.label, ...g.test(c) }));
    const claims: ClaimResult[] = def.claims.map((cl) => ({ text: cl.text, ...cl.test(c) }));
    return { id: def.id, won: goals.every((g) => g.ok), goals, claims, explanation: def.explanation, history: def.history, simplifications: def.simplifications };
  }

  // =====================================================================
  // So sánh song song các lựa chọn của kịch bản
  // =====================================================================
  /**
   * Chạy từng nhánh từ cùng một trạng thái xuất phát (tháng t0) rồi đặt cạnh thế giới đối chứng.
   * Trạng thái t0 lấy từ `t0World`, chụp lúc mở ván. Không dựa vào `snaps` vì mốc lưu có thể bị bỏ bớt khi người chơi ra nhiều lệnh.
   * Mỗi nhánh áp: các lệnh của kịch bản còn lại sau t0 (cú sốc theo lịch, nhận điều khiển tác nhân), bước chung `demo`, bước riêng của nhánh.
   * Lệnh của người chơi trong nhật ký bị bỏ qua. Thế giới đang chạy `this.w` không bị đụng tới.
   */
  scenarioOptions(): OptionsReport {
    const def = this.def;
    if (!def) throw new Error('Ván này không phải kịch bản.');
    if (!def.options?.length) throw new Error('Kịch bản này không có nhiều lựa chọn để so sánh.');
    if (!this.t0World) throw new Error('Ván lưu này không có trạng thái xuất phát của kịch bản. Hãy mở ván mới để so sánh các lựa chọn.');
    const cols = def.compare ?? [];
    const months = def.months;
    if (!this.optionsCache) {
      const control = this.branch(def.control !== 'shock', []);
      const worlds = def.options.map((o) => this.branch(true, [...def.demo, ...o.steps]));
      const rows = def.options.map((o, i) => {
        const w = worlds[i];
        const others: Record<string, World> = {};
        def.options!.forEach((x, k) => {
          if (k !== i) others[x.id] = worlds[k];
        });
        const c: Ctx = { eng: this.eng, w, base: control, t0: this.t0, t1: this.t0 + months, others };
        return {
          id: o.id,
          label: o.label,
          note: o.note,
          values: this.compareValues(w, control, cols),
          common: def.claims.map((cl) => ({ text: cl.text, ...cl.test(c) })),
          claims: o.claims.map((cl) => ({ text: cl.text, ...cl.test(c) })),
        };
      });
      this.optionsCache = { control, report: { columns: cols.map((x) => ({ indicator: x.indicator, label: x.label, kind: x.kind })), rows } };
    }
    const { control, report } = this.optionsCache;
    if (this.w.meta.tick >= this.t0 + months) return { ...report, player: { values: this.compareValues(this.w, control, cols) } };
    return report;
  }

  /**
   * Một nhánh chạy def.months tháng từ trạng thái t0.
   * `withShocks = false`: bỏ cú sốc của kịch bản (thế giới đối chứng khi control = 'shock').
   */
  private branch(withShocks: boolean, steps: Step[]): World {
    const def = this.def!;
    const w = unpack<World>(this.t0World!);
    const entries = this.log.filter((e) => {
      if (e.origin === 'player') return false;
      if (e.origin === 'shock') return withShocks && (this.t0 > 0 || e.tick > 0);
      return e.cmd.type === 'possess'; // điều kiện đầu đã nằm sẵn trong trạng thái t0
    });
    const done = new Set<LogEntry>();
    const due = () => {
      for (const e of entries) {
        if (done.has(e) || e.tick > w.meta.tick) continue;
        done.add(e);
        this.apply(w, e, -1, false);
      }
    };
    const by = 'Người chơi';
    due();
    for (let k = 0; k < def.months; k++) {
      for (const x of steps) if (x.at === k) this.applyStep(w, x, by);
      this.eng.step(w);
      due();
    }
    return w;
  }

  /** Áp một bước của kịch bản lên một thế giới bất kỳ, giống `act` nhưng không ghi nhật ký. Giá trị động tính trên chính thế giới đó. */
  private applyStep(w: World, x: Step, by: string): void {
    const y = x.dynamic ? x.dynamic(this.eng, w) : x;
    for (const [id, v] of Object.entries(y.laws ?? {})) this.eng.setLaw(w, id, v, by);
    for (const [id, v] of Object.entries(y.params ?? {})) this.setParam(w, id, v, by);
    for (const [rule, variant] of Object.entries(y.variants ?? {})) this.eng.setVariant(w, rule, variant);
    if (x.orders) Object.assign(playerOf(w), x.orders);
  }

  /** Giá trị các cột so sánh: trung bình cửa sổ [t0+từ, t0+min(đến, số tháng)) của nhánh so với đối chứng. */
  private compareValues(w: World, control: World, cols: NonNullable<ScenarioDef['compare']>): number[] {
    const months = this.def!.months;
    const mean = (x: World, id: string, a: number, b: number) => {
      const v = this.eng.seriesOf(x, id, a, b);
      let sum = 0;
      for (const y of v) sum += y;
      return v.length ? sum / v.length : NaN;
    };
    return cols.map((c) => {
      const a = this.t0 + c.from;
      const b = this.t0 + Math.min(c.to, months);
      const x = mean(w, c.indicator, a, b);
      const y = mean(control, c.indicator, a, b);
      return c.kind === 'rel' ? x / y - 1 : x - y;
    });
  }

  // =====================================================================
  // Truy vấn
  // =====================================================================
  private query(q: Query): QueryData {
    const w = this.w;
    const eng = this.eng;
    switch (q.kind) {
      case 'series': {
        const ids = q.ids ?? eng.indicators.map((x) => x.id);
        const from = Math.max(0, q.from ?? 0);
        const n = Math.max(0, w.meta.tick - from);
        const data = new Float64Array(ids.length * n);
        ids.forEach((id, k) => data.set(eng.seriesOf(w, id, from, w.meta.tick), k * n));
        return { from, n, ids, data } satisfies SeriesResult;
      }
      case 'explain':
        return this.tree(explain(eng, w, q.indicator, q.t0, q.t1, { depth: q.depth ?? 3 }));
      case 'agent':
        return this.agent(q.sector, q.id);
      case 'agents':
        return this.agents(q.sector);
      case 'money':
        return this.money(q.t0, q.t1);
      case 'flows':
        return this.flows(q.t0, q.t1);
      case 'hash':
        return { hash: eng.hash(w) };
      case 'scenarioReport':
        return this.scenarioReport();
      case 'scenarioOptions':
        return this.scenarioOptions();
    }
  }

  private tree(n: CausalNode): CausalTree {
    return {
      kind: n.kind,
      id: n.id,
      label: n.label,
      unit: n.unit,
      from: n.from,
      to: n.to,
      t0: n.t0,
      t1: n.t1,
      delta: n.delta,
      events: n.events?.map((e) => this.eventInfo(e, this.w.events.indexOf(e))),
      children: n.children.map((c) => ({ reason: c.reason, label: c.label, amount: c.amount, share: c.share, nodes: c.nodes.map((x) => this.tree(x)) })),
    };
  }

  private money(t0: number, t1: number): MoneyResult {
    const L = this.w.ledger;
    const nk = L.nkind;
    const a = Math.max(0, t0);
    const b = Math.min(L.histTicks, t1);
    const rows: MoneyResult['rows'] = [];
    let total = 0;
    for (let k = 0; k < nk; k++) {
      let x = 0;
      for (let t = a; t < b; t++) x += L.moneyHist[t * nk + k];
      if (Math.abs(x) < 1) continue;
      rows.push({ kind: TX_KINDS[k].id, label: TX_KINDS[k].label, amount: x });
      total += x;
    }
    rows.sort((x, y) => y.amount - x.amount);
    return { t0: a, t1: b, rows, total, ...publicMoney(this.w) };
  }

  private flows(t0: number, t1: number): FlowsResult {
    const L = this.w.ledger;
    const nk = L.nkind;
    const a = Math.max(0, t0);
    const b = Math.min(L.histTicks, t1);
    const rows: FlowsResult['rows'] = [];
    for (let k = 0; k < nk; k++) {
      const bySector = new Array(NSEC).fill(0);
      let any = false;
      for (let t = a; t < b; t++)
        for (let s = 0; s < NSEC; s++) {
          const v = L.flowHist[t * NSEC * nk + s * nk + k];
          bySector[s] += v;
          if (v !== 0) any = true;
        }
      if (any) rows.push({ kind: TX_KINDS[k].id, label: TX_KINDS[k].label, bySector });
    }
    return { sectors: [...SECTOR_LABEL], rows };
  }

  private refName(r: number): string {
    const sec = r >>> 24;
    const id = r & 0xffffff;
    if (sec === GOV) return 'Chính phủ';
    if (sec === CB) return 'NHNN';
    if (sec === BANK) return `Ngân hàng ${id + 1}`;
    const s = st(this.w);
    const named = s.names.find((n) => n.id === id && (n.kind === 'hh') === (sec === HH));
    if (named) return named.name;
    if (sec === HH) return `Hộ ${id + 1}`;
    const f = F(this.w);
    return f.formal[id] ? `Doanh nghiệp ${id + 1}` : f.solo[id] ? `Người tự làm ${id + 1}` : `Hộ kinh doanh ${id + 1}`;
  }

  private agents(sector: 'hh' | 'firm' | 'bank'): AgentRow[] {
    const w = this.w;
    const rows: AgentRow[] = [];
    if (sector === 'hh') {
      const h = H(w);
      const named = i32(h.t, 'named');
      for (let i = 0; i < h.n; i++) rows.push({ id: i, title: this.refName((HH << 24) | i), subtitle: this.hhJob(i), size: h.cash[i] + h.dep[i], named: named[i] >= 0 });
    } else if (sector === 'firm') {
      const f = F(w);
      const named = i32(f.t, 'named');
      for (let i = 0; i < f.n; i++) if (f.alive[i]) rows.push({ id: i, title: this.refName((FIRM << 24) | i), subtitle: `${SECTOR_NAME[f.sector[i]]}, ${f.workers[i]} người`, size: f.workers[i], named: named[i] >= 0 });
    } else {
      const b = B(w);
      for (let i = 0; i < b.n; i++) rows.push({ id: i, title: `Ngân hàng ${i + 1}`, subtitle: b.stateOwned[i] ? 'Nhà nước nắm' : 'Tư nhân', size: b.loans[i], named: false });
    }
    rows.sort((x, y) => Number(y.named) - Number(x.named) || y.size - x.size);
    return rows.slice(0, 200);
  }

  private hhJob(i: number): string {
    const h = H(this.w);
    const f = F(this.w);
    const e = h.employer[i];
    if (e === UNEMPLOYED) return 'Thất nghiệp';
    if (e === PUBLIC) return 'Làm cho Nhà nước';
    if (h.ownBiz[i] === e) return f.solo[e] ? 'Tự làm một mình' : 'Chủ hộ kinh doanh';
    return `Làm ở ${this.refName((FIRM << 24) | e)}`;
  }

  private agent(sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb', id: number): AgentDetail {
    const w = this.w;
    const s = st(w);
    const f = F(w);
    const h = H(w);
    const b = B(w);
    const secNo = { hh: HH, firm: FIRM, bank: BANK, gov: GOV, cb: CB }[sector];
    const r = (secNo << 24) | id;
    const d: AgentDetail = { sector, id, title: this.refName(r), subtitle: '', alive: true, facts: [], assets: [], liabilities: [], netWorth: 0, decisions: [], tx: [] };
    const fact = (label: string, value: number, unit: string) => d.facts.push({ label, value, unit });
    const A = (label: string, amount: number) => amount !== 0 && d.assets.push({ label, amount });
    const Lb = (label: string, amount: number) => amount !== 0 && d.liabilities.push({ label, amount });
    const firmEquity = (i: number) => f.cash[i] + f.dep[i] + f.invValue[i] + f.capValue[i] - f.debt[i];
    if (sector === 'hh') {
      const n = s.names.find((x) => x.kind === 'hh' && x.id === id);
      d.story = n?.story;
      d.subtitle = this.hhJob(id);
      fact('Lương tháng', h.wage[id], 'đồng');
      fact('Thu nhập tháng này (sau thuế)', h.income[id], 'đồng');
      fact('Chi tiêu tháng này', h.cons[id], 'đồng');
      fact('Ngân sách tiêu dùng', h.budget[id], 'đồng');
      fact('Lương thấp nhất chịu nhận', h.resWage[id], 'đồng');
      fact('Lạm phát hộ này cảm thấy', h.piAdapt[id], '%');
      fact('Số người phụ thuộc', h.dependents[id], 'người');
      A('Tiền mặt', h.cash[id]);
      A('Tiền gửi ngân hàng', h.dep[id]);
      const sh = w.tables.share;
      const kind = u8(sh, 'kind');
      const ent = i32(sh, 'entity');
      const own = i32(sh, 'owner');
      const frac = f64(sh, 'frac');
      const al = u8(sh, 'alive');
      let eqF = 0;
      let eqB = 0;
      for (let k = 0; k < sh.n; k++) {
        if (!al[k] || own[k] !== id) continue;
        if (kind[k] === 0) eqF += frac[k] * Math.max(0, firmEquity(ent[k]));
        else eqB += frac[k] * Math.max(0, bankEquity(b, ent[k]));
      }
      A('Phần vốn ở doanh nghiệp', eqF);
      A('Phần vốn ở ngân hàng', eqB);
      if (h.ownBiz[id] >= 0) A('Vốn ở hộ kinh doanh của mình', Math.max(0, firmEquity(h.ownBiz[id])));
    } else if (sector === 'firm') {
      const n = s.names.find((x) => x.kind === 'firm' && x.id === id);
      d.story = n?.story;
      d.alive = f.alive[id] === 1;
      d.subtitle = `${f.formal[id] ? (f.stateOwned[id] ? 'Doanh nghiệp nhà nước' : 'Doanh nghiệp') : f.solo[id] ? 'Người tự làm' : 'Hộ kinh doanh'}, ngành ${SECTOR_NAME[f.sector[id]].toLowerCase()}${d.alive ? '' : ' (đã đóng cửa)'}`;
      fact('Số lao động', f.workers[id], 'người');
      fact('Lương đang trả', f.wage[id], 'đồng');
      fact('Giá bán (gồm thuế)', f.priceG[id], 'đồng');
      fact('Biên lãi trên chi phí', f.markup[id], '%');
      fact('Chi phí mỗi sản phẩm', f.uc[id], 'đồng');
      fact('Bán được tháng này', f.sales[id], 'số');
      fact('Tồn kho', f.inv[id], 'số');
      fact('Máy móc', f.K[id], 'số');
      fact('Lãi trước thuế tháng này', f64(f.t, 'profit')[id], 'đồng');
      A('Tiền gửi ngân hàng', f.dep[id]);
      A('Tiền mặt', f.cash[id]);
      A('Tồn kho (giá vốn)', f.invValue[id]);
      A('Máy móc (giá trị sổ sách)', f.capValue[id]);
      Lb('Nợ ngân hàng', f.debt[id]);
    } else if (sector === 'bank') {
      d.subtitle = b.stateOwned[id] ? 'Ngân hàng thương mại, Nhà nước nắm' : 'Ngân hàng thương mại';
      fact('Vốn tự có so với dư nợ', b.loans[id] > 0 ? bankEquity(b, id) / b.loans[id] : 1, '%');
      fact('Biên lãi suất cho vay', f64(b.t, 'margin')[id], '%');
      A('Dự trữ tại NHNN', b.reserves[id]);
      A('Cho vay', b.loans[id]);
      A('Trái phiếu chính phủ', b.bonds[id]);
      Lb('Tiền gửi của khách', b.depLiab[id]);
      Lb('Vay tái cấp vốn NHNN', b.cbAdv[id]);
    } else if (sector === 'gov') {
      d.subtitle = 'Bộ Tài chính và kho bạc';
      A('Tài khoản kho bạc tại NHNN', f64(w.tables.gov, 'tga')[0]);
      Lb('Trái phiếu đã phát hành', f64(w.tables.gov, 'bondsOut')[0]);
    } else {
      const c = w.tables.cb;
      d.subtitle = 'Ngân hàng Nhà nước';
      A('Trái phiếu chính phủ', f64(c, 'bonds')[0]);
      A('Cho ngân hàng vay tái cấp vốn', f64(c, 'adv')[0]);
      Lb('Tiền mặt đã phát hành', f64(c, 'cashOut')[0]);
      Lb('Dự trữ của ngân hàng', f64(c, 'resLiab')[0]);
      Lb('Tài khoản kho bạc', f64(c, 'tgaLiab')[0]);
    }
    d.netWorth = d.assets.reduce((x, y) => x + y.amount, 0) - d.liabilities.reduce((x, y) => x + y.amount, 0);
    // quyết định gần đây của tác nhân này
    const D = w.causal.decisions;
    for (let j = D.length - 1; j >= 0 && d.decisions.length < 12; j--) {
      const x = D[j];
      if (x.agent !== r) continue;
      d.decisions.push({ tick: x.tick, rule: this.eng.rules.get(x.rule)?.label ?? x.rule, variable: x.variable, before: x.before, after: x.after, parts: x.parts.map((p) => ({ label: this.eng.reasons.get(p.reason)?.label ?? p.reason, amount: p.amount })) });
    }
    // giao dịch gần đây
    const L = w.ledger;
    const lim = Math.min(L.count, L.cap, 400_000);
    for (let j = 1; j <= lim && d.tx.length < 30; j++) {
      const i = (L.head - j + L.cap) % L.cap;
      const out = L.tFrom[i] === r;
      if (!out && L.tTo[i] !== r) continue;
      d.tx.push({ tick: L.tTick[i], kind: TX_KINDS[L.tKind[i]].label, other: this.refName(out ? L.tTo[i] : L.tFrom[i]), amount: out ? -L.tAmount[i] : L.tAmount[i], medium: L.tMedium[i] });
    }
    return d;
  }
}

export function scenarioInfo(d: ScenarioDef): ScenarioInfo {
  return { id: d.id, title: d.title, role: d.role, scale: d.scale, question: d.question, intro: d.intro, prereq: d.prereq, months: d.months, goals: d.goals.map((g) => ({ id: g.id, label: g.label })), predict: d.predict, untested: d.untested, history: d.history, options: d.options?.map((o) => ({ id: o.id, label: o.label, note: o.note })) };
}
