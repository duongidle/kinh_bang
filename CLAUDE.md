# KINH BANG

Web app mô phỏng nền kinh tế một quốc gia giả lập theo Việt Nam, chơi như game. Mục đích: giúp người chơi hiểu cách nền kinh tế vận hành. Kết quả phải tự sinh ra từ hành vi tác nhân, không được vẽ tay.

Đề bài gốc và quy trình làm việc: [KICKOFF.md](KICKOFF.md). File này là bản tóm tắt để bất kỳ model nào đọc xong cũng làm tiếp được.

## Trạng thái

- Thiết kế GĐ0 + GĐ1 đã được duyệt ngày 13/11/2026. Engine GĐ1 xong. Dương quyết 15/11/2026: hoàn thiện GĐ1 rồi sang GĐ1.5, không thêm cơ chế; kế hoạch ở đầu progress.md.
- Mọi sai khác so với thiết kế và các phát hiện còn mở: [docs/design/sai-khac.md](docs/design/sai-khac.md). Cơ chế thêm phải là tham số có tên, có cơ sở; chỉ để làm số đẹp thì dừng lại báo.
- Việc đang làm, giả định đã chọn, việc kế tiếp: [docs/progress.md](docs/progress.md). Đọc file đó và `git log` trước khi làm bất cứ gì.

## Ai làm gì

Dương quyết ngày 15/11/2026. **Phân việc chỉ đổi khi Dương yêu cầu.** Cuối mỗi giai đoạn, nếu thấy phân việc không còn hợp lý thì đề xuất với Dương, không tự sửa.

- **Người điều phối** là model của phiên chính (từ 16/11/2026: Opus). Giữ phần cần phán đoán: thiết kế, viết spec và đề xuất, đọc và đánh giá kết quả kiểm định, chẩn đoán kiểm định hỏng, đọc nguồn, soát chống vá ngầm, viết báo cáo cho Dương. Không tự code phần lớn.
- **Sonnet code.** Mọi việc viết code (engine, giao diện, test) và việc cho chạy kiểm định, người điều phối giao cho subagent chạy model Sonnet.
- **Mỗi lần giao việc cho Sonnet phải ghi rõ:** việc gì, trạng thái hiện tại, file cần đọc, tiêu chí xong. Không giả định Sonnet biết gì ngoài lời giao. Kèm nguyên văn luật này:

  > Bạn làm phần code theo đặc tả. Gặp quyết định không có sẵn trong đặc tả, progress.md hoặc sai-khac.md, hoặc test hỏng mà nguyên nhân không rõ ràng: DỪNG và báo lại, không tự chọn cách sửa, không sửa test hay ngưỡng kiểm định. Xong mỗi bước: chạy test nhanh, commit, báo lại thay đổi.

- **Review code của Sonnet trước khi nhận**: đọc diff, nhất là diff của `tests/` và `src/content/scenarios.ts`.
- **Đầu mỗi phiên: chạy `git status`.** Nếu có thay đổi chưa commit từ lượt bị ngắt thì review trước; không chắc đúng thì bỏ và làm lại bước đó.
- **Xong mỗi bước nhỏ: commit và cập nhật progress.md ngay**, để hết quota lúc nào phiên sau cũng làm tiếp được.
- **Người điều phối chạy [chong-va-ngam.md](docs/design/chong-va-ngam.md) trước khi báo xong mỗi giai đoạn** (và mỗi mốc lớn M1, M2...). Cụ thể: `npm test` qua, trong đó có `tests/unit/chot-chan.test.ts`; đi hết bảng "Cần người soát" và ghi kết quả từng dòng vào báo cáo giai đoạn; phần "chưa kiểm" đứng trước phần "đã đạt"; liệt kê mọi thay đổi trong `tests/unit` và khẳng định kịch bản kèm lý do. Thiếu bước này thì chưa được báo xong.
- **Dừng lại báo Dương** khi gặp một trong bảy trường hợp ở chong-va-ngam.md mục "Khi nào phải dừng lại báo Dương". Sonnet gặp thì báo người điều phối, người điều phối báo Dương. Không ai tự quyết thay.
- Kiểm định thống kê đầy đủ: Sonnet cho chạy (ghi log ra file, chạy từng phần), người điều phối đọc và đánh giá. Không sửa engine trong lúc nó chạy.

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/design/gd0.md](docs/design/gd0.md) | Nền móng kỹ thuật: stack, kiến trúc engine, sổ cái, chuỗi nhân quả, giao thức engine-UI, cấu hình luật, kiểm định GĐ0 |
| [docs/design/gd1.md](docs/design/gd1.md) | Lõi kinh tế: quy tắc hành vi từng loại tác nhân, thị trường, tiền, thuế, phi chính thức, kỳ vọng, kiểm định GĐ1, kịch bản |
| [docs/design/de-xuat.md](docs/design/de-xuat.md) | Đề xuất sáng tạo và phản biện, kèm trạng thái duyệt từng mục |
| [docs/design/sai-khac.md](docs/design/sai-khac.md) | Mọi sai khác so với thiết kế đã duyệt, phát hiện và việc còn mở |
| [docs/design/chong-va-ngam.md](docs/design/chong-va-ngam.md) | Bảng kiểm chống vá ngầm rút từ GĐ1. Đọc trước khi sửa engine hoặc sửa một kiểm định |
| [docs/design/phac-thao-gd3-gd5.md](docs/design/phac-thao-gd3-gd5.md) | Phác thảo GĐ3 và GĐ5 (chưa phải spec): cơ chế lõi, thứ tự xây, cạm bẫy, kiểm định then chốt, nguồn nên đọc |
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
11. **Sau MỖI bước nhỏ, làm đủ 3 việc** (Dương yêu cầu ngày 13/11/2026):
    1. Chạy test nhanh của phần vừa sửa: `npm test` (chỉ `tests/unit`). Không chạy kiểm định thống kê ở bước này.
    2. `git commit` với lời nhắn rõ.
    3. Cập nhật mục "Đang ở đâu" trong `docs/progress.md`: xong gì, đang dở gì, bước tiếp theo.
12. **Kiểm định thống kê đầy đủ** (`npm run validate:gdN`, nhiều seed × 480 tháng) chỉ chạy ở cuối mỗi mốc lớn (M1, M2... trong spec giai đoạn).
13. **Test in kết quả gọn.** Vitest dùng reporter `dot`: chỉ in chi tiết khi có lỗi. Test không tự `console.log` khi qua.
14. Không xoá file hay chạy lệnh ngoài thư mục dự án.
15. **Chốt chặn chống vá ngầm không được nới.** `tests/unit/chot-chan.test.ts` hỏng nghĩa là có thay đổi cần ghi lại hoặc cần người duyệt: làm đúng việc thông báo lỗi yêu cầu (ghi dòng vào sai-khac.md mục F, bổ sung nguồn, tìm mã lý do còn thiếu). Không sửa test, không nâng trần, không tăng số mục "trí nhớ". Đổi ngưỡng, cửa sổ đo hay cách đo của một kiểm định phải được Dương duyệt trước.

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

GĐ0 nền móng kỹ thuật → GĐ1 lõi kinh tế → **GĐ1.5** đánh bóng trải nghiệm → **GĐ3** tài sản và tài chính (kèm **GĐ1 update 1**) → **GĐ5** mở cửa → **GĐ2** con người → GĐ4 cấu trúc thị trường → GĐ6 không gian và vật chất → GĐ7 môi trường và rủi ro → GĐ8 thể chế và xã hội → GĐ9 hiệu chỉnh tinh theo dữ liệu thật.

**GĐ1.5 - Đánh bóng trải nghiệm** (thêm ngày 13/11/2026). Bắt đầu sau khi GĐ1 qua kiểm định. Một mốc riêng cho UI/UX: hệ thiết kế (màu, chữ, phong cách isometric theo skill anatomy), điều hướng 3 vai, cảm giác "sống" của bản đồ, onboarding. Các giai đoạn sau dùng lại hệ thiết kế này, và mỗi giai đoạn có tiêu chí nghiệm thu UI ghi trong spec của nó. Spec viết vào `docs/design/gd1-5.md` khi tới lượt, theo đúng quy trình thiết kế rồi chờ duyệt. Hệ quả cho GĐ0 và GĐ1: giao diện ở hai giai đoạn này chỉ cần đúng chức năng và đọc được, chưa cần đẹp.

**GĐ1 update 1** (Dương quyết 15/11/2026). GĐ1 chốt là một nền kinh tế **không tăng trưởng**, không phát triển thêm cơ chế. Nhóm việc sau làm cùng GĐ3: biên lãi hồi dần sau khi đổi thuế (việc 8), tăng giá đón trước ngày thuế có hiệu lực (8b), phân tích độ nhạy và soát nguồn tham số (5), lấp phần GDP danh nghĩa chưa gán lý do (6), đề xuất tăng năng suất (3, có thể thuộc GĐ4), quy tắc giữ người qua tháng bán chậm để hạ thất nghiệp (việc 2; bản dải tồn kho Lengnick S38 đã thử ngày 15/11/2026 và không hợp, xem sai-khac.md D11). Đặc tả từng việc ở progress.md. Mục tiêu hiệu chỉnh về tiền, tín dụng, tăng trưởng (và lạm phát, bội chi đi theo chúng) chuyển sang GĐ4.

Nội dung từng giai đoạn ở KICKOFF.md, với các thay đổi đã duyệt:
- Lương tối thiểu vùng chuyển từ GĐ2 về GĐ1. BHXH và phần còn lại của GĐ2 giữ nguyên.
- Kiểm định K1.31 (nâng mạnh lương tối thiểu) chuyển sang GĐ2 (Dương quyết 14/11/2026): cần lương phân tán theo kỹ năng. Lý do: [sai-khac.md mục D6](docs/design/sai-khac.md).
- Vốn cố định dạng đơn giản có ngay GĐ1; đời máy, R&D vẫn ở GĐ4.
- Thêm vào GĐ3: tín dụng ngoài ngân hàng (hụi họ, tín dụng đen) và thị trường liên ngân hàng.
- Thêm vào GĐ3 (Dương quyết 14/11/2026): vay tiêu dùng của hộ (kênh lãi suất tới cầu, để K1.19 đạt) và cơ chế giảm phát nợ. Lý do và số đo: [sai-khac.md mục D](docs/design/sai-khac.md).
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
