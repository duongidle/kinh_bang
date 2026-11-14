# Phác thảo GĐ3 và GĐ5

Viết ngày 14/11/2026, lúc Fable bàn giao. **Đây chưa phải spec.** Spec của từng giai đoạn vẫn phải viết vào `gd3.md`, `gd5.md` và chờ Dương duyệt. File này ghi lại những gì tớ thấy rõ sau khi làm GĐ1: cơ chế nào là lõi, xây theo thứ tự nào, chỗ nào dễ vá ngầm, kiểm định nào quyết định, và nên đọc gì.

Đọc kèm [chong-va-ngam.md](chong-va-ngam.md). Mã S, D trỏ tới [sai-khac.md](sai-khac.md).

**Về nguồn trong file này**: gần như toàn bộ ghi theo trí nhớ của tớ, chưa mở lại. Tên tác giả và năm thì tớ khá chắc; con số và chi tiết quy tắc thì không. Mỗi nguồn phải được mở và đọc toàn văn trước khi một quy tắc hay tham số dựa vào nó. Văn bản luật Việt Nam phải tra bản gốc và ngày hiệu lực.

## Việc phải xong trước khi bắt đầu GĐ3

1. Bốn việc trong progress.md (K1.13, dải tồn kho, đề xuất tăng năng suất, biến thể thuế đối xứng) và một lượt kiểm định đầy đủ sạch.
2. GĐ1.5.
3. Quyết về tăng năng suất. Nếu GDP thực vẫn đi ngang khi vào GĐ3 thì giá nhà không có xu hướng, và mọi hiệu chỉnh tín dụng nhà ở sẽ phải làm lại khi có tăng trưởng.

---

# GĐ3: Tài sản và tài chính

Câu hỏi của giai đoạn: **khủng hoảng lan ra thế nào?** Một cú sốc ở một chỗ đi qua bảng cân đối của ai, tới ai, và vì sao có lúc nó tắt, có lúc nó cuốn cả hệ thống.

## 1. Cơ chế cốt lõi

Xếp theo mức quan trọng với câu hỏi trên. Sáu cái đầu là lõi; ba cái sau gắn thêm.

| # | Cơ chế | Vì sao là lõi | Nợ từ GĐ1 mà nó trả |
|---|---|---|---|
| 1 | **Định giá lại tài sản trong sổ cái** | Đất, nhà, cổ phần đổi giá mà không có giao dịch. Của cải ròng đổi theo. Không có phép này thì không có khủng hoảng bảng cân đối | Móc "sổ cái nhận loại công cụ mới" |
| 2 | **Đất và nhà ở**: quyền sử dụng đất, Nhà nước cung đất sơ cấp, hai giá (giá bảng và giá thị trường), nhà để ở và nhà để giữ của | Tài sản thế chấp chính của tín dụng Việt Nam | `gov.fees.rate` (S3) được thay bằng tiền sử dụng đất thật |
| 3 | **Hộ đi vay**: vay mua nhà có thế chấp, vay tiêu dùng | Kênh lãi suất tới cầu | K1.19 (D1) |
| 4 | **Vỡ nợ, siết nợ, giảm phát nợ**: giá giảm làm nợ thực nặng lên, người vay vỡ nợ, ngân hàng bán tài sản siết nợ, giá giảm tiếp | Vòng xoáy đi xuống | K1.22: cú bật lại bị phóng đại (D3) |
| 5 | **Thị trường liên ngân hàng** thay cho việc NHNN cho vay tự động | Đường lây giữa các ngân hàng | Đơn giản hoá ở gd1 mục 8 (M4) |
| 6 | **Rút tiền ồ ạt và bảo hiểm tiền gửi** | Khủng hoảng thanh khoản thành khủng hoảng vốn | gd1 mục 7 |
| 7 | **Mua bán cổ phần, chủ tái đầu tư cổ tức** (đề xuất B và F ở D8) | Của cải dồn về người đã có vốn | K1.13 |
| 8 | **Tín dụng ngoài ngân hàng**: hụi họ, tín dụng đen, vay người quen | Hộ kinh doanh không vay được ngân hàng nhưng ngoài đời vẫn vay | M1 |
| 9 | **Trái phiếu doanh nghiệp** (nếu còn sức) | Kịch bản 2022 | |

Vàng: để GĐ5. Giá vàng trong nước gắn với giá thế giới và tỷ giá; định giá vàng trong nền kinh tế đóng là bịa.

## 2. Thứ tự xây

Mỗi mốc kết thúc bằng một lượt kiểm định. Mốc sau không bắt đầu khi mốc trước chưa sạch.

| Mốc | Nội dung | Vì sao ở vị trí này |
|---|---|---|
| M0 | **Sổ cái**: phép định giá lại, loại công cụ "quyền sử dụng đất", "nhà", "cổ phần giao dịch được". Viết lại bốn đẳng thức cho có lãi lỗ định giá. Chỉ số của cải ròng tách ba phần: tiết kiệm, lãi lỗ định giá, chuyển nhượng | Mọi thứ sau đứng trên nó. Sai ở đây thì không kiểm định nào tin được |
| M1 | **Đất và nhà là tồn kho, chưa có giá thị trường**: mỗi hộ ở đâu, ai sở hữu, thuê hay có nhà. Tiền thuê nhà là một dòng thu nhập. Nhà nước giao đất, thu tiền | Tách "ai có gì" khỏi "giá bao nhiêu". Kiểm định kế toán trước khi có động lực học |
| M2 | **Giá nhà tự hình thành**: người bán rao giá, người mua tìm trong số nhà mình biết, rao lâu không bán được thì hạ giá | Phải ổn định khi chưa có tín dụng. Nếu giá nhà đã bất ổn ở đây thì tín dụng chỉ khuếch đại lỗi |
| M3 | **Vay mua nhà và vay tiêu dùng**: thế chấp, tỷ lệ cho vay trên giá trị, tỷ lệ trả nợ trên thu nhập, lãi thả nổi sau kỳ ưu đãi | **Chạy lại toàn bộ kiểm định GĐ1 ở mốc này.** Có thêm một nguồn tạo tiền thì mọi hiệu chỉnh GĐ1 đều có thể lệch |
| M4 | **Vỡ nợ của hộ, siết nợ, bán tài sản**: nối vòng giá nhà, tín dụng, vỡ nợ | Đây là vòng xoáy. Làm sau M3 để thấy rõ nó thêm gì |
| M5 | **Mua bán cổ phần và tái đầu tư cổ tức** | Độc lập với nhà đất, làm lúc nào cũng được sau M0. Đặt ở đây để K1.13 có kết quả sớm |
| M6 | **Liên ngân hàng**: ngân hàng thiếu dự trữ vay ngân hàng thừa, có hạn mức đối tác, có lãi suất. NHNN lùi về vai người cho vay cuối cùng, có điều kiện | Sau khi ngân hàng đã có rủi ro thật từ M4 |
| M7 | **Rút tiền ồ ạt, bảo hiểm tiền gửi, xử lý ngân hàng yếu** | Cần M6 để có lây lan |
| M8 | **Tín dụng ngoài ngân hàng** | Gắn thêm, không ai phụ thuộc vào nó |
| M9 | Kịch bản, giao diện, báo cáo | |

Kịch bản ứng viên: đóng băng bất động sản 2011-2013; sốt đất và siết tín dụng bất động sản; một ngân hàng bị rút tiền (lấy cảm hứng 2022); siết tỷ lệ cho vay trên giá trị; vỡ hụi; "nhà để ở hay để giữ của" (đánh thuế nhà thứ hai).

## 3. Cạm bẫy dễ vá ngầm

**3.1 Giá nhà.** Đây là chỗ nguy hiểm nhất của GĐ3.

- Không có người đấu giá Walras. Giá phải ra từ rao bán và tìm mua. Cám dỗ: viết một công thức "giá nhà = hàm của thu nhập và tín dụng" rồi gọi là thị trường. Đó là hệ số nhân quả đặt tay.
- Cung đất gần như cố định nên giá không có neo tự nhiên. Mô hình sẽ hoặc đứng im hoặc nổ. Cám dỗ: thêm trần, sàn, hoặc lực kéo về "giá cơ bản". Mỗi cái là một cơ chế phải có tên, có nguồn, và phải tắt được.
- Kỳ vọng giá nhà kiểu ngoại suy là thứ tạo ra bong bóng. Hệ số ngoại suy sẽ là tham số nhạy nhất của giai đoạn. Chọn nó từ nguồn **trước** khi nhìn chu kỳ giá nhà mô hình sinh ra.
- Thị trường nhà ở 500 hộ rất mỏng: mỗi tháng vài giao dịch. Giá sẽ là nhiễu. Bài học K1.13: kiểm định về giá nhà chạy ở 5000 hộ, và ghi rõ quy mô nhỏ chỉ để học.

**3.2 K1.19 sẽ là cám dỗ lớn.** Vay tiêu dùng được thêm vào chính là để K1.19 đạt. Rất dễ chọn độ nhạy của vay tiêu dùng theo lãi suất sao cho nó vừa đạt. Quy trình đúng: chọn tham số từ nguồn, chạy, báo số đo; nếu vẫn chưa đạt thì K1.19 vẫn "chưa đạt". Xem ca `exp.saveResponse` = 2 (S28).

**3.3 Lây lan không được viết sẵn.** Không có dòng code nào kiểu "ngân hàng A đổ thì B mất x%". Lây lan chỉ đi qua ba đường có trên sổ cái: khoản cho vay liên ngân hàng mất; bán tháo tài sản làm giá giảm, ngân hàng khác đang giữ tài sản đó mất vốn; người gửi tiền rút ở ngân hàng khác. Kiểm bằng thí nghiệm đối chứng: cắt một đường thì thác đổ phải nhỏ đi.

**3.4 Rút tiền ồ ạt không được hẹn giờ.** Trong kịch bản thì được đặt cú sốc ban đầu (một tin đồn, một khoản lỗ). Nhưng ai rút, rút bao nhiêu, có lan không phải ra từ quy tắc của hộ: nhìn thấy gì, tin ai, tiền gửi có trong hạn mức bảo hiểm không.

**3.5 Lãi lỗ định giá và tiêu dùng.** Khi nhà lên giá, hộ có tiêu nhiều hơn không? Đây là hiệu ứng của cải từ nhà ở, tài liệu cho con số nhỏ và tranh cãi. Nếu cho của cải nhà ở vào `hh.alpha2` (đang 8,3% mỗi tháng) thì giá nhà tăng sẽ thành bùng nổ tiêu dùng. Phải là tham số riêng, có nguồn riêng.

**3.6 Đất sở hữu toàn dân không phải chi tiết trang trí.** Ba hệ quả kinh tế phải có: Nhà nước là bên bán đất sơ cấp và tiền đó vào ngân sách (nguồn thu này phụ thuộc chu kỳ đất, ngân sách địa phương dựa vào nó); giá bảng khác giá thị trường; Nhà nước thu hồi được. Bỏ cả ba thì đó là thị trường đất của nước khác.

**3.7 Số ngân hàng.** Ở 500 hộ mô hình có vài ngân hàng. Mạng liên ngân hàng ba nút không có gì để lan. Hoặc tăng số ngân hàng ở quy mô lớn, hoặc nói rõ lây lan chỉ xem được ở 5000 hộ.

**3.8 Người cho vay cuối cùng che mọi thứ.** GĐ1 cho NHNN cho vay tự động không giới hạn, cộng thị trường mở tự động (S2). Giữ nguyên hai thứ đó thì không ngân hàng nào chết vì thanh khoản, và M6, M7 thành vô nghĩa. Phải đổi mặc định, và việc đổi sẽ làm lệch GĐ1. Ghi trước, đo trước.

**3.9 Hiệu chỉnh lại GĐ1.** Sau M3, lạm phát, thất nghiệp, tín dụng đều đổi. Không "chỉnh nhẹ" từng tham số GĐ1 cho các kiểm định cũ qua lại. Mỗi thay đổi tham số GĐ1 ở giai đoạn này ghi vào sai-khac.md như một thay đổi cơ chế.

## 4. Kiểm định then chốt

Nhóm kế toán phải đúng tuyệt đối. Các nhóm khác theo quy tắc 80% số seed, ở hai quy mô.

| Nhóm | Kiểm định | Ghi chú |
|---|---|---|
| Kế toán | Thay đổi của cải ròng của mọi khu vực = tiết kiệm + lãi lỗ định giá + chuyển nhượng, mọi tháng | Đẳng thức mới của GĐ3 |
| Kế toán | Tổng lãi lỗ định giá của một tài sản bằng mức đổi giá nhân lượng đang giữ; không ai "sinh ra" của cải ngoài định giá và tiết kiệm | |
| Kế toán | Vỡ nợ, siết nợ, ngân hàng đổ, bảo hiểm tiền gửi chi trả: bốn đẳng thức vẫn đúng | Như K1.4 |
| Nhà đất | Giá nhà và tín dụng nhà ở cùng chiều; tín dụng đi trước hay đi cùng | Phải có nguồn cho dấu và độ trễ |
| Nhà đất | Siết tỷ lệ cho vay trên giá trị làm tín dụng và giá nhà thấp hơn | Chạy đôi |
| Nhà đất | Giá nhà trên thu nhập, tỷ lệ hộ có nhà: nằm trong khoảng hiệu chỉnh thô | Cần số Việt Nam |
| Tiền tệ | **K1.19 chạy lại**: tăng lãi suất làm giảm tín dụng hộ, giảm tiêu dùng, giảm lạm phát sau độ trễ | Lý do có vay tiêu dùng |
| Giảm phát nợ | **K1.22 chạy lại**: siết tín dụng không còn cho cú bật lại cao hơn nhánh gốc ở năm 6-10, hoặc nhỏ hơn rõ | Lý do có giảm phát nợ |
| Giảm phát nợ | Giá giảm làm tỷ lệ vỡ nợ tăng (chạy đôi với một cú sốc giảm cầu) | |
| Lây lan | Cắt một đường lây thì quy mô thác đổ nhỏ đi | Thay cho mọi khẳng định viết tay |
| Lây lan | Phân phối quy mô các đợt vỡ nợ có đuôi dày: hầu hết nhỏ, hiếm khi rất lớn | |
| Lây lan | Hệ thống nối dày: cú sốc nhỏ bị hấp thụ tốt hơn, cú sốc lớn lan rộng hơn | Tính chất "vững mà giòn" |
| Rút tiền | Có bảo hiểm tiền gửi thì ít đợt rút tiền hơn; ngân hàng lành mạnh vẫn có thể bị rút khi ngân hàng bên cạnh đổ | |
| Phân phối | **K1.13 chạy lại**: Gini của cải > Gini thu nhập, khoảng cách rộng hơn GĐ1 | |
| Kịch bản | Mỗi kịch bản: mọi khẳng định đúng ở 80% số seed | |

## 5. Nguồn nên đọc

Tất cả theo trí nhớ. Mở từng bài trước khi dùng.

**Cơ chế và lý thuyết**
- Fisher 1933, "The Debt-Deflation Theory of Great Depressions", Econometrica. Cho M4.
- Minsky 1986, *Stabilizing an Unstable Economy*. Cho câu chuyện tổng.
- Kiyotaki và Moore 1997, "Credit Cycles", JPE. Tài sản thế chấp khuếch đại cú sốc.
- Geanakoplos 2010, "The Leverage Cycle", NBER Macroeconomics Annual. Tỷ lệ ký quỹ thay đổi theo chu kỳ.
- Diamond và Dybvig 1983, "Bank Runs, Deposit Insurance, and Liquidity", JPE.
- Allen và Gale 2000, "Financial Contagion", JPE. Cấu trúc mạng quyết định lây lan.
- Eisenberg và Noe 2001, "Systemic Risk in Financial Systems", Management Science. Thuật toán thanh toán bù trừ khi nhiều bên vỡ nợ cùng lúc: nên dùng nguyên.
- Gai và Kapadia 2010, "Contagion in financial networks", Proceedings of the Royal Society A. Nguồn của "vững mà giòn".
- Battiston và cộng sự 2012, "DebtRank", Scientific Reports. Đo tầm quan trọng hệ thống.
- Godley và Lavoie 2007, *Monetary Economics*, các chương có lãi vốn và định giá lại. Cho M0.

**Mô hình ABM có nhà đất và tài chính**
- Baptista và cộng sự 2016, "Macroprudential policy in an agent-based model of the UK housing market", Bank of England Staff Working Paper 619. Ứng viên số một cho M2, M3: có người thuê, người mua lần đầu, nhà đầu tư, quy tắc rao giá và hạ giá.
- Geanakoplos, Axtell và cộng sự 2012, "Getting at Systemic Risk via an Agent-Based Model of the Housing Market", AER P&P.
- Delli Gatti, Gallegati, Greenwald, Russo, Stiglitz 2010, "The financial accelerator in an evolving credit network", JEDC. Mạng tín dụng và phá sản dây chuyền.
- Dòng Eurace (Cincotti, Raberto, Teglio): có thị trường tài sản và nhà ở trong mô hình vĩ mô đầy đủ.
- Caiani và cộng sự 2016 mục 3.13: xét duyệt vay bản đầy đủ có tài sản thế chấp. Đã có PDF ở research/sources.
- Poledna và cộng sự 2023, "Economic forecasting with an agent-based model", European Economic Review. Cách hiệu chỉnh theo tài khoản quốc gia.

**Bằng chứng**
- Mian và Sufi 2014, *House of Debt*. Nợ hộ gia đình và tiêu dùng.
- Jordà, Schularick, Taylor 2016, "The Great Mortgaging", Economic Policy. Tín dụng nhà ở và khủng hoảng.
- Tài liệu về hiệu ứng của cải từ nhà ở (ví dụ Case, Quigley, Shiller): tìm một bài tổng hợp có chỉnh thiên lệch công bố, như cách đã làm với Havránek 2015.

**Việt Nam, phải tra văn bản gốc và ngày hiệu lực**
- Luật Đất đai 2024 (31/2024/QH15), bảng giá đất cấp tỉnh từ 01/01/2026. research/abm-models.md mục 4.2.
- Luật Các tổ chức tín dụng 2024; quy định về can thiệp sớm và cho vay đặc biệt.
- Luật Bảo hiểm tiền gửi và hạn mức chi trả hiện hành.
- Các thông tư của NHNN về tỷ lệ an toàn vốn, hệ số rủi ro cho vay bất động sản, tỷ lệ dư nợ trên tiền gửi, vốn ngắn hạn cho vay trung dài hạn.
- Nghị quyết về xử lý nợ xấu và hoạt động của VAMC.
- Số liệu: tỷ trọng tín dụng bất động sản, tỷ lệ nợ xấu, thu tiền sử dụng đất trong ngân sách, giá nhà trên thu nhập ở Hà Nội và TP HCM.
- Hụi họ: Nghị định về họ, hụi, biêu, phường; các khảo sát tín dụng phi chính thức.

---

# GĐ5: Mở cửa

Câu hỏi của giai đoạn: **một nền kinh tế nhỏ và mở mất gì và được gì khi nối với thế giới?** Và nó cho phép làm ba kịch bản lịch sử đang bị hoãn: 1997, Zimbabwe, siêu lạm phát đầy đủ.

## 1. Cơ chế cốt lõi

| # | Cơ chế | Vì sao là lõi |
|---|---|---|
| 1 | **Phần còn lại của thế giới là một tác nhân có bảng cân đối**, và ngoại tệ là một loại công cụ trong sổ cái | Không có nó thì không có cán cân thanh toán, và mọi đồng ngoại tệ là tiền từ trên trời rơi xuống |
| 2 | **Tỷ giá và thị trường ngoại hối**: ngân hàng mua bán ngoại tệ với khách, NHNN mua bán với ngân hàng, tỷ giá trung tâm và biên độ | Giá quan trọng nhất của nền kinh tế mở |
| 3 | **Dự trữ ngoại hối của NHNN**, có hạn | Thứ quyết định một chế độ tỷ giá giữ được tới đâu |
| 4 | **Xuất khẩu và nhập khẩu**: cầu ngoài cho hàng trong nước; hàng nhập cạnh tranh với hàng trong nước; máy và nguyên liệu nhập | Kênh thực |
| 5 | **Giá nhập truyền vào giá trong nước** | Kênh nối tỷ giá với lạm phát |
| 6 | **Vàng và đô la làm nơi giữ của** (M2): hộ bỏ đồng nội tệ khi mất niềm tin | Nửa còn lại của siêu lạm phát (P8) |
| 7 | **Nợ bằng ngoại tệ** của doanh nghiệp, ngân hàng, Chính phủ | Phá giá làm nợ phình: cơ chế của 1997 |
| 8 | **Khu vực FDI, kiều hối, du lịch** | Ba dòng ngoại tệ đặc trưng của Việt Nam |
| 9 | **Thuế quan** | Công cụ chính sách |

## 2. Thứ tự xây

| Mốc | Nội dung | Vì sao ở vị trí này |
|---|---|---|
| M0 | **Sổ cái**: ngoại tệ, tác nhân "thế giới", đẳng thức thứ năm: cán cân vãng lai + cán cân vốn + thay đổi dự trữ = 0, mọi tháng. Mọi số dư ngoại tệ ghi bằng ngoại tệ, quy đổi khi báo cáo, chênh lệch tỷ giá đi qua phép định giá lại của GĐ3 | Nền. GĐ5 cần phép định giá lại của GĐ3, nên GĐ3 M0 phải xong trước |
| M1 | **Thương mại với tỷ giá cố định**: cầu ngoài, hàng nhập, giá thế giới ngoại sinh. Dự trữ đổi theo cán cân | Kiểm cán cân thanh toán trước khi tỷ giá động |
| M2 | **Thị trường ngoại hối và chế độ tỷ giá**: cố định, thả nổi có quản lý với biên độ, thả nổi. NHNN can thiệp, dự trữ có hạn | Sau M1 để biết tỷ giá đang phản ứng với cái gì |
| M3 | **Truyền tỷ giá vào giá**: qua hàng nhập tiêu dùng và qua chi phí máy, nguyên liệu nhập | Mô hình hiện không có đầu vào trung gian (gd1 mục 18, đơn giản hoá số 4). Ở đây phải quyết: thêm nguyên liệu nhập, hay chỉ có máy nhập |
| M4 | **Khu vực FDI, kiều hối, du lịch** | Gắn thêm trên M1-M3 |
| M5 | **Vàng và đô la làm nơi giữ của**; đô la hoá tiền gửi | Cần tỷ giá để định giá |
| M6 | **Nợ ngoại tệ** và hiệu ứng bảng cân đối khi phá giá | Cần M2 và vỡ nợ của GĐ3 |
| M7 | **Thuế quan** và công cụ quản lý ngoại hối | |
| M8 | **Vùng lạm phát rất cao**: cơ chế, test riêng, rồi mới gỡ nhãn "ngoài vùng đã kiểm định" | Cuối cùng, vì cần M5 |
| M9 | Kịch bản lịch sử với bộ luật của thời kỳ đó; giao diện; báo cáo | Móc "luật có nhiều phiên bản theo ngày hiệu lực" |

Kịch bản ứng viên: khủng hoảng châu Á 1997 (neo tỷ giá, nợ ngoại tệ ngắn hạn, vốn rút); Zimbabwe; siêu lạm phát đầy đủ (làm lại `gia-luong-tien`); Việt Nam 2008 và 2011 làm lại có giá dầu và tỷ giá; cú sốc giá dầu; sốt vàng; đơn hàng xuất khẩu sụt; phá giá để xuất khẩu.

## 3. Cạm bẫy dễ vá ngầm

**3.1 Thế giới là cái thùng không đáy.** Cám dỗ lớn nhất của GĐ5: để "thế giới" mua mọi thứ mình bán và cho vay mọi thứ mình cần. Khi đó mọi mất cân đối trong nước biến mất qua biên giới, và mô hình trông ổn định. Thế giới phải có bảng cân đối, cầu hữu hạn, và điều kiện cho vay. Kiểm: đẳng thức thứ năm, và một test "thế giới không cho vay thêm" để xem nền kinh tế có tự đứng được không.

**3.2 Tỷ giá không có người đấu giá.** Giống giá nhà. Tỷ giá phải ra từ ngân hàng cân trạng thái ngoại tệ và NHNN can thiệp. Một công thức "tỷ giá = hàm của cán cân và chênh lệch lãi suất" là hệ số nhân quả đặt tay, dù trông giống sách giáo khoa.

**3.3 Độ co giãn thương mại là nơi dễ chọn số để ra kết quả.** Độ co giãn của xuất khẩu và nhập khẩu theo giá quyết định phá giá có cải thiện cán cân không. Chọn từ nguồn, ghi khoảng, và để kịch bản "phá giá" báo kết quả ở cả hai đầu khoảng.

**3.4 Tái hiện lịch sử là vẽ tay trá hình.** Khi làm 1997 hay Zimbabwe sẽ rất muốn chỉnh tham số cho đường lạm phát khớp số liệu thật. Đó là vẽ tay. Tiêu chí đúng: mô hình với bộ luật và cú sốc của thời kỳ đó tái hiện được **trình tự và chiều** (cái gì xảy ra trước, cái gì khuếch đại cái gì), không phải con số. Viết tiêu chí này vào spec trước khi chạy kịch bản lần đầu.

**3.5 Siêu lạm phát và giới hạn của số.** Tiền là số nguyên đơn vị đồng. Số nguyên chính xác trong JavaScript tới khoảng 9 × 10^15. Tổng tiền ở 5000 hộ hiện cỡ 10^12. Lạm phát vài chục nghìn lần là chạm trần, và các đẳng thức kế toán sẽ vỡ vì làm tròn chứ không vì kinh tế. Phải có phép đổi tiền (bỏ số không) như một sự kiện có trong sổ cái, và test riêng cho nó. Đây cũng là chuyện có thật: Việt Nam 1985, Zimbabwe nhiều lần.

**3.6 Chạy khỏi nội tệ phải có điểm bắt đầu.** `exp.flight` và `exp.trust*` ở GĐ1 là tự thiết kế, chưa thử độ nhạy. Ở GĐ5 chúng quyết định khi nào siêu lạm phát cất cánh. Trước khi dùng: tìm nguồn (cầu tiền Cagan, các ước lượng đô la hoá), thử độ nhạy, và không chỉnh để kịch bản "nổ đúng lúc".

**3.7 Siêu lạm phát thiếu nửa tài khoá.** P8 đã ghi: thứ quyết định của siêu lạm phát thật là năng lực thu thuế sụp (thuế thu chậm hơn giá tăng) và Chính phủ không còn ai cho vay. Thiếu cái đó thì mô hình sẽ cho lạm phát cao mà không cho siêu lạm phát, và sẽ có cám dỗ đẩy tham số kỳ vọng lên cho đủ đô.

**3.8 Khu vực FDI không phải doanh nghiệp trong nước đổi nhãn.** Nó nhập phần lớn đầu vào, xuất phần lớn sản phẩm, chuyển lợi nhuận ra ngoài, và ít nối với doanh nghiệp trong nước. Nếu mô hình hoá như doanh nghiệp thường thì xuất khẩu tăng sẽ kéo cả nền kinh tế theo, nhiều hơn thực tế.

**3.9 Trung hoà.** NHNN mua ngoại tệ thì bơm tiền đồng. Có hút lại hay không là một chính sách có tên, không phải việc tự động xảy ra. Cùng loại với S2.

**3.10 Vàng.** Không có số tin được về lượng vàng trong dân (400-500 tấn hay hơn 2000 tấn, research mục 4.4). Tham số này phải gắn `chuaXacMinh` và kết quả kịch bản vàng phải báo ở cả hai đầu.

## 4. Kiểm định then chốt

| Nhóm | Kiểm định | Ghi chú |
|---|---|---|
| Kế toán | Cán cân vãng lai + cán cân vốn + thay đổi dự trữ = 0, mọi tháng | Đẳng thức thứ năm |
| Kế toán | Tài sản ngoại tệ của trong nước = nợ ngoại tệ của thế giới, và ngược lại | |
| Kế toán | Lãi lỗ tỷ giá của mọi bên cộng lại khớp với mức đổi tỷ giá nhân trạng thái ròng | |
| Kế toán | Đổi tiền (bỏ số không): mọi đẳng thức đúng trước và sau, mọi tỷ lệ không đổi | |
| Thương mại | Phá giá: cán cân xấu đi trước rồi mới tốt lên, hoặc không tốt lên nếu độ co giãn thấp | Báo ở cả hai đầu khoảng độ co giãn |
| Giá | Tỷ giá truyền vào giá tiêu dùng ít hơn một-một, và có độ trễ | Cần nguồn cho khoảng; tìm ước lượng cho Việt Nam |
| Chế độ tỷ giá | Neo tỷ giá và vốn tự do thì lãi suất trong nước không tự chủ được | Bộ ba bất khả thi, kiểm bằng chạy đôi |
| Chế độ tỷ giá | Neo tỷ giá với bội chi kéo dài: dự trữ cạn dần rồi neo vỡ đột ngột, không từ từ | Khủng hoảng cán cân thanh toán thế hệ một |
| Khủng hoảng | Vốn ngừng chảy vào: nhập khẩu và sản lượng giảm mạnh | |
| Khủng hoảng | Phá giá khi nợ ngoại tệ lớn làm sản lượng giảm thay vì tăng | Lõi của 1997. Chạy đôi: có và không có nợ ngoại tệ |
| Lạm phát cao | Lạm phát càng cao, hộ giữ tiền đồng so với thu nhập càng ít | Cầu tiền Cagan |
| Lạm phát cao | Dừng in tiền mà không sửa ngân sách thì lạm phát không dừng; sửa cả hai thì dừng nhanh | Sargent |
| Lạm phát cao | Thu thuế thực giảm khi lạm phát tăng | Cần cơ chế thu thuế có độ trễ |
| Đặc thù | Kiều hối tăng làm cầu trong nước tăng và đồng nội tệ lên giá | |
| Lịch sử | Mỗi kịch bản lịch sử: trình tự và chiều đúng ở 80% số seed; **không** kiểm con số | Mục 3.4 |
| Hồi quy | Toàn bộ kiểm định GĐ1 và GĐ3 chạy lại khi mở cửa. Với thương mại bằng 0, kết quả phải trùng bản đóng từng bit | Bảo đảm mở cửa là gắn thêm |

## 5. Nguồn nên đọc

Tất cả theo trí nhớ. Mở từng bài trước khi dùng.

**Khung kế toán và mô hình**
- Godley và Lavoie 2007, *Monetary Economics*, các chương về nền kinh tế mở hai nước. Nền cho M0-M2: cách ghi sổ ngoại tệ, tỷ giá cố định và thả nổi trong mô hình nhất quán tồn-lưu.
- Caiani, Catullo, Gallegati 2018-2019, các bài mô hình ABM nhiều nước (liên minh tiền tệ). Cùng dòng với xương sống của ta.
- Dosi, Roventini, Russo 2019, mô hình K+S nhiều nước. Thương mại và tăng trưởng.
- Poledna và cộng sự 2023: nền kinh tế nhỏ mở hiệu chỉnh theo số liệu thật.

**Tỷ giá và khủng hoảng**
- Krugman 1979, "A Model of Balance-of-Payments Crises", JMCB. Neo vỡ đột ngột.
- Obstfeld 1996, "Models of currency crises with self-fulfilling features", European Economic Review.
- Calvo 1998, "Capital Flows and Capital-Market Crises: The Simple Economics of Sudden Stops".
- Calvo và Reinhart 2002, "Fear of Floating", QJE. Vì sao nước đang phát triển không dám thả nổi.
- Krugman 1999, "Balance Sheets, the Transfer Problem, and Financial Crises"; Aghion, Bacchetta, Banerjee về nợ ngoại tệ. Cho M6 và 1997.
- Eichengreen và Hausmann về "tội tổ tông": nước nghèo không vay được bằng đồng tiền của mình.
- Radelet và Sachs 1998, "The East Asian Financial Crisis", Brookings Papers. Diễn biến 1997.

**Truyền tỷ giá và thương mại**
- Burstein và Gopinath 2014, chương trong Handbook of International Economics. Tổng hợp về truyền tỷ giá vào giá.
- Gopinath và cộng sự 2020, "Dominant Currency Paradigm", AER. Hàng xuất khẩu định giá bằng đô la: quan trọng với Việt Nam.
- Tìm ước lượng truyền tỷ giá và độ co giãn thương mại cho Việt Nam (các bài của NHNN, IMF, các trường trong nước).

**Lạm phát rất cao**
- Cagan 1956, "The Monetary Dynamics of Hyperinflation". Đã dẫn ở GĐ1 theo trí nhớ.
- Sargent 1982, "The Ends of Four Big Inflations".
- Tanzi 1977 về thu thuế thực giảm khi lạm phát tăng. Cho mục 3.7.
- Hanke và Kwok 2009 về Zimbabwe. Số liệu và diễn biến.
- Dornbusch, Sturzenegger, Wolf 1990, "Extreme Inflation: Dynamics and Stabilization", Brookings Papers.
- Về Việt Nam 1985-1989: tìm nguồn học thuật về tổng điều chỉnh giá - lương - tiền và ổn định hoá 1989.

**Việt Nam, phải tra văn bản gốc và ngày hiệu lực**
- Pháp lệnh Ngoại hối và các sửa đổi; cơ chế tỷ giá trung tâm (từ 2016) và biên độ.
- Nghị định 24/2012/NĐ-CP và Nghị định 232/2025/NĐ-CP về vàng. research mục 4.4.
- Biểu thuế xuất nhập khẩu; các hiệp định thương mại lớn.
- Số liệu: tỷ trọng khu vực FDI trong xuất khẩu, kiều hối, doanh thu du lịch quốc tế, dự trữ ngoại hối theo tháng nhập khẩu, độ mở thương mại, tỷ lệ đô la hoá tiền gửi, nợ nước ngoài.

---

## Ba điều chung cho cả hai giai đoạn

1. **M0 của cả hai là sổ cái.** GĐ3 thêm định giá lại, GĐ5 thêm ngoại tệ và đẳng thức thứ năm. Đây là hai lần duy nhất được sửa lõi; ghi lý do vào progress log (CLAUDE.md quy tắc 9). Làm kỹ, test trước, rồi mới viết một dòng kinh tế nào.
2. **Mỗi giai đoạn sẽ làm lệch giai đoạn trước.** Đặt sẵn trong spec một mốc "chạy lại toàn bộ kiểm định cũ", và quy ước: bản mới với cơ chế mới tắt đi phải trùng bản cũ từng bit.
3. **Giá tài sản và tỷ giá là hai nơi mô hình dễ nổ nhất, và cũng là hai nơi dễ thêm "lực kéo về cân bằng" nhất.** Mỗi lực như vậy phải có tên, có nguồn, tắt được, và được Dương duyệt.
