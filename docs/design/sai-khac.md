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
| S7 | **Xét lương năm theo đủ lạm phát kỳ vọng** | `firm.wageIndex` = 1 | 0,6 | Dưới 1 thì lương thực ở doanh nghiệp mòn dần cho tới khi ngang lương hộ kinh doanh; khoảng cách lương hai khu vực biến mất và lao động chảy hết sang chính thức | TTK. Thiết kế ghi "một phần"; đây là chọn giá trị tham số |
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
| S20 | **NHNN tự chỉnh lãi suất theo lạm phát** mặc định bật | `cb.autopilot` | 0 | Thiết kế mục 8 cho chọn trong sandbox; để mặc định bật cho các lần chạy không có người chơi | Dạng quy tắc Taylor 1993 giản lược |
| S21 | **Ngưỡng thuế và lương tối thiểu tự chỉnh theo lạm phát** | `gov.indexation` | 0 | Sau 20 năm ai cũng nộp TNCN bậc cao | Luật Thuế TNCN có điều khoản chỉnh giảm trừ khi CPI đổi trên 20% (trí nhớ) |
| S22 | **Ngân hàng trả lại chủ phần vốn vượt gấp đôi mục tiêu** | `bank.idlePayout` | 0 | Vốn nằm chết trong ngân hàng, rút dần tiền khỏi hộ | TTK |
| S23 | **Bộ Tài chính tự chỉnh mức mua hàng theo mục tiêu bội chi** | `gov.autopilot` | 0 (**đang tắt**) | Bản trước bật. Đo lại thì chính nó làm khu vực chính thức phình dần: Chính phủ chỉ mua của doanh nghiệp, mua nhiều hơn thì thu thuế nhiều hơn, rồi lại mua nhiều hơn. Tắt đi là về đúng thiết kế "giữ chi theo tỷ lệ GDP". Giữ làm công tắc cho người chơi | TTK |
| S24 | **Gini của cải tính trên của cải ròng** (tiền cộng phần vốn sở hữu doanh nghiệp, ngân hàng, hộ kinh doanh) | chỉ số `gini.wealth`; bản chỉ tính tiền là `gini.liquid` | | gd0 mục 4.1 đã định giá trị cổ phần là vốn ròng chia theo tỷ lệ. Bỏ phần sở hữu ra thì bỏ mất chính kênh bất bình đẳng mà mục 5.7 mô tả | Định nghĩa thông thường của của cải ròng |

Chi tiết triển khai, không đổi cơ chế: doanh nghiệp chỉ đăng tuyển số người trả nổi lương; giữ lại lương tháng này cộng một tháng đệm trước khi mua máy; hộ gặp nơi hết hàng thì sang nơi quen kế tiếp trong cùng lượt; thanh lý máy của doanh nghiệp phá sản cho tối đa ba nơi mua; doanh nghiệp hết người hết tiền quá 6 tháng thì giải thể; cơ cấu ngành lúc đầu tính từ cầu để tháng đầu không ngành nào thừa hay thiếu hàng.

## C. Đã bỏ

- Chính phủ nhỏ (công chức 3%): bỏ theo quyết định mục 3.
- "Hoãn tăng lương ở nơi đang lỗ" (thử ngày 14/11): làm lương thực mòn dần giống `firm.wageIndex` < 1. Đã xoá khỏi code.

## D. Chỗ tớ thấy còn yếu

- Lãi suất NHNN tác động yếu lên lạm phát. Sẽ biết rõ ở kiểm định K1.19.
- Tiền mặt khoảng 15% tổng phương tiện thanh toán, trên mục tiêu thô 7-13%.
- Thất nghiệp 5-6%, sát mép trên mục tiêu thô 2-6%.
