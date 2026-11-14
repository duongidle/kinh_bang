// Bản đồ isometric sống. Lớp tĩnh (nhà, xưởng, ngân hàng) vẽ lại mỗi tháng vào một canvas đệm.
// Lớp động (hạt dòng tiền) vẽ mỗi khung hình, phát lại đúng mẫu giao dịch của tháng vừa xong (CLAUDE.md quy tắc 8).
import { useEffect, useRef } from 'react';
import type { MapFrame, TxSample } from '../../protocol';
import { useStore } from '../store';
import { computeLayout, fitView, GRID, project, spotOf, ZONE_LABEL, ZONES, type Layout, type Spot, type View, type Zone } from './layout';

interface Tone {
  top: string;
  left: string;
  right: string;
}
interface Palette {
  ground: string;
  zone: string;
  zoneLine: string;
  label: string;
  empty: string;
  hh: Tone[]; // theo trạng thái việc làm
  firm: Tone[]; // theo ngành
  stall: Tone;
  bank: Tone;
  gov: Tone;
  cb: Tone;
  alert: string;
  flow: Record<string, string>;
}
const tone = (top: string, left: string, right: string): Tone => ({ top, left, right });
const DARK: Palette = {
  ground: '#14181b',
  zone: '#1a1f23',
  zoneLine: '#2a3136',
  label: '#7d8a93',
  empty: '#20262a',
  hh: [tone('#7a4a45', '#5c3733', '#472a27'), tone('#5f86a6', '#46667f', '#364f63'), tone('#b08a4f', '#86693c', '#66502d'), tone('#7d74b3', '#5e578a', '#48436b'), tone('#c79a45', '#977434', '#735827'), tone('#8f8062', '#6c6049', '#524937')],
  firm: [tone('#7fa66a', '#5f7f4f', '#48613c'), tone('#8fa3b5', '#6b7c8b', '#515f6b'), tone('#c58f6f', '#976d54', '#74533f')],
  stall: tone('#cdb27a', '#9c875c', '#786746'),
  bank: tone('#d9dde0', '#a6abaf', '#80858a'),
  gov: tone('#d9a49a', '#a87b73', '#825e58'),
  cb: tone('#e8c56a', '#b3974f', '#8a743c'),
  alert: '#e5604d',
  flow: { wage: '#6fb1e0', buy: '#e8b04a', tax: '#e07a6a', credit: '#7fd1a3', gov: '#c79be8', other: '#9aa5ad' },
};
const LIGHT: Palette = {
  ...DARK,
  ground: '#eef0ec',
  zone: '#e3e6e0',
  zoneLine: '#cfd4cc',
  label: '#6b756f',
  empty: '#d9ddd6',
  flow: { wage: '#2f7fb8', buy: '#b97d12', tax: '#c24a38', credit: '#2c9a63', gov: '#8a55c2', other: '#77828a' },
};

// loại giao dịch -> nhóm màu. Màu ở đây là nội dung: nó cho biết đó là dòng tiền gì.
const FLOW_OF: Record<string, keyof Palette['flow']> = {
  wage: 'wage',
  wage_public: 'wage',
  owner_draw: 'wage',
  dividend: 'wage',
  consumption: 'buy',
  investment: 'buy',
  gov_purchase: 'gov',
  transfer_social: 'gov',
  vat: 'tax',
  pit: 'tax',
  cit: 'tax',
  hkd_tax: 'tax',
  excise: 'tax',
  fees: 'tax',
  loan_new: 'credit',
  loan_repay: 'credit',
  interest_loan: 'credit',
  interest_dep: 'credit',
};
export const FLOW_LEGEND: Array<[keyof Palette['flow'], string]> = [
  ['wage', 'Lương, cổ tức'],
  ['buy', 'Mua hàng, mua máy'],
  ['tax', 'Thuế'],
  ['credit', 'Vay, trả nợ, lãi'],
  ['gov', 'Chi ngân sách'],
];

function box(c: CanvasRenderingContext2D, v: View, s: Spot, w: number, h: number, t: Tone) {
  const a = w / 2;
  const [x0, y0] = project(v, s.gx - a, s.gy - a, h);
  const [x1, y1] = project(v, s.gx + a, s.gy - a, h);
  const [x2, y2] = project(v, s.gx + a, s.gy + a, h);
  const [x3, y3] = project(v, s.gx - a, s.gy + a, h);
  const dz = h * v.s;
  c.fillStyle = t.left;
  c.beginPath();
  c.moveTo(x3, y3);
  c.lineTo(x2, y2);
  c.lineTo(x2, y2 + dz);
  c.lineTo(x3, y3 + dz);
  c.fill();
  c.fillStyle = t.right;
  c.beginPath();
  c.moveTo(x2, y2);
  c.lineTo(x1, y1);
  c.lineTo(x1, y1 + dz);
  c.lineTo(x2, y2 + dz);
  c.fill();
  c.fillStyle = t.top;
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x1, y1);
  c.lineTo(x2, y2);
  c.lineTo(x3, y3);
  c.fill();
}

function tile(c: CanvasRenderingContext2D, v: View, z: Zone, fill: string, stroke?: string) {
  const p = [project(v, z.x0, z.y0), project(v, z.x1, z.y0), project(v, z.x1, z.y1), project(v, z.x0, z.y1)];
  c.beginPath();
  c.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < 4; i++) c.lineTo(p[i][0], p[i][1]);
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}

interface Hit {
  x: number;
  y: number;
  r: number;
  sector: 'hh' | 'firm' | 'bank' | 'gov' | 'cb';
  id: number;
}

function drawStatic(c: CanvasRenderingContext2D, v: View, f: MapFrame, L: Layout, P: Palette, w: number, h: number, focus: { hh: number; firm: number }, named: Array<{ sector: string; id: number; name: string }>): Hit[] {
  const hits: Hit[] = [];
  c.clearRect(0, 0, w, h);
  tile(c, v, { x0: -3, y0: -3, x1: GRID + 3, y1: GRID + 3 }, P.ground);
  for (let k = 0; k < 3; k++) {
    tile(c, v, ZONES.formal[k], P.zone, P.zoneLine);
    tile(c, v, ZONES.informal[k], P.zone, P.zoneLine);
  }
  tile(c, v, ZONES.center, P.zone, P.zoneLine);
  tile(c, v, ZONES.homes, P.zone, P.zoneLine);

  // gom mọi khối rồi vẽ từ sau ra trước
  const items: Array<{ d: number; draw: () => void }> = [];
  const push = (s: Spot, draw: () => void) => items.push({ d: s.gx + s.gy, draw });
  for (let i = 0; i < f.nFirm; i++) {
    const s = L.firm[i];
    if (!s) continue;
    const [x, y] = project(v, s.gx, s.gy);
    if (!f.firmAlive[i]) {
      if (f.firmKind[i] === 0) push(s, () => box(c, v, s, s.size * 0.55, 0.05, { top: P.empty, left: P.empty, right: P.empty }));
      continue;
    }
    const kind = f.firmKind[i];
    const base = kind === 0 ? Math.min(0.86, 0.42 + Math.sqrt(f.firmWorkers[i]) * 0.08) : kind === 1 ? 0.6 : 0.42;
    const ht = kind === 0 ? 1.2 + Math.sqrt(f.firmWorkers[i]) * 0.9 : kind === 1 ? 0.9 : 0.5;
    const t = kind === 0 ? P.firm[f.firmSector[i]] : P.stall;
    push(s, () => {
      box(c, v, s, s.size * base, Math.min(ht, s.size * 2.2), t);
      if (f.firmState[i]) {
        // doanh nghiệp nhà nước: một dải màu trên nóc
        const [tx, ty] = project(v, s.gx, s.gy, Math.min(ht, s.size * 2.2));
        c.fillStyle = P.gov.top;
        c.fillRect(tx - 1.5, ty - 5, 3, 5);
      }
      if (f.firmDistress[i]) {
        const [tx, ty] = project(v, s.gx, s.gy, Math.min(ht, s.size * 2.2) + 0.6);
        c.fillStyle = P.alert;
        c.beginPath();
        c.arc(tx, ty, 2.2, 0, 6.3);
        c.fill();
      }
    });
    hits.push({ x, y: y - ht * v.s * 0.5, r: Math.max(7, s.size * v.s * 0.7), sector: 'firm', id: i });
  }
  const hhH = f.nHh <= 60 ? 1.6 : f.nHh <= 600 ? 0.7 : 0.28;
  for (let i = 0; i < f.nHh; i++) {
    const s = L.hh[i];
    const t = P.hh[f.hhStatus[i]];
    const ht = hhH * (0.6 + f.hhWealth[i] * 0.28);
    push(s, () => box(c, v, s, s.size * 0.62, ht, t));
    if (f.nHh <= 600) {
      const [x, y] = project(v, s.gx, s.gy);
      hits.push({ x, y, r: Math.max(5, s.size * v.s * 0.6), sector: 'hh', id: i });
    }
  }
  const big = (s: Spot, t: Tone, ht: number, sector: Hit['sector'], id: number) => {
    push(s, () => {
      box(c, v, s, s.size * 0.74, ht, t);
      box(c, v, s, s.size * 0.5, ht + 0.7, t);
    });
    const [x, y] = project(v, s.gx, s.gy);
    hits.push({ x, y: y - ht * v.s * 0.5, r: Math.max(10, s.size * v.s * 0.8), sector, id });
  };
  big(L.gov, P.gov, 4.2, 'gov', 0);
  big(L.cb, P.cb, 4.8, 'cb', 0);
  L.bank.forEach((s, k) => big(s, f.bankCar[k] < 0.08 ? { ...P.bank, top: P.alert } : P.bank, 3.2, 'bank', k));
  items.sort((a, b) => a.d - b.d);
  for (const it of items) it.draw();

  // chữ nằm ngoài hình: nhãn khu ở mép
  c.font = '500 11px system-ui, sans-serif';
  c.fillStyle = P.label;
  c.textAlign = 'center';
  ZONES.formal.forEach((z, k) => {
    const [x, y] = project(v, (z.x0 + z.x1) / 2, z.y0);
    c.fillText(ZONE_LABEL[k], x, y - 8);
  });
  const lab = (s: Spot, text: string, z: number) => {
    const [x, y] = project(v, s.gx, s.gy, z);
    c.fillText(text, x, y - 6);
  };
  lab(L.gov, 'Kho bạc', 5.4);
  lab(L.cb, 'NHNN', 6);
  if (L.bank.length) lab(L.bank[Math.floor(L.bank.length / 2)], 'Ngân hàng', 4.4);
  {
    const z = ZONES.homes;
    const [x, y] = project(v, z.x0, z.y1);
    c.textAlign = 'left';
    c.fillText('Khu dân cư', x + 14, y - 4);
  }
  // tác nhân có tên và tác nhân đang điều khiển
  c.textAlign = 'center';
  for (const n of named) {
    const s = n.sector === 'hh' ? L.hh[n.id] : L.firm[n.id];
    if (!s) continue;
    const mine = (n.sector === 'hh' && focus.hh === n.id) || (n.sector === 'firm' && focus.firm === n.id);
    const [x, y] = project(v, s.gx, s.gy, n.sector === 'hh' ? hhH + 1 : 4);
    c.fillStyle = mine ? P.cb.top : P.label;
    c.font = `${mine ? 600 : 500} 10px system-ui, sans-serif`;
    c.fillText(n.name, x, y - 4);
    c.fillRect(x - 0.5, y - 2, 1, n.sector === 'hh' ? 6 : 10);
  }
  return hits;
}

interface Particle {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  t0: number; // thời điểm bắt đầu, phần của quãng phát lại
  r: number;
  color: string;
}

function makeParticles(tx: TxSample, L: Layout, v: View, P: Palette, kinds: string[]): Particle[] {
  const out: Particle[] = [];
  let max = 1;
  for (let i = 0; i < tx.n; i++) max = Math.max(max, tx.amount[i]);
  for (let i = 0; i < tx.n; i++) {
    const a = spotOf(L, tx.from[i]);
    const b = spotOf(L, tx.to[i]);
    if (!a || !b || a === b) continue;
    const [x0, y0] = project(v, a.gx, a.gy, 0.8);
    const [x1, y1] = project(v, b.gx, b.gy, 0.8);
    const flow = FLOW_OF[kinds[tx.kind[i]]] ?? 'other';
    out.push({ x0, y0, x1, y1, t0: ((i * 0.61803) % 1) * 0.6, r: 1.2 + 2.6 * Math.sqrt(tx.amount[i] / max), color: P.flow[flow] });
  }
  return out;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function IsoMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLCanvasElement>(null);
  const live = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ hits: Hit[]; parts: Particle[]; start: number; dur: number; w: number; h: number; view: View; layout?: Layout }>({ hits: [], parts: [], start: 0, dur: 1, w: 0, h: 0, view: { ox: 0, oy: 0, s: 1 } });
  const frame = useStore((s) => s.frame);
  const tx = useStore((s) => s.tx);
  const txTick = useStore((s) => s.txTick);
  const speed = useStore((s) => s.speed);
  const kinds = useStore((s) => s.catalog?.txKinds);
  const named = useStore((s) => s.named);
  const hh = useStore((s) => s.tick?.player.hh ?? -1);
  const firm = useStore((s) => s.tick?.player.firm ?? -1);
  const open = useStore((s) => s.open);
  const sizeTick = useRef(0);

  // vẽ lớp tĩnh khi có khung mới hoặc đổi kích thước
  useEffect(() => {
    const el = wrap.current;
    const cv = base.current;
    const lv = live.current;
    if (!el || !cv || !lv) return;
    const paint = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = el.clientWidth;
      const h = el.clientHeight;
      const S = state.current;
      if (w !== S.w || h !== S.h) {
        for (const c of [cv, lv]) {
          c.width = Math.round(w * dpr);
          c.height = Math.round(h * dpr);
          c.style.width = `${w}px`;
          c.style.height = `${h}px`;
        }
        S.w = w;
        S.h = h;
        S.view = fitView(w, h);
      }
      if (!frame || w === 0) return;
      const ctx = cv.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const P = window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
      S.layout = computeLayout(frame);
      S.hits = drawStatic(ctx, S.view, frame, S.layout, P, w, h, { hh, firm }, named);
    };
    paint();
    const ro = new ResizeObserver(() => {
      sizeTick.current++;
      paint();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [frame, named, hh, firm]);

  // hạt dòng tiền của tháng vừa xong
  useEffect(() => {
    const S = state.current;
    if (!tx || !S.layout || !kinds) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || speed === 99) {
      S.parts = [];
      return;
    }
    const P = window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
    S.parts = makeParticles(tx, S.layout, S.view, P, kinds.map((k) => k.id));
    S.start = performance.now();
    S.dur = speed === 16 ? 180 : speed === 4 ? 700 : 2600;
  }, [tx, txTick, kinds, speed]);

  useEffect(() => {
    let raf = 0;
    let dirty = true;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const lv = live.current;
      const S = state.current;
      if (!lv) return;
      const u = (performance.now() - S.start) / S.dur;
      if (u > 1.05 && !dirty) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const c = lv.getContext('2d')!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, S.w, S.h);
      dirty = u <= 1.05;
      if (u > 1.05) return;
      for (const p of S.parts) {
        const t = (u - p.t0) / 0.4;
        if (t <= 0 || t >= 1) continue;
        const e = ease(t);
        const x = p.x0 + (p.x1 - p.x0) * e;
        const y = p.y0 + (p.y1 - p.y0) * e - Math.sin(e * Math.PI) * 14;
        c.globalAlpha = Math.min(1, 4 * t, 4 * (1 - t));
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(x, y, p.r, 0, 6.3);
        c.fill();
      }
      c.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onClick = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    let best: Hit | null = null;
    let bd = Infinity;
    for (const h of state.current.hits) {
      const d = Math.hypot(h.x - x, h.y - y);
      if (d < h.r && d < bd) {
        bd = d;
        best = h;
      }
    }
    if (best) open({ kind: 'agent', sector: best.sector, id: best.id });
  };

  return (
    <div ref={wrap} className="map" onClick={onClick} role="img" aria-label="Bản đồ nền kinh tế: khu sản xuất, ngân hàng, kho bạc, khu dân cư">
      <canvas ref={base} />
      <canvas ref={live} />
    </div>
  );
}
