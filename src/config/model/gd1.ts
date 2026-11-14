// Tham số hành vi GĐ1.
//
// Bảng gốc: Caiani và cộng sự 2016, JEDC 69, Bảng 3 (trang 406), đọc trực tiếp từ PDF ngày 13/11/2026.
// Mô hình gốc chạy theo QUÝ. Giá trị gốc ghi lại nguyên văn ở CAIANI_TABLE3 để đối chiếu.
// Cách quy đổi sang tháng ghi ở từng tham số. "TTK" = tự thiết kế, chưa có mô hình tham chiếu.

import type { ParamDef } from '../../engine/core/engine';

export const CAIANI_TABLE3 = {
  g_ss: 0.0075, // tăng trưởng danh nghĩa mỗi quý ở trạng thái dừng
  households: 8000,
  consumptionFirms: 100,
  capitalFirms: 20,
  banks: 10,
  publicServants: 1360,
  u0: 0.08,
  mu_N: 2, // năng suất lao động ngành tư liệu
  mu_K: 1, // năng suất vốn
  l_K: 6.4, // tỷ lệ vốn/lao động
  chi_goods: 5, // số đối tác tiềm năng trên thị trường hàng hoá
  chi_credit: 3, // ... thị trường tiền gửi và tín dụng
  chi_labor: 10, // ... thị trường lao động, mỗi chỗ trống
  eps_credit: 4.62098, // cường độ lựa chọn thị trường tiền gửi-tín dụng
  eps_goods: 3.46574, // cường độ lựa chọn thị trường hàng hoá (chênh 20% giá → 50% đổi)
  nu: 0.1, // tỷ lệ tồn kho mục tiêu trên doanh số quý
  lambda: 0.25, // kỳ vọng thích nghi
  theta: 0.05, // tỷ lệ luân chuyển lao động
  markupC0: 0.318857,
  markupK0: 0.075,
  foldedNormal: [0, 0.0094] as const, // (mu, sigma^2) của bước điều chỉnh giá, lương, lãi suất
  tax: 0.18,
  loanDuration: 20, // quý
  capitalDuration: 20, // quý
  rBar: 0.04345, // tỷ suất lợi nhuận mục tiêu
  uBar: 0.8, // sử dụng công suất mục tiêu
  gamma1: 0.01,
  gamma2: 0.02,
  sigma: 1, // tiền gửi phòng thân = 1 kỳ quỹ lương
  rho_firm: 0.9, // tỷ lệ lợi nhuận chia cổ tức
  rho_bank: 0.6,
  iLoan0: 0.0075, // mỗi quý
  iDep0: 0.0025,
  CR_T: 0.17996, // tỷ lệ vốn mục tiêu ban đầu của ngân hàng
  LR_T: 0.258026342,
  riskAversionC: 3.92245,
  riskAversionK: 21.51335,
  iAdvance: 0.005,
  haircut: 0.5, // chiết khấu giá trị vốn của doanh nghiệp vỡ nợ
  w0: 5,
  dole: 0.4, // trợ cấp thất nghiệp so với lương bình quân
  upsilon: 0.08, // ngưỡng thất nghiệp trong hàm xét lại lương
  alpha1: 0.38581,
  alpha2: 0.25,
  iBonds: 0.0025,
} as const;

const C = 'Caiani 2016 Bảng 3';

export const GD1_PARAMS: ParamDef[] = [
  // ---------- hộ gia đình ----------
  { id: 'hh.alpha1', value: 0.5, label: 'Khuynh hướng tiêu dùng theo thu nhập', source: `${C}: α1 = 0,38581 (quý)`, note: 'Nâng lên 0,5 và hạ α2 để của cải mục tiêu của hộ khoảng 6 tháng thu nhập, cho nợ công ban đầu ở mức hợp lý. Hiệu chỉnh thô.' },
  { id: 'hh.alpha2', value: 0.0833, label: 'Khuynh hướng tiêu dùng theo của cải (tháng)', source: `${C}: α2 = 0,25 mỗi quý, chia 3` },
  { id: 'hh.inflationLoss', value: 1, label: 'Hộ trừ phần lạm phát ăn mòn tiền đang giữ khỏi thu nhập khi tính tiêu dùng (1 bật)', source: 'Godley và Lavoie 2007, thu nhập khả dụng thực kiểu Haig-Simons', note: 'Bằng 0 thì về đúng thiết kế mục 4.1. Khi đó lãi tiền gửi danh nghĩa tính trọn là thu nhập, lạm phát cao làm hộ thấy mình giàu lên, và lạm phát không có gì neo (sai-khac.md S26).' },
  { id: 'hh.lambdaInc', value: 0.25, label: 'Tốc độ cập nhật thu nhập kỳ vọng', source: `${C}: λ = 0,25` },
  { id: 'hh.foodMin', value: 15, label: 'Lương thực tối thiểu mỗi tháng (đơn vị hàng)', source: 'TTK; quy luật Engel', note: 'Khoảng một phần tư lương bình quân ở mức giá gốc.' },
  { id: 'hh.share.agri', value: 0.15, label: 'Phần ngân sách còn lại cho lương thực', source: 'TTK' },
  { id: 'hh.share.industry', value: 0.4, label: 'Phần ngân sách còn lại cho hàng công nghiệp', source: 'TTK' },
  { id: 'hh.sellers', value: 3, label: 'Số người bán quen mỗi phân khúc của mỗi ngành', source: `${C}: χ = 5 cho một loại hàng`, note: 'Mỗi ngành giờ có hai loại hàng (của hộ kinh doanh và của doanh nghiệp), mỗi loại 3 người bán quen. Cố định theo lược đồ.' },
  // phân khúc chính thức / phi chính thức (sai-khac.md S1)
  { id: 'seg.sigma', value: 2, label: 'Độ thay thế giữa hàng của hộ kinh doanh và hàng của doanh nghiệp', source: 'TTK. Cơ sở: La Porta và Shleifer 2014 (hai khu vực phục vụ nhu cầu khác nhau, không cạnh tranh trực diện); Böhme và Thiele 2012 (hàng phi chính thức hiếm khi bán qua kênh chính thức)', note: 'Bằng 1 thì tỷ lệ chi tiêu không đổi theo giá; rất lớn thì quay về hàng đồng nhất như bản cũ. Giá trị 2 là giá trị tạm, chưa có ước lượng cho Việt Nam.' },
  { id: 'seg.incomeEta', value: 0.3, label: 'Hộ khá giả hơn thì mua ở hộ kinh doanh ít hơn (độ co giãn)', source: 'TTK. Cơ sở: Böhme và Thiele 2012, World Development 40(7): thu nhập cao hơn thì ít mua hàng phi chính thức hơn', note: 'Bằng 0 thì tắt. Giá trị tạm.' },
  { id: 'seg.spill', value: 1, label: 'Phần cầu chuyển sang phân khúc kia khi mọi nơi quen đều hết hàng', source: 'TTK', note: 'Bằng 0 thì hai phân khúc tách hẳn.' },
  { id: 'hh.searchProb', value: 0.25, label: 'Xác suất xem thử người bán mới mỗi tháng', source: 'Lengnick 2011 Bảng 1: 0,25' },
  { id: 'hh.epsGoods', value: 3.46574, label: 'Cường độ đổi người bán theo chênh lệch giá', source: `${C}: ε = 3,46574` },
  { id: 'hh.applications', value: 5, label: 'Số nơi người thất nghiệp hỏi mỗi tháng', source: 'Lengnick 2011 mục 2.3: 5' },
  { id: 'hh.onJobSearch', value: 0.1, label: 'Xác suất người có việc hỏi thử nơi khác', source: 'Lengnick 2011: 0,1' },
  { id: 'hh.resWageDecay', value: 0.1, label: 'Lương đòi hỏi giảm mỗi tháng thất nghiệp', source: 'Lengnick 2011: 10%/tháng' },
  { id: 'hh.cashBuffer', value: 1.0, label: 'Tiền mặt giữ so với chi tiêu tiền mặt một tháng', source: 'TTK' },
  { id: 'hh.bankSwitch', value: 0.02, label: 'Xác suất mỗi năm xét đổi ngân hàng', source: `${C} 3.14, giản lược` },
  { id: 'hh.dependentsMean', value: 1.0, label: 'Số người phụ thuộc bình quân mỗi hộ', source: 'TTK, giá trị tạm' },
  // lối thoát phi chính thức (T2)
  { id: 'hh.fallbackMonths', value: 3, label: 'Số tháng thất nghiệp trước khi tự mở hộ kinh doanh', source: 'TTK' },
  { id: 'hh.fallbackWealth', value: 12, label: 'Ngưỡng của cải (tháng chi tiêu tối thiểu) để phải tự làm', source: 'TTK' },

  // ---------- doanh nghiệp ----------
  { id: 'firm.aL', value: 100, label: 'Năng suất lao động (đơn vị hàng/người/tháng)', source: 'Chuẩn hoá: giá gốc khoảng 100 nghìn đồng một đơn vị' },
  { id: 'firm.kappa.agri', value: 1300, label: 'Máy cần cho một lao động, nông nghiệp', source: 'TTK', note: 'Vốn cố định mỗi lao động khoảng một năm rưỡi lương. Thấp hơn thực tế để hộ trong mô hình đủ sức lập doanh nghiệp. Mức này quyết định tốc độ khu vực chính thức hút lao động khỏi khu vực phi chính thức.' },
  { id: 'firm.kappa.industry', value: 1700, label: 'Máy cần cho một lao động, công nghiệp', source: 'TTK' },
  { id: 'firm.kappa.services', value: 1300, label: 'Máy cần cho một lao động, dịch vụ', source: 'TTK' },
  { id: 'firm.depreciation', value: 1 / 120, label: 'Khấu hao máy mỗi tháng', source: `${C}: máy dùng 20 quý, khấu hao tuyến tính theo lô`, note: 'Mô hình dùng khấu hao đều 10 năm theo số dư, không theo lô. Đơn giản hoá.' },
  { id: 'firm.lambda', value: 0.25, label: 'Tốc độ cập nhật doanh số kỳ vọng', source: `${C}: λ = 0,25` },
  { id: 'firm.nu', value: 0.3, label: 'Tồn kho đệm so với doanh số tháng', source: `${C}: ν = 0,1 doanh số quý, tức 0,3 doanh số tháng` },
  { id: 'firm.nuServices', value: 0.1, label: 'Công suất làm dư của ngành dịch vụ so với doanh số kỳ vọng', source: 'TTK', note: 'Dịch vụ không tồn kho được, phần làm dư mất đi (gd1 mục 5.2). Dùng 0,3 như hàng hoá thì ngành dịch vụ bỏ phí gần một phần tư sức làm. Giá trị tạm.' },
  { id: 'firm.markup0', value: 0.25, label: 'Biên lãi ban đầu trên chi phí đơn vị', source: `${C}: 0,319 trên chi phí lao động; 0,1 trên tổng chi phí` },
  { id: 'firm.adjSigma', value: 0.0056, label: 'Độ lệch chuẩn bước điều chỉnh giá, lương, lãi suất (tháng)', source: `${C}: phân phối chuẩn gấp, phương sai 0,0094 mỗi quý`, note: 'Độ lệch chuẩn quý là 0,097; kỳ vọng mỗi bước 0,0075 theo phụ lục A. Tháng: chia 3 phương sai rồi co lại để kỳ vọng bước khoảng 0,0045.' },
  { id: 'firm.fireMax', value: 0.25, label: 'Tỷ lệ lao động tối đa bị sa thải mỗi tháng', source: 'TTK; ma sát sa thải' },
  { id: 'firm.wageSlackU', value: 0.05, label: 'Thất nghiệp trên mức này thì lương mềm mới giảm', source: `${C}: υ = 0,08`, note: 'Hạ xuống 5%.' },
  { id: 'firm.wageShortageStep', value: 1, label: 'Bước tăng lương khi không tuyển đủ người (số lần bước chuẩn)', source: `${C} 3.5` },
  { id: 'firm.wagePhillips', value: 0.5, label: 'Đợt xét lương năm cộng trừ theo thất nghiệp: mỗi điểm thất nghiệp dưới (trên) mức bình thường thì lương tăng thêm (bớt) bấy nhiêu điểm', source: `${C} 3.15: lương xét lại theo ngưỡng thất nghiệp υ; dạng tuyến tính là TTK`, note: 'Bằng 0 thì lương chỉ theo lạm phát kỳ vọng, lạm phát gần như không phản ứng với cầu, và lãi suất NHNN không hạ được lạm phát (sai-khac.md S25).' },
  { id: 'firm.wageIndex', value: 0.5, label: 'Phần lạm phát kỳ vọng đưa vào đợt xét lương năm ở doanh nghiệp', source: 'Rabanal và Sbrancia 2024, IMF WP/24/105 (Uruguay): lương bám một phần vào lạm phát CPI năm trước, hệ số cao nhất 0,48 (GMM); trong mô hình DSGE hệ số bám lương ước lượng 0,36-0,57. Bài này dẫn WEO 10/2022 chương 3: nhóm nước mới nổi cũng bám một phần. Đã đọc bản PDF ngày 14/11/2026', note: 'Lấy 0,5. Uruguay có thương lượng lương tập trung nên đây nhiều khả năng là cận trên cho Việt Nam. Không tìm được ước lượng riêng cho Việt Nam: Nguyen 2020 (Dynare WP 56) chỉ ước lượng mức bám của GIÁ trong nước, 0,06. Bằng chứng nói lương bám lạm phát quá khứ, ít bám lạm phát kỳ vọng; mô hình giữ lạm phát kỳ vọng theo thiết kế mục 10. Dương quyết 14/11/2026: bỏ mức 1 (S7).' },
  { id: 'hkd.wageIndex', value: 0.5, label: 'Phần lạm phát kỳ vọng đưa vào đợt xét lương năm ở hộ kinh doanh', source: 'Như firm.wageIndex', note: 'Không tìm được ước lượng riêng cho khu vực phi chính thức nên để bằng khu vực chính thức. Khác biệt đã có giữa hai khu vực là lương hộ kinh doanh giảm được (hkd.wageFlex).' },
  { id: 'firm.nairuWindow', value: 60, label: 'Số tháng làm trơn để tính mức thất nghiệp bình thường', source: 'Ball và Mankiw 2002, "The NAIRU in Theory and Practice", JEP 16(4): mức thất nghiệp không làm tăng tốc lạm phát đổi theo thời gian và được ước lượng bằng xu thế làm trơn (lọc Hodrick-Prescott) của thất nghiệp đã chỉnh theo thay đổi lạm phát. Đã đọc bản PDF ngày 14/11/2026', note: 'Mức thất nghiệp bình thường trong đợt xét lương là trung bình trượt mũ của chính thất nghiệp trong mô hình, không đặt tay. Đơn giản hoá: bỏ số hạng chỉnh theo thay đổi lạm phát; dùng trung bình trượt thay cho lọc HP vì phải tính từng tháng. Độ dài 60 tháng là tự thiết kế.' },
  { id: 'firm.gamma1', value: 0.01 / 3, label: 'Trọng số lợi nhuận trong hàm đầu tư (tháng)', source: `${C}: γ1 = 0,01 mỗi quý` },
  { id: 'firm.gamma2', value: 0.02, label: 'Trọng số sử dụng công suất trong hàm đầu tư (tháng)', source: `${C}: γ2 = 0,02 mỗi quý`, note: 'Quy đổi thẳng sang tháng là 0,0067. Dùng 0,02: doanh nghiệp trong mô hình chỉ vài người, với hệ số gốc phải mất nhiều năm mới mua đủ máy cho thêm một người. Hiệu chỉnh thô.' },
  { id: 'firm.gMax', value: 0.02, label: 'Tốc độ tăng máy tối đa mỗi tháng', source: 'TTK; chặn trên của hàm đầu tư' },
  { id: 'firm.invAdjust', value: 1 / 3, label: 'Phần thiếu hụt tồn kho đệm được bù mỗi tháng', source: `${C} 3.2: bù đủ trong một quý; ở bước tháng là một phần ba mỗi tháng`, note: 'Bằng 1 thì bù hết trong một tháng, sản lượng mong muốn giật mạnh gấp ba so với mô hình gốc theo quý.' },
  { id: 'firm.uBar', value: 0.8, label: 'Mức sử dụng công suất bình thường', source: `${C}: 0,8` },
  { id: 'firm.rBar', value: 0.04345 / 3, label: 'Tỷ suất lợi nhuận bình thường (tháng)', source: `${C}: 0,04345 mỗi quý` },
  { id: 'firm.liqBuffer', value: 1, label: 'Đệm tiền so với quỹ lương một tháng', source: `${C}: σ = 1` },
  { id: 'firm.dividend', value: 0.9, label: 'Tỷ lệ lợi nhuận sau thuế chia cổ tức', source: `${C}: ρ = 0,9` },
  { id: 'firm.haircut', value: 0.5, label: 'Chiết khấu khi thanh lý tài sản', source: `${C}: ι = 0,5` },
  { id: 'firm.distressMonths', value: 2, label: 'Số tháng không trả đủ trước khi phá sản', source: 'TTK' },
  { id: 'firm.entryRate', value: 0.6, label: 'Số doanh nghiệp mới mỗi tháng trên 1000 hộ, khi ngành lãi bình thường và máy chạy đủ', source: 'TTK', note: 'Ở 500 hộ là khoảng 3-4 doanh nghiệp mỗi năm.' },
  { id: 'firm.founders', value: 15, label: 'Số hộ cùng góp vốn lập một doanh nghiệp mới (người sáng lập và người góp vốn)', source: 'TTK; lúc khởi tạo mỗi doanh nghiệp cũng có khoảng 12 chủ. Caiani: mọi hộ góp vốn theo của cải', note: 'Thiết kế mục 5.7 ghi một hộ sáng lập. Một hộ trong mô hình không đủ tiền mua máy cho hai người làm.' },
  { id: 'firm.founderEquityMin', value: 0.3, label: 'Phần vốn cần mà nhóm sáng lập phải tự có', source: 'TTK; ngân hàng không cho vay toàn bộ vốn lập doanh nghiệp' },
  { id: 'firm.founderShare', value: 0.3, label: 'Phần tiền gửi người sáng lập bỏ vào doanh nghiệp mới', source: 'TTK' },
  { id: 'firm.turnover', value: 0.017, label: 'Tỷ lệ người làm thuê rời chỗ làm mỗi tháng', source: `${C}: θ = 0,05 mỗi quý, chia 3` },
  { id: 'firm.entryCapital', value: 60e6, label: 'Vốn góp tối thiểu để lập doanh nghiệp (theo giá gốc)', source: 'TTK' },
  { id: 'firm.initLeverage', value: 0.3, label: 'Tỷ lệ nợ trên vốn cố định lúc khởi tạo', source: 'TTK' },
  { id: 'firm.wage0', value: 8_000_000, label: 'Lương tháng ban đầu ở doanh nghiệp', source: 'Giá trị tạm, cỡ thu nhập bình quân lao động Việt Nam' },

  // ---------- hộ kinh doanh (TTK) ----------
  { id: 'hkd.productivity', value: 0.44, label: 'Năng suất so với doanh nghiệp chính thức', source: 'TTK; hướng theo La Porta và Shleifer 2014 (trí nhớ)', note: 'Đặt để giá của hộ kinh doanh lúc đầu ngang giá gồm thuế của doanh nghiệp. Hiệu chỉnh thô.' },
  { id: 'hkd.wageRatio', value: 0.6, label: 'Lương ở hộ kinh doanh so với doanh nghiệp lúc đầu', source: 'TTK; thu nhập lao động phi chính thức khoảng một nửa chính thức (Cục Thống kê, trí nhớ)' },
  { id: 'hkd.maxWorkers', value: 5, label: 'Số lao động tối đa kể cả chủ', source: 'TTK' },
  { id: 'hkd.declare', value: 0.5, label: 'Tỷ lệ doanh thu khai báo', source: 'TTK, chưa có số liệu' },
  { id: 'hkd.entryRate', value: 4, label: 'Số hộ kinh doanh mới mỗi tháng trên 1000 hộ, khi chủ hộ kinh doanh kiếm gấp ba người làm thuê', source: 'TTK' },
  { id: 'hkd.soloProductivity', value: 0.3, label: 'Năng suất của người tự làm một mình so với doanh nghiệp', source: 'TTK', note: 'Thấp hơn hộ kinh doanh có thuê người, để đi làm thuê vẫn hơn tự làm. Nhờ vậy người tự làm là lực lượng dự trữ của thị trường lao động (Lewis 1954).' },

  // ---------- ngân hàng ----------
  { id: 'bank.margin0', value: 0.035, label: 'Biên lãi suất cho vay ban đầu (năm)', source: `${C}: lãi vay 0,75%/quý so với lãi tái cấp vốn 0,5%/quý`, note: 'Đặt theo chênh lệch thực tế ở Việt Nam, khoảng 3-4 điểm. Giá trị tạm.' },
  { id: 'bank.riskPremium', value: 0.03, label: 'Phụ phí theo đòn bẩy người vay (năm, khi nợ bằng tài sản)', source: 'BAM: lãi suất tăng theo đòn bẩy' },
  { id: 'bank.depSpread', value: 0.005, label: 'Lãi tiền gửi thấp hơn lãi tái cấp vốn (năm)', source: `${C}: giản lược 3.14` },
  { id: 'bank.carTarget', value: 0.18, label: 'Tỷ lệ vốn mục tiêu của ngân hàng', source: `${C}: 0,18 ở trạng thái dừng` },
  { id: 'bank.dscr', value: 1.2, label: 'Dòng tiền phải gấp mấy lần nghĩa vụ trả nợ', source: `${C} 3.13, giản lược thành ngưỡng` },
  { id: 'bank.maxLeverage', value: 0.7, label: 'Nợ tối đa so với tài sản của người vay', source: 'TTK' },
  { id: 'bank.dividend', value: 0.6, label: 'Tỷ lệ lợi nhuận ngân hàng chia cổ tức', source: `${C}: ρ_b = 0,6` },
  { id: 'bank.stateShare', value: 0.4, label: 'Phần hệ thống ngân hàng do Nhà nước sở hữu', source: 'OECD 2022 (qua research mục 4.3)' },
  { id: 'bank.loanMonthsWc', value: 12, label: 'Kỳ hạn vay vốn lưu động (tháng)', source: 'TTK' },
  { id: 'bank.loanMonthsInv', value: 84, label: 'Kỳ hạn vay đầu tư (tháng)', source: `${C}: 20 quý`, note: 'Kéo dài lên 7 năm cho gần đời máy 10 năm, để tiền trả gốc không vượt khấu hao.' },
  { id: 'bank.nplMonths', value: 3, label: 'Quá hạn bao nhiêu tháng thì là nợ xấu', source: 'Thông lệ 90 ngày' },

  // ---------- kỳ vọng và tâm lý ----------
  { id: 'exp.lambdaPi', value: 0.1, label: 'Tốc độ cập nhật lạm phát thích nghi', source: 'TTK' },
  { id: 'exp.trust0', value: 0.6, label: 'Mức tin ban đầu vào mục tiêu lạm phát', source: 'TTK; hướng theo De Grauwe 2011 (trí nhớ)' },
  { id: 'exp.trustGain', value: 0.02, label: 'Niềm tin hồi mỗi tháng khi lạm phát gần mục tiêu', source: 'TTK' },
  { id: 'exp.trustLoss', value: 0.04, label: 'Niềm tin mất mỗi tháng cho mỗi 2 điểm lệch mục tiêu', source: 'TTK' },
  { id: 'exp.trustBand', value: 0.02, label: 'Biên quanh mục tiêu coi là "gần"', source: 'TTK' },
  { id: 'exp.flight', value: 1.0, label: 'Tiêu dùng tăng thêm khi lạm phát kỳ vọng vượt lãi tiền gửi', source: 'TTK; dạng cầu tiền Cagan 1956' },
  { id: 'exp.saveResponse', value: 0.35, label: 'Tiêu dùng giảm khi lãi tiền gửi vượt lạm phát kỳ vọng', source: 'Havránek 2015, "Measuring Intertemporal Substitution: The Importance of Method Choices and Selective Reporting", JEEA 13(6): độ co giãn thay thế liên thời gian sau khi chỉnh thiên lệch công bố là 0,3-0,4 ở ước lượng vi mô (hộ có tài sản), xấp xỉ 0 ở ước lượng vĩ mô; trên 0,8 là trái với bằng chứng. Đã đọc tóm tắt ngày 14/11/2026', note: 'Lấy 0,35. Quy đổi gần đúng: lãi suất thực cao hơn 1 điểm trong một năm thì tiêu dùng năm đó thấp hơn khoảng 0,35%. Thiết kế mục 10 chỉ nêu chiều mua sớm; bằng 0 thì về đúng thiết kế. Dương quyết ngày 14/11/2026: không dùng giá trị 2 (chọn để K1.19 qua).' },
  { id: 'exp.confKappa', value: 1.0, label: 'Tiêu dùng giảm theo thất nghiệp quanh hộ', source: 'TTK; tiết kiệm phòng thân' },
  { id: 'exp.confNormal', value: 0.05, label: 'Mức thất nghiệp coi là bình thường', source: 'TTK' },

  // ---------- quy tắc tự động của Nhà nước ----------
  { id: 'gov.autopilot', value: 0, label: 'Bộ Tài chính tự chỉnh mức mua hàng mỗi năm theo mục tiêu bội chi (1 bật)', source: 'TTK; phỏng theo dự toán ngân sách hằng năm', note: 'Tắt khi người chơi giữ vai Chính phủ hoặc khi làm thí nghiệm tài khoá.' },
  { id: 'gov.indexation', value: 1, label: 'Tự chỉnh ngưỡng thuế và lương tối thiểu theo lạm phát (1 bật)', source: 'Luật Thuế TNCN: CPI biến động trên 20% thì xét chỉnh mức giảm trừ (theo trí nhớ, điều khoản cần tra); lương tối thiểu vùng thực tế chỉnh gần như hằng năm', note: 'Áp chung cho mọi ngưỡng tính bằng đồng: đơn giản hoá. Tắt để xem hiện tượng trượt bậc thuế.' },

  // ---------- NHNN ----------
  { id: 'cb.autopilot', value: 0, label: 'Chính sách tự động của NHNN: chỉnh lãi suất theo lạm phát (1 bật, 0 giữ nguyên)', source: 'TTK; dạng quy tắc Taylor 1993 giản lược', note: 'Mặc định tắt, đúng thiết kế mục 8: lãi suất do người chơi đặt. Bật khi quan sát hoặc để máy điều hành NHNN. Ở GĐ1 quy tắc này làm lạm phát tệ hơn (sai-khac.md D5).' },

  // ---------- công tắc của các cơ chế thêm ngoài thiết kế (sai-khac.md) ----------
  { id: 'firm.normalCostPricing', value: 1, label: 'Chi phí máy tính trên sản lượng ở công suất bình thường (1) hay sản lượng kỳ vọng (0)', source: 'TTK; định giá theo chi phí chuẩn (Lavoie 2014, mục định giá theo chi phí bình thường; trí nhớ)' },
  { id: 'entry.customersPerUnit', value: 0.12, label: 'Số hộ biết tới một nơi bán mới mở, trên mỗi đơn vị hàng nó định bán mỗi tháng (0 tắt)', source: 'TTK', note: 'Một hộ mua khoảng 8 đơn vị mỗi loại hàng mỗi tháng, nên 0,12 là vừa đủ khách cho sản lượng dự định.' },
  { id: 'hkd.wageFlex', value: 1, label: 'Lương ở hộ kinh doanh giảm được khi thừa người và ế hàng (1 bật)', source: 'TTK; lao động phi chính thức không có hợp đồng' },
  { id: 'bank.restructure', value: 1, label: 'Ngân hàng giãn nợ cho doanh nghiệp còn vốn ròng dương (1 bật)', source: 'TTK; thông lệ cơ cấu lại thời hạn trả nợ (ví dụ Thông tư 02/2023/TT-NHNN, theo trí nhớ)' },
  { id: 'bank.youngFirmMonths', value: 24, label: 'Doanh nghiệp trẻ hơn mức này được xét vay theo phương án kinh doanh (tháng; 0 tắt)', source: 'TTK' },
  { id: 'hkd.soloUpgrade', value: 0.25, label: 'Xác suất mỗi tháng người tự làm bán hết hàng thuê thêm người (0 tắt)', source: 'TTK' },
  { id: 'bank.idlePayout', value: 0.25, label: 'Phần vốn vượt gấp đôi mục tiêu ngân hàng trả lại chủ mỗi quý (0 tắt)', source: 'TTK' },

  { id: 'cb.taylorPi', value: 1.5, label: 'Quy tắc lãi suất tự động: lãi suất tăng bao nhiêu điểm cho mỗi điểm lạm phát vượt mục tiêu', source: 'Taylor 1993: 1,5' },
  { id: 'cb.taylorSpeed', value: 0.3, label: 'Quy tắc lãi suất tự động: mỗi quý đi được bao nhiêu phần quãng đường tới mức mong muốn', source: 'TTK; điều chỉnh từ từ' },

  // ---------- khởi tạo ----------
  { id: 'init.soloShare', value: 0.35, label: 'Phần lao động phi chính thức là người tự làm một mình lúc đầu', source: 'Giá trị tạm; lao động tự làm chiếm khoảng một nửa lao động phi chính thức ở Việt Nam (Cục Thống kê, theo trí nhớ)', note: 'Thiết kế mục 2 chỉ ghi 90 hộ kinh doanh có thuê người. Thêm nhóm tự làm để thị trường lao động có lực lượng dự trữ ngay từ đầu.' },
  { id: 'init.soloUtil', value: 0.8, label: 'Người tự làm lúc đầu bán được bao nhiêu phần sức làm', source: 'TTK' },
  { id: 'init.soeShare', value: 0.2, label: 'Phần doanh nghiệp chính thức do Nhà nước sở hữu lúc đầu', source: 'Giá trị tạm; khu vực doanh nghiệp nhà nước đóng góp khoảng 28% GDP (theo trí nhớ)', note: 'Ở GĐ1 doanh nghiệp nhà nước hành xử như doanh nghiệp khác; chỉ khác là cổ tức về ngân sách. Hành vi riêng thuộc GĐ4.' },
  { id: 'init.formalShare', value: 0.26, label: 'Phần lao động ở doanh nghiệp chính thức lúc đầu', source: 'Cục Thống kê qua research mục 4.1: phi chính thức 63-64%' },
  { id: 'init.unemployment', value: 0.04, label: 'Thất nghiệp lúc đầu', source: 'TTK' },
  { id: 'init.wealthMonths', value: 6, label: 'Của cải ban đầu của hộ (tháng thu nhập)', source: 'Suy từ α1, α2 ở trạng thái dừng' },
  { id: 'init.equal', value: 1, label: 'Xuất phát bình đẳng (1) hay lệch (0)', source: `${C} mục 4: chia đều, để dị biệt tự nổi lên` },
  { id: 'init.firmSize', value: 5, label: 'Số lao động mỗi doanh nghiệp chính thức lúc đầu', source: 'Suy từ gd1 mục 2' },
];
