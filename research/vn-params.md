# Tham số Việt Nam cho Kinh Bang

Tra cứu ngày **12/11/2026**. Đây là research, chưa thiết kế, chưa code.

## Cách đọc file này

Mỗi tham số có một mức xác minh:

| Ký hiệu | Nghĩa |
|---|---|
| ✅ A | Đã đọc **toàn văn** văn bản (bản sao trên luatvietnam.vn, hoặc trang sbv.gov.vn). Chưa đối chiếu với Công báo. |
| 🟨 B | Chỉ đọc báo hoặc bài tổng hợp (MISA, einvoice, sapo, Báo Pháp luật...). Con số có thể đúng nhưng chưa thấy trong văn bản gốc. |
| ❌ C | Chưa xác minh, hoặc các nguồn mâu thuẫn nhau. Đừng đưa vào cấu hình khi chưa kiểm tra lại. |

**Giới hạn chung của đợt tra cứu này:**

- thuvienphapluat.vn trả lỗi 403 với mọi trang văn bản. vbpl.vn chỉ ra trang rỗng. chinhphu.vn, quochoi.vn, mof.gov.vn không lấy được văn bản cụ thể.
- Vì vậy **không con số nào ở đây được đối chiếu với Công báo hay cổng Chính phủ**. Mức "A" nghĩa là đã đọc toàn văn bản sao, không phải bản gốc.
- Một số bản tóm tắt tự động của trang web sai so với phần văn bản nguyên văn trên cùng trang. Khi hai thứ lệch nhau, file này theo phần nguyên văn.
- Nhiều văn bản 2026 chỉ có bài báo, chưa có toàn văn. Những chỗ đó đều ghi B.

**Mốc thời gian quan trọng sắp tới** (ảnh hưởng thiết kế cấu hình luật theo thời gian):

- 31/12/2026: hết hiệu lực giảm thuế GTGT 8%. Chưa thấy văn bản gia hạn.
- 01/01/2027: dự kiến tăng lương tối thiểu vùng bình quân 7,8% (mới là đề xuất).
- 01/07/2026: Luật TNCN 109/2025 có hiệu lực chung. Riêng phần tiền lương và kinh doanh áp dụng từ kỳ tính thuế 2026.

---

## 1. Thuế GTGT

### 1.1 Thuế suất

| Tham số | Giá trị | Văn bản | Hiệu lực | Mức |
|---|---|---|---|---|
| Thuế suất 0% | Hàng xuất khẩu và một số loại khác | Luật 48/2024/QH15, Điều 9 khoản 1 | 01/07/2025 | 🟨 B |
| Thuế suất 5% | Nước sạch, phân bón, thuốc trừ sâu, nông sản chưa chế biến, thuốc và thiết bị y tế, đồ dùng giảng dạy, sách và đồ chơi trẻ em, dịch vụ khoa học công nghệ, nhà ở xã hội... | Luật 48/2024/QH15, Điều 9 khoản 2 | 01/07/2025 | 🟨 B |
| Thuế suất 10% (phổ thông) | Hàng hóa, dịch vụ còn lại | Luật 48/2024/QH15, Điều 9 khoản 3 | 01/07/2025 | 🟨 B |
| Không chịu thuế | Nông sản chưa chế biến, giống, thức ăn chăn nuôi, muối, chuyển nhượng quyền sử dụng đất, bảo hiểm, tài chính-ngân hàng-chứng khoán, y tế, giáo dục, vận tải công cộng, xuất bản... | Luật 48/2024/QH15, Điều 5 | 01/07/2025 | 🟨 B |

Ghi chú về mức B: trang toàn văn luật bị cắt nên không đọc được nguyên văn Điều 9. Số liệu 0/5/10% lấy từ bản tóm tắt tự động. Nghị quyết 204/2025 trích nguyên văn "khoản 3 Điều 9" cho nhóm 10%, nên cấu trúc điều khoản này khá chắc. Danh mục chi tiết nhóm 5% chưa kiểm tra.

Link đã đọc: https://luatvietnam.vn/thue/luat-thue-gia-tri-gia-tang-2024-so-48-2024-qh15-379409-d1.html

### 1.2 Giảm thuế GTGT tạm thời (10% xuống 8%)

| Tham số | Giá trị | Văn bản | Hiệu lực | Mức |
|---|---|---|---|---|
| Mức giảm | Giảm 2 điểm %: nhóm 10% còn **8%** | Nghị quyết 204/2025/QH15 (thông qua 17/06/2025), Điều 1 | **01/07/2025 đến hết 31/12/2026** (Điều 2) | ✅ A |
| Văn bản hướng dẫn | Nghị định 174/2025/NĐ-CP (30/06/2025), cùng thời hạn | | 01/07/2025 đến hết 31/12/2026 | ✅ A |
| Loại trừ | Viễn thông; tài chính, ngân hàng, chứng khoán, bảo hiểm; bất động sản; sản phẩm kim loại; sản phẩm khai khoáng (trừ than); hàng chịu thuế TTĐB (trừ xăng). Hàng đang 5% hoặc miễn thuế thì không giảm thêm. | NQ 204 Điều 1; NĐ 174 Phụ lục I, II | | ✅ A |
| Cách áp dụng | DN khấu trừ: 8%. Hộ và DN nộp theo tỷ lệ % trên doanh thu: giảm 20% tỷ lệ khi lập hóa đơn. | NĐ 174 Điều 1 khoản 2 | | ✅ A |

- **Chưa thấy văn bản nào gia hạn hoặc thay thế sau 31/12/2026.** Đã kiểm tra Luật 09/2026, bài tổng hợp ngày 10/11/2026 và danh sách văn bản thuế ngày 12/10/2026. Không có.
- Suy luận (không phải sự kiện đã xác nhận): nếu không có văn bản mới, từ 01/01/2027 nhóm này quay về 10%. Cần tra lại gần cuối năm 2026.
- Lưu ý dễ nhầm: "Nghị quyết 43/2026/NQ-CP" (30/09/2026, kéo dài thuế bảo vệ môi trường và GTGT cho xăng dầu đến 31/12/2026) là văn bản khác, không phải giảm 2% này. Nó trùng số 43/2026 với Nghị quyết 43/2026/QH16 về giảm thuế TNDN (mục 3.4). Đừng lẫn.

Link đã đọc:
- https://luatvietnam.vn/thue/nghi-quyet-204-2025-qh15-cua-quoc-hoi-ve-giam-thue-gia-tri-gia-tang-403956-d1.html
- https://luatvietnam.vn/thue/nghi-dinh-174-2025-nd-cp-chinh-sach-giam-thue-gtgt-theo-nghi-quyet-204-2025-qh15-404331-d1.html

### 1.3 Ngưỡng miễn GTGT của hộ và cá nhân kinh doanh

Chuỗi thay đổi, mỗi bước đã đọc văn bản:

| Bước | Giá trị | Văn bản | Hiệu lực | Mức |
|---|---|---|---|---|
| 1 | 200 triệu/năm | Luật 48/2024/QH15, Điều 5 khoản 25 (ban đầu) | 01/07/2025 | ✅ A |
| 2 | 500 triệu/năm | Luật 149/2025/QH15 (thông qua 11/12/2025), Điều 1 khoản 1(b) | 01/01/2026 | ✅ A |
| 3 | Bỏ số cố định, giao Chính phủ quy định | Luật 09/2026/QH16 (24/04/2026), Điều 2 sửa khoản 25 Điều 5 | Điều 1-3 có hiệu lực 01/01/2026 | ✅ A |
| 4 | **1 tỷ đồng/năm** | Nghị định 141/2026/NĐ-CP (29/04/2026), Điều 1 khoản 1: đổi "500 triệu" thành "01 tỷ" tại Điều 3, 4, khoản 1 Điều 8, Điều 9 của NĐ 68/2026 | 01/01/2026 (Điều 3) | ✅ A |

Chỗ còn suy luận: chưa đọc Điều 3 và 4 của NĐ 68/2026. Việc hai điều này là điều miễn GTGT và TNCN chỉ suy ra từ cách sửa. Một số bài báo (kể cả bài ngày 25/05/2026) vẫn ghi 500 triệu. Đó là bài cũ trước NĐ 141.

Link đã đọc:
- https://luatvietnam.vn/thue/nghi-dinh-141-2026-nd-cp-sua-doi-chinh-sach-thue-cho-ho-kinh-doanh-va-ca-nhan-kinh-doanh-433387-d1.html
- https://luatvietnam.vn/thue/luat-thue-gia-tri-gia-tang-sua-doi-2025-so-149-2025-qh15-421739-d1.html
- https://luatvietnam.vn/thue/luat-thue-sua-doi-2026-so-09-2026-qh16-434729-d1.html

---

## 2. Thuế TNCN

Luật Thuế TNCN số **109/2025/QH15**, thông qua 10/12/2025.

**Hiệu lực** (Điều 29, nguyên văn, ✅ A):
- Chung: **01/07/2026**.
- Riêng thu nhập từ kinh doanh và tiền lương, tiền công của cá nhân cư trú: áp dụng từ **kỳ tính thuế năm 2026**.
- Luật 2007 hết hiệu lực phần tiền lương và kinh doanh từ kỳ tính thuế 2026, phần còn lại từ 01/07/2026.

Luật 09/2026/QH16 chỉ sửa một chỗ trong luật TNCN: khoản 1 Điều 7 (ngưỡng doanh thu của hộ kinh doanh, xem mục 1.3 và 4). Biểu thuế, giảm trừ gia cảnh và các thuế suất khác **không đổi**.

Link toàn văn đã đọc: https://luatvietnam.vn/thue/luat-thue-thu-nhap-ca-nhan-2025-so-109-2025-qh15-422733-d1.html

### 2.1 Biểu thuế lũy tiến từng phần, thu nhập từ tiền lương, tiền công của cá nhân cư trú (✅ A)

Điều 9 khoản 2, áp dụng cho thu nhập tính thuế theo Điều 8 khoản 2.

| Bậc | Thu nhập tính thuế/tháng | Thu nhập tính thuế/năm | Thuế suất |
|---|---|---|---|
| 1 | đến 10 triệu | đến 120 triệu | 5% |
| 2 | trên 10 đến 30 triệu | trên 120 đến 360 triệu | 10% |
| 3 | trên 30 đến 60 triệu | trên 360 đến 720 triệu | 20% |
| 4 | trên 60 đến 100 triệu | trên 720 đến 1.200 triệu | 30% |
| 5 | trên 100 triệu | trên 1.200 triệu | 35% |

Thu nhập tính thuế = tổng thu nhập từ lương trừ các khoản BHXH, BHYT, BHTN bắt buộc, bảo hiểm nghề nghiệp bắt buộc, quỹ hưu trí và bảo hiểm tự nguyện (trong trần Chính phủ quy định), trừ giảm trừ gia cảnh.

### 2.2 Giảm trừ gia cảnh (✅ A)

| Khoản | Mức | Văn bản | Hiệu lực |
|---|---|---|---|
| Bản thân người nộp thuế | **15,5 triệu/tháng** (186 triệu/năm) | Luật 109/2025 Điều 10 khoản 1a; Nghị quyết 110/2025/UBTVQH15 (17/10/2025) | 01/01/2026, từ kỳ tính thuế 2026 |
| Mỗi người phụ thuộc | **6,2 triệu/tháng** | Luật 109/2025 Điều 10 khoản 1b; NQ 110/2025 | 01/01/2026 |

- Luật không ghi con số theo năm cho người phụ thuộc. 74,4 triệu/năm là phép nhân của tớ.
- Mức cũ (11 triệu và 4,4 triệu) bị NQ 110 thay thế (NQ 110 bãi bỏ NQ 954/2020).
- Điều 10 khoản 2: Chính phủ trình UBTVQH điều chỉnh khi giá cả biến động.

### 2.3 Thuế suất cố định các loại thu nhập khác của cá nhân cư trú (✅ A, Luật 109/2025)

| Loại thu nhập | Thuế suất | Điều |
|---|---|---|
| Đầu tư vốn (cổ tức, lãi...) | 5% | 12 |
| Chuyển nhượng vốn (không phải chứng khoán) | 20% thu nhập tính thuế; nếu không xác định được chi phí thì 2% giá bán | 13 |
| Chuyển nhượng chứng khoán | 0,1% giá bán | 13 khoản 2 |
| Chuyển nhượng bất động sản | 2% giá bán | 14 |
| Trúng thưởng | 10% | 15 |
| Bản quyền | 5% | 16 |
| Nhượng quyền thương mại | 5% | 17 |
| Thừa kế, quà tặng | 10% | 18 |
| Thu nhập khác (tên miền .vn, tín chỉ carbon, biển số đấu giá) | 5% | 19 |
| Tài sản số, vàng miếng (chuyển nhượng) | 0,1% giá chuyển nhượng | 19 |

Ngưỡng miễn từng loại (ví dụ trúng thưởng, quà tặng) chưa ghi lại. Cần đọc từng Điều khi cần.

### 2.4 Cá nhân không cư trú (✅ A)

| Loại | Thuế suất | Điều |
|---|---|---|
| Tiền lương, tiền công | 20% tổng thu nhập, không phân biệt nơi trả | 21 |
| Kinh doanh, doanh thu nhân tỷ lệ | 1% hàng hóa; 5% dịch vụ, xây dựng không bao thầu nguyên vật liệu; 2% sản xuất, vận tải, xây dựng có bao thầu; 5% nội dung số; 2% khác | 20 |
| Đầu tư vốn | 5% | 22 |
| Chuyển nhượng vốn | 20% (2% nếu không rõ chi phí; 0,1% chứng khoán) | 23 |
| Chuyển nhượng tài sản | 2% | 24 |
| Bản quyền, nhượng quyền | 5% | 25 |
| Trúng thưởng, thừa kế, quà tặng | 10% | 26 |

### 2.5 Giảm thuế tạm thời 2026-2027

Nghị quyết 43/2026/QH16 và Nghị định 398/2026/NĐ-CP (29/10/2026): giảm 30% thuế TNCN và TNDN phải nộp kỳ 2026 và 2027 cho đối tượng có doanh thu năm không quá 10 tỷ đồng. Xem mục 3.4. Mức **🟨 B**, chưa đọc văn bản.

---

## 3. Thuế TNDN

Luật Thuế TNDN số **67/2025/QH15**, ban hành 14/06/2025. Hiệu lực **01/10/2025**, áp dụng từ kỳ tính thuế 2025 (Điều 19, nguyên văn, ✅ A).

Link toàn văn đã đọc: https://luatvietnam.vn/thue/luat-thue-thu-nhap-doanh-nghiep-2025-so-67-2025-qh15-404386-d1.html

### 3.1 Thuế suất (Điều 10, ✅ A)

| Đối tượng | Thuế suất |
|---|---|
| Phổ thông | **20%** |
| Tổng doanh thu năm không quá 3 tỷ đồng | **15%** |
| Tổng doanh thu năm trên 3 tỷ đến không quá 50 tỷ đồng | **17%** |
| Tìm kiếm, thăm dò, khai thác dầu khí | 25% đến 50% (Thủ tướng quyết định theo từng hợp đồng) |
| Tài nguyên quý hiếm (bạch kim, vàng, bạc, thiếc, wolfram, antimon, đá quý, đất hiếm...) | 50%; mỏ có ít nhất 70% diện tích ở địa bàn khó khăn: 40% |

- Doanh thu để xét bậc 15% và 17% là tổng doanh thu của **kỳ tính thuế liền trước**. Cách xác định chi tiết do Chính phủ quy định.
- **Đính chính:** một bài của MISA ghi "17% cho doanh thu trên 3 đến 5 tỷ". Sai. Nguyên văn luật là trên 3 đến 50 tỷ.
- 40-50% không phải thuế suất khai khoáng chung. Chỉ áp dụng cho tài nguyên quý hiếm. Khai khoáng thông thường không có quy định riêng trong Điều 10, nên rơi vào 20%.
- Điều 18 khoản 3: thuế suất 15% và 17% không áp dụng cho một số thu nhập, gồm chuyển nhượng vốn và bất động sản (đọc qua tóm tắt, chưa nguyên văn).
- Điều 5: kỳ tính thuế là năm dương lịch hoặc năm tài chính do doanh nghiệp chọn.

### 3.2 Ưu đãi (Điều 12-15, ✅ A cho tiêu đề điều khoản, chi tiết điều kiện chưa đọc hết)

| Ưu đãi | Nội dung | Điều |
|---|---|---|
| Thuế suất 10% trong 15 năm | Dự án mới thuộc ngành, địa bàn ưu đãi cao | 13 khoản 1 |
| Thuế suất 10% (thời gian không ghi trong điều khoản) | Một số ngành, địa bàn khác | 13 khoản 2 |
| Thuế suất 15% | Chế biến nông sản và một số ngành ngoài địa bàn ưu đãi | 13 khoản 3 |
| Thuế suất 17% trong 10 năm | Dự án mới: sản xuất, ô tô, hỗ trợ DNNVV; địa bàn khó khăn; khu kinh tế ngoài địa bàn ưu đãi | 13 khoản 4 |
| Thuế suất 17% | Quỹ tín dụng nhân dân, tổ chức tài chính vi mô, ngân hàng hợp tác xã | 13 khoản 5 |
| Miễn tối đa 4 năm, giảm 50% tối đa 9 năm tiếp | Áp dụng cho dự án hưởng 10%/15 năm | 14 khoản 1 |
| Miễn tối đa 2 năm, giảm 50% tối đa 4 năm tiếp | Áp dụng cho dự án hưởng 17%/10 năm | 14 khoản 2 |
| Miễn thuế 2 năm liên tục | DN thuộc nhóm 15% hoặc 17% thành lập mới từ hộ kinh doanh, tính từ khi có thu nhập chịu thuế | 15 khoản 4 |

Ngành ưu đãi (Điều 12 khoản 2) gồm phần mềm, an ninh mạng, bán dẫn, trung tâm dữ liệu; năng lượng tái tạo, môi trường; hạ tầng; công nghệ cao; dự án sản xuất vốn từ 12.000 tỷ đồng; sản xuất, lắp ráp ô tô; trồng rừng; nhà ở xã hội; xuất bản, báo chí; hợp tác xã nông nghiệp...

**Chưa xác minh:** câu "thuế suất 10% suốt đời" mà đề bài nhắc. Điều 13 khoản 2 không ghi thời hạn. Cần xem công báo hoặc Nghị định 320/2025 để biết có thời hạn hay không.

### 3.3 Thay đổi 2026 của luật TNDN

Luật 09/2026/QH16, Điều 3 (✅ A): thêm khoản 14a vào Điều 4 Luật 67/2025. Thu nhập của DN, tổ chức có tổng doanh thu năm **từ mức Chính phủ quy định trở xuống** được miễn thuế TNDN. Hiệu lực **01/01/2026**.

- Luật không ghi con số. Một bài einvoice nói mức là "1 tỷ" theo NĐ 141/2026 (sửa NĐ 320/2025). Chỉ đọc được tóm tắt, **❌ C**, chưa xác minh.
- Luật 09/2026 không sửa Điều 10, nên các thuế suất 20%/17%/15% giữ nguyên.

### 3.4 Giảm 30% thuế TNDN 2026-2027 (🟨 B)

- Nghị quyết 43/2026/QH16: giảm 30% số thuế TNDN phải nộp của kỳ tính thuế 2026 và 2027 cho doanh nghiệp có doanh thu năm của chính năm 2026 hoặc 2027 **không quá 10 tỷ đồng**. Hiệu lực theo bài báo: 24/08/2026.
- Nghị định 398/2026/NĐ-CP (29/10/2026) hướng dẫn. Doanh nghiệp có ưu đãi thì tính 30% trên số thuế sau ưu đãi. Vượt 10 tỷ trong năm thì phải nộp phần chênh.
- Căn cứ khác với Điều 10: ở đây xét doanh thu **năm hiện hành**, không phải năm trước.
- Chỉ đọc bài báo. Phạm vi (chỉ TNDN, hay cả TNCN hộ kinh doanh) bài báo và tóm tắt nói không thống nhất: một bài nêu "giảm thuế TNCN, thuế TNDN năm 2026-2027", báo cáo khác nói NĐ 398 giảm 30% TNCN cho hộ kinh doanh doanh thu đến 10 tỷ. Cần đọc văn bản.

Link đã đọc: https://luatvietnam.vn/tin-van-ban-moi/da-co-nghi-quyet-43-2026-qh16-giam-thue-tncn-thue-tndn-nam-2026-2027-186-112004-article.html và https://einvoice.vn/tin-tuc/nghi-dinh-398-2026-giam-thue

### 3.5 Chưa đọc

- Nghị định 320/2025/NĐ-CP (15/12/2025), hướng dẫn Luật TNDN. Bản PDF là ảnh quét, không đọc được.
- Điều 20 (chuyển tiếp) của Luật 67/2025.

---

## 4. Thuế hộ kinh doanh và thuế khoán

**Toàn bộ mục này chỉ có B**, trừ ngưỡng 1 tỷ (✅ A, mục 1.3) và các tỷ lệ cơ bản trong Luật 109/2025 Điều 7 (✅ A). Nghị định 68/2026 chưa đọc được toàn văn (PDF là ảnh quét, thuvienphapluat bị chặn).

### 4.1 Bỏ thuế khoán

- Từ **01/01/2026**, hộ và cá nhân kinh doanh không còn nộp thuế khoán và không còn lệ phí môn bài. Chuyển sang tự kê khai, tự nộp. 🟨 B.
- Căn cứ theo einvoice: Nghị quyết 198/2025/QH15, Điều 10. Chưa đọc văn bản này. Agent kiểm tra GTGT không tìm thấy Nghị quyết 198 trong nguồn nào của họ. Cần xác nhận số hiệu.
- Văn bản hướng dẫn: **Nghị định 68/2026/NĐ-CP** (05/03/2026, hiệu lực từ ngày ký), **Thông tư 18/2026/TT-BTC** (05/03/2026), **Nghị định 141/2026/NĐ-CP** (29/04/2026) sửa NĐ 68, **Thông tư 50/2026/TT-BTC** (15/05/2026) sửa TT 18. Ngày ban hành lấy từ metadata trên einvoice.vn. 🟨 B.
- Hộ chuyển từ khoán không bị truy thu các năm trước, trừ trường hợp cố ý khai thiếu (theo sapo, một nguồn). 🟨 B.

### 4.2 Cách tính thuế (khung theo bài báo, chưa kiểm tra bằng văn bản)

Ngưỡng nhóm dưới đây là con số theo NĐ 68 gốc (500 triệu). Sau NĐ 141 ngưỡng miễn là 1 tỷ. **Chưa rõ** các mốc 500 triệu còn lại trong công thức (ví dụ phần doanh thu được trừ trước khi nhân tỷ lệ) có đổi theo hay không. ❌ C.

| Nhóm doanh thu năm | Cách tính | Mức |
|---|---|---|
| Đến ngưỡng miễn (1 tỷ theo NĐ 141) | Không chịu GTGT, không nộp TNCN. Vẫn phải thông báo doanh thu. | ✅ A (ngưỡng), 🟨 B (thủ tục) |
| Trên ngưỡng đến 3 tỷ | GTGT = tỷ lệ % theo ngành × doanh thu. TNCN chọn một trong hai: (1) tỷ lệ % × (doanh thu − phần miễn), hoặc (2) (doanh thu − chi phí) × **15%**. Chọn rồi phải giữ ít nhất 2 năm liên tiếp. | 🟨 B; 15% và các tỷ lệ % theo ngành TNCN: ✅ A (Luật 109 Điều 7) |
| Trên 3 tỷ đến 50 tỷ | Bắt buộc theo thu nhập: (doanh thu − chi phí) × **17%** | ✅ A (Luật 109 Điều 7) |
| Trên 50 tỷ | (doanh thu − chi phí) × **20%** | ✅ A (Luật 109 Điều 7) |

Một bài einvoice nói thuế suất trên 3 tỷ là "lũy tiến theo doanh thu". Bảng của chính bài đó và bài sapo đều ghi mức đồng nhất cho từng nhóm (17%, 20%), nên file này theo mức đồng nhất. Cần kiểm tra bằng văn bản.

**Tỷ lệ % trên doanh thu theo ngành:**

| Ngành | TNCN (✅ A, Luật 109 Điều 7) | GTGT (🟨 B) |
|---|---|---|
| Phân phối, cung cấp hàng hóa | 0,5% | 1% |
| Sản xuất, vận tải, dịch vụ gắn với hàng hóa; xây dựng có bao thầu nguyên vật liệu | 1,5% | 3% |
| Dịch vụ; xây dựng không bao thầu nguyên vật liệu | 2% | 5% |
| Cho thuê tài sản; đại lý bảo hiểm, xổ số, bán hàng đa cấp | 5% | 5% |
| Nội dung thông tin số (giải trí, game, phim, nhạc, quảng cáo số) | 5% | 5% |
| Cho thuê bất động sản (trừ lưu trú) | 5% | 5% |
| Ngành khác | 1% | 2% |

### 4.3 Chi phí được trừ (🟨 B, NĐ 68 Điều 6)

- Được trừ: nguyên vật liệu, hàng hóa; lương, phụ cấp và bảo hiểm bắt buộc của người làm thuê; khấu hao theo quy định DN; dịch vụ mua ngoài (điện, nước, viễn thông, vận chuyển, thuê tài sản, sửa chữa); lãi vay theo lãi suất thực tế của tổ chức tín dụng; chi phí hợp lý khác.
- Không được trừ: chi phí không phục vụ kinh doanh; chi phí không có hóa đơn hợp lệ; lương của chủ hộ và thành viên hộ (trừ bảo hiểm bắt buộc); tiền phạt; chi tiêu cá nhân gia đình.
- Thanh toán từ 5 triệu trở lên phải không dùng tiền mặt.

### 4.4 Hóa đơn điện tử và sổ sách (🟨 B)

- Doanh thu từ 1 tỷ trở lên: bắt buộc dùng hóa đơn điện tử có mã của cơ quan thuế (NĐ 68 Điều 8 khoản 5a). Một bài ghi "từ 1 tỷ trở lên", một bảng ghi "trên 1 tỷ". Chưa rõ.
- Kê khai quý nếu doanh thu dưới 50 tỷ; kê khai tháng nếu từ 50 tỷ trở lên.

---

## 5. Lương tối thiểu vùng

| Vùng | Tháng (đồng) | Giờ (đồng) | Mức cũ (NĐ 74/2024) |
|---|---|---|---|
| I | **5.310.000** | 25.500 | 4.960.000 |
| II | **4.730.000** | 22.700 | 4.410.000 |
| III | **4.140.000** | 20.000 | 3.860.000 |
| IV | **3.700.000** | 17.800 | 3.450.000 |

- Văn bản: **Nghị định 293/2025/NĐ-CP**, hiệu lực **01/01/2026**, thay Nghị định 74/2024/NĐ-CP.
- Mức: **🟨 B**. Hai nguồn nhất quán: Báo Pháp luật (10/11/2025) và các bài trên thuvienphapluat. Chưa đọc được nguyên văn nghị định (thuvienphapluat trả lỗi 403).
- Quy tắc áp vùng: doanh nghiệp áp dụng mức của nơi đặt trụ sở hoặc chi nhánh. Khu công nghiệp nằm ở nhiều vùng thì lấy mức cao nhất. Bảng phân vùng theo xã/phường sau sáp nhập (34 tỉnh thành) **chưa lấy được**. ❌ C.
- **Sắp thay đổi:** Hội đồng Tiền lương quốc gia họp ngày 16/07/2026 thống nhất đề xuất Chính phủ tăng bình quân **7,8% từ 01/01/2027**, tương đương tăng khoảng 310.000 đến 390.000 đồng/tháng tùy vùng. Bộ Nội vụ đã đưa vào dự thảo nghị định (23/07/2026). Bài ngày 21/09/2026 nói Bộ Nội vụ sẽ trình Chính phủ. **Chưa thấy nghị định ban hành.** 🟨 B, chỉ là đề xuất.

Link đã đọc: https://baophapluat.vn/chinh-phu-quyet-dinh-tang-luong-toi-thieu-vung-tu-1-1-2026.html

### 5.1 Lương cơ sở và mức tham chiếu (liên quan trần đóng bảo hiểm)

- **Lương cơ sở 2.530.000 đồng/tháng** từ 01/07/2026. Nghị định 161/2026/NĐ-CP (15/05/2026), Điều 3 khoản 2 và Điều 6. Thay mức 2.340.000 của NĐ 73/2024. ✅ A.
- Nghị định này áp dụng cho cán bộ, công chức, viên chức, lực lượng vũ trang.
- **Luật BHXH 2024 dùng "mức tham chiếu", không dùng "lương cơ sở"** để tính trần và sàn đóng. Việc mức tham chiếu bằng 2,53 triệu chỉ thấy trong một bài báo, chưa kiểm chứng trong luật. ❌ C. Nếu bằng nhau, trần đóng BHXH và BHYT là 20 × 2.530.000 = 50.600.000 đồng/tháng (phép nhân của tớ, chưa xác minh).
- Trần đóng BHTN khác: tối đa 20 lần **lương tối thiểu vùng** (Luật Việc làm 2025 Điều 34 khoản 2, ✅ A).

---

## 6. Lãi suất điều hành NHNN

### 6.1 Lãi suất điều hành

Nguồn: bảng lãi suất chính thức tại https://sbv.gov.vn/en/l%C3%A3i-su%E1%BA%A5t1 (đọc ngày 12/11/2026). ✅ A (trang chính thức của NHNN).

| Tham số | Giá trị | Văn bản (theo bảng NHNN) |
|---|---|---|
| Lãi suất tái cấp vốn | **4,5%/năm** | Quyết định 1123/QĐ-NHNN, ngày 16/06/2023 |
| Lãi suất tái chiết khấu | **3,0%/năm** | Quyết định 1123/QĐ-NHNN, ngày 16/06/2023 |

- Bảng ghi "ngày áp dụng" 19/03/2023, sớm hơn ngày ký quyết định 16/06/2023. Trang không giải thích.
- Không tìm thấy quyết định nào năm 2024-2026 thay đổi hai mức này. Nhưng agent đọc trang không có công cụ tìm kiếm nên kết luận này chỉ dựa trên bảng chính thức và các trang đã đọc.
- Lãi suất cho vay qua đêm trong thanh toán điện tử liên ngân hàng: banker.vn (🟨 B) ghi **5%/năm** theo "Quyết định 1606/QĐ-NHNN ngày 25/09/2024". Bảng NHNN không có dòng này. Một bài của chính NHNN lại cho thấy số 1606/QĐ-NHNN thuộc quyết định ngày 22/09/2022. **❌ C: chưa xác minh**, số hiệu quyết định có vẻ bị gán sai.
- Lãi suất liên ngân hàng bình quân ngày 10/11/2026 (bảng chính thức NHNN): qua đêm 4,40%; 1 tuần 4,74%; 2 tuần 5,06%; 1 tháng 5,66%; 3 tháng 6,41%. Kỳ hạn 6 và 9 tháng khối lượng rất mỏng, không dùng.
- Trần lãi suất huy động và trần lãi suất cho vay ngắn hạn ưu tiên: **❌ C, không tìm được số hiện hành**. Số gần nhất đọc được là tháng 10/2022 (trần huy động VND 1,0% không kỳ hạn/dưới 1 tháng và 6,0% từ 1 đến dưới 6 tháng; trần cho vay ưu tiên 5,5%), đã cũ. Không dùng.
- Bối cảnh (🟨 B): ngày 22/10/2026 NHNN yêu cầu các ngân hàng thương mại giảm tối thiểu 0,5%/năm lãi suất huy động bình quân kỳ hạn từ 6 tháng trở lên trong các tháng cuối 2026. Mục tiêu lạm phát bình quân 2026 khoảng 4,5%.

### 6.2 Tỷ lệ dự trữ bắt buộc

**Khung pháp lý (✅ A):**

- Thông tư 30/2019/TT-NHNN (27/12/2019), hiệu lực 01/03/2020, và văn bản hợp nhất 18/VBHN-NHNN (19/08/2025).
- Điều 6 khoản 1: **Thống đốc NHNN quyết định** tỷ lệ dự trữ bắt buộc cho từng loại hình tổ chức tín dụng và từng loại tiền gửi. **Thông tư không ghi con số nào.** Khoản 2: Thống đốc quyết định lãi suất tiền gửi dự trữ bắt buộc và tiền gửi vượt dự trữ.
- Thông tư 23/2025/TT-NHNN (12/08/2025), hiệu lực **01/10/2025**, Điều 2 thay Điều 7: giảm **50%** tỷ lệ dự trữ bắt buộc, trên mọi loại tiền gửi, cho (1) tổ chức tín dụng hỗ trợ và (2) tổ chức tín dụng nhận chuyển giao bắt buộc ngân hàng bị kiểm soát đặc biệt, theo phương án được phê duyệt.
- Ngân hàng chính sách thuộc nhóm **không** thực hiện dự trữ bắt buộc (Điều 3 khoản 4, thêm bởi TT 23/2025).
- Áp dụng thực tế (🟨 B, Vietnamfinance 15/02/2026): Vietcombank, MB, VPBank, HDBank được giảm 50%.

**Con số tỷ lệ: ❌ C, chưa xác minh được.** Quyết định của Thống đốc quy định tỷ lệ chưa lấy được (số hiệu và ngày cũng chưa biết). Chỉ có hai dấu vết yếu:

- Một snippet tìm kiếm (không rõ ngày) ghi tiền gửi VND không kỳ hạn và dưới 12 tháng **3%**, từ 12 tháng trở lên **1%**, ngoại tệ từ 12 tháng trở lên **6%**.
- Một ví dụ minh họa "giả sử" trong bản tóm tắt tự động của TT 30 có 3% / 1% / 8% / 6%. Đó là ví dụ minh họa, không phải quy định.

Các số 3% / 1% / 8% / 6% khớp với những gì tớ nhớ, nhưng đó là trí nhớ, không phải xác minh. **Đừng đưa vào config khi chưa tìm được quyết định của Thống đốc.**

Cũng **chưa biết** lãi suất NHNN trả cho tiền gửi dự trữ bắt buộc.

---

## 7. BHXH, BHYT, BHTN, TNLĐ-BNN

Tỷ lệ tính trên tiền lương làm căn cứ đóng. Khung chung ghi trong từng điều luật; các tỷ lệ dưới đây áp dụng cho người lao động Việt Nam có hợp đồng lao động thông thường (Điều 2 khoản 1 các điểm a, b, c, d, i, k, l và khoản 2).

| Quỹ | Người lao động | Doanh nghiệp | Văn bản | Hiệu lực | Mức |
|---|---|---|---|---|---|
| BHXH, hưu trí và tử tuất | **8%** | **14%** | Luật BHXH 41/2024/QH15, Điều 33 khoản 1a; Điều 34 khoản 1b | 01/07/2025 | ✅ A |
| BHXH, ốm đau và thai sản | 0% | **3%** | Điều 34 khoản 1a | 01/07/2025 | ✅ A |
| TNLĐ-BNN | 0% | **0,5%** (mức thông thường; 0,3% nếu đủ điều kiện, tối đa 36 tháng) | Nghị định 58/2020/NĐ-CP, Điều 4 | 15/07/2020 | ✅ A (có thể đã sửa, xem dưới) |
| BHYT | **1,5%** | **3%** (tổng 4,5%) | Luật BHYT 51/2024/QH15 Điều 13 (trần luật định); số 4,5% theo bài báo trích Nghị định 188/2025/NĐ-CP | 01/07/2025 | 🟨 B |
| BHTN | **1%** | **1%** | Luật Việc làm 74/2025/QH15, Điều 33 khoản 1 | 01/01/2026 | ✅ A (với chú thích) |
| **Tổng** | **10,5%** | **21,5%** | cộng các dòng trên | | 🟨 B (do có BHYT) |

Giải thích các chỗ vênh:

- **BHYT:** Luật 51/2024 Điều 13 ghi mức đóng **"tối đa bằng 6% tiền lương tháng"**, trong đó người sử dụng lao động hai phần ba và người lao động một phần ba. Nó không ghi 4,5%. Mức 4,5% (1,5% + 3%) là con số vận hành lâu nay và được một bài báo trích từ Nghị định 188/2025/NĐ-CP, nhưng chưa đọc nghị định. Cần xác nhận.
- **BHTN:** Luật Việc làm ghi người lao động đóng **"tối đa 1%"**, doanh nghiệp **"tối đa 1%"**, Nhà nước hỗ trợ **tối đa 1% quỹ tiền lương**. Mức 1%/1% là mức thực tế theo hướng dẫn. Nghị định 374/2025/NĐ-CP hướng dẫn BHTN chưa đọc.
- **TNLĐ-BNN:** Luật BHXH 2024 Điều 4 khoản 2đ giao bảo hiểm này cho Luật An toàn, vệ sinh lao động. Trang NĐ 58/2020 cho biết nghị định đã bị sửa bởi NĐ 158/2025/NĐ-CP (chưa đọc). Một tiêu đề báo nói có thể giảm xuống 0,3% đến 2027, đánh dấu "dự kiến", **chưa xác nhận**. Giữ 0,5% làm mặc định và ghi chú rủi ro.
- **Trần và sàn tiền lương đóng:** BHXH và BHYT cao nhất 20 lần mức tham chiếu (Luật BHXH Điều 31, Luật BHYT Điều 14 khoản 5). Xem mục 5.1 về việc mức tham chiếu có bằng lương cơ sở hay không. BHTN cao nhất 20 lần lương tối thiểu vùng.
- **Kinh phí công đoàn** 2% quỹ lương đóng BHXH do doanh nghiệp trả: chỉ thấy trong bài báo (🟨 B), chưa kiểm tra văn bản.
- **Các nhóm khác:** quân nhân, người lao động ở nước ngoài, chủ hộ kinh doanh, người tham gia tự nguyện đóng 22% vào quỹ hưu trí (Điều 33 khoản 2-4, Điều 32 khoản 2) có công thức khác. Ghi lại cho GĐ2:
  - Chủ hộ kinh doanh có đăng ký tham gia: 3% ốm đau thai sản + 22% hưu trí (Điều 33 khoản 4). Mức lương chọn trong khoảng sàn đến trần.
  - Lao động nước ngoài hợp đồng từ 12 tháng thuộc diện bắt buộc (Điều 2 khoản 2). Việc có đóng BHTN không đọc được, bỏ qua.

Link đã đọc (đều là bản sao toàn văn trên luatvietnam.vn):
- https://luatvietnam.vn/lao-dong/luat-bao-hiem-xa-hoi-2024-so-41-2024-qh15-360809-d1.html
- https://luatvietnam.vn/lao-dong/luat-viec-lam-2025-so-74-2025-qh15-405176-d1.html
- https://luatvietnam.vn/lao-dong/luat-bao-hiem-y-te-sua-doi-2024-so-51-2024-qh15-377843-d1.html
- https://luatvietnam.vn/lao-dong/nghi-dinh-58-2020-nd-cp-muc-dong-bao-hiem-tai-nan-benh-nghe-nghiep-183928-d1.html
- https://luatvietnam.vn/lao-dong/nghi-dinh-161-2026-nd-cp-quy-dinh-muc-luong-co-so-va-che-do-tien-thuong-cho-can-bo-cong-chuc-434784-d1.html

Dự thảo (chưa ban hành): một tiêu đề báo nói có dự thảo sửa Luật BHXH ngày 21/10/2026, dự kiến hiệu lực 01/03/2027. 🟨 B, chưa đọc.

---

## 8. Tổng hợp những gì còn treo

Theo thứ tự đáng lo:

1. **Tỷ lệ dự trữ bắt buộc.** Chưa có con số nào được xác minh. Cần quyết định của Thống đốc NHNN đang hiệu lực. Ảnh hưởng trực tiếp cơ chế nhân tiền gửi ở GĐ1.
2. **Thuế hộ kinh doanh.** Khung chung khá chắc (bỏ khoán, ngưỡng 1 tỷ, 15/17/20% theo nhóm). Nhưng toàn văn NĐ 68/2026 và TT 18/2026 chưa đọc, nên các tỷ lệ GTGT theo ngành và cách tính phần "trừ ngưỡng" khi ngưỡng đã đổi từ 500 triệu lên 1 tỷ đều là B hoặc C.
3. **Giảm 30% thuế 2026-2027 (NQ 43/2026/QH16, NĐ 398/2026).** Chỉ có bài báo. Phạm vi đối tượng bài báo nói không nhất quán. Cần đọc văn bản.
4. **Giảm GTGT 8%.** Hết 31/12/2026. Cần tra lại gần cuối năm xem có gia hạn không.
5. **Ngưỡng miễn TNDN theo khoản 14a mới.** Con số do Chính phủ quy định. "1 tỷ" chưa xác nhận.
6. **BHYT 4,5% và BHTN 1% là mức vận hành, luật chỉ ghi trần.** Cần đọc Nghị định 188/2025 và 374/2025.
7. **Mức tham chiếu có bằng lương cơ sở hay không** (quyết định trần 20 lần).
8. **Bảng phân vùng lương tối thiểu theo xã/phường** sau sáp nhập.
9. **Lương tối thiểu vùng 2027** (đề xuất 7,8%).
10. **Trần lãi suất huy động/cho vay ưu tiên hiện hành** và **lãi suất qua đêm** của NHNN.
11. **Nghị định 320/2025** (hướng dẫn Luật TNDN) và **Điều 9 nguyên văn của Luật GTGT 48/2024** (phần 0/5/10%).

**Đề nghị cho bước kiểm tra tiếp:** dùng trình duyệt thật (Chrome) mở thuvienphapluat.vn hoặc vbpl.vn để đọc được những trang đang bị chặn với công cụ tự động, hoặc cậu tải PDF các văn bản trên 11 mục này về thư mục research/.
