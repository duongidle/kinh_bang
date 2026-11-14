// Bố cục thành phố trên lưới isometric. Ở GĐ1 vị trí chỉ để nhìn (gd0 mục 8.2); khoảng cách chưa có ý nghĩa kinh tế.
// Mọi vị trí suy ra từ số thứ tự của tác nhân, nên cùng một ván luôn vẽ giống nhau.
import type { MapFrame } from '../../protocol';

export interface Spot {
  gx: number;
  gy: number;
  size: number; // cạnh đáy theo đơn vị lưới
}

export interface Zone {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export const GRID = 100;
const Z = (x0: number, y0: number, x1: number, y1: number): Zone => ({ x0: x0 * GRID, y0: y0 * GRID, x1: x1 * GRID, y1: y1 * GRID });

// Ba khu sản xuất ở phía sau, trung tâm hành chính ở giữa, khu dân cư ở phía trước.
export const ZONES = {
  formal: [Z(0.02, 0.02, 0.3, 0.3), Z(0.36, 0.02, 0.64, 0.24), Z(0.7, 0.02, 0.98, 0.3)],
  informal: [Z(0.02, 0.33, 0.3, 0.5), Z(0.36, 0.27, 0.64, 0.36), Z(0.7, 0.33, 0.98, 0.5)],
  center: Z(0.36, 0.4, 0.64, 0.52),
  homes: Z(0.02, 0.58, 0.98, 0.98),
};
export const ZONE_LABEL = ['Nông nghiệp', 'Công nghiệp', 'Dịch vụ'];

function gridIn(z: Zone, k: number, n: number): Spot {
  const w = z.x1 - z.x0;
  const h = z.y1 - z.y0;
  const cols = Math.max(1, Math.ceil(Math.sqrt((Math.max(1, n) * w) / h)));
  const rows = Math.max(1, Math.ceil(Math.max(1, n) / cols));
  const cw = w / cols;
  const ch = h / rows;
  return { gx: z.x0 + ((k % cols) + 0.5) * cw, gy: z.y0 + (Math.floor(k / cols) + 0.5) * ch, size: Math.min(cw, ch) };
}

export interface Layout {
  hh: Spot[];
  firm: Array<Spot | null>;
  bank: Spot[];
  gov: Spot;
  cb: Spot;
}

export function computeLayout(f: MapFrame): Layout {
  const hh: Spot[] = new Array(f.nHh);
  for (let i = 0; i < f.nHh; i++) hh[i] = gridIn(ZONES.homes, i, f.nHh);
  // doanh nghiệp: giữ chỗ theo thứ tự ra đời, nơi đã đóng cửa để lại lô đất trống; hộ kinh doanh và người tự làm xếp theo nơi đang mở
  const firm: Array<Spot | null> = new Array(f.nFirm).fill(null);
  for (let sec = 0; sec < 3; sec++) {
    const formal: number[] = [];
    const inf: number[] = [];
    for (let i = 0; i < f.nFirm; i++) {
      if (f.firmSector[i] !== sec) continue;
      if (f.firmKind[i] === 0) formal.push(i);
      else if (f.firmAlive[i]) inf.push(i);
    }
    formal.forEach((i, k) => (firm[i] = gridIn(ZONES.formal[sec], k, formal.length)));
    inf.forEach((i, k) => (firm[i] = gridIn(ZONES.informal[sec], k, inf.length)));
  }
  const c = ZONES.center;
  const n = f.nBank + 2;
  const at = (k: number): Spot => ({ gx: c.x0 + ((k + 0.5) * (c.x1 - c.x0)) / n, gy: (c.y0 + c.y1) / 2, size: Math.min((c.x1 - c.x0) / n, c.y1 - c.y0) });
  const bank: Spot[] = [];
  for (let k = 0; k < f.nBank; k++) bank.push(at(k + 2));
  return { hh, firm, bank, gov: at(0), cb: at(1) };
}

/** Vị trí của một tác nhân theo mã tham chiếu (khu vực ở 8 bit cao). */
export function spotOf(L: Layout, ref: number): Spot | null {
  const sec = ref >>> 24;
  const id = ref & 0xffffff;
  if (sec === 0) return L.hh[id] ?? null;
  if (sec === 1) return L.firm[id] ?? null;
  if (sec === 2) return L.bank[id] ?? null;
  if (sec === 3) return L.gov;
  return L.cb;
}

// ---------- phép chiếu ----------
export interface View {
  ox: number;
  oy: number;
  s: number; // pixel cho mỗi đơn vị lưới theo trục x màn hình
}
export const project = (v: View, gx: number, gy: number, z = 0): [number, number] => [v.ox + (gx - gy) * v.s, v.oy + (gx + gy) * v.s * 0.5 - z * v.s];

export function fitView(w: number, h: number): View {
  const s = Math.min(w / (2 * GRID * 1.04), h / (GRID * 1.16));
  return { ox: w / 2, oy: (h - GRID * s) / 2 + 6 * s, s };
}
