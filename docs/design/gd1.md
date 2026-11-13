# GĐ1 - Lõi kinh tế

Trạng thái: **đã duyệt 13/11/2026**. Ngày viết: 13/11/2026. Dựa trên [gd0.md](gd0.md).

Nhãn nguồn dùng trong file này:
- **[Caiani]** Caiani và cộng sự 2016, JEDC 69. **[Lengnick]** Lengnick 2011/2013. **[BAM]** Delli Gatti và cộng sự 2011. **[K+S]** Dosi và cộng sự 2012. **[BoE]** McLeay, Radia, Thomas 2014. Chi tiết ở research/abm-models.md mục 6.
- **[TTK]** tự thiết kế, chưa có mô hình tham chiếu.
- **(trí nhớ)** chưa mở lại nguồn; phải tra trước khi đưa giá trị vào config.

## 1. Phạm vi

Có trong GĐ1: hộ gia đình; doanh nghiệp ba ngành; hộ kinh doanh phi chính thức; ngân hàng thương mại; NHNN; Chính phủ. Thị trường hàng hoá, lao động, tín dụng. Tiền mặt và tiền gửi. Thuế GTGT, TNCN, TNDN, thuế hộ kinh doanh. Trái phiếu chính phủ. Kỳ vọng lạm phát và niềm tin.

Lương tối thiểu vùng cũng thuộc GĐ1 (mục 5.3).

Không có trong GĐ1: dân số, kỹ năng, BHXH (GĐ2); đất, nhà, chứng khoán, vay tiêu dùng, liên ngân hàng, rút tiền ồ ạt (GĐ3); R&D, năng suất tăng, doanh nghiệp nhà nước có hành vi riêng (GĐ4); ngoại thương, tỷ giá, vàng (GĐ5); đầu vào trung gian giữa các ngành, năng lượng (GĐ6).

Hệ quả của việc là nền kinh tế đóng và không có tăng năng suất: GĐ1 không có tăng trưởng dài hạn. Sản lượng dao động quanh một mức. Mọi kịch bản lịch sử ở GĐ1 đều thiếu kênh tỷ giá và giá thế giới, phải ghi rõ.

## 2. Tác nhân và quy mô

| | Sa bàn (50) | Vừa (500) | Lớn (5000) |
|---|---|---|---|
| Hộ gia đình | 50 | 500 | 5000 |
| Doanh nghiệp chính thức lúc đầu | 6 | 40 | 300 |
| Hộ kinh doanh lúc đầu | 8 | 90 | 900 |
| Ngân hàng thương mại | 2 | 4 | 10 |
| NHNN, Chính phủ | 1 + 1 | 1 + 1 | 1 + 1 |

Mỗi hộ có một người lao động (GĐ2 mới có cơ cấu hộ). Hộ kinh doanh là một đơn vị sản xuất nhỏ do một hộ làm chủ, chủ hộ tự làm, có thể thuê thêm vài người. Số doanh nghiệp và hộ kinh doanh thay đổi theo phá sản và gia nhập.

Tỷ lệ ban đầu nhắm tới: khoảng 60% lao động ở khu vực phi chính thức, khoảng 10% làm cho Nhà nước, còn lại ở doanh nghiệp chính thức. Con số 60% bám theo tỷ lệ lao động phi chính thức 63-64% (research mục 4.1, mức B). Tỷ lệ 10% là giá trị tạm (C).

Ba ngành hàng tiêu dùng:

| Ngành | Sản phẩm | Đặc điểm trong mô hình |
|---|---|---|
| NN nông nghiệp | lương thực, thực phẩm | Hàng thiết yếu. Phần lớn là hộ kinh doanh. Nông sản chưa chế biến không chịu thuế GTGT |
| CN công nghiệp | hàng tiêu dùng và máy móc | Bán cho hộ và bán máy cho doanh nghiệp. Cần nhiều vốn cố định nhất |
| DV dịch vụ | dịch vụ | Không tồn kho được. Tỷ trọng trong chi tiêu tăng theo thu nhập |

## 3. Trình tự một tháng

1. **Chính sách**: luật mới có hiệu lực; lệnh của người chơi; quy tắc tự động của Chính phủ và NHNN.
2. **Kỳ vọng**: mọi tác nhân cập nhật kỳ vọng doanh số, giá, lương, lạm phát; hộ cập nhật niềm tin.
3. **Kế hoạch doanh nghiệp**: sản lượng, số lao động cần, lương chào, giá, đầu tư.
4. **Tín dụng**: doanh nghiệp xin vay; ngân hàng xét duyệt; tiền gửi mới được tạo.
5. **Lao động**: sa thải, đăng tuyển, tìm việc, khớp.
6. **Sản xuất**: tạo hàng vào tồn kho; mua và lắp máy.
7. **Lương và chuyển giao**: trả lương, khấu trừ thuế TNCN; lương công chức; trợ cấp.
8. **Mua hàng**, 4 lượt: hộ và Chính phủ mua; hộ rút hoặc nộp tiền mặt.
9. **Thuế**: nộp GTGT, tạm nộp TNDN, thuế hộ kinh doanh.
10. **Trả nợ**: gốc và lãi khoản vay; lãi tiền gửi; lãi và gốc trái phiếu.
11. **Lợi nhuận**: tính lãi lỗ; chia cổ tức theo quý.
12. **Phá sản và gia nhập**.
13. **Ngân hàng và NHNN**: kiểm dự trữ bắt buộc, vay tái cấp vốn, đấu thầu trái phiếu, nghiệp vụ thị trường mở.
14. **Khoá sổ**: kiểm bốn đẳng thức, tính chỉ số, cộng dồn bảng nhân quả.

## 4. Hộ gia đình

### 4.1 Thu nhập và tiêu dùng

Thu nhập khả dụng tháng = lương sau thuế + cổ tức sau thuế + lãi tiền gửi + trợ cấp + lợi nhuận hộ kinh doanh của mình.

Ngân sách tiêu dùng danh nghĩa:

```
C = α1 · YD_kỳ_vọng · m_niềm_tin · m_lạm_phát + α2 · của_cải_thanh_khoản
```

- Dạng hàm: [Caiani] phương trình 3.16, gốc từ Godley và Lavoie 2007. α1 khoảng 0,8-0,9; α2 quy đổi từ quý sang tháng. Giá trị gốc của Caiani ghi theo (trí nhớ), sẽ đọc lại từ bài khi code.
- `m_niềm_tin` và `m_lạm_phát` là hai hệ số quanh 1, định nghĩa ở mục 10. [TTK]
- C không vượt tiền đang có. Hộ không vay ở GĐ1.

Vì sao chọn: đơn giản, đã được kiểm định trong [Caiani]. Số hạng của cải làm người giàu tiêu ít hơn so với thu nhập, một nguồn của bất bình đẳng.

### 4.2 Chia ngân sách cho ba loại hàng

1. Mua đủ lượng lương thực tối thiểu `f_min` trước.
2. Phần còn lại chia theo tỷ lệ (θ_NN, θ_CN, θ_DV).

Kết quả: hộ nghèo dành phần lớn ngân sách cho lương thực; hộ giàu dành nhiều hơn cho dịch vụ. Đây là quy luật Engel, có trong mọi giáo trình kinh tế vi mô. Nhờ vậy lạm phát lương thực đánh vào người nghèo nặng hơn, và CPI theo nhóm thu nhập có nghĩa.

### 4.3 Đi mua

- Mỗi hộ nhớ 5 người bán mỗi ngành. Mỗi lượt mua từ người rẻ nhất còn hàng; hết hàng thì sang người kế. Cầu chưa đáp ứng dồn sang lượt sau; hết tháng vẫn chưa mua được thì thành tiết kiệm bắt buộc.
- Mỗi tháng, với xác suất 0,25, hộ xem thử một người bán mới (chọn theo xác suất tỷ lệ với quy mô). Thay người đắt nhất trong danh sách nếu người mới rẻ hơn; xác suất thay tăng theo chênh lệch giá.
- Nguồn: [Lengnick] mục 2.2, [Caiani] mục 2. Vì sao: sinh ra phân tán giá, hàng ế và khách quen một cách tự nhiên; người chơi làm chủ doanh nghiệp có khách thật để giữ.

### 4.4 Tiền mặt và tiền gửi

- Mua ở hộ kinh doanh: trả tiền mặt. Mua ở doanh nghiệp chính thức: trả từ tiền gửi.
- Lương từ khu vực chính thức và Nhà nước vào tài khoản; lương từ hộ kinh doanh trả tiền mặt.
- Hộ giữ tiền mặt đủ cho chi tiêu tiền mặt dự kiến nhân hệ số đệm; thiếu thì rút, thừa thì nộp. [TTK]
- Mỗi hộ có một ngân hàng. Mỗi năm, với xác suất nhỏ, đổi sang ngân hàng trả lãi cao hơn ([Caiani] 3.14, giản lược).

Tỷ lệ tiền mặt trên tổng phương tiện thanh toán khoảng 10% là mục tiêu hiệu chỉnh (research mục 4.4, mức B).

### 4.5 Lao động

- Người thất nghiệp mỗi tháng hỏi tối đa 5 nơi tuyển lấy ngẫu nhiên, từ lương cao xuống, nhận việc đầu tiên trả từ lương đòi hỏi trở lên. Người có việc hỏi thử 1 nơi với xác suất 0,1. [Lengnick] mục 2.3.
- Lương đòi hỏi: giảm một tỷ lệ mỗi tháng thất nghiệp, có sàn là chi phí lương thực tối thiểu. Khi có việc, mỗi năm nâng theo lạm phát kỳ vọng. [Lengnick] mục 2.4 và [Caiani] 3.15, thêm phần lạm phát kỳ vọng [TTK].

### 4.6 Lối thoát phi chính thức [TTK]

Người thất nghiệp quá `T_u` tháng và tiền còn dưới `k` tháng chi tiêu tối thiểu sẽ mở một hộ kinh doanh một người (bán hàng rong, làm thuê vặt), ngành DV hoặc NN, năng suất thấp.

Vì sao: Việt Nam không có lưới an sinh cho đa số lao động, nên người mất việc không ở trạng thái thất nghiệp lâu mà chuyển sang tự làm. Đây là lý do tỷ lệ thất nghiệp chính thức thấp trong khi năng suất và thu nhập thấp. Không có cơ chế này thì mô hình sẽ cho thất nghiệp cao kiểu châu Âu, sai với Việt Nam. Hướng tham khảo: khu vực phi chính thức phình ra khi kinh tế xấu (Loayza và Rigolini 2011, World Development) **(trí nhớ)**.

Khi doanh nghiệp chính thức tuyển lại với lương cao hơn thu nhập tự làm, người này đóng hộ kinh doanh và đi làm.

## 5. Doanh nghiệp chính thức

### 5.1 Sản xuất

`Y = min(a_L · L, a_K · K)`. Lao động và máy móc bổ sung cho nhau, không thay thế. [Caiani]

**Khác với đề xuất trong research (mục 5.2 để ngành tư liệu sản xuất sang GĐ4).** Tớ đưa vốn cố định dạng đơn giản vào GĐ1: máy là sản phẩm của ngành CN, một loại đồng nhất, khấu hao đều 10 năm. Không có đời máy, không có R&D; những thứ đó vẫn ở GĐ4. Lý do: không có đầu tư thì doanh nghiệp gần như không cần vay, và ba thứ sau mất nghĩa: kênh truyền dẫn lãi suất, room tín dụng, và sự thật "đầu tư biến động hơn GDP". Chi phí: thêm một quy tắc đầu tư và một luồng mua bán giữa doanh nghiệp. Mục này cần cậu duyệt (de-xuat.md, mục T1).

### 5.2 Kế hoạch

- Kỳ vọng doanh số: `s_e ← s_e + λ (s_thực − s_e)`. [Caiani] 3.1.
- Sản lượng mong muốn: `y* = s_e (1 + ν) − tồn_kho`, không vượt công suất. ν là tỷ lệ tồn kho đệm. [Caiani] 3.2. Ngành DV không có tồn kho: `y* = s_e (1 + ν)`, phần không bán được mất đi.
- Lao động cần: `L* = y* / a_L`. Thừa người thì sa thải phần thừa, mỗi tháng tối đa một tỷ lệ (ma sát sa thải). Thiếu thì đăng tuyển.

### 5.3 Lương

- Tháng trước đăng tuyển mà không đủ người: tăng lương chào một lượng ngẫu nhiên. [BAM], [Lengnick]
- Lương người đang làm không giảm về danh nghĩa. Mỗi năm xét tăng theo một phần lạm phát kỳ vọng. Lương danh nghĩa cứng chiều xuống là hiện tượng thực nghiệm được ghi nhận rộng rãi (Bewley 1999) **(trí nhớ)**; đây cũng là thứ làm suy thoái sinh ra thất nghiệp thay vì giảm lương.
- GĐ1 mỗi doanh nghiệp một mức lương.
- **Lương tối thiểu vùng** (kéo về GĐ1 theo quyết định 13/11/2026): mỗi doanh nghiệp chính thức và Nhà nước thuộc một trong bốn vùng, gán lúc khởi tạo theo phân phối cấu hình (giá trị tạm, C). Lương chào và lương đang trả không được dưới sàn vùng: 5,31 / 4,73 / 4,14 / 3,70 triệu đồng/tháng (Nghị định 293/2025/NĐ-CP, từ 01/01/2026, mức B). Khi sàn tăng, lương dưới sàn được nâng lên ngay và ghi lý do `min_wage`. Hộ kinh doanh không có hợp đồng lao động nên sàn không ràng buộc họ; đây là đơn giản hoá, luật áp dụng cho mọi quan hệ lao động có hợp đồng. GĐ1 chưa có địa lý nên vùng chỉ là một nhãn.

### 5.4 Giá

```
giá_chưa_thuế = (1 + μ) · chi_phí_đơn_vị_kỳ_vọng
giá_bán       = giá_chưa_thuế · (1 + thuế_suất_GTGT)
```

- Chi phí đơn vị = (quỹ lương + khấu hao + lãi vay) / sản lượng kỳ vọng. [Caiani] 3.6 chỉ tính lao động; tớ thêm khấu hao và lãi vay để lãi suất đi được vào giá [TTK].
- Biên lãi μ tự chỉnh: tồn kho dưới mức đệm thì tăng một lượng ngẫu nhiên, trên thì giảm. [Caiani] 3.7.
- Mỗi lần đổi giá ghi bản ghi quyết định chia theo: lương, năng suất sử dụng, khấu hao, lãi vay, thuế, biên lãi.

Vì sao chọn cách cộng lãi trên chi phí: chuỗi nhân quả đọc được thành lời; thuế gắn vào tự nhiên; đã được kiểm định (biên lãi ngược chiều chu kỳ, lạm phát trễ).

### 5.5 Đầu tư và vay

- Tốc độ tăng công suất mong muốn phụ thuộc tỷ suất lợi nhuận so với mức bình thường và tỷ lệ sử dụng công suất so với mức bình thường. [Caiani] 3.9.
- Mua máy từ doanh nghiệp CN qua cùng cơ chế tìm người bán như hộ.
- Nhu cầu vay = lương tháng tới + đầu tư + nợ đến hạn + thuế phải nộp + đệm thanh khoản − tiền đang có. Tính theo tiền thực có, không theo vốn ròng. [Caiani] 3.11 và cảnh báo ở mục 1.1.
- Dùng tiền nội bộ trước, vay sau.

### 5.6 Thuế, cổ tức

- GTGT: nộp hằng tháng = thuế đầu ra − thuế đầu vào của máy đã mua.
- TNDN: tạm nộp hằng tháng trên lợi nhuận dương, quyết toán cuối năm. Thuế suất 15 / 17 / 20% theo doanh thu năm trước.
- Cổ tức: mỗi quý chia một tỷ lệ lợi nhuận sau thuế cho chủ sở hữu theo cổ phần; khấu trừ thuế TNCN 5%.

### 5.7 Sở hữu, phá sản, gia nhập

- Mỗi doanh nghiệp có danh sách chủ sở hữu là các hộ cụ thể (hoặc Nhà nước). Lúc khởi tạo chia đều; về sau ai bỏ vốn lập doanh nghiệp thì người đó sở hữu.
- **Phá sản**: hai tháng liền không trả đủ lương hoặc nợ sau khi đã xin vay, hoặc vốn ròng âm. Thanh lý tồn kho và máy với giá chiết khấu cho doanh nghiệp cùng ngành; tiền thu được trả ngân hàng; phần nợ còn lại ngân hàng xoá, trừ vào vốn; chủ sở hữu mất vốn; người lao động mất việc. [Caiani] 3.3.
- **Gia nhập**: mỗi tháng, mỗi ngành có xác suất xuất hiện doanh nghiệp mới, tăng theo lợi nhuận ngành và cầu chưa đáp ứng. Người sáng lập là một hộ chọn theo xác suất tỷ lệ với của cải, đủ tiền góp vốn tối thiểu, góp một phần tiền gửi của mình. [TTK], giữ nguyên tắc của [Caiani]: vốn doanh nghiệp mới phải do ai đó bỏ ra.

Hai điểm này là động cơ chính của bất bình đẳng trong mô hình: người có tiền mới lập được doanh nghiệp, lợi nhuận chảy về chủ; người lập doanh nghiệp thất bại thì mất trắng.

## 6. Hộ kinh doanh và khu vực phi chính thức [TTK]

Cơ chế chưa có mô hình tham chiếu. Tớ đã tìm lại: không thấy mô hình ABM nhất quán dòng-tồn nào có khu vực phi chính thức. Gần nhất là mô hình DSGE có khu vực phi chính thức với xác suất bị phát hiện và tiền phạt (Dellas và cộng sự 2017, Bank of Greece), dùng làm hướng tham khảo cho phần tuân thủ thuế.

Khác doanh nghiệp chính thức ở các điểm:

| Điểm | Hộ kinh doanh |
|---|---|
| Thanh toán | Tiền mặt, cả thu lẫn chi |
| Tín dụng | Không vay được ngân hàng |
| Năng suất | Thấp hơn, `a_L` nhân hệ số < 1. Hướng theo La Porta và Shleifer 2014 **(trí nhớ)** |
| Quy mô | Tối đa `n_max` lao động kể cả chủ |
| Vốn cố định | Không dùng máy ở GĐ1 |
| Lao động thuê | Không khấu trừ thuế TNCN, không hợp đồng |
| Thuế | Theo luật hộ kinh doanh từ 2026, nhân với tỷ lệ khai báo |
| Giá, lương, sản lượng | Cùng quy tắc như doanh nghiệp, tham số riêng |

Thuế theo luật hiện hành (research/vn-params.md mục 1.3 và 4):
- Doanh thu năm đến 1 tỷ đồng: không chịu GTGT, không nộp TNCN. (A)
- Trên 1 tỷ đến 3 tỷ: GTGT và TNCN theo tỷ lệ % trên doanh thu theo ngành. (tỷ lệ TNCN: A; tỷ lệ GTGT: B)
- Phần "trừ ngưỡng" sau khi ngưỡng đổi từ 500 triệu lên 1 tỷ: C, dùng 1 tỷ, gắn nhãn chưa xác minh.

**Tỷ lệ khai báo** `d` (từ 0 đến 1): phần doanh thu hộ kinh doanh khai với cơ quan thuế. Mặc định dưới 1. Đây là tham số hành vi, không phải luật, và chưa có số liệu nguồn (C). Biến thể Phòng thí nghiệm "mọi người nộp thuế đủ" đặt `d = 1` và bắt hộ kinh doanh khấu trừ thuế TNCN cho người làm thuê.

Hai lớp "ngoài lưới thuế" phải tách bạch trong UI: (1) miễn hợp pháp vì dưới ngưỡng, (2) khai thiếu. Người chơi nâng hay hạ ngưỡng 1 tỷ sẽ thấy lớp 1 đổi; tăng kiểm tra thuế thuộc GĐ8.

Chuyển từ hộ kinh doanh lên doanh nghiệp: chưa làm ở GĐ1. Ghi vào rủi ro.

## 7. Ngân hàng thương mại

### 7.1 Tạo tiền

Duyệt vay thì ghi khoản vay vào tài sản và tiền gửi vào nợ, cùng lúc. Trả gốc thì huỷ tiền gửi. Ngân hàng không cần có sẵn tiền gửi hay dự trữ để cho vay. [BoE], [Caiani]

### 7.2 Những thứ giới hạn việc cho vay

Xét theo thứ tự; mỗi lần từ chối hoặc cắt giảm ghi bản ghi quyết định với đúng lý do.

1. **Khả năng trả nợ của người vay**: dòng tiền hoạt động kỳ vọng phải đủ trả nợ với hệ số an toàn. Không đủ thì cho vay ít hơn tới mức đủ. Bản giản lược của [Caiani] 3.13; bản đầy đủ có tài sản thế chấp để GĐ3.
2. **Vốn của ngân hàng**: vốn tự có / tài sản có rủi ro ≥ tỷ lệ an toàn vốn tối thiểu. Khoản vay hệ số 1; trái phiếu chính phủ và dự trữ hệ số 0. Mức 8% theo Thông tư 41/2016/TT-NHNN **(trí nhớ, C)**.
3. **Room tín dụng**: dư nợ của ngân hàng ≤ dư nợ đầu năm × (1 + room). Công cụ của NHNN, mặc định bật.
4. **Thanh khoản**: không chặn cho vay. Thiếu dự trữ bắt buộc thì vay tái cấp vốn của NHNN và chịu lãi.
5. Hồ sơ xếp theo độ lành mạnh (vốn ròng / tài sản). Khi vốn hoặc room không đủ cho tất cả, hồ sơ yếu bị loại trước. [BAM], [K+S] phương trình 3-5.

Điểm 4 là chỗ khác hẳn mô hình số nhân tiền. Tỷ lệ dự trữ bắt buộc làm việc cho vay đắt hơn, không đặt trần cứng.

### 7.3 Lãi suất

- Cho vay: `lãi suất tái cấp vốn + biên của ngân hàng + phụ phí rủi ro theo đòn bẩy người vay`. [BAM] điểm 16-18.
- Biên của ngân hàng tự chỉnh: thừa vốn so với mục tiêu thì hạ để hút khách, thiếu thì nâng. [Caiani] 3.12.
- Huy động: lãi suất tái cấp vốn trừ một khoảng, tự chỉnh theo nhu cầu thanh khoản; không vượt trần nếu NHNN đặt trần.
- Doanh nghiệp hỏi 2 ngân hàng, chọn lãi thấp hơn. Có thể nợ nhiều ngân hàng.

### 7.4 Khoản vay

Hai loại: vốn lưu động 12 tháng và đầu tư 60 tháng. Trả gốc đều hằng tháng, lãi trên dư nợ. Mỗi khoản vay là một dòng riêng, có trường tài sản thế chấp (để trống ở GĐ1). Quá hạn 3 tháng thì tính là nợ xấu.

### 7.5 Lãi lỗ, vốn, đổ vỡ

- Thu lãi vay, lãi trái phiếu, lãi dự trữ; trả lãi tiền gửi, lãi tái cấp vốn; trừ nợ xoá. Nộp TNDN 20%. Chia cổ tức khi vốn trên mục tiêu.
- Ngân hàng có chủ sở hữu: các hộ, hoặc Nhà nước. Lúc đầu khoảng 40% tài sản hệ thống thuộc ngân hàng do Nhà nước sở hữu (research mục 4.3). Ở GĐ1 ngân hàng nhà nước hành xử như ngân hàng khác; chỉ khác là cổ tức về ngân sách.
- **Vốn âm**: mặc định Nhà nước tái cấp vốn bằng tiền ngân sách, chủ cũ mất vốn. Sát với cách Việt Nam xử lý ngân hàng yếu kém. Biến thể Phòng thí nghiệm: người gửi tiền gánh lỗ theo [Caiani]. Rút tiền ồ ạt và lây lan thuộc GĐ3.

## 8. Ngân hàng Nhà nước

| Công cụ | Mặc định | Nguồn, mức xác minh |
|---|---|---|
| Lãi suất tái cấp vốn | 4,5%/năm | QĐ 1123/QĐ-NHNN, A |
| Tỷ lệ dự trữ bắt buộc | 3% tiền gửi | QĐ 1158/QĐ-NHNN (2018), đã sửa bởi QĐ 2977/QĐ-NHNN (2025). B, xem mục 15 |
| Lãi trả cho dự trữ bắt buộc | 0,5%/năm; dự trữ vượt 0% | QĐ 1349/QĐ-NHNN ngày 24/8/2021, B |
| Room tín dụng | 16%/năm mỗi ngân hàng | Mục tiêu 2025, B |
| Trần lãi suất huy động | tắt | Số hiện hành chưa tìm được, C |
| Mua bán trái phiếu với ngân hàng | không tự động | |
| Mua trái phiếu trực tiếp từ Chính phủ | tắt | Xem dưới |
| Mục tiêu lạm phát | 4,5% | B |

- Cho ngân hàng vay tái cấp vốn theo yêu cầu, không giới hạn, ở lãi suất tái cấp vốn. **Đơn giản hoá**: ngoài đời NHNN không cho vay tự động như vậy và có thị trường liên ngân hàng. GĐ3 bổ sung.
- **In tiền** trong mô hình là NHNN mua trái phiếu chính phủ: tài khoản kho bạc tăng, và khi Chính phủ chi thì tiền gửi lẫn dự trữ trong hệ thống tăng. Luật thật giới hạn chặt việc này (Luật NHNN 2010 Điều 26: tạm ứng cho ngân sách phải hoàn trả trong năm) **(trí nhớ, cần tra)**. App cho làm để học, và ghi chú giới hạn luật ngay cạnh nút.
- Lợi nhuận NHNN chuyển về ngân sách mỗi năm.
- Khi người chơi không giữ vai Chính phủ: NHNN giữ nguyên mặc định, hoặc theo quy tắc phản ứng đơn giản với lạm phát lệch mục tiêu (chọn trong sandbox).

## 9. Chính phủ

**Thu**: GTGT, TNCN, TNDN, thuế hộ kinh doanh, cổ tức ngân hàng nhà nước, lợi nhuận NHNN.

**Chi**: lương công chức (một tỷ lệ lực lượng lao động, lương theo mức bình quân); mua hàng hoá dịch vụ của doanh nghiệp theo cùng cơ chế mua như hộ; trợ cấp xã hội (mặc định nhỏ); lãi trái phiếu; tái cấp vốn ngân hàng.

**Tài khoản**: kho bạc gửi ở NHNN. **Đơn giản hoá**: ngoài đời Kho bạc gửi cả ở ngân hàng thương mại.

**Bù thâm hụt**: phát hành trái phiếu kỳ hạn 12 tháng và 60 tháng qua đấu thầu hằng tháng. Ngân hàng mua bằng dự trữ dư nếu lợi suất đủ cao so với lãi suất tái cấp vốn. Bán không hết thì: (a) cắt chi mua hàng, hoặc (b) NHNN mua, nếu người chơi cho phép. Không có lựa chọn ngầm.

Chỗ này cố ý khác [Caiani], nơi NHTW tự động mua hết phần trái phiếu ế. Làm như Caiani thì "in tiền" xảy ra ngầm mỗi tháng và câu hỏi của cậu mất nghĩa.

**Thuế** (research/vn-params.md):

| Thuế | Trong mô hình | Đơn giản hoá |
|---|---|---|
| GTGT | CN và DV 10%, giảm còn 8% tới hết 31/12/2026; NN không chịu thuế | Ba thuế suất thật gom theo ngành. Không mô hình danh mục 5% |
| TNCN từ lương | Biểu 5 bậc 5-35%, giảm trừ 15,5 triệu bản thân và 6,2 triệu mỗi người phụ thuộc, khấu trừ hằng tháng | Không quyết toán năm. Số người phụ thuộc mỗi hộ lấy từ phân phối cấu hình. Chưa trừ BHXH (GĐ2) |
| TNCN từ cổ tức | 5% | |
| TNDN | 20%; 17% nếu doanh thu trên 3 đến 50 tỷ; 15% nếu đến 3 tỷ | Không chuyển lỗ, không ưu đãi ngành, không giảm 30% tạm thời 2026-2027 (mức B, chưa đọc văn bản) |
| Hộ kinh doanh | Mục 6 | |

**Quy tắc tự động** khi người chơi không giữ vai: giữ chi tiêu theo tỷ lệ GDP, cắt mua hàng khi không bán được trái phiếu. Trần nợ công 60% GDP (Nghị quyết 23/2021/QH15) **(trí nhớ, C)** hiện thành vạch cảnh báo, không tự cưỡng chế.

## 10. Kỳ vọng và tâm lý

Kỳ vọng doanh số, giá, lương: thích nghi một tham số λ. [Caiani] 3.1. Dosi và cộng sự báo cáo quy tắc tinh vi hơn không cải thiện kết quả.

**Lạm phát kỳ vọng** của mỗi hộ và doanh nghiệp:

```
π_e = w · mục_tiêu_NHNN + (1 − w) · π_thích_nghi
```

- `π_thích_nghi` cập nhật theo lạm phát mà chính tác nhân đó gặp (giá các nơi mình mua).
- `w` là mức tin vào mục tiêu của NHNN. Tăng dần khi lạm phát thực nằm gần mục tiêu, giảm nhanh khi lệch xa nhiều tháng liền.
- Hướng tham khảo: mô hình hai kiểu người dự báo của De Grauwe 2011 và dòng nghiên cứu chuyển đổi quy tắc dự báo của Brock và Hommes 1997 **(trí nhớ)**. Bản của tớ giản lược hơn: một trọng số liên tục thay vì hai nhóm rời. [TTK]

Lạm phát kỳ vọng đi vào ba chỗ:
1. Lương đòi hỏi và đợt xét tăng lương hằng năm (mục 4.5, 5.3). Đây là kênh vòng xoáy lương-giá.
2. Chi phí đơn vị kỳ vọng khi doanh nghiệp đặt giá.
3. `m_lạm_phát` trong tiêu dùng: khi lạm phát kỳ vọng vượt lãi suất tiền gửi, hộ mua sớm hơn và giữ ít tiền hơn. Dạng hàm theo cầu tiền Cagan 1956. Đây là mầm của cơ chế chạy khỏi nội tệ; ở lạm phát thấp tác động nhỏ.

**Niềm tin** của hộ: `m_niềm_tin` giảm khi tỷ lệ thất nghiệp trong nhóm quen biết của hộ tăng, và khi chính hộ vừa trải qua thất nghiệp. Tác dụng: tiết kiệm phòng thân, làm suy thoái tự khuếch đại. [TTK], theo ý tiết kiệm phòng thân trong sách giáo khoa (Carroll 1997) **(trí nhớ)**.

Biến thể Phòng thí nghiệm: tắt kỳ vọng lạm phát (`π_e = 0`); neo tuyệt đối (`w = 1`); tắt niềm tin.

## 11. Chỉ số

Mỗi chỉ số có hàm phân rã.

- Sản lượng: GDP danh nghĩa và thực, tính theo hai cách (chi tiêu và thu nhập) và phải khớp; theo ngành; sử dụng công suất; tồn kho.
- Giá: CPI (rổ cập nhật hằng năm), CPI theo nhóm thu nhập, lạm phát tháng và năm, lạm phát kỳ vọng.
- Lao động: thất nghiệp, tỷ lệ lao động phi chính thức, lương thực bình quân, chỗ trống.
- Tiền và tín dụng: tiền mặt lưu thông, tổng phương tiện thanh toán, dư nợ, tăng trưởng tín dụng, nợ xấu, tỷ lệ an toàn vốn, lãi suất cho vay và huy động. Bảng **nguồn tạo và huỷ tiền** theo kênh.
- Ngân sách: thu theo sắc thuế, chi theo khoản, cân đối, nợ công / GDP, ai đang giữ trái phiếu.
- Phân phối: Gini thu nhập và của cải, phần của nhóm 10% giàu nhất, phần lương và phần lợi nhuận trong thu nhập.
- Doanh nghiệp: số lượng, phá sản, gia nhập, phân phối quy mô.

## 12. Vai người chơi ở GĐ1

- **Chính phủ**: mọi tham số ở mục 8 và 9. Mỗi nút có ghi chú luật thật.
- **Hộ gia đình**: nhận hay từ chối việc, mức lương đòi hỏi, ngân sách tiêu dùng, tỷ lệ tiền mặt, đổi ngân hàng, bỏ vốn lập doanh nghiệp, mở hộ kinh doanh.
- **Doanh nghiệp**: giá, lương chào, sản lượng, tuyển và sa thải, đầu tư, xin vay, chia cổ tức.
- **Quan sát**: mọi chỉ số, soi bảng cân đối và lịch sử quyết định của bất kỳ tác nhân nào.

Mỗi quyết định có phương án của quy tắc tự động và lý do, để người chơi so cách nghĩ của mình với quy tắc.

## 13. Phòng thí nghiệm ở GĐ1

| Quy tắc | Gốc | Biến thể | Học được gì |
|---|---|---|---|
| Ngân hàng cho vay | Tạo tiền gửi mới | Chỉ cho vay phần dự trữ dư (ngân hàng là trung gian) | Hai cách hiểu về ngân hàng cho ra hai nền kinh tế khác nhau thế nào |
| Lạm phát kỳ vọng | Mục 10 | Tắt; neo tuyệt đối | Kỳ vọng làm lạm phát dai dẳng tới đâu |
| Tuân thủ thuế | `d < 1` | Nộp đủ | Cơ sở thuế thật hẹp cỡ nào |
| Lương cứng chiều xuống | Bật | Tắt | Vì sao suy thoái sinh thất nghiệp |
| Cổ tức | Theo cổ phần | Chia đều cho mọi hộ | Sở hữu đóng góp bao nhiêu vào bất bình đẳng |
| Tiêu dùng theo của cải | α2 > 0 | α2 = 0 | |
| Thông tin người mua | 5 người bán quen | Biết giá mọi người bán | Thông tin hạn chế tạo ra phân tán giá và quyền định giá |
| Niềm tin | Bật | Tắt | Suy thoái tự khuếch đại bao nhiêu |
| Phá sản | Bật | Nhà nước cứu mọi doanh nghiệp | Ràng buộc ngân sách mềm |

## 14. Kiểm định GĐ1

### 14.1 Cách chạy

- Kiểm định thống kê ở mức 500 hộ: 20 seed × 480 tháng, bỏ 120 tháng đầu. Ở mức 5000 hộ: 5 seed × 480 tháng.
- Mỗi sự thật là một phát biểu thống kê có ngưỡng. Qua khi đúng ở ít nhất 80% số seed, hoặc khoảng tin cậy 95% của trung bình nằm đúng phía.
- Thí nghiệm chính sách dùng chạy đôi cùng seed: một bên có cú sốc, một bên không, lấy hiệu.
- Tách chu kỳ bằng lọc Hodrick-Prescott trên chuỗi quý (gộp 3 tháng) để so được với các bài gốc.
- `npm run validate:gd1` sinh báo cáo vào `docs/validation/gd1.md`.
- Mức 50 hộ chỉ kiểm các mục kế toán.

### 14.2 Danh sách

**Kế toán (phải đúng tuyệt đối, mọi seed, mọi tháng, cả ba quy mô)**

| Mã | Sự thật | Nguồn |
|---|---|---|
| K1.1 | Bốn đẳng thức ở gd0 mục 4.3 | [Caiani] 5.2 |
| K1.2 | Thay đổi tiền gửi = vay mới − trả gốc − xoá nợ + các luồng với Chính phủ và NHNN + nộp trừ rút tiền mặt | [BoE] |
| K1.3 | GDP theo chi tiêu = GDP theo thu nhập | giáo trình |
| K1.4 | Phá sản và gia nhập không tạo ra hay làm mất tiền | [Caiani] 1.1 |

**Vĩ mô nền**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.5 | Nền kinh tế tự ổn định, không sụp, không nổ | Sau 120 tháng đầu: thất nghiệp 1-15%, lạm phát năm từ −2% đến 12% trong 95% số tháng | [Lengnick], [Caiani] |
| K1.6 | Có thất nghiệp không tự nguyện và có hàng ế cùng lúc | Cả hai > 0 trong hơn 90% số tháng | [Lengnick] |
| K1.7 | Chu kỳ tự sinh, không cần cú sốc | Tự tương quan GDP đã lọc dương ở trễ 1-2 quý | [Caiani] |
| K1.8 | Đầu tư biến động hơn GDP; tiêu dùng ít hơn | Tỷ số độ lệch chuẩn > 1,5 và < 1 | [Caiani], [K+S] |
| K1.9 | Thất nghiệp ngược chiều chu kỳ (Okun) | Tương quan với GDP đã lọc < −0,3 | [Caiani] |
| K1.10 | Đường Phillips và đường Beveridge dốc xuống | Hệ số tương quan âm | [Lengnick] |
| K1.11 | Tín dụng doanh nghiệp cùng chiều chu kỳ | Tương quan > 0 | [Caiani], [K+S] |
| K1.12 | Lạm phát cùng chiều chu kỳ và trễ | Tương quan chéo lớn nhất ở trễ ≥ 1 quý | [Caiani] |

**Phân phối**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.13 | Bất bình đẳng tự hình thành từ xuất phát điểm đồng đều | Gini của cải từ 0 lên > 0,4 sau 30 năm; phân phối lệch phải | [BAM], [Caiani] |
| K1.14 | Quy mô doanh nghiệp lệch phải | Độ lệch > 1 | [Lengnick], [Caiani] |
| K1.15 | Chia đều cổ tức (biến thể) làm Gini thấp hơn rõ | Hiệu chạy đôi < 0 | [TTK] |

**Tiền và chính sách tiền tệ**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.16 | Chi ngân sách bằng tiền NHNN in: giá tăng, sản lượng thực tăng tạm thời | Hiệu chạy đôi: CPI cao hơn bền vững; GDP thực cao hơn trong 2 năm đầu rồi thu hẹp | [Lengnick] mục 4, mở rộng theo kênh thật |
| K1.17 | In càng nhiều thì giá tăng càng nhiều | Ba mức in: mức giá sau 10 năm đơn điệu | giáo trình |
| K1.18 | Tiền mới không vào đều: người nhận trước lợi hơn | Thu nhập thực của nhóm bán hàng cho Chính phủ tăng so với nhóm còn lại trong năm đầu | hiệu ứng Cantillon; [TTK] về cách đo |
| K1.19 | Tăng lãi suất tái cấp vốn làm giảm tín dụng mới và giảm lạm phát sau độ trễ | Hiệu chạy đôi âm sau 4-8 quý | research 5.5 số 10; chưa có bài kiểm trực tiếp |
| K1.20 | Room tín dụng đang chặn thì tăng trưởng tín dụng không vượt room, và doanh nghiệp yếu bị loại trước | Vốn ròng/tài sản bình quân của nhóm bị từ chối thấp hơn nhóm được duyệt | [K+S]; [TTK] |
| K1.21 | Hộ rút tiền mặt nhiều hơn thì dự trữ ngân hàng giảm và vay tái cấp vốn tăng | Hiệu chạy đôi | [BoE] |
| K1.22 | Biến thể "ngân hàng là trung gian" cho tín dụng và sản lượng thấp hơn | Hiệu chạy đôi | [BoE]; [TTK] |

**Tài khoá và thuế**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.23 | Tăng chi ngân sách bằng vay nợ làm GDP tăng trong ngắn hạn và nợ công tăng | Số nhân năm đầu > 0 | giáo trình; [K+S] |
| K1.24 | Tăng GTGT: giá tiêu dùng tăng nhưng ít hơn mức thuế về lâu dài; tiêu dùng thực giảm; thu ngân sách tăng | Tỷ lệ chuyển vào giá sau 2 năm nằm giữa 0 và 1 | giáo trình về phạm vi ảnh hưởng của thuế |
| K1.25 | Thuế TNCN luỹ tiến làm Gini thu nhập sau thuế thấp hơn trước thuế | Hiệu > 0 | tính chất của biểu thuế |
| K1.26 | Bật "nộp thuế đủ" làm thu ngân sách tăng và khu vực phi chính thức co lại | Hiệu chạy đôi | [TTK] |
| K1.27 | Kinh tế xấu đi thì tỷ lệ lao động phi chính thức tăng | Tương quan với GDP đã lọc < 0 | Loayza và Rigolini 2011 (trí nhớ) |

**Lương tối thiểu**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.30 | Không doanh nghiệp chính thức nào trả dưới sàn vùng | Tuyệt đối, mọi tháng | luật |
| K1.31 | Nâng mạnh lương tối thiểu: lương nhóm thấp ở khu vực chính thức tăng, việc làm chính thức giảm hoặc tỷ lệ phi chính thức tăng | Hiệu chạy đôi đúng dấu khi sàn tăng 30% | giáo trình về giá sàn; [TTK] về phần phi chính thức |

**Kỳ vọng**

| Mã | Sự thật | Ngưỡng | Nguồn |
|---|---|---|---|
| K1.28 | Tắt kỳ vọng lạm phát làm lạm phát sau cú sốc tắt nhanh hơn | Số quý để lạm phát về nửa đỉnh ngắn hơn | [TTK] |
| K1.29 | Niềm tin làm suy thoái sâu hơn | Đáy GDP sau cú sốc cầu thấp hơn khi bật niềm tin | [TTK] |

**Mục tiêu hiệu chỉnh thô** (không chặn giai đoạn, chỉ báo cáo): lao động phi chính thức 55-70%; tiền mặt / tổng phương tiện thanh toán 7-13%; thu ngân sách / GDP 14-20%; thất nghiệp 2-6%.

Ghi chú trung thực: K1.15, K1.18, K1.20, K1.22, K1.26, K1.28, K1.29 kiểm cơ chế tự thiết kế, không có bài báo nào để so. Chúng kiểm mô hình làm đúng điều thiết kế nói, không kiểm thiết kế đúng với thực tế.

## 15. Tớ đã kiểm lại gì trong research

| Mục | Kết quả |
|---|---|
| Tỷ lệ dự trữ bắt buộc (vn-params mục 6.2, mức C) | Tìm ra văn bản: QĐ 1158/QĐ-NHNN năm 2018, tiền gửi VND không kỳ hạn và dưới 12 tháng 3%, từ 12 tháng 1%. QĐ 2977/QĐ-NHNN năm 2025 bỏ khoản 2 và 3 Điều 1 (phần riêng cho một số tổ chức). Chỉ đọc qua tóm tắt, nâng lên mức B |
| Lãi trả cho dự trữ bắt buộc (chưa biết) | QĐ 1349/QĐ-NHNN ngày 24/8/2021: 0,5%/năm cho dự trữ bắt buộc VND, 0% cho phần vượt. Mức B |
| Mức tham chiếu BHXH có bằng lương cơ sở không (mức C) | Báo chí pháp luật tính trần đóng = 20 × 2.530.000 = 50,6 triệu từ 01/7/2026. Mức B. Dùng ở GĐ2 |
| Câu "ảnh hưởng trực tiếp cơ chế nhân tiền gửi" (vn-params mục 8) | Sai với quyết định đã chốt. Mô hình không có số nhân tiền; dự trữ bắt buộc chỉ là chi phí thanh khoản (mục 7.2) |
| Đẳng thức tiền cơ sở (abm-models mục 5.5 số 2) | Thiếu tài khoản kho bạc và vốn NHNN. Đã sửa ở gd0 mục 4.3 |
| Mô hình ABM về siêu lạm phát (abm-models mục 7 số 8) | Tìm lại vẫn không thấy. Có khung lý thuyết cầu tiền Cagan 1956 với kỳ vọng thích nghi và các bản có học hỏi (Sargent, Williams, Zha). Dùng làm hướng; kịch bản siêu lạm phát vẫn "ngoài vùng đã kiểm định" |
| Mô hình ABM có khu vực phi chính thức | Không thấy bản nhất quán dòng-tồn nào. Xác nhận phải tự thiết kế |
| Bảng tham số của Caiani | Không tra được qua tìm kiếm. Các giá trị gốc đang ghi theo trí nhớ; bước code đầu tiên của GĐ1 là mở lại PDF ở research mục 1.1 và chép bảng tham số vào config |
| Các văn bản thuế 2025-2026 trong vn-params | Biểu TNCN 5 bậc, giảm trừ 15,5 và 6,2 triệu, TNDN 15/17/20%, lương tối thiểu vùng khớp với hiểu biết của tớ. Các văn bản từ giữa 2026 (Luật 09/2026, NĐ 141/2026, NQ 43/2026) tớ không có cách đối chiếu độc lập; giữ nguyên mức xác minh trong file |

Chưa kiểm được, vẫn mức C: tỷ lệ an toàn vốn hiện hành theo Thông tư 14/2025; Điều 26 Luật NHNN; trần nợ công; tỷ lệ khai báo doanh thu của hộ kinh doanh; tỷ lệ lao động khu vực Nhà nước.

## 16. Kịch bản GĐ1

Mỗi kịch bản có: mục tiêu, thời hạn, "nên hiểu trước", lời giải thích chuỗi nhân quả khi kết thúc. Kịch bản lịch sử thêm phần so với diễn biến thật và danh sách đơn giản hoá.

| # | Tên | Vai | Câu hỏi | Nên hiểu trước |
|---|---|---|---|---|
| 1 | Một khoản vay | Quan sát, 50 hộ | Tiền sinh ra từ đâu | không |
| 2 | Máy in tiền | Chính phủ | In tiền trả lương công chức thì giá ra sao, ai lợi ai thiệt | 1 |
| 3 | Từ vạch xuất phát | Quan sát rồi Chính phủ | Vì sao bất bình đẳng tự hình thành | không |
| 4 | Đánh thuế người giàu | Chính phủ | Nâng thuế bậc cao và thuế cổ tức: Gini giảm bao nhiêu, đầu tư có tụt không | 3 |
| 5 | Room hay lãi suất | Chính phủ | Hạ nhiệt tín dụng nóng bằng công cụ nào thì ai chịu | 1 |
| 6 | Hết hạn giảm thuế | Chính phủ | GTGT về 10% từ 01/01/2027: giá và ngân sách đổi thế nào | không |
| 7 | Kéo vào lưới thuế | Chính phủ | Hạ ngưỡng miễn thuế của hộ kinh doanh: thu thêm được bao nhiêu, mất gì | không |
| 8 | Cân ngân sách | Chính phủ | Giảm thâm hụt mà không gây suy thoái | 2 |
| 9 | Thắt lưng buộc bụng | Phòng thí nghiệm | Mọi nhà cùng tiết kiệm hơn thì cả nước có giàu hơn không | không |
| 10 | Sống bằng lương | Hộ gia đình | Giữ sức mua qua một đợt lạm phát | 2 |
| 11 | Chủ xưởng | Doanh nghiệp | Sống sót khi ngân hàng siết tín dụng | 5 |
| 12 | Tín dụng nóng 2007-2011 | Chính phủ | Lấy cảm hứng từ lạm phát Việt Nam 2008 và 2011 | 2, 5 |
| 13 | Giá - lương - tiền | Chính phủ | Lạm phát cao do in tiền, lấy cảm hứng từ 1985-1988. Không gọi là siêu lạm phát. Nhãn "ngoài vùng đã kiểm định" | 2 |
| 14 | Tăng lương tối thiểu | Chính phủ | Tăng sàn lương 7,8% hay 30%: ai được, ai mất việc, ai trôi sang phi chính thức | không |

Khủng hoảng châu Á 1997 và Zimbabwe cần tỷ giá và ngoại tệ. Làm ở GĐ1 thì phải bịa cơ chế, nên để GĐ5 (xem de-xuat.md mục P3).

Mỗi kịch bản phải qua "kiểm định kịch bản": các khẳng định trong lời giải thích đúng ở ít nhất 80% số seed. Không qua thì sửa lời giải thích hoặc bỏ kịch bản.

## 17. Thứ tự làm GĐ1

| Mốc | Nội dung | Kiểm định phải qua |
|---|---|---|
| M1 | Hộ, doanh nghiệp (chưa có máy), thị trường hàng hoá và lao động, một ngân hàng thụ động giữ tiền gửi. Khởi tạo từ trạng thái dừng | K1.1, K1.3, K1.5, K1.6 |
| M2 | Ngân hàng thật: tạo tiền, khoản vay nhiều kỳ, lãi suất, xét duyệt. Vốn cố định và đầu tư. Phá sản, gia nhập | K1.2, K1.4, K1.7-K1.11, K1.13, K1.14 |
| M3 | NHNN, Chính phủ, thuế, trái phiếu, in tiền | K1.16, K1.17, K1.19, K1.20, K1.23-K1.25 |
| M4 | Tiền mặt, hộ kinh doanh, lối thoát phi chính thức | K1.21, K1.26, K1.27 |
| M5 | Kỳ vọng lạm phát, niềm tin, lương tối thiểu vùng. Phòng thí nghiệm. Hiệu chỉnh. Chạy toàn bộ danh sách | Tất cả |
| M6 | UI GĐ1: bảng điều khiển ba vai, dashboard, bảng nguồn tiền, soi tác nhân. Kịch bản | Kiểm định kịch bản |

M1-M5 là engine, làm trước. M6 model khác làm được.

## 18. Đơn giản hoá chính và rủi ro

Đơn giản hoá (sẽ hiện trong mục "mô hình này bỏ qua gì" của app):
1. Nền kinh tế đóng: không tỷ giá, không nhập khẩu lạm phát, không vàng.
2. Không tăng năng suất, không tăng dân số: không có tăng trưởng dài hạn.
3. Một hộ một người lao động, lao động đồng nhất.
4. Không có đầu vào trung gian giữa các ngành.
5. Hộ không vay. Không có đất và nhà, nên thiếu kênh tín dụng lớn nhất của Việt Nam.
6. NHNN cho vay tái cấp vốn tự động; không có thị trường liên ngân hàng.
7. Thuế: gom thuế suất GTGT theo ngành, không quyết toán TNCN, không chuyển lỗ TNDN, không ưu đãi.
8. Không có BHXH và bảo hiểm thất nghiệp cho tới GĐ2.

Rủi ro:
- **Hiệu chỉnh bước tháng.** Các mô hình gốc chạy theo quý. Quy đổi tham số có thể sinh dao động lạ. Đây là chỗ dễ tốn thời gian nhất. Nếu sau vài vòng chỉnh vẫn không qua K1.5, phương án lùi là cho doanh nghiệp lập kế hoạch theo quý trong khi giao dịch vẫn theo tháng.
- **Khu vực phi chính thức** không có mô hình để so. Tham số tỷ lệ khai báo và năng suất tương đối là giá trị tạm.
- **Lối thoát phi chính thức** có thể làm thất nghiệp gần bằng 0 và che mất chu kỳ. Cần chỉnh `T_u`.
- **K1.19** chưa có bài kiểm trực tiếp trong các nguồn đã đọc. Nếu mô hình không tái hiện được thì phải xem lại kênh lãi suất, có thể phải thêm vay tiêu dùng sớm hơn dự định.
- Cho GĐ3: xét duyệt vay hiện chưa dùng tài sản thế chấp; trường đã có nhưng quy tắc sẽ phải viết thêm.
- Cho GĐ5: giá hiện chỉ hình thành trong nước. Khi mở cửa, ngành CN sẽ cần giá cạnh tranh với hàng nhập; quy tắc giá đã tách phần chi phí và phần biên lãi nên thêm được.
