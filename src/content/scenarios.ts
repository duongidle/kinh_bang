// Kịch bản GĐ1 (gd1 mục 16) và kịch bản 15 về phối hợp tài khoá - tiền tệ (Dương thêm 14/11/2026).
// Mỗi khẳng định trong lời giải thích là một phép đo trên ván của người chơi so với thế giới đối chứng.
// Không có câu nào viết sẵn kết quả: câu chỉ hiện "đúng" khi số đo của chính ván đó đúng.

import type { Engine } from '../engine/core/engine';
import type { ClaimDef, Ctx, GoalDef, OptionDef, ScenarioDef, Step } from '../engine/scenario/types';
import type { World } from '../engine/core/world';

const pct = (x: number, d = 1) => `${x >= 0 ? '+' : '−'}${Math.abs(x * 100).toFixed(d).replace('.', ',')}%`;
const pts = (x: number, d = 1) => `${x >= 0 ? '+' : '−'}${Math.abs(x * 100).toFixed(d).replace('.', ',')} điểm`;
const vn = (x: number, d = 1) => x.toFixed(d).replace('.', ',');
const lvl = (x: number, d = 1) => `${(x * 100).toFixed(d).replace('.', ',')}%`;

/** Trung bình của chỉ số trong các tháng [a, b) tính từ lúc người chơi nhận quyền. */
function avg(c: Ctx, w: World, id: string, a: number, b: number): number {
  const from = Math.max(0, c.t0 + a);
  const to = Math.min(c.t1, c.t0 + b);
  const x = c.eng.seriesOf(w, id, from, to);
  let s = 0;
  for (const v of x) s += v;
  return x.length ? s / x.length : NaN;
}
const rel = (c: Ctx, id: string, a: number, b: number) => avg(c, c.w, id, a, b) / avg(c, c.base, id, a, b) - 1;
const dif = (c: Ctx, id: string, a: number, b: number) => avg(c, c.w, id, a, b) - avg(c, c.base, id, a, b);
const last = (c: Ctx, w: World, id: string) => c.eng.value(w, id, c.t1 - 1);
const start = (c: Ctx, id: string) => c.eng.value(c.w, id, Math.max(0, c.t0 - 1));
const END = 9999;

// ---------- khuôn khẳng định ----------
const higher = (text: string, id: string, a: number, b: number, kind: 'rel' | 'pt' = 'rel', min = 0): ClaimDef => ({
  text,
  test(c) {
    const d = kind === 'rel' ? rel(c, id, a, b) : dif(c, id, a, b);
    return { ok: d > min, detail: `${kind === 'rel' ? pct(d) : pts(d)} so với thế giới đối chứng` };
  },
});
const lower = (text: string, id: string, a: number, b: number, kind: 'rel' | 'pt' = 'rel', max = 0): ClaimDef => ({
  text,
  test(c) {
    const d = kind === 'rel' ? rel(c, id, a, b) : dif(c, id, a, b);
    return { ok: d < max, detail: `${kind === 'rel' ? pct(d) : pts(d)} so với thế giới đối chứng` };
  },
});
/** Mức giá cuối kỳ so với đối chứng. */
const priceLevel = (text: string, dir: 1 | -1): ClaimDef => ({
  text,
  test(c) {
    const d = last(c, c.w, 'cpi') / last(c, c.base, 'cpi') - 1;
    return { ok: d * dir > 0.005, detail: `mức giá cuối kỳ ${pct(d)} so với thế giới đối chứng` };
  },
});

// ---------- khuôn mục tiêu ----------
const below = (id: string, label: string, ind: string, max: number, months = 12, fmt: (x: number) => string = lvl): GoalDef => ({
  id,
  label,
  test(c) {
    const v = avg(c, c.w, ind, Math.max(0, c.t1 - c.t0 - months), END);
    if (!Number.isFinite(v)) return { ok: false, value: 'chưa có số liệu' };
    return { ok: v <= max, value: fmt(v) };
  },
});
const above = (id: string, label: string, ind: string, min: number, months = 12, fmt: (x: number) => string = lvl): GoalDef => ({
  id,
  label,
  test(c) {
    const v = avg(c, c.w, ind, Math.max(0, c.t1 - c.t0 - months), END);
    if (!Number.isFinite(v)) return { ok: false, value: 'chưa có số liệu' };
    return { ok: v >= min, value: fmt(v) };
  },
});
const watch: GoalDef = { id: 'watch', label: 'Xem hết giai đoạn', test: (c) => ({ ok: true, value: `${c.t1 - c.t0} tháng` }) };

// ---------- tiền thuế thu thêm dùng làm gì ----------
// Một sắc thuế tăng thì ngân sách thu thêm. Kết quả của cả chính sách phụ thuộc vào việc số tiền đó đi đâu.
// Ba nhánh dưới đây dùng chung một cách tính, giống cách lập dự toán: sau năm đầu, lấy số thu thực của các sắc thuế vừa đổi
// trong 12 tháng qua, trừ số thu 12 tháng trước đó (đã chỉnh theo mức tăng GDP danh nghĩa). Phần chênh là "thu thêm".
// Từ năm thứ hai, nhánh trợ cấp và nhánh mua hàng chi đúng số đó mỗi tháng; nhánh trả nợ không chi.
function extraRevenue(eng: Engine, w: World, taxes: string[]): { perMonth: number; gdpMonth: number } {
  const t = w.meta.tick;
  const sum = (id: string, a: number, b: number) => {
    let x = 0;
    for (const v of eng.seriesOf(w, id, Math.max(0, a), b)) x += v;
    return x;
  };
  const rev = (a: number, b: number) => taxes.reduce((x, id) => x + sum(id, a, b), 0);
  const g1 = sum('gdp.nominal', t - 12, t);
  const g0 = sum('gdp.nominal', t - 24, t - 12);
  const extra = rev(t - 12, t) - (g0 > 0 ? (rev(t - 24, t - 12) * g1) / g0 : 0);
  return { perMonth: Math.max(0, extra) / 12, gdpMonth: g1 / 12 };
}

export function revenueUseOptions(taxes: string[], claims: Record<'transfer' | 'purchase' | 'debt', ClaimDef[]>): OptionDef[] {
  const transfer: Step = {
    at: 12,
    label: 'Chia đều phần thu thêm cho mọi hộ',
    dynamic(eng, w) {
      const x = extraRevenue(eng, w, taxes);
      return { laws: { 'gov.transfer.universal': eng.law(w, 'gov.transfer.universal') + Math.round(x.perMonth / w.tables.hh.n / 1000) * 1000 } };
    },
  };
  const purchase: Step = {
    at: 12,
    label: 'Dùng phần thu thêm để Chính phủ mua thêm hàng',
    dynamic(eng, w) {
      const x = extraRevenue(eng, w, taxes);
      return { laws: { 'gov.purchase.share': eng.law(w, 'gov.purchase.share') + (x.gdpMonth > 0 ? Math.round((x.perMonth / x.gdpMonth) * 1e4) / 1e4 : 0) } };
    },
  };
  return [
    { id: 'transfer', label: 'Trợ cấp', note: 'Từ năm thứ hai, phần thu thêm chia đều cho mọi hộ mỗi tháng.', steps: [transfer], claims: claims.transfer },
    { id: 'purchase', label: 'Đầu tư công', note: 'Từ năm thứ hai, Chính phủ dùng phần thu thêm mua thêm hàng của doanh nghiệp. Ở GĐ1 khoản mua này chưa tạo ra đường sá hay tài sản công làm tăng năng suất.', steps: [purchase], claims: claims.purchase },
    { id: 'debt', label: 'Trả nợ', note: 'Không chi thêm. Phần thu thêm làm bội chi nhỏ lại và nợ công thấp dần.', steps: [], claims: claims.debt },
  ];
}

const BASE_SIMPLE = ['Nền kinh tế đóng: không tỷ giá, không nhập khẩu, không vàng.', 'Hộ không vay; không có đất và nhà.', 'Không tăng năng suất, không tăng dân số.'];
const PRINT = { 'cb.monetize': 1 };

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'mot-khoan-vay',
    title: 'Một khoản vay',
    role: 'observer',
    scale: 'S',
    question: 'Tiền sinh ra từ đâu?',
    intro: 'Một nền kinh tế 50 hộ. Cậu chỉ quan sát. Mở bảng "Nguồn tiền" và bấm vào một ngân hàng để xem bảng cân đối của nó đổi ra sao mỗi khi nó cho vay.',
    prereq: [],
    warmup: 0,
    months: 36,
    goals: [watch],
    predict: [{ indicator: 'money.m2', question: 'Khi ngân hàng cho một doanh nghiệp vay, tổng tiền của công chúng sẽ' }],
    demo: [],
    claims: [
      {
        text: 'Mỗi khoản vay mới tạo ra đúng bấy nhiêu tiền gửi mới. Ngân hàng không lấy tiền của người gửi khác đem cho vay.',
        test(c) {
          const L = c.w.ledger;
          const k = L.nkind;
          let made = 0;
          let killed = 0;
          for (let t = c.t0; t < c.t1; t++)
            for (let j = 0; j < k; j++) {
              const v = L.moneyHist[t * k + j];
              if (v > 0) made += v;
              else killed -= v;
            }
          const m = c.eng.seriesOf(c.w, 'money.m2', c.t0, c.t1);
          const net = m[m.length - 1] - (c.t0 > 0 ? c.eng.value(c.w, 'money.m2', c.t0 - 1) : m[0]);
          return { ok: made > 0 && killed > 0, detail: `tiền sinh ra ${vn(made / 1e9, 1)} tỷ, tiền mất đi ${vn(killed / 1e9, 1)} tỷ, thay đổi ròng ${vn(net / 1e9, 1)} tỷ đồng` };
        },
      },
      {
        text: 'Tiền mặt do NHNN phát hành chỉ là phần nhỏ của tổng tiền. Phần lớn là tiền gửi, tức là nợ của ngân hàng thương mại.',
        test(c) {
          const s = avg(c, c.w, 'money.cashShare', 0, END);
          return { ok: s < 0.35, detail: `tiền mặt chiếm ${lvl(s)} tổng tiền của công chúng` };
        },
      },
    ],
    explanation: 'Ngân hàng cho vay bằng cách ghi thêm một khoản tiền gửi vào tài khoản người vay. Khoản vay là tài sản mới của ngân hàng, tiền gửi là món nợ mới của nó. Hai thứ sinh ra cùng lúc. Khi người vay trả gốc, tiền đó biến mất. Chi ngân sách cũng tạo tiền gửi, nộp thuế thì huỷ.',
    simplifications: BASE_SIMPLE,
  },
  {
    id: 'may-in-tien',
    title: 'Máy in tiền',
    role: 'government',
    scale: 'M',
    question: 'In tiền để chi tiêu thì giá ra sao, ai lợi, ai thiệt?',
    intro: 'Cậu giữ cả Bộ Tài chính lẫn NHNN. Bật "NHNN mua thẳng trái phiếu Chính phủ" rồi tăng mua hàng của Chính phủ. Xem sản lượng, giá và túi tiền từng nhóm.',
    prereq: ['mot-khoan-vay'],
    warmup: 36,
    months: 72,
    setup: { params: { 'cb.autopilot': 0 } },
    goals: [above('gdp', 'GDP thực năm cuối cao hơn lúc bắt đầu ít nhất 2%', 'gdp.real', 0, 12, lvl), below('pi', 'Lạm phát năm cuối không quá 8%', 'inflation.yoy', 0.08)],
    predict: [
      { indicator: 'cpi', question: 'Sau 6 năm in tiền, mức giá sẽ' },
      { indicator: 'gdp.real', question: 'Trong 2 năm đầu, GDP thực sẽ' },
    ],
    demo: [{ at: 0, laws: { ...PRINT, 'gov.purchase.share': 0.08 } }],
    claims: [
      priceLevel('In tiền để chi làm mức giá cao hơn hẳn.', 1),
      higher('Hai năm đầu sản lượng thực có tăng: tiền mới thành đơn hàng trước khi thành giá.', 'gdp.real', 0, 24),
      {
        text: 'Tiền mới không vào đều. Trong năm đầu, lợi nhuận doanh nghiệp (nơi Chính phủ mua hàng) tăng nhiều hơn quỹ lương của người làm công.',
        test(c) {
          const a = rel(c, 'profits.formal.real', 0, 12);
          const b = rel(c, 'wages.fixed.real', 0, 12);
          return { ok: a > b, detail: `lợi nhuận thực ${pct(a)}, quỹ lương thực ${pct(b)}` };
        },
      },
    ],
    explanation: 'Chính phủ chi tiền NHNN vừa tạo ra. Doanh nghiệp bán được nhiều hơn, thuê thêm người, nên lúc đầu sản lượng tăng. Khi máy và người đã chạy gần hết sức, người bán nâng biên lãi, lương đuổi theo giá, và phần tiền mới còn lại thành lạm phát. Người nhận tiền trước mua được hàng ở giá cũ.',
    simplifications: [...BASE_SIMPLE, 'Không có tỷ giá: ngoài đời in tiền còn làm mất giá nội tệ và đẩy giá hàng nhập.'],
  },
  {
    id: 'vach-xuat-phat',
    title: 'Từ vạch xuất phát',
    role: 'government',
    scale: 'M',
    question: 'Mọi nhà bắt đầu gần bằng nhau. Vì sao sau 30 năm lại chênh lệch?',
    intro: 'Lúc đầu của cải các hộ gần như bằng nhau. Chạy 30 năm ở tốc độ tối đa và theo dõi Gini của cải. Sau đó thử Phòng thí nghiệm: chia đều cổ tức.',
    prereq: [],
    warmup: 0,
    months: 360,
    goals: [below('gini', 'Gini thu nhập bình quân 5 năm cuối dưới 0,22', 'gini.income', 0.22, 60, (x) => x.toFixed(2).replace('.', ','))],
    predict: [{ indicator: 'gini.wealth', question: 'Sau 30 năm, bất bình đẳng của cải sẽ' }],
    demo: [{ at: 0, variants: { 'firm.dividend': 'equal' } }],
    claims: [
      {
        text: 'Không ai cố ý tạo ra, bất bình đẳng của cải vẫn tự hình thành.',
        test(c) {
          const a = c.eng.value(c.base, 'gini.wealth', 0);
          const b = last(c, c.base, 'gini.wealth');
          return { ok: b > a + 0.2, detail: `Gini của cải ở thế giới gốc đi từ ${vn(a, 2)} lên ${vn(b, 2)}` };
        },
      },
      lower('Chia đều cổ tức cho mọi hộ làm Gini thu nhập thấp hơn: sở hữu là một nguồn chênh lệch.', 'gini.income', 24, END, 'pt'),
    ],
    explanation: 'Ai may mắn có việc ổn định thì để dành được, tiền để dành thành vốn góp, vốn sinh cổ tức, cổ tức lại thành vốn. Ai mất việc phải tiêu vào tiền để dành. Khoảng cách tự nới ra dù quy tắc với mọi người như nhau.',
    simplifications: [...BASE_SIMPLE, 'Lao động đồng nhất: chưa có chênh lệch kỹ năng và học vấn (GĐ2).', 'Chưa có thừa kế, đất và nhà (GĐ3).'],
  },
  {
    id: 'thue-nguoi-giau',
    title: 'Đánh thuế người giàu',
    role: 'fiscal',
    scale: 'M',
    question: 'Nâng thuế cổ tức và thuế doanh nghiệp có làm bất bình đẳng giảm không? Câu trả lời phụ thuộc vào việc tiền thuế đi đâu.',
    intro: 'Nền kinh tế đã chạy 15 năm, của cải đã phân hoá. Cậu giữ Bộ Tài chính. Nâng thuế cổ tức và thuế TNDN, rồi chọn một trong ba cách dùng tiền thu thêm: chia cho mọi hộ, mua thêm hàng của doanh nghiệp, hay không chi để trả bớt nợ. Cuối ván có bảng so ba cách với nhau.',
    prereq: ['vach-xuat-phat'],
    warmup: 180,
    months: 120,
    setup: { variants: { 'gov.revenueUse': 'keep' } },
    goals: [below('gini', 'Gini thu nhập bình quân 3 năm cuối thấp hơn lúc bắt đầu', 'gini.income', 0, 36)],
    predict: [
      { indicator: 'gini.income', question: 'Nâng thuế cổ tức lên 30% mà không chi phần thu thêm thì Gini thu nhập sẽ' },
      { indicator: 'investment', question: 'Đầu tư của doanh nghiệp sẽ' },
    ],
    demo: [{ at: 0, laws: { 'pit.rate.dividend': 0.3, 'cit.rate.standard': 0.3 } }],
    claims: [higher('Ở cả ba cách, thu ngân sách so với GDP đều tăng.', 'gov.revenueGdp', 12, END, 'pt')],
    options: revenueUseOptions(['gov.tax.cit', 'gov.tax.pit'], {
      transfer: [
        higher('Chia phần thu thêm cho mọi hộ thì sản lượng không tụt như khi giữ tiền lại: GDP thực chỉ lệch vài phần trăm so với không tăng thuế.', 'gdp.real', 24, END, 'rel', -0.05),
        lower('Bất bình đẳng thu nhập không tăng như ở cách trả nợ. Nhưng nó cũng không giảm chắc chắn: có ván giảm, có ván tăng.', 'gini.income', 24, END, 'pt', 0.03),
      ],
      purchase: [
        higher('Chính phủ mua thêm hàng thì sản lượng cũng không tụt: tiền thuế quay lại thành đơn hàng của doanh nghiệp.', 'gdp.real', 24, END, 'rel', -0.05),
        lower('Bất bình đẳng thu nhập không tăng như ở cách trả nợ.', 'gini.income', 24, END, 'pt', 0.03),
      ],
      debt: [
        lower('Không chi phần thu thêm: doanh nghiệp đầu tư ít hẳn đi.', 'investment', 12, 60),
        lower('Sản lượng thực thấp hơn: tiền thuế rời khỏi vòng chi tiêu.', 'gdp.real', 24, END),
        higher('Thất nghiệp cao hơn trong bốn năm đầu.', 'unemployment', 12, 48, 'pt'),
        higher('Kết quả ngược mong đợi: Gini thu nhập cao hơn. Người mất việc kéo khoảng cách rộng ra, lấn át phần thuế lấy bớt của người có vốn.', 'gini.income', 24, END, 'pt'),
        lower('Đổi lại, số nợ công tính bằng đồng thấp hơn.', 'gov.debt', 96, END),
      ],
    }),
    compare: [
      { indicator: 'gini.income', label: 'Gini thu nhập', kind: 'pt', from: 24, to: END },
      { indicator: 'unemployment', label: 'Thất nghiệp', kind: 'pt', from: 24, to: END },
      { indicator: 'gdp.real', label: 'GDP thực', kind: 'rel', from: 24, to: END },
      { indicator: 'investment', label: 'Đầu tư (5 năm đầu)', kind: 'rel', from: 12, to: 60 },
      { indicator: 'consumption.real', label: 'Tiêu dùng thực', kind: 'rel', from: 24, to: END },
      { indicator: 'gov.debt', label: 'Nợ công (2 năm cuối)', kind: 'rel', from: 96, to: END },
      { indicator: 'gov.debtGdp', label: 'Nợ công/GDP (2 năm cuối)', kind: 'pt', from: 96, to: END },
    ],
    explanation: 'Thuế cổ tức và thuế TNDN lấy bớt thu nhập của nhóm có vốn. Phần còn lại của câu chuyện là tiền đó đi đâu. Nếu Chính phủ giữ lại để trả nợ, tiền rời khỏi vòng chi tiêu: doanh nghiệp bán ít đi, đầu tư ít đi, bớt người, và người mất việc làm bất bình đẳng thu nhập tăng. Nợ công tính bằng đồng có giảm, nhưng GDP cũng nhỏ đi nên tỷ lệ nợ trên GDP không giảm rõ. Nếu Chính phủ chi lại số tiền đó, bằng trợ cấp hay mua hàng, cú hãm gần như biến mất. Còn bất bình đẳng thu nhập thì chỉ giảm nhẹ và không chắc: trong mô hình, phần lớn chênh lệch thu nhập đến từ có việc hay mất việc, không phải từ cổ tức.',
    simplifications: [...BASE_SIMPLE, 'Người giàu không chuyển tài sản ra nước ngoài, không né thuế.', 'Biểu thuế TNCN gần như không chạm ai vì lương chưa phân tán (GĐ2).', '"Đầu tư công" ở GĐ1 chỉ là Chính phủ mua thêm hàng. Nó chưa tạo ra đường sá hay tài sản công làm tăng năng suất.', 'Phần thu thêm được tính một lần sau năm đầu rồi giữ nguyên, giống một dự toán. Năm đầu ở cả ba cách tiền đều chưa được chi.', 'Quy tắc tự động chi lại tiền thuế thu thêm (gov.revenueUse) được đặt về "keep" ở cả ba cách: ba cách tự khai nơi tiền đi bằng bước riêng ở tháng 12, để quy tắc tự động bật thì chi hai lần (sai-khac.md D14).'],
  },
  {
    id: 'room-hay-lai-suat',
    title: 'Room hay lãi suất',
    role: 'monetary',
    scale: 'M',
    question: 'Hãm tín dụng bằng hạn mức (room) thì ai bị loại trước?',
    intro: 'Cậu giữ NHNN. Bật room tín dụng và đặt mức tăng trưởng dư nợ tối đa mỗi năm. So với cách tăng lãi suất.',
    prereq: ['mot-khoan-vay'],
    warmup: 60,
    months: 48,
    setup: { params: { 'cb.autopilot': 0 } },
    goals: [below('cr', 'Dư nợ cuối kỳ không cao hơn lúc bắt đầu quá 10%', 'credit', 0), below('u', 'Thất nghiệp năm cuối không quá 8%', 'unemployment', 0.08)],
    predict: [{ indicator: 'credit', question: 'Đặt room 2% mỗi năm thì dư nợ sẽ' }],
    demo: [{ at: 0, laws: { 'cb.room.enabled': 1, 'cb.credit.room': 0.02 } }],
    claims: [
      lower('Room chặn được tín dụng: dư nợ thấp hơn thế giới không có room.', 'credit', 12, END),
      {
        text: 'Khi room không đủ cho mọi người, hồ sơ yếu bị loại trước.',
        test(c) {
          const x = c.eng.seriesOf(c.w, 'credit.soundGap', c.t0, c.t1);
          let s = 0;
          let n = 0;
          for (const v of x)
            if (Number.isFinite(v)) {
              s += v;
              n++;
            }
          const g = n ? s / n : NaN;
          return { ok: g > 0, detail: `vốn ròng trên tài sản của nhóm được vay cao hơn nhóm bị từ chối ${g.toFixed(2).replace('.', ',')}` };
        },
      },
      lower('Đầu tư thấp hơn: doanh nghiệp muốn mua máy mà không vay được.', 'investment', 0, 36),
    ],
    explanation: 'Room là trần số lượng. Ngân hàng vẫn muốn cho vay nhưng hết hạn mức, nên chọn khách tốt nhất và từ chối phần còn lại. Lãi suất thì là giá: ai chịu được giá vẫn vay được.',
    simplifications: [...BASE_SIMPLE, 'Room chia theo từng ngân hàng theo dư nợ đầu năm; ngoài đời NHNN giao khác nhau cho từng ngân hàng.'],
  },
  {
    id: 'het-han-giam-thue',
    title: 'Hết hạn giảm thuế',
    role: 'fiscal',
    scale: 'M',
    question: 'GTGT về lại 10% từ 01/01/2027: giá và ngân sách đổi thế nào?',
    intro: 'Đang là giữa năm 2026, GTGT 8%. Theo luật, từ 01/01/2027 thuế tự về 10%. Cậu giữ Bộ Tài chính. Khi thuế đã về 10%, cậu để nguyên hay ban hành lại mức 8%?',
    prereq: [],
    warmup: 6,
    months: 42,
    goals: [below('def', 'Bội chi năm cuối không quá 2,5% GDP', 'gov.deficitGdp', 0.025)],
    predict: [
      { indicator: 'price.formal.taxed', question: 'Nếu gia hạn 8% thay vì để về 10%, giá hàng chịu thuế sẽ' },
      { indicator: 'gov.tax.vat', question: 'Thu GTGT sẽ' },
    ],
    demo: [{ at: 6, laws: { 'vat.rate.standard': 0.08 } }], // tháng 1/2027, ngay khi thuế vừa về 10%
    claims: [
      lower('Gia hạn 8% giữ giá hàng chịu thuế thấp hơn so với để thuế về 10%.', 'price.formal.taxed', 12, END),
      lower('Đổi lại, thu GTGT thấp hơn.', 'gov.tax.vat', 12, END),
      higher('Tiêu dùng thực cao hơn.', 'consumption.real', 12, END),
    ],
    explanation: 'Thuế GTGT nằm trong giá bán. Khi thuế đổi, người bán không chuyển hết vào giá ngay: trong mô hình khoảng một phần ba đi vào giá, phần còn lại ăn vào biên lãi, rồi biên lãi lại đi theo sức mua. Thuế thấp hơn thì giá thấp hơn, nhưng ít hơn mức giảm thuế. Người mua tiêu được nhiều hàng hơn, ngân sách thu ít hơn, và phần thu hụt đó Chính phủ phải vay để bù.',
    history: 'Việt Nam giảm GTGT từ 10% xuống 8% cho phần lớn hàng hoá từ 2022 và gia hạn nhiều lần, tới hết 2026.',
    simplifications: [...BASE_SIMPLE, 'Gom thuế suất theo ngành; ngoài đời một số nhóm hàng không được giảm.', 'Tỷ lệ chuyển thuế vào giá lấy từ số liệu châu Âu (IMF WP/21/61: bình quân 31%); chưa có ước lượng cho Việt Nam.', 'Mô hình chưa có bất đối xứng: ngoài đời giá tăng theo thuế mạnh hơn là giảm theo thuế (Benzarti và cộng sự 2020).', 'Giả định ngầm: Chính phủ không cắt chi khi thu hụt. Phần thiếu được bù bằng vay nợ.', 'Gia hạn 8% là giảm thuế so với luật hiện hành (về 10%): theo quy tắc gov.revenueUse mặc định, Chính phủ vay bù và giữ nguyên chi, không cắt chi (sai-khac.md D14).'],
  },
  {
    id: 'keo-vao-luoi-thue',
    title: 'Kéo vào lưới thuế',
    role: 'fiscal',
    scale: 'M',
    question: 'Hạ ngưỡng miễn thuế của hộ kinh doanh: thu thêm được bao nhiêu, mất gì, và tiền thu thêm đi đâu?',
    intro: 'Từ 2026 hộ kinh doanh có doanh thu dưới 1 tỷ đồng mỗi năm được miễn thuế. Cậu giữ Bộ Tài chính. Thử hạ ngưỡng về 100 triệu, rồi chọn cách dùng tiền thu thêm: chia cho mọi hộ, mua thêm hàng, hay trả bớt nợ. Cuối ván có bảng so ba cách.',
    prereq: [],
    warmup: 36,
    months: 72,
    setup: { params: { 'gov.indexation': 0 }, variants: { 'gov.revenueUse': 'keep' } },
    goals: [above('rev', 'Thu thuế hộ kinh doanh năm cuối cao hơn lúc bắt đầu', 'gov.tax.hkd', 1, 12, (x) => `${(x / 1e6).toFixed(0)} triệu/tháng`)],
    predict: [
      { indicator: 'gov.tax.hkd', question: 'Hạ ngưỡng về 100 triệu thì thu thuế hộ kinh doanh sẽ' },
      { indicator: 'informal.share', question: 'Tỷ lệ lao động phi chính thức sẽ' },
    ],
    demo: [{ at: 0, laws: { 'hkd.threshold': 100e6 } }],
    claims: [
      {
        text: 'Hạ ngưỡng thì thu được thuế từ hộ kinh doanh.',
        test(c) {
          const d = dif(c, 'gov.tax.hkd', 12, END);
          return { ok: d > 0, detail: `thu thuế hộ kinh doanh ${d >= 0 ? '+' : '−'}${(Math.abs(d) / 1e6).toFixed(0)} triệu đồng mỗi tháng so với thế giới đối chứng` };
        },
      },
      lower('Dù tiền thuế được dùng cách nào, thu nhập thực của người làm ở khu vực phi chính thức vẫn thấp hơn.', 'income.real.informal', 24, END),
      {
        text: 'Nhưng khu vực phi chính thức không nhỏ đi về số người: không ai "lên" doanh nghiệp vì bị đánh thuế.',
        test(c) {
          const d = dif(c, 'informal.share', 12, END);
          return { ok: d > -0.01, detail: `tỷ lệ lao động phi chính thức ${pts(d)}` };
        },
      },
    ],
    options: revenueUseOptions(['gov.tax.hkd'], {
      transfer: [lower('Chia lại cho mọi hộ thì tiêu dùng thực vẫn thấp hơn một chút: thuế đã nằm trong giá hàng của hộ kinh doanh.', 'consumption.real', 24, END)],
      purchase: [lower('Chính phủ mua thêm hàng của doanh nghiệp thì tiêu dùng thực của hộ vẫn thấp hơn.', 'consumption.real', 24, END)],
      debt: [
        lower('Không chi phần thu thêm thì tiêu dùng thực thấp hơn.', 'consumption.real', 24, END),
        higher('Và bất bình đẳng thu nhập cao hơn.', 'gini.income', 24, END, 'pt'),
        lower('Đổi lại, nợ công thấp hơn.', 'gov.debt', 60, END),
      ],
    }),
    compare: [
      { indicator: 'income.real.informal', label: 'Thu nhập thực phi chính thức', kind: 'rel', from: 24, to: END },
      { indicator: 'informal.share', label: 'Lao động phi chính thức', kind: 'pt', from: 24, to: END },
      { indicator: 'gdp.real', label: 'GDP thực', kind: 'rel', from: 24, to: END },
      { indicator: 'consumption.real', label: 'Tiêu dùng thực', kind: 'rel', from: 24, to: END },
      { indicator: 'gini.income', label: 'Gini thu nhập', kind: 'pt', from: 24, to: END },
      { indicator: 'gov.debt', label: 'Nợ công (năm cuối)', kind: 'rel', from: 60, to: END },
    ],
    explanation: 'Thuế theo doanh thu đi vào giá bán của hộ kinh doanh và vào thu nhập của chủ hộ. Khu vực này nghèo đi. Nó không co lại về số người, vì người làm ở đó không có chỗ nào khác để đi, và hộ kinh doanh trong mô hình không chuyển lên doanh nghiệp được. Tiền thuế đi đâu chỉ đổi mức độ: giữ lại trả nợ thì khu vực phi chính thức mất khoảng 3% thu nhập thực, chi lại ra thì mất khoảng 2%.',
    simplifications: [...BASE_SIMPLE, 'Hộ kinh doanh khai một nửa doanh thu (giá trị tạm, chưa có số liệu).', 'Chưa có đường chuyển từ hộ kinh doanh lên doanh nghiệp.', 'Phần thu thêm được tính một lần sau năm đầu rồi giữ nguyên, giống một dự toán.', 'Quy tắc tự động chi lại tiền thuế thu thêm (gov.revenueUse) được đặt về "keep" ở cả ba cách: ba cách tự khai nơi tiền đi bằng bước riêng ở tháng 12, để quy tắc tự động bật thì chi hai lần (sai-khac.md D14).'],
  },
  {
    id: 'can-ngan-sach',
    title: 'Cân ngân sách',
    role: 'fiscal',
    scale: 'M',
    question: 'Giảm bội chi mà không gây suy thoái, làm được không?',
    intro: 'Chính phủ đang mua hàng tới 8% GDP và bội chi lớn. Cậu giữ Bộ Tài chính. Kéo bội chi về dưới 2% GDP, giữ thất nghiệp dưới 8%.',
    prereq: ['may-in-tien'],
    warmup: 48,
    months: 72,
    setup: { laws: { 'gov.purchase.share': 0.08 }, params: { 'cb.autopilot': 0 } },
    goals: [below('def', 'Bội chi năm cuối không quá 2% GDP', 'gov.deficitGdp', 0.02), below('u', 'Thất nghiệp bình quân cả giai đoạn không quá 8%', 'unemployment', 0.08, 72)],
    predict: [
      { indicator: 'gdp.real', question: 'Cắt mua hàng của Chính phủ thì GDP thực năm đầu sẽ' },
      { indicator: 'gov.debtGdp', question: 'Nợ công so với GDP sau 6 năm sẽ' },
    ],
    demo: [{ at: 0, laws: { 'gov.purchase.share': 0.035 } }],
    claims: [
      lower('Cắt chi làm bội chi nhỏ lại.', 'gov.deficitGdp', 12, END, 'pt'),
      lower('Năm đầu GDP thực thấp hơn: đơn hàng của Chính phủ mất đi kéo theo việc làm và tiêu dùng.', 'gdp.real', 0, 12),
      higher('Thất nghiệp năm đầu cao hơn.', 'unemployment', 0, 12, 'pt'),
    ],
    explanation: 'Chi của Chính phủ là thu nhập của doanh nghiệp và người lao động. Cắt chi thì cầu giảm, doanh nghiệp bớt người, thu thuế cũng giảm theo, nên bội chi giảm ít hơn số tiền cắt. Cắt từ từ thì kinh tế kịp điều chỉnh hơn.',
    simplifications: [...BASE_SIMPLE, 'Chính phủ chỉ có ba khoản chi: lương công chức, mua hàng, trợ cấp.', 'Giả định ngầm: tiền tiết kiệm được từ cắt chi dùng để vay ít đi, không giảm thuế và không chi vào việc khác.'],
  },
  {
    id: 'that-lung-buoc-bung',
    title: 'Thắt lưng buộc bụng',
    role: 'observer',
    scale: 'M',
    question: 'Mọi nhà cùng tiết kiệm hơn thì cả nước có giàu hơn không?',
    intro: 'Phòng thí nghiệm. Hạ "khuynh hướng tiêu dùng theo thu nhập" của mọi hộ từ 0,5 xuống 0,4 rồi xem tổng tiền để dành của các hộ có tăng không.',
    prereq: [],
    warmup: 36,
    months: 60,
    setup: { params: { 'cb.autopilot': 0 } },
    goals: [watch],
    predict: [
      { indicator: 'gdp.real', question: 'Mọi nhà tiêu ít đi thì GDP thực sẽ' },
      { indicator: 'unemployment', question: 'Thất nghiệp sẽ' },
    ],
    demo: [{ at: 0, params: { 'hh.alpha1': 0.4 } }],
    claims: [
      lower('Mọi nhà cùng bớt tiêu thì tiêu dùng thực cả nước thấp hơn.', 'consumption.real', 0, 24),
      lower('Sản lượng thấp hơn: tiền nhà này không tiêu là doanh thu nhà khác không có.', 'gdp.real', 0, 24),
      higher('Thất nghiệp cao hơn.', 'unemployment', 0, 24, 'pt'),
    ],
    explanation: 'Một nhà tiết kiệm thì nhà đó giàu lên. Mọi nhà cùng tiết kiệm thì doanh thu của doanh nghiệp giảm, người bị cho nghỉ, thu nhập giảm, và tổng tiền để dành không tăng như mong muốn. Đây là nghịch lý tiết kiệm.',
    simplifications: [...BASE_SIMPLE, 'Tiền tiết kiệm không tự chuyển thành đầu tư qua lãi suất thấp hơn; lãi suất do NHNN đặt.', 'Giả định ngầm: Chính phủ và NHNN không làm gì để bù phần cầu mất đi.'],
  },
  {
    id: 'song-bang-luong',
    title: 'Sống bằng lương',
    role: 'household',
    scale: 'M',
    question: 'Giữ sức mua qua một đợt lạm phát.',
    intro: 'Cậu là cô Hạnh, giáo viên, lương Nhà nước trả. Chính phủ bắt đầu in tiền để chi tiêu. Lương của cô xét lại mỗi năm một lần. Cậu quyết mức chi tiêu, có nghỉ việc ra tự làm hay không.',
    prereq: ['may-in-tien'],
    warmup: 36,
    months: 60,
    setup: { params: { 'cb.autopilot': 0 } },
    shocks: [{ at: 0, laws: { ...PRINT, 'gov.purchase.share': 0.1 }, label: 'Chính phủ in tiền để chi tiêu' }],
    possess: { sector: 'hh', name: 'Cô Hạnh' },
    control: 'shock',
    goals: [
      {
        id: 'real',
        label: 'Lương thực của người làm công ăn lương không tụt quá 5% so với lúc đầu',
        test(c) {
          const d = last(c, c.w, 'wage.real') / start(c, 'wage.real') - 1;
          return { ok: d > -0.05, value: pct(d) };
        },
      },
    ],
    predict: [{ indicator: 'wage.real', question: 'Khi Chính phủ in tiền, lương thực sẽ' }],
    demo: [],
    claims: [
      priceLevel('In tiền để chi làm mức giá cao hơn hẳn.', 1),
      higher('Lạm phát kỳ vọng tăng theo: người ta tính trước giá sẽ lên.', 'inflation.expected', 12, END, 'pt'),
      {
        text: 'Năm đầu, quỹ lương của người làm công tăng chậm hơn lợi nhuận doanh nghiệp.',
        test(c) {
          const a = rel(c, 'profits.formal.real', 0, 12);
          const b = rel(c, 'wages.fixed.real', 0, 12);
          return { ok: a > b, detail: `lợi nhuận thực ${pct(a)}, quỹ lương thực ${pct(b)}` };
        },
      },
    ],
    explanation: 'Giá đổi hằng tháng, lương xét hằng năm. Trong khoảng giữa hai lần xét lương, người sống bằng lương mất sức mua. Tiền để trong nhà mất giá theo lạm phát.',
    simplifications: [...BASE_SIMPLE, 'Hộ không mua được vàng, đô la hay đất để giữ của (GĐ3, GĐ5).'],
  },
  {
    id: 'chu-xuong',
    title: 'Chủ xưởng',
    role: 'firm',
    scale: 'M',
    question: 'Sống sót khi ngân hàng siết tín dụng.',
    intro: 'Cậu điều hành Xưởng Bình An, một doanh nghiệp nhỏ ít vốn. NHNN vừa áp room tín dụng 0%: ngân hàng không được tăng dư nợ. Cậu quyết giá, lương, số người và mua máy.',
    prereq: ['room-hay-lai-suat'],
    warmup: 60,
    months: 48,
    setup: { params: { 'cb.autopilot': 0 } },
    shocks: [{ at: 0, laws: { 'cb.room.enabled': 1, 'cb.credit.room': 0 }, label: 'NHNN áp room tín dụng 0%' }],
    possess: { sector: 'firm', name: 'Xưởng Bình An' },
    control: 'shock',
    goals: [
      {
        id: 'alive',
        label: 'Xưởng còn hoạt động khi hết giai đoạn',
        test(c) {
          const t = c.w.tables.firm;
          const p = (c.w.ext.gd1 as { player?: { firm: number } }).player;
          const names = (c.w.ext.gd1 as { names: Array<{ kind: string; id: number; name: string }> }).names;
          const id = names.find((n) => n.name === 'Xưởng Bình An')?.id ?? p?.firm ?? -1;
          const alive = id >= 0 && (t.cols.alive as Uint8Array)[id] === 1;
          return { ok: alive, value: alive ? 'còn hoạt động' : 'đã đóng cửa' };
        },
      },
    ],
    predict: [{ indicator: 'investment', question: 'Khi ngân hàng không được tăng dư nợ, đầu tư của doanh nghiệp sẽ' }],
    demo: [],
    claims: [
      lower('Room 0% làm dư nợ thấp hơn.', 'credit', 12, END),
      lower('Đầu tư thấp hơn.', 'investment', 0, 36),
      higher('Tiền vay bị từ chối nhiều hơn trong năm đầu.', 'credit.denied', 0, 12),
    ],
    explanation: 'Khi ngân hàng hết hạn mức, doanh nghiệp ít vốn bị từ chối trước. Không vay được thì phải sống bằng tiền bán hàng: giữ tiền mặt, hoãn mua máy, chỉ thuê số người trả nổi lương.',
    simplifications: [...BASE_SIMPLE, 'Doanh nghiệp không vay được ngoài ngân hàng (tín dụng đen, vay người quen: GĐ3).'],
  },
  {
    id: 'tin-dung-nong',
    title: 'Tín dụng nóng 2007-2011',
    role: 'government',
    scale: 'M',
    question: 'Kinh tế đang nóng vì tiền rẻ và chi tiêu công. Hạ nhiệt thế nào?',
    intro: 'Lãi suất thấp và Chính phủ chi mạnh đã vài năm. Giá đang tăng nhanh. Cậu giữ cả Bộ Tài chính và NHNN. Lấy cảm hứng từ Việt Nam 2008 và 2011.',
    prereq: ['may-in-tien', 'room-hay-lai-suat'],
    warmup: 60,
    months: 60,
    setup: { laws: { 'cb.rate.refinancing': 0.02, 'gov.purchase.share': 0.08, ...PRINT }, params: { 'cb.autopilot': 0 } },
    goals: [below('pi', 'Lạm phát năm cuối không quá 6%', 'inflation.yoy', 0.06), below('u', 'Thất nghiệp năm cuối không quá 8%', 'unemployment', 0.08)],
    predict: [
      { indicator: 'inflation.yoy', question: 'Cắt chi tiêu công và dừng in tiền thì lạm phát sẽ' },
      { indicator: 'unemployment', question: 'Thất nghiệp năm đầu sẽ' },
    ],
    demo: [{ at: 0, laws: { 'cb.monetize': 0, 'gov.purchase.share': 0.04, 'cb.room.enabled': 1, 'cb.credit.room': 0.05 } }],
    claims: [
      lower('Cắt chi tiêu công, dừng in tiền và hãm tín dụng làm lạm phát thấp hơn.', 'inflation.yoy', 12, END, 'pt'),
      lower('Cái giá: GDP thực năm đầu thấp hơn.', 'gdp.real', 0, 12),
      higher('Thất nghiệp năm đầu cao hơn.', 'unemployment', 0, 12, 'pt'),
    ],
    explanation: 'Lạm phát ở đây đến từ cầu: tiền mới và chi tiêu công đẩy đơn hàng vượt sức sản xuất. Rút cầu ra thì giá chậm lại, nhưng doanh nghiệp bán ít đi và bớt người trước khi giá kịp hạ nhiệt.',
    history: 'Lạm phát Việt Nam lên khoảng 23% năm 2008 và 18,6% năm 2011 sau các năm tín dụng tăng trên 30%. Nghị quyết 11 năm 2011 thắt cả tiền tệ lẫn tài khoá: trần tăng trưởng tín dụng dưới 20%, cắt đầu tư công. Lạm phát về một con số từ 2012, tăng trưởng chậm lại.',
    simplifications: [...BASE_SIMPLE, 'Không có giá dầu, giá lương thực thế giới và tỷ giá, vốn là một nửa câu chuyện 2008.', 'Không có bong bóng đất và chứng khoán.'],
  },
  {
    id: 'gia-luong-tien',
    title: 'Giá - lương - tiền',
    role: 'government',
    scale: 'M',
    question: 'Lạm phát cao vì in tiền bù ngân sách. Dừng lại thì chuyện gì xảy ra?',
    intro: 'Chính phủ đã in tiền để chi tới 12% GDP suốt nhiều năm. Giá tăng rất nhanh. Cậu giữ cả hai vai. Lấy cảm hứng từ Việt Nam 1985-1988. Vùng lạm phát này chưa được kiểm định.',
    prereq: ['may-in-tien'],
    warmup: 60,
    months: 72,
    setup: { laws: { ...PRINT, 'gov.purchase.share': 0.12 }, params: { 'cb.autopilot': 0 } },
    goals: [below('pi', 'Lạm phát năm cuối không quá 10%', 'inflation.yoy', 0.1)],
    predict: [{ indicator: 'inflation.yoy', question: 'Dừng in tiền thì lạm phát sẽ' }],
    demo: [{ at: 0, laws: { 'cb.monetize': 0, 'gov.purchase.share': 0.04 } }],
    claims: [
      lower('Dừng in tiền và cắt chi làm lạm phát thấp hơn.', 'inflation.yoy', 24, END, 'pt'),
      higher('Nhưng lạm phát không tắt ngay: kỳ vọng và lương còn đuổi theo giá cũ, và thất nghiệp năm đầu cao hơn.', 'unemployment', 0, 12, 'pt'),
    ],
    explanation: 'Khi ai cũng quen giá tăng, lương được xét theo lạm phát của năm vừa qua, người bán tính trước lạm phát kỳ vọng vào giá, và giá lại tính theo lương. Vòng này tự chạy một thời gian kể cả sau khi máy in đã dừng.',
    history: 'Lạm phát Việt Nam năm 1986 trên 700%. Cuộc tổng điều chỉnh giá - lương - tiền năm 1985 có đổi tiền. Lạm phát chỉ hạ sau 1989 khi dừng bù lỗ bằng phát hành và nâng lãi suất tiền gửi lên trên lạm phát.',
    simplifications: [...BASE_SIMPLE, 'Không có chạy sang vàng và đô la (GĐ5).', 'Không có hai giá, tem phiếu, kinh tế kế hoạch.'],
    untested: true,
  },
  {
    id: 'luong-toi-thieu',
    title: 'Tăng lương tối thiểu',
    role: 'fiscal',
    scale: 'M',
    question: 'Nâng mạnh sàn lương: ai được, ai mất việc, ai trôi sang phi chính thức?',
    intro: 'Sàn lương vùng hiện thấp hơn nhiều so với lương doanh nghiệp đang trả, nên nâng vài phần trăm không chạm ai. Thử nâng sàn lên sát mức lương bình quân.',
    prereq: [],
    warmup: 36,
    months: 48,
    setup: { params: { 'cb.autopilot': 0 } },
    goals: [above('w', 'Lương thực bình quân năm cuối cao hơn lúc bắt đầu', 'wage.real', 0), below('u', 'Thất nghiệp năm cuối không quá 7%', 'unemployment', 0.07)],
    predict: [
      { indicator: 'employment.formal', question: 'Nâng sàn lương lên sát lương bình quân thì việc làm ở doanh nghiệp sẽ' },
      { indicator: 'informal.share', question: 'Tỷ lệ lao động phi chính thức sẽ' },
    ],
    demo: [
      {
        at: 0,
        dynamic(eng, w) {
          const avgW = eng.value(w, 'wage.formal');
          const laws: Record<string, number> = {};
          for (let z = 1; z <= 4; z++) laws[`minwage.zone.${z}`] = Math.round(Math.max(eng.law(w, `minwage.zone.${z}`) * 1.3, avgW * (1 - 0.03 * z)) / 1000) * 1000;
          return { laws };
        },
      },
    ],
    claims: [
      higher('Lương của nhóm doanh nghiệp trả thấp tăng lên.', 'wage.formal.low', 6, END),
      {
        text: 'Việc làm ở doanh nghiệp giảm, hoặc tỷ lệ lao động phi chính thức tăng: sàn lương không với tới người làm ở hộ kinh doanh.',
        test(c) {
          const e = rel(c, 'employment.formal', 6, END);
          const i = dif(c, 'informal.share', 6, END);
          return { ok: e < 0 || i > 0, detail: `việc làm chính thức ${pct(e)}, lao động phi chính thức ${pts(i)}` };
        },
      },
    ],
    explanation: 'Sàn lương chỉ ràng buộc doanh nghiệp chính thức. Nơi nào không gánh nổi mức lương mới thì bớt người. Người mất việc ra làm cho hộ kinh doanh hoặc tự làm, nơi luật không với tới.',
    history: 'Lương tối thiểu vùng tăng 7,2% từ 01/01/2026 (Nghị định 293/2025/NĐ-CP).',
    simplifications: [...BASE_SIMPLE, 'Lao động đồng nhất: chưa có nhóm kỹ năng thấp bị ảnh hưởng riêng (GĐ2).'],
  },
  {
    id: 'hai-tay-lai',
    title: 'Hai tay lái',
    role: 'monetary',
    scale: 'M',
    question: 'NHNN tăng lãi suất và giữ mãi, Bộ Tài chính không làm gì. Lạm phát có giảm không?',
    intro: 'Phòng thí nghiệm về phối hợp tài khoá - tiền tệ. Cậu giữ NHNN, tăng lãi suất tái cấp vốn thêm 6 điểm và giữ nguyên. Bộ Tài chính vẫn chi như cũ. Theo dõi tiền lãi Chính phủ phải trả.',
    prereq: ['mot-khoan-vay', 'can-ngan-sach'],
    warmup: 60,
    months: 72,
    setup: { params: { 'cb.autopilot': 0 } },
    goals: [below('pi', 'Lạm phát năm cuối thấp hơn lúc bắt đầu', 'inflation.yoy', 0)],
    predict: [
      { indicator: 'inflation.yoy', question: 'Giữ lãi suất cao 6 năm thì lạm phát cuối kỳ sẽ' },
      { indicator: 'gov.debt', question: 'Nợ công sẽ' },
    ],
    demo: [{ at: 0, dynamic: (eng, w) => ({ laws: { 'cb.rate.refinancing': eng.law(w, 'cb.rate.refinancing') + 0.06 } }) }],
    claims: [
      lower('Lãi suất cao làm dư nợ thấp hơn.', 'credit', 12, 36),
      higher('Nhưng tiền lãi Chính phủ trả phình ra, bội chi lớn hơn.', 'gov.deficitGdp', 12, END, 'pt'),
      higher('Nợ công cao hơn.', 'gov.debt', 48, END),
      higher('Kết quả ngược mong đợi: từ năm thứ năm lạm phát cao hơn thế giới không tăng lãi suất.', 'inflation.yoy', 48, END, 'pt'),
    ],
    explanation: 'Lãi suất cao hãm tín dụng, đúng như sách. Nhưng Chính phủ là con nợ lớn nhất, và tiền lãi nó trả là thu nhập của ngân hàng và người gửi tiền. Nếu Bộ Tài chính không cắt chi hay tăng thuế để bù, thì chính sách thắt tiền tệ lại bơm tiền ra qua cửa ngân sách. Hai tay lái phải xoay cùng chiều.',
    simplifications: [...BASE_SIMPLE, 'Hộ không vay, nên lãi suất gần như không hãm được tiêu dùng (kênh vay tiêu dùng: GĐ3).', 'Không có tỷ giá: ngoài đời lãi suất cao còn hút vốn ngoại và làm nội tệ lên giá.'],
  },
];

// Mục tiêu dạng "so với lúc bắt đầu": so bình quân 12 tháng cuối với giá trị ở tháng người chơi nhận quyền.
const money = (x: number) => `${x >= 0 ? '+' : '−'}${(Math.abs(x) / 1e6).toFixed(0)} triệu đồng/tháng`;
const RELATIVE: Record<string, { id: string; abs?: boolean; dir: 1 | -1; th: number; fmt?: (x: number) => string }> = {
  'may-in-tien/gdp': { id: 'gdp.real', dir: 1, th: 0.02 },
  'thue-nguoi-giau/gini': { id: 'gini.income', abs: true, dir: -1, th: 0, fmt: (x) => `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(3).replace('.', ',')}` },
  'room-hay-lai-suat/cr': { id: 'credit', dir: -1, th: 0.1 },
  'keo-vao-luoi-thue/rev': { id: 'gov.tax.hkd', abs: true, dir: 1, th: 1, fmt: money },
  'luong-toi-thieu/w': { id: 'wage.real', dir: 1, th: 0 },
  'hai-tay-lai/pi': { id: 'inflation.yoy', abs: true, dir: -1, th: 0 },
};
for (const s of SCENARIOS)
  for (const g of s.goals) {
    const ind = RELATIVE[`${s.id}/${g.id}`];
    if (!ind) continue;
    g.test = (c) => {
      const a = start(c, ind.id);
      const b = avg(c, c.w, ind.id, Math.max(0, c.t1 - c.t0 - 12), END);
      const d = ind.abs ? b - a : b / a - 1;
      if (!Number.isFinite(d)) return { ok: false, value: 'chưa có số liệu' };
      return { ok: ind.dir * (d - ind.th) >= 0, value: (ind.fmt ?? (ind.abs ? pts : pct))(d) };
    };
  }
