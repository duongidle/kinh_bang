// Module GĐ1: ráp các pha, sổ quy tắc, mã lý do, tham số, chỉ số.

import { GD1_PARAMS } from '../../../config/model/gd1';
import { Engine, type EngineModule, type ReasonDef, type RuleDef, type Upstream } from '../../core/engine';
import { bankHousekeeping, creditMarket, debtService } from './banks';
import { exitAndEntry, laborMarket, payTaxes, payWages, planFirms, produce, profits } from './firms';
import { bondAuction, bondService, closeMonth, govPurchases, payPublic, policy } from './gov';
import { cashManagement, householdBudgets, shopping } from './households';
import { GD1_INDICATORS } from './indicators';
import { initWorld } from './init';
import { playerFirm, playerHousehold } from './player';
import { resetMonth, setupSchema, st } from './schema';

const ind = (id: string, lag = 0): Upstream => ({ kind: 'indicator', id, lag });
const law = (id: string): Upstream => ({ kind: 'law', id });
const root = (label: string): Upstream => ({ kind: 'root', label });

const REASONS: ReasonDef[] = [
  // giá
  { id: 'p_wage', label: 'chi phí lương mỗi sản phẩm đổi', upstream: [ind('wage.formal'), ind('wage.informal')] },
  { id: 'p_capital', label: 'chi phí máy móc và lãi vay mỗi sản phẩm đổi', upstream: [ind('rate.lending'), ind('investment', 1)] },
  { id: 'p_markup_up', label: 'người bán nâng biên lãi vì hàng bán chạy, tồn kho thấp', upstream: [ind('consumption', 1), ind('unmet', 1)] },
  { id: 'p_markup_down', label: 'người bán hạ biên lãi vì hàng ế', upstream: [ind('consumption', 1), ind('inventories', 1)] },
  { id: 'p_expect', label: 'người bán tính trước lạm phát kỳ vọng vào giá', upstream: [ind('inflation.expected', 1)] },
  { id: 'p_vat', label: 'thuế trong giá bán đổi (GTGT, thuế gián thu khác)', upstream: [law('vat.rate.standard'), law('vat.rate.agri'), law('tax.indirect.other')] },
  { id: 'p_tax_absorb', label: 'người bán tự gánh một phần thuế mới bằng cách hạ biên lãi (thuế giảm thì giữ lại một phần)', upstream: [law('vat.rate.standard'), law('vat.rate.agri'), law('tax.indirect.other')] },
  { id: 'p_mix', label: 'người mua đổi nơi mua, người bán cũ và mới thay nhau', upstream: [] },
  // lương
  { id: 'w_shortage', label: 'không tuyển đủ người nên nâng lương', upstream: [ind('vacancies', 1), ind('unemployment', 1)] },
  { id: 'w_slack', label: 'nhiều người thất nghiệp nên hạ lương', upstream: [ind('unemployment', 1)] },
  { id: 'w_index', label: 'đợt xét lương năm theo lạm phát 12 tháng qua', upstream: [ind('inflation.yoy', 1)] },
  { id: 'w_index_exp', label: 'đợt xét lương năm theo lạm phát kỳ vọng', upstream: [ind('inflation.expected', 1)] },
  { id: 'w_tight', label: 'đợt xét lương năm tăng thêm vì ít người thất nghiệp', upstream: [ind('unemployment', 1)] },
  { id: 'w_slack_review', label: 'đợt xét lương năm tăng ít đi vì nhiều người thất nghiệp', upstream: [ind('unemployment', 1)] },
  { id: 'w_minwage', label: 'lương tối thiểu vùng buộc nâng lương', upstream: [law('minwage.zone.1'), law('minwage.zone.2'), law('minwage.zone.3'), law('minwage.zone.4')] },
  // tiêu dùng
  { id: 'c_income', label: 'thu nhập kỳ vọng của hộ đổi', upstream: [ind('gdp.nominal', 1), ind('unemployment', 1)] },
  { id: 'c_conf', label: 'hộ tiết kiệm phòng thân vì quanh mình nhiều người mất việc', upstream: [ind('unemployment', 1)] },
  { id: 'c_infl', label: 'hộ mua sớm vì sợ giá tăng nhanh hơn lãi tiền gửi', upstream: [ind('inflation.expected', 1), law('cb.rate.refinancing')] },
  { id: 'c_wealth', label: 'của cải của hộ đổi', upstream: [ind('money.m2', 1)] },
  { id: 'c_cashlimit', label: 'hộ không đủ tiền để tiêu như muốn', upstream: [ind('money.m2', 1)] },
  { id: 'c_supply', label: 'muốn mua nhưng nơi bán hết hàng', upstream: [ind('unmet')] },
  // việc làm
  { id: 'u_fired_demand', label: 'doanh nghiệp bán chậm nên cắt người', upstream: [ind('consumption', 1)] },
  { id: 'u_cannot_pay', label: 'doanh nghiệp không đủ tiền trả lương', upstream: [ind('credit.denied'), ind('consumption', 1)] },
  { id: 'u_public_cut', label: 'Nhà nước giảm biên chế', upstream: [law('gov.public.share')] },
  { id: 'u_hired_public', label: 'Nhà nước tuyển người', upstream: [law('gov.public.share')] },
  { id: 'u_hired_formal', label: 'doanh nghiệp tuyển người', upstream: [ind('consumption', 1), ind('investment', 1)] },
  { id: 'u_hired_informal', label: 'hộ kinh doanh thuê người', upstream: [ind('consumption', 1)] },
  { id: 'u_job_switch', label: 'người lao động đổi chỗ làm', upstream: [] },
  { id: 'u_turnover', label: 'người làm thuê rời chỗ làm (luân chuyển tự nhiên)', upstream: [] },
  { id: 'u_solo_closed', label: 'người tự làm bỏ nghề', upstream: [] },
  { id: 'u_hkd_closed', label: 'hộ kinh doanh đóng cửa', upstream: [ind('consumption', 1)] },
  { id: 'u_bankrupt', label: 'doanh nghiệp phá sản', upstream: [ind('firms.bankrupt')] },
  { id: 'u_self_employed', label: 'người thất nghiệp lâu tự mở việc làm', upstream: [ind('informal.share')] },
  // tín dụng
  { id: 'cr_repay', label: 'dòng tiền của người vay không đủ trả nợ', upstream: [ind('consumption', 1), law('cb.rate.refinancing')] },
  { id: 'cr_leverage', label: 'người vay đã nợ quá nhiều so với tài sản', upstream: [ind('credit', 1)] },
  { id: 'cr_capital', label: 'ngân hàng thiếu vốn tự có', upstream: [ind('bank.car'), law('bank.car.min')] },
  { id: 'cr_room', label: 'ngân hàng hết room tín dụng', upstream: [law('cb.credit.room'), law('cb.room.enabled')] },
  { id: 'cr_reserves', label: 'ngân hàng hết dự trữ dư để cho vay (biến thể trung gian)', upstream: [law('cb.reserve.ratio'), ind('bank.reserves')] },
  { id: 'cr_new', label: 'ngân hàng cho vay mới', upstream: [ind('credit.demand'), ind('credit.denied')] },
  { id: 'cr_repaid', label: 'người vay trả gốc', upstream: [] },
  { id: 'cr_writeoff', label: 'ngân hàng xoá nợ không đòi được', upstream: [ind('firms.bankrupt')] },
  // tiền
  { id: 'm_loan_new', label: 'ngân hàng cho vay, tạo tiền gửi mới', upstream: [ind('credit.new')] },
  { id: 'm_loan_repay', label: 'người vay trả gốc, tiền gửi bị huỷ', upstream: [] },
  { id: 'm_gov_spend', label: 'Chính phủ chi tiêu', upstream: [ind('gov.spending')] },
  { id: 'm_tax', label: 'nộp thuế', upstream: [ind('gov.revenue')] },
  { id: 'm_bank_interest', label: 'lãi trả cho và nhận từ ngân hàng', upstream: [ind('rate.lending')] },
  { id: 'm_dividend', label: 'cổ tức', upstream: [] },
  { id: 'm_bond', label: 'trái phiếu chính phủ: mua, lãi, gốc', upstream: [ind('gov.debt')] },
  { id: 'm_init', label: 'khởi tạo', upstream: [] },
  { id: 'm_other', label: 'các dòng khác với ngân hàng và Nhà nước', upstream: [] },
  // GDP
  { id: 'gdp_c', label: 'tiêu dùng của hộ', upstream: [ind('consumption')] },
  { id: 'gdp_g', label: 'chi tiêu của Chính phủ', upstream: [law('gov.purchase.share'), law('gov.public.share'), ind('gov.purchaseCut')] },
  { id: 'gdp_i', label: 'đầu tư máy móc', upstream: [ind('utilisation', 1), ind('credit.denied')] },
  { id: 'gdp_inv', label: 'thay đổi tồn kho', upstream: [ind('consumption')] },
  // ngân sách
  { id: 't_vat', label: 'thuế GTGT', upstream: [law('vat.rate.standard'), ind('consumption')] },
  { id: 't_pit', label: 'thuế TNCN', upstream: [law('pit.deduction.self'), ind('wage.formal')] },
  { id: 't_cit', label: 'thuế TNDN', upstream: [law('cit.rate.standard')] },
  { id: 't_hkd', label: 'thuế hộ kinh doanh', upstream: [law('hkd.threshold')] },
  { id: 't_excise', label: 'thuế gián thu khác', upstream: [law('tax.indirect.other'), ind('consumption')] },
  { id: 't_fees', label: 'thu từ đất, phí, lệ phí', upstream: [law('gov.fees.rate'), ind('gdp.nominal')] },
  { id: 't_other', label: 'cổ tức doanh nghiệp, ngân hàng nhà nước và lợi nhuận NHNN', upstream: [] },
  // lương thực
  { id: 'rw_price', label: 'giá tiêu dùng đổi', upstream: [ind('cpi')] },
  { id: 'rw_mix', label: 'người lao động chuyển giữa nơi trả cao và nơi trả thấp', upstream: [ind('informal.share'), ind('unemployment')] },
  // bội chi so với GDP
  { id: 'd_wage_public', label: 'lương công chức', upstream: [law('gov.public.share'), ind('wage.formal', 1)] },
  { id: 'd_purchase', label: 'Chính phủ mua hàng', upstream: [law('gov.purchase.share'), ind('gov.purchaseCut')] },
  { id: 'd_transfer', label: 'trợ cấp cho hộ', upstream: [law('gov.transfer.universal'), ind('unemployment')] },
  { id: 'd_interest', label: 'lãi trái phiếu Chính phủ trả', upstream: [ind('gov.debt', 1), law('cb.rate.refinancing')] },
  { id: 'd_recap', label: 'Nhà nước bỏ tiền cứu ngân hàng', upstream: [ind('bank.car'), ind('npl')] },
  { id: 'd_spend_other', label: 'các khoản chi khác', upstream: [] },
  { id: 'd_revenue', label: 'thu ngân sách đổi (thu tăng thì bội chi giảm)', upstream: [ind('gov.revenue')] },
  { id: 'd_gdp', label: 'GDP đổi (cùng số tiền bội chi, GDP lớn hơn thì tỷ lệ nhỏ hơn)', upstream: [ind('gdp.nominal')] },
  // nợ công so với GDP
  { id: 'b_primary', label: 'chi vượt thu, chưa kể tiền lãi', upstream: [ind('gov.deficitGdp')] },
  { id: 'b_interest', label: 'tiền lãi trái phiếu phải vay thêm để trả', upstream: [ind('gov.debt', 1), law('cb.rate.refinancing')] },
  { id: 'b_cash', label: 'kho bạc giữ thêm tiền (vay trước, chi sau)', upstream: [ind('gov.tga')] },
  { id: 'b_gdp', label: 'GDP đổi (cùng số nợ, GDP lớn hơn thì tỷ lệ nhỏ hơn)', upstream: [ind('gdp.nominal')] },
  // dự trữ ngân hàng
  { id: 'r_cash', label: 'dân rút hoặc nộp tiền mặt', upstream: [ind('money.cash'), ind('informal.consShare')] },
  { id: 'r_omo', label: 'NHNN mua lại trái phiếu của ngân hàng (thị trường mở)', upstream: [law('cb.omo.auto'), ind('money.cash')] },
  { id: 'r_refi', label: 'ngân hàng vay hoặc trả tái cấp vốn', upstream: [law('cb.omo.auto'), law('cb.reserve.ratio')] },
  // người chơi
  { id: 'p_player', label: 'người chơi tự đặt giá', upstream: [root('Quyết định của người chơi')] },
  { id: 'w_player', label: 'người chơi tự đặt lương', upstream: [root('Quyết định của người chơi')] },
  { id: 'c_player', label: 'người chơi tự đặt mức chi tiêu', upstream: [root('Quyết định của người chơi')] },
  { id: 'u_quit', label: 'người chơi tự nghỉ việc', upstream: [root('Quyết định của người chơi')] },
  { id: 'root_tech', label: 'năng suất', upstream: [root('Năng suất lao động không đổi ở GĐ1')] },
];

const C = 'Caiani và cộng sự 2016';
const RULES: RuleDef[] = [
  { id: 'firm.wage', label: 'Lương chào của doanh nghiệp', source: `${C} 3.5; tự thiết kế phần lương cứng chiều xuống`, teaches: 'Vì sao suy thoái sinh thất nghiệp', variants: [{ id: 'base', label: 'Lương cứng chiều xuống' }, { id: 'flex', label: 'Lương giảm được khi thất nghiệp cao' }] },
  { id: 'firm.wageIndexBase', label: 'Đợt xét lương năm bám lạm phát nào', source: 'Rabanal và Sbrancia 2024, IMF WP/24/105: lương bám lạm phát CPI năm trước. Thiết kế mục 10 ghi lạm phát kỳ vọng; Dương quyết 14/11/2026 theo bằng chứng (docs/design/sai-khac.md D5)', teaches: 'Lương nhìn về sau hay nhìn về trước làm lạm phát dai dẳng khác nhau thế nào', variants: [{ id: 'base', label: 'Lạm phát 12 tháng qua' }, { id: 'expected', label: 'Lạm phát kỳ vọng' }] },
  { id: 'hh.segments', label: 'Hàng của hộ kinh doanh và hàng của doanh nghiệp', source: 'Tự thiết kế; cơ sở: La Porta và Shleifer 2014, Böhme và Thiele 2012 (docs/design/sai-khac.md S1)', teaches: 'Vì sao khu vực phi chính thức tồn tại dai dẳng', variants: [{ id: 'base', label: 'Hai loại hàng không thay thế hoàn toàn' }, { id: 'homogeneous', label: 'Một loại hàng, ai rẻ hơn thì thắng' }] },
  { id: 'firm.price', label: 'Giá bán = chi phí đơn vị × (1 + biên lãi)', source: `${C} 3.6-3.7. Thứ tự phân rã: lương, vốn, biên lãi, phần thuế người bán tự gánh, kỳ vọng, thuế`, variants: [{ id: 'base', label: 'Gốc' }] },
  { id: 'firm.dividend', label: 'Chia cổ tức', source: `${C}`, teaches: 'Sở hữu đóng góp bao nhiêu vào bất bình đẳng', variants: [{ id: 'base', label: 'Theo cổ phần' }, { id: 'equal', label: 'Chia đều cho mọi hộ' }] },
  { id: 'firm.bankruptcy', label: 'Phá sản', source: `${C} 3.3`, teaches: 'Ràng buộc ngân sách mềm', variants: [{ id: 'base', label: 'Có phá sản' }, { id: 'bailout', label: 'Nhà nước cứu mọi doanh nghiệp' }] },
  { id: 'exp.inflation', label: 'Lạm phát kỳ vọng', source: 'Tự thiết kế, hướng theo De Grauwe 2011', teaches: 'Kỳ vọng làm lạm phát dai dẳng tới đâu', variants: [{ id: 'base', label: 'Tin một phần vào mục tiêu' }, { id: 'off', label: 'Tắt' }, { id: 'anchored', label: 'Neo tuyệt đối vào mục tiêu' }] },
  { id: 'exp.confidence', label: 'Niềm tin của hộ', source: 'Tự thiết kế; tiết kiệm phòng thân', teaches: 'Suy thoái tự khuếch đại bao nhiêu', variants: [{ id: 'base', label: 'Bật' }, { id: 'off', label: 'Tắt' }] },
  { id: 'hh.wealthEffect', label: 'Tiêu dùng theo của cải', source: `${C} 3.15`, variants: [{ id: 'base', label: 'Có' }, { id: 'off', label: 'Không' }] },
  { id: 'hh.search', label: 'Thông tin của người mua', source: 'Lengnick 2011; Caiani', teaches: 'Thông tin hạn chế tạo ra phân tán giá và quyền định giá', variants: [{ id: 'base', label: '5 người bán quen mỗi ngành' }, { id: 'perfect', label: 'Biết giá mọi người bán' }] },
  { id: 'hh.fallback', label: 'Lối thoát phi chính thức', source: 'Tự thiết kế (T2)', variants: [{ id: 'base', label: 'Thất nghiệp lâu thì tự làm' }, { id: 'off', label: 'Không có' }] },
  { id: 'tax.compliance', label: 'Tuân thủ thuế của hộ kinh doanh', source: 'Tự thiết kế', teaches: 'Cơ sở thuế thật hẹp cỡ nào', variants: [{ id: 'base', label: 'Khai một phần doanh thu' }, { id: 'full', label: 'Nộp đủ' }] },
  { id: 'bank.lending', label: 'Ngân hàng cho vay', source: 'McLeay và cộng sự 2014 (BoE); Caiani', teaches: 'Hai cách hiểu về ngân hàng cho ra hai nền kinh tế khác nhau', variants: [{ id: 'base', label: 'Cho vay tạo tiền gửi mới' }, { id: 'intermediary', label: 'Chỉ cho vay phần dự trữ dư' }] },
  { id: 'bank.credit', label: 'Xét duyệt tín dụng', source: `${C} 3.13 giản lược; BAM; K+S`, variants: [{ id: 'base', label: 'Gốc' }] },
  { id: 'bank.failure', label: 'Ngân hàng mất vốn', source: 'Tự thiết kế; Caiani cho biến thể', variants: [{ id: 'base', label: 'Nhà nước tái cấp vốn' }, { id: 'bailin', label: 'Người gửi tiền gánh lỗ' }] },
];

export const gd1Module: EngineModule = {
  id: 'gd1',
  stage: 1,
  dependsOn: [],
  schemaVersion: 1,
  params: GD1_PARAMS,
  setup: setupSchema,
  init(w, eng) {
    initWorld(w, eng);
    w.params._target = eng.law(w, 'cb.inflation.target');
  },
  phases: {
    policy(w, eng) {
      resetMonth(st(w));
      w.params._target = eng.law(w, 'cb.inflation.target');
      policy(w, eng);
    },
    expect(w, eng) {
      householdBudgets(w, eng);
      playerHousehold(w, eng);
    },
    plan(w, eng) {
      planFirms(w, eng);
      playerFirm(w, eng);
    },
    credit: creditMarket,
    labor: laborMarket,
    produce,
    pay(w, eng) {
      payWages(w, eng);
      payPublic(w, eng);
    },
    goods(w, eng) {
      govPurchases(w, eng);
      shopping(w, eng);
    },
    tax: payTaxes,
    debt(w, eng) {
      debtService(w, eng);
      bondService(w, eng);
    },
    profit: profits,
    exit: exitAndEntry,
    banking(w, eng) {
      cashManagement(w, eng); // tiền mặt thừa về lại ngân hàng trước khi ngân hàng tính dự trữ
      bankHousekeeping(w, eng);
      bondAuction(w, eng);
    },
    close: closeMonth,
  },
  indicators: GD1_INDICATORS,
  reasons: REASONS,
  rules: RULES,
};

export function gd1Engine(): Engine {
  return new Engine([gd1Module]);
}
