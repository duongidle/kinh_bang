# Research: mô hình kinh tế dựa trên tác nhân (ABM) cho Kinh Bang

Ngày viết: 2026-11-12. Phạm vi: chỉ research. Chưa thiết kế, chưa code.

## Cách đọc file này

Mỗi ý có nhãn nguồn và nhãn mức xác minh.

Nhãn loại nguồn:

- **[HT]** học thuật: bài tạp chí có bình duyệt, working paper của viện nghiên cứu, sách chuyên khảo.
- **[CQ]** cơ quan chính thức: ngân hàng trung ương, OECD, IMF, ILO, cơ quan thống kê, văn bản luật.
- **[BC]** báo chí, blog, diễn đàn, bài của nhà phát triển game. Độ tin cậy thấp hơn, chỉ dùng để định hướng.
- **[SL]** suy luận của Claude. Không có nguồn trực tiếp. Cần được kiểm tra khi thiết kế.

Nhãn mức xác minh:

- **(đọc toàn văn)**: đã tải và đọc bản gốc trong phiên này.
- **(đọc tóm tắt)**: chỉ đọc được abstract hoặc kết quả tìm kiếm.
- **(trí nhớ)**: trích theo kiến thức sẵn có, chưa mở lại nguồn trong phiên này. Cần kiểm tra lại trước khi đưa vào CLAUDE.md.

Những chỗ còn hổng được gom ở mục 7.

---

## 1. Các mô hình ABM vĩ mô có uy tín

### 1.1 Bản đồ các dòng mô hình

| Dòng mô hình | Bài gốc | Quy mô tác nhân | Bước thời gian | Điểm mạnh | Điểm yếu với Kinh Bang |
|---|---|---|---|---|---|
| Lengnick baseline | Lengnick 2013, JEBO 86:102–120 [HT] | 1000 hộ (số DN: 100 theo trí nhớ) | ngày + tháng | Tối giản, chạy trên PC, tái hiện được nhiều quy luật | Không có ngân hàng, chính phủ, NHTW. Lượng tiền cố định |
| BAM / CATS | Delli Gatti và cộng sự 2011, sách Springer [HT] | 500 hộ, 100 DN, 10 ngân hàng | quý | Ba thị trường phi tập trung, quy tắc rất đơn giản | Không nhất quán dòng-tồn, vay 1 kỳ, DN chết được thay bằng DN "từ hư không" |
| Benchmark AB-SFC | Caiani và cộng sự 2016, JEDC 69:375–408 [HT] | 8000 hộ, 100 DN tiêu dùng, 20 DN tư liệu, 10 ngân hàng | quý | Kế toán chặt, tiền nội sinh, có chính phủ và NHTW, khoản vay nhiều kỳ | Phức tạp hơn. Không có tăng trưởng năng suất |
| K+S (Schumpeter meeting Keynes) | Dosi, Fagiolo, Roventini 2010, JEDC 34:1748–1767; bản có tín dụng: Dosi và cộng sự 2012/2013 [HT] | không đọc được số trong bản đã mở | quý | Tăng trưởng nội sinh từ R&D, chính sách tài khoá và tiền tệ | Một ngân hàng duy nhất, thị phần theo công thức replicator, hộ tiêu hết thu nhập |
| Eurace@Unibi | Dawid và cộng sự 2018, J. Evol. Econ. [HT] | rất lớn | ngày | Chi tiết nhất, có không gian vùng miền | Chính các tác giả và người khác thừa nhận quá phức tạp, cần cụm máy tính song song |
| ABM dự báo (Áo) | Poledna, Miess, Hommes, Rabitsch 2023, EER 151:104306 [HT] | hàng triệu tác nhân | quý | Dự báo ngang VAR và DSGE, hiệu chỉnh theo bảng cân đối liên ngành | Cần dữ liệu quốc gia chi tiết. Hợp với GĐ9 hơn GĐ1 |

Nguồn và mức xác minh của bảng:

- Lengnick: đọc toàn văn bản working paper 2011 (Kiel Economics Working Paper 2011-04, https://hdl.handle.net/10419/45012). Bản JEBO 2013 chỉ xác nhận được trích dẫn và abstract. Hai bản có thể khác chi tiết.
- BAM: đọc toàn văn bản tái hiện của Platas-López và cộng sự 2020 (https://www.uv.es/grimo/publications/isci2020.pdf), không phải sách gốc. Tham số lấy từ Bảng 2 của bài này.
- Caiani: đọc toàn văn bản JEDC (https://business.columbia.edu/sites/default/files-efs/imce-uploads/Joseph_Stiglitz/Agent%20based-stock%20flow.pdf). Số tác nhân lấy từ Bảng 3 phụ lục.
- K+S: đọc toàn văn bản 2012 có tín dụng (OFCE WP 2012-06, https://www.ofce.fr/pdf/dtravail/WP2012-06.pdf). Bài 2010 không mở được (lỗi chứng chỉ máy chủ).
- Eurace@Unibi: (đọc tóm tắt). Nhận xét về độ phức tạp lấy từ Caiani 2016 mục 1.1 và Lengnick 2011 mục 2, cả hai đã đọc toàn văn.
- Poledna: (đọc tóm tắt). Bản PDF bị chặn bot. Mọi chi tiết cơ chế của mô hình này chưa xác minh.
- Tổng quan so sánh các dòng: Dawid và Delli Gatti 2018, "Agent-Based Macroeconomics", Handbook of Computational Economics tập 4, tr. 63–156 [HT] (đọc tóm tắt). Abstract nói các mô hình có "lõi chung đang hình thành". Chưa đọc bảng so sánh chi tiết.

### 1.2 Hành vi hộ gia đình

**Tiêu dùng.** Ba cách làm đã gặp:

- Tiêu theo tỷ lệ cố định trên thu nhập khả dụng kỳ vọng và trên của cải kỳ vọng: `c = α1 · thu_nhập_ròng / giá_kỳ_vọng + α2 · của_cải_ròng / giá_kỳ_vọng`. Nguồn: Caiani 2016 phương trình 3.16, dẫn lại Godley và Lavoie 2007 [HT] (đọc toàn văn Caiani).
- Tiêu theo hàm lõm của số dư tiền thực: `c = min((m/P)^α, m/P)` với α = 0,9. Nguồn: Lengnick 2011 phương trình 11–12 [HT] (đọc toàn văn).
- Khuynh hướng tiêu dùng giảm khi của cải tăng so với trung bình: người nghèo nhất tiêu 100%, người giàu nhất tiêu 50%. Nguồn: BAM, Platas-López 2020 mục 2.3 điểm 29 và Bảng 2 [HT] (đọc toàn văn).
- K+S đơn giản nhất: toàn bộ lương và trợ cấp được tiêu hết. Nguồn: Dosi và cộng sự 2012 mục 3.6 [HT] (đọc toàn văn).

**Lương mong muốn (reservation wage).**

- Caiani: thất nghiệp quá 2 trong 4 quý thì hạ mức lương đòi hỏi một lượng ngẫu nhiên. Ngược lại thì tăng, với điều kiện tỷ lệ thất nghiệp chung đủ thấp. Phương trình 3.15 [HT] (đọc toàn văn).
- Lengnick: thất nghiệp một tháng thì hạ 10%. Được trả cao hơn thì nâng lên bằng mức lương mới. Mục 2.4 [HT] (đọc toàn văn).

**Tìm việc và tìm chỗ mua.** Hộ chỉ biết một nhóm nhỏ doanh nghiệp. Chi tiết ở mục 1.6.

**Sở hữu và cổ tức.** Hộ sở hữu doanh nghiệp và ngân hàng theo tỷ lệ của cải, nhận cổ tức theo tỷ lệ đó. Nguồn: Caiani mục 2; Lengnick mục 2.4 [HT] (đọc toàn văn). Đây là một kênh làm bất bình đẳng tự khuếch đại: người có nhiều tiền nhận nhiều lợi nhuận hơn. [SL] về hệ quả; hai bài không phân tích riêng kênh này.

### 1.3 Hành vi doanh nghiệp

**Kế hoạch sản xuất.** Sản lượng mong muốn = doanh số kỳ vọng × (1 + ν) − tồn kho hiện có. ν là tỷ lệ tồn kho đệm. Nguồn: Caiani phương trình 3.2 [HT] (đọc toàn văn). K+S dùng cùng logic (mục 3.3).

**Kỳ vọng.** Tất cả tác nhân trong Caiani dùng chung một quy tắc thích nghi: `kỳ_vọng_mới = kỳ_vọng_cũ + λ · (thực_tế_cũ − kỳ_vọng_cũ)`. Phương trình 3.1 [HT] (đọc toàn văn). Dosi và cộng sự ghi rằng họ đã thử quy tắc kỳ vọng tinh vi hơn và thấy không cải thiện tăng trưởng hay ổn định (Dosi 2012, chú thích 7, dẫn Dosi 2006) [HT] (đọc toàn văn chú thích; chưa đọc bài 2006).

**Định giá.** Hai trường phái:

- Cộng lãi trên chi phí (markup): `giá = (1 + markup) × chi_phí_lao_động_đơn_vị_kỳ_vọng`. Markup tự điều chỉnh: tồn kho vượt mức mong muốn thì giảm markup, thiếu thì tăng. Nguồn: Caiani phương trình 3.6–3.7 [HT] (đọc toàn văn). K+S cũng dùng markup, nhưng markup đổi theo thị phần (phương trình 1).
- Chỉnh giá hoặc chỉnh lượng, không chỉnh cả hai: hết hàng và giá đang thấp hơn thị trường thì tăng giá; còn tồn và giá đang cao hơn thị trường thì giảm giá, có sàn là chi phí bình quân. Hai trường hợp còn lại thì chỉnh sản lượng. Nguồn: BAM, Platas-López 2020 điểm 25–26 [HT] (đọc toàn văn).
- Lengnick: chỉ đổi giá khi tồn kho ra khỏi dải cho phép, giá bị chặn trong khoảng 1,025–1,15 lần chi phí biên, và mỗi lần chỉ đổi với xác suất 0,75 (kiểu Calvo). Mục 2.2 và Bảng 1 [HT] (đọc toàn văn).

**Lương.** Doanh nghiệp tăng lương chào khi không tuyển được người, giảm khi đã đủ người suốt γ tháng (Lengnick, γ = 24). BAM: có chỗ trống thì tăng lương chào một lượng ngẫu nhiên, có sàn là lương tối thiểu theo luật. [HT] (đọc toàn văn cả hai).

**Đầu tư.** Tỷ lệ tăng công suất mong muốn phụ thuộc hai thứ: tỷ suất lợi nhuận so với mức "bình thường" và tỷ lệ sử dụng công suất so với mức "bình thường". Nguồn: Caiani phương trình 3.9 [HT] (đọc toàn văn). K+S: đầu tư mở rộng cộng đầu tư thay thế, máy cũ bị thay khi thời gian hoàn vốn đủ ngắn (mục 3.3).

**Tài chính doanh nghiệp.** Thứ tự ưu tiên vốn (pecking order): dùng tiền nội bộ trước, vay sau. Nhu cầu vay = đầu tư + cổ tức + đệm tiền mặt cho lương − dòng tiền hoạt động − tiền gửi hiện có. Nguồn: Caiani phương trình 3.11; Dosi 2012 phương trình 2 [HT] (đọc toàn văn).

**Phá sản.** Doanh nghiệp vỡ nợ khi hết tiền trả lương hoặc trả nợ, hoặc khi vốn ròng âm. Cách xử lý sau đó quyết định mô hình có nhất quán kế toán hay không:

- BAM và K+S: thay bằng doanh nghiệp mới (bản sao hoặc cỡ nhỏ hơn trung bình). Vốn của doanh nghiệp mới xuất hiện từ hư không.
- Caiani: chỉ trích chính điều này (mục 1.1). Giải pháp của họ: hộ gia đình (chủ sở hữu) và chủ nợ gánh lỗ, ngân hàng thu hồi một phần qua bán tháo tài sản với giá chiết khấu (mục 3.3).

[HT] (đọc toàn văn cả ba).

### 1.4 Hành vi ngân hàng thương mại

**Lãi suất cho vay.**

- BAM: lãi suất = lãi suất chính sách × (1 + chi phí ngẫu nhiên của ngân hàng × hàm tăng theo đòn bẩy của người vay). Điểm 16–18 [HT] (đọc toàn văn).
- Caiani: ngân hàng so tỷ lệ vốn của mình với mục tiêu. Thừa vốn thì hạ lãi suất dưới trung bình ngành để hút khách, thiếu vốn thì nâng. Phương trình 3.12 [HT] (đọc toàn văn).
- K+S: lãi suất cho vay và huy động là lãi suất NHTW cộng/trừ một biên cố định. Phương trình 6–7 [HT] (đọc toàn văn).

**Hạn chế tín dụng (credit rationing).** Caiani dẫn bằng chứng rằng ngân hàng phân biệt khách chủ yếu bằng việc cho vay hay không, ít khi bằng lãi suất (mục 3.2, dẫn Jakab và Kumhof 2014). Các cách làm:

- BAM: tổng tín dụng mỗi ngân hàng ≤ vốn tự có / hệ số vốn yêu cầu. Xếp hồ sơ theo độ lành mạnh tài chính, cho vay đến khi hết hạn mức. Điểm 12 và mục Interaction.
- K+S: tổng tín dụng toàn nền kinh tế ≤ k × tổng tiền gửi. Xếp doanh nghiệp theo vốn ròng/doanh thu, cho từ trên xuống. Mỗi doanh nghiệp vay tối đa λ × doanh thu kỳ trước. Phương trình 3–5.
- Caiani: tính xác suất vỡ nợ của từng hồ sơ bằng hàm logistic của (dòng tiền hoạt động − nghĩa vụ trả nợ). Tính lợi nhuận kỳ vọng của khoản vay có xét tài sản thế chấp. Cho vay nếu lợi nhuận kỳ vọng không âm, nếu không thì cho vay ít hơn. Phương trình 3.13.

[HT] (đọc toàn văn cả ba).

**Ràng buộc pháp định trong Caiani.** Tỷ lệ vốn tối thiểu 6%, tỷ lệ thanh khoản tối thiểu 8%. Thiếu thanh khoản thì vay NHTW. Ngân hàng cạnh tranh hút tiền gửi bằng lãi suất huy động (phương trình 3.14). [HT] (đọc toàn văn).

**Kỳ hạn khoản vay.** Caiani phê bình việc hầu hết ABM cho vay đầu kỳ và thu cuối kỳ: cách này bỏ mất lệch kỳ hạn giữa tiền gửi ngắn và cho vay dài, là nguồn gốc rủi ro tín dụng. Mô hình của họ dùng khoản vay 20 quý, trả gốc đều. (mục 1.1 và chú thích 16) [HT] (đọc toàn văn).

**Ngân hàng vỡ.** Caiani: người gửi tiền gánh lỗ theo tỷ lệ tiền gửi (bail-in) cho đến khi ngân hàng đạt lại vốn tối thiểu. BAM: thay bằng bản sao của ngân hàng còn sống. [HT] (đọc toàn văn).

### 1.5 Ngân hàng trung ương và chính phủ

**Caiani** (mục 3.5) [HT] (đọc toàn văn):

- Chính phủ thuê một tỷ lệ cố định lực lượng lao động, trả trợ cấp thất nghiệp bằng một tỷ lệ của lương bình quân, thu thuế thu nhập và thuế lợi nhuận theo thuế suất phẳng, phát hành trái phiếu 1 kỳ để bù thâm hụt.
- Ngân hàng thương mại mua trái phiếu bằng dự trữ dư. Phần còn lại NHTW mua.
- NHTW cho ngân hàng vay theo yêu cầu ở lãi suất cố định. Lợi nhuận NHTW chuyển về chính phủ.
- Không có quy tắc lãi suất kiểu Taylor trong bản này.

**K+S 2012** [HT] (đọc toàn văn): NHTW đặt lãi suất và hệ số nhân tín dụng k. Chính phủ đánh thuế lợi nhuận (hoặc cả lương) và trả trợ cấp thất nghiệp. Kết quả chính sách đọc được: markup càng cao (thu nhập nghiêng về lợi nhuận) thì nền kinh tế càng ít thời gian ở mức toàn dụng, GDP càng biến động, khủng hoảng càng thường xuyên (mục 4.2).

**BAM gốc** không có chính phủ. Có "cơ quan tiền tệ trung ương" đặt lãi suất nền nhưng không có bảng cân đối. Lengnick không có cả hai. [HT] (đọc toàn văn).

**Poledna 2023**: theo kiến thức sẵn có thì có quy tắc Taylor và chính phủ chi tiết, nhưng (chưa xác minh trong phiên này).

### 1.6 Thị trường khớp lệnh thế nào

Không mô hình nào ở trên dùng "người đấu giá Walras" (một bên trung tâm tìm giá cân bằng). Lengnick lập luận rõ: giá phải là kết quả của giao dịch, không phải điều kiện có trước (mục 1) [HT] (đọc toàn văn). Cơ chế chung là tìm kiếm cục bộ với thông tin hạn chế:

| Thị trường | BAM | Lengnick | Caiani |
|---|---|---|---|
| Hàng hoá | Người mua hỏi Z = 2 DN ngẫu nhiên, mua từ giá thấp nhất | Mỗi hộ có 7 DN quen. Mỗi tháng, xác suất 0,25 thử đổi một DN quen lấy DN mới nếu rẻ hơn ít nhất 1%. DN mới được chọn theo xác suất tỷ lệ với quy mô. Bị thiếu hàng thì cũng đổi | Người mua xem giá của một nhóm ngẫu nhiên cỡ χ. Đổi từ đối tác cũ sang đối tác tốt nhất với xác suất tăng theo chênh lệch giá |
| Lao động | Người thất nghiệp nộp M = 4 đơn, bắt đầu từ lương cao nhất. Hết hợp đồng thì hỏi chủ cũ trước | Thất nghiệp hỏi tối đa 5 DN/tháng. Đang có việc thì xác suất 0,1 hỏi thử 1 DN | Cùng giao thức như hàng hoá, có tỷ lệ luân chuyển lao động bắt buộc |
| Tín dụng | DN hỏi H = 2 ngân hàng, từ lãi thấp nhất | không có | Cùng giao thức. DN có thể nợ nhiều ngân hàng |
| Tiền gửi | không mô hình | không có | Cùng giao thức, theo lãi suất huy động |

Nguồn: Platas-López 2020 Bảng 2 và mục Interaction; Lengnick 2011 mục 2.2–2.3 và Bảng 1; Caiani 2016 mục 2 (dẫn Riccetti và cộng sự 2014, Delli Gatti và cộng sự 2010) [HT] (đọc toàn văn cả ba).

Hai chi tiết đáng giữ:

- Hàng không bán hết thì thành tồn kho; cầu không được đáp ứng thì người mua đi hỏi DN khác trong nhóm đã biết, hết thì cầu đó mất. Thị trường không tự cân bằng mỗi kỳ. Thất nghiệp và hàng ế là kết quả bình thường.
- K+S không khớp từng giao dịch ở thị trường tiêu dùng mà cập nhật thị phần bằng công thức replicator theo sức cạnh tranh. Caiani phê bình cách này vì phân phối quy mô DN khi đó là hệ quả của giả định, không phải kết quả nổi lên từ tương tác (mục 1.1) [HT] (đọc toàn văn).

### 1.7 Tiền được tạo ra thế nào

**Thực tế theo Ngân hàng Trung ương Anh.** McLeay, Radia, Thomas 2014, "Money creation in the modern economy", Bank of England Quarterly Bulletin 2014 Q1 [CQ] (đọc toàn văn):

- Phần lớn tiền được tạo ra khi ngân hàng thương mại cho vay. Khoản vay mới tạo ra khoản tiền gửi mới.
- Hai quan niệm sai: ngân hàng chỉ là trung gian đem tiền gửi đi cho vay; và NHTW ấn định lượng tiền cơ sở rồi ngân hàng "nhân" lên (số nhân tiền).
- Tiền gửi ngân hàng chiếm 97% lượng tiền rộng ở Anh lúc đó. Con số này là của Anh, không phải của Việt Nam.
- Trả nợ ngân hàng thì huỷ tiền.
- Giới hạn của việc tạo tiền: ngân hàng phải có lãi trong môi trường cạnh tranh; rủi ro thanh khoản và rủi ro tín dụng; quy định an toàn; hộ và doanh nghiệp có thể dùng tiền mới để trả nợ cũ; và chính sách tiền tệ qua lãi suất là giới hạn sau cùng.

**Trong mô hình.**

- Caiani làm đúng như trên: khoản vay và tiền gửi đối ứng được tạo "từ không" cùng lúc. Thanh toán giữa khách của hai ngân hàng khác nhau kéo theo chuyển dự trữ. Chi tiêu chính phủ làm tăng cả tiền gửi của người nhận lẫn dự trữ của ngân hàng họ. Nộp thuế thì huỷ dự trữ. NHTW mua trái phiếu chính phủ thì tạo dự trữ mới. (mục 1 và mục 2) [HT] (đọc toàn văn). Đây là kênh "in tiền" đúng nghĩa trong mô hình.
- Caiani nêu một đẳng thức kiểm tra được: trong nền kinh tế đóng, bỏ qua tái cấp vốn, lượng dự trữ và tiền giấy trong khu vực tư nhân bằng đúng lượng trái phiếu chính phủ mà NHTW nắm (mục 1).
- K+S 2012 dùng trần tín dụng = k × tiền gửi. Về hình thức giống số nhân tiền mà Ngân hàng Trung ương Anh bác bỏ. [HT] cho mô tả; [SL] cho nhận xét.
- BAM: ngân hàng cho vay theo vốn tự có, tiền gửi của hộ không được mô hình hoá như một khoản nợ của ngân hàng. Platas-López 2020 không có biến tiền gửi trong Bảng 1. [HT] cho quan sát; [SL] cho kết luận rằng BAM không trả lời được câu hỏi về lượng tiền.
- Lengnick: lượng tiền cố định, tác giả tự ghi đây là hạn chế và đề nghị bản sau thêm ngân hàng và NHTW (mục 3) [HT] (đọc toàn văn).

**Kế toán nhất quán dòng-tồn (stock-flow consistent, SFC).** Mọi dòng tiền đi ra từ một tác nhân phải đi vào một tác nhân khác. Mọi tài sản tài chính của người này là nợ của người kia. Caiani đưa hai phép kiểm tra chạy được ở mọi bước thời gian (mục 5.2) [HT] (đọc toàn văn):

1. Mọi hàng và cột của ma trận giao dịch cộng lại bằng 0.
2. Tổng vốn ròng của tất cả tác nhân (kể cả chính phủ và NHTW) bằng đúng giá trị tài sản thực (tồn kho và máy móc).

Caiani cũng chỉ ra lỗi phổ biến: tính nhu cầu vay theo vốn ròng thay vì theo tiền mặt thực có. Doanh nghiệp có thể nhiều máy móc mà ít tiền gửi (mục 1.1).

---

## 2. Các "sự thật kinh tế" được tái hiện và cách kiểm định

### 2.1 Danh sách theo từng mô hình

**Lengnick 2011** (mục 3–4) [HT] (đọc toàn văn):

- Nền kinh tế tự tổ chức đến gần cân bằng tổng thể: cầu không được đáp ứng dưới 0,65% trong 95% số kỳ; thất nghiệp 0–4,2%.
- Chu kỳ kinh doanh nội sinh, không cần cú sốc ngoại sinh.
- Đường Phillips (thất nghiệp thấp đi với lạm phát cao) và đường Beveridge (thất nghiệp cao đi với ít chỗ trống).
- Phân phối quy mô doanh nghiệp lệch phải (độ lệch khoảng 1,72).
- Tần suất đổi giá: trung vị 11%/tháng, so với 9–12% trong dữ liệu Mỹ của Nakamura và Steinsson 2008.
- Tương quan GDP với chỉ số giá trễ: đúng dấu so với dữ liệu Mỹ, nhưng mạnh hơn thực tế. Tác giả tự nhận chu kỳ của mô hình "quá đều".
- Tiền trung tính trong dài hạn: nhân số dư tiền của mọi tác nhân với hệ số 1–2, sau 100 năm mức giá tăng đúng tỷ lệ, sản lượng không đổi.
- Tiền không trung tính trong ngắn hạn: tăng 5% lượng tiền một lần, chạy lại với cùng dãy số ngẫu nhiên, lấy hiệu hai quỹ đạo. Sản lượng thực tăng tạm thời, giá lên đỉnh sau hơn 4 năm.

**BAM, bản tái hiện 2020** (mục 4) [HT] (đọc toàn văn):

- Thất nghiệp quanh 10%, lạm phát 1–6%.
- Phân phối của cải hộ gia đình và vốn ròng doanh nghiệp lệch phải, kiểm trên 100 lần chạy độc lập.
- Tăng trưởng GDP dừng (kiểm định Dickey-Fuller trên 100 lần chạy).
- Bài này chỉ kiểm ba điều trên. Sách gốc tuyên bố nhiều hơn (Phillips, Okun, Beveridge) nhưng (chưa đọc sách gốc).

**Caiani 2016** (mục 5.2) [HT] (đọc toàn văn):

- Độ biến động tương đối so với GDP: tiêu dùng 0,79 (Mỹ: 0,80), đầu tư 4,45 (Mỹ: 4,61), thất nghiệp 13,25 (Mỹ: 8,22; lệch vì sa thải trong mô hình quá dễ).
- Tự tương quan và tương quan chéo của GDP, đầu tư, tiêu dùng, thất nghiệp khớp dữ liệu Mỹ. Đầu tư cùng chiều và đồng thời với GDP; thất nghiệp ngược chiều và trễ một quý.
- Lạm phát cùng chiều chu kỳ và trễ. Markup ngược chiều chu kỳ.
- Thay đổi tồn kho cùng chiều; tỷ lệ tồn kho/doanh số ngược chiều.
- Đòn bẩy ngân hàng cùng chiều chu kỳ (tương quan 0,25; thực nghiệm 0,12–0,36). Nợ doanh nghiệp cùng chiều chu kỳ.
- Phân phối tăng trưởng GDP hình lều, đuôi dày.
- Phân phối quy mô doanh nghiệp lệch phải, đuôi dày. Đầu tư ở cấp doanh nghiệp giật cục.
- Phân phối tín dụng ngân hàng, nợ xấu, phá sản: lệch phải, đuôi dày.
- Nền kinh tế có giai đoạn chuyển tiếp dài với một cuộc "đại suy thoái" tự sinh (quý 45–130) trước khi vào trạng thái gần ổn định với thất nghiệp dưới 8%.

**K+S 2012** (mục 4.1 và Bảng 1) [HT] (đọc toàn văn):

- Tăng trưởng tự duy trì kèm dao động dai dẳng.
- Đầu tư biến động hơn GDP, tiêu dùng ít hơn.
- Nợ doanh nghiệp cùng chiều chu kỳ mạnh. Tỷ lệ phá sản cùng chiều. Tỷ lệ vốn ròng/doanh thu ngược chiều và trễ.
- Chu kỳ tín dụng kiểu Minsky: mở rộng làm nợ tăng, dòng tiền ròng mòn dần, ngân hàng siết, đầu tư giảm.
- Vi mô: quy mô DN lệch phải, tăng trưởng DN đuôi dày, chênh lệch năng suất dai dẳng, đầu tư giật cục.

**Poledna 2023** [HT] (đọc tóm tắt): mô hình ABM đầu tiên dự báo ngoài mẫu ngang ngửa VAR và DSGE cho các biến vĩ mô chính của Áo. Đây là kiểu kiểm định khác: so dự báo với dữ liệu thật, không chỉ so tính chất thống kê.

### 2.2 Phương pháp kiểm định họ dùng

| Bước | Cách làm | Nguồn |
|---|---|---|
| Kiểm kế toán | Ma trận giao dịch cộng bằng 0; tổng vốn ròng = tài sản thực; kiểm ở mọi kỳ | Caiani mục 5.2 [HT] (đọc toàn văn) |
| Khởi tạo | Giải bản tổng gộp của mô hình ở trạng thái dừng, chia đều cho các tác nhân, để dị biệt tự nổi lên | Caiani mục 4 [HT] (đọc toàn văn) |
| Bỏ giai đoạn đầu | Lengnick bỏ 1000 tháng đầu. Caiani cảnh báo không nên bỏ một cách máy móc vì giai đoạn chuyển tiếp chứa thông tin về cơ chế | Lengnick mục 3; Caiani mục 5.1 [HT] |
| Monte Carlo | 100 lần × 400 quý (Caiani); 50 lần × 600 kỳ (K+S); 100 lần × 1000 kỳ (BAM 2020); 25 lần cho mỗi điểm trong phân tích độ nhạy (Caiani) | [HT] (đọc toàn văn) |
| Tách chu kỳ | Lọc Hodrick-Prescott (Caiani, Lengnick); lọc bandpass 6–32 quý (K+S) | [HT] (đọc toàn văn) |
| So với dữ liệu | Độ lệch chuẩn tương đối, tự tương quan đến trễ 20, tương quan chéo đến trễ 10, so với dữ liệu quý của Mỹ | Caiani mục 5.2.1 [HT] |
| Phân phối | Độ lệch, độ nhọn, Jarque-Bera, khớp luật luỹ thừa theo Clauset và cộng sự 2009, so log-normal bằng kiểm định Vuong | Caiani mục 5.2.2 [HT] |
| Thí nghiệm đối chứng | Chạy hai lần cùng hạt ngẫu nhiên, một lần có cú sốc, lấy hiệu | Lengnick mục 4 [HT] |
| Độ bền | Quét tham số, kiểm xem cấu trúc tương quan có giữ không | Caiani mục 5.3 [HT] |

Khung phân loại chung: Fagiolo, Guerini, Lamperti, Moneta, Roventini 2019, "Validation of agent-based models in economics and finance" [HT] (đọc tóm tắt). Ba chiều: so dữ liệu giả lập với dữ liệu thật; hiệu chỉnh và ước lượng tham số; khám phá không gian tham số.

### 2.3 Những điều các mô hình này chưa chứng minh

[SL], dựa trên những gì đã đọc:

- Không bài nào trong số đã đọc kiểm định siêu lạm phát. Lạm phát trong các mô hình này ở mức vài phần trăm một năm. Các kịch bản Đổi Mới và Zimbabwe của Kinh Bang nằm ngoài vùng đã được kiểm định. Cơ chế cần thêm (chạy khỏi nội tệ, vòng xoáy lương-giá-kỳ vọng) phải tự thiết kế và tự kiểm.
- Thí nghiệm tiền của Lengnick nhân số dư của mọi người với cùng hệ số. Tiền in thật không vào đều như vậy: nó vào qua chi tiêu chính phủ hoặc qua tín dụng, đến tay một số người trước. Kết quả "trung tính dài hạn" của Lengnick vì thế chưa chắc giữ nguyên khi tiền vào qua kênh thật.
- Các mô hình đã đọc đều là nền kinh tế đóng. Không có tỷ giá, không có vàng, không có ngoại tệ.
- Thuế trong các mô hình này là thuế suất phẳng trên thu nhập và lợi nhuận. Không có VAT, không có biểu luỹ tiến, không có trốn thuế.
- Hầu hết so sánh định lượng là với dữ liệu Mỹ.

---

## 3. Game và mô phỏng kinh tế đã có

Phần này chủ yếu dựa trên nguồn [BC]. Tớ chưa chơi hay đọc mã các game này; nhận định về cơ chế bên trong lấy từ bài của nhà phát triển và báo chí.

| Sản phẩm | Làm tốt | Sai hoặc thiếu về kinh tế | Bài học cho Kinh Bang |
|---|---|---|---|
| **Victoria 3** (Paradox) | Dân cư chia nhóm (pop) có nghề, thu nhập, nhu cầu. Giá phản ứng theo cung cầu. Người chơi thấy chính sách tác động lên từng nhóm | Nhật ký phát triển số 9 nói rõ: hàng không tồn kho, mỗi đơn vị được bán ngay lúc sản xuất, và game bỏ lượng tiền toàn cầu cố định của Victoria 2. Nhà thiết kế tự nói đây "không phải mô phỏng hoàn chỉnh". Người chơi trên diễn đàn phê bình không có chu kỳ kinh doanh | Không tồn kho thì không có hàng ế, không có chu kỳ tồn kho, không có giảm phát do dư cung. Kinh Bang cần tồn kho thật |
| **Democracy 4** (Positech) | 2000 cử tri mô phỏng. Giao diện mạng lưới nhân quả giữa chính sách và chỉ số rất dễ đọc | Quan hệ giữa chính sách và kết quả là các đường nối được nhà thiết kế đặt sẵn hệ số. Kết quả kinh tế không nổi lên từ hành vi tác nhân. Một bài của Guardian nhập cương lĩnh các đảng Anh vào và nhận kết quả vô lý | Giao diện chuỗi nhân quả là thứ đáng học. Nhưng chuỗi nhân quả của Kinh Bang phải được ghi lại từ giao dịch thật trong mô phỏng, không được vẽ tay |
| **SimCity** | Làm người chơi cảm được hệ thống phức hợp và đánh đổi | Paul Starr 1994 ("Seductions of Sim", The American Prospect): mô hình là hộp đen, giả định về phản ứng với thuế do nhà thiết kế chọn, người chơi coi đó là "cách thế giới vận hành" | Mở hộp đen. Chế độ Phòng thí nghiệm trong KICKOFF chính là câu trả lời cho phê bình này |
| **EVE Online** | Nền kinh tế do người chơi vận hành, có nhà kinh tế trưởng và báo cáo quý. Khái niệm "vòi" (tạo tiền) và "cống" (huỷ tiền) được theo dõi công khai | Tiền sinh ra từ phần thưởng của hệ thống, không sinh ra từ tín dụng. Không có ngân hàng tạo tiền | Bảng theo dõi nguồn tạo và huỷ tiền theo từng kênh là một màn hình quan sát rất đáng làm |
| **Eco** (Strange Loop) | Người chơi tự phát hành tiền, lập chính phủ, đặt thuế. Một phóng viên kể lại việc đồng tiền của mình mất giá. Có một nghiên cứu nhỏ (88 học sinh) cho thấy điểm hiểu biết hệ thống tăng | Cần nhiều người chơi thật. Không có tác nhân mô phỏng | Việc để người chơi tự làm hỏng đồng tiền dạy tốt hơn đọc lý thuyết. Kịch bản "in tiền" nên cho người chơi tự tay gây ra lạm phát |
| **AI Economist** (Zheng và cộng sự, Salesforce; arXiv 2021, Science Advances 2022) [HT] (đọc tóm tắt) | Tác nhân học tăng cường tự tìm ra hành vi lách thuế (dời thu nhập sang kỳ thuế thấp) | Thế giới rất nhỏ, kiểu thu lượm-xây nhà. Hành vi do mạng nơ-ron quyết định nên khó giải thích. Tốn tính toán | Tác nhân học máy mâu thuẫn với yêu cầu "truy được chuỗi nhân quả" và với việc chạy trong trình duyệt |
| **MONIAC** (máy thuỷ lực của Phillips, 1949) (trí nhớ) | Dòng tiền hiện ra thành dòng nước chảy giữa các bể | Mô hình tổng gộp, không có tác nhân | Tiền đề tốt cho yêu cầu "thấy dòng tiền chảy" trên bản đồ isometric |

Nguồn:

- Victoria 3: nhật ký phát triển số 9 "National Markets" trên diễn đàn Paradox [BC, nhà phát triển]; bài PC Gamer phỏng vấn nhà thiết kế [BC]; chủ đề diễn đàn "The fundamentally broken economics of Victoria 3" [BC, ý kiến người chơi].
- Democracy 4: blog của Positech (positech.co.uk/cliffsblog) [BC, nhà phát triển]; bài Guardian được dẫn lại [BC].
- SimCity: Starr, P. 1994, https://prospect.org/1994/04/01/seductions-sim-policy-simulation-game/ [BC, tiểu luận của học giả, không bình duyệt].
- EVE: Engadget "EVE Evolved: ISK sinks and faucets" 2010; bản tin kinh tế của CCP [BC].
- Eco: GamesBeat; trang dự án của Bộ Giáo dục Mỹ (ies.ed.gov) [BC và CQ].
- AI Economist: https://arxiv.org/abs/2108.02755 [HT].

**Khoảng trống chung.** [SL] Trong các game đã xem, tớ không tìm thấy game nào mô hình hoá việc ngân hàng tạo tiền khi cho vay kèm kế toán kép đầy đủ. Tớ chưa rà hết thị trường nên đây là nhận định sơ bộ. Nếu đúng, đây là chỗ Kinh Bang khác biệt rõ nhất.

---

## 4. Đặc thù Việt Nam

Số liệu dưới đây chủ yếu lấy qua kết quả tìm kiếm, chưa mở bản gốc của cơ quan thống kê. Khi đưa vào file cấu hình ở GĐ1 phải tra lại văn bản gốc.

### 4.1 Kinh tế phi chính thức

- Tỷ lệ lao động có việc làm phi chính thức: 63,6% (quý 4/2024), 64,3% (quý 1/2025), giảm từ 68,5% năm 2021. Nguồn: báo cáo của Vietcap tóm tắt số liệu Tổng cục Thống kê [BC dẫn CQ] (đọc tóm tắt).
- Báo cáo ILO và Tổng cục Thống kê dùng số liệu 2016: 57% lao động phi nông nghiệp là phi chính thức, hơn 18 triệu người [CQ] (đọc tóm tắt). Mẫu số khác với con số ở trên nên không so trực tiếp được.
- Quy mô theo GDP: Medina và Schneider 2018 (IMF Working Paper) ước 14,78% GDP năm 2015 [HT] (đọc tóm tắt). Tổng cục Thống kê tính khu vực phi chính thức quan sát được đóng góp 14,34% GDP năm 2015 [CQ dẫn qua BC]. Một nghiên cứu của Fulbright Việt Nam năm 2018 nêu 25–30%, bị lãnh đạo Tổng cục Thống kê bác [BC]. Khoảng ước lượng rộng: 15–30%.
- Hộ kinh doanh: Nghị quyết 68-NQ/TW ngày 04/5/2025 yêu cầu bỏ thuế khoán chậm nhất năm 2026; Nghị quyết 198/2025/QH15 đặt mốc 01/01/2026. Có nguồn nêu Nghị định 68/2026/NĐ-CP ngày 05/3/2026 về thuế hộ kinh doanh, và ngưỡng doanh thu miễn thuế 500 triệu đồng/năm từ 2026 [BC dẫn văn bản luật] (đọc tóm tắt, chưa mở văn bản gốc). Tổng số hộ kinh doanh cả nước: không tìm được con số có nguồn rõ.
- Lý thuyết nền: La Porta và Shleifer 2014, "Informality and Development", Journal of Economic Perspectives [HT] (trí nhớ). Luận điểm chính theo trí nhớ: doanh nghiệp phi chính thức nhỏ, năng suất thấp, ít khi chuyển thành chính thức; khu vực này co lại chủ yếu khi kinh tế phát triển.

Hệ quả cho mô hình [SL]:

- Không ABM nào đã đọc có khu vực phi chính thức. Cơ chế phải tự thiết kế.
- Phi chính thức ở Việt Nam chiếm đa số lao động, không phải phần rìa. Nếu để ra sau thì toàn bộ kết quả về thuế ở GĐ1 sẽ sai lệch: cơ sở thuế thực tế hẹp hơn nhiều so với mô hình toàn doanh nghiệp chính thức.
- Luật thuế hộ kinh doanh vừa đổi lớn năm 2026. Tham số phải ghi ngày hiệu lực, và kịch bản lịch sử cần bộ tham số của thời kỳ tương ứng.

### 4.2 Đất đai

- Luật Đất đai 2024 (số 31/2024/QH15), có hiệu lực từ 01/8/2024 theo Luật số 43/2024/QH15 [CQ dẫn qua trang luật] (đọc tóm tắt).
- Bỏ khung giá đất của Chính phủ. Bảng giá đất do cấp tỉnh ban hành, điều chỉnh hằng năm, bảng đầu tiên theo luật mới áp dụng từ 01/01/2026 [BC dẫn luật] (đọc tóm tắt).
- Đất đai thuộc sở hữu toàn dân do Nhà nước đại diện chủ sở hữu: Hiến pháp 2013 Điều 53 [CQ] (trí nhớ, chưa mở văn bản trong phiên này). Người dân và doanh nghiệp có quyền sử dụng đất, có thời hạn với một số loại đất (trí nhớ).

Hệ quả cho mô hình [SL]:

- Quyền sử dụng đất vẫn mua bán, thế chấp được, nên về mặt bảng cân đối nó hoạt động gần như tài sản. Khác biệt nằm ở ba chỗ: Nhà nước là bên cung đất sơ cấp và thu tiền sử dụng đất; Nhà nước có quyền thu hồi; có hai giá (giá bảng và giá thị trường).
- Đất là tài sản thế chấp chính của tín dụng ngân hàng Việt Nam (nhận định phổ biến, chưa có nguồn trong phiên này). Vòng xoáy giá đất - tín dụng thuộc GĐ3.
- GĐ1 nên để sẵn chỗ cho "tài sản thế chấp" trong mô hình khoản vay, dù chưa có đất, để GĐ3 gắn vào mà không sửa lõi.

### 4.3 Doanh nghiệp nhà nước

- Khoảng 30% GDP (số liệu 2021). Nguồn: OECD Review of the Corporate Governance of State-Owned Enterprises in Viet Nam [CQ] (đọc tóm tắt).
- Ngân hàng thương mại nhà nước nắm hơn 40% tài sản các tổ chức tín dụng (cuối 2020). Cùng nguồn [CQ] (đọc tóm tắt).
- OECD Economic Survey of Viet Nam 2025: doanh nghiệp nhà nước được ưu tiên tiếp cận tín dụng; thu hẹp khu vực này sẽ nâng năng suất [CQ] (đọc tóm tắt).
- Định nghĩa: Nhà nước nắm trên 50% vốn điều lệ hoặc cổ phần có quyền biểu quyết. Cùng nguồn OECD.

Hệ quả cho mô hình [SL]:

- KICKOFF đặt doanh nghiệp nhà nước ở GĐ4. Nhưng ngân hàng nhà nước chiếm hơn 40% hệ thống thì ảnh hưởng ngay tới thị trường tín dụng GĐ1. Tối thiểu GĐ1 nên có thuộc tính "chủ sở hữu" cho ngân hàng và doanh nghiệp, với Nhà nước là một chủ sở hữu hợp lệ. Hành vi riêng (ràng buộc ngân sách mềm, cho vay theo chỉ đạo) để GĐ4.

### 4.4 Vàng, tiền mặt, và cách điều hành tín dụng

**Tiền mặt.**

- Tỷ lệ tiền mặt lưu thông trên tổng phương tiện thanh toán khoảng 10%: 10,88% tháng 1/2025, 9,82% tháng 2/2025, đáy 9,48% cuối tháng 9/2025 rồi tăng lại hơn 2 điểm phần trăm trong quý 4/2025 [BC dẫn Ngân hàng Nhà nước] (đọc tóm tắt).
- So sánh: tiền gửi chiếm 97% tiền rộng ở Anh năm 2014 (mục 1.7). Tỷ lệ tiền mặt của Việt Nam cao gấp khoảng ba lần.

**Vàng.**

- Nghị định 232/2025/NĐ-CP ngày 26/8/2025 sửa Nghị định 24/2012/NĐ-CP, bỏ độc quyền nhà nước về sản xuất vàng miếng. Sản xuất vàng miếng thành ngành có điều kiện, cần giấy phép. Giao dịch vàng từ 20 triệu đồng/ngày phải qua tài khoản ngân hàng [BC dẫn văn bản luật] (đọc tóm tắt).
- Lượng vàng trong dân: không có số chính thức. Con số được dẫn nhiều nhất là 400–500 tấn, gán cho Hội đồng Vàng Thế giới. Một hiệp hội trong nước ước hơn 2000 tấn [BC] (đọc tóm tắt). Chênh nhau bốn lần, không nên đưa con số nào vào cấu hình mà không ghi rõ độ bất định.

**Hạn mức tăng trưởng tín dụng ("room").**

- Ngân hàng Nhà nước giao chỉ tiêu tăng trưởng tín dụng cho từng ngân hàng. Mục tiêu toàn hệ thống năm 2025 ban đầu 16%. Từ 2025 đã bỏ room với ngân hàng nước ngoài, liên doanh và tổ chức tín dụng phi ngân hàng. Thủ tướng yêu cầu lộ trình thí điểm bỏ room từ 2026. Thông tư 14/2025/TT-NHNN về an toàn vốn được coi là tiền đề [BC] (đọc tóm tắt; một số bài có mốc thời gian mâu thuẫn, cần đối chiếu văn bản gốc).

Hệ quả cho mô hình [SL]:

- Tiền mặt phải là một loại tài sản riêng trong GĐ1, tách khỏi tiền gửi. Lý do: (a) hộ rút tiền mặt làm ngân hàng mất dự trữ, đây là kênh nối thói quen giữ tiền với khả năng cho vay; (b) giao dịch tiền mặt là thứ làm cho khu vực phi chính thức nằm ngoài lưới thuế; (c) rút tiền ồ ạt ở GĐ3 cần nó.
- Vàng là kênh để tiết kiệm rời khỏi hệ thống ngân hàng. Giá vàng trong nước gắn với giá thế giới và tỷ giá. Mô hình đóng của GĐ1 không định giá vàng được một cách trung thực. Đề xuất: để GĐ3 hoặc GĐ5.
- Room tín dụng là công cụ định lượng, khác hẳn cách NHTW trong sách giáo khoa điều hành qua lãi suất. Trần tín dụng tổng trong K+S (phương trình 4) có hình thức gần với room. Đây là công cụ nên có trong bảng điều khiển vai Chính phủ, và là một kịch bản hay: so điều hành bằng room với điều hành bằng lãi suất.

---

## 5. Kết luận: đề xuất cho GĐ1

Toàn bộ mục này là [SL], dựa trên các nguồn ở mục 1–4. Đây là đầu vào cho bước thiết kế, chưa phải thiết kế.

### 5.1 Nên dùng ở GĐ1

| # | Cơ chế | Lấy từ | Lý do |
|---|---|---|---|
| 1 | Kế toán kép nhất quán dòng-tồn, kiểm hai đẳng thức ở mỗi bước | Caiani mục 2 và 5.2 | Bắt lỗi "tiền từ hư không" tự động. Sổ giao dịch này cũng chính là dữ liệu thô cho tính năng chuỗi nhân quả: mỗi biến động truy về được các bút toán cụ thể |
| 2 | Tiền nội sinh: cho vay tạo tiền gửi, trả nợ huỷ tiền; chi tiêu chính phủ tạo dự trữ, thuế huỷ dự trữ; NHTW mua trái phiếu là kênh in tiền | Caiani mục 1–2; Bank of England 2014 | Câu hỏi "in thêm tiền thì giá ra sao" chỉ trả lời đúng khi tiền vào nền kinh tế qua kênh thật. Mô hình lượng tiền cố định trả lời sai ngay từ cấu trúc |
| 3 | Tiền mặt là tài sản riêng bên cạnh tiền gửi | Tự thiết kế; lý do ở mục 4.4 | Cần cho khu vực phi chính thức và cho đặc thù Việt Nam |
| 4 | Khớp lệnh bằng tìm kiếm cục bộ: mỗi bên cầu xem vài bên cung, đổi đối tác theo xác suất tăng theo chênh lệch giá | Caiani mục 2; BAM; Lengnick | Rẻ về tính toán: số phép so sánh tỷ lệ với số tác nhân × cỡ mẫu. Sinh ra thất nghiệp, hàng ế, phân tán giá một cách tự nhiên. Người chơi điều khiển một doanh nghiệp sẽ có khách hàng thật để giành giật |
| 5 | Doanh nghiệp: kỳ vọng thích nghi, đệm tồn kho, giá = markup trên chi phí đơn vị, markup tự chỉnh theo tồn kho | Caiani 3.1–3.7 | Chuỗi nhân quả đọc được: lương tăng dẫn tới chi phí tăng dẫn tới giá tăng. Thuế VAT và thuế TNDN gắn vào tự nhiên. Markup ngược chiều chu kỳ và lạm phát trễ đã được kiểm định với quy tắc này |
| 6 | Hộ gia đình: tiêu theo thu nhập và của cải với hai hệ số; lương đòi hỏi tự chỉnh theo thời gian thất nghiệp | Caiani 3.15–3.16 | Đơn giản, đã kiểm định. Hệ số tiêu dùng theo của cải kết hợp cổ tức theo tỷ lệ sở hữu cho ra bất bình đẳng tự hình thành, đúng câu hỏi trong KICKOFF |
| 7 | Nhiều ngân hàng; khoản vay nhiều kỳ trả dần; ràng buộc tỷ lệ vốn và thanh khoản; lãi suất = lãi suất chính sách + biên theo rủi ro người vay | Caiani 3.2 (cấu trúc); BAM điểm 16–18 (công thức lãi suất đơn giản hơn) | Khoản vay 1 kỳ làm GĐ3 (nợ xấu, vỡ nợ dây chuyền) không gắn vào được nếu không viết lại. Cấu trúc khoản vay nên đúng ngay từ đầu, còn quy tắc xét duyệt có thể đơn giản trước |
| 8 | Hạn chế tín dụng bằng lượng, không chỉ bằng lãi suất | Caiani mục 3.2; K+S phương trình 3–5 | Có bằng chứng thực nghiệm. Khớp với cách Việt Nam điều hành bằng room |
| 9 | NHTW: lãi suất chính sách, cửa sổ cho vay, mua trái phiếu, và trần tăng trưởng tín dụng | Caiani 3.5; mục 4.4 | Đủ bốn công cụ để người chơi so sánh |
| 10 | Chính phủ: thuế, trợ cấp, thuê công chức, trái phiếu; thâm hụt được ngân hàng hoặc NHTW tài trợ | Caiani 3.5 | Phần VAT, biểu TNCN luỹ tiến, TNDN phải thêm theo luật Việt Nam. Không mô hình đã đọc nào có sẵn |
| 11 | Khu vực phi chính thức tối thiểu: một cờ trên doanh nghiệp. Phi chính thức thì không nộp VAT và TNDN, chỉ giao dịch tiền mặt, không vay được ngân hàng, năng suất thấp hơn | Tự thiết kế; hướng theo La Porta và Shleifer 2014 (trí nhớ) | Mục 4.1: bỏ qua thì kết quả thuế sai lệch. Bản tối thiểu này chỉ cần bốn điều kiện rẽ nhánh |
| 12 | Phá sản không phá kế toán: chủ sở hữu và chủ nợ gánh lỗ; doanh nghiệp mới phải được ai đó góp vốn | Caiani 3.3 | Nếu không, mỗi lần phá sản là một lần bơm tiền ngầm, làm hỏng mọi thí nghiệm về lượng tiền |

### 5.2 Để sau

| Cơ chế | Giai đoạn đề xuất | Lý do |
|---|---|---|
| Ngành tư liệu sản xuất, máy móc theo đời, R&D, tăng năng suất nội sinh (K+S) | GĐ4 | KICKOFF đã đặt công nghệ ở GĐ4. GĐ1 không cần tăng trưởng dài hạn để trả lời bốn câu hỏi gốc. Lengnick và BAM chạy được với sản xuất chỉ dùng lao động |
| Xét duyệt vay theo xác suất vỡ nợ và lợi nhuận kỳ vọng nhiều kỳ (Caiani 3.13) | GĐ3 | Phức tạp, và chỉ phát huy khi có tài sản thế chấp |
| Vàng | GĐ3 hoặc GĐ5 | Giá vàng phụ thuộc thế giới và tỷ giá |
| Đất và nhà | GĐ3 | Như KICKOFF. GĐ1 chỉ để sẵn trường tài sản thế chấp |
| Hành vi riêng của doanh nghiệp nhà nước | GĐ4 | GĐ1 chỉ cần thuộc tính chủ sở hữu |
| Kỳ vọng nhiều kiểu, tác nhân chuyển qua lại giữa các quy tắc dự báo (dòng nghiên cứu của Hommes) | Sau GĐ1, có thể là mục trong Phòng thí nghiệm | (trí nhớ, chưa tra nguồn). GĐ1 dùng kỳ vọng thích nghi một tham số λ là đủ, và Dosi báo cáo quy tắc tinh vi hơn không cải thiện kết quả |
| Hiệu chỉnh theo bảng cân đối liên ngành và tài khoản quốc gia (kiểu Poledna) | GĐ9 | Đúng vị trí trong lộ trình |
| Chuyển đổi qua lại giữa chính thức và phi chính thức, xác suất bị kiểm tra thuế | GĐ8 hoặc cuối GĐ1 nếu còn sức | Cần thiết kế riêng, chưa có mô hình tham chiếu |

### 5.3 Nên tránh

| Thứ nên tránh | Lý do | Nguồn |
|---|---|---|
| Người đấu giá Walras, thị trường tự cân bằng mỗi kỳ | Loại bỏ thất nghiệp không tự nguyện, hàng ế và khủng hoảng ngay từ giả định | Lengnick mục 1; Caiani mục 1 |
| Lượng tiền cố định hoặc tiền từ "vòi" của hệ thống | Không trả lời được câu hỏi in tiền; không có chu kỳ tín dụng | Lengnick tự nhận hạn chế; so sánh với Victoria 2 và EVE |
| Số nhân tiền và ngân hàng như trung gian đem tiền gửi đi cho vay | Ngân hàng Trung ương Anh gọi thẳng là quan niệm sai | Bank of England 2014 |
| Tính nhu cầu vay theo vốn ròng thay vì theo tiền thực có | Lỗi kế toán mà Caiani chỉ ra ở nhiều ABM | Caiani mục 1.1 |
| Khoản vay 1 kỳ | Mất lệch kỳ hạn, chặn đường GĐ3 | Caiani mục 1.1 |
| Thị phần theo công thức replicator | Phân phối quy mô thành hệ quả của giả định. Người chơi không có khách hàng cụ thể | Caiani mục 1.1 |
| Hàng bán ngay khi sản xuất, không tồn kho | Mất chu kỳ tồn kho và tín hiệu điều chỉnh của doanh nghiệp | Victoria 3 nhật ký số 9 |
| Hệ số nhân quả vẽ tay giữa chính sách và kết quả | Vi phạm yêu cầu "kết quả tự sinh từ hành vi tác nhân" | Democracy 4; Starr 1994 |
| Tác nhân học tăng cường hoặc mô hình ngôn ngữ | Không giải thích được, không tái lập được, nặng với trình duyệt, mâu thuẫn với chuỗi nhân quả | AI Economist |
| Bước thời gian theo ngày với đầy đủ chi tiết kiểu Eurace | Hai nhóm tác giả độc lập nhận xét nó quá phức tạp để hiểu và tái sử dụng | Caiani mục 1.1; Lengnick mục 2 |
| Kỳ vọng hợp lý | Đòi hỏi tác nhân biết mô hình thật của nền kinh tế | Caiani mục 1; Lengnick mục 1 |

### 5.4 Ba vấn đề thiết kế cần quyết sớm

**Quy mô 50 tác nhân.** Các mô hình đã đọc dùng 500–8000 hộ, với tỷ lệ hộ trên doanh nghiệp từ 5:1 (BAM) đến khoảng 65:1 (Caiani). Ở mức 50 tác nhân, nếu chia kiểu 40 hộ, 6 doanh nghiệp, 2 ngân hàng thì một doanh nghiệp phá sản là mất khoảng một phần sáu sản lượng. Các quy luật thống kê (phân phối lệch, tương quan chu kỳ) không thể kiểm định ở cỡ này. Đề xuất: coi mức 50 là sa bàn để học cơ chế và soi từng tác nhân; đặt kiểm định "sự thật kinh tế" ở mức 500 và 5000; quy định rõ con số 50/500/5000 là số hộ, số doanh nghiệp và ngân hàng suy ra theo tỷ lệ.

**Bước thời gian.** Caiani, BAM, K+S dùng quý. Lengnick dùng ngày cho mua hàng và tháng cho lương. Đề xuất bước cơ sở là tháng: lương ở Việt Nam trả theo tháng, thuế kê khai theo tháng hoặc quý, và người chơi cần thấy diễn biến đủ mịn. Hệ quả: tham số lấy từ mô hình quý phải quy đổi, và phải kiểm định lại.

**Kiểm định với mô hình ngẫu nhiên.** Các bài báo kiểm định trên trung bình của 50–100 lần chạy. Test tự động của Kinh Bang cũng phải làm vậy: mỗi "sự thật kinh tế" là một phát biểu thống kê trên nhiều hạt ngẫu nhiên, có ngưỡng chấp nhận, không phải một phép so sánh bằng trên một lần chạy. Kỹ thuật chạy đôi cùng hạt của Lengnick (một lần có cú sốc, một lần không) dùng lại được nguyên vẹn cho so sánh song song trong Phòng thí nghiệm.

### 5.5 Danh sách kiểm định ứng viên cho GĐ1

Lấy từ mục 2, chọn những mục kiểm được với cơ chế ở 5.1:

1. Hai đẳng thức kế toán đúng ở mọi bước. (Caiani)
2. Lượng dự trữ và tiền mặt ngoài NHTW = trái phiếu NHTW nắm + tái cấp vốn. (Caiani mục 1)
3. Thất nghiệp không tự nguyện tồn tại và nằm trong khoảng hợp lý. (Lengnick, Caiani)
4. Đầu tư hoặc tồn kho biến động hơn GDP; tiêu dùng biến động ít hơn GDP. (Caiani, K+S)
5. Thất nghiệp ngược chiều chu kỳ; lạm phát cùng chiều và trễ. (Caiani)
6. Đường Phillips và đường Beveridge có độ dốc âm. (Lengnick)
7. Phân phối quy mô doanh nghiệp và của cải hộ lệch phải, xuất phát từ điều kiện đầu đồng đều. (BAM, Caiani)
8. Tín dụng doanh nghiệp cùng chiều chu kỳ. (Caiani, K+S)
9. Bơm tiền một lần: giá tăng, sản lượng thực tăng tạm thời rồi về lại. Kiểm riêng cho từng kênh bơm. (Lengnick, mở rộng theo mục 2.3)
10. Tăng lãi suất chính sách làm giảm tín dụng mới và giảm lạm phát sau một độ trễ. ([SL], chưa có nguồn kiểm định trực tiếp trong các bài đã đọc)

---

## 6. Danh mục nguồn

### Học thuật, đã đọc toàn văn trong phiên này

- Caiani, A., Godin, A., Caverzasi, E., Gallegati, M., Kinsella, S., Stiglitz, J. E. (2016). Agent based-stock flow consistent macroeconomics: Towards a benchmark model. *Journal of Economic Dynamics and Control* 69, 375–408. doi:10.1016/j.jedc.2016.06.001. Mã nguồn: https://github.com/S120/jmab và https://github.com/S120/benchmark
- Lengnick, M. (2011). Agent-based macroeconomics: a baseline model. Economics Working Paper 2011-04, Đại học Kiel. https://hdl.handle.net/10419/45012. Bản tạp chí: *Journal of Economic Behavior & Organization* 86 (2013), 102–120, doi:10.1016/j.jebo.2012.12.021 (chưa đọc bản này).
- Platas-López, A., Guerra-Hernández, A., Cruz-Ramírez, N., Quiroz-Castellanos, M., Grimaldo, F., Paolucci, M., Cecconi, F. (2020). Towards an Agent-based Model for the Analysis of Macroeconomic Signals. https://www.uv.es/grimo/publications/isci2020.pdf. Mã NetLogo: https://github.com/alexplatasl/BAMmodel/
- Dosi, G., Fagiolo, G., Napoletano, M., Roventini, A. (2012). Income Distribution, Credit and Fiscal Policies in an Agent-Based Keynesian Model. OFCE Document de travail 2012-06. https://www.ofce.fr/pdf/dtravail/WP2012-06.pdf

### Cơ quan chính thức, đã đọc toàn văn

- McLeay, M., Radia, A., Thomas, R. (2014). Money creation in the modern economy. *Bank of England Quarterly Bulletin* 2014 Q1. https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy

### Học thuật, chỉ đọc tóm tắt hoặc qua bài khác dẫn lại

- Delli Gatti, D., Desiderio, S., Gaffeo, E., Cirillo, P., Gallegati, M. (2011). *Macroeconomics from the Bottom-up*. Springer.
- Dosi, G., Fagiolo, G., Roventini, A. (2010). Schumpeter meeting Keynes. *JEDC* 34(9), 1748–1767.
- Poledna, S., Miess, M. G., Hommes, C., Rabitsch, K. (2023). Economic forecasting with an agent-based model. *European Economic Review* 151, 104306. doi:10.1016/j.euroecorev.2022.104306
- Dawid, H., Delli Gatti, D. (2018). Agent-Based Macroeconomics. *Handbook of Computational Economics* tập 4, 63–156. https://pub.uni-bielefeld.de/record/2917066
- Dawid, H. và cộng sự (2018). Bài mô tả Eurace@Unibi. *Journal of Evolutionary Economics*. doi:10.1007/s00191-018-0594-0. Mã nguồn: https://github.com/ETACE/eurace_unibi
- Fagiolo, G., Guerini, M., Lamperti, F., Moneta, A., Roventini, A. (2019). Validation of agent-based models in economics and finance. LEM Working Paper 2017/23.
- Zheng, S. và cộng sự (2021/2022). The AI Economist. https://arxiv.org/abs/2108.02755
- Medina, L., Schneider, F. (2018). Shadow Economies Around the World. IMF Working Paper. Số liệu Việt Nam xem qua https://www.theglobaleconomy.com/Vietnam/shadow_economy/
- Godley, W., Lavoie, M. (2007). *Monetary Economics*. Palgrave. (dẫn qua Caiani)
- Riccetti, L., Russo, A., Gallegati, M. (2014); Assenza, T., Delli Gatti, D., Grazzini, J. (2015). (dẫn qua Caiani)

### Học thuật, theo trí nhớ, cần tra lại

- La Porta, R., Shleifer, A. (2014). Informality and Development. *Journal of Economic Perspectives* 28(3).
- Các công trình của C. Hommes về kỳ vọng dị biệt và thí nghiệm học dự báo.

### Cơ quan chính thức và văn bản luật Việt Nam, đọc qua nguồn thứ cấp

- OECD (2022). Review of the Corporate Governance of State-Owned Enterprises in Viet Nam. https://www.oecd.org/en/publications/oecd-review-of-the-corporate-governance-of-state-owned-enterprises-in-viet-nam_a22345d0-en.html
- OECD (2025). Economic Surveys: Viet Nam 2025.
- ILO và Tổng cục Thống kê. Báo cáo lao động phi chính thức. https://www.ilo.org/resource/news/viet-nam%E2%80%99s-18-million-non-agricultural-workers-are-informal-employment
- Luật Đất đai số 31/2024/QH15; Luật số 43/2024/QH15. Tóm tắt: https://luatvietnam.vn/dat-dai-nha-o/diem-moi-cua-luat-dat-dai-2024-567-96662-article.html
- Nghị định 232/2025/NĐ-CP sửa Nghị định 24/2012/NĐ-CP. Tóm tắt: https://www.vcci.com.vn/tin-tuc/nghi-dinh-232-chinh-thuc-bai-bo-co-che-nha-nuoc-doc-quyen-san-xuat-vang-mieng
- Nghị quyết 68-NQ/TW (04/5/2025); Nghị quyết 198/2025/QH15. Tóm tắt: https://thoibaotaichinhvietnam.vn/xoa-bo-thue-khoan-dam-bao-cong-bang-giua-cac-ho-kinh-doanh-177871-177871.html
- Thông tư 14/2025/TT-NHNN. Tóm tắt: https://www.vcci.com.vn/tin-tuc/bo-room-tin-dung-khong-phai-noi-long-ma-la-doi-moi-cach-giam-sat

### Báo chí, blog, nhà phát triển game

- Vietcap, các ghi chú vĩ mô về thị trường lao động 2024–2025. https://trading.vietcap.com.vn/iq/report-detail/en/vietnam-macro-note-labor-market-improves-in-line-with-economic-growth
- Báo Nhân Dân, "Nền kinh tế tiền mặt đang âm thầm trở lại". https://nhandan.vn/nen-kinh-te-tien-mat-dang-am-tham-tro-lai-post965208.html
- Người Quan Sát, về tỷ lệ tiền mặt đầu 2025. https://nguoiquansat.vn/vi-sao-ty-le-tien-mat-tang-vot-dau-nam-2025-219537.html
- VnEconomy, "Người Việt giữ bao nhiêu vàng?". https://vneconomy.vn/nguoi-viet-giu-bao-nhieu-vang.htm
- VnBusiness, về lộ trình bỏ room tín dụng. https://vnbusiness.vn/bao-gio-ngan-hang-nha-nuoc-bo-room-tin-dung.html
- VietnamNews, "VN's shadow economy sparks debate". https://vietnamnews.vn/economy/422066/vn-s-shadow-economy-sparks-debate.html
- Paradox, Victoria 3 Dev Diary #9 National Markets. https://admin-forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-9-national-markets.1484917
- PC Gamer, phỏng vấn nhà thiết kế Victoria 3. https://pcgamer.com/victoria-3-communism-op
- Positech, blog phát triển Democracy 4. https://www.positech.co.uk/cliffsblog/?p=5801
- Starr, P. (1994). Seductions of Sim. *The American Prospect*. https://prospect.org/1994/04/01/seductions-sim-policy-simulation-game/
- Engadget, "EVE Evolved: ISK sinks and faucets". https://www.engadget.com/2010-10-24-eve-evolved-isk-sinks-and-faucets.html
- GamesBeat, về nền kinh tế trong Eco. https://gamesbeat.com/ecos-player-driven-economy-let-me-create-a-financial-meltdown/

---

## 7. Chỗ còn hổng, cần xác minh trước khi thiết kế

1. **Poledna 2023**: chưa đọc được cơ chế. Bản PDF ở IIASA chặn truy cập tự động. Bài này mở, có thể tải tay từ doi:10.1016/j.euroecorev.2022.104306.
2. **Sách BAM gốc và bài K+S 2010**: mới đọc qua bản tái hiện và bản mở rộng. Danh sách đầy đủ các quy luật mà sách BAM tuyên bố tái hiện chưa được kiểm.
3. **Bảng so sánh của Dawid và Delli Gatti 2018**: chưa đọc. Đây là nguồn tốt nhất để kiểm tra "lõi chung" mà mục 5.1 dựa vào.
4. **Phụ lục phương trình đầy đủ của Caiani** (SSRN 2664125): chưa mở. Giá trị tham số χ, ϵ, λ lấy từ đó.
5. **Lengnick bản JEBO 2013**: có thể khác bản 2011 đã đọc. Số doanh nghiệp (100) ghi theo trí nhớ.
6. **Số liệu Việt Nam**: tất cả lấy qua nguồn thứ cấp. Tỷ lệ phi chính thức, tỷ lệ tiền mặt, tỷ trọng doanh nghiệp nhà nước cần tra bản gốc của Cục Thống kê, Ngân hàng Nhà nước, OECD. Tổng số hộ kinh doanh và tỷ lệ tín dụng/GDP chưa có con số có nguồn.
7. **Văn bản luật**: chưa mở văn bản gốc nào. Hiến pháp Điều 53 và các chi tiết về thời hạn sử dụng đất ghi theo trí nhớ.
8. **Mô hình khu vực phi chính thức và mô hình siêu lạm phát trong ABM**: chưa tìm. Có thể đã có nghiên cứu mà phiên này chưa chạm tới.
9. **Game**: chưa xem Capitalism Lab, Tropico, Workers & Resources, các mô phỏng giáo dục của ngân hàng trung ương. Nhận định "chưa game nào mô hình hoá ngân hàng tạo tiền" là sơ bộ.
10. **Kỳ vọng và tâm lý**: KICKOFF yêu cầu "dự đoán lạm phát, niềm tin" ở GĐ1. File này mới có kỳ vọng thích nghi. Dòng nghiên cứu của Hommes và De Grauwe chưa được tra.
