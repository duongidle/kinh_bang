// Dựng thế giới ban đầu của GĐ1: gần trạng thái dừng, xuất phát bình đẳng (gd1 mục 2 và 17).
//
// Cách dựng:
// 1. Tạo ngân hàng, Chính phủ, NHNN.
// 2. Mỗi hộ nhận cùng một lượng của cải (tiền gửi và ít tiền mặt). Hộ nào cũng có cổ phần.
// 3. Doanh nghiệp có sẵn máy và một khoản vay ngân hàng. Tiền vay vượt mức đệm coi như đã chi mua máy từ trước.
// 4. Toàn bộ tiền phát ra lúc dựng được cân lại bằng nợ công: Chính phủ phát hành trái phiếu,
//    ngân hàng mua bằng dự trữ dư, phần còn lại NHNN giữ. Sau bước này vốn NHNN bằng 0.

import { pickNamed } from './names';
import type { Engine } from '../../core/engine';
import { addRow, f64 } from '../../core/table';
import { BANK, CB_REF, GOV_REF, ref, type World } from '../../core/world';
import { tx } from '../../ledger/kinds';
import { createLoan, issueBond, MED_DEP, seedCash, seedDeposit, seedReserves, transfer } from '../../ledger/ledger';
import { GOV_MIX } from './gov';
import { AGRI, B, bankEquity, F, firmRef, H, hhRef, INDUSTRY, NSECTOR, PUBLIC, resetMonth, SECTOR_KEY, SERVICES, shuffled, STREAM, taxWedge, UNEMPLOYED, type Gd1State } from './schema';

const K_INIT = tx('init');

/** Số đơn vị ban đầu theo số hộ (gd1 mục 2). */
export function initialCounts(n: number): { formal: number; hkd: number; banks: number } {
  return {
    formal: Math.max(6, Math.round(n * (n >= 5000 ? 0.06 : 0.08))),
    hkd: Math.max(8, Math.round(n * 0.18)),
    banks: n >= 5000 ? 10 : n >= 500 ? 4 : 2,
  };
}

// Hộ kinh doanh chia theo ngành lúc đầu: nông nghiệp, công nghiệp, dịch vụ. Doanh nghiệp nhận phần cầu còn lại của mỗi ngành.
const HKD_MIX = [0.5, 0.15, 0.35];

function sectorByQuota(i: number, n: number, mix: number[]): number {
  const x = (i + 0.5) / n;
  return x < mix[0] ? AGRI : x < mix[0] + mix[1] ? INDUSTRY : SERVICES;
}

export function initWorld(w: World, eng: Engine): void {
  const n = w.meta.nHouseholds;
  const cnt = initialCounts(n);
  const P = (id: string) => eng.param(w, id);
  const aL = P('firm.aL');
  const w0 = P('firm.wage0');
  const mu0 = P('firm.markup0');
  const nu = P('firm.nu');
  const delta = P('firm.depreciation');
  const uBar = P('firm.uBar');
  const prodH = P('hkd.productivity');
  const wH = Math.round(w0 * P('hkd.wageRatio'));
  const rRef = eng.law(w, 'cb.rate.refinancing');
  const loanRate = rRef + P('bank.margin0') + P('bank.riskPremium') * P('firm.initLeverage');

  // ---------- 1. ngân hàng, Chính phủ, NHNN ----------
  const nState = Math.ceil(cnt.banks * P('bank.stateShare'));
  for (let k = 0; k < cnt.banks; k++) addRow(w.tables.bank, { stateOwned: k < nState ? 1 : 0, margin: P('bank.margin0'), cell: k });
  addRow(w.tables.gov);
  addRow(w.tables.cb);

  // ---------- 2. chia vai cho hộ ----------
  const nPublic = Math.max(1, Math.round(n * eng.law(w, 'gov.public.share')));
  const nUnemp = Math.round(n * P('init.unemployment'));
  const nFormalW = Math.max(cnt.formal, Math.round(n * P('init.formalShare')));
  const nInf = n - nPublic - nUnemp - nFormalW;
  if (nInf < cnt.hkd) throw new Error('Khởi tạo: không đủ người cho khu vực phi chính thức');
  const order = shuffled(w, STREAM.init, n); // trộn để các nhóm quen biết có đủ mọi kiểu người
  for (let i = 0; i < n; i++) addRow(w.tables.hh, { bank: i % cnt.banks, cell: i, dependents: dependentsOf(w, eng, i) });

  // ---------- 3. doanh nghiệp chính thức ----------
  // giá máy ban đầu: giá chưa thuế của hàng công nghiệp, ước lượng một vòng
  const pK = Math.round((1 + mu0) * (w0 / aL) * 1.08);

  // Cơ cấu ngành lúc đầu: tính cầu của hộ, Chính phủ và đầu tư theo từng ngành rồi chia người làm cho khớp,
  // để tháng đầu không ngành nào thừa hay thiếu hàng. Phần hộ kinh doanh theo HKD_MIX; doanh nghiệp nhận phần còn lại.
  const kap = SECTOR_KEY.map((k) => eng.param(w, `firm.kappa.${k}`));
  const pFg: number[] = [];
  const pIg: number[] = [];
  for (let k = 0; k < NSECTOR; k++) {
    const capW = (kap[k] / uBar) * pK; // vốn cố định mỗi lao động
    const ucCap = (delta * capW + (capW * P('firm.initLeverage') * loanRate) / 12) / aL;
    pFg.push((1 + mu0) * (w0 / aL + ucCap) * (1 + taxWedge(w, eng, k, true)));
    pIg.push(Math.round((1 + mu0) * (wH / (aL * prodH))) * (1 + taxWedge(w, eng, k, false)));
  }
  const publicWage0 = Math.round(w0 * eng.law(w, 'gov.wage.premium'));
  const nuS = P('firm.nuServices');
  const SF = nFormalW * aL;
  const nSolo = Math.max(0, Math.min(nInf - 2 * cnt.hkd, Math.round(nInf * P('init.soloShare'))));
  const nHkdW = nInf - nSolo;
  const aSolo = aL * P('hkd.soloProductivity');
  const soloUtil = P('init.soloUtil');
  const SI = nHkdW * aL * prodH + nSolo * aSolo * soloUtil;
  const pFavg = (pFg[0] + pFg[1] + pFg[2]) / 3;
  const pIavg = HKD_MIX[0] * pIg[0] + HKD_MIX[1] * pIg[1] + HKD_MIX[2] * pIg[2];
  const gdpEst = SF * pFavg + SI * pIavg + nPublic * publicWage0;
  const govV = eng.law(w, 'gov.purchase.share') * gdpEst;
  const invU = nFormalW * ((kap[0] + kap[1] + kap[2]) / 3 / uBar) * delta; // máy thay thế mỗi tháng
  const hhV = Math.max(0, SF * pFavg + SI * pIavg - govV - invU * pK);
  const food0 = Math.min(hhV, n * P('hh.foodMin') * pIg[AGRI]);
  const rest0 = hhV - food0;
  const shA0 = P('hh.share.agri');
  const shI0 = P('hh.share.industry');
  const demV = [food0 + rest0 * shA0, rest0 * shI0, rest0 * (1 - shA0 - shI0)]; // cầu của hộ theo ngành, đồng
  const infV = [0, 0, 0];
  {
    // phần của hộ kinh doanh ở mỗi ngành không quá 85% cầu của hộ; phần vượt chia cho ngành còn chỗ
    let left = SI * pIavg;
    const open = [true, true, true];
    for (let pass = 0; pass < 3 && left > 1; pass++) {
      let wsum = 0;
      for (let k = 0; k < NSECTOR; k++) if (open[k]) wsum += HKD_MIX[k];
      if (wsum <= 0) break;
      const give = left;
      for (let k = 0; k < NSECTOR; k++) {
        if (!open[k]) continue;
        const add = Math.min((give * HKD_MIX[k]) / wsum, 0.85 * demV[k] - infV[k]);
        infV[k] += add;
        left -= add;
        if (infV[k] >= 0.85 * demV[k] - 1) open[k] = false;
      }
    }
  }
  const waste = [1, 1, 1 + nuS]; // dịch vụ phải làm dư mới bán đủ
  const infU = infV.map((v, k) => (v / pIg[k]) * waste[k]);
  const forU = demV.map((v, k) => (Math.max(0, v - infV[k]) / pFg[k] + (govV * GOV_MIX[k]) / pFg[k] + (k === INDUSTRY ? invU : 0)) * waste[k]);
  const sumI = infU[0] + infU[1] + infU[2];
  const sumF = forU[0] + forU[1] + forU[2];
  const hkdMix = infU.map((x) => x / sumI);
  const FORMAL_MIX = forU.map((x) => x / sumF);
  // Trọng số sở thích hàng phi chính thức theo ngành: chọn để ở giá ban đầu hộ chia chi tiêu đúng như cơ cấu này
  // (cách hiệu chỉnh trọng số CES quen thuộc: lấy theo tỷ trọng năm gốc).
  const sigma = P('seg.sigma');
  const omega = demV.map((v, k) => {
    const sV = Math.max(0.02, Math.min(0.98, v > 0 ? infV[k] / v : 0.5));
    const odds = (sV / (1 - sV)) * Math.pow(pIg[k] / pFg[k], sigma - 1);
    return odds / (1 + odds);
  });

  const soeEvery = P('init.soeShare') > 0 ? Math.max(1, Math.round(1 / P('init.soeShare'))) : 0;
  const sizeF = new Int32Array(cnt.formal);
  for (let j = 0; j < nFormalW; j++) sizeF[j % cnt.formal]++;
  let gdp0 = 0;
  for (let i = 0; i < cnt.formal; i++) {
    const sec = sectorByQuota(i, cnt.formal, FORMAL_MIX);
    const size = sizeF[i];
    const kappa = eng.param(w, `firm.kappa.${['agri', 'industry', 'services'][sec]}`);
    const K = (kappa * size) / uBar;
    const capValue = Math.round(K * pK);
    const debt = Math.round(capValue * P('firm.initLeverage'));
    const salesE = (size * aL) / (sec === SERVICES ? 1 + nuS : 1); // dịch vụ làm dư một ít so với doanh số kỳ vọng
    const ucWage = w0 / aL;
    const ucCap = (delta * capValue + (debt * loanRate) / 12) / (size * aL); // theo sản lượng ở công suất bình thường
    const price = (1 + mu0) * (ucWage + ucCap);
    const vat = taxWedge(w, eng, sec, true);
    const priceG = Math.round(price * (1 + vat));
    const inv = sec === SERVICES ? 0 : nu * salesE;
    const firm = addRow(w.tables.firm, {
      bank: i % cnt.banks,
      sector: sec,
      formal: 1,
      stateOwned: soeEvery > 0 && i % soeEvery === soeEvery - 1 ? 1 : 0,
      zone: (i % 4) + 1,
      born: -120,
      nTarget: size,
      wage: w0,
      price,
      priceG,
      pricePrev: priceG,
      markup: mu0,
      uc: ucWage + ucCap,
      ucWage,
      ucCap,
      inv,
      invValue: Math.round(inv * ucWage),
      K,
      capValue,
      salesE,
      sales: salesE,
      salesPrev: salesE,
      output: salesE,
      revenue: salesE * price,
      rev12: 12 * salesE * price,
      ocf: salesE * price - size * w0 - (debt * loanRate) / 12,
      util: uBar,
      lastRate: loanRate,
      cell: i,
    });
    // khoản vay sẵn có, kỳ hạn còn lại so le để nợ không đáo hạn cùng lúc
    createLoan(w, firm % cnt.banks, firmRef(firm), debt, { rate: loanRate, months: 48 + ((i * 7) % 37), kind: 1 });
    // giữ đệm hai tháng lương; phần còn lại coi như đã trả cho người bán máy từ trước
    const keep = 2 * size * w0;
    const fd = f64(w.tables.firm, 'dep');
    if (fd[firm] > keep) transfer(w, firmRef(firm), GOV_REF, fd[firm] - keep, MED_DEP, K_INIT);
    else seedDeposit(w, firmRef(firm), keep - fd[firm]);
    gdp0 += salesE * priceG;
  }

  // ---------- 4. hộ kinh doanh ----------
  const sizeH = new Int32Array(cnt.hkd);
  for (let j = 0; j < nHkdW; j++) sizeH[j % cnt.hkd]++;
  for (let i = 0; i < cnt.hkd; i++) {
    const sec = sectorByQuota(i, cnt.hkd, hkdMix);
    const size = sizeH[i];
    const a = aL * prodH;
    const salesE = (size * a) / (sec === SERVICES ? 1 + nuS : 1);
    const ucWage = wH / a;
    const priceNet = (1 + mu0) * ucWage;
    const price = Math.round(priceNet * (1 + taxWedge(w, eng, sec, false)));
    const inv = sec === SERVICES ? 0 : nu * salesE;
    const firm = addRow(w.tables.firm, {
      bank: i % cnt.banks,
      sector: sec,
      formal: 0,
      born: -120,
      nTarget: size,
      wage: wH,
      price: priceNet,
      priceG: price,
      pricePrev: price,
      markup: mu0,
      uc: ucWage,
      ucWage,
      inv,
      invValue: Math.round(inv * ucWage * ((size - 1) / size)),
      salesE,
      sales: salesE,
      salesPrev: salesE,
      output: salesE,
      revenue: salesE * priceNet,
      rev12: 12 * salesE * priceNet,
      cell: cnt.formal + i,
    });
    seedCash(w, firmRef(firm), 2 * (size - 1) * wH);
    gdp0 += salesE * price;
  }

  // ---------- 4b. người tự làm một mình: lực lượng dự trữ của thị trường lao động ----------
  const soloBiz: number[] = [];
  for (let i = 0; i < nSolo; i++) {
    const sec = sectorByQuota(i, nSolo, hkdMix);
    const salesE = (aSolo * soloUtil) / (sec === SERVICES ? 1 + nuS : 1);
    const priceNet = (1 + mu0) * (wH / (aL * prodH)); // bán theo giá của hộ kinh doanh quanh mình
    const price = Math.round(priceNet * (1 + taxWedge(w, eng, sec, false)));
    const inv = sec === SERVICES ? 0 : nu * salesE;
    soloBiz.push(
      addRow(w.tables.firm, {
        bank: i % cnt.banks,
        sector: sec,
        formal: 0,
        solo: 1,
        born: -120,
        nTarget: 1,
        wage: 0,
        price: priceNet,
        priceG: price,
        pricePrev: price,
        markup: Math.max(0, priceNet / (wH / aSolo) - 1),
        uc: wH / aSolo,
        ucWage: wH / aSolo,
        inv,
        salesE,
        sales: salesE,
        salesPrev: salesE,
        output: salesE,
        revenue: salesE * priceNet,
        rev12: 12 * salesE * priceNet,
        cell: cnt.formal + cnt.hkd + i,
      }),
    );
    gdp0 += salesE * price;
  }

  // ---------- 5. gán việc ----------
  const h = H(w);
  const f = F(w);
  let q = 0;
  const take = () => order[q++];
  // chủ hộ kinh doanh, rồi người làm thuê cho hộ kinh doanh
  for (let i = 0; i < cnt.hkd; i++) {
    const biz = cnt.formal + i;
    const o = take();
    f.owner[biz] = o;
    h.ownBiz[o] = biz;
    h.employer[o] = biz;
    f.workers[biz] = 1;
  }
  for (const biz of soloBiz) {
    const o = take();
    f.owner[biz] = o;
    h.ownBiz[o] = biz;
    h.employer[o] = biz;
    f.workers[biz] = 1;
  }
  for (let i = 0; i < cnt.hkd; i++) {
    const biz = cnt.formal + i;
    for (let k = 1; k < sizeH[i]; k++) {
      const x = take();
      h.employer[x] = biz;
      h.wage[x] = wH;
      f.workers[biz]++;
    }
  }
  for (let i = 0; i < cnt.formal; i++)
    for (let k = 0; k < sizeF[i]; k++) {
      const x = take();
      h.employer[x] = i;
      h.wage[x] = w0;
      f.workers[i]++;
    }
  const publicWage = publicWage0;
  for (let k = 0; k < nPublic; k++) {
    const x = take();
    h.employer[x] = PUBLIC;
    h.wage[x] = publicWage;
  }
  while (q < n) h.employer[take()] = UNEMPLOYED;
  gdp0 += nPublic * publicWage;

  // ---------- 6. của cải và thu nhập kỳ vọng của hộ ----------
  // thu nhập ban đầu ước lượng: lương, hoặc phần còn lại của hộ kinh doanh sau khi trả lương
  const income0 = new Float64Array(n);
  let incomeSum = 0;
  for (let i = 0; i < n; i++) {
    const e = h.employer[i];
    let inc = 0;
    if (e === PUBLIC) inc = publicWage;
    else if (e >= 0 && h.ownBiz[i] === e) inc = f.revenue[e] - (f.workers[e] - 1) * wH;
    else if (e >= 0) inc = h.wage[i];
    income0[i] = inc;
    incomeSum += inc;
  }
  const wealth = Math.round((P('init.wealthMonths') * incomeSum) / n);
  const target = eng.law(w, 'cb.inflation.target');
  const equal = P('init.equal') >= 0.5;
  for (let i = 0; i < n; i++) {
    const mine = equal ? wealth : Math.round(P('init.wealthMonths') * Math.max(income0[i], 0.5 * wH));
    // tiền mặt cầm sẵn: khoảng nửa tháng chi tiêu, vì hơn nửa hàng hoá mua ở hộ kinh doanh bằng tiền mặt
    const cash = Math.min(mine, Math.round(0.55 * (P('hh.alpha1') * (income0[i] > 0 ? income0[i] : 0.3 * wH) + P('hh.alpha2') * mine)));
    seedCash(w, hhRef(i), cash);
    seedDeposit(w, hhRef(i), mine - cash);
    h.expInc[i] = income0[i] > 0 ? income0[i] : 0.3 * wH;
    h.income[i] = h.expInc[i];
    h.resWage[i] = income0[i] > 0 ? income0[i] : wH;
    h.piAdapt[i] = target;
    h.budget[i] = P('hh.alpha1') * h.expInc[i] + P('hh.alpha2') * mine;
    h.bInc[i] = P('hh.alpha1') * h.expInc[i];
    h.bWealth[i] = P('hh.alpha2') * mine;
    h.consCash[i] = cash;
  }

  // ---------- 7. cổ phần: mỗi hộ có phần ở một doanh nghiệp và một ngân hàng tư nhân ----------
  // doanh nghiệp nhà nước không có cổ đông là hộ; cổ tức của nó về ngân sách
  const priv: number[] = [];
  for (let i = 0; i < cnt.formal; i++) if (!f.stateOwned[i]) priv.push(i);
  const ownersOf = new Int32Array(priv.length);
  for (let i = 0; i < n; i++) ownersOf[i % priv.length]++;
  for (let i = 0; i < n; i++) addRow(w.tables.share, { kind: 0, entity: priv[i % priv.length], owner: i, frac: 1 / ownersOf[i % priv.length] });
  const nPriv = cnt.banks - nState;
  if (nPriv > 0) {
    const ob = new Int32Array(nPriv);
    for (let i = 0; i < n; i++) ob[i % nPriv]++;
    for (let i = 0; i < n; i++) addRow(w.tables.share, { kind: 1, entity: nState + (i % nPriv), owner: i, frac: 1 / ob[i % nPriv] });
  }

  // ---------- 8. vốn ngân hàng ----------
  const b = B(w);
  for (let k = 0; k < cnt.banks; k++) seedReserves(w, k, Math.max(50e6, 0.2 * b.loans[k]) - bankEquity(b, k));

  // ---------- 9. nợ công cân lại toàn bộ tiền đã phát ----------
  const cbEq = f64(w.tables.cb, 'equity');
  const tga = f64(w.tables.gov, 'tga');
  const buffer = Math.round(0.02 * gdp0 * 12); // kho bạc giữ sẵn khoảng một tuần GDP
  const D = Math.max(0, -cbEq[0] - tga[0]) + buffer;
  const rr = eng.law(w, 'cb.reserve.ratio');
  const bondRate = rRef + eng.law(w, 'gov.bond.spread');
  const excess = new Float64Array(cnt.banks);
  let exTotal = 0;
  for (let k = 0; k < cnt.banks; k++) {
    excess[k] = Math.max(0, b.reserves[k] - 1.1 * rr * b.depLiab[k]);
    exTotal += excess[k];
  }
  const TR = 60; // 60 lô, mỗi tháng một lô đáo hạn
  const toBanks = Math.min(D, exTotal);
  for (let m = 1; m <= TR; m++) {
    if (exTotal > 0) for (let k = 0; k < cnt.banks; k++) issueBond(w, ref(BANK, k), (toBanks * excess[k]) / exTotal / TR, bondRate, m);
    if (D > toBanks) issueBond(w, CB_REF, (D - toBanks) / TR, bondRate, m);
  }
  // Chính phủ chuyển phần tiền này về NHNN để vốn NHNN về 0: tiền đã phát lúc dựng thế giới giờ là nợ công.
  if (cbEq[0] < 0) transfer(w, GOV_REF, CB_REF, -cbEq[0], MED_DEP, K_INIT, 0, true);
  for (let k = 0; k < cnt.banks; k++) {
    b.loansYearStart[k] = b.loans[k];
    b.equityStart[k] = bankEquity(b, k);
  }

  // ---------- 10. trạng thái module ----------
  const pSum = [0, 0, 0];
  const qSum = [0, 0, 0];
  let invTotal = 0;
  for (let i = 0; i < f.n; i++) {
    pSum[f.sector[i]] += f.priceG[i] * f.salesE[i];
    qSum[f.sector[i]] += f.salesE[i];
    invTotal += f.invValue[i];
  }
  const pSector = pSum.map((x, k) => (qSum[k] > 0 ? x / qSum[k] : 100_000));
  // rổ hàng ban đầu của một hộ: theo quy tắc chia ngân sách ở mức chi tiêu bình quân
  const avgBudget = incomeSum / n;
  const food = P('hh.foodMin') * pSector[AGRI];
  const rest = Math.max(0, avgBudget - food);
  const shA = P('hh.share.agri');
  const shI = P('hh.share.industry');
  const cpiBase = [(food + rest * shA) / pSector[AGRI], (rest * shI) / pSector[INDUSTRY], (rest * (1 - shA - shI)) / pSector[SERVICES]];

  // tỷ suất lợi nhuận bình thường = mức ở trạng thái khởi tạo (Caiani hiệu chỉnh r̄ theo trạng thái dừng của chính mô hình)
  let ocfSum = 0;
  let capSum = 0;
  for (let i = 0; i < cnt.formal; i++) {
    ocfSum += f.ocf[i];
    capSum += f.capValue[i];
  }
  if (capSum > 0 && w.params['firm.rBar'] === eng.paramDefs.get('firm.rBar')!.value) w.params['firm.rBar'] = ocfSum / capSum;

  const s: Gd1State = {
    cpi: 100,
    cpiBase,
    pSector,
    pSectorPrev: pSector.slice(),
    cpiHist: [100],
    cpiPrev: 100,
    balHist: [],
    gdpHist: [],
    cpiTaxBase: 100,
    omega,
    pSeg: [pIg.slice(), pFg.slice()],
    pK,
    budgetAvg: 0,
    pHist: [pSector.slice()],
    p0: pSector.slice(),
    basketAcc: [0, 0, 0],
    trust: P('exp.trust0'),
    wageAvg: w0,
    wageAvgAll: (nFormalW * w0 + (nHkdW - cnt.hkd) * wH) / Math.max(1, nFormalW + nHkdW - cnt.hkd),
    wageRef: w0,
    wageInf: wH,
    publicWage,
    publicWage0: publicWage,
    gdpEma: gdp0,
    gdpReal: gdp0,
    invTotal,
    invTotalPrev: invTotal,
    salesReal: [0, 0, 0],
    unemp: nUnemp / n,
    govArrears: 0,
    purchaseBudget: 0,
    nPublic,
    m: null as never,
    names: [],
    news: [],
    basketYear: 0,
    prev: {},
  };
  resetMonth(s);
  w.ext.gd1 = s;
  pickNamed(w);
}

function dependentsOf(w: World, eng: Engine, i: number): number {
  // phân phối 0-3 người phụ thuộc, trung bình theo tham số
  const mean = eng.param(w, 'hh.dependentsMean');
  const u = ((i * 2654435761) >>> 0) / 4294967296;
  return Math.max(0, Math.min(3, Math.floor(u * 2 * mean + 0.5)));
}
