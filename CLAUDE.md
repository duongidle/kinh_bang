# KINH BANG

Web app mô phỏng nền kinh tế một quốc gia giả lập theo Việt Nam, chơi như game. Mục đích: giúp người chơi hiểu cách nền kinh tế vận hành. Kết quả phải tự sinh ra từ hành vi tác nhân, không được vẽ tay.

Đề bài gốc và quy trình làm việc: [KICKOFF.md](KICKOFF.md). File này là bản tóm tắt để bất kỳ model nào đọc xong cũng làm tiếp được.

## Trạng thái

- Thiết kế GĐ0 + GĐ1 đã được duyệt ngày 13/11/2026. Engine GĐ1 xong. Dương quyết 15/11/2026: hoàn thiện GĐ1 rồi sang GĐ1.5, không thêm cơ chế. GĐ1 được chốt có điều kiện ngày 15/11/2026 ([docs/validation/chot-gd1.md](docs/validation/chot-gd1.md)), nên không chặn GĐ1.5; ngoại lệ ghi ở [docs/lo-trinh.md](docs/lo-trinh.md). Đang làm GĐ1.5; kế hoạch ở đầu progress.md.
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
- **Người điều phối chạy [chong-va-ngam.md](docs/design/chong-va-ngam.md) trước khi báo xong mỗi giai đoạn** (và mỗi mốc lớn M1, M2...). Cụ thể: `npm test` qua, trong đó có `tests/unit/chot-chan.test.ts`; đi hết bảng "Cần người soát" và ghi kết quả từng dòng vào báo cáo giai đoạn; phần "chưa kiểm" đứng trước phần "đã đạt"; liệt kê mọi thay đổi trong `tests/unit` và khẳng định kịch bản kèm lý do. Thiếu bước này thì chưa được báo xong. Ngoại lệ duy nhất: bảng kiểm cho GĐ1 dời sang đầu GĐ3 (Dương quyết 15/11/2026, [docs/lo-trinh.md](docs/lo-trinh.md)).
- **Dừng lại báo Dương** khi gặp một trong bảy trường hợp ở chong-va-ngam.md mục "Khi nào phải dừng lại báo Dương". Sonnet gặp thì báo người điều phối, người điều phối báo Dương. Không ai tự quyết thay.
- Kiểm định thống kê đầy đủ: Sonnet cho chạy (ghi log ra file, chạy từng phần), người điều phối đọc và đánh giá. Không sửa engine trong lúc nó chạy.

## Tiêu chuẩn người điều phối

Dương đặt ngày 15/11/2026, rút từ cách làm ở cuối GĐ1. Áp cho mọi model giữ vai điều phối, ở mọi giai đoạn. Mục "Ai làm gì" nói ai làm việc gì; mục này nói làm tới mức nào thì đạt.

1. **Xem trước khi tin.** Đầu phiên: `git status`, `git log`, `npm test`, rồi mới đọc progress.md. progress.md có thể cũ: đối chiếu từng câu "đã chạy", "đang chờ" với commit và với dòng "Bản code" trong báo cáo kiểm định. Thấy dòng cũ thì ghi là cũ ngay, đừng để phiên sau tin nhầm.
2. **Phần phán đoán làm xong trước khi giao.** Câu chữ của một lời giải thích, cửa sổ đo, khẳng định nào bỏ, giá trị nào chọn: người điều phối tự đo, tự quyết, rồi đưa Sonnet **nguyên văn** để áp. Sonnet không phải đoán ý.
3. **Lời giao đọc một mình là đủ.** Ngoài bốn thứ bắt buộc (việc gì, trạng thái, file cần đọc, tiêu chí xong) phải có: từng bước theo thứ tự và mỗi bước một commit; những thứ KHÔNG được đụng; nội dung phải báo lại; và việc phải làm ở những chỗ biết trước sẽ vướng.
4. **Lường trước chỗ sẽ đỏ.** Trước khi giao, tự hỏi: bước nào sẽ làm chốt chặn đỏ đúng thiết kế (đổi `gd1-lib.ts` thì cần dòng mục F), thay đổi nào buộc phải chạy lại kiểm định nào, file nào hai bên có thể cùng sửa. Ghi câu trả lời vào lời giao. Sonnet gặp chỗ đã được báo trước thì làm tiếp được; gặp chỗ chưa báo thì dừng.
5. **Đo rồi mới viết.** Một kiểm định hỏng: lấy số đo từng seed theo từng năm, so với nhiễu giữa các seed, rồi mới kết luận. Hiệu nhỏ hơn nhiễu thì bỏ khẳng định, không đổi cửa sổ cho tới khi qua. Phân biệt rõ ba trường hợp khi báo: bài học giữ nguyên, bài học đổi thời điểm hay mức độ, bài học bị đảo. Bị đảo thì báo Dương bằng một dòng riêng.
6. **Review bằng diff, không bằng báo cáo.** Đọc `git diff` của mọi thứ Sonnet nộp, nhất là `tests/`, `src/content/scenarios.ts`, `sai-khac.md`. So báo cáo kiểm định mới với bản trước: mục nào đổi trạng thái, mục nào tụt xuống sát ngưỡng. Mục qua đúng 8/10 ghi là yếu.
7. **Việc chạy lâu: một lệnh, có dấu vết, không ngó.** Chạy nền, ghi log và giờ bắt đầu, kết thúc, mã thoát ra file; chờ thông báo, không kiểm tra định kỳ; không sửa `src` hay `tests` trong lúc chạy. Chỉ chạy đúng phần Dương cho chạy.
8. **Báo cáo để người đọc quyết được.** Thứ tự: chưa làm và chưa kiểm, rồi cái bị đảo hoặc yếu, rồi mới tới cái đã đạt. Mỗi số kèm số seed và mã commit. Việc tự thêm ngoài lời yêu cầu thì nói rõ là tự thêm. Không viết "xong" cho việc mới giao đi, không đoán kết quả của việc đang chạy.
9. **Giữ đúng phạm vi.** Thấy lỗi nằm ngoài việc được giao: cùng loại và chắc chắn thì sửa kèm và nói; không chắc thì ghi vào progress.md hoặc sai-khac.md, không tự mở việc mới. Không tự chạy thêm kiểm định, không tự push, không tự bắt đầu mốc kế tiếp khi Dương chưa bảo.
10. **Dương đổi lệnh giữa chừng thì dừng thật.** Ngắt việc đang chạy nền, xem nó đã để lại gì (`git status`, file mới, tiến trình còn sống), báo đúng trạng thái đó. Không để việc cũ chạy nốt.
11. **Lúc nào cũng bàn giao được.** Sau mỗi bước: commit, progress.md nói đúng "xong gì, dở gì, kế tiếp là gì, đang chờ ai". Quyết định của Dương ghi kèm ngày vào đúng file nó chi phối (spec, sai-khac.md, progress.md), không chỉ nằm trong cuộc trò chuyện.
12. **Cửa ra production.** Trước khi báo xong một mốc có đụng tới app: `npm test`, `npx tsc --noEmit`, `npx eslint src tests`, `npm run build` đều qua; tự mở app bằng trình duyệt ở 50 và 5.000 hộ, sáng và tối, console không có lỗi; lưu, tải ván, mở ván lưu của bản trước, và chạy offline còn dùng được; sổ kế toán không báo lệch. Mục nào chưa kiểm thì ghi "chưa kiểm", không bỏ qua trong im lặng. Phiên không có công cụ trình duyệt thì ghi "chưa kiểm bằng trình duyệt" và liệt kê từng bước để Dương tự mở kiểm tra; không được ghi là đã xem.

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/design/gd0.md](docs/design/gd0.md) | Nền móng kỹ thuật: stack, kiến trúc engine, sổ cái, chuỗi nhân quả, giao thức engine-UI, cấu hình luật, kiểm định GĐ0 |
| [docs/design/gd1.md](docs/design/gd1.md) | Lõi kinh tế: quy tắc hành vi từng loại tác nhân, thị trường, tiền, thuế, phi chính thức, kỳ vọng, kiểm định GĐ1, kịch bản |
| [docs/design/de-xuat.md](docs/design/de-xuat.md) | Đề xuất sáng tạo và phản biện, kèm trạng thái duyệt từng mục |
| [docs/design/sai-khac.md](docs/design/sai-khac.md) | Mọi sai khác so với thiết kế đã duyệt, phát hiện và việc còn mở |
| [docs/design/chong-va-ngam.md](docs/design/chong-va-ngam.md) | Bảng kiểm chống vá ngầm rút từ GĐ1. Đọc trước khi sửa engine hoặc sửa một kiểm định |
| [docs/design/phac-thao-gd3-gd5.md](docs/design/phac-thao-gd3-gd5.md) | Phác thảo GĐ3 và GĐ5 (chưa phải spec): cơ chế lõi, thứ tự xây, cạm bẫy, kiểm định then chốt, nguồn nên đọc |
| [docs/lo-trinh.md](docs/lo-trinh.md) | Lộ trình: thứ tự giai đoạn, nội dung đã đổi so với KICKOFF.md, quy trình mỗi giai đoạn, ngoại lệ GĐ1 |
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

GĐ0 → GĐ1 → GĐ1.5 → GĐ3 (kèm GĐ1 update 1) → GĐ5 → GĐ2 → GĐ4 → GĐ6 → GĐ7 → GĐ8 → GĐ9.

Nội dung từng giai đoạn, các thay đổi đã duyệt so với KICKOFF.md, quy trình mỗi giai đoạn và ngoại lệ GĐ1: [docs/lo-trinh.md](docs/lo-trinh.md).

## Móc nối đã để sẵn cho giai đoạn sau

- Khoản vay có trường tài sản thế chấp (GĐ3 dùng cho đất, nhà).
- Doanh nghiệp và ngân hàng có trường chủ sở hữu, Nhà nước là chủ sở hữu hợp lệ (GĐ4).
- Hộ có trường kỹ năng, tuổi, số người phụ thuộc (GĐ2).
- Mọi tác nhân có ô vị trí trên lưới; GĐ1 chỉ dùng để vẽ, GĐ6 mới có ý nghĩa kinh tế.
- Sổ cái nhận loại công cụ tài chính mới (ngoại tệ, vàng, cổ phiếu) mà không đổi lõi.
- Luật có nhiều phiên bản theo ngày hiệu lực; kịch bản lịch sử nạp bộ tham số của thời kỳ đó.
