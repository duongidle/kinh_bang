// Vài hộ và doanh nghiệp có tên, được theo suốt ván (đề xuất S8). Chọn tất định từ trạng thái khởi tạo.

import { i32 } from '../../core/table';
import type { World } from '../../core/world';
import { F, H, PUBLIC, SECTOR_NAME, st, UNEMPLOYED } from './schema';

const TRADE = [
  ['trồng lúa', 'trồng rau', 'nuôi cá'],
  ['may mặc', 'làm đồ gỗ', 'cơ khí'],
  ['bán phở', 'cắt tóc', 'chạy xe ôm', 'bán tạp hoá'],
];

export function pickNamed(w: World): void {
  const h = H(w);
  const f = F(w);
  const s = st(w);
  const hNamed = i32(h.t, 'named');
  const fNamed = i32(f.t, 'named');
  const add = (kind: 'hh' | 'firm', id: number, name: string, story: string) => {
    if (id < 0) return;
    const col = kind === 'hh' ? hNamed : fNamed;
    if (col[id] >= 0) return;
    col[id] = s.names.length;
    s.names.push({ kind, id, name, story });
  };
  const firstHh = (ok: (i: number) => boolean): number => {
    // bỏ qua vài hộ đầu để các hộ có tên không dồn về một doanh nghiệp
    for (let k = 0; k < h.n; k++) {
      const i = (k * 7 + 3) % h.n;
      if (hNamed[i] < 0 && ok(i)) return i;
    }
    return -1;
  };
  add('hh', firstHh((i) => h.employer[i] === PUBLIC), 'Cô Hạnh', 'Giáo viên, hưởng lương Nhà nước.');
  add('hh', firstHh((i) => h.employer[i] >= 0 && f.formal[h.employer[i]] === 1), 'Anh Tuấn', 'Công nhân ở một doanh nghiệp, lương trả qua tài khoản.');
  add('hh', firstHh((i) => h.employer[i] >= 0 && !f.formal[h.employer[i]] && h.ownBiz[i] < 0), 'Chị Mai', 'Làm thuê cho một hộ kinh doanh, lương trả bằng tiền mặt.');
  const owner = firstHh((i) => h.ownBiz[i] >= 0 && !f.solo[h.ownBiz[i]]);
  if (owner >= 0) add('hh', owner, 'Chị Lan', `Chủ hộ kinh doanh ${TRADE[f.sector[h.ownBiz[owner]]][owner % 3]}, có thuê người.`);
  const solo = firstHh((i) => h.ownBiz[i] >= 0 && f.solo[h.ownBiz[i]] === 1);
  if (solo >= 0) add('hh', solo, 'Bác Tư', `Tự làm một mình, ${TRADE[f.sector[h.ownBiz[solo]]][solo % 3]}.`);
  add('hh', firstHh((i) => h.employer[i] === UNEMPLOYED), 'Em Dũng', 'Đang tìm việc.');
  // doanh nghiệp đông người nhất và một doanh nghiệp nhỏ
  let big = -1;
  let small = -1;
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || !f.formal[i]) continue;
    if (big < 0 || f.workers[i] > f.workers[big]) big = i;
    if (small < 0 || f.workers[i] < f.workers[small]) small = i;
  }
  if (big >= 0) add('firm', big, 'Công ty Sao Mai', `Doanh nghiệp ${SECTOR_NAME[f.sector[big]].toLowerCase()} đông người nhất lúc đầu.`);
  if (small >= 0 && small !== big) add('firm', small, 'Xưởng Bình An', `Doanh nghiệp ${SECTOR_NAME[f.sector[small]].toLowerCase()} nhỏ, ít vốn.`);
  if (owner >= 0) add('firm', h.ownBiz[owner], 'Quán chị Lan', 'Hộ kinh doanh của chị Lan.');
}
