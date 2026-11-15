// Bảng thuật ngữ (spec gd1-5.md mục 3.5). Mỗi khái niệm một từ, một câu định nghĩa.
// Mọi nơi trên giao diện dùng đúng `term`; chú thích khi rê chuột lấy chữ từ `def`, không viết tại chỗ.

export interface GlossaryEntry {
  id: string; // kebab-case không dấu
  term: string; // từ dùng thống nhất trên giao diện
  short?: string; // dạng viết tắt được phép, nếu có
  def: string; // MỘT câu định nghĩa
  avoid?: string[]; // từ KHÔNG dùng cho khái niệm này
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  { id: 'phan-ra', term: 'Phân rã', def: 'Tách mức đổi của một chỉ số thành phần đóng góp trực tiếp của từng nguyên nhân, các phần cộng lại đúng bằng mức đổi.', avoid: ['phân tích', 'breakdown'] },
  { id: 'doi-chung', term: 'Đối chứng', def: 'Chạy lại cùng hạt giống nhưng bỏ một quyết định, để xem nếu không làm vậy thì sao.', avoid: ['phản thực', 'counterfactual', 'kịch bản giả định'] },
  { id: 'chuoi-nhan-qua', term: 'Chuỗi nhân quả', def: 'Đường đi từ một con số về các quyết định và giao dịch đã tạo ra nó.' },
  { id: 'hat-giong', term: 'Hạt giống', def: 'Con số quyết định mọi yếu tố ngẫu nhiên của ván, cùng hạt giống và cùng lệnh thì ra cùng kết quả.', avoid: ['seed'] },
  { id: 'tac-nhan', term: 'Tác nhân', def: 'Một hộ, doanh nghiệp, ngân hàng hay cơ quan nhà nước tự ra quyết định trong mô hình.', avoid: ['agent'] },
  { id: 'lam-nong', term: 'Làm nóng', def: 'Chạy trước 20 năm cho nền kinh tế qua giai đoạn khởi động rồi mới giao ván cho bạn.' },
  { id: 'phong-thi-nghiem', term: 'Phòng thí nghiệm', def: 'Nơi sửa quy luật hành vi của tác nhân, thế giới đã sửa luôn có dải cảnh báo.' },
  { id: 'du-no', term: 'Dư nợ', def: 'Tổng số tiền còn phải trả của các khoản vay tại một thời điểm.', avoid: ['tổng nợ vay'] },
  { id: 'tin-dung', term: 'Tín dụng', def: 'Tiền ngân hàng cho vay.' },
  { id: 'tien-gui', term: 'Tiền gửi', def: 'Tiền hộ và doanh nghiệp để trong ngân hàng, mỗi khoản ngân hàng cho vay tạo thêm một khoản tiền gửi mới.' },
  { id: 'room-tin-dung', term: 'Room tín dụng', def: 'Mức tăng dư nợ tối đa trong năm mà NHNN cho phép mỗi ngân hàng.', avoid: ['hạn mức tín dụng', 'trần tín dụng'] },
  { id: 'lai-suat-tai-cap-von', term: 'Lãi suất tái cấp vốn', def: 'Lãi suất NHNN tính khi cho ngân hàng vay.', avoid: ['lãi suất cơ bản'] },
  { id: 'du-tru-bat-buoc', term: 'Dự trữ bắt buộc', def: 'Khoản tiền ngân hàng phải giữ ở NHNN, tính bằng một tỷ lệ trên tiền gửi.' },
  { id: 'ty-le-an-toan-von', term: 'Tỷ lệ an toàn vốn', def: 'Vốn của ngân hàng so với các khoản cho vay có rủi ro.', avoid: ['CAR'] },
  { id: 'nhnn', term: 'Ngân hàng Nhà nước', short: 'NHNN', def: 'Cơ quan đặt lãi suất tái cấp vốn, dự trữ bắt buộc và room tín dụng.', avoid: ['ngân hàng trung ương'] },
  { id: 'in-tien', term: 'In tiền', def: 'NHNN mua phần trái phiếu Chính phủ không bán hết và trả bằng tiền mới tạo ra.' },
  { id: 'trai-phieu-chinh-phu', term: 'Trái phiếu Chính phủ', def: 'Giấy nợ Chính phủ bán để vay tiền, trả lãi đều và trả gốc khi đến hạn.' },
  { id: 'boi-chi', term: 'Bội chi ngân sách', short: 'Bội chi', def: 'Phần chi của Chính phủ vượt quá phần thu, phải vay để bù.', avoid: ['thâm hụt'] },
  { id: 'no-cong', term: 'Nợ công', def: 'Tổng số tiền Chính phủ đang nợ.' },
  { id: 'cpi', term: 'Chỉ số giá tiêu dùng', short: 'CPI', def: 'Mức giá của giỏ hàng hộ gia đình mua, so với tháng gốc.' },
  { id: 'lam-phat', term: 'Lạm phát', def: 'Mức tăng của chỉ số giá tiêu dùng so với cùng kỳ năm trước.' },
  { id: 'lam-phat-ky-vong', term: 'Lạm phát kỳ vọng', def: 'Mức lạm phát mà hộ và doanh nghiệp đoán cho năm tới.' },
  { id: 'gdp-danh-nghia', term: 'GDP danh nghĩa', def: 'Giá trị hàng hoá và dịch vụ làm ra trong tháng, tính theo giá của tháng đó.' },
  { id: 'gdp-thuc', term: 'GDP thực', def: 'GDP tính theo giá gốc, nên chỉ đổi khi lượng hàng làm ra đổi.' },
  { id: 'that-nghiep', term: 'Tỷ lệ thất nghiệp', short: 'Thất nghiệp', def: 'Phần người muốn đi làm mà chưa có việc.' },
  { id: 'phi-chinh-thuc', term: 'Khu vực phi chính thức', short: 'Phi chính thức', def: 'Hộ kinh doanh và người làm cho họ, nằm ngoài phần lớn luật thuế và luật lao động.', avoid: ['kinh tế ngầm'] },
  { id: 'gini', term: 'Hệ số Gini', short: 'Gini', def: 'Số từ 0 đến 1 đo mức chênh lệch, 0 là mọi người bằng nhau, 1 là một người có tất cả.' },
  { id: 'bien-lai', term: 'Biên lãi', def: 'Phần giá bán cao hơn chi phí của mỗi đơn vị hàng, tính theo tỷ lệ.', avoid: ['biên lợi nhuận'] },
  { id: 'chuyen-thue-vao-gia', term: 'Chuyển thuế vào giá', def: 'Phần thay đổi thuế mà người bán đưa vào giá bán cho người mua.' },
  { id: 'luong-toi-thieu-vung', term: 'Lương tối thiểu vùng', def: 'Mức lương thấp nhất doanh nghiệp được trả, khác nhau theo bốn vùng.' },
  { id: 'gtgt', term: 'Thuế giá trị gia tăng', short: 'Thuế GTGT', def: 'Thuế cộng vào giá bán hàng hoá và dịch vụ.', avoid: ['VAT'] },
  { id: 'tncn', term: 'Thuế thu nhập cá nhân', short: 'Thuế TNCN', def: 'Thuế tính trên lương và cổ tức của người dân.' },
  { id: 'tndn', term: 'Thuế thu nhập doanh nghiệp', short: 'Thuế TNDN', def: 'Thuế tính trên lợi nhuận của doanh nghiệp.' },
  { id: 'diem-phan-tram', term: 'Điểm phần trăm', def: 'Hiệu của hai tỷ lệ, lạm phát từ 3% lên 5% là tăng 2 điểm phần trăm.' },
];

const BY_ID = new Map(GLOSSARY.map((e) => [e.id, e]));

/** Tra một mục theo id. Ném lỗi nếu không có, để chữ sai không lọt lên giao diện. */
export function term(id: string): GlossaryEntry {
  const e = BY_ID.get(id);
  if (!e) throw new Error(`Bảng thuật ngữ không có mục "${id}"`);
  return e;
}
