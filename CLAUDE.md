# KINH BANG

Web app mô phỏng nền kinh tế một quốc gia giả lập theo Việt Nam, chơi như game. Mục đích: giúp người chơi hiểu cách nền kinh tế vận hành. Kết quả phải tự sinh ra từ hành vi tác nhân, không được vẽ tay.

Đề bài gốc và quy trình làm việc: [KICKOFF.md](KICKOFF.md). File này là bản tóm tắt để bất kỳ model nào đọc xong cũng làm tiếp được.

## Trạng thái

- Thiết kế GĐ0 + GĐ1 đã được duyệt ngày 13/11/2026. Đang code theo chế độ tự chạy.
- Việc đang làm, giả định đã chọn, việc kế tiếp: [docs/progress.md](docs/progress.md). Đọc file đó và `git log` trước khi làm bất cứ gì.

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/design/gd0.md](docs/design/gd0.md) | Nền móng kỹ thuật: stack, kiến trúc engine, sổ cái, chuỗi nhân quả, giao thức engine-UI, cấu hình luật, kiểm định GĐ0 |
| [docs/design/gd1.md](docs/design/gd1.md) | Lõi kinh tế: quy tắc hành vi từng loại tác nhân, thị trường, tiền, thuế, phi chính thức, kỳ vọng, kiểm định GĐ1, kịch bản |
| [docs/design/de-xuat.md](docs/design/de-xuat.md) | Đề xuất sáng tạo và phản biện, kèm trạng thái duyệt từng mục |
| [docs/progress.md](docs/progress.md) | Nhật ký tiến độ, giả định, quyết định nhỏ |
| [research/abm-models.md](research/abm-models.md) | Research mô hình ABM, game, đặc thù Việt Nam |
| [research/vn-params.md](research/vn-params.md) | Tham số luật Việt Nam, có mức xác minh A/B/C |

Spec giai đoạn N ghi vào `docs/design/gdN.md`. Không nhồi chi tiết vào file này.

## Stack

TypeScript + Vite + React. Engine là TypeScript thuần, chạy trong Web Worker và chạy được trong Node để test. Vitest cho test. Canvas 2D cho bản đồ isometric, uPlot cho biểu đồ, Zustand cho state UI. Lưu ván bằng IndexedDB và file xuất. PWA để chạy offline. Không có server. Lý do chọn: [gd0.md mục 1](docs/design/gd0.md).

## Kiến trúc (một đoạn)

`src/engine` không biết gì về trình duyệt. Nó giữ một `World` gồm các bảng dữ liệu dạng mảng (struct-of-arrays), tuần tự hoá được toàn bộ. Mỗi tháng mô phỏng, engine chạy các pha theo thứ tự cố định; mỗi module kinh tế đăng ký hàm vào các pha. Mọi thay đổi tiền và tài sản đi qua sổ cái kế toán kép. Mọi quyết định của tác nhân ghi lại quy tắc và lý do. Chuỗi nhân quả dựng từ hai nguồn đó. UI nói chuyện với engine qua một giao thức tin nhắn có kiểu, định nghĩa ở `src/protocol`.

```
src/engine/{core,ledger,causal,indicators,scenario,lab,modules/*}
src/protocol        kiểu tin nhắn engine <-> UI, có số phiên bản
src/worker          lớp mỏng bọc engine
src/config/vn       luật và tham số Việt Nam (nguồn, ngày hiệu lực, mức xác minh)
src/config/model    tham số hành vi (nguồn bài báo)
src/content         kịch bản, mẫu câu giải thích tiếng Việt
src/ui              React: app, roles, iso, charts, causal, scenario
tests/{unit,validation,perf}
```

## Quy tắc bắt buộc khi code

1. **Tiền chỉ đổi qua sổ cái.** Không module nào được cộng trừ trực tiếp số dư. Chỉ dùng các phép nguyên thuỷ của `ledger` (chuyển tiền, tạo khoản vay, trả nợ, xoá nợ, rút/nộp tiền mặt, phát hành trái phiếu...). Tiền là số nguyên, đơn vị đồng.
2. **Bốn đẳng thức kế toán đúng ở mọi tháng** (gd0 mục 4.3). Test nào làm vỡ thì dừng lại sửa, không nới.
3. **Tất định.** Engine không dùng `Math.random`, `Date`, hay thứ gì phụ thuộc thời gian thật. Số ngẫu nhiên lấy từ hàm băm `rand(seed, luồng, tác nhân, tháng, lượt)`. Cùng seed và cùng lệnh thì cùng kết quả từng bit.
4. **Mọi quy tắc hành vi phải đăng ký** trong sổ quy tắc: mã, mô tả tiếng Việt, nguồn tham khảo, các biến thể cho Phòng thí nghiệm. Mọi quyết định làm đổi giá, lương, sản lượng, việc làm, tín dụng phải ghi bản ghi quyết định kèm mã lý do.
5. **Chuỗi nhân quả không vẽ tay.** Không viết sẵn quan hệ "chính sách X làm chỉ số Y đổi Z". Mọi mắt xích lấy từ sổ cái và bản ghi quyết định. Phần phân rã của một chỉ số phải cộng lại đúng bằng mức thay đổi.
6. **Mọi tham số có lý lịch.** Tham số luật: văn bản, điều khoản, ngày hiệu lực, mức xác minh, ghi chú đơn giản hoá. Tham số hành vi: bài báo hoặc ghi "tự thiết kế". Mức C dùng giá trị tạm, gắn nhãn `chuaXacMinh` trong config, không cảnh báo trong app.
7. **Engine trước, UI sau.** Trong mỗi giai đoạn: engine, test kiểm định, rồi mới giao diện.
8. **Không đánh đổi độ đúng cơ chế lấy hiệu ứng.** Hoạt cảnh trên bản đồ là phát lại giao dịch thật của tháng đó.
9. **Module mới gắn thêm, không sửa lõi.** Nếu buộc phải sửa `core` hoặc `ledger`, ghi lý do vào progress log.
10. Tên trong code bằng tiếng Anh. Chữ hiển thị và tài liệu bằng tiếng Việt, câu ngắn, từ thông dụng.
11. Sau mỗi bước nhỏ: chạy test, `git commit`, cập nhật `docs/progress.md`. Không xoá file hay chạy lệnh ngoài thư mục dự án.

## Quyết định đã chốt

- Xương sống theo Caiani và cộng sự 2016: kế toán kép chặt, cho vay tạo ra tiền gửi, sổ giao dịch là dữ liệu cho chuỗi nhân quả.
- Không dùng lượng tiền cố định hay số nhân tiền. Tỷ lệ dự trữ bắt buộc là ràng buộc thanh khoản, không phải hệ số nhân.
- Khoản vay nhiều kỳ ngay từ GĐ1.
- Kinh tế phi chính thức tự thiết kế ở GĐ1, đi từ bản tối thiểu. Ghi rõ là cơ chế chưa có mô hình tham chiếu.
- Con số 50 / 500 / 5000 là số hộ. Số doanh nghiệp và ngân hàng suy ra theo tỷ lệ. Mức 50 là sa bàn học; kiểm định thống kê chạy ở 500 và 5000.
- Bước thời gian cơ sở là tháng.
- Kịch bản siêu lạm phát gắn nhãn "ngoài vùng đã kiểm định" cho tới khi có cơ chế và test riêng.
- Room tín dụng là một công cụ của NHNN và là một kịch bản.
- Tham số lấy từ research/vn-params.md; không chặn thiết kế vì các chỗ còn treo.
- Không dùng: người đấu giá Walras, kỳ vọng hợp lý, tác nhân học máy, thị phần theo công thức, hệ số nhân quả đặt tay, khoản vay một kỳ.

## Lộ trình

Thứ tự đã duyệt (khác KICKOFF.md, giữ nguyên số hiệu giai đoạn):

GĐ0 nền móng kỹ thuật → GĐ1 lõi kinh tế → **GĐ1.5** đánh bóng trải nghiệm → **GĐ3** tài sản và tài chính → **GĐ5** mở cửa → **GĐ2** con người → GĐ4 cấu trúc thị trường → GĐ6 không gian và vật chất → GĐ7 môi trường và rủi ro → GĐ8 thể chế và xã hội → GĐ9 hiệu chỉnh tinh theo dữ liệu thật.

**GĐ1.5 - Đánh bóng trải nghiệm** (thêm ngày 13/11/2026). Bắt đầu sau khi GĐ1 qua kiểm định. Một mốc riêng cho UI/UX: hệ thiết kế (màu, chữ, phong cách isometric theo skill anatomy), điều hướng 3 vai, cảm giác "sống" của bản đồ, onboarding. Các giai đoạn sau dùng lại hệ thiết kế này, và mỗi giai đoạn có tiêu chí nghiệm thu UI ghi trong spec của nó. Spec viết vào `docs/design/gd1-5.md` khi tới lượt, theo đúng quy trình thiết kế rồi chờ duyệt. Hệ quả cho GĐ0 và GĐ1: giao diện ở hai giai đoạn này chỉ cần đúng chức năng và đọc được, chưa cần đẹp.

Nội dung từng giai đoạn ở KICKOFF.md, với các thay đổi đã duyệt:
- Lương tối thiểu vùng chuyển từ GĐ2 về GĐ1. BHXH và phần còn lại của GĐ2 giữ nguyên.
- Vốn cố định dạng đơn giản có ngay GĐ1; đời máy, R&D vẫn ở GĐ4.
- Thêm vào GĐ3: tín dụng ngoài ngân hàng (hụi họ, tín dụng đen) và thị trường liên ngân hàng.
- Thêm vào GĐ5: vàng và đô la làm nơi trú ẩn; kịch bản 1997, Zimbabwe và siêu lạm phát đầy đủ.
- Thêm vào GĐ8: mức đồng thuận của các nhóm dân cư với Chính phủ.
- Mỗi giai đoạn có mục tiêu hiệu chỉnh thô; GĐ9 chỉ còn hiệu chỉnh tinh.
- Mỗi kịch bản phải qua kiểm định riêng: lời giải thích đúng ở ít nhất 80% số seed.
- Tính năng học đã nhận: nút đối chứng, đoán trước khi chạy, bảng nguồn tiền, bảng cân đối sống, bản tin, hộ có tên, tách Bộ Tài chính và NHNN, mục "mô hình bỏ qua gì", xuất CSV, một figure anatomy cuối GĐ1. Để sau GĐ1: theo dấu đồng tiền, tua lại, vai chủ ngân hàng, sổ tay khái niệm. Chi tiết: [de-xuat.md](docs/design/de-xuat.md).

Mỗi giai đoạn: (1) thiết kế vào `docs/design/gdN.md`, dừng chờ duyệt; (2) code, kiểm định, kịch bản, progress log; (3) báo cáo. Chưa qua kiểm định thì chưa sang giai đoạn sau.

## Móc nối đã để sẵn cho giai đoạn sau

- Khoản vay có trường tài sản thế chấp (GĐ3 dùng cho đất, nhà).
- Doanh nghiệp và ngân hàng có trường chủ sở hữu, Nhà nước là chủ sở hữu hợp lệ (GĐ4).
- Hộ có trường kỹ năng, tuổi, số người phụ thuộc (GĐ2).
- Mọi tác nhân có ô vị trí trên lưới; GĐ1 chỉ dùng để vẽ, GĐ6 mới có ý nghĩa kinh tế.
- Sổ cái nhận loại công cụ tài chính mới (ngoại tệ, vàng, cổ phiếu) mà không đổi lõi.
- Luật có nhiều phiên bản theo ngày hiệu lực; kịch bản lịch sử nạp bộ tham số của thời kỳ đó.
