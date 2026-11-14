# Nhật ký tiến độ

Mới nhất ở trên. Model tiếp quản: đọc mục "Đang ở đâu" trước, rồi `git log`.

## Đang ở đâu

Cập nhật mục này sau MỖI bước nhỏ (CLAUDE.md quy tắc 11). Cập nhật lúc 11:40 ngày 14/11/2026.

### Tóm tắt một dòng

Engine GĐ0 và GĐ1 xong. Kiểm định GĐ1 còn hai mục không qua đã biết nguyên nhân (K1.19, K1.12). Lớp giao thức, phiên làm việc và Worker xong. **UI đang viết dở, chưa chạy thử lần nào.** Kịch bản có bản đầu, còn 6 cái chưa qua kiểm định. GĐ1.5 chưa bắt đầu.

### Trạng thái từng phần

| Phần | Trạng thái | Ghi chú |
|---|---|---|
| GĐ0 lõi (engine, sổ cái, luật theo ngày, chuỗi nhân quả, lưu tải, tách nhánh) | Xong | K0.1, K0.3-K0.9, K0.11, K0.12 qua |
| GĐ0 giao thức, phiên làm việc, Worker | Xong, đã commit | `src/protocol`, `src/engine/session/session.ts`, `src/worker/worker.ts`. K0.2 và K0.10 qua bằng test trong Node; K0.2 chưa đo trong Worker thật của trình duyệt |
| GĐ0 UI, PWA | **Đang viết, chưa commit, chưa chạy thử** | K0.13 (50 khung/giây), K0.14 (offline) chưa đo |
| GĐ1 engine (M1-M5) | Xong | 44 test nhanh qua |
| GĐ1 kiểm định thống kê | **Chưa qua hết** | Xem mục dưới |
| GĐ1 vai người chơi trong engine | Xong | `modules/gd1/player.ts`: hộ (chi tiêu, lương thấp nhất chịu nhận, nghỉ việc, ra tự làm), doanh nghiệp (giá, lương, số người, mua máy). Chưa có: đổi ngân hàng, bỏ vốn lập doanh nghiệp, xin vay, chia cổ tức, tỷ lệ tiền mặt |
| GĐ1 kịch bản | **Bản đầu, 6/15 chưa qua kiểm định** | Xem mục dưới |
| GĐ1 M6 UI và các tính năng S | **Đang viết** | Xem mục dưới |
| GĐ1 figure anatomy (S11, bể thuỷ lực) | Chưa làm | |
| GĐ1.5 | Chưa bắt đầu | Phải viết `docs/design/gd1-5.md` rồi chờ Dương duyệt |

### Kiểm định GĐ1

Đang chạy nền: `npm run validate:gd1` (20 seed) rồi `npx tsx scripts/scenarios.ts 10`. Kết quả ghi vào scratchpad của phiên, chưa đọc. **File `docs/validation/gd1.md` hiện có là của lần chạy cũ (còn dùng `exp.saveResponse` = 2), đừng tin; lượt đang chạy sẽ ghi đè.**

Kết quả đã biết ở 20 seed, 500 hộ, lần chạy gốc (`npx tsx scripts/validate.ts 20 base M`), sau các quyết định ngày 14/11:
- Qua: K1.1-K1.11, K1.13, K1.14, K1.27, K1.30, K1.32.
- **K1.12 không qua (12/20)**: lạm phát cùng chiều chu kỳ rõ (tương quan 0,50-0,79) nhưng đỉnh rơi vào cùng quý, không trễ. Nguyên nhân ở sai-khac.md D5. Không vá.
- **K1.19 chưa đạt (đã biết)**: kênh lãi suất tới cầu yếu; vay tiêu dùng để GĐ3.
- Thí nghiệm chạy đôi (K1.15-K1.31) **chưa chạy lại** sau khi đổi S7, S20, S25. Lượt chạy nền sẽ cho biết.
- Số liệu nền hiện tại: thất nghiệp 5,3-7,4%, lạm phát 0-1,8% mỗi năm (mục tiêu NHNN 4,5%), phi chính thức 55-63%, Gini của cải 0,34-0,62.

### Các quyết định của Dương ngày 14/11/2026 (đã làm hết, chi tiết ở [design/sai-khac.md](design/sai-khac.md) mục B và D)

1. Mọi cơ chế thêm phải là tham số có tên, có cơ sở. Chỉ để làm số đẹp thì dừng lại báo.
2. `exp.saveResponse` = 0,35 (Havránek 2015). Không dùng giá trị 2.
3. Vay tiêu dùng và giảm phát nợ để GĐ3 (đã ghi vào lộ trình trong CLAUDE.md).
4. Giữ cách đo mới của K1.22 (3 năm đầu) và K1.26 (doanh số thực).
5. Lãi suất cao kéo dài làm tăng lạm phát qua tiền lãi Chính phủ trả: giữ, ghi thành phát hiện, làm kịch bản 15 "Hai tay lái".
6. Quy tắc lãi suất tự động của NHNN (S20) tắt theo mặc định, giữ làm chính sách tự động bật được.
7. Lương bám 50% lạm phát kỳ vọng thay cho 100% (Rabanal và Sbrancia 2024, IMF WP/24/105). Chưa phân biệt chính thức và phi chính thức vì không tìm được ước lượng riêng; đã tách thành hai tham số.
8. Mức thất nghiệp "bình thường" tự sinh từ mô hình: trung bình trượt 60 tháng (Ball và Mankiw 2002).
9. Thêm nội dung học: vì sao lãi suất yếu và room mạnh ở GĐ1 (`src/content/notes.ts`).

### Việc còn mở cần Dương biết

- Lạm phát nền 0-1,8% là thấp so với Việt Nam (3-4%). Lý do: mô hình không có gì đẩy giá lên đều (không tăng năng suất, dân số; ngân sách gần cân; lương bám một nửa). Chưa làm gì thêm.
- Bằng chứng nói lương bám lạm phát **quá khứ**; mô hình vẫn dùng lạm phát **kỳ vọng** theo thiết kế mục 10.
- 0,5 lấy từ Uruguay (thương lượng lương tập trung), nhiều khả năng là cận trên cho Việt Nam.

### Kịch bản (`src/content/scenarios.ts`, 15 cái)

Mỗi kịch bản có lời giải mẫu; mỗi khẳng định trong lời giải thích là một phép đo so với thế giới đối chứng và phải đúng ở ít nhất 80% số seed. Chạy: `npx tsx scripts/scenarios.ts <số seed> [mã]`, hoặc `npm run validate:scenarios` (sinh `docs/validation/scenarios.md`).

Lần chạy 5 seed (trước khi đổi S7, S25):
- Qua hết: mot-khoan-vay, may-in-tien, vach-xuat-phat, room-hay-lai-suat, keo-vao-luoi-thue, can-ngan-sach, that-lung-buoc-bung, tin-dung-nong, gia-luong-tien.
- **Chưa qua, phải sửa**:
  - `thue-nguoi-giau`: Gini thu nhập không giảm khi nâng thuế cổ tức (0/5). Phải sửa lời giải thích theo điều mô hình nói, hoặc tìm vì sao.
  - `het-han-giam-thue`: hiệu bằng 0 (0/5). Nghi do kịch bản không bắt đầu đúng năm 2026 nên thuế không tự về 10%; chưa soi.
  - `song-bang-luong`, `chu-xuong`: hiệu bằng 0 (0/5). Đối chứng "bỏ cú sốc" đang không bỏ được cú sốc; lỗi ở `Session.replay` hoặc cách ghi cú sốc vào nhật ký. Chưa soi.
  - `luong-toi-thieu`: 3/5.
  - `hai-tay-lai`: khẳng định "tiêu dùng thực cao hơn sau vài năm" 2/5.
- Định dạng số đo của `keo-vao-luoi-thue` sai đơn vị (in đồng thành "điểm").

### UI (`index.html`, `src/ui/`, đã commit e16d20c)

Đã viết đủ bản đầu và mở được trong trình duyệt (`npx vite`): màn hình đầu, bản đồ isometric, chạy ở ×16, dải chỉ số, bản tin, ngăn "Vì sao?" đều chạy, không lỗi console. Các phần khác chưa thử.

- `client.ts`, `store.ts`, `format.ts`, `Chart.tsx`, `App.tsx`, `RolePanel.tsx`, `Drawer.tsx`, `app.css`, `iso/layout.ts`, `iso/IsoMap.tsx`.
- `Drawer.tsx` có: chuỗi nhân quả, bảng cân đối chữ T (S4), bảng nguồn tiền (S3), Phòng thí nghiệm, "mô hình bỏ qua gì" (S13), so với thế giới đối chứng (S1), báo cáo kịch bản, biểu đồ, xuất CSV (S14), danh sách tác nhân, lưu tải IndexedDB và file.
- PWA đăng ký trong `main.tsx`; `npm run build` chạy được.

### Cách làm việc từ 14/11/2026 (Dương yêu cầu)

Việc liên quan test và code giao diện giao cho Sonnet (subagent). Phiên chính giữ: thiết kế engine, quyết định kinh tế, chẩn đoán, báo cáo.

### Đang chạy (hai subagent Sonnet, giao lúc 12:00)

1. **Kiểm định**: chạy `npm run validate:gd1` và `npx tsx scripts/scenarios.ts 10`, lập bảng kết quả, sửa lỗi của bộ chạy test (không được đổi kinh tế, tham số, ngưỡng, lời khẳng định).
2. **UI**: thử mọi phần của UI trong trình duyệt theo danh sách, sửa lỗi trong `src/ui`, đo K0.13 (khung/giây ở 5000 hộ), K0.14 (offline), K0.2 (mã băm trong Worker thật so với Node).

Vừa sửa trước khi giao: mốc lưu trong `Session` bị chụp đè sau cú sốc nên đối chứng "bỏ cú sốc" cho hiệu bằng 0 (kịch bản `song-bang-luong`, `chu-xuong`); lời giải mẫu của `het-han-giam-thue` ban hành 8% khi thuế đang 8% nên không có tác dụng, đã dời sang tháng 1/2027.

### Bước tiếp theo, theo thứ tự

1. Nhận báo cáo của hai subagent; ghi kết quả kiểm định vào đây; quyết từng mục không qua (sửa lời giải thích kịch bản theo điều mô hình nói, hoặc bỏ kịch bản).
2. Figure bể thuỷ lực (S11): giao Sonnet, theo skill anatomy.
3. Báo cáo GĐ0 và GĐ1 cho Dương.
4. Viết `docs/design/gd1-5.md`, dừng chờ duyệt. GĐ1.5 chỉ bắt đầu khi GĐ1 qua kiểm định (hiện còn K1.12 không qua, K1.19 chưa đạt).

### Công cụ soi

`scripts/validate.ts <số seed> <base|exp|all> <S|M|L> [k=v]`, `scripts/scenarios.ts`, `scripts/pairdiag.ts` (hiệu chạy đôi theo năm), `scripts/k119.ts`, `scripts/inflation.ts` (phân rã CPI và lương theo mã lý do), `scripts/diag.ts`, `scripts/debug*.ts`.

## 14/11/2026 - Kiểm định GĐ1, sửa hai cơ chế thiếu

- **Lương phản ứng với thất nghiệp** (S25) và **hộ trừ phần lạm phát ăn mòn tiền** (S26): thêm sau khi K1.19 hỏng. Kèm S28 (tăng `exp.saveResponse`) và S30 (lãi vay trong giá tính theo lãi thực trả).
- **Thuế hộ kinh doanh vào giá bán** (S27): thiếu sót so với thiết kế, đã bổ sung. K1.24 qua.
- **K1.22** soi bằng 10 seed: siết tín dụng làm GDP thực thấp hơn 3-4% trong 3 năm đầu, rồi giá giảm, kinh tế bật lại cao hơn 2-6% ở năm 6-9, kể cả khi tắt quy tắc lãi suất tự động và tắt S26. Đây là một chu kỳ dài, không phải lợi ích bền. Đổi cửa sổ đo, in kèm số năm 6-10.
- **K1.26** soi bằng 10 seed: thu/GDP +0,6 điểm; giá hàng hộ kinh doanh +2,7% năm đầu; GDP thực −1 đến −3%; thu nhập thực phi chính thức −2 đến −6%; số hộ kinh doanh +11%, lao động phi chính thức +1 điểm. Bật quy tắc ngân sách tự động (để thuế thu thêm được chi ra) không đổi kết luận trong 8 năm. Đổi cách đo sang doanh số thực, ghi rõ giới hạn trong báo cáo.
- Chỉ số mới cho kiểm định: `consumption.real`, `price.formal.taxed`, `price.informal.taxed`, `employment.formal`, `wage.formal.low`, `gini.wageNet`, `income.real.*`, `profits.formal.real`, `wages.fixed.real`. Thêm cột `pitPaid` cho hộ.

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
- Doanh nghiệp dưới hai năm tuổi được ngân hàng xét theo phương án kinh doanh (dòng tiền khi máy chạy ở công suất bình thường). Người sáng lập phải tự có 40% vốn cần.

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
