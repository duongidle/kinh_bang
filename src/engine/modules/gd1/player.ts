// Người chơi điều khiển một hộ hoặc một doanh nghiệp (gd1 mục 12).
// Quy tắc tự động vẫn chạy trước; lệnh của người chơi ghi đè lên kết quả, và mức chênh được ghi thành một quyết định
// có mã lý do riêng, để chuỗi nhân quả thấy được bàn tay người chơi.

import { accumulate, recordDecision } from '../../causal/causal';
import type { Engine } from '../../core/engine';
import type { World } from '../../core/world';
import { capacityWorkers, setEmployer, startSolo } from './firms';
import { AGRI, F, firmRef, H, INDUSTRY, minWageOf, SERVICES, st, taxWedge, UNEMPLOYED } from './schema';

export interface PlayerState {
  hh: number; // -1 không điều khiển
  firm: number;
  // lệnh đứng: null là để quy tắc tự lái
  hhBudget: number | null; // ngân sách tiêu dùng tháng (đồng)
  hhResWage: number | null; // lương thấp nhất chịu nhận
  hhQuit: boolean; // lệnh một lần
  hhOpenBiz: boolean; // lệnh một lần
  firmPrice: number | null; // giá bán gồm thuế
  firmWage: number | null;
  firmWorkers: number | null;
  firmInvest: number | null; // số máy định mua
  // phương án của quy tắc tự động ở tháng gần nhất, để người chơi so
  auto: { budget: number; price: number; wage: number; workers: number; invest: number };
}

export function playerOf(w: World): PlayerState {
  const s = st(w) as unknown as { player?: PlayerState };
  return (s.player ??= {
    hh: -1,
    firm: -1,
    hhBudget: null,
    hhResWage: null,
    hhQuit: false,
    hhOpenBiz: false,
    firmPrice: null,
    firmWage: null,
    firmWorkers: null,
    firmInvest: null,
    auto: { budget: 0, price: 0, wage: 0, workers: 0, invest: 0 },
  });
}

/** Sau khi quy tắc tính ngân sách của mọi hộ. */
export function playerHousehold(w: World, eng: Engine): void {
  const p = playerOf(w);
  const i = p.hh;
  if (i < 0) return;
  const h = H(w);
  const s = st(w);
  p.auto.budget = h.budget[i];
  if (p.hhResWage !== null) h.resWage[i] = Math.max(0, p.hhResWage);
  if (p.hhQuit) {
    p.hhQuit = false;
    const e = h.employer[i];
    if (e !== UNEMPLOYED && h.ownBiz[i] < 0) setEmployer(w, i, UNEMPLOYED, 0, 'u_quit');
  }
  if (p.hhOpenBiz) {
    p.hhOpenBiz = false;
    if (h.ownBiz[i] < 0) {
      if (h.employer[i] !== UNEMPLOYED) setEmployer(w, i, UNEMPLOYED, 0, 'u_quit');
      startSolo(w, eng, i);
    }
  }
  if (p.hhBudget !== null) {
    const wealth = h.cash[i] + h.dep[i];
    const budget = Math.max(0, Math.min(p.hhBudget, wealth));
    accumulate(w, 'cons.budget', 'c_player', budget - h.budget[i]);
    h.budget[i] = budget;
    const foodCost = eng.param(w, 'hh.foodMin') * s.pSector[AGRI];
    const first = Math.min(budget, foodCost);
    const rest = budget - first;
    const shA = eng.param(w, 'hh.share.agri');
    const shI = eng.param(w, 'hh.share.industry');
    h.need[AGRI][i] = first + rest * shA;
    h.need[INDUSTRY][i] = rest * shI;
    h.need[SERVICES][i] = rest * (1 - shA - shI);
  }
}

/** Sau khi quy tắc lập kế hoạch cho mọi doanh nghiệp. */
export function playerFirm(w: World, eng: Engine): void {
  const p = playerOf(w);
  const i = p.firm;
  if (i < 0) return;
  const f = F(w);
  if (!f.alive[i]) {
    p.firm = -1;
    return;
  }
  p.auto.price = f.priceG[i];
  p.auto.wage = f.wage[i];
  p.auto.workers = f.nTarget[i];
  p.auto.invest = f.iPlan[i];
  if (p.firmWage !== null && !f.solo[i]) {
    let w1 = Math.round(Math.max(0, p.firmWage));
    if (f.formal[i]) w1 = Math.max(w1, minWageOf(w, eng, f.zone[i]));
    if (w1 !== f.wage[i]) {
      recordDecision(w, firmRef(i), 'firm.wage', 'wage', f.wage[i], w1, [{ reason: 'w_player', amount: w1 - f.wage[i] }], f.workers[i]);
      f.wage[i] = w1;
    }
  }
  if (p.firmPrice !== null) {
    const pG = Math.max(1, Math.round(p.firmPrice));
    if (pG !== f.priceG[i]) {
      const wedge = taxWedge(w, eng, f.sector[i], f.formal[i] === 1);
      recordDecision(w, firmRef(i), 'firm.price', 'priceG', f.priceG[i], pG, [{ reason: 'p_player', amount: pG - f.priceG[i] }], f.sales[i]);
      f.priceG[i] = pG;
      f.price[i] = pG / (1 + wedge);
    }
  }
  if (p.firmWorkers !== null) {
    const cap = capacityWorkers(w, eng, f, i);
    f.nTarget[i] = Math.max(f.formal[i] ? 0 : 1, Math.min(Math.round(p.firmWorkers), Math.max(1, Math.floor(cap))));
  }
  if (p.firmInvest !== null && f.formal[i]) f.iPlan[i] = Math.max(0, p.firmInvest);
}
