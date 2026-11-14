# Sai khác so với thiết kế đã duyệt

Quy tắc (Dương, 14/11/2026): mọi cơ chế thêm ngoài [gd0.md](gd0.md) và [gd1.md](gd1.md) phải là tham số hoặc công tắc có tên, ghi vào file này kèm lý do. Cơ chế chỉ để làm số đẹp mà không có cơ sở thực tế thì dừng lại báo, không vá.

Cách đọc bảng:
- **Tên**: mã tham số (`src/config/model/gd1.ts`), mã luật (`src/config/vn/laws.ts`) hoặc mã quy tắc trong sổ quy tắc. Đặt về giá trị ở cột "Về thiết kế" thì cơ chế tắt.
- **Cơ sở**: nguồn thực tế hoặc bài báo. "TTK" là tự thiết kế. "(trí nhớ)" là chưa mở lại nguồn.
- Mức xác minh của số liệu Việt Nam ghi ngay trong config.

## A. Theo quyết định của Dương ngày 14/11/2026

### S1. Hàng của hộ kinh doanh và hàng của doanh nghiệp không thay thế hoàn toàn cho nhau

- **Thiết kế cũ** (mục 6): hai khu vực bán cùng một loại hàng, người mua chọn nơi rẻ nhất. Hệ quả: bên nào rẻ hơn một chút thì lấn dần hết thị trường.
- **Cơ chế mới**: mỗi ngành có hai loại hàng. Mỗi hộ chia ngân sách của từng ngành giữa hai loại theo ba thứ: trọng số sở thích của ngành, giá rẻ nhất mà chính hộ đó biết ở mỗi loại, và mức sống của hộ. Trong mỗi loại, hộ vẫn đi tìm nơi rẻ nhất trong 3 nơi quen như cũ. Khi mọi nơi quen của một loại hết hàng, phần cầu còn lại chuyển sang loại kia.
- **Công thức**: tỷ số chi tiêu phi chính thức / chính thức = `ω/(1−ω) · (ngân sách hộ / ngân sách bình quân)^(−η) · (p_phi / p_chính)^(1−σ)`.
- **Tên**: quy tắc `hh.segments` (biến thể `homogeneous` quay về hàng đồng nhất); `seg.sigma` = 2; `seg.incomeEta` = 0,3; `seg.spill` = 1. Trọng số `ω` từng ngành không đặt tay: tính lúc khởi tạo sao cho ở giá ban đầu hộ chia chi tiêu đúng như cơ cấu ban đầu (cách hiệu chỉnh trọng số CES theo năm gốc).
- **Cơ sở**:
  - La Porta và Shleifer 2014, "Informality and Development", Journal of Economic Perspectives 28(3). Bằng chứng khớp với cách nhìn "hai khu vực": doanh nghiệp phi chính thức nhỏ, năng suất thấp, làm hàng chất lượng thấp, không phải đối thủ của doanh nghiệp chính thức; hiếm khi chuyển lên chính thức; hạ chi phí đăng ký không kéo được họ vào. Đã đọc tóm tắt ngày 14/11/2026.
  - Böhme và Thiele 2012, "Is the Informal Sector Constrained from the Demand Side? Evidence for Six West African Capitals", World Development 40(7), 1369-1381. Hàng phi chính thức hiếm khi bán qua kênh chính thức; thu nhập cao hơn thì ít mua hàng phi chính thức hơn. Đã đọc tóm tắt ngày 14/11/2026. Đây là cơ sở cho `seg.incomeEta`.
  - Việt Nam: cuối 2024 còn khoảng 1,4 triệu tiệm tạp hoá và hơn 8.000 chợ truyền thống; kênh truyền thống vẫn là kênh phổ biến nhất (báo cáo ngành bán lẻ, đọc qua bài báo).
- **Giới hạn phải nói thật**: `σ` và `η` chưa có ước lượng cho Việt Nam. Lý do người ta mua ở hộ kinh doanh (gần nhà, mua lẻ, quen biết, cho nợ) không được mô hình hoá từng cái; chúng gộp vào `ω`. Chi phí chính thức hoá chưa có vì hộ kinh doanh chưa chuyển lên doanh nghiệp được (thiết kế mục 6 đã ghi).
- **Vì sao không phải "thị phần theo công thức"**: công thức chia là của từng hộ, dùng giá mà hộ đó biết. Thị phần của từng người bán vẫn do khách tìm tới và giá quyết định.
- **Kiểm định**: K1.32 trong gd1 mục 14 (thêm mới): tỷ lệ lao động phi chính thức bình quân các năm 11-40 nằm trong 50-70% ở ít nhất 80% số seed, và chênh giữa 5 năm cuối với 5 năm đầu dưới 10 điểm.

### S2. Nghiệp vụ thị trường mở tự động của NHNN

- **Thiết kế cũ** (mục 8): mua bán trái phiếu với ngân hàng "không tự động".
- **Cơ chế**: ngân hàng thiếu dự trữ thì bán lại trái phiếu chính phủ cho NHNN; hết trái phiếu mới vay tái cấp vốn.
- **Tên**: luật `cb.omo.auto` (mặc định bật, người chơi tắt được trong bảng NHNN).
- **Hiển thị và ghi sổ**: mỗi lần mua là một bút toán `bond_trade`. Chỉ số `cb.omo` (khối lượng tháng), `cb.bonds`, `cb.holdsShare`. Dự trữ ngân hàng (`bank.reserves`) có phân rã: dân rút nộp tiền mặt (`r_cash`), thị trường mở (`r_omo`), tái cấp vốn (`r_refi`). Mã lý do `r_omo` trỏ ngược về luật `cb.omo.auto`, nên chuỗi nhân quả dừng ở đúng chính sách này.
- **Vì sao không trái T3**: T3 cấm NHNN ngầm mua trái phiếu ế của Chính phủ. Ở đây NHNN mua lại trái phiếu ngân hàng đang giữ; kho bạc không nhận thêm đồng nào. Mua thẳng từ Chính phủ vẫn là `cb.monetize`, mặc định tắt.
- **Cơ sở**: Luật NHNN 2010 Điều 15 (trí nhớ); đây là kênh bơm thanh khoản chính ngoài đời. Đơn giản hoá: mua đứt thay cho mua có kỳ hạn.

### S3. Nguồn "thu khác" của ngân sách, công chức về 10%

- **Thiết kế cũ**: bốn sắc thuế (GTGT, TNCN, TNDN, hộ kinh doanh). Thu chỉ 6-9% GDP nên bản trước phải thu nhỏ Chính phủ.
- **Số thật**: quyết toán 2024 thu 2,05 triệu tỷ đồng (Nghị quyết 21/2026/QH16), khoảng 17,8% GDP; TNCN ước 189 nghìn tỷ. Cơ cấu các khoản khác tớ chưa tìm được bảng quyết toán theo sắc thuế, đang ghi theo trí nhớ (mức C).
- **Ba nguồn thêm**:

| Tên | Mặc định | Ai trả | Thay cho khoản thật nào |
|---|---|---|---|
| luật `tax.indirect.other` | 12% trên giá chưa thuế của hàng công nghiệp và dịch vụ | Mọi người bán, kể cả hộ kinh doanh; nằm trong giá bán | Tiêu thụ đặc biệt, bảo vệ môi trường, xuất nhập khẩu, dầu thô, và phần GTGT nằm sẵn trong hàng hộ kinh doanh nhập về |
| luật `gov.fees.rate` | 5% thu nhập khả dụng tháng của hộ | Hộ gia đình | Tiền sử dụng đất, phí, lệ phí, xổ số, thu khác |
| tham số `init.soeShare` | 20% số doanh nghiệp lúc đầu thuộc Nhà nước | Cổ tức về ngân sách | Cổ tức, lợi nhuận doanh nghiệp nhà nước |

- Đặt hai luật về 0 và `init.soeShare` về 0 thì quay về thiết kế cũ.
- Luật `gov.public.share` về 0,10; `gov.purchase.share` 0,04.
- **Kết quả**: thu 14-16% GDP, bội chi 1,5% GDP. TNCN gần bằng 0 vì lương trong mô hình chưa phân tán (GĐ2 mới có kỹ năng); TNDN thấp hơn thật vì phần lợi nhuận trong GDP của mô hình thấp.
- **Giới hạn**: `gov.fees.rate` thu theo thu nhập không phải cách thu thật của tiền đất. GĐ3 có đất sẽ tách ra.
- **Sửa lõi**: thêm hai loại giao dịch `excise`, `fees` vào cuối `src/engine/ledger/kinds.ts` (CLAUDE.md quy tắc 9).

## B. Tớ tự thêm trong lúc hiệu chỉnh

Xếp theo mức ảnh hưởng. Cột "Về thiết kế" là giá trị đưa cơ chế về đúng bản đã duyệt.

| Mã | Cơ chế | Tên | Về thiết kế | Vì sao cần | Cơ sở |
|---|---|---|---|---|---|
| S4 | **Người tự làm một mình có ngay từ đầu** (35% lao động phi chính thức), năng suất 0,30 so với doanh nghiệp, thấp hơn hộ kinh doanh có thuê người (0,44) | `init.soloShare`, `init.soloUtil`, `hkd.soloProductivity` | `init.soloShare` = 0 | Không có nhóm này thì thị trường lao động căng ngay từ tháng đầu, hộ kinh doanh không tuyển được người, lương hai khu vực kéo về bằng nhau và khu vực phi chính thức teo dần. Nhóm tự làm là lực lượng dự trữ: đi làm thuê vẫn hơn tự làm, nên họ nhận việc khi có | Lewis 1954 (kinh tế dư lao động); lao động tự làm chiếm khoảng một nửa lao động phi chính thức Việt Nam (Cục Thống kê, trí nhớ) |
| S5 | **Lối thoát T2 dễ vào hơn**: thất nghiệp 3 tháng và của cải dưới 12 tháng chi tiêu tối thiểu | `hh.fallbackMonths`, `hh.fallbackWealth` | 4 và 3 | Với ngưỡng 3 tháng chi tiêu, người thất nghiệp phải mất hơn một năm mới chạm ngưỡng, thất nghiệp lên 10-20% | Thiết kế mục 18 đã lường: "cần chỉnh T_u" |
| S6 | **Lập doanh nghiệp: 15 hộ cùng góp vốn**, tự có 30% vốn cần | `firm.founders`, `firm.founderEquityMin` | 1 và 1 | Một hộ không đủ tiền mua máy cho hai người làm; bản một người sáng lập cho 0 doanh nghiệp mới trong 40 năm | Caiani 2016: vốn doanh nghiệp mới do các hộ góp theo của cải; lúc khởi tạo mỗi doanh nghiệp cũng có khoảng 12 chủ |
| S7 | **(Đã thay 14/11/2026, xem D5)** Xét lương năm theo đủ lạm phát kỳ vọng | `firm.wageIndex` = 1, nay 0,5 | 0,6 | Dưới 1 thì lương thực ở doanh nghiệp mòn dần cho tới khi ngang lương hộ kinh doanh; khoảng cách lương hai khu vực biến mất và lao động chảy hết sang chính thức | TTK. Thiết kế ghi "một phần"; đây là chọn giá trị tham số |
| S8 | **Lãi tiền gửi cao hơn lạm phát kỳ vọng thì hộ hoãn mua** | `exp.saveResponse` = 1 | 0 | Thiết kế chỉ có chiều mua sớm. Không có chiều ngược thì lãi suất NHNN không chạm tới tiêu dùng | Thay thế liên thời gian trong giáo trình |
| S9 | **Nơi bán mới mở được một số hộ biết tới** | `entry.customersPerUnit` = 0,12 | 0 | Hộ chỉ mua ở nơi quen nên nơi mới mở không có khách nào, bán 0 đồng và đóng cửa | TTK |
| S10 | **Bù tồn kho đệm dần trong ba tháng** | `firm.invAdjust` = 1/3 | 1 | Quy đổi quý sang tháng: Caiani bù đủ trong một quý. Bù hết trong một tháng làm sản lượng mong muốn và đầu tư giật gấp ba | Caiani 3.2 |
| S11 | **Hàm đầu tư**: dùng mức sử dụng công suất mong muốn; hệ số 0,02/tháng; trần 2%/tháng | `firm.gamma2`, `firm.gMax` | 0,0067 | Doanh nghiệp vài người: với hệ số gốc mất nhiều năm mới mua đủ máy cho thêm một người | Caiani 3.9 |
| S12 | **Ngành dịch vụ làm dư 10%** thay vì 30% | `firm.nuServices` | 0,3 | Dịch vụ không tồn kho; làm dư 30% là bỏ phí gần một phần tư sức làm | TTK |
| S13 | **Định giá theo chi phí chuẩn**: chi phí máy tính trên sản lượng ở công suất bình thường | `firm.normalCostPricing` | 0 | Tính trên sản lượng kỳ vọng thì bán chậm tự đẩy giá lên | Định giá theo chi phí bình thường (Lavoie 2014, trí nhớ) |
| S14 | **Giãn nợ** cho doanh nghiệp còn vốn ròng dương, tối đa một lần mỗi năm | `bank.restructure` | 0 | Không có thì doanh nghiệp lành mạnh chết vì lệch dòng tiền một tháng | Thông lệ cơ cấu lại thời hạn trả nợ (trí nhớ) |
| S15 | **Doanh nghiệp dưới 2 năm tuổi được xét vay theo phương án kinh doanh** | `bank.youngFirmMonths` | 0 | Chưa có lịch sử dòng tiền thì không bao giờ vay được để mua máy | TTK |
| S16 | **Lương ở hộ kinh doanh giảm được** khi thừa người và ế hàng | `hkd.wageFlex` | 0 | Không hợp đồng lao động; đây cũng là nơi hấp thụ cú sốc | TTK |
| S17 | **Người tự làm bán hết hàng thì thuê người** | `hkd.soloUpgrade` | 0 | Không có thì số hộ kinh doanh có thuê người chỉ giảm | TTK |
| S18 | **Hộ kinh doanh mới mở vì thấy có lãi** | `hkd.entryRate` | 0 | Không có thì hộ kinh doanh cũ hưởng lãi cao mãi | TTK |
| S19 | **Luân chuyển lao động** 1,7%/tháng | `firm.turnover` | 0 | Có trong Caiani (θ), thiết kế chưa ghi | Caiani Bảng 3 |
| S20 | **(Mặc định tắt từ 14/11/2026, xem D5)** NHNN tự chỉnh lãi suất theo lạm phát | `cb.autopilot` | 0 | Thiết kế mục 8 cho chọn trong sandbox; để mặc định bật cho các lần chạy không có người chơi | Dạng quy tắc Taylor 1993 giản lược |
| S21 | **Ngưỡng thuế và lương tối thiểu tự chỉnh theo lạm phát** | `gov.indexation` | 0 | Sau 20 năm ai cũng nộp TNCN bậc cao | Luật Thuế TNCN có điều khoản chỉnh giảm trừ khi CPI đổi trên 20% (trí nhớ) |
| S22 | **Ngân hàng trả lại chủ phần vốn vượt gấp đôi mục tiêu** | `bank.idlePayout` | 0 | Vốn nằm chết trong ngân hàng, rút dần tiền khỏi hộ | TTK |
| S23 | **Bộ Tài chính tự chỉnh mức mua hàng theo mục tiêu bội chi** | `gov.autopilot` | 0 (**đang tắt**) | Bản trước bật. Đo lại thì chính nó làm khu vực chính thức phình dần: Chính phủ chỉ mua của doanh nghiệp, mua nhiều hơn thì thu thuế nhiều hơn, rồi lại mua nhiều hơn. Tắt đi là về đúng thiết kế "giữ chi theo tỷ lệ GDP". Giữ làm công tắc cho người chơi | TTK |
| S24 | **Gini của cải tính trên của cải ròng** (tiền cộng phần vốn sở hữu doanh nghiệp, ngân hàng, hộ kinh doanh) | chỉ số `gini.wealth`; bản chỉ tính tiền là `gini.liquid` | | gd0 mục 4.1 đã định giá trị cổ phần là vốn ròng chia theo tỷ lệ. Bỏ phần sở hữu ra thì bỏ mất chính kênh bất bình đẳng mà mục 5.7 mô tả | Định nghĩa thông thường của của cải ròng |
| S25 | **Đợt xét lương năm cộng trừ theo thất nghiệp** (mức bình thường nay tự sinh từ mô hình, xem D5): mỗi điểm thất nghiệp dưới (trên) mức bình thường thì lương tăng thêm (bớt) 0,5 điểm; lương danh nghĩa không giảm trong đợt xét | `firm.wagePhillips` = 0,5; mã lý do `w_tight`, `w_slack_review` | 0 | Thiết kế chỉ cho lương tăng khi một doanh nghiệp không tuyển đủ người. Thế thì lương gần như chỉ theo lạm phát kỳ vọng, lạm phát không phản ứng với cầu, và tăng lãi suất không hạ được lạm phát (K1.19 hỏng) | Caiani 3.15: lương xét lại theo ngưỡng thất nghiệp υ. Dạng tuyến tính là TTK |
| S26 | **Hộ trừ phần lạm phát ăn mòn tiền đang giữ** khỏi thu nhập khi tính tiêu dùng | `hh.inflationLoss` = 1 | 0 | Không có thì lãi tiền gửi danh nghĩa tính trọn là thu nhập: lạm phát cao kéo lãi suất cao, hộ thấy mình giàu lên và tiêu thêm, lạm phát không có gì neo | Godley và Lavoie 2007, thu nhập thực kiểu Haig-Simons (trí nhớ) |
| S27 | **Hộ kinh doanh thuộc diện nộp thuế tính thuế doanh thu vào giá bán** | không có công tắc riêng; theo luật `hkd.vat.*`, `hkd.pit.*`, `hkd.threshold` và tham số `hkd.declare` | | Trước đó thuế này chỉ trừ vào lãi của chủ hộ, giá không đổi, nên "nộp thuế đủ" không chạm tới người mua (K1.26). Đây là thiếu sót so với mục 5 của thiết kế (thuế gián thu nằm trong giá), không phải cơ chế mới | Thuế khoán tính trên doanh thu là thuế gián thu |
| S28 | **(Đã bỏ 14/11/2026)** `exp.saveResponse` = 2 | | | Dương quyết: không dùng giá trị chọn để K1.19 qua | Xem S8 bản mới ngay dưới |
| S8b | **Lãi tiền gửi cao hơn lạm phát kỳ vọng thì hộ hoãn mua**, mức phản ứng lấy theo tài liệu | `exp.saveResponse` = 0,35 | 0 | Thay cho giá trị 1 (S8) và 2 (S28) | Havránek 2015, JEEA 13(6): độ co giãn thay thế liên thời gian sau khi chỉnh thiên lệch công bố là 0,3-0,4 ở ước lượng vi mô, xấp xỉ 0 ở vĩ mô, trên 0,8 là trái bằng chứng. Đã đọc tóm tắt 14/11/2026. Quy đổi sang tham số của mô hình là gần đúng |
| S29 | **Hệ số của quy tắc lãi suất tự động thành tham số** | `cb.taylorPi` = 1,5; `cb.taylorSpeed` = 0,3 | | Trước là số viết cứng trong code. Giá trị không đổi | Taylor 1993 |
| S30 | **Chi phí lãi vay trong giá tính theo số lãi thực trả tháng trước** | chi tiết triển khai | | Trước đó nhân cả dư nợ với lãi suất của khoản vay mới nhất, nên một lần tăng lãi suất đẩy giá lên ngay cả với nợ cũ lãi cố định, ngược chiều với K1.19 | Khoản vay giữ lãi suất lúc ký (thiết kế mục 7) |

Chi tiết triển khai, không đổi cơ chế: doanh nghiệp chỉ đăng tuyển số người trả nổi lương; giữ lại lương tháng này cộng một tháng đệm trước khi mua máy; hộ gặp nơi hết hàng thì sang nơi quen kế tiếp trong cùng lượt; thanh lý máy của doanh nghiệp phá sản cho tối đa ba nơi mua; doanh nghiệp hết người hết tiền quá 6 tháng thì giải thể; cơ cấu ngành lúc đầu tính từ cầu để tháng đầu không ngành nào thừa hay thiếu hàng.

## C. Đã bỏ

- Chính phủ nhỏ (công chức 3%): bỏ theo quyết định mục 3.
- "Hoãn tăng lương ở nơi đang lỗ" (thử ngày 14/11): làm lương thực mòn dần giống `firm.wageIndex` < 1. Đã xoá khỏi code.

## D. Phát hiện và việc còn mở (cập nhật 14/11/2026 theo quyết định của Dương)

### D1. K1.19 chưa đạt

Với `exp.saveResponse` = 0,35, tăng lãi suất 6 điểm không hạ được lạm phát ở đủ số seed. Ghi "chưa đạt (đã biết)" trong báo cáo kiểm định, không nâng tham số. Kênh vay tiêu dùng (thiết kế mục 18) **để GĐ3**: tớ đánh giá là nặng cho GĐ1, vì (1) Caiani không có hộ vay nên không có quy tắc và tham số tham chiếu; (2) khoản vay lớn nhất của hộ Việt Nam là vay mua nhà, cần đất và nhà của GĐ3 làm tài sản thế chấp; (3) thêm một nguồn tạo tiền mới buộc hiệu chỉnh và kiểm định lại toàn bộ GĐ1.

### D2. Phát hiện: lãi suất cao kéo dài làm lạm phát tăng qua tiền lãi Chính phủ trả

Giữ nguyên, không sửa. Số đo (8 seed, `scripts/k119.ts`, khi còn dùng giá trị 2): tăng lãi suất 6 điểm và giữ mãi thì bội chi tăng khoảng 70%, nợ công +22%, tiền của công chúng +14% sau 5 năm; tiêu dùng thực cao hơn nhánh gốc 3-5% từ năm thứ tư; lạm phát cao hơn gần 2 điểm ở năm thứ năm. Tiền lãi trái phiếu thành thu nhập của hộ. Đây là tính chất của mô hình kế toán kép khi ngân sách không phản ứng (Godley và Lavoie 2007, trí nhớ). Thành kịch bản Phòng thí nghiệm số 15 "Hai tay lái" về phối hợp tài khoá - tiền tệ.

### D3. K1.22: cú bật lại có thể bị phóng đại

Giữ cách đo 3 năm đầu. Sau năm thứ năm nhánh siết tín dụng có GDP cao hơn nhánh gốc 2-6%. Mô hình thiếu cơ chế giảm phát nợ (giá giảm làm nợ thực nặng lên, doanh nghiệp vỡ nợ, ngân hàng mất vốn, tín dụng co tiếp), nên giá giảm chỉ có mặt lợi. Cơ chế này **đưa vào GĐ3**.

### D4. K1.26: giữ cách đo doanh số thực

Nộp thuế đủ làm khu vực phi chính thức nghèo đi, không nhỏ đi về số người.

### D5. Vì sao lạm phát bình quân 6-7% và rất khác nhau giữa các seed (CHƯA SỬA, chờ Dương quyết)

Đo bằng `scripts/inflation.ts` (phân rã CPI và lương theo mã lý do, năm 11-40) và `scripts/validate.ts 20 base M k=v`. Mục tiêu của NHNN là 4,5%.

1. **Giá tăng gần như hoàn toàn do lương.** Trong 7,5 điểm lạm phát mỗi năm (bình quân 5 seed): chi phí lương `p_wage` +5,9; đổi nơi mua `p_mix` +1,4; biên lãi ròng +0,5; chi phí vốn và lãi vay `p_capital` +0,8.
2. **Lương tăng gần như hoàn toàn do chỉ số hoá.** Trong 8,5 điểm tăng lương mỗi năm: `w_index` (xét lương theo lạm phát kỳ vọng) +8,2; `w_tight` trừ `w_slack_review` +0,26; `w_shortage` +0,04.
3. **Lạm phát không có neo.** Lương theo đủ 100% lạm phát kỳ vọng (S7). Lạm phát kỳ vọng theo lạm phát quá khứ khi niềm tin vào mục tiêu thấp (bình quân 0,2-0,4). Vậy lạm phát năm nay bằng lạm phát năm trước cộng một cú đẩy nhỏ: nó trôi, không quay về đâu cả.
4. **Cú đẩy nhỏ nhưng luôn dương**: thất nghiệp thực tế 4,3-5% nằm dưới mức "bình thường" 5% của S25 nên `w_tight` > 0; biên lãi ròng tăng.
5. **Quy tắc lãi suất tự động (S20) làm tệ thêm chứ không kéo về.** Bật: lạm phát 1,6-15,7% giữa 20 seed, K1.5 hỏng (13/20). Tắt (`cb.autopilot` = 0): 1,6-6,1%, phần lớn 4-6%, niềm tin 0,6-0,8, K1.5 qua 20/20. Lý do: lãi suất cao hầu như không giảm được cầu (hộ không vay, S8b nhỏ), nhưng làm tăng tiền lãi Chính phủ trả (chính là D2) và tăng chi phí lãi vay trong giá. Seed 2: lãi cho vay bình quân 20,6%, bội chi 6% GDP, lạm phát 13,6%.
6. Thử từng cơ chế (5 seed, CPI mỗi năm): gốc 3,4-13,6%; tắt S20 4,5-5,6%; tắt S25 (`firm.wagePhillips` = 0) 2,3-4,9%; S7 về 0,6 (`firm.wageIndex`) −0,1 đến 1,3% và thất nghiệp lên 6-8%; bật S23 (`gov.autopilot`) 5,8-8,0%.

Kết luận: nguyên nhân là tổ hợp **S7 + S25 + S20** trong bảng B, khuếch đại bởi D2. Không phải lỗi sổ sách.

Hệ quả cho kiểm định với `exp.saveResponse` = 0,35 (20 seed, 500 hộ): K1.5 13/20, K1.10 15/20, K1.12 13/20 không qua. Tắt S20 thì K1.5 và K1.10 qua, K1.12 15/20.

**Quyết định của Dương 14/11/2026 và việc đã làm:**

1. **S20 tắt theo mặc định** (`cb.autopilot` = 0), đúng thiết kế mục 8. Giữ làm chính sách tự động có tên, bật được khi quan sát hoặc để máy điều hành NHNN.
2. **S7 thay bằng bám một phần**: `firm.wageIndex` = 0,5. Nguồn: Rabanal và Sbrancia 2024, IMF WP/24/105 (Uruguay): hệ số của lạm phát CPI năm trước trong phương trình lương cao nhất 0,48; hệ số bám lương trong mô hình DSGE 0,36-0,57; bài dẫn WEO 10/2022 chương 3 cho nhóm nước mới nổi: cũng bám một phần. Đã đọc PDF. Giới hạn phải nói thật:
   - Uruguay có thương lượng lương tập trung, nên 0,5 nhiều khả năng là cận trên cho Việt Nam.
   - Không tìm được ước lượng cho Việt Nam. Nguyen 2020 (Dynare WP 56, số liệu 1999-2017) chỉ ước lượng mức bám của giá trong nước: 0,06. Trinh và Vasilev 2026 (EERI RP 2026/02) có phương trình lương cho Việt Nam nhưng không cho hệ số bám.
   - Bằng chứng nói lương bám lạm phát **quá khứ**, ít bám lạm phát kỳ vọng. Mô hình vẫn dùng lạm phát kỳ vọng theo thiết kế mục 10. Đây là chỗ lệch còn lại, Dương xem có muốn đổi không.
   - **Chưa phân biệt chính thức và phi chính thức**: không tìm được ước lượng riêng. Đã tách thành hai tham số (`firm.wageIndex`, `hkd.wageIndex`), đang để bằng nhau.
3. **S25: mức thất nghiệp bình thường tự sinh từ mô hình.** Bỏ con số 5% đặt tay. Giờ là trung bình trượt mũ 60 tháng của chính tỷ lệ thất nghiệp (`firm.nairuWindow`). Nguồn: Ball và Mankiw 2002, JEP 16(4): mức này đổi theo thời gian và được ước lượng bằng xu thế làm trơn (lọc Hodrick-Prescott) của thất nghiệp đã chỉnh theo thay đổi lạm phát; hai ông viết thẳng là tham số làm trơn "phần lớn là tuỳ ý". Đã đọc PDF. Đơn giản hoá: bỏ số hạng chỉnh theo lạm phát, dùng trung bình trượt thay lọc HP. Độ dài 60 tháng là tự thiết kế.
4. **Kết quả 20 seed, 500 hộ** (`scripts/validate.ts 20 base M`): K1.5 20/20, K1.10 18/20 qua. **K1.12 vẫn không qua: 12/20.**

**Vì sao K1.12 không qua** (không vá): lạm phát vẫn cùng chiều chu kỳ rất rõ, tương quan với GDP 0,50-0,79 ở mọi seed. Cái hỏng là điều kiện "trễ ít nhất một quý": đỉnh tương quan rơi vào cùng quý ở 8 seed, trễ một quý ở 12 seed. Bình quân 20 seed: cùng quý 0,60, trễ một quý 0,63, gần như bằng nhau. Lý do: giá trong mô hình đổi hằng tháng qua biên lãi (bán chạy thì nâng ngay), còn kênh chậm là lương xét mỗi năm. Khi lương bám 100% thì kênh chậm chiếm phần lớn nên có độ trễ. Giờ lương bám 50% thì kênh nhanh chiếm phần lớn. Mô hình thiếu thứ làm giá chậm lại ngoài đời: hợp đồng giá, chi phí đổi giá, đầu vào trung gian (đơn giản hoá số 4 của mục 18).

**Hệ quả khác phải biết**: lạm phát bình quân giờ 0-1,8% mỗi năm, thấp hơn mục tiêu 4,5% của NHNN; thất nghiệp 5,3-7,4%; niềm tin vào mục tiêu rơi về gần 0 vì lạm phát lệch xa mục tiêu. Trong mô hình không còn gì đẩy giá lên đều đặn: không tăng năng suất, không tăng dân số, ngân sách gần cân, và lương chỉ bám một nửa. Lạm phát giờ chỉ xuất hiện khi có cú đẩy (in tiền, chi tiêu công, tín dụng). Tớ thấy điều này hợp lý về cơ chế, nhưng nó xa số liệu Việt Nam (lạm phát 3-4%).

## E. Ghi chú cũ



- Lãi suất NHNN tác động lên lạm phát đã có (K1.19), nhưng nhờ S25, S26, S28 thêm sau khi thấy K1.19 hỏng. S28 là chỗ yếu nhất: giá trị chọn để qua kiểm định.
- K1.19 chỉ đúng trong khoảng 2 năm. Giữ lãi suất cao mãi thì tới năm thứ năm lạm phát lại CAO hơn nhánh gốc khoảng 2 điểm (8 seed). Đã soi (8 seed, `scripts/k119.ts`): lãi suất cao làm tiền lãi Chính phủ trả tăng, bội chi tăng khoảng 70%, nợ công +22% và tiền của công chúng +14% sau 5 năm. Tiền lãi đó thành thu nhập của hộ, nên từ năm thứ tư tiêu dùng thực cao hơn nhánh gốc 3-5%. Đây là tính chất quen thuộc của mô hình kế toán kép khi ngân sách không phản ứng (Godley và Lavoie 2007, trí nhớ), không phải lỗi sổ sách. Ngoài đời Chính phủ thường siết chi khi tiền lãi phình ra; trong mô hình việc đó là của người chơi, hoặc bật `gov.autopilot`.
- Lạm phát bình quân 6-7% ở phần lớn seed, cao hơn mục tiêu của NHNN. Quy tắc lãi suất tự động chưa kéo về được.
- K1.22: siết tín dụng chỉ làm sản lượng thấp hơn trong khoảng 3 năm. Sau đó giá giảm, kinh tế bật lại cao hơn nhánh gốc ở năm 6-10 rồi mới về. Tớ chưa chắc cú bật mạnh như vậy là đúng thực tế hay do mô hình thiếu kênh giảm phát nợ (nợ thực nặng lên khi giá giảm làm doanh nghiệp phá sản).
- K1.26: nộp thuế đủ làm khu vực phi chính thức nghèo đi nhưng không nhỏ đi về số người. Lý do: thuế thu thêm không được chi ra, và hộ kinh doanh không chuyển lên doanh nghiệp được.
- Tiền mặt khoảng 15% tổng phương tiện thanh toán, trên mục tiêu thô 7-13%.
- Thất nghiệp 5-6%, sát mép trên mục tiêu thô 2-6%.
