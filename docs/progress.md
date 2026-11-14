# Nhật ký tiến độ

Mới nhất ở trên. Model tiếp quản: đọc mục "Đang ở đâu" trước, rồi `git log`.

## Đang ở đâu

Cập nhật mục này sau MỖI bước nhỏ (CLAUDE.md quy tắc 11). Cập nhật tối 14/11/2026.

### Tóm tắt một dòng

Engine GĐ0 và GĐ1 xong. Đã làm theo hai đợt quyết định tối 14/11 của Dương. **Kiểm định đầy đủ phải chạy lại trên bản code hiện tại** (sau S34 và bất đối xứng thuế). Ba việc chờ Dương: ngưỡng K1.13 và đề xuất B; hướng sửa thất nghiệp và lạm phát (sai-khac.md D11). GĐ1.5 chưa bắt đầu.

### Quyết định của Dương tối 14/11/2026, đợt một

| # | Quyết định | Trạng thái |
|---|---|---|
| 1 | K1.12 kiểm ở 5000 hộ | Xong trong bộ kiểm định (ở 500 hộ ghi "tham khảo") |
| 1 | K1.13 không đổi quy mô; phân tích; đề xuất cơ chế rẻ | Xong: sai-khac.md D8 |
| 1 | K1.31 sang GĐ2; K1.28, K1.29, K1.19 "đã biết" | Xong |
| 1 | K1.24 sửa cơ chế biên lãi co khi thuế tăng | Xong (S31) |
| 2 | K0.2 chấp nhận | Xong (D7) |
| 3 | Lương bám lạm phát quá khứ | Xong (S32) |
| 4 | Phân rã "vì sao" cho lương thực, bội chi/GDP, nợ công/GDP | Xong, có test |
| 5 | Kịch bản thuế người giàu ba nhánh; rà kịch bản khác | Xong (D10). Kiểm định kịch bản 10 seed qua hết trên bản code trước đợt hai |
| 6 | S11 hoãn; hạn chế subagent | Đang theo |

### Quyết định của Dương tối 14/11/2026, đợt hai

| # | Quyết định | Trạng thái |
|---|---|---|
| 1 | Duyệt A; lấy độ dốc đúng từ Dynan, Skinner, Zeldes 2004; không chỉnh để Gini đạt | Xong (S34, η = 0,09). **Gini ở 5000 hộ lên 0,33, chưa tới 0,4** |
| 1 | Báo nguồn của ngưỡng Gini 0,4 | **Không có nguồn**: số tự đặt lúc thiết kế. Chưa hạ ngưỡng, lý do ở D8. Chờ Dương |
| 1 | B chỉ làm nếu duyệt sau khi có kết quả A | Chưa làm, chờ duyệt |
| 2 | Đọc toàn văn bài IMF trước khi chọn tỷ lệ chuyển thuế; có bất đối xứng thì mô hình hoá | Xong (D9): tăng 0,34, giảm 0,065 theo Benzarti 2020. Bằng chứng về bất đối xứng trái nhau, đã ghi rõ |
| 2 | Số đúng làm K1.24 hỏng thì sửa ngưỡng theo bằng chứng | Chưa biết: chờ kiểm định đầy đủ |
| 3 | Sau kiểm định đầy đủ, phân tích nguyên nhân thiếu cầu bằng phân rã, báo trước khi sửa | Phân tích xong trên 5 seed (D11): thất nghiệp là do đơn vị nhỏ cắt rồi tuyển lại từng người, không phải thiếu cầu; lạm phát thấp vì tiền gần đứng yên. **Chưa sửa gì** |
| 3 | Áp dụng P2: mục tiêu hiệu chỉnh thô cho GĐ1 | Xong: bảng mới ở gd1.md mục 14 |

### Trạng thái từng phần

| Phần | Trạng thái | Ghi chú |
|---|---|---|
| GĐ0 | Xong | K0.2 chấp nhận theo gd0 mục 12 |
| GĐ1 engine (M1-M5) | Xong, vừa đổi hai cơ chế (S31, S32) | |
| **GĐ1 kiểm định thống kê** | **Phải chạy lại đầy đủ** | Thử 5 seed ở 500 hộ sau S31, S32: hỏng K1.12 (3/5, từ nay chỉ xét ở 5000 hộ), K1.28 (1/5), K1.29 (2/5), K1.31 (2/5), K1.19 (0/5): đều là mục đã biết. K1.24 qua 5/5 |
| GĐ1 kịch bản (15 cái) | **Phải chạy lại kiểm định kịch bản** | Hai kịch bản thuế giờ có ba nhánh; `het-han-giam-thue` đổi lời giải thích theo S31 |
| GĐ1 UI | Bản đầu đã thử trong Chrome | Đang thêm bảng so sánh các lựa chọn |
| GĐ1 figure bể thuỷ lực (S11) | Hoãn tới khi engine GĐ1 ổn định | |
| GĐ1.5 | Chưa bắt đầu | Phải viết `docs/design/gd1-5.md` rồi chờ duyệt; GĐ1 phải qua kiểm định trước |

### Việc chờ Dương quyết

1. **K1.13** (D8): giữ ngưỡng 0,4 và ghi "chưa đạt", hay đổi sang tiêu chí "Gini của cải cao hơn Gini thu nhập". Và có làm B không.
2. **Thất nghiệp** (D11): sửa quy tắc cắt và tuyển người theo dải tồn kho của Lengnick 2013 (phải mở lại bài để lấy đúng quy tắc).
3. **Lạm phát và cầu** (D11): đặt bội chi mặc định gần mức Việt Nam, hay chấp nhận tới khi có tăng năng suất; soi vì sao công suất máy dừng ở 70%.
4. **Bất đối xứng thuế** (D9): tớ đã theo bài JPE. Nếu Dương muốn theo hai bài IMF (không bất đối xứng) thì đổi một tham số.

### Bước tiếp theo, theo thứ tự

1. Chạy lại `npm run validate:scenarios` và `npm run validate:gd1` trên bản code hiện tại (Sonnet). Đọc kết quả, cập nhật D6 và bảng mục tiêu thô.
2. `het-han-giam-thue`: viết lại lời giải thích theo số đo mới (giảm thuế lại thì giá không xuống mấy).
3. Sau khi Dương trả lời: làm, kiểm định lại.
4. Báo cáo GĐ0 và GĐ1. Viết `docs/design/gd1-5.md`, dừng chờ duyệt.

### Việc còn mở cần Dương biết

- Lạm phát nền 0-1% là thấp so với Việt Nam (3-4%). Mô hình không có gì đẩy giá lên đều (không tăng năng suất, dân số; ngân sách gần cân; lương bám một nửa lạm phát năm trước).
- 0,5 lấy từ Uruguay (thương lượng lương tập trung), nhiều khả năng là cận trên cho Việt Nam.

### Kịch bản (`src/content/scenarios.ts`, 15 cái)

Chạy: `npx tsx scripts/scenarios.ts <số seed> [mã]`, `npm run validate:scenarios` (sinh `docs/validation/scenarios.md`), soi theo năm: `npx tsx scripts/scendiag.ts <mã> [seed] <chỉ số:rel|pt> ...`.

Kết quả 10 seed ngày 14/11: 13 kịch bản qua hết. Đã sửa theo điều mô hình nói, đang chạy lại:
- `thue-nguoi-giau`: nâng thuế cổ tức và TNDN không làm Gini thu nhập giảm (thuế thu thêm không được chi ra, thất nghiệp tăng). Lời giải thích viết lại thành phát hiện này.
- `hai-tay-lai`: bỏ khẳng định tiêu dùng thực cao hơn (6/10).
- `het-han-giam-thue`: bỏ câu "người bán giữ lại một phần thuế" (mô hình chuyển gần trọn thuế vào giá, xem K1.24).

Lời giải mẫu không đạt mục tiêu ở phần lớn seed (chỉ tham khảo): vach-xuat-phat 0/10, thue-nguoi-giau 3/10, luong-toi-thieu 3/10, chu-xuong 4/10. Cần xem lại mục tiêu có đạt được không.

### UI (`index.html`, `src/ui/`, đã commit e16d20c)

Đã viết đủ bản đầu và mở được trong trình duyệt (`npx vite`): màn hình đầu, bản đồ isometric, chạy ở ×16, dải chỉ số, bản tin, ngăn "Vì sao?" đều chạy, không lỗi console. Các phần khác chưa thử.

- `client.ts`, `store.ts`, `format.ts`, `Chart.tsx`, `App.tsx`, `RolePanel.tsx`, `Drawer.tsx`, `app.css`, `iso/layout.ts`, `iso/IsoMap.tsx`.
- `Drawer.tsx` có: chuỗi nhân quả, bảng cân đối chữ T (S4), bảng nguồn tiền (S3), Phòng thí nghiệm, "mô hình bỏ qua gì" (S13), so với thế giới đối chứng (S1), báo cáo kịch bản, biểu đồ, xuất CSV (S14), danh sách tác nhân, lưu tải IndexedDB và file.
- PWA đăng ký trong `main.tsx`; `npm run build` chạy được.

### Cách làm việc từ 14/11/2026 (Dương yêu cầu)

Việc liên quan test và code giao diện giao cho Sonnet (subagent). Phiên chính giữ: thiết kế engine, quyết định kinh tế, chẩn đoán, báo cáo.

### Việc UI để dành GĐ1.5 (từ lượt thử trong Chrome)

Bản tin che bản đồ; nhãn chồng nhau; vòng đánh dấu tác nhân đang điều khiển quá nhỏ; ở 5000 hộ không bấm được từng hộ; biểu đồ không có tooltip; màn hình đầu không phân nhóm kịch bản; nút xoá ván không hỏi lại; CSV dùng mã chỉ số làm tiêu đề cột; PWA chưa có biểu tượng; file lưu 17 MB ở 500 hộ; bản đồ không vẽ lại khi đổi sáng tối giữa chừng.

### Công cụ soi

`scripts/validate.ts <số seed> <base|exp|all> <S|M|L> [k=v]`, `scripts/scenarios.ts`, `scripts/pairdiag.ts` (hiệu chạy đôi theo năm), `scripts/k119.ts`, `scripts/k113.ts` (Gini theo quy mô), `scripts/optdiag.ts` (so các nhánh của kịch bản), `scripts/demand.ts` (phân rã thất nghiệp, cầu, tiền, giá), `scripts/inflation.ts` (phân rã CPI và lương theo mã lý do), `scripts/diag.ts`, `scripts/debug*.ts`.

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
