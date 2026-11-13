// Danh mục loại giao dịch. Thứ tự cố định: số thứ tự được lưu trong ván.
// flow = true: giao dịch làm đổi tài sản tài chính ròng của hai bên (thu nhập, chi tiêu, thuế...).
// flow = false: chỉ hoán đổi giữa các loại tài sản và nợ (vay, trả gốc, rút tiền mặt, mua trái phiếu).

export interface TxKindDef {
  id: string;
  label: string;
  flow: boolean;
}

export const TX_KINDS: TxKindDef[] = [
  { id: 'wage', label: 'Lương', flow: true },
  { id: 'wage_public', label: 'Lương công chức', flow: true },
  { id: 'consumption', label: 'Mua hàng tiêu dùng', flow: true },
  { id: 'gov_purchase', label: 'Chính phủ mua hàng', flow: true },
  { id: 'investment', label: 'Mua máy móc', flow: true },
  { id: 'vat', label: 'Thuế GTGT', flow: true },
  { id: 'pit', label: 'Thuế TNCN', flow: true },
  { id: 'cit', label: 'Thuế TNDN', flow: true },
  { id: 'hkd_tax', label: 'Thuế hộ kinh doanh', flow: true },
  { id: 'dividend', label: 'Cổ tức', flow: true },
  { id: 'interest_loan', label: 'Lãi vay', flow: true },
  { id: 'interest_dep', label: 'Lãi tiền gửi', flow: true },
  { id: 'interest_bond', label: 'Lãi trái phiếu', flow: true },
  { id: 'interest_adv', label: 'Lãi tái cấp vốn', flow: true },
  { id: 'interest_res', label: 'Lãi dự trữ', flow: true },
  { id: 'transfer_social', label: 'Trợ cấp', flow: true },
  { id: 'cb_profit', label: 'Lợi nhuận NHNN nộp ngân sách', flow: true },
  { id: 'writeoff', label: 'Xoá nợ', flow: true },
  { id: 'equity', label: 'Góp vốn', flow: true },
  { id: 'bank_recap', label: 'Nhà nước tái cấp vốn ngân hàng', flow: true },
  { id: 'liquidation', label: 'Thanh lý tài sản', flow: true },
  { id: 'owner_draw', label: 'Chủ hộ kinh doanh rút lãi', flow: true },
  { id: 'loan_new', label: 'Khoản vay mới', flow: false },
  { id: 'loan_repay', label: 'Trả gốc', flow: false },
  { id: 'cash_withdraw', label: 'Rút tiền mặt', flow: false },
  { id: 'cash_deposit', label: 'Nộp tiền mặt', flow: false },
  { id: 'bond_issue', label: 'Phát hành trái phiếu', flow: false },
  { id: 'bond_redeem', label: 'Trả gốc trái phiếu', flow: false },
  { id: 'bond_trade', label: 'Mua bán trái phiếu', flow: false },
  { id: 'cb_lend', label: 'Vay tái cấp vốn', flow: false },
  { id: 'cb_repay', label: 'Trả tái cấp vốn', flow: false },
  { id: 'init', label: 'Khởi tạo', flow: true },
  { id: 'other', label: 'Khác', flow: true },
];

export const NKIND = TX_KINDS.length;
const index = new Map(TX_KINDS.map((k, i) => [k.id, i]));

export function tx(id: string): number {
  const i = index.get(id);
  if (i === undefined) throw new Error(`Loại giao dịch chưa đăng ký: ${id}`);
  return i;
}

export const MED_DEP = 0;
export const MED_CASH = 1;
