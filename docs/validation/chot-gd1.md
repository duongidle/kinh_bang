# Chốt GĐ1 (có điều kiện)

Ngày 15/11/2026. GĐ1 chốt là một nền kinh tế không tăng trưởng, không thêm cơ chế. File này thay cho báo cáo dài.

## Chưa kiểm

- **Kiểm định thống kê chưa chạy lại sau khi dời điểm tách nhánh sang tháng 240** (Dương quyết: không chạy lại). Số của các mục K1.x dưới đây là lượt trên code `dccfcc0` (tách nhánh ở tháng 120; `docs/validation/gd1.md`), cộng lần đo thử tách ở tháng 240 cho ba mục K1.22, K1.24, K1.26 (500 hộ, 20 seed; sai-khac.md D16). Các mục chạy đôi khác chưa có số đo ở điểm tách mới.
- `docs/validation/gd1.md` còn in ghi chú cũ của K1.22 và K1.26. Ghi chú trong `tests/validation/gd1-lib.ts` đã sửa.
- **chong-va-ngam.md chưa chạy cho mốc này.** Dương quyết 15/11/2026: dời sang đầu GĐ3. Bảng "Cần người soát" chưa được đi từng dòng.
- Lần chạy gốc (các mục không chạy đôi) vẫn bỏ 120 tháng đầu (`BURN = 120`), tức còn đo trong giai đoạn khởi động. Dời sang 240: GĐ1 update 1.
- Thời gian làm nóng trên máy yếu và điện thoại: chưa đo.

## (a) Đã biết là chưa đạt, và nơi sẽ sửa

Dùng luôn cho mục "Mô hình bỏ qua gì" trong game.

| Mục | Số đo | Vì sao | Sửa ở |
|---|---|---|---|
| K1.19: tăng lãi suất làm giảm tín dụng và lạm phát | 1/20 seed | Hộ không vay, nên lãi suất gần như không chạm cầu | GĐ3 (vay tiêu dùng, nhà đất) |
| K1.13: bất bình đẳng của cải tự hình thành | 500 hộ 20/20; 5.000 hộ 3/5 | Thiếu cơ chế tích tụ của cải. Kết quả phụ thuộc quy mô | GĐ3, GĐ4 |
| K1.28: tắt kỳ vọng làm lạm phát tắt nhanh hơn | 7/20 | Lương bám lạm phát quá khứ, không bám kỳ vọng | Chưa có nơi sửa; xét lại khi làm việc 8 |
| K1.29: niềm tin làm suy thoái sâu hơn | 14/20 | Đúng dấu nhưng nhỏ hơn nhiễu | Chưa có nơi sửa |
| K1.31: nâng mạnh lương tối thiểu | 10/20 | Lao động đồng nhất, lương tụm sát nhau | GĐ2 (kỹ năng) |
| K1.12: lạm phát cùng chiều chu kỳ | 500 hộ 12/20 (tham khảo); 5.000 hộ 4/5 | Chỉ xét ở 5.000 hộ | |
| Thất nghiệp 6-7% (Việt Nam khoảng 2%) | D11 | Đơn vị 2-5 người cắt rồi tuyển lại từng tháng | GĐ1 update 1 (việc 2) |
| Lạm phát gần 0, GDP đi ngang | gd1.md mục 14 | Không có tăng năng suất; tiền gần đứng yên | GĐ4 (mục tiêu hiệu chỉnh), việc 3 |
| Cú sốc cầu bị khuếch đại | Rút 0,8% GDP: GDP thực năm 5-7 thấp hơn 4,9%, sâu nhất 12,8% (D15, D16) | Không có bảo hiểm thất nghiệp, hộ không vay | GĐ2, GĐ3 |
| Tăng thuế vào giá trọn và ngay | K1.24: tỷ lệ chuyển 1,01 (0,66 đến 1,23) khi tách ở 240; bằng chứng khoảng 0,68 sau ngày đổi thuế | Đơn giản hoá tạm S36; chưa có tăng giá đón trước | GĐ1 update 1 (việc 8, 8b) |
| Giai đoạn khởi động 10-20 năm đầu (tín dụng bùng rồi vỡ) | D16 | Chưa biết nguyên nhân sâu | Che bằng làm nóng 240 tháng; tìm nguyên nhân ở GĐ1 update 1 |
| 11% mức đổi GDP danh nghĩa chưa gán lý do trong phân rã | Trần 0,15 trong chốt chặn | | GĐ1 update 1 (việc 6) |
| Nguồn ghi theo trí nhớ: 12 tham số, 6 chỗ trong luật | chốt chặn | | GĐ1 update 1 (việc 5), GĐ9 |
| Lãi suất cao gần như không hãm tín dụng | "Hai tay lái": dư nợ thấp hơn ở 6/10 seed | Cùng gốc với K1.19 | GĐ3 |

Mục tiêu tham khảo của lời giải mẫu đạt ở ít seed (không phải điều kiện qua): "Từ vạch xuất phát" 0/10, "Chủ xưởng" 0/10, "Cân ngân sách" thất nghiệp 2/10, "Hai tay lái" 3/10, "Tín dụng nóng" thất nghiệp 4/10, "Tăng lương tối thiểu" 4/10 và 4/10. Chưa xem mục tiêu có đạt được không. Việc của GĐ1.5 khi làm lại màn kịch bản.

## (b) Cần Dương soát

### 1. Bài học đổi sau khi dời điểm tách nhánh

Kiểm định kịch bản trên code `011f00d` (kịch bản chạy trước 240 tháng): 4 khẳng định hỏng. Đã viết lại theo số đo 10 seed; lượt chạy lại (cuối mục 4) qua hết.

- **"Hai tay lái": một bài học phụ bị đảo.** Câu cũ "lãi suất cao hãm tín dụng, đúng như sách" không đứng được: dư nợ thấp hơn ở 6/10 seed, hiệu nhỏ hơn nhiễu (năm 1: −1,35 ± 0,85%; năm 6: −6,1 ± 11,5%). Lời giải thích giờ nói thẳng lãi suất gần như không hãm được tín dụng trong mô hình này. **Bài học chính còn nguyên nhưng đổi thời điểm**: lạm phát cao hơn đối chứng khoảng 1 điểm ở năm 2-4 (10/10 seed), không phải "từ năm thứ năm"; năm 5-6 chênh lệch không còn rõ (+0,46 ± 0,87; +0,27 ± 0,80). Bội chi lớn hơn chỉ chắc ở năm đầu (+0,95 điểm, 10/10). Nợ công cao hơn: 10/10.
- **"Kéo vào lưới thuế", nhánh trả nợ**: "đổi lại, nợ công thấp hơn" chỉ còn 7/10 seed (bình quân −2,9%, từ −8,9% đến +0,7%). Đã bỏ khẳng định; lời giải thích nói không chắc. Mức mất thu nhập thực của khu vực phi chính thức: 5% khi giữ tiền, 3% khi chi lại (trước ghi 3% và 2%).
- **K1.22**: không còn "bật lên thành một chu kỳ dài". Tách ở 240 thì GDP thực năm 6-10 chỉ +0,5% (−10,7% đến +12,3%).
- **Ghi chú trong game "Tăng thuế vào giá nhanh và nhiều hơn thực tế" ("17 nước")**: tớ đối chiếu lại với bảng nguồn ở sai-khac.md D9 (17 nước khu vực đồng euro; 0,30 + 0,38 sau ngày đổi thuế) và số đo mới (1,01). Không thấy chỗ nào phải sửa nên để nguyên. Nếu cậu muốn sửa điều khác ở ghi chú này thì nói tớ.
- **"Hết hạn giảm thuế"**: lời giải thích còn ghi "khoảng một phần ba đi vào giá", sai từ S36. Đã sửa chữ; khẳng định không đổi.

Khẳng định qua với lề mỏng (đúng 8/10 ở lượt `011f00d`), coi là yếu: "Đánh thuế người giàu"/trả nợ "thất nghiệp cao hơn"; "Kéo vào lưới thuế"/trợ cấp hai mục (thu nhập thực phi chính thức, tiêu dùng thực); "Tăng lương tối thiểu" cả hai mục (ở seed 1 việc làm chính thức còn +5,2%).

### 2. `prewarm: 0` ở kịch bản giả `thu-cu-soc` (`tests/unit/session.test.ts`)

Test "control = shock" kiểm cơ chế thế giới đối chứng của Session, không kiểm kinh tế. Sau khi kịch bản chạy trước 240 tháng, nó đỏ ở seed 4, 50 hộ (chênh CPI 0,0018, ngưỡng 0,01; ba seed khác 0,030 đến 0,056). Người điều phối khai `prewarm: 0` cho riêng kịch bản giả này để nó chạy đúng thế giới như trước, trùng từng bit. Ngưỡng và seed không đổi. **Cái giá: cơ chế đối chứng không còn được test trên một thế giới đã làm nóng.** Cách khác nếu cậu không nhận: đổi seed hoặc ngưỡng (là sửa thước đo), hoặc thêm một test thứ hai có làm nóng.

### 3. S37, `gov.revenueUse` (sai-khac.md D14)

Thiết kế của người điều phối, cậu đặt yêu cầu nhưng chưa soát chi tiết.
- Kích hoạt khi người chơi hay thí nghiệm đổi một luật thuế. Thay đổi đã nằm sẵn trong luật (GTGT về 10% tháng 1/2027) không kích hoạt.
- Mốc: tỷ lệ thu thuế/GDP của 12 tháng trước lúc kích hoạt, giữ tới hết ván.
- Thu thêm mỗi tháng = (tỷ lệ 12 tháng gần nhất − mốc) × GDP tháng. Chi lại bằng một hệ số chung cho lương công chức, mua hàng, trợ cấp.
- Ba biến thể: `base` (thu thêm thì chi lại, hụt thu thì vay bù), `keep` (không chỉnh chi), `balanced` (hụt thu thì cắt chi).
- Bốn điều phải biết: mọi thay đổi của tỷ lệ thu/GDP sau khi kích hoạt đều bị coi là "thu thêm", kể cả do chu kỳ; kích hoạt trong 2026 thì lần GTGT về 10% cũng bị tính; chi lại là nâng lương công chức chứ không tuyển thêm; chi lại trễ dần trong một năm.
- "Ngoài đời Chính phủ làm vậy" ghi theo trí nhớ (mức C), chưa có văn bản dẫn.
- Chi lại chưa có mã lý do riêng trong chuỗi nhân quả; nó nằm chung trong lương công, mua hàng, trợ cấp.
- K1.24, K1.25, K1.26 khai `keep` để giữ cách đo đã duyệt.

### 4. Thay đổi `tests/unit` và khẳng định kịch bản từ mốc trưa 14/11 (`746b1cb`)

Danh sách đầy đủ kèm lý do: progress.md, mục "Thay đổi test và khẳng định từ trưa 14/11". Tóm tắt:

`tests/unit`:
- Sửa test cũ, cả hai ở `session.test.ts`: (1) "control = shock" thêm `prewarm: 0` (mục 2 ở trên); ngưỡng 0,01 đã về như gốc. (2) "bỏ một chính sách": assertion gốc đã hoàn lại theo yêu cầu của cậu, xanh nhờ S36.
- `scenario-options.test.ts`, test chuyển thuế: đảo vai hai thế giới vì mặc định giờ là chuyển trọn (S36); ý test giữ nguyên.
- Test mới, không sửa test cũ: `chot-chan.test.ts`, `prewarm.test.ts`, `revenue-use.test.ts`, các test phân rã, biến thể đối xứng và `lowerThanOptions` trong `scenario-options.test.ts`.

Khẳng định kịch bản (`src/content/scenarios.ts`):
- `thue-nguoi-giau`: làm lại thành ba nhánh (D10); nhánh trả nợ, khẳng định đầu tư đổi thành "thấp hơn cả hai cách chi lại" (cậu duyệt 15/11).
- `keo-vao-luoi-thue`: thêm ba nhánh; "thu nhập thực phi chính thức thấp hơn" đổi cửa sổ từ tháng 12 sang tháng 24; **15/11: bỏ "đổi lại, nợ công thấp hơn" ở nhánh trả nợ.**
- `hai-tay-lai`, **15/11**: bỏ "dư nợ thấp hơn"; "bội chi lớn hơn" đổi cửa sổ từ tháng 12 tới hết sang năm đầu; "lạm phát cao hơn" đổi cửa sổ từ năm 5-6 sang năm 2-4.
- `het-han-giam-thue`, `gia-luong-tien`, `can-ngan-sach`, `that-lung-buoc-bung`: chỉ đổi lời giải thích.
- `tests/validation/gd1-lib.ts`: K1.26 đo năm 2-4 (cậu duyệt); `FORK = 240`; chữ ghi chú K1.22, K1.26. Mỗi lần có dòng ở sai-khac.md mục F.

**Kết quả kiểm định kịch bản sau khi sửa** (code `bc3633c`, 10 seed, `docs/validation/scenarios.md`): không còn khẳng định nào không qua. "Hai tay lái": bội chi năm đầu 10/10, nợ công 10/10, lạm phát năm 2-4 10/10. Các khẳng định khác không đổi số seed so với lượt `011f00d`. Còn một chỗ lệch nhỏ chưa sửa: mô tả nhánh "Trả nợ" dùng chung cho hai kịch bản vẫn ghi "nợ công thấp dần"; đúng ở "Đánh thuế người giàu" (10/10), không chắc ở "Kéo vào lưới thuế".

## Chuyển sang GĐ1 update 1 (làm cùng GĐ3)

Việc 2, 3, 5, 6, 8, 8b như progress.md, cộng: dời `BURN` của lần chạy gốc sang 240; chạy lại kiểm định thống kê đầy đủ trên điểm tách mới; chạy chong-va-ngam.md (đầu GĐ3); mã lý do riêng cho phần chi lại của S37; tìm nguyên nhân giai đoạn khởi động.
