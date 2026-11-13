// Dựng thế giới ban đầu của GĐ1: gần trạng thái dừng, xuất phát bình đẳng (gd1 mục 2 và 17).
//
// Cách dựng:
// 1. Tạo ngân hàng, Chính phủ, NHNN.
// 2. Mỗi hộ nhận cùng một lượng của cải (tiền gửi và ít tiền mặt). Hộ nào cũng có cổ phần.
// 3. Doanh nghiệp có sẵn máy và một khoản vay ngân hàng. Tiền vay vượt mức đệm coi như đã chi mua máy từ trước.
// 4. Toàn bộ tiền phát ra lúc dựng được cân lại bằng nợ công: Chính phủ phát hành trái phiếu,
//    ngân hàng mua bằng dự trữ dư, phần còn lại NHNN giữ. Sau bước này vốn NHNN bằng 0.

import type { Engine } from '../../core/engine';
import { addRow, f64 } from '../../core/table';
import { BANK, CB_REF, GOV_REF, ref, type World } from '../../core/world';
import { tx } from '../../ledger/kinds';
import { createLoan, issueBond, MED_DEP, seedCash, seedDeposit, seedReserves, transfer } from '../../ledger/ledger';
import { AGRI, B, bankEquity, F, firmRef, H, hhRef, INDUSTRY, PUBLIC, resetMonth, SERVICES, shuffled, STREAM, UNEMPLOYED, vatRate, type Gd1State } from './schema';

const K_INIT = tx('init');

/** Số đơn vị ban đầu theo số hộ (gd1 mục 2). */
export function initialCounts(n: number): { formal: number; hkd: number; banks: number } {
  return {
    formal: Math.max(6, Math.round(n * (n >= 5000 ? 0.06 : 0.08))),
    hkd: Math.max(8, Math.round(n * 0.18)),
    banks: n >= 5000 ? 10 : n >= 500 ? 4 : 2,
  };
}

const FORMAL_MIX = [0.15, 0.5, 0.35]; // nông nghiệp, công nghiệp, dịch vụ
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
    const salesE = size * aL;
    const ucWage = w0 / aL;
    const ucCap = (delta * capValue + (debt * loanRate) / 12) / salesE;
    const price = (1 + mu0) * (ucWage + ucCap);
    const vat = vatRate(w, eng, sec);
    const priceG = Math.round(price * (1 + vat));
    const inv = sec === SERVICES ? 0 : nu * salesE;
    const firm = addRow(w.tables.firm, {
      bank: i % cnt.banks,
      sector: sec,
      formal: 1,
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
  for (let j = 0; j < nInf; j++) sizeH[j % cnt.hkd]++;
  for (let i = 0; i < cnt.hkd; i++) {
    const sec = sectorByQuota(i, cnt.hkd, HKD_MIX);
    const size = sizeH[i];
    const a = aL * prodH;
    const salesE = size * a;
    const ucWage = wH / a;
    const price = Math.round((1 + mu0) * ucWage);
    const inv = sec === SERVICES ? 0 : nu * salesE;
    const firm = addRow(w.tables.firm, {
      bank: i % cnt.banks,
      sector: sec,
      formal: 0,
      born: -120,
      nTarget: size,
      wage: wH,
      price,
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
      revenue: salesE * price,
      rev12: 12 * salesE * price,
      cell: cnt.formal + i,
    });
    seedCash(w, firmRef(firm), 2 * (size - 1) * wH);
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
  const publicWage = Math.round(w0 * eng.law(w, 'gov.wage.premium'));
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
  const ownersOf = new Int32Array(cnt.formal);
  for (let i = 0; i < n; i++) ownersOf[i % cnt.formal]++;
  for (let i = 0; i < n; i++) addRow(w.tables.share, { kind: 0, entity: i % cnt.formal, owner: i, frac: 1 / ownersOf[i % cnt.formal] });
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
    pHist: [pSector.slice()],
    p0: pSector.slice(),
    basketAcc: [0, 0, 0],
    trust: P('exp.trust0'),
    wageAvg: w0,
    wageAvgAll: (nFormalW * w0 + (nInf - cnt.hkd) * wH) / Math.max(1, nFormalW + nInf - cnt.hkd),
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
}

function dependentsOf(w: World, eng: Engine, i: number): number {
  // phân phối 0-3 người phụ thuộc, trung bình theo tham số
  const mean = eng.param(w, 'hh.dependentsMean');
  const u = ((i * 2654435761) >>> 0) / 4294967296;
  return Math.max(0, Math.min(3, Math.floor(u * 2 * mean + 0.5)));
}
