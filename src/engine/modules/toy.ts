// Nền kinh tế đồ chơi (gd0 mục 9). Không có kinh tế học thật; chỉ để chạy thử khung và làm đồ gá test.
// Hộ nhận lương cố định, tiêu 90% thu nhập tháng trước; doanh nghiệp bán giá cố định;
// một ngân hàng giữ tiền gửi; Chính phủ trả lương công chức, thu thuế phẳng, thiếu thì NHNN mua trái phiếu.

import { accumulate, recordDecision, takeAcc } from '../causal/causal';
import type { Engine, EngineModule } from '../core/engine';
import { rand, streamId } from '../core/rng';
import { addColumns, addRow, f64, i32 } from '../core/table';
import { CB_REF, FIRM, GOV_REF, HH, ref, type World } from '../core/world';
import { tx } from '../ledger/kinds';
import { issueBond, MED_DEP, seedDeposit, seedReserves, transfer } from '../ledger/ledger';

const S_SHOP = streamId('toy.shop');
const PUBLIC = -2;

export const toyModule: EngineModule = {
  id: 'toy',
  stage: 0,
  dependsOn: [],
  schemaVersion: 1,
  params: [
    { id: 'toy.wage', value: 6_000_000, label: 'Lương tháng', source: 'đồ chơi' },
    { id: 'toy.propensity', value: 0.9, label: 'Tỷ lệ tiêu dùng', source: 'đồ chơi' },
    { id: 'toy.tax', value: 0.1, label: 'Thuế phẳng', source: 'đồ chơi' },
  ],
  rules: [
    {
      id: 'toy.consume',
      label: 'Hộ tiêu một tỷ lệ thu nhập',
      source: 'đồ chơi',
      variants: [
        { id: 'base', label: 'Tiêu 90%' },
        { id: 'all', label: 'Tiêu hết' },
      ],
    },
  ],
  reasons: [
    { id: 'toy_public_income', label: 'thu nhập của công chức đổi', upstream: [{ kind: 'law', id: 'gov.wage.premium' }] },
    { id: 'toy_private_income', label: 'thu nhập của người làm doanh nghiệp đổi', upstream: [{ kind: 'indicator', id: 'toy.consumption', lag: 1 }] },
  ],
  setup(w) {
    addColumns(w.tables.hh, [
      { name: 'employer', type: 'i32', def: -1 },
      { name: 'income', type: 'f64' },
      { name: 'cell', type: 'i32' },
    ]);
    addColumns(w.tables.firm, [
      { name: 'sales', type: 'f64' },
      { name: 'cell', type: 'i32' },
    ]);
  },
  init(w, eng) {
    const n = w.meta.nHouseholds;
    const nF = Math.max(2, Math.round(n / 10));
    addRow(w.tables.bank);
    addRow(w.tables.gov);
    addRow(w.tables.cb);
    seedReserves(w, 0, 1e9);
    for (let f = 0; f < nF; f++) {
      const i = addRow(w.tables.firm, { bank: 0, cell: f });
      seedDeposit(w, ref(FIRM, i), 50e6);
    }
    for (let h = 0; h < n; h++) {
      const i = addRow(w.tables.hh, { bank: 0, employer: h % 10 === 0 ? PUBLIC : h % nF, cell: h });
      seedDeposit(w, ref(HH, i), 5e6);
      f64(w.tables.hh, 'income')[i] = eng.param(w, 'toy.wage') * (1 - eng.param(w, 'toy.tax'));
    }
    w.ext.toy = { prevPublic: 0, prevPrivate: 0 };
  },
  phases: {
    pay(w, eng) {
      const hh = w.tables.hh;
      const emp = i32(hh, 'employer');
      const income = f64(hh, 'income');
      const wage = eng.param(w, 'toy.wage');
      const tax = eng.param(w, 'toy.tax');
      const pubWage = Math.floor(wage * eng.law(w, 'gov.wage.premium'));
      // Kho bạc thiếu thì NHNN mua trái phiếu.
      let nPublic = 0;
      for (let h = 0; h < hh.n; h++) if (emp[h] === PUBLIC) nPublic++;
      const need = nPublic * pubWage - f64(w.tables.gov, 'tga')[0];
      if (need > 0) issueBond(w, CB_REF, need, 0.03, 12);
      for (let h = 0; h < hh.n; h++) {
        const r = ref(HH, h);
        const before = income[h];
        let paid: number;
        if (emp[h] === PUBLIC) paid = transfer(w, GOV_REF, r, pubWage, MED_DEP, tx('wage_public'));
        else paid = transfer(w, ref(FIRM, emp[h]), r, wage, MED_DEP, tx('wage'), 0, true);
        const t = transfer(w, r, GOV_REF, paid * tax, MED_DEP, tx('pit'));
        income[h] = paid - t;
        if (income[h] !== before)
          recordDecision(w, r, 'toy.income', 'income', before, income[h], [
            { reason: emp[h] === PUBLIC ? 'toy_public_income' : 'toy_private_income', amount: income[h] - before },
          ]);
      }
    },
    goods(w, eng) {
      const hh = w.tables.hh;
      const firm = w.tables.firm;
      const emp = i32(hh, 'employer');
      const income = f64(hh, 'income');
      const dep = f64(hh, 'dep');
      f64(firm, 'sales').fill(0);
      const c = eng.variant(w, 'toy.consume') === 'all' ? 1 : eng.param(w, 'toy.propensity');
      for (let h = 0; h < hh.n; h++) {
        const budget = Math.min(dep[h], income[h] * c);
        const f = Math.floor(rand(w.meta.seed, S_SHOP, h, w.meta.tick) * firm.n);
        const paid = transfer(w, ref(HH, h), ref(FIRM, f), budget, MED_DEP, tx('consumption'));
        f64(firm, 'sales')[f] += paid;
        accumulate(w, 'toy.consumption', emp[h] === PUBLIC ? 'public' : 'private', paid);
      }
    },
  },
  indicators: [
    {
      id: 'toy.consumption',
      label: 'Tiêu dùng của hộ',
      unit: 'đồng',
      group: 'Đồ chơi',
      good: 1,
      compute: (w) => w.ledger.volume[tx('consumption')],
      contrib(w) {
        const a = takeAcc(w, 'toy.consumption');
        const st = w.ext.toy;
        const out = {
          toy_public_income: (a.public ?? 0) - st.prevPublic,
          toy_private_income: (a.private ?? 0) - st.prevPrivate,
        };
        st.prevPublic = a.public ?? 0;
        st.prevPrivate = a.private ?? 0;
        return out;
      },
    },
    { id: 'toy.money', label: 'Tiền gửi của công chúng', unit: 'đồng', group: 'Đồ chơi', compute: (w) => sum(w, 'hh') + sum(w, 'firm') },
    { id: 'toy.tga', label: 'Kho bạc', unit: 'đồng', group: 'Đồ chơi', compute: (w) => f64(w.tables.gov, 'tga')[0] },
  ],
};

function sum(w: World, table: string): number {
  const t = w.tables[table];
  const d = f64(t, 'dep');
  let s = 0;
  for (let i = 0; i < t.n; i++) s += d[i];
  return s;
}

export function toyEngine(extra: EngineModule[] = []): Engine {
  // import động để tránh vòng phụ thuộc với engine.ts
  return new EngineCtor([toyModule, ...extra]);
}
import { Engine as EngineCtor } from '../core/engine';
