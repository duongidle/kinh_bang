// Nội dung học của GĐ1: mô hình bỏ qua gì (đề xuất S13), và các ghi chú để người chơi không tưởng hành vi lạ là lỗi.
// Số liệu trong các ghi chú lấy từ kiểm định (docs/validation, docs/design/sai-khac.md), không viết tay cho hợp ý.

export interface Note {
  id: string;
  title: string;
  body: string[];
  /** Hiện ghi chú này cạnh các luật có mã bắt đầu bằng một trong các tiền tố. */
  near?: string[];
}

export const OMISSIONS: string[] = [
  'Nền kinh tế đóng: không có tỷ giá, xuất nhập khẩu, vàng hay đô la. Lạm phát chỉ sinh ra từ bên trong.',
  'Không tăng năng suất, không tăng dân số: không có tăng trưởng dài hạn. GDP thực chỉ lên xuống theo chu kỳ.',
  'Mỗi hộ một người lao động, lao động như nhau: chưa có kỹ năng, học vấn, tuổi tác.',
  'Hộ không vay. Không có đất và nhà, tức là thiếu kênh tín dụng lớn nhất của Việt Nam.',
  'Doanh nghiệp không mua nguyên liệu của nhau: không có chuỗi cung ứng.',
  'Ngân hàng thiếu dự trữ thì NHNN tự cho vay; chưa có thị trường liên ngân hàng.',
  'Thuế: gom thuế suất GTGT theo ngành; không quyết toán thuế TNCN cuối năm; không chuyển lỗ, không ưu đãi thuế TNDN.',
  'Chưa có bảo hiểm xã hội và bảo hiểm thất nghiệp.',
  'Hộ kinh doanh không chuyển lên doanh nghiệp được, nên đánh thuế họ không làm khu vực phi chính thức nhỏ đi.',
  'Vị trí trên bản đồ chỉ để nhìn. Khoảng cách chưa có ý nghĩa kinh tế.',
  'Thu ngân sách có ba khoản gộp thay cho nhiều sắc thuế thật: thuế gián thu khác, thu từ đất và phí, cổ tức doanh nghiệp nhà nước.',
];

export const NOTES: Note[] = [
  {
    id: 'lai-suat-yeu',
    title: 'Vì sao ở giai đoạn này lãi suất yếu, còn room tín dụng thì mạnh?',
    near: ['cb.rate.', 'cb.credit.room', 'cb.room.'],
    body: [
      'Đây không phải lỗi. Nó là hệ quả của những gì mô hình hiện có và chưa có.',
      'Lãi suất hãm nền kinh tế qua người đi vay. Ở giai đoạn này chỉ doanh nghiệp vay, và họ vay để mua máy. Hộ gia đình không vay: không vay mua nhà, không vay tiêu dùng. Kênh lớn nhất ngoài đời (lãi suất tăng, người ta bớt vay mua nhà mua xe) chưa tồn tại.',
      'Kênh còn lại tới hộ là "lãi tiền gửi cao thì hoãn mua". Mô hình lấy mức phản ứng theo nghiên cứu (Havránek 2015): lãi suất thực cao hơn 1 điểm thì tiêu dùng năm đó chỉ thấp hơn khoảng 0,35%. Nhỏ.',
      'Trong khi đó lãi suất cao có một tác dụng ngược. Chính phủ là con nợ lớn nhất. Lãi suất tăng thì tiền lãi trái phiếu tăng, và tiền lãi đó là thu nhập của ngân hàng và người gửi tiền. Nếu Bộ Tài chính không cắt chi để bù, giữ lãi suất cao vài năm sẽ bơm thêm tiền qua cửa ngân sách. Trong kiểm định, tăng lãi suất 6 điểm và giữ nguyên làm lạm phát cao hơn gần 2 điểm ở năm thứ năm. Kịch bản "Hai tay lái" cho cậu tự thấy.',
      'Room tín dụng thì là trần số lượng, không phải giá. Ngân hàng hết hạn mức là dừng cho vay, bất kể doanh nghiệp chịu trả lãi bao nhiêu. Nó chặn thẳng nguồn tạo tiền, nên tác dụng thấy ngay: trong kiểm định, room 2% mỗi năm làm dư nợ thấp hơn khoảng một phần tư và đầu tư thấp hơn tương tự. Cái giá là hồ sơ yếu bị loại trước, kể cả dự án tốt của doanh nghiệp nhỏ.',
      'Ngoài đời lãi suất mạnh hơn ở đây nhiều. Khi mô hình có vay tiêu dùng, nhà đất và tỷ giá (các giai đoạn sau), kết luận này sẽ đổi.',
    ],
  },
  {
    id: 'lam-phat-thap',
    title: 'Vì sao để yên thì lạm phát gần bằng 0?',
    near: ['cb.inflation.target'],
    body: [
      'Trong mô hình không có gì tự đẩy giá lên đều đặn: năng suất và dân số đứng yên, ngân sách gần cân, lương chỉ bám một nửa lạm phát của năm vừa qua. Giá chỉ tăng khi có cú đẩy: in tiền, chi tiêu công, tín dụng mở rộng.',
      'Vì vậy mục tiêu lạm phát của NHNN tự nó không kéo được lạm phát về đúng mức. Khi lạm phát thật lệch xa mục tiêu lâu, người dân thôi tin vào mục tiêu.',
    ],
  },
  {
    id: 'doi-luat-khong-thay-gi',
    title: 'Đổi một luật mà không thấy gì xảy ra?',
    near: ['pit.', 'minwage.', 'hkd.threshold'],
    body: [
      'Một luật chỉ có tác dụng khi nó chạm tới ai đó. Vài luật ở mức hiện hành không chạm ai trong mô hình này.',
      'Thuế thu nhập cá nhân: mức giảm trừ cho bản thân là 15,5 triệu đồng mỗi tháng, cao hơn lương của gần như mọi hộ trong mô hình (khoảng 6 triệu). Đổi thuế suất các bậc thì không ai nộp thêm. Hạ mức giảm trừ mới thấy tác dụng. Lý do: lao động ở giai đoạn này như nhau, chưa có người lương cao.',
      'Lương tối thiểu vùng: sàn hiện hành thấp hơn nhiều so với lương doanh nghiệp đang trả. Nâng vài phần trăm không buộc ai tăng lương. Phải nâng lên sát lương bình quân mới ràng buộc.',
      'Ngưỡng miễn thuế của hộ kinh doanh: ở mức 1 tỷ đồng mỗi năm, hầu hết hộ kinh doanh trong mô hình được miễn. Hạ xuống vài trăm triệu mới có hộ phải nộp.',
      'Muốn biết chắc một quyết định có tác dụng hay không, bấm "Nếu không làm vậy thì sao?" ở dòng sự kiện. Hai đường trùng nhau nghĩa là luật đó không chạm ai.',
    ],
  },
  {
    id: 'phan-ra-va-doi-chung',
    title: 'Hai loại câu trả lời "vì sao"',
    body: [
      'Phân rã: chia mức thay đổi của một chỉ số theo các lý do trực tiếp, lấy từ sổ cái và bản ghi quyết định của từng tác nhân. Cộng lại đúng bằng mức thay đổi. Nó không trả lời "nếu không có chính sách này thì sao".',
      'Đối chứng: dựng một thế giới song song cùng hạt giống, bỏ đúng một quyết định, chạy lại tới hiện tại rồi so. Đây mới là câu trả lời nhân quả. Khi nhiều nguyên nhân tác động lẫn nhau, hãy tin phần đối chứng hơn phần phân rã.',
    ],
  },
];
