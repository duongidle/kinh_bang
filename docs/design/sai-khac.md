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
| S31 | **Người bán chỉ chuyển ngay một phần thay đổi thuế vào giá**, phần còn lại ăn vào biên lãi; sau đó biên lãi lại đi theo sức mua như thường. Áp cho mọi thuế nằm trong giá. **Bất đối xứng**: tăng thuế chuyển 34%, giảm thuế chuyển 6,5% Bản đối xứng là biến thể `symmetric` của quy tắc `firm.taxPass` cho Phòng thí nghiệm (15/11/2026). | `firm.taxPassUp` = 0,34; `firm.taxPassDown` = 0,065; mã lý do `p_tax_absorb` | 1 và 1 | Dương quyết 14/11/2026 (hai đợt): biên lãi phải co khi thuế tăng; đọc toàn văn rồi mới chọn số; có bằng chứng bất đối xứng thì mô hình hoá | Benzarti, Carloni, Harju, Kosonen 2020 (JPE; bản NBER WP 23849, Bảng 1). Chi tiết và các nguồn trái chiều: D9 |
| S32 | **Đợt xét lương năm bám lạm phát 12 tháng qua**, thay cho lạm phát kỳ vọng | quy tắc `firm.wageIndexBase` (biến thể `expected` về thiết kế mục 10); mã lý do `w_index`, `w_index_exp` | biến thể `expected` | Dương quyết 14/11/2026 theo bằng chứng | Rabanal và Sbrancia 2024 (đã dẫn ở D5): lương bám lạm phát CPI năm trước |
| S34 | **Hộ thu nhập cao hơn mặt bằng thì tiêu phần nhỏ hơn của thu nhập** (đề xuất A, Dương duyệt 14/11/2026): α1 của hộ = α1 × (thu nhập kỳ vọng của hộ / bình quân)^(−η) | `hh.saveIncomeEta` = 0,09 | 0 | K1.13: mọi hộ tiêu cùng tỷ lệ nên tiền không dồn lại được (D8) | Dynan, Skinner, Zeldes 2004 (JPE 112(2); bản NBER WP 7906, đã đọc toàn văn). Cách quy đổi ở D8 |
| S35 | **Lần tính giá đầu tiên của nơi bán mới ghi lý do riêng** | mã lý do `p_new` | | Sửa lỗi phân rã, không đổi kinh tế. Trước đó cả mức giá của nơi mới mở bị ghi vào `p_wage` rồi trừ lại ở "yếu tố khác". Xem D11 | |
| S33 | **Số hộ để chọn nhóm sáng lập thành tham số** | `firm.founderPool` = 60 | | Trước là số viết cứng. Giá trị không đổi. Tìm ra khi soi K1.13 (D8) | TTK |
| S36 | **Đơn giản hoá tạm: tăng thuế chuyển TRỌN vào giá ngay trong tháng đổi thuế**; giảm thuế vẫn chuyển 6,5% (Benzarti). Thay cho việc 8 cho tới GĐ1 update 1 | `firm.taxPassUp` = 1 | 0,34 | Dương quyết 15/11/2026: hoàn thiện GĐ1, không thêm cơ chế; việc 8 (biên lãi hồi dần, IMF WP/15/214) dời sang GĐ1 update 1 | Hệ quả: chuyển ngay nhiều hơn bằng chứng ngắn hạn (0,26-0,34), gần bằng chứng dài hạn (quanh 1); K1.24 (đòi tỷ lệ chuyển sau 2 năm dưới 1) nhiều khả năng lại hỏng ở khoảng một nửa số seed như kết quả 11/20 ở D6, chờ kiểm định đầy đủ |
| S37 | **Tiền thuế thu thêm đi đâu**: sau khi người chơi hoặc thí nghiệm đổi luật thuế hoặc `tax.compliance`, Chính phủ chi lại phần thu thêm theo cơ cấu chi hiện tại (một hệ số chung nhân vào lương công chức, mua hàng, trợ cấp); giảm thuế thì vay bù, giữ nguyên chi. Chi tiết, hệ quả và bảng khai báo từng nơi ở D14 | quy tắc `gov.revenueUse` (base, keep, balanced); chỉ số `gov.respend` | trước S37: tiền thuế thu thêm nằm lại Kho bạc (tương đương `keep`) | Dương quyết 14-15/11/2026 (D13 hướng 3, việc 9) | Mặc định đổi cách mọi ván có đổi thuế chạy; K1.24, K1.25, K1.26 và hai kịch bản thuế giữ `keep` để không đổi cách đo. Khi chưa đổi thuế thì trùng từng bit với trước S37 (kiểm bằng mã băm một ván 60 tháng) |

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

**Cập nhật 15/11/2026:** đã đo. Tách nhánh ở tháng 240 thì GDP thực năm 6-10 chỉ còn +0,5% (tách ở 120: +4,4%). Phần lớn cú bật lại là do giai đoạn khởi động. Xem D16.

Giữ cách đo 3 năm đầu. Sau năm thứ năm nhánh siết tín dụng có GDP cao hơn nhánh gốc 2-6%. Mô hình thiếu cơ chế giảm phát nợ (giá giảm làm nợ thực nặng lên, doanh nghiệp vỡ nợ, ngân hàng mất vốn, tín dụng co tiếp), nên giá giảm chỉ có mặt lợi. Cơ chế này **đưa vào GĐ3**.

### D4. K1.26: giữ cách đo doanh số thực

Nộp thuế đủ làm khu vực phi chính thức nghèo đi, không nhỏ đi về số người.

### D5. Vì sao lạm phát bình quân 6-7% và rất khác nhau giữa các seed (đã xử lý theo quyết định 14/11/2026)

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
   - Bằng chứng nói lương bám lạm phát **quá khứ**, ít bám lạm phát kỳ vọng. **Dương quyết tối 14/11/2026: theo bằng chứng.** Đợt xét lương năm giờ bám lạm phát 12 tháng qua (S32). Lương đòi hỏi của người đang tìm việc (thiết kế mục 4) không đổi.
   - **Chưa phân biệt chính thức và phi chính thức**: không tìm được ước lượng riêng. Đã tách thành hai tham số (`firm.wageIndex`, `hkd.wageIndex`), đang để bằng nhau.
3. **S25: mức thất nghiệp bình thường tự sinh từ mô hình.** Bỏ con số 5% đặt tay. Giờ là trung bình trượt mũ 60 tháng của chính tỷ lệ thất nghiệp (`firm.nairuWindow`). Nguồn: Ball và Mankiw 2002, JEP 16(4): mức này đổi theo thời gian và được ước lượng bằng xu thế làm trơn (lọc Hodrick-Prescott) của thất nghiệp đã chỉnh theo thay đổi lạm phát; hai ông viết thẳng là tham số làm trơn "phần lớn là tuỳ ý". Đã đọc PDF. Đơn giản hoá: bỏ số hạng chỉnh theo lạm phát, dùng trung bình trượt thay lọc HP. Độ dài 60 tháng là tự thiết kế.
4. **Kết quả 20 seed, 500 hộ** (`scripts/validate.ts 20 base M`): K1.5 20/20, K1.10 18/20 qua. **K1.12 vẫn không qua: 12/20.**

**Vì sao K1.12 không qua** (không vá): lạm phát vẫn cùng chiều chu kỳ rất rõ, tương quan với GDP 0,50-0,79 ở mọi seed. Cái hỏng là điều kiện "trễ ít nhất một quý": đỉnh tương quan rơi vào cùng quý ở 8 seed, trễ một quý ở 12 seed. Bình quân 20 seed: cùng quý 0,60, trễ một quý 0,63, gần như bằng nhau. Lý do: giá trong mô hình đổi hằng tháng qua biên lãi (bán chạy thì nâng ngay), còn kênh chậm là lương xét mỗi năm. Khi lương bám 100% thì kênh chậm chiếm phần lớn nên có độ trễ. Giờ lương bám 50% thì kênh nhanh chiếm phần lớn. Mô hình thiếu thứ làm giá chậm lại ngoài đời: hợp đồng giá, chi phí đổi giá, đầu vào trung gian (đơn giản hoá số 4 của mục 18).

**Hệ quả khác phải biết**: lạm phát bình quân giờ 0-1,8% mỗi năm, thấp hơn mục tiêu 4,5% của NHNN; thất nghiệp 5,3-7,4%; niềm tin vào mục tiêu rơi về gần 0 vì lạm phát lệch xa mục tiêu. Trong mô hình không còn gì đẩy giá lên đều đặn: không tăng năng suất, không tăng dân số, ngân sách gần cân, và lương chỉ bám một nửa. Lạm phát giờ chỉ xuất hiện khi có cú đẩy (in tiền, chi tiêu công, tín dụng). Tớ thấy điều này hợp lý về cơ chế, nhưng nó xa số liệu Việt Nam (lạm phát 3-4%).

### D6. Kết quả kiểm định đầy đủ ngày 14/11/2026 (sau các quyết định trên): GĐ1 CHƯA QUA

Chạy `npm run validate:gd1`: 20 seed ở 500 hộ, 5 seed ở 5000 hộ, 20 seed ở 50 hộ. Báo cáo: [validation/gd1.md](../validation/gd1.md). Kế toán (K1.1-K1.4, K1.30) đúng ở mọi seed, mọi quy mô. Bảy mục không qua. Quyết định của Dương cho từng mục ở ngay dưới bảng.

| Mục | Số seed đạt | Số đo | Nguyên nhân tớ thấy |
|---|---|---|---|
| K1.19 | 1/20 | lạm phát +0,24 đến +1,41 điểm sau khi tăng lãi suất | Đã biết (D1, D2) |
| K1.12 | 12/20 ở 500 hộ, **5/5 ở 5000 hộ** | tương quan 0,50-0,79; đỉnh ở cùng quý (8 seed) hoặc trễ 1 quý (12 seed) | D5. Thêm: ở 5000 hộ qua hết, nên ở 500 hộ phần lớn là nhiễu do ít doanh nghiệp |
| K1.24 | 11/20 | tỷ lệ chuyển thuế vào giá: trung bình 0,99, khoảng 0,85-1,26 | Mô hình chuyển **trọn** thuế vào giá: giá = chi phí × (1 + biên lãi) × (1 + thuế), và biên lãi không co lại khi thuế tăng. Ngưỡng đòi "dưới 1" ở từng seed, nên một nửa rơi ra ngoài vì nhiễu. Khẳng định "ít hơn mức thuế" của thiết kế không được tái hiện. Lúc lương bám 100% thì qua 17/20, vì lạm phát chung che bớt |
| K1.28 | 7/20 | phần lạm phát còn lại sau cú sốc: bật kỳ vọng 74%, tắt 85%; hiệu −11 ± 17 điểm | Lương chỉ bám 50% lạm phát kỳ vọng nên kênh kỳ vọng yếu đi; tín hiệu nhỏ hơn nhiễu. Hệ quả trực tiếp của quyết định S7 |
| K1.29 | 15/20 (cần 16) | niềm tin làm GDP sau cú sốc thấp thêm 0,89 ± 1,1 điểm | Hiệu đúng dấu nhưng nhỏ. Trước các quyết định ngày 14/11 cũng hỏng (13/20) |
| K1.31 | 10/20 | lương nhóm thấp +0,0 đến +1,3%; việc làm chính thức −10% đến +4%, dấu chia đôi | Lương các doanh nghiệp tụm sát nhau (lao động đồng nhất), nên sàn ở 97% lương bình quân vẫn gần như không chạm ai. Hiệu ứng việc làm chỉ là nhiễu. GĐ2 có kỹ năng mới có nhóm lương thấp |
| K1.13 ở 5000 hộ | 0/5 | Gini của cải 0,29-0,33 (ngưỡng 0,4); ở 500 hộ 0,30-0,53, qua 19/20 | Gini phụ thuộc quy mô. Ở 5000 hộ có 250-310 doanh nghiệp, sở hữu trải rộng hơn. Chưa kiểm đây có phải lý do duy nhất |

Nhận xét chung: K1.24, K1.28, K1.31 từng qua khi lương bám 100% và lạm phát cao. Một phần là vì lạm phát nền cao làm mọi thứ "động" hơn và che nhiễu. Giờ lạm phát gần 0, các hiệu ứng nhỏ lộ ra là nhỏ.

Kiểm định kịch bản (10 seed): 13/15 qua hết. Hai kịch bản phải sửa lời giải thích theo điều mô hình nói (đã sửa, chờ chạy lại):
- `thue-nguoi-giau`: nâng thuế cổ tức và TNDN **không** làm Gini thu nhập giảm (2/10). Thuế thu thêm không được chi ra, thất nghiệp tăng 0,7-1,6 điểm, Gini lương tăng lấn át. Lời giải thích viết lại thành đúng phát hiện này.
- `hai-tay-lai`: bỏ khẳng định "tiêu dùng thực cao hơn sau vài năm" (6/10, +0,4% ± 0,9).
- `het-han-giam-thue`: bỏ câu "người bán giữ lại một phần" vì mô hình chuyển gần trọn thuế vào giá (K1.24).

**Quyết định của Dương tối 14/11/2026 cho bảy mục trên:**

| Mục | Quyết định | Đã làm |
|---|---|---|
| K1.12 | Kiểm ở 5000 hộ, ghi rõ phụ thuộc quy mô | Ở 500 hộ chỉ in để tham khảo, không tính đạt hay hỏng |
| K1.13 | KHÔNG đổi quy mô. Ghi "chưa đạt, thiếu cơ chế" | Phân tích và đề xuất ở D8, chờ duyệt |
| K1.31 | Sang GĐ2 | Ghi "đã biết, chuyển GĐ2" trong bộ kiểm định; ghi vào lộ trình |
| K1.24 | Sửa cơ chế: biên lãi co khi thuế tăng, có nguồn | S31. Thử 5 seed: tỷ lệ chuyển sau 2 năm 0,27-0,43, qua 5/5 |
| K1.19, K1.28, K1.29 | Ghi nhận "đã biết" | Ghi trong bộ kiểm định |

Lương bám lạm phát **quá khứ** (S32). Hệ quả đo được ở 5 seed: nền kinh tế vẫn ổn định, lạm phát bình quân 0,1-1,0%, thất nghiệp 6,0-6,8%. K1.28 giờ sai dấu rõ hơn (1/5): tắt kỳ vọng không còn chạm tới lương, nên không làm lạm phát tắt nhanh hơn.

### D8. K1.13: vì sao Gini của cải thấp ở 5000 hộ, và mô hình thiếu cơ chế gì (Dương quyết 14/11/2026: tiêu chí mới, không làm B)

Đo bằng `scripts/k113.ts`, năm thứ 30:

| | 500 hộ (3 seed) | 5000 hộ (2 seed) |
|---|---|---|
| Gini của cải ròng | 0,48-0,51 | 0,28-0,29 |
| Gini tiền mặt và tiền gửi | 0,19-0,25 | 0,18 |
| Gini thu nhập | 0,34-0,43 | 0,32-0,33 |
| Phần của cải của 10% giàu nhất | 45-48% | 21-23% |
| Số hộ còn giữ cổ phần doanh nghiệp | 28-39% | 71-72% |
| Gini của riêng cổ phần | 0,86-0,91 | 0,50-0,51 |
| Doanh nghiệp phá sản mỗi năm so với số đang có | khoảng 17% | khoảng 6% |

Điều tớ đọc ra:

1. **Ở 500 hộ, bất bình đẳng sinh ra từ nhiễu, không từ một cơ chế tích tụ.** Nền kinh tế nhỏ dao động mạnh hơn, doanh nghiệp chết nhanh gấp gần ba lần. Mỗi lần một doanh nghiệp chết, các chủ của nó mất trắng phần vốn. Sau 30 năm chỉ còn một phần ba số hộ giữ cổ phần. Ở 5000 hộ, dao động chung nhỏ hơn, doanh nghiệp sống lâu hơn, 71% số hộ vẫn là chủ. Nghĩa là con số 0,4 ở 500 hộ đạt được vì lý do không bền.
2. **Giả thuyết "chọn người góp vốn trong 60 hộ" chỉ đúng một phần.** Con số 60 không tăng theo dân số (S33). Thử nâng lên 600 ở 5000 hộ: Gini 0,27 và 0,36. Có tác dụng ở một seed, không ở seed kia. Không phải nguyên nhân chính.
3. **Mô hình có một lực san bằng mạnh.** Mọi hộ tiêu cùng một tỷ lệ: 50% thu nhập cộng 8,3% tiền đang giữ mỗi tháng. Hộ nào có nhiều tiền hơn mức khoảng 6 tháng thu nhập thì tiêu bớt về mức đó. Cổ tức (90% lợi nhuận) về tay chủ rồi cũng bị tiêu đi theo đúng quy tắc này. Nên tiền không dồn lại được: Gini tiền chỉ 0,18, thấp hơn cả Gini thu nhập.

Các cơ chế còn thiếu, xếp theo giai đoạn:

| Cơ chế | Vì sao tạo bất bình đẳng | Giai đoạn | Chi phí |
|---|---|---|---|
| **A. Người giàu tiết kiệm phần lớn hơn của thu nhập** | Khuynh hướng tiêu dùng giảm khi thu nhập tăng, nên tiền dồn về nhóm trên thay vì bị tiêu về mức chung | **Làm được trong GĐ1** | Rẻ: một tham số trong quy tắc tiêu dùng của hộ. Nguồn: Dynan, Skinner và Zeldes 2004, "Do the Rich Save More?", JPE 112(2) (trí nhớ, phải mở lại để lấy độ dốc) |
| **B. Lợi tức vốn dồn tích: chủ tái đầu tư cổ tức** | Người đã có vốn dùng cổ tức góp vào doanh nghiệp mới, phần sở hữu lớn dần. Hiện cổ tức chỉ thành tiền gửi rồi bị tiêu | **Làm được trong GĐ1** | Vừa: đổi cách chọn người góp vốn thành xác suất theo của cải ròng (Caiani 2016: hộ góp vốn theo của cải), và bỏ con số 60. Phải kiểm lại gia nhập doanh nghiệp |
| C. Chênh lệch kỹ năng và lương | Lương phân tán thì thu nhập và tiết kiệm phân tán | GĐ2 (đã có trong lộ trình) | |
| D. Đất, nhà và thừa kế | Tài sản tăng giá, truyền qua thế hệ | GĐ3 | |
| E. Sở hữu tập trung: doanh nghiệp lớn, độc quyền | Lợi nhuận dồn về ít chủ | GĐ4 | |
| F. Mua bán cổ phần | Người giàu mua lại phần của người cần tiền | GĐ3 (thị trường tài sản) | |

**Dương duyệt A tối 14/11/2026** (không chỉnh độ dốc để Gini đạt ngưỡng; B chỉ làm nếu duyệt sau khi có kết quả A). Đã làm: S34.

Độ dốc lấy từ bài báo (đã đọc toàn văn bản NBER WP 7906):

- Bảng 4 và 5, dùng thu nhập lâu dài (ước lượng qua tiêu dùng, thu nhập 10 năm trước hoặc vài năm sau): tỷ lệ tiết kiệm tăng 1,25 đến 2,75 điểm phần trăm cho mỗi 10.000 đô la thu nhập (giá 1989). Thu nhập trung vị của nhóm 40-49 tuổi khoảng 36.000-45.000 đô la (Bảng 2).
- Bảng 5, PSID, tiết kiệm chủ động cộng lương hưu, theo năm nhóm thu nhập: 9,0% / 12,1% / 16,9% / 19,3% / 20,5%. SCF (thay đổi của cải): 1,8% / 8,0% / 9,0% / 15,2% / 23,4%; 5% giàu nhất 43,6%; 1% giàu nhất 50,2%.
- Quy đổi: 2 điểm × 4 (thu nhập trung vị tính bằng chục nghìn đô) = khoảng 8 điểm tỷ lệ tiết kiệm cho mỗi đơn vị log thu nhập. Chia cho tỷ lệ tiêu dùng 0,85 được độ co giãn **η = 0,09** (khoảng 0,06 đến 0,13). Phép quy đổi là của tớ, không có trong bài.
- Giới hạn: số liệu Mỹ thập niên 1980. Trong mô hình hộ không có vòng đời, nên "tiết kiệm nhiều hơn" thành "giữ nhiều tiền hơn so với thu nhập", không phải tích luỹ suốt đời.

**Kết quả A** (`scripts/k113.ts`, năm thứ 30):

| | 5000 hộ, η = 0 | 5000 hộ, η = 0,09 | 500 hộ, η = 0,09 |
|---|---|---|---|
| Gini của cải ròng | 0,30-0,31 | **0,33** (2 seed) | 0,47-0,50 |
| Gini tiền mặt và tiền gửi | 0,16 | 0,17-0,18 | 0,20-0,24 |
| Phần của 10% giàu nhất | 24% | 25-26% | 42-46% |
| Số hộ còn giữ cổ phần | 72-73% | 65-67% | 36-44% |

A đẩy Gini ở 5000 hộ lên khoảng 0,02-0,03. **Chưa tới 0,4.** Lý do: với η = 0,09, một hộ có thu nhập gấp ba mặt bằng chỉ giữ tiền nhiều hơn khoảng 7% so với thu nhập của nó. Lực san bằng chính còn nguyên: hộ nào cũng tiêu 8,3% số tiền đang giữ mỗi tháng. Tớ không chỉnh η.

**Nguồn của ngưỡng 0,4: không có.** gd1.md ghi [BAM], [Caiani] cho K1.13, nhưng đó là nguồn cho ý "bất bình đẳng tự hình thành". Tớ đã tìm trong bản PDF Caiani 2016 và trong research/: không có con số Gini nào. Ngưỡng 0,4 là số tớ tự đặt lúc viết thiết kế. Vậy điều kiện "ngưỡng dựa trên số liệu có cả đất và nhà" không áp dụng được, và tớ chưa hạ ngưỡng. Hai điều Dương nên biết trước khi quyết:

- Bỏ đất và nhà ra thường làm bất bình đẳng của cải **cao hơn**, không thấp hơn: nhà là tài sản của nhóm giữa, còn cổ phần và vốn kinh doanh tập trung ở nhóm trên (theo trí nhớ, chưa có nguồn đã đọc). Nên "GĐ1 chưa có đất" không phải lý do để hạ ngưỡng.
- Một tiêu chí thay thế không cần con số tuyệt đối: **Gini của cải cao hơn Gini thu nhập**, là điều đúng ở gần như mọi nước. Mô hình hiện đạt ở 5000 hộ sau khi có A (0,33 so với 0,27-0,31) nhưng sát nút; trước A thì không đạt (0,28-0,29 so với 0,32-0,33).

**Chờ Dương quyết**: (1) ngưỡng K1.13: giữ 0,4 và ghi "chưa đạt", hay đổi sang tiêu chí tương đối; (2) có làm B không (chủ tái đầu tư cổ tức, chọn người góp vốn theo của cải ròng).

**Quyết định của Dương, tối 14/11/2026; làm ngày 15/11/2026.** Bỏ ngưỡng 0,4. Tiêu chí mới của K1.13: Gini của cải ròng > Gini thu nhập sau thuế (bình quân 12 tháng cuối năm 30) và lệch phải, mọi quy mô. Không làm B; B (chủ tái đầu tư cổ tức, chọn người góp vốn theo của cải ròng) và mua bán cổ phần thuộc GĐ3, sở hữu tập trung thuộc GĐ4 (phac-thao-gd3-gd5.md). Số đo nhanh 15/11/2026 (Gini của cải / Gini thu nhập, bình quân tháng 348-359; độ lệch tháng 359): 500 hộ seed 1: 0,524 / 0,359 (hiệu +0,165; lệch 3,40); seed 2: 0,543 / 0,320 (+0,222; 3,66); seed 3: 0,518 / 0,306 (+0,212; 3,65): đạt 3/3. 5000 hộ seed 1: 0,308 / 0,336 (-0,028; 2,83); seed 2: 0,279 / 0,328 (-0,048; 2,26); seed 3: 0,295 / 0,284 (+0,011; 2,30): đạt 1/3. Tức tiêu chí mới đạt ở 500 hộ nhưng chưa đạt chắc ở 5000 hộ (thiếu cơ chế tích tụ, như đã nói ở trên); mục K1.13 không còn trong danh sách đã biết nên nếu kiểm định đầy đủ hỏng thì hiện là hỏng thật, chờ Dương/Opus đọc.

### D9. Tỷ lệ chuyển thuế vào giá: đã đọc toàn văn, chọn bất đối xứng (Dương quyết 14/11/2026)

Ba nguồn, hai bài đầu đã đọc toàn văn bằng bản PDF:

| Nguồn | Mẫu | Trong tháng đổi thuế | Cả kỳ | Tăng so với giảm |
|---|---|---|---|---|
| Benedek, De Mooij, Keen, Wingender 2015, IMF WP/15/214 | 17 nước khu vực đồng euro, 1999-2013, 1231 lần đổi | Thuế suất phổ thông 0,30; ưu đãi 0,36; chuyển nhóm 0,10 (Bảng 3). Gộp 0,15 | Phổ thông **1,39** (sai số 0,36) trong 12 tháng trước tới 12 tháng sau, trong đó 0,71 là TRƯỚC ngày đổi thuế; ưu đãi 0,30; gộp 0,32 | Bảng 4: trong tháng 0,16 và 0,14; cả kỳ 0,40 và 0,24; **không khác nhau có ý nghĩa** (p = 0,33) |
| IMF WP/21/61 (bản trích, chưa xác minh tác giả) | 14 nước khu vực đồng euro, 846 lần đổi | 0,26 | 0,31 | "Ít bằng chứng" về bất đối xứng |
| Benzarti, Carloni, Harju, Kosonen 2020, JPE 128(12) (bản NBER WP 23849) | Mọi lần đổi GTGT ở châu Âu 1996-2015; và tiệm cắt tóc Phần Lan (giảm 14 điểm năm 2007, tăng lại 2012) | Bảng 1: tăng **0,34** (0,064); giảm **0,065** (0,030) | Phần Lan: giá phản ứng với tăng mạnh gấp đôi giảm; chênh lệch còn nguyên nhiều năm sau | **Có, rõ.** Biên lãi và lợi nhuận tăng sau khi giảm thuế và ở lại mức cao hơn. Sau khi giảm thuế 60% tiệm giữ nguyên giá; sau khi tăng, khoảng một nửa chuyển trọn |

Điều tớ rút ra:

1. **Phần chuyển ngay khi TĂNG thuế: ba nguồn gặp nhau ở 0,26-0,34.** Chọn 0,34.
2. **Về lâu dài với thuế suất phổ thông thì gần trọn** (Benedek: 1,39, không bác được mức 1). Mô hình không đặt con số dài hạn: sau cú đổi thuế biên lãi đi theo sức mua. Đo 5 seed với bản đối xứng 0,31: sau 2 năm tỷ lệ chuyển 0,27-0,43, tức thấp hơn bằng chứng dài hạn. Mô hình cũng chưa có việc tăng giá đón trước ngày đổi thuế (0,71 trong Benedek). Đây là chỗ lệch còn lại.
3. **Bất đối xứng: bằng chứng trái nhau.** Hai bài của IMF trên khu vực đồng euro không thấy khác biệt có ý nghĩa; bài JPE thấy rõ. Tớ theo bài JPE vì nó thiết kế riêng để đo điều này (có nhóm đối chứng, có cú tăng và cú giảm cùng độ lớn trên cùng một ngành) và đã qua bình duyệt. Ước lượng điểm của Benedek cũng cùng chiều (0,40 so với 0,24). `firm.taxPassDown` = 0,065. Nếu Dương muốn theo hai bài IMF thì đặt `firm.taxPassDown` = `firm.taxPassUp`.
4. **Ngưỡng K1.24 không cần sửa.** Ngưỡng là "tỷ lệ chuyển sau 2 năm nằm giữa 0 và 1". Bằng chứng dài hạn cho thuế suất phổ thông là quanh 1 (khoảng tin cậy rộng, từ 0,7 tới 2,1). Mô hình cho 0,27-0,43. Nếu kiểm định đầy đủ cho thấy K1.24 hỏng thì tớ sẽ báo, chưa tự sửa ngưỡng.
5. Không có ước lượng cho Việt Nam.

Hệ quả cho kịch bản `het-han-giam-thue`: thuế về 10% rồi giảm lại 8% thì giá không xuống lại bao nhiêu. Phải chạy lại kiểm định kịch bản và viết lại lời giải thích theo số đo.

### D10. Kịch bản có giả định ngầm về tiền thuế (Dương quyết 14/11/2026)

Kết quả `thue-nguoi-giau` cũ phụ thuộc vào việc tiền thu thêm không được chi. Đã làm lại thành kịch bản ba nhánh chạy song song từ cùng một trạng thái: trợ cấp, đầu tư công (ở GĐ1 là mua hàng), trả nợ. Phần thu thêm tính như lập dự toán: thu thực 12 tháng sau khi tăng thuế trừ 12 tháng trước đó đã chỉnh theo GDP danh nghĩa; chi từ năm thứ hai. Không thêm cơ chế nào vào engine.

Số đo 10 seed, hiệu so với không tăng thuế (`scripts/optdiag.ts`):

| | Trợ cấp | Đầu tư công | Trả nợ |
|---|---|---|---|
| Gini thu nhập (điểm phần trăm) | −0,35 (từ −3,4 tới +2,4) | −0,21 (từ −2,1 tới +1,9) | **+3,2** (10/10 seed tăng) |
| GDP thực | −0,4% | −0,2% | **−6,5%** (10/10 giảm) |
| Đầu tư 5 năm đầu | +6,6% (rất nhiễu) | +0,5% | **−28%** (10/10 giảm) |
| Nợ công tính bằng đồng, 2 năm cuối | −2,4% | −5,0% | −5,7% (10/10 giảm) |
| Nợ công/GDP, 2 năm cuối (điểm) | +0,05 | −1,0 | +0,6 (7/10 seed TĂNG) |

Hai điều đáng nói: (1) chi lại tiền thuế thì cú hãm biến mất, nhưng Gini thu nhập chỉ giảm nhẹ và không chắc, vì chênh lệch thu nhập trong mô hình chủ yếu là có việc hay mất việc; (2) giữ tiền trả nợ làm số nợ giảm nhưng tỷ lệ nợ/GDP không giảm, vì GDP co lại.

Rà 14 kịch bản còn lại:

| Kịch bản | Giả định ngầm | Đã làm |
|---|---|---|
| `keo-vao-luoi-thue` | Giống hệt: thuế thu thêm không được chi | Làm thành ba nhánh. Kết luận chính không đổi ở cả ba: khu vực phi chính thức nghèo đi (−1,8% tới −3,2% thu nhập thực) và không nhỏ đi về số người |
| `het-han-giam-thue` | Gia hạn giảm thuế được bù bằng vay nợ, Chính phủ không cắt chi | Ghi rõ trong lời giải thích và mục đơn giản hoá. Sửa câu "giá giảm gần đúng bằng mức thuế" theo S31 |
| `can-ngan-sach` | Tiền cắt chi dùng để vay ít đi | Ghi rõ |
| `that-lung-buoc-bung` | Chính phủ và NHNN không bù phần cầu mất đi | Ghi rõ |
| `hai-tay-lai` | Bộ Tài chính không phản ứng | Đây chính là đề bài, đã nói rõ từ đầu |
| `may-in-tien`, `song-bang-luong`, `tin-dung-nong`, `gia-luong-tien` | Nguồn tiền là in tiền, nói rõ trong đề | Không cần sửa |
| `mot-khoan-vay`, `vach-xuat-phat`, `room-hay-lai-suat`, `chu-xuong`, `luong-toi-thieu` | Không có giả định tài khoá ngầm | Không cần sửa |

Cùng loại giả định trong bộ kiểm định: K1.26 (nộp thuế đủ) và K1.24 (tăng GTGT) đều giữ tiền thu thêm lại. Ghi chú của K1.26 đã nói điều này.

### D11. Vì sao thất nghiệp 6-7% và lạm phát gần 0 (PHÂN TÍCH, CHƯA SỬA, chờ Dương)

Dương ghi nhận 14/11/2026: hai con số này lệch xa Việt Nam (lạm phát vài phần trăm, thất nghiệp khoảng 2%). Đo bằng `scripts/demand.ts` (5 seed, 500 hộ, năm 11-40), dùng chính phân rã của mô hình.

**Thất nghiệp 6,3% không phải do thiếu cầu. Nó là người đang ở giữa hai việc.**

| Số đo | Giá trị |
|---|---|
| Người mất việc mỗi tháng | 7,0% số hộ |
| Thời gian thất nghiệp bình quân | 0,9 tháng |
| Chỗ trống đang tuyển | 8,1% số hộ, NHIỀU HƠN số người thất nghiệp |
| Mất việc vì "bán chậm nên cắt người" | 48 điểm mỗi năm (4% số hộ mỗi tháng) |
| Mất việc vì người tự làm bỏ nghề đi tìm việc | 20 điểm mỗi năm |
| Mất việc vì luân chuyển tự nhiên (`firm.turnover`) | 11 điểm mỗi năm |

Soi từng lần cắt người (seed 1, 120 tháng, 3024 lượt): gần như tất cả là đơn vị 2-5 người cắt đúng **một** người vì số người cần tụt một bậc (3 xuống 2, 4 xuống 3), rồi vài tháng sau lại tuyển. Hộ kinh doanh chiếm hơn một nửa. Nguyên nhân cơ chế:

1. Số người cần là số nguyên: `ceil(sản lượng mong muốn / năng suất)`. Với đơn vị 3 người, một người là một phần ba sản lượng. Doanh số tháng dao động vài phần trăm là đủ làm con số này nhảy một bậc.
2. Không có gì cản việc cắt và tuyển lại: không chi phí sa thải, không thời hạn báo trước, không giữ người chờ đơn hàng. Caiani cũng cắt ngay, nhưng doanh nghiệp của Caiani có hàng trăm người nên một người không đáng kể. Mô hình của ta thu nhỏ doanh nghiệp xuống 5 người mà giữ nguyên quy tắc.
3. Người bị cắt tìm được việc sau chưa đầy một tháng, nhưng mỗi tháng có 7% số hộ đi qua trạng thái này, nên lúc nào cũng có khoảng 6% đang thất nghiệp.

Hướng sửa có nguồn, CHƯA LÀM: Lengnick 2013 (mục 2.3, theo trí nhớ, phải mở lại) cho doanh nghiệp chỉ cắt người khi tồn kho vượt một ngưỡng trên, tuyển khi dưới ngưỡng dưới, mỗi tháng cắt tối đa một người và có hiệu lực sau một tháng. Đó là một dải chết quanh số người cần, thay cho việc bám sát từng tháng. Tớ đoán thất nghiệp sẽ về 2-3%, chưa đo.

**Lạm phát 0,6-0,9% vì không có gì làm tổng chi tiêu danh nghĩa tăng.**

| Số đo (bình quân năm 11-40) | Giá trị | Việt Nam (theo trí nhớ, mức C) |
|---|---|---|
| Tăng tiền của công chúng | 0,3-0,6% mỗi năm | khoảng 10-14% |
| Tăng dư nợ tín dụng | −1,2 đến −1,9% mỗi năm | khoảng 12-15% |
| Bội chi ngân sách | 0,6% GDP | khoảng 3-4% GDP |
| Đầu tư máy móc | 9% GDP | khoảng 30% GDP (gồm cả nhà ở và đầu tư công) |
| Tăng trưởng GDP thực | −0,3% mỗi năm | khoảng 6-7% |
| Sử dụng công suất máy | 70% (mức bình thường của doanh nghiệp là 80%) | |

Tiền mới chỉ vào nền kinh tế qua hai cửa: ngân hàng cho vay và ngân sách bội chi. Tín dụng đang co nhẹ vì máy dư (công suất 70%) nên doanh nghiệp không vay mua máy. Ngân sách gần cân. Không có tăng năng suất, không tăng dân số. Tổng tiền gần đứng yên thì mức giá gần đứng yên. Phần giá vẫn nhích lên mỗi năm: biên lãi ròng +0,27 điểm, lương +0,2, chi phí vốn +0,18, đổi nơi mua +0,15, nơi bán mới +0,12.

Vậy có hai vấn đề tách nhau:

- **Thất nghiệp**: vấn đề của quy tắc cắt và tuyển người ở đơn vị nhỏ. Không liên quan tổng cầu.
- **Lạm phát thấp, GDP thực giảm nhẹ, máy dư**: thiếu nguồn tăng chi tiêu danh nghĩa. Các hướng, CHƯA LÀM: (a) đặt bội chi mặc định gần mức Việt Nam (3-4% GDP) thay cho mức đang tự ra 0,6%; (b) tăng năng suất và dân số (đang để giai đoạn sau, lộ trình ghi "không tăng năng suất ở GĐ1"); (c) xem lại vì sao công suất dừng ở 70% thay vì 80%: có thể hàm đầu tư hoặc khâu gia nhập đang tạo máy dư.

Tớ nghiêng về sửa thất nghiệp trước (có nguồn, tách bạch), rồi đo lại, rồi mới bàn (a) và (c). Chờ Dương.

**Đo tối 15/11/2026: quy tắc dải tồn kho của Lengnick (S38) KHÔNG giải được thất nghiệp. CHƯA NHẬN, chờ Dương.**

Code nằm ở nhánh `thu/3d-dai-ton-kho` (chưa nhập vào main, thiếu test và mục F). Đo bằng `scripts/demand.ts 5 M` (500 hộ, 5 seed, năm 11-40):

| Số đo | Bản đang dùng (`track`) | Dải Lengnick đúng theo bài | Bản thử: tính cả sức làm bỏ không vào tồn kho |
|---|---|---|---|
| Thất nghiệp | 6,3% | 4,9% | 6,1% |
| Người mất việc mỗi tháng, % số hộ | 7,0 | 5,9 | 6,7 |
| Thời gian thất nghiệp, tháng | 0,9 | 0,84 | 0,90 |
| Mất việc vì bán chậm, điểm mỗi năm | 48 | 15,5 | 41 |
| Mất việc vì đơn vị không đủ tiền trả lương, điểm mỗi năm | nhỏ | **34** | 8,8 |
| Chỗ trống, % số hộ | 8,1 | 7,7 | 6,6 |

Vì sao không được như tớ đoán (2-3%):

1. **Tồn kho của mô hình ta không nằm trong dải.** Soi seed 1, năm 11-20: khoảng 60-65% số đơn vị-tháng có tồn kho DƯỚI ngưỡng dưới (0,25 lần lượng bán), khoảng 25% TRÊN ngưỡng trên, chỉ khoảng 12% ở trong dải. Bản `track` cũng có phân bố y như vậy. Dải không phải là "vùng đứng yên" như trong mô hình của Lengnick.
2. **Trong mô hình Lengnick, mọi người đang có việc đều sản xuất**, nên thuê thêm là có thêm hàng, thừa người là tồn kho phình ra. Trong mô hình ta, sản lượng bị chặn ở mức mong muốn (Caiani 3.2). Hệ quả: đơn vị hết hàng thuê thêm một người mỗi tháng mà không làm thêm hàng, trả lương tới khi cạn tiền rồi cắt người vì không trả nổi. Việc cắt người chỉ đổi lý do, từ "bán chậm" sang "không đủ tiền trả lương".
3. Bản thử (cộng sức làm bỏ không vào tồn kho, để giống Lengnick hơn; tự thiết kế, chỉ để chẩn đoán, diff không commit) đưa mọi số về gần bản cũ.

Tác dụng phụ: với dải Lengnick, test `session.test.ts` "bỏ một chính sách..." đỏ lại (50 hộ, seed 3: CPI ván tăng thuế 107,1 so với đối chứng 108,5). Đo `scripts/vatcpi.ts`: 500 hộ +4,22%, 10/10 seed dương; 50 hộ +2,65%, 9/10 seed dương. Tức là nhiễu của một seed ở 50 hộ, không phải hiện tượng D13 quay lại. Nhưng test đó Dương đã yêu cầu giữ nguyên.

Kết luận của tớ: nguyên nhân gốc ở D11 mục 1 vẫn đúng (đơn vị 2-5 người, số người là số nguyên), nhưng thuốc không hợp. Muốn ghép dải của Lengnick vào thì phải đổi cả cách quyết sản lượng, tức là một cơ chế mới. Đề xuất: **không đưa S38 vào GĐ1**, ghi thất nghiệp 6-7% là "đã biết", chuyển việc này sang GĐ2 (con người, thị trường lao động) hoặc GĐ1 update 1. Dương quyết.

### D12. Sửa một lỗi phân rã giá (S35) và hệ quả cho D5

Khi một nơi bán mới mở tính giá lần đầu, bản ghi quyết định ghi cả mức giá vào `p_wage` rồi trừ lại ở "yếu tố khác". Tổng vẫn đúng nên test không bắt được. Ở 5 seed: `p_wage` +1,32 điểm và "yếu tố khác" −1,41 điểm mỗi năm; sau khi sửa `p_wage` còn +0,20 và không còn phần "khác". Kinh tế không đổi, chỉ nhãn đổi.

Hệ quả: câu ở D5 mục 1 "trong 7,5 điểm lạm phát, chi phí lương +5,9" bị thổi lên khoảng 1 điểm vì lỗi này. Kết luận của D5 (lương bám 100% là nguồn chính) vẫn đứng: phần lương vẫn là lớn nhất.

### D13. Tăng GTGT mà sau hai năm mức giá không cao hơn (CHỜ DƯƠNG, chưa sửa test hay cơ chế)

Test `tests/unit/session.test.ts` "bỏ một chính sách" đòi CPI của ván tăng GTGT lên 20% cao hơn thế giới đối chứng sau 24 tháng. Ở 50 hộ, seed 3, nó hỏng (108,3 so với 109,9). Fable đã nới assertion; Dương yêu cầu hoàn lại và kiểm ở quy mô lớn. **Assertion đã hoàn lại, test đang đỏ có chủ ý**, chờ Dương quyết.

Đo bằng `scripts/vatcpi.ts` (tăng GTGT lên 20% ở tháng 12, chạy đôi với thế giới không tăng):

| CPI so với đối chứng | 50 hộ, 20 seed | 500 hộ, 10 seed | 5000 hộ, 3 seed |
|---|---|---|---|
| Sau 1 tháng | +0,90% (20/20 dương) | +0,92% (10/10) | +0,92% (3/3) |
| Sau 12 tháng | +0,79% (20/20) | +1,05% (10/10) | +0,93% (3/3) |
| Sau 24 tháng | −0,10% (10/20 dương; từ −2,2 tới +1,6) | +0,36% (9/10; từ −0,2 tới +0,9) | **−0,23% (0/3 dương; từ −0,31 tới −0,09)** |

Kết luận về quy mô: **không phải nhiễu của 50 hộ.** Trong năm đầu giá cao hơn ở mọi seed, mọi quy mô. Tới tháng 24 khoảng cách khép lại; ở 5000 hộ nó đổi dấu ở cả 3 seed với biên độ hẹp. Mới có 3 seed ở 5000 hộ.

Phân rã chênh lệch CPI trong 24 tháng (điểm phần trăm, từ bản ghi quyết định giá):

| Lý do | 500 hộ | 5000 hộ |
|---|---|---|
| Thuế trong giá tăng (`p_vat`) | +2,60 | +2,61 |
| Người bán tự gánh bằng biên lãi (`p_tax_absorb`) | −1,68 | −1,69 |
| Chi phí lương mỗi sản phẩm (`p_wage`) | −0,35 | −0,85 |
| Chi phí máy và lãi vay (`p_capital`) | −0,33 | −0,43 |
| Ít lần nâng biên lãi vì bán chạy (`p_markup_up`) | −0,16 | −0,18 |
| Đổi nơi mua (`p_mix`) | +0,28 | +0,31 |
| Cộng | +0,36 | −0,23 |

Cách đọc: thuế tự nó đẩy giá lên 0,92 điểm (2,60 trừ phần người bán gánh 1,68). Sau đó cầu yếu đi kéo giá xuống khoảng 0,6 tới 1,2 điểm. Cầu yếu vì hai thứ cùng lúc: thuế lấy tiền của hộ, và **tiền thuế thu thêm không được chi ra** (cùng giả định ngầm ở D10). Năm thứ hai, so với đối chứng: GDP thực −4,2% (500 hộ) và −6,1% (5000 hộ); tiêu dùng thực −2,9% và −3,8%; thất nghiệp +0,5 và +0,6 điểm; giá hàng của hộ kinh doanh (không chịu GTGT) −0,3% và −0,8%.

Hai kiểm tra thêm ở 500 hộ, 10 seed:

- **Bất đối xứng thuế không liên quan.** Đặt `firm.taxPassDown` = `firm.taxPassUp` = 0,34: kết quả trùng từng chữ số với mặc định. Trong thí nghiệm này không có lần giảm thuế nào.
- **Chuyển trọn thuế vào giá** (hai tham số = 1, bản cũ): CPI +3,2% sau 24 tháng, 10/10 seed dương. Vậy assertion hỏng là hệ quả của S31 (chuyển một phần) cộng với việc tiền thuế không được chi; mỗi thứ riêng thì không đủ.

Điều tớ chưa kiểm: nếu tiền thuế được chi ra thì giá sau 24 tháng thế nào; và vì sao ở 500 hộ dấu khác 5000 hộ (500 hộ có ít doanh nghiệp, lương ít giảm hơn: `p_wage` −0,35 so với −0,85).

**Dương quyết đêm 14/11/2026** (chưa làm, việc 8, 9, 10 trong progress.md): không đổi cửa sổ đo, giữ assertion 24 tháng. Theo hướng 2: thêm cơ chế biên lãi hồi dần để mức chuyển thuế đi từ 0,34 tới gần trọn trong khoảng 2 năm, tốc độ lấy từ bài IMF 2015, giữ bất đối xứng cho chiều giảm. Theo hướng 3: mọi thí nghiệm và kịch bản đổi thuế phải khai tiền thu thêm đi đâu; mặc định chi lại theo cơ cấu chi hiện tại, giữ lại là biến thể. Tìm hiểu vì sao 500 và 5000 hộ khác dấu.

Hai quyết định bổ sung cùng đêm (chưa làm, việc 8, 8b, 9 trong progress.md):

- **Mặc định tài khoá theo hành vi thực tế của Chính phủ Việt Nam.** Tăng thuế: tiền thu thêm được chi lại theo cơ cấu chi hiện tại. Giảm thuế: vay bù, giữ nguyên chi tiêu. Cắt chi và giữ tiền lại là biến thể so sánh. Khi làm, mỗi mặc định phải kèm một câu nói nó dựa trên hành vi nào và nguồn; hiện CHƯA có nguồn, mới là nguyên tắc Dương đặt.
- **Tăng giá đón trước ngày thuế có hiệu lực sẽ được mô hình hoá** (việc 8b), dùng hệ luật theo ngày hiệu lực, tham số từ IMF 2015. **Cho tới khi làm xong, đây là một đơn giản hoá đã biết**: mô hình thiếu phần giá tăng trước ngày đổi thuế (0,71 trong tổng 1,39 của Benedek 2015, Bảng 3), nên về lâu dài chuyển thuế vào giá ít hơn bằng chứng. Mục tiêu của cơ chế hồi biên lãi (việc 8) chỉ tính phần sau ngày đổi thuế; không ép phần hồi bù cho phần đón trước.

Các lựa chọn đã trình (để đối chiếu):

1. Giữ assertion, đo ở 12 tháng thay cho 24 tháng: đúng 100% số seed ở mọi quy mô, và là điều test muốn nói ("tăng thuế thì giá cao hơn"). Đây là đổi cửa sổ đo.
2. Giữ assertion 24 tháng và coi kết quả là dấu hiệu cơ chế sai: cầu sụt 4-6% GDP sau một lần tăng thuế mà Chính phủ ngồi im là quá mạnh, hoặc 0,34 chuyển ngay rồi không đuổi kịp về lâu dài là quá ít (bằng chứng dài hạn ở D9 nói gần trọn).
3. Cho thế giới thử nghiệm chi lại tiền thuế, rồi mới so giá.

**Cập nhật 15/11/2026.** Dương quyết tạm thời cho tăng thuế chuyển trọn vào giá (S36). Việc 8 và 8b dời sang GĐ1 update 1. Test `session.test.ts` "bỏ một chính sách thì trùng với ván chưa từng có chính sách đó": XANH sau khi đổi (không đo lại số CPI cụ thể; phép đo trước đó với chuyển trọn là +3,2%); ngưỡng của test `control = shock` đưa về 0,01 như trước 14/11 và cũng qua.

**Việc 10 đóng, 15/11/2026.** Sau S36 (tăng thuế chuyển trọn) và S37 (khai nơi tiền thuế đi), hiện tượng khác dấu giữa 500 và 5000 hộ không còn. Đo bằng `scripts/vatcpi.ts` (GTGT lên 20%, chênh CPI so với đối chứng sau 24 tháng): 500 hộ, 10 seed: chi lại +3,82% (10/10 dương), giữ lại +3,24% (10/10); 5000 hộ, 5 seed: chi lại +3,67% (5/5), giữ lại +3,07% (5/5). Hai quy mô cùng dấu và gần nhau. Ở bản giữ lại, CPI tháng 24 thấp hơn tháng 12 (cầu sụt 5-6% kéo lương và biên lãi), đúng hướng của phân rã cũ nhưng không đủ để đảo dấu. Câu hỏi "vì sao khác dấu khi chuyển một phần" sẽ quay lại khi làm việc 8 ở GĐ1 update 1: lúc đó đo lại ở cả hai quy mô.

### D14. Việc 9: tiền thuế thu thêm đi đâu (cơ chế S37, ngoài thiết kế, Dương đặt yêu cầu 14-15/11/2026)

**Yêu cầu của Dương.** Mọi thí nghiệm và kịch bản có đổi thuế phải khai rõ tiền thu thêm đi đâu. Mặc định theo hành vi thực tế của Chính phủ Việt Nam: **tăng thuế thì chi lại theo cơ cấu chi hiện tại; giảm thuế thì vay bù, giữ nguyên chi**. Giữ lại không chi (chiều tăng) và cắt chi (chiều giảm) là biến thể so sánh. Hệ quả phải nhớ: hai chiều không đối xứng, nợ công trôi lên qua các lần giảm thuế.

**Thiết kế cơ chế là của người điều phối (Fable, 15/11/2026), Dương chưa soát chi tiết.** Quy tắc `gov.revenueUse` trong sổ quy tắc:

- **Kích hoạt.** Khi người chơi hoặc một thí nghiệm đổi một luật thuế (`vat.*`, `pit.*`, `cit.*`, `hkd.threshold`, `tax.indirect.other`) hoặc đổi biến thể `tax.compliance`, sau tháng đầu của ván. Không kích hoạt bởi: điều kiện ban đầu, việc tự chỉnh ngưỡng theo lạm phát, và thay đổi đã nằm sẵn trong luật hiện hành (GTGT tự về 10% từ 01/01/2027). Lý do: dự toán ngân sách đã tính theo luật hiện hành; "thu thêm" là so với luật hiện hành.
- **Mốc.** Lúc kích hoạt lần đầu, ghi tỷ lệ thu thuế / GDP danh nghĩa của 12 tháng trước đó (ít hơn nếu ván chưa đủ 12 tháng; cần ít nhất 1 tháng, sửa ngày 16/11/2026 ở D17). Thu thuế gồm GTGT, TNCN, TNDN, thuế hộ kinh doanh, thuế gián thu khác; không gồm phí và đất. Mốc giữ nguyên tới hết ván.
- **Mỗi tháng sau đó.** Thu thêm = (tỷ lệ thu thuế / GDP của 12 tháng gần nhất − mốc) × GDP tháng (làm trơn). Dùng cửa sổ 12 tháng vì thuế TNDN quyết toán theo năm, và vì ngân sách ngoài đời lập theo năm. Hệ quả: phần chi lại vào dần trong 12 tháng đầu, đủ từ năm thứ hai.
- **Chi lại.** Một hệ số chung nhân vào lương công chức, ngân sách mua hàng và trợ cấp, sao cho tổng chi tăng đúng bằng phần thu thêm. Cùng một hệ số nên cơ cấu chi giữ nguyên. Không đổi giá trị luật nào; lãi trái phiếu không đổi.
- **Biến thể.** `base`: thu thêm thì chi lại, hụt thu thì vay bù (hệ số không xuống dưới 1). `keep`: không bao giờ chỉnh chi (bản "về thiết kế": tăng thuế thì tiền nằm lại Kho bạc, giảm thuế thì vay bù). `balanced`: thu thêm thì chi lại, hụt thu thì cắt chi.
- **Ngoài đời ai làm việc này.** Chính phủ và Quốc hội: thu vượt dự toán được phân bổ chi ở năm sau; các đợt giảm GTGT 2022-2026 được bù bằng bội chi, không kèm cắt chi tương ứng. Hai câu này ghi theo trí nhớ (mức C), chưa có văn bản dẫn; GĐ9 tra lại.

**Đơn giản hoá phải nói thật.**
1. Sau khi kích hoạt, MỌI thay đổi của tỷ lệ thu thuế / GDP so với mốc đều được chi lại, kể cả thay đổi không do luật thuế (chu kỳ, lao động chuyển khu vực). Mô hình không tách được hai thứ nếu không có thế giới đối chứng.
2. Nếu kích hoạt trong năm 2026 thì lần GTGT tự về 10% tháng 1/2027 cũng bị tính là thu thêm.
3. "Chi lại theo cơ cấu" nâng lương công chức chứ không tuyển thêm người.
4. Chi lại trễ dần trong một năm; trong năm đầu phần chưa chi làm bội chi nhỏ lại.

**Khai báo ở từng nơi** (bảng này phải khớp với code):

| Nơi | Dùng gì | Vì sao |
|---|---|---|
| K1.24, K1.25, K1.26 trong bộ kiểm định | `keep` | Giữ nguyên cách đo đã duyệt: đo riêng tác động của thuế. Đổi sang chi lại là đổi cách đo, cần Dương duyệt |
| `tests/unit/session.test.ts`, hai test tăng GTGT | mặc định `base` (chi lại) | Hướng 3 trong quyết định D13 của Dương |
| `tests/unit/scenario-options.test.ts`, test chuyển thuế | mặc định; chỉ đo 1 tháng nên không ảnh hưởng | |
| Kịch bản `thue-nguoi-giau`, `keo-vao-luoi-thue` | `keep` cho cả ba nhánh | Ba nhánh tự khai nơi tiền đi (trợ cấp, mua hàng, trả nợ) bằng bước riêng ở tháng 12; để cơ chế tự động bật thì chi hai lần |
| Kịch bản `het-han-giam-thue` | mặc định `base` | Gia hạn 8% là giảm thuế so với luật hiện hành: vay bù, giữ chi. Nhánh đối chứng (để thuế về 10%) không kích hoạt |
| `scripts/vatcpi.ts` | in cả `base` và `keep` | Công cụ chẩn đoán của D13 |

### D15. K1.26 hỏng ở cửa sổ 10 năm; mô hình khuếch đại cú sốc cầu quá mạnh (Dương quyết 15/11/2026)

Lượt kiểm định 15/11 trên `b7ce617`: K1.26 đạt 13/20 seed ở 500 hộ (bản trưa 14/11: 17/20). Chẩn đoán bằng hiệu chạy đôi theo năm, 20 seed.

**Tác động trực tiếp của thuế vẫn đúng.** Ở năm 2-4, mục này đúng 20/20 seed: thu/GDP +0,3 đến +0,9 điểm, doanh số thực hộ kinh doanh −0,8 đến −7,0%.

**Năm 5-10 một cuộc suy thoái do chính thí nghiệm gây ra lấn át.** Seed 6 và 14 (lao động phi chính thức +8 đến +9 điểm), nhánh nộp đủ so với nhánh gốc:

1. Năm 1-4: thuế hộ kinh doanh thu thêm khoảng 0,8% GDP và không được chi ra (`gov.revenueUse = keep`). Giá hàng hộ kinh doanh +3% năm đầu. GDP thực thấp dần tới −4 đến −8%.
2. Năm 5-6: khu vực chính thức sụp một đợt. Số doanh nghiệp −18% trong năm 5. Việc làm chính thức −35 đến −46%, dư nợ −42%, đầu tư −50 đến −70%.
3. Năm 6-10: người mất việc chính thức mở hộ kinh doanh hoặc tự làm (số hộ kinh doanh +20 đến +35%). Phần chi tiêu mua ở hộ kinh doanh +14 đến +19 điểm, nên doanh số thực của khu vực này tăng dù tổng tiêu dùng giảm. Thu ngân sách −27 đến −33% ở đáy, nên thu/GDP có seed âm.

Seed đạt (seed 1) cũng suy thoái gần như vậy (GDP thực −17% ở năm 6), chỉ khác là người mua không chuyển sang hộ kinh doanh. Vậy ở cửa sổ 10 năm, đạt hay không là may rủi của đợt sụp.

**Vì sao tụt từ 17/20 xuống 13/20.** Chạy lại 20 seed, mỗi lần gỡ một thay đổi:

| Cấu hình | Đạt 10 năm | Đạt năm 2-4 | GDP thực năm 5-7 | Việc làm chính thức năm 5-7 |
|---|---|---|---|---|
| Hiện tại (`keep`) | 13/20 | 20/20 | −6,4% (tới −24,8%) | −10,7% (tới −39,8%) |
| Lương bám lạm phát kỳ vọng (trước S32) | 18/20 | 19/20 | −3,3% | −4,7% |
| `firm.taxPassUp` = 0,34 (trước S36) | 16/20 | 16/20 | −3,7% | −5,9% |
| Chi lại tiền thu thêm (`base`) | 13/20 | 19/20 | −0,3% | +0,3% |

S32 và S36 đều làm suy thoái sâu gần gấp đôi. Chi lại thì suy thoái hết, nhưng ở 10 năm doanh số hộ kinh doanh chỉ giảm 1,5% bình quân và đổi dấu ở 7 seed.

**Dương quyết 15/11/2026:** K1.26 đo ở năm 2-4 (đổi cửa sổ đo, ghi mục F).

**Phát hiện riêng (đã biết, chưa sửa): mô hình khuếch đại cú sốc cầu quá mạnh.** Rút 0,8% GDP khỏi vòng chi tiêu mà GDP thực mất tới 25% ở vài seed. **(Sửa theo D16: con số 25% là khi cú sốc rơi vào đỉnh của giai đoạn khởi động; ở trạng thái thường là bình quân 4,9%, sâu nhất 12,8%.)** Nguyên nhân: thiếu ổn định tự động. Không có bảo hiểm thất nghiệp hay BHXH đỡ thu nhập khi mất việc, hộ không vay được để giữ tiêu dùng, ngân sách giữ tiền lại. Xử lý ở GĐ2 (BHXH, trợ cấp thất nghiệp) và GĐ3 (tín dụng tiêu dùng, giảm phát nợ). Cho tới lúc đó: mọi kịch bản và thí nghiệm dài hơn khoảng 4 năm có cú sốc cầu đều có thể bị thổi phồng; mục S13 trong game nói rõ điều này. Phần khuếch đại còn liên quan D16.

Script đo: bản tạm của người điều phối (không commit); đo lại được bằng `scripts/pairdiag.ts k126 20 10`.

### D16. Nhánh gốc mặc định có một đợt bùng rồi vỡ quanh năm 10-20 (đo 15/11/2026, CHỜ DƯƠNG)

Dương yêu cầu kiểm tra: cấu hình mặc định, không can thiệp, 40 năm. Bình quân năm:

| | Năm 1 | Năm 10 | Năm 20 | Năm 40 |
|---|---|---|---|---|
| **500 hộ, 10 seed** | | | | |
| Số doanh nghiệp | 40,8 | 41,9 | 23,3 | 22,0 |
| Việc làm chính thức | 148 | 194 | 150 | 148 |
| GDP thực (tỷ) | 3,66 | 4,13 | 3,50 | 3,69 |
| Dư nợ (tỷ) | 8,4 | 19,4 | 15,8 | 13,5 |
| Sử dụng công suất máy | 81% | 80% | 70% | 72% |
| Thất nghiệp | 3,8% | 4,1% | 7,7% | 4,1% |
| **5000 hộ, 5 seed** | | | | |
| Số doanh nghiệp | 309 | 320 | 324 | 305 |
| Việc làm chính thức | 1479 | 1829 | 1605 | 1455 |
| GDP thực (tỷ) | 36,6 | 40,2 | 36,7 | 35,4 |
| Dư nợ (tỷ) | 84,6 | 178,9 | 158,4 | 132,3 |
| Sử dụng công suất máy | 81% | 78% | 75% | 69% |
| Thất nghiệp | 4,1% | 4,4% | 5,9% | 6,0% |

- Không phải co dần suốt 40 năm. Mười năm đầu là một đợt bùng nổ tín dụng (dư nợ hơn gấp đôi, việc làm chính thức +24 đến +30%); năm 10-20 vỡ; sau đó đi ngang quanh mức năm 1.
- Năm 10 tới năm 40: việc làm chính thức −12 đến −28% ở mọi seed 5000 hộ; GDP thực −5 đến −17%.
- **Phụ thuộc quy mô:** số doanh nghiệp giảm một nửa chỉ ở 500 hộ (9/10 seed giảm 34-73%); ở 5000 hộ gần như giữ nguyên.
- **Hệ quả cho kiểm định:** các thí nghiệm chạy đôi tách nhánh ở tháng 120 (`BURN`), đúng đỉnh của đợt bùng nổ, rồi chạy xuyên qua đợt vỡ. Phần khuếch đại ở D15 có thể một phần do cú sốc rơi vào lúc nền kinh tế sắp vỡ sẵn. Chưa đo kết luận nào đổi nếu tách nhánh muộn hơn.
- Chưa biết nguyên nhân sâu: điều kiện ban đầu (vốn, nợ lúc khởi tạo thấp hơn mức cân bằng) hay hàm đầu tư. Chưa sửa gì.

**Dương quyết 15/11/2026: ghi "đã biết"; đo thêm 80 năm và đo thử tách nhánh ở tháng 240 (chỉ đo, không đổi kiểm định).**

**Chạy 80 năm: đây là giai đoạn khởi động, không phải chu kỳ.** Bình quân năm:

| | Năm 1 | Năm 10 | Năm 20 | Năm 40 | Năm 60 | Năm 80 |
|---|---|---|---|---|---|---|
| 500 hộ (10 seed): việc làm chính thức | 148 | 194 | 150 | 148 | 152 | 152 |
| 500 hộ: GDP thực (tỷ) | 3,66 | 4,13 | 3,50 | 3,69 | 3,65 | 3,63 |
| 500 hộ: số doanh nghiệp | 40,8 | 41,9 | 23,3 | 22,0 | 23,9 | 23,5 |
| 5000 hộ (5 seed): việc làm chính thức | 1479 | 1829 | 1605 | 1455 | 1366 | 1450 |
| 5000 hộ: GDP thực (tỷ) | 36,6 | 40,2 | 36,7 | 35,4 | 33,2 | 35,2 |
| 5000 hộ: số doanh nghiệp | 309 | 320 | 324 | 305 | 317 | 343 |

Từ năm 20, GDP thực dao động khoảng ±5% quanh một mức; đợt vỡ không lặp lại. Hai thứ trôi chậm: số hộ kinh doanh tăng dần (500 hộ: 95 lên 138 sau 80 năm; 5000 hộ: 945 lên 1245), sử dụng công suất máy ở 67-72%.

**Tách nhánh ở tháng 240 thay cho 120 (500 hộ, 20 seed, script tạm của người điều phối gọi `pair(..., at)` của gd1-lib):**

| Mục | Tách ở 120 | Tách ở 240 |
|---|---|---|
| K1.22 | 18/20; tín dụng −15,3%, GDP thực −5,5% (3 năm đầu); GDP thực năm 6-10 **+4,4%** | 20/20; −13,8%, −4,7%; năm 6-10 **+0,5%** (−10,7 đến +12,3) |
| K1.24 (trần 1,39) | 20/20; tỷ lệ chuyển 1,03 (0,90 đến 1,31) | 20/20; 1,01 (0,66 đến 1,23) |
| K1.26, năm 2-4 | 20/20 | 19/20 |
| K1.26, nếu đo 10 năm | 13/20 | 20/20 |
| K1.26: GDP thực năm 5-7 | −6,4% (tới −24,8%) | −4,9% (tới −12,8%) |
| K1.26: việc làm chính thức năm 5-7 | −10,7% (tới −39,8%) | −7,9% (tới −20,0%) |
| K1.26: phần mua ở hộ kinh doanh năm 8-10 | +2,8 điểm (tới +18,6) | +1,2 điểm (tới +2,9) |

Không mục nào đổi qua/không qua. Hai kết luận đã báo phải sửa:
1. **D15:** mức khuếch đại "tới 25% GDP" là của trạng thái sắp vỡ. Ở trạng thái thường, rút 0,8% GDP làm GDP thực năm 5-7 thấp hơn bình quân 4,9%, sâu nhất 12,8%. Mô hình vẫn khuếch đại quá mạnh, nhưng ít hơn đã báo. Việc khu vực chính thức sụp và người chuyển hàng loạt sang hộ kinh doanh gần như không còn.
2. **D3 và ghi chú K1.22:** cú bật lại ở năm 6-10 phần lớn là do nhánh gốc đang vỡ. Tách ở 240 thì chỉ còn +0,5%. Ghi chú K1.22 trong gd1-lib.ts ("bật lên thành một chu kỳ dài") và kịch bản dựa trên nó cần rà lại khi dời điểm tách nhánh.

**Dương quyết 15/11/2026 (đợt hai):** dời điểm tách nhánh của kiểm định và kịch bản sang tháng 240 ngay, chạy lại, không nới ngưỡng; duyệt hướng làm nóng sẵn cho game, đưa vào spec GĐ1.5.

**Thời gian làm nóng 240 tháng trên trình duyệt** (Chrome, chạy trong Web Worker, kiểm kế toán mỗi tháng như mặc định, máy của Dương, code `815538c`): 50 hộ 0,1-0,2 giây; 500 hộ 0,7-0,8 giây; 5000 hộ 7,3-8,2 giây (9 lượt, 8 seed; mỗi 60 tháng mất 1,5 đến 2,3 giây, chậm dần vì số khoản vay tăng). Một lượt lẻ lên 22,5 giây lúc máy đang chạy việc khác; chạy lại cùng seed ra 7,4-8,2 giây. Dưới mốc 30 giây Dương đặt, nên KHÔNG cần đóng gói sẵn trạng thái: tính lúc tạo ván, có thanh tiến độ ở 5000 hộ, lưu IndexedDB. Máy yếu hơn (điện thoại) chưa đo.

**Đề xuất "làm nóng sẵn" (ĐÃ DUYỆT hướng 15/11/2026; điểm 4 đang làm; đưa vào spec GĐ1.5):** (1) ván mới bắt đầu từ trạng thái tháng 240, người chơi vẫn thấy năm bắt đầu 2026; (2) tính lúc tạo ván (khoảng 1 giây ở 500 hộ, 20 giây ở 5000 hộ), lưu IndexedDB theo quy mô, seed, phiên bản engine; không đóng gói file trạng thái; (3) làm nóng bằng luật đứng yên ở phiên bản 2026 rồi đặt lại đồng hồ, luật có ngày hiệu lực không kích hoạt trong lúc làm nóng, chuỗi nhân quả và biểu đồ bắt đầu sạch; (4) kiểm định và kịch bản dời điểm tách nhánh sang tháng 240: đổi cách đo của mọi thí nghiệm chạy đôi, cần Dương duyệt riêng và chạy lại toàn bộ.

### D17. gov.revenueUse bỏ sót lần đổi thuế ở tháng 1 và 2 (ĐÃ SỬA 16/11/2026, Dương duyệt)

Sonnet đo khi viết test U2 (ván 50 hộ, seed 1, đổi `vat.rate.standard` lên 12% ở tháng N, chạy 24 tháng): N = 1 hoặc 2 thì quy tắc không bao giờ kích hoạt; N = 3, 4, 6, 12 thì kích hoạt đúng tháng đó. Người điều phối đọc `src/engine/modules/gd1/gov.ts` hàm `revenueUse`: `s.taxOvSeen = ovCount` chạy mọi tháng, còn điều kiện kích hoạt đòi `s.taxHist.length >= 3`. Lần đổi ở tháng 1-2 được ghi là "đã thấy" khi chưa đủ số liệu, nên mất hẳn.

Ảnh hưởng: chỉ ván không làm nóng (ván tự do hiện nay, và ô "Bắt đầu từ một nền kinh tế mới lập" sau U5). Kịch bản và kiểm định tách nhánh ở tháng 240 nên không bị. Hướng sửa gợi ý: chỉ cập nhật `taxOvSeen` khi đã đủ 3 tháng số liệu (hoặc hoãn kích hoạt tới khi đủ). Sửa là đổi engine; với ván không đổi thuế ở tháng 1-2 thì mã băm không đổi.

**Đã sửa (Dương duyệt 16/11/2026).** Ngưỡng số liệu hạ từ 3 tháng xuống 1 tháng; lần đổi chưa xử lý được thì giữ lại để tháng sau thử tiếp. Mốc chỉ gồm các tháng trước khi đổi luật. Bỏ phương án hoãn tới tháng 3 vì mốc sẽ lẫn các tháng sau khi đổi. Hệ quả: đổi thuế ở tháng 1-2 thì mốc chỉ có 1-2 tháng số liệu của một nền kinh tế mới dựng, nhiễu hơn; mốc cũng thiếu tháng quyết toán thuế TNDN, như mọi lần đổi trước tháng 12 (đơn giản hoá đã có). Ván không đổi thuế ở tháng 1-2 không đổi: mã băm 9 ván mẫu trùng trước và sau.

### D18. Đổi tham số hành vi không bật dải "đã sửa quy luật" (ĐÃ SỬA 16/11/2026, Dương duyệt)

Phát hiện 16/11/2026 khi soạn U2: Phòng thí nghiệm cho người chơi đổi tham số hành vi qua lệnh `param`, nhưng `Session.setParam` không bật `meta.modified`; chỉ đổi biến thể quy tắc mới bật. Dải cảnh báo vì vậy không hiện, trái nguyên tắc "thế giới đã sửa quy luật thì luôn có dải cảnh báo". Đối chứng "So với thế giới gốc" cũng không bỏ các lệnh này.

**Đã sửa.** Người chơi đổi tham số hành vi thì bật cờ, không tự tắt. Trừ `cb.autopilot` và `gov.autopilot`: đó là chọn máy hay người chơi điều hành, không phải quy luật. Tham số đặt bởi điều kiện ban đầu hay kịch bản không bật cờ. Đối chứng "thế giới gốc" bỏ cả lệnh `lab` và lệnh `param` đó. Test: `tests/unit/modified-flag.test.ts`.

Kịch bản `that-lung-buoc-bung` mời người chơi hạ `hh.alpha1` trong Phòng thí nghiệm (lời giải mẫu đi qua lệnh của người chơi), nên sau khi sửa, ván đó hiện dải "đã sửa quy luật". Người điều phối quyết giữ (16/11/2026): kịch bản này đúng là một thí nghiệm sửa quy luật hành vi, dải nói đúng sự thật, và "So với thế giới gốc" là phép so tự nhiên của nó. Báo cáo kịch bản dùng đối chứng riêng của kịch bản nên không đổi; mã băm lời giải mẫu không đổi.

### D7. Tất định giữa trình duyệt và Node (K0.2)

Đo trong Chrome thật: 50 hộ, seed 7, 24 tháng. Bảng tác nhân, sổ cái, chuỗi chỉ số, phần phân rã trùng từng bit với Node. Mã băm toàn cục lệch từ tháng 11 vì một bản ghi quyết định lương sai ở chữ số cuối (`Math.log`, `Math.cos` trong `core/rng.ts` khác nhau giữa hai bản V8). Engine còn dùng `Math.pow`, `Math.exp` ở 8 chỗ. gd0 mục 12 đã lường. **Dương quyết 14/11/2026: chấp nhận như gd0 mục 12, không tự cài hàm toán.** K0.2 ghi là đạt theo nghĩa: trạng thái kinh tế trùng từng bit; mã băm toàn cục có thể lệch giữa hai bản V8 khác nhau ở chữ số cuối của hàm toán.

## E. Ghi chú cũ



- Lãi suất NHNN tác động lên lạm phát đã có (K1.19), nhưng nhờ S25, S26, S28 thêm sau khi thấy K1.19 hỏng. S28 là chỗ yếu nhất: giá trị chọn để qua kiểm định.
- K1.19 chỉ đúng trong khoảng 2 năm. Giữ lãi suất cao mãi thì tới năm thứ năm lạm phát lại CAO hơn nhánh gốc khoảng 2 điểm (8 seed). Đã soi (8 seed, `scripts/k119.ts`): lãi suất cao làm tiền lãi Chính phủ trả tăng, bội chi tăng khoảng 70%, nợ công +22% và tiền của công chúng +14% sau 5 năm. Tiền lãi đó thành thu nhập của hộ, nên từ năm thứ tư tiêu dùng thực cao hơn nhánh gốc 3-5%. Đây là tính chất quen thuộc của mô hình kế toán kép khi ngân sách không phản ứng (Godley và Lavoie 2007, trí nhớ), không phải lỗi sổ sách. Ngoài đời Chính phủ thường siết chi khi tiền lãi phình ra; trong mô hình việc đó là của người chơi, hoặc bật `gov.autopilot`.
- Lạm phát bình quân 6-7% ở phần lớn seed, cao hơn mục tiêu của NHNN. Quy tắc lãi suất tự động chưa kéo về được.
- K1.22: siết tín dụng chỉ làm sản lượng thấp hơn trong khoảng 3 năm. Sau đó giá giảm, kinh tế bật lại cao hơn nhánh gốc ở năm 6-10 rồi mới về. Tớ chưa chắc cú bật mạnh như vậy là đúng thực tế hay do mô hình thiếu kênh giảm phát nợ (nợ thực nặng lên khi giá giảm làm doanh nghiệp phá sản).
- K1.26: nộp thuế đủ làm khu vực phi chính thức nghèo đi nhưng không nhỏ đi về số người. Lý do: thuế thu thêm không được chi ra, và hộ kinh doanh không chuyển lên doanh nghiệp được.
- Tiền mặt khoảng 15% tổng phương tiện thanh toán, trên mục tiêu thô 7-13%.
- Thất nghiệp 5-6%, sát mép trên mục tiêu thô 2-6%.

## F. Nhật ký đổi thước đo và đổi tham số

Mục này được test `tests/unit/chot-chan.test.ts` đọc. Mỗi lần đổi một trong ba thứ dưới đây, `npm test` hỏng cho tới khi có một dòng mới ở đây chứa dấu vân tay mới (in bằng `npx tsx scripts/chot-chan.ts`):

- `tests/validation/gd1-lib.ts`: ngưỡng, cửa sổ đo, cách đo, danh sách "chưa đạt, đã biết" của kiểm định GĐ1.
- `tests/validation/scenarios-lib.ts`: cách chấm kiểm định kịch bản.
- Bộ giá trị tham số hành vi (`src/config/model/gd1.ts`).

Dòng mới phải nói: cái gì đổi; số đo theo cách cũ và cách mới (nếu đổi thước đo) hoặc giá trị cũ, mới và nguồn (nếu đổi tham số); ai duyệt. Chỉ sửa chữ hay dọn code cũng ghi một dòng nói vậy. Không xoá dòng cũ.

| Ngày | Thứ đổi | Dấu vân tay | Cái gì đổi và vì sao | Ai duyệt |
|---|---|---|---|---|
| 14/11/2026 | gd1-lib.ts | `4f09af0bfe4b` | Mốc đầu của nhật ký. Trạng thái lúc này: K1.12 chỉ xét ở 5000 hộ; danh sách đã biết gồm K1.19, K1.13, K1.28, K1.29, K1.31; K1.22 đo 3 năm đầu; K1.26 đo doanh số thực; K1.28 đo phần lạm phát còn lại. Lý do từng mục ở D3, D4, D6, D8 | Dương, các quyết định ngày 14/11/2026 |
| 14/11/2026 | scenarios-lib.ts | `a693afc1a93f` | Mốc đầu. Kịch bản có nhiều nhánh được chấm theo từng nhánh (D10) | Dương, quyết định 5 tối 14/11/2026 |
| 14/11/2026 | tham số hành vi | `b6c7cd4000f1` | Mốc đầu. Gồm các thay đổi trong ngày: `firm.wageIndex` 0,5; `exp.saveResponse` 0,35; `cb.autopilot` 0; `firm.taxPassUp` 0,34; `firm.taxPassDown` 0,065; `hh.saveIncomeEta` 0,09; `firm.founderPool` 60. Nguồn ở bảng B và D5, D8, D9 | Dương, các quyết định ngày 14/11/2026 |
| 15/11/2026 | tham số hành vi | `9f8023e7fe6c` | `firm.taxPassUp` 0,34 → 1: đơn giản hoá tạm, tăng thuế chuyển trọn vào giá; giảm thuế giữ 0,065. Thay bằng việc 8 (biên lãi hồi dần) ở GĐ1 update 1. Xem S36 | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `ad854ec4e50c` | Chỉ sửa chữ chú thích K1.24 theo S36, không đổi ngưỡng hay cách đo | Dương, quyết định 15/11/2026 (S36) |
| 15/11/2026 | gd1-lib.ts | `326d881c8b72` | K1.24, K1.25, K1.26 khai rõ gov.revenueUse = keep (D14): giữ nguyên điều kiện đo như trước khi có S37; không đổi ngưỡng, cửa sổ, cách đo | Dương, quyết định D13 hướng 3 (14/11/2026) và kế hoạch 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `2bc1d84b3f9b` | K1.13: bỏ ngưỡng Gini 0,4 (không có nguồn); tiêu chí mới Gini của cải ròng > Gini thu nhập sau thuế, bình quân 12 tháng cuối năm 30, và lệch phải; áp mọi quy mô; xoá K1.13 khỏi danh sách đã biết. Số đo theo cách cũ: 5000 hộ Gini của cải khoảng 0,33 (hỏng), 500 hộ vượt 0,4 nhờ nhiễu (D8). Số đo theo cách mới (đo nhanh, không phải kiểm định đầy đủ): 500 hộ đạt 3/3 seed (hiệu Gini của cải trừ thu nhập +0,165, +0,222, +0,212); 5000 hộ đạt 1/3 seed (-0,028, -0,048, +0,011) | Dương, quyết định đợt ba tối 14/11/2026 |
| 15/11/2026 | gd1-lib.ts | `14303378b758` | K1.24: ngưỡng cũ "tỷ lệ chuyển vào giá nằm giữa 0 và 1" (điều kiện `pass < 1`), ngưỡng mới "lớn hơn 0 và không quá 1,39" (`pass <= 1.39`). Chữ "Sự thật" bỏ vế "nhưng ít hơn mức thuế". Không đổi cách đo, cửa sổ, cú sốc, số seed. Nguồn của 1,39: Benedek, De Mooij, Keen và Wingender 2015 (IMF WP/15/214, Bảng 3, thuế suất phổ thông): 0,71 trong 12 tháng trước ngày đổi thuế, 0,30 trong tháng đổi, 0,38 trong 12 tháng sau; sai số chuẩn của tổng là 0,36. Lý do: sau S36 tăng thuế chuyển trọn vào giá nên số đo nằm quanh 1 (lượt 15/11 trên `b7ce617`: 12 seed ở 0,90-0,99 và 8 seed ở 1,03-1,31), còn ngưỡng cũ đòi dưới 1 mà không có nguồn. Hai giới hạn: (a) 1,39 là ước lượng điểm cộng dồn từ 12 tháng TRƯỚC tới 12 tháng sau ngày đổi thuế, trong khi mô hình chưa có tăng giá đón trước và K1.24 đo năm thứ hai; (b) phải xem lại ngưỡng này khi làm việc 8 và 8b (GĐ1 update 1) | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `faaef6772b13` | K1.13 thêm lại vào danh sách "chưa đạt, đã biết" (`KNOWN_FAIL`). Không đổi tiêu chí K1.13 (Gini của cải ròng > Gini thu nhập sau thuế, và lệch phải). Số đo lượt 15/11/2026 trên `b7ce617`: 5000 hộ đạt 3/5 seed; 500 hộ đạt 20/20. Lý do: thiếu cơ chế tích tụ của cải (chủ tái đầu tư cổ tức, mua bán cổ phần, sở hữu tập trung), sửa ở GĐ3 và GĐ4 (D8); kết quả phụ thuộc quy mô. Không có trần đếm số mục "đã biết" nên không nâng trần nào | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `a4a591bdc51d` | K1.26: cửa sổ đo cũ "năm 2-10" (tháng 12-120, cặp chạy 120 tháng), mới "năm 2-4" (tháng 12-48, cặp chạy 48 tháng); áp cho `rev`, `share`, `lab`, `inc` và `sales`. Cặp phụ 24 tháng (ngưỡng 1 tỷ), điều kiện `rev > 0 && ds < 0`, cú sốc và các khai báo giữ nguyên. Lý do (D15): lượt 15/11 trên `b7ce617` đạt 13/20 ở 10 năm; đo bằng script chẩn đoán, năm 2-4 đạt 20/20 (thu/GDP +0,3 đến +0,9 điểm, doanh số thực hộ kinh doanh −0,8 đến −7,0%); ở năm 5-10 khu vực chính thức sụp ở một số seed vì khoảng 0,8% GDP tiền thuế bị giữ lại (việc làm chính thức tới −40%, phần mua ở hộ kinh doanh tới +19 điểm); S32 và S36 làm suy thoái sâu gần gấp đôi (gỡ S32 thì 18/20, gỡ S36 thì 16/20). Giới hạn: cửa sổ mới không còn kiểm hệ quả dài hạn; đó là phát hiện đã biết ở D15, xử lý ở GĐ2 và GĐ3. Bảng số đầy đủ ở D15 | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `38fd1de83588` | K1.24: chỉ thêm chữ vào ghi chú, không đổi ngưỡng (vẫn 1,39), cửa sổ hay cách đo. Dương quyết giữ trần 1,39 và ghi rõ giới hạn: theo cùng bảng Benedek và cộng sự 2015, phần SAU ngày đổi thuế chỉ khoảng 0,68 (0,30 + 0,38); 0,71 còn lại là tăng giá đón trước, mô hình chưa có, nên mô hình (chuyển trọn, quanh 1) đang thổi phồng phần sau ngày đổi thuế. Sửa ở việc 8 và 8b (GĐ1 update 1) | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `2efb675342c0` | Điểm tách nhánh của mọi thí nghiệm chạy đôi dời từ tháng 120 sang tháng 240: thêm `FORK = 240`; `pair` (mặc định), `fourWay`, `pairWith` chạy tới `FORK` và trả `t0: FORK`; ba chỗ `BURN + ...` trong K1.28 và K1.29 thành `FORK + ...`. Không đổi ngưỡng, cửa sổ đo tính từ điểm tách, số seed, khẳng định hay danh sách "đã biết". `BURN = 120` của lần chạy gốc (`baselineChecks`, `cyc`) giữ nguyên, chưa quyết. Lý do (D16): tháng 120 là đỉnh của đợt bùng nổ giai đoạn khởi động, sau tháng 240 nền kinh tế mới đứng yên. Số đo theo cách cũ: lượt trên code `dccfcc0` (docs/validation ở `220be2c` và `63bbdab`). Số đo theo cách mới: ghi ở progress.md sau lượt chạy lại. Đo thử trước đó (20 seed, 500 hộ, D16): K1.22 20/20, K1.24 20/20, K1.26 năm 2-4 19/20; không mục nào đổi qua hay không qua | Dương, quyết định 15/11/2026 |
| 15/11/2026 | kịch bản (`src/content/scenarios.ts`, `src/engine/scenario/types.ts`, `src/engine/session/session.ts`) | không có dấu vân tay (không phải file đo) | Kiểm định kịch bản dời điểm tách nhánh: mọi kịch bản chạy trước `SCENARIO_PREWARM` = 240 tháng với lịch đứng yên (luật giữ phiên bản của ngày bắt đầu) rồi mới tới `warmup`. Người chơi nhận quyền ở tháng `prewarm + warmup`; mọi `at`, cửa sổ của `claims`, `goals`, `compare` vẫn tính từ lúc đó. Ngoại lệ: `vach-xuat-phat` khai `prewarm: 0` (câu hỏi là "mọi nhà bắt đầu gần bằng nhau", phải chạy từ trạng thái khởi tạo). Không đổi `warmup`, ngưỡng, khẳng định hay `goals` của kịch bản nào. `scenarios-lib.ts` không đổi. Sửa `core` (meta World có `prewarm`, `dateOf`) để lịch đứng yên, lý do ghi ở progress.md. Số đo cách cũ và mới: ghi ở progress.md sau lượt chạy lại | Dương, quyết định 15/11/2026 |
| 15/11/2026 | gd1-lib.ts | `df4f19227b38` | Chỉ sửa chữ ghi chú của K1.22 và K1.26 theo lần đo thử tách nhánh ở tháng 240 (D16): K1.22 không còn nói "bật lên thành một chu kỳ dài"; K1.26 nói rõ lao động phi chính thức giảm nhẹ ở 3/20 seed và phần suy thoái năm 5-10 nhẹ hơn khi tách ở 240. Không đổi ngưỡng, cửa sổ, cách đo, số seed, danh sách "đã biết". Báo cáo docs/validation/gd1.md (lượt dccfcc0) còn in ghi chú cũ vì kiểm định thống kê chưa chạy lại | Dương, 15/11/2026 (sửa lời giải thích theo số mới) |
