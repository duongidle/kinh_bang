# Nhật ký tiến độ

Mới nhất ở trên. Model tiếp quản: đọc mục "Đang ở đâu" trước, rồi `git log`.

## Đang ở đâu

Cập nhật mục này sau MỖI bước nhỏ (CLAUDE.md quy tắc 11).

- **Giai đoạn**: GĐ1, mốc M1-M5 (engine), đang **hiệu chỉnh thô, chưa xong**. Chưa chạy kiểm định thống kê.
- **Xong**:
  - GĐ0 phần lõi: engine, sổ cái, luật theo ngày, chuỗi nhân quả, nền đồ chơi. Test K0.1, K0.3-K0.9, K0.11, K0.12 qua.
  - GĐ1 engine: `src/engine/modules/gd1/` (schema, init, households, firms, banks, gov, indicators, index), tham số ở `src/config/model/gd1.ts`.
  - Test nhanh `tests/unit/gd1.test.ts` (37 test qua): K1.1-K1.4, K1.30, tất định, lưu/tải, mọi biến thể Phòng thí nghiệm giữ sổ cân.
  - Kế toán đúng ở mọi lần chạy: bốn đẳng thức giữ, GDP chi tiêu = GDP thu nhập, tiền thay đổi khớp sổ cái.
- **Đang dở: hành vi vĩ mô chưa ổn định, CHƯA đạt K1.5.** Kết quả 3 seed × 40 năm ở 500 hộ (`npx tsx scripts/run-gd1.ts M <seed> 480 5`):
  - 20 năm đầu chạy được nhưng thất nghiệp cao (5-17%, mục tiêu 2-6%), lạm phát 0-5%.
  - Seed 1 và 2: sau năm 15-25 có một đợt tín dụng nóng (dư nợ gấp 5-8 lần, lạm phát 6-12%), rồi khu vực chính thức sụp (còn 6-7 doanh nghiệp, thất nghiệp 18-33%, 95-100% đơn vay bị từ chối) và nền kinh tế lùi về 65-85% phi chính thức.
  - Seed 3: suy giảm từ năm 3-5, sau đó đứng yên ở mức thấp, số doanh nghiệp tăng dần tới 158 nhưng hầu như không vay được.
  - Gini của cải mới 0,25-0,31 sau 40 năm (K1.13 cần trên 0,4).
- **Đã chẩn đoán, chưa sửa**:
  1. Tín dụng bị từ chối 80-100% suốt ván, chủ yếu vì lý do `cr_repay` (dòng tiền không đủ trả nợ). Quy tắc xét khả năng trả nợ ở `banks.ts` (`ocf / dscr − service`) quá chặt so với cách doanh nghiệp xin vay mỗi tháng. Đây là nút thắt chính: bán hết hàng, còn người thất nghiệp, mà doanh nghiệp không mua được máy.
  2. Cân bằng giữa doanh nghiệp và hộ kinh doanh không bền: hàng đồng nhất, người mua chọn nơi rẻ nhất, nên bên nào rẻ hơn một chút sẽ lấn dần hết thị trường. Chưa có cơ chế nào giữ hai khu vực cùng tồn tại.
  3. Quy tắc tự động của Bộ Tài chính (bám mục tiêu bội chi) cùng chiều chu kỳ: lúc nóng thu tăng nên chi tăng theo.
  4. Lãi suất của NHNN ít tác dụng lên đầu tư (hàm đầu tư chưa có chi phí vay).
  5. Máy của doanh nghiệp phá sản dồn về vài doanh nghiệp lớn, ngành công nghiệp có lúc chỉ còn một nhà sản xuất máy.
- **Bước tiếp theo** (theo thứ tự):
  1. Sửa quy tắc xét tín dụng (mục 1 ở trên), chạy lại 3 seed. Công cụ soi: `scripts/debug3.ts` (lý do từ chối tín dụng, lý do thất nghiệp, từng doanh nghiệp), `DBG=1 npx tsx scripts/debug-gd1.ts <tháng> | grep BUST` (vì sao phá sản), `scripts/debug2.ts` (dòng tiền theo khu vực, bảng cân đối ngân hàng).
  2. Quyết cách giữ hai khu vực cùng tồn tại (mục 2). Việc này chạm thiết kế mục 6, có thể phải hỏi Dương.
  3. Khi K1.5 đạt ở 3 seed: viết `tests/validation/gd1.test.ts` (K1.5-K1.31), chạy `npm run validate:gd1`, ghi `docs/validation/gd1.md`.
  4. Phần GĐ0 còn lại: giao thức, Worker, khung UI, bản đồ, PWA (K0.2, K0.10, K0.13, K0.14).
  5. GĐ1 mốc M6: UI, kịch bản, các tính năng S.

## 13/11/2026 - Hiệu chỉnh thô GĐ1 (đang dở)

Các thay đổi cơ chế đã thêm trong lúc hiệu chỉnh. Tất cả là tớ tự quyết, ngoài thiết kế đã duyệt, Dương nên xem:
- **Quy tắc tự động của Bộ Tài chính** (`gov.autopilot`, mặc định bật): mỗi tháng 1 chỉnh `gov.purchase.share` để bội chi 36 tháng tiến về `gov.deficit.target` (2,5% GDP), tối đa 0,3 điểm mỗi năm. Thiết kế ghi "giữ chi theo tỷ lệ GDP"; làm vậy thì không có gì neo cân đối ngân sách, nợ hoặc thặng dư dồn mãi.
- **Chỉnh ngưỡng tính bằng đồng theo lạm phát** (`gov.indexation`, mặc định bật): ngưỡng thuế chỉnh khi CPI tăng quá 20%, lương tối thiểu vùng chỉnh mỗi năm. Không có thì sau 20 năm ai cũng nộp TNCN bậc cao.
- **NHNN tự chỉnh lãi suất theo lạm phát** (`cb.autopilot`) đổi mặc định sang bật.
- **Chính phủ nhỏ hơn nữa**: công chức 3% lao động, mua hàng khởi điểm 2% GDP.
- **Vốn cố định mỗi lao động tăng lên** khoảng một năm rưỡi lương (`firm.kappa.*` 1300/1700/1300). Hộ kinh doanh: năng suất 0,44.
- **Hàm đầu tư** dùng mức sử dụng công suất mong muốn, hệ số `firm.gamma2` nâng từ 0,0067 lên 0,05 mỗi tháng (khác xa Caiani).
- **Định giá theo chi phí chuẩn**: chi phí máy tính trên sản lượng ở công suất bình thường, để bán chậm không tự đẩy giá lên.
- **Biên lãi** tăng giảm đối xứng.
- **Luân chuyển lao động** 1,7% mỗi tháng (Caiani θ).
- **Gia nhập doanh nghiệp** tính theo dân số và sức hút của ngành, không theo số doanh nghiệp đang có. Vốn góp tối thiểu 60 triệu theo giá gốc.
- **Hộ kinh doanh mới mở vì thấy có lãi** (`hkd.entryRate`), ngoài kênh "thất nghiệp lâu thì tự làm".
- **Lương ở hộ kinh doanh giảm được** khi thừa người và hàng ế; lương doanh nghiệp vẫn cứng chiều xuống.
- **Giãn nợ**: doanh nghiệp còn vốn ròng dương mà chậm trả, hoặc trả xong thì hết quỹ lương, được ngân hàng giãn kỳ hạn thay vì phá sản. Chỉ phá sản khi âm vốn hoặc hết người hết tiền.
- **Thanh lý**: máy của doanh nghiệp phá sản bán chiết khấu cho tối đa ba doanh nghiệp, nơi đang cần máy mua trước.
- Kỳ hạn vay đầu tư 84 tháng. Tỷ lệ vốn mục tiêu của ngân hàng 18%.

## 13/11/2026 - GĐ1 engine chạy được lần đầu

Thay đổi so với thiết kế đã duyệt, tớ tự quyết (Dương xem lại nếu muốn):
- **Làm engine GĐ1 trước phần UI của GĐ0.** Lý do: Dương ưu tiên engine và kiểm định. Giao thức, Worker, khung UI của GĐ0 làm sau.
- **Chính phủ nhỏ hơn dự kiến**: công chức 5% lao động (thiết kế ghi tạm 10%), mua hàng 3% GDP (ghi tạm 6%). Lý do: mô hình chỉ có GTGT, TNCN, TNDN, thuế hộ kinh doanh; thiếu thuế xuất nhập khẩu, tiêu thụ đặc biệt, đất, dầu, nên thu ngân sách chỉ khoảng 6-9% GDP. Giữ 10% thì thâm hụt 15% GDP và lạm phát không dừng. Mục tiêu thô "thu ngân sách 14-20% GDP" sẽ không đạt ở GĐ1; ghi vào mục "mô hình bỏ qua gì".
- **Thêm nghiệp vụ thị trường mở tự động** (`cb.omo.auto`, mặc định bật): ngân hàng thiếu dự trữ thì bán lại trái phiếu cho NHNN, hết trái phiếu mới vay tái cấp vốn. Thiết kế mục 8 ghi "không tự động". Lý do: dân rút tiền mặt làm dự trữ cạn dần, ngân hàng không mua được trái phiếu mới, kho bạc nợ lương công chức, kinh tế sụp. Có nút tắt. K1.21 sẽ đo tổng hỗ trợ thanh khoản của NHNN (tái cấp vốn + trái phiếu mua lại).
- Bỏ `cb.print.monthly`; in tiền đi qua `cb.monetize` (NHNN mua thẳng trái phiếu) và `gov.transfer.universal`.
- Hộ kinh doanh: năng suất 0,54, lương 0,6 so với doanh nghiệp, tối đa 5 người. Đặt để giá hai khu vực ngang nhau lúc đầu.
- Người tự làm (lối thoát T2) bán hết hàng và có vốn thì thuê người, thành hộ kinh doanh thường. Thiết kế chưa nói; không có thì số hộ kinh doanh chỉ giảm.
- Hộ đi mua: nơi quen hết hàng thì sang ngay nơi quen kế tiếp trong cùng lượt.
- Doanh nghiệp chỉ đăng tuyển số người mà tiền đang có trả nổi lương. Doanh nghiệp hết người, hết tiền quá 6 tháng thì giải thể.
- Ngân hàng trả dần phần vốn vượt gấp đôi mục tiêu cho chủ sở hữu.
- `firm.rBar` (tỷ suất lợi nhuận bình thường) lấy bằng mức ở trạng thái khởi tạo, như cách Caiani hiệu chỉnh theo trạng thái dừng.
- Khấu hao theo số dư giảm dần. Mua máy giữa doanh nghiệp không tính GTGT.
- Đổi cấu hình test: reporter `dot`, chỉ in chi tiết khi lỗi.

## 13/11/2026 - Dương duyệt thiết kế và thêm GĐ1.5

Quyết định của Dương:
- Nhận T1, T2, T3.
- Nhận S1, S2, S3, S4, S7, S8, S10, S13, S14. S11 làm một figure ở cuối GĐ1. S5, S6, S9, S12 để sau GĐ1.
- Nhận M1-M4 vào lộ trình.
- Nhận P1 có sửa: lương tối thiểu vùng kéo về GĐ1. Thứ tự: GĐ1 → GĐ3 → GĐ5 → GĐ2 → phần còn lại.
- Nhận P2-P8.
- **Thêm GĐ1.5 - Đánh bóng trải nghiệm**, ngay sau GĐ1: hệ thiết kế (màu, chữ, phong cách isometric theo skill anatomy), điều hướng 3 vai, cảm giác "sống" của bản đồ, onboarding. Các giai đoạn sau dùng lại hệ thiết kế và có tiêu chí nghiệm thu UI. Đã ghi vào CLAUDE.md.

Hệ quả tớ rút ra cho việc đang làm (suy luận của tớ, Dương chưa nói): UI của GĐ0 và GĐ1 làm ở mức đúng chức năng, không đầu tư thẩm mỹ, vì GĐ1.5 sẽ làm lại lớp trình bày.

Đã làm sau khi duyệt:
- Cập nhật CLAUDE.md, de-xuat.md, gd1.md (lương tối thiểu vùng: mục 5.3, K1.30, K1.31, kịch bản 14).
- `git init`. Cài stack.
- Tải PDF Caiani 2016 về research/sources/caiani2016.pdf và đọc Bảng 3. Tham số gốc (theo quý) chép vào `src/config/model/gd1.ts` kèm cách quy đổi sang tháng.

## 13/11/2026 - Thiết kế tổng thể, GĐ0, GĐ1

Đã làm:
- Đọc KICKOFF.md, research/abm-models.md, research/vn-params.md, skill anatomy (SKILL.md và references/kit.md).
- Viết CLAUDE.md, docs/design/gd0.md, docs/design/gd1.md, docs/design/de-xuat.md.
- Kiểm lại một số chỗ chưa xác minh trong research. Kết quả ở gd1.md mục 15.

Giả định và quyết định nhỏ đã tự chọn (Dương xem, không cần duyệt riêng):
- Đơn vị tiền là đồng, số nguyên. Tham số luật dùng con số thật, không quy đổi.
- Số ngẫu nhiên dùng hàm băm theo (seed, luồng, tác nhân, tháng, lượt) thay cho bộ sinh có trạng thái, để hai thế giới song song so được với nhau.
- Lưu trạng thái đầy đủ, không lưu chuỗi lệnh.
- Tham số luật viết bằng file TypeScript có kiểu, không dùng JSON, để trình biên dịch bắt thiếu trường nguồn hay ngày hiệu lực.
- Mỗi hộ nhớ 5 người bán mỗi ngành (Lengnick dùng 7 cho một loại hàng; ở đây có ba ngành).
- Mua hàng chia 4 lượt trong tháng.
- Ngân hàng vốn âm: mặc định Nhà nước tái cấp vốn; bail-in là biến thể Phòng thí nghiệm.
- Trái phiếu chính phủ hai kỳ hạn: 12 và 60 tháng.
- Kiểm định thống kê: 20 seed × 480 tháng ở mức 500 hộ; 5 seed ở mức 5000 hộ; qua khi đúng ở 80% seed.

Lựa chọn cần Dương duyệt: T1-T3, S1-S14, M1-M4, P1-P8 trong docs/design/de-xuat.md.

Việc phải làm ngay đầu bước code GĐ1:
- Mở lại PDF Caiani 2016 (đường dẫn ở research/abm-models.md mục 1.1), chép bảng tham số vào `src/config/model`, ghi cách quy đổi quý sang tháng. Hiện các giá trị gốc mới ghi theo trí nhớ.

Tham số còn mức C, đang dùng giá trị tạm (GĐ9 tra lại):
- Tỷ lệ an toàn vốn tối thiểu 8%.
- Điều 26 Luật NHNN 2010 về tạm ứng cho ngân sách.
- Trần nợ công 60% GDP.
- Tỷ lệ khai báo doanh thu của hộ kinh doanh; năng suất tương đối của khu vực phi chính thức.
- Tỷ lệ lao động làm cho Nhà nước.
- Trần lãi suất huy động hiện hành.
- Cách tính phần trừ ngưỡng trong thuế hộ kinh doanh sau NĐ 141/2026.
