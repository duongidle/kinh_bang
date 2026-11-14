// Hộ gia đình: kỳ vọng, ngân sách tiêu dùng, đi mua, tiền mặt.
// Quy tắc và nguồn: docs/design/gd1.md mục 4 và 10.

import { accumulate } from '../../causal/causal';
import type { Engine } from '../../core/engine';
import { type World } from '../../core/world';
import { tx } from '../../ledger/kinds';
import { depositCash, MED_CASH, MED_DEP, withdrawCash } from '../../ledger/ledger';
import { sellGoods } from './firms';
import { AGRI, F, firmRef, H, hhRef, INDUSTRY, NSECTOR, NSEG, payFlex, R, SEG_FORMAL, SEG_INF, SERVICES, shuffled, st, STREAM, taxWedge, UNEMPLOYED } from './schema';
import type { Gd1State } from './schema';

const K_CONS = tx('consumption');
const GROUP = 20; // nhóm quen biết: 20 hộ liền nhau

// =====================================================================
// Pha expect: thu nhập kỳ vọng, lạm phát kỳ vọng, niềm tin, ngân sách
// =====================================================================
export function householdBudgets(w: World, eng: Engine): void {
  const h = H(w);
  const s = st(w);
  const a1 = eng.param(w, 'hh.alpha1');
  const a2 = eng.variant(w, 'hh.wealthEffect') === 'off' ? 0 : eng.param(w, 'hh.alpha2');
  const lam = eng.param(w, 'hh.lambdaInc');
  const lamPi = eng.param(w, 'exp.lambdaPi');
  const target = eng.law(w, 'cb.inflation.target');
  const expMode = eng.variant(w, 'exp.inflation');
  const confOn = eng.variant(w, 'exp.confidence') !== 'off';
  const kappa = eng.param(w, 'exp.confKappa');
  const uNorm = eng.param(w, 'exp.confNormal');
  const flight = eng.param(w, 'exp.flight');
  const saveResp = eng.param(w, 'exp.saveResponse');
  const hsOn = eng.param(w, 'hh.inflationLoss');
  const depRate = Math.max(0, eng.law(w, 'cb.rate.refinancing') - eng.param(w, 'bank.depSpread'));
  const foodMin = eng.param(w, 'hh.foodMin');
  const shA = eng.param(w, 'hh.share.agri');
  const shI = eng.param(w, 'hh.share.industry');

  // lạm phát từng ngành, 3 tháng gần nhất quy năm
  const piSec = sectorInflation(s);

  // thất nghiệp theo nhóm quen biết
  const nGroups = Math.ceil(h.n / GROUP);
  const gU = new Float64Array(nGroups);
  const gN = new Float64Array(nGroups);
  for (let i = 0; i < h.n; i++) {
    const g = Math.floor(i / GROUP);
    gN[g]++;
    if (h.employer[i] === UNEMPLOYED) gU[g]++;
  }

  // thu nhập kỳ vọng (Caiani 3.1), và mức bình quân để so từng hộ với mặt bằng chung
  let incAvg = 0;
  for (let i = 0; i < h.n; i++) {
    h.expInc[i] += lam * (h.income[i] - h.expInc[i]);
    incAvg += h.expInc[i];
  }
  incAvg /= Math.max(1, h.n);
  const saveEta = eng.param(w, 'hh.saveIncomeEta');

  for (let i = 0; i < h.n; i++) {

    // lạm phát mà hộ này gặp: theo cơ cấu chi tiêu của chính nó
    const c = h.cons[i];
    let piObs: number;
    if (c > 0) piObs = (h.consS[0][i] * piSec[0] + h.consS[1][i] * piSec[1] + h.consS[2][i] * piSec[2]) / c;
    else piObs = (piSec[0] + piSec[1] + piSec[2]) / 3;
    h.piAdapt[i] += lamPi * (piObs - h.piAdapt[i]);
    let piE = s.trust * target + (1 - s.trust) * h.piAdapt[i];
    if (expMode === 'off') piE = 0;
    else if (expMode === 'anchored') piE = target;

    // niềm tin: tiết kiệm phòng thân khi quanh mình nhiều người mất việc
    let mConf = 1;
    if (confOn) {
      const g = Math.floor(i / GROUP);
      const u = gU[g] / gN[g];
      mConf -= kappa * Math.max(0, u - uNorm);
      if (w.meta.tick - h.lastUnemp[i] < 6) mConf -= 0.05;
      mConf = Math.max(0.7, mConf);
    }
    // chạy khỏi tiền: lạm phát kỳ vọng vượt lãi tiền gửi thì mua sớm
    // và ngược lại: lãi tiền gửi cao hơn lạm phát kỳ vọng thì hoãn mua, gửi tiền (exp.saveResponse; sai-khac.md S8)
    const gapR = piE - depRate;
    const mInfl = Math.max(0.7, Math.min(1.5, 1 + (gapR > 0 ? flight : saveResp) * gapR));

    const wealth = h.cash[i] + h.dep[i];
    // thu nhập thực kiểu Haig-Simons: trừ phần sức mua mà lạm phát kỳ vọng ăn mất của tiền đang giữ (Godley và Lavoie 2007)
    // hộ thu nhập cao hơn mặt bằng thì tiêu phần nhỏ hơn của thu nhập (Dynan, Skinner và Zeldes 2004)
    const a1i = saveEta > 0 && incAvg > 0 ? Math.min(1, a1 * Math.pow(Math.max(0.1, Math.min(10, h.expInc[i] / incAvg)), -saveEta)) : a1;
    const incTerm = a1i * Math.max(0, h.expInc[i] - (hsOn * Math.max(0, piE) * wealth) / 12);
    const wealthTerm = a2 * wealth;
    let budget = incTerm * mConf * mInfl + wealthTerm;
    budget = Math.max(0, Math.min(budget, wealth));

    // phân rã thay đổi ngân sách theo lý do (đổi lần lượt: thu nhập → niềm tin → lạm phát kỳ vọng → của cải)
    const prev = h.budget[i];
    if (w.meta.tick > 0) {
      const i0 = h.bInc[i];
      const c0 = h.mConf[i];
      const f0 = h.mInfl[i];
      accumulate(w, 'cons.budget', 'c_income', (incTerm - i0) * c0 * f0);
      accumulate(w, 'cons.budget', 'c_conf', incTerm * (mConf - c0) * f0);
      accumulate(w, 'cons.budget', 'c_infl', incTerm * mConf * (mInfl - f0));
      accumulate(w, 'cons.budget', 'c_wealth', wealthTerm - h.bWealth[i]);
      const unconstrained = incTerm * mConf * mInfl + wealthTerm;
      const prevUn = i0 * c0 * f0 + h.bWealth[i];
      accumulate(w, 'cons.budget', 'c_cashlimit', budget - unconstrained - (prev - prevUn));
    }
    h.bInc[i] = incTerm;
    h.bWealth[i] = wealthTerm;
    h.mConf[i] = mConf;
    h.mInfl[i] = mInfl;
    h.budget[i] = budget;

    // chia ngân sách: lương thực tối thiểu trước, phần còn lại theo tỷ lệ (quy luật Engel)
    const foodCost = foodMin * s.pSector[AGRI];
    const first = Math.min(budget, foodCost);
    const rest = budget - first;
    h.need[AGRI][i] = first + rest * shA;
    h.need[INDUSTRY][i] = rest * shI;
    h.need[SERVICES][i] = rest * (1 - shA - shI);
    h.cons[i] = 0;
    h.consCash[i] = 0;
    h.consS[0][i] = 0;
    h.consS[1][i] = 0;
    h.consS[2][i] = 0;
  }
}

export function sectorInflation(s: Gd1State): number[] {
  const out = [0, 0, 0];
  const hist = s.pHist;
  if (!hist || hist.length < 2) return out;
  const back = Math.min(3, hist.length - 1);
  const a = hist[hist.length - 1 - back];
  const b = hist[hist.length - 1];
  for (let k = 0; k < NSECTOR; k++) if (a[k] > 0) out[k] = Math.pow(b[k] / a[k], 12 / back) - 1;
  return out;
}

// =====================================================================
// Pha goods: 4 lượt mua
// =====================================================================
// Mỗi ngành có hai loại hàng không thay thế hoàn toàn cho nhau: hàng của hộ kinh doanh (gần nhà, mua lẻ, quen biết,
// cho nợ) và hàng của doanh nghiệp. Hộ chia ngân sách của từng ngành giữa hai loại theo giá mình biết và theo mức sống,
// rồi trong mỗi loại vẫn đi tìm nơi rẻ nhất như cũ. Cơ sở và giới hạn: docs/design/sai-khac.md mục S1.
export function shopping(w: World, eng: Engine): void {
  const h = H(w);
  const f = F(w);
  const s = st(w);
  const order = shuffled(w, STREAM.shopOrder, h.n);
  const perfectInfo = eng.variant(w, 'hh.search') === 'perfect';
  const wedge = [
    [taxWedge(w, eng, 0, false), taxWedge(w, eng, 1, false), taxWedge(w, eng, 2, false)],
    [taxWedge(w, eng, 0, true), taxWedge(w, eng, 1, true), taxWedge(w, eng, 2, true)],
  ];
  const NG = NSECTOR * 2; // nhóm = ngành * 2 + phân khúc

  // danh sách người bán còn sống theo nhóm, và tổng trọng số quy mô để lấy mẫu
  const byGroup: number[][] = Array.from({ length: NG }, () => []);
  for (let i = 0; i < f.n; i++) if (f.alive[i]) byGroup[f.sector[i] * 2 + (f.formal[i] ? SEG_FORMAL : SEG_INF)].push(i);
  const cum: Float64Array[] = byGroup.map((list) => {
    const c = new Float64Array(list.length);
    let acc = 0;
    for (let k = 0; k < list.length; k++) {
      acc += Math.max(1, f.workers[list[k]]);
      c[k] = acc;
    }
    return c;
  });
  const sample = (g: number, u: number): number => {
    const list = byGroup[g];
    if (!list.length) return -1;
    const c = cum[g];
    const x = u * c[c.length - 1];
    let lo = 0;
    let hi = c.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (c[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return list[lo];
  };
  // biến thể "biết giá mọi người bán": danh sách xếp sẵn theo giá
  const sorted = perfectInfo ? byGroup.map((list) => [...list].sort((a, b) => f.priceG[a] - f.priceG[b] || a - b)) : null;

  // --- cập nhật danh sách người bán quen (Lengnick 2.2, Caiani mục 2) ---
  const searchProb = eng.param(w, 'hh.searchProb');
  const eps = eng.param(w, 'hh.epsGoods');
  for (let i = 0; i < h.n; i++) {
    for (let g = 0; g < NG; g++) {
      const base = g * NSEG;
      let worst = -1;
      for (let k = 0; k < NSEG; k++) {
        const col = h.sellers[base + k];
        const c = col[i];
        if (c < 0 || !f.alive[c]) {
          // người bán cũ đã đóng cửa: tìm người khác, tránh trùng
          let cand = sample(g, R(w, STREAM.searchPick, i, base + k));
          for (let q = 0; q < NSEG; q++) if (q !== k && h.sellers[base + q][i] === cand) cand = -1;
          col[i] = cand;
          continue;
        }
        if (worst < 0 || f.priceG[c] > f.priceG[h.sellers[base + worst][i]]) worst = k;
      }
      if (worst >= 0 && R(w, STREAM.search, i, g) < searchProb) {
        const cand = sample(g, R(w, STREAM.searchPick, i, 100 + g));
        const cur = h.sellers[base + worst][i];
        if (cand >= 0 && cur >= 0 && cand !== cur && f.priceG[cand] < f.priceG[cur]) {
          const gap = (f.priceG[cur] - f.priceG[cand]) / f.priceG[cur];
          if (R(w, STREAM.search, i, 10 + g) < 1 - Math.exp(-eps * gap)) {
            let dup = false;
            for (let k = 0; k < NSEG; k++) if (h.sellers[base + k][i] === cand) dup = true;
            if (!dup) h.sellers[base + worst][i] = cand;
          }
        }
      }
    }
  }

  // --- chia ngân sách từng ngành giữa hai phân khúc ---
  const homogeneous = eng.variant(w, 'hh.segments') === 'homogeneous';
  const sigma = homogeneous ? 40 : eng.param(w, 'seg.sigma');
  const eta = homogeneous ? 0 : eng.param(w, 'seg.incomeEta');
  const spill = eng.param(w, 'seg.spill');
  let bSum = 0;
  for (let i = 0; i < h.n; i++) bSum += h.budget[i];
  const bAvg = bSum / Math.max(1, h.n);
  const ref0 = s.budgetAvg > 0 ? s.budgetAvg : bAvg;
  s.budgetAvg = bAvg;
  const need = new Float64Array(h.n * NG); // ngân sách còn lại theo [hộ][nhóm]
  const cheapest = (i: number, g: number): number => {
    if (sorted) return sorted[g].length ? f.priceG[sorted[g][0]] : -1;
    let p = -1;
    for (let k = 0; k < NSEG; k++) {
      const c = h.sellers[g * NSEG + k][i];
      if (c >= 0 && (p < 0 || f.priceG[c] < p)) p = f.priceG[c];
    }
    return p;
  };
  for (let i = 0; i < h.n; i++) {
    const rel = ref0 > 0 ? Math.max(0.2, Math.min(5, h.budget[i] / ref0)) : 1;
    const relF = eta > 0 ? Math.pow(rel, -eta) : 1;
    for (let sec = 0; sec < NSECTOR; sec++) {
      const total = h.need[sec][i];
      const pI = cheapest(i, sec * 2 + SEG_INF);
      const pF = cheapest(i, sec * 2 + SEG_FORMAL);
      let shareInf: number;
      if (pI < 0) shareInf = 0;
      else if (pF < 0) shareInf = 1;
      else {
        const om = homogeneous ? 0.5 : s.omega[sec];
        const odds = (om / (1 - om)) * relF * Math.pow(pI / pF, 1 - sigma);
        shareInf = odds / (1 + odds);
      }
      need[i * NG + sec * 2 + SEG_INF] = total * shareInf;
      need[i * NG + sec * 2 + SEG_FORMAL] = total * (1 - shareInf);
    }
  }

  // --- 4 lượt mua: mỗi lượt, ở mỗi phân khúc, hộ đến người bán rẻ nhất chưa ghé ---
  const visited = new Uint8Array(h.n * NSECTOR); // bitmask NSELL người bán đã ghé
  const done = new Uint8Array(h.n * NG); // phân khúc đã hết nơi để hỏi
  for (let round = 0; round < 4; round++) {
    for (let q = 0; q < h.n; q++) {
      const i = order[q];
      for (let g = 0; g < NG; g++) {
        let want = need[i * NG + g];
        if (want < 1000) continue;
        const sec = g >> 1;
        const seg = g & 1;
        let seller = -1;
        if (sorted) {
          const list = sorted[g];
          for (let k = 0; k < list.length; k++)
            if (f.inv[list[k]] > 0.01) {
              seller = list[k];
              break;
            }
        } else if (!done[i * NG + g]) {
          // ghé lần lượt người bán quen chưa ghé, rẻ nhất trước; nơi nào hết hàng thì sang nơi kế
          const base = g * NSEG;
          for (;;) {
            let bestK = -1;
            const mask = visited[i * NSECTOR + sec];
            for (let k = 0; k < NSEG; k++) {
              if (mask & (1 << (seg * NSEG + k))) continue;
              const c = h.sellers[base + k][i];
              if (c < 0) continue;
              if (bestK < 0 || f.priceG[c] < f.priceG[h.sellers[base + bestK][i]]) bestK = k;
            }
            if (bestK < 0) break;
            visited[i * NSECTOR + sec] = mask | (1 << (seg * NSEG + bestK));
            const c = h.sellers[base + bestK][i];
            if (f.inv[c] > 0.01) {
              seller = c;
              break;
            }
            f.stockout[c] = 1;
            // bị thiếu hàng: có thể bỏ người bán này (Lengnick)
            if (R(w, STREAM.stockoutSwitch, i, g * 8 + round) < 0.25) {
              let cand = sample(g, R(w, STREAM.searchPick, i, 200 + g * 8 + round));
              for (let k = 0; k < NSEG; k++) if (h.sellers[base + k][i] === cand) cand = c;
              h.sellers[base + bestK][i] = cand;
            }
          }
        }
        if (seller < 0) {
          // mọi nơi quen ở phân khúc này đều hết hàng: phần cầu còn lại chuyển sang phân khúc kia, nếu bên đó còn nơi để hỏi
          done[i * NG + g] = 1;
          const other = g ^ 1;
          if (spill > 0 && !done[i * NG + other]) {
            const moved = want * spill;
            need[i * NG + g] -= moved;
            need[i * NG + other] += moved;
            s.m.spill += moved;
          }
          continue;
        }
        const p = f.priceG[seller];
        const funds = h.cash[i] + h.dep[i];
        want = Math.min(want, funds);
        let qty = want / p;
        if (qty > f.inv[seller]) {
          qty = f.inv[seller];
          f.stockout[seller] = 1;
        }
        if (qty * p < 1) continue;
        const formal = seg === SEG_FORMAL;
        const paid = payFlex(w, hhRef(i), firmRef(seller), qty * p, formal ? MED_DEP : MED_CASH, K_CONS);
        if (paid <= 0) continue;
        const got = paid / p;
        sellGoods(f, seller, got, paid, wedge[seg][sec]);
        need[i * NG + g] -= paid;
        h.cons[i] += paid;
        h.consS[sec][i] += paid;
        if (!formal) {
          h.consCash[i] += paid;
          s.m.consInf += paid;
        }
        s.m.consNom[sec] += paid;
        s.m.consReal[sec] += got;
      }
    }
  }
  let unmet = 0;
  for (let i = 0; i < h.n; i++) {
    for (let sec = 0; sec < NSECTOR; sec++) {
      const left = need[i * NG + sec * 2] + need[i * NG + sec * 2 + 1];
      h.need[sec][i] = left;
      unmet += left;
    }
  }
  s.m.unmet = unmet;
}

// =====================================================================
// Pha banking (phần của hộ): giữ tiền mặt theo nhu cầu, đổi ngân hàng
// =====================================================================
export function cashManagement(w: World, eng: Engine): void {
  const h = H(w);
  const f = F(w);
  const k = eng.param(w, 'hh.cashBuffer');
  for (let i = 0; i < h.n; i++) {
    const target = Math.floor(h.consCash[i] * k);
    const d = h.cash[i] - target;
    if (d > 50_000) depositCash(w, hhRef(i), d);
    else if (d < -50_000) withdrawCash(w, hhRef(i), -d);
  }
  // hộ kinh doanh giữ tiền mặt; phần vượt ba tháng lương thì gửi ngân hàng
  for (let i = 0; i < f.n; i++) {
    if (!f.alive[i] || f.formal[i]) continue;
    const keep = Math.max(2_000_000, f.workers[i] * f.wage[i] * 3);
    if (f.cash[i] > keep * 1.5) depositCash(w, firmRef(i), f.cash[i] - keep);
  }
}
