# Nhật ký tiến độ

Mới nhất ở trên. Model tiếp quản: đọc mục "Đang ở đâu" trước, rồi `git log`.

## Đang ở đâu

Cập nhật mục này sau MỖI bước nhỏ (CLAUDE.md quy tắc 11).

### U2 (Dương bảo làm ngày 16/11/2026; ĐANG LÀM)

Spec: gd1-5.md mục 4 (gồm 4.4 cài đặt ban đầu dùng `setup.laws`, như spec hiện tại), mục 3.5, mục 12 dòng 7 (nhãn "Tự do (sandbox)", mục thuật ngữ `van-tu-do`). U2 KHÔNG làm phần của U6b (mục 4.5).

**Danh sách chức năng GĐ1 đang tới được** (người điều phối lập 16/11 từ `App.tsx`, `RolePanel.tsx`, `Drawer.tsx`, `store.ts`, `IsoMap.tsx` ở `e3aa4e8`; spec mục 13 dòng 9). Cuối U2 đối chiếu từng dòng.
- F1 Màn hình đầu: ván tự do chọn quy mô (3 mức) và hạt giống; 15 kịch bản, mỗi thẻ có câu hỏi, vai, số năm, "nên hiểu trước", nhãn "đã xong" (localStorage `kb.done`), nhãn "ngoài vùng đã kiểm định"; kịch bản chạy với hạt giống đang chọn; mở ván đã lưu (trình duyệt và file).
- F2 Lúc dựng: chữ "Đang dựng nền kinh tế", lỗi kèm nút về màn hình đầu.
- F3 Thanh trên: về màn hình đầu; ngày tháng ("Chưa chạy" ở tháng 0); tốc độ Dừng/×1/×4/×16/Tối đa; +1 tháng (chỉ khi dừng); chọn vai (tự do: 6 vai; kịch bản: vai kịch bản và Quan sát); tên ván, quy mô, hạt giống, ms mỗi tháng.
- F4 Dải "đã sửa quy luật" và nút so với thế giới gốc.
- F5 Bản đồ: bấm công trình mở sổ tác nhân; chú giải dòng tiền; dòng "vị trí chỉ để nhìn".
- F6 Bản tin 5 mục, tô tốt/xấu, mục có chỉ số bấm mở chuỗi nhân quả.
- F7 Dải 10 chỉ số, đường nhỏ, bấm mở chuỗi nhân quả.
- F8 Hộp đoán: mở đầu kịch bản (câu hỏi, giới thiệu, các lựa chọn, cảnh báo ngoài vùng) và đoán; sau mỗi lần ban hành luật hỏi đoán 3 chỉ số; Bỏ qua / Ghi lại và chạy; mô phỏng chờ khi hộp đang mở.
- F9 Thông báo lỗi; sổ kế toán không cân thì dừng và báo.
- F10 Phím cách dừng/chạy, Esc đóng ngăn.
- F11 Thẻ kịch bản: mục tiêu đạt/chưa, số tháng còn, "Xem lời giải thích" (thắng thì ghi `kb.done`).
- F12 Lối tới: Biểu đồ, Nguồn tiền, Soi tác nhân, Phòng thí nghiệm, Mô hình bỏ qua gì, Lưu/tải/xuất.
- F13 Bảng chính sách: theo vai lọc luật theo `owner`; ô "để máy điều hành" bên kia (`cb.autopilot`, `gov.autopilot`); liên kết "Vì sao lãi suất yếu, room tín dụng mạnh?" (ghi chú `lai-suat-yeu`); mỗi luật: ô nhập, đơn vị, Ban hành, kẹp min/max, ghi chú, nguồn; luật bật/tắt là ô đánh dấu; ban hành xong hỏi đoán.
- F14 Vai hộ/doanh nghiệp: chọn tác nhân có tên; xem sổ sách; thả ra (chỉ ván tự do); hộ: chi tiêu, lương thấp nhất chịu nhận, nghỉ việc, ra tự làm; doanh nghiệp: giá, lương, số người, số máy; mỗi ô có phương án quy tắc tự động, "Tự lái" để trả lại.
- F15 Quan sát: 16 chỉ số mở rộng bấm được; danh sách người đang theo dõi bấm mở sổ.
- F16 Lời đoán: 3 lời gần nhất, chờ chấm hoặc kết quả từng chỉ số.
- F17 Dòng sự kiện 12 mục gần nhất, trước → sau, người ban hành, "Nếu không làm vậy thì sao?" cho lệnh của người chơi.
- F18 Chuỗi nhân quả: biểu đồ có mốc sự kiện, khoảng 3 tháng/1/3/10 năm, chỉ số suy ra mượn phân rã của chỉ số gốc kèm câu nói rõ, câu "Phân rã..." và liên kết "Khác gì với đối chứng?", cây có thanh ngang, "Lý do này đến từ đâu", nút luật/sự kiện có "Nếu không làm vậy thì sao?", vòng phản hồi, điểm gốc.
- F19 Sổ tác nhân: bảng chữ T, vốn ròng, sự kiện, quyết định gần đây và lý do, giao dịch gần đây, "Điều khiển ... này" (ván tự do).
- F20 Soi tác nhân: doanh nghiệp/hộ/ngân hàng (200 dòng), Kho bạc, NHNN.
- F21 Nguồn tiền: tháng này/1 năm/5 năm, thanh ngang, thay đổi ròng, tiền mặt và tiền gửi.
- F22 Phòng thí nghiệm: biến thể quy tắc kèm "học được gì", nguồn, nhãn "gốc"; so với thế giới gốc; tìm và đổi tham số hành vi (trừ `init.*`).
- F23 Mô hình bỏ qua gì: các ghi chú (mở đúng mục khi đến từ liên kết), danh sách thứ chưa có.
- F24 So sánh đối chứng: chọn chỉ số, hai đường, bảng 13 chỉ số tháng cuối.
- F25 Báo cáo kịch bản: đạt/chưa, mục tiêu, giải thích, khẳng định kiểm trên ván này, so sánh các lựa chọn (chạy nhánh), lời đoán, ngoài đời, đơn giản hoá, xem hai thế giới cạnh nhau, về danh sách.
- F26 Biểu đồ: theo nhóm chỉ số, tên bấm mở nhân quả.
- F27 Lưu vào trình duyệt, xuất file ván, xuất CSV, danh sách ván lưu (mở, xoá), mở từ file.
- F28 PWA chạy offline; `?design` chỉ bản dev.

**Quyết định của người điều phối cho U2** (16/11, tự quyết theo spec mục 13, đã xét phương án khác):
- **Hai truy vấn đọc `events` và `setupInfo`, giao thức lên 3** (ghi ở spec mục 10). Bỏ: giao diện đọc thẳng `src/config` (hai nguồn số cho một luật); dựng ván thử rồi dựng lại (rối `store.ts`).
- **Nhóm luật theo việc** là bảng hằng trong `src/ui`, không đổi `group` trong config: Thuế (chia nhỏ theo nhóm config: GTGT, TNCN, TNDN, Hộ kinh doanh, và `tax.indirect.other`, `gov.fees.rate`), Chi tiêu (`gov.purchase.share`, `gov.public.share`, `gov.wage.premium`, `gov.transfer.unemployed`, `gov.transfer.universal`), Vay và in tiền (`gov.deficit.target`, `gov.debt.ceiling`, `gov.bond.spread`, `cb.monetize`, `cb.omo.auto`), Lãi suất (`cb.rate.refinancing`, `cb.deposit.cap`, `cb.inflation.target`), Dự trữ (`cb.reserve.ratio`, `cb.reserve.interest`, `bank.car.min`), Room tín dụng (`cb.room.enabled`, `cb.credit.room`), Lương tối thiểu (`minwage.zone.1-4`). Vai chỉ giữ một bên thì nhóm chỉ hiện luật có `owner` của bên đó. Test: mọi luật trong danh mục có đúng một nhóm. Bỏ: đổi `group` trong `laws.ts` (đụng config).
- **Vai trong store giữ nguyên kiểu `Role`** (6 giá trị, giao thức không đổi). Tab Chính phủ có nhóm nút "Bạn giữ: Bộ Tài chính / NHNN / Cả hai" (mặc định Cả hai); tab Người tham gia có "Hộ gia đình / Doanh nghiệp". Bỏ: đổi `Role` thành 3 giá trị (đổi giao thức, kịch bản khai vai cũ).
- **Màu dòng tiền trên bản đồ và chú giải lấy từ `tokens.ts`** ngay ở U2 (spec 3.2: một màu một giá trị ở mọi nơi); loại "khác" dùng màu chữ mờ. Màu công trình giữ tới U4.
- **"Mô hình bỏ qua gì" và "Lưu, tải, xuất" là hộp thoại** mở từ menu; bốn màn hình riêng đúng như spec 4.2. Bỏ: thêm hai màn hình riêng (spec chỉ kể bốn).
- **"Tiếp tục ván gần nhất"**: lúc lưu ghi tên khoá vào localStorage `kb.last`; nút chỉ hiện khi khoá đó còn trong IndexedDB. Bỏ: suy từ thứ tự tên khoá (đang xếp theo chữ, không theo thời gian).
- **Hạt giống của kịch bản**: lộ trình có ô "Tuỳ chọn" thu gọn chứa hạt giống, dùng chung với ván tự do (giữ F1).

**Phát hiện, sửa ghi chép cũ (16/11):** dòng "giao diện hiện không có chỗ nào gọi `store.param`" ở `e1b4aa9` là SAI. Phòng thí nghiệm (`Drawer.tsx` `ParamRow`) và ô "để máy điều hành" (`RolePanel.tsx`) đều gọi. Vì `Session.setParam` không bật `meta.modified`, người chơi đổi tham số hành vi trong Phòng thí nghiệm thì **không có dải "đã sửa quy luật"**: lỗi đang xảy ra, trái nguyên tắc spec mục 1. Sửa phải đụng engine (và phải tách hai tham số `*.autopilot` vốn là lựa chọn vai, không phải sửa quy luật), nên CHỜ DƯƠNG. U2 giữ nguyên hành vi này, không tự sửa.

**Giới hạn đã biết, ngoài U2:** sau khi tải ván, `eventLog` của Session rỗng nên sự kiện cũ có `index = -1`, không có nút "Nếu không làm vậy thì sao?" cho các lệnh trước lúc lưu. Có từ GĐ1, chưa sửa.

- U2 bước A1 xong: `scripts/hash-check.ts` (sáu ván, 24 tháng qua Session, in mã băm) và `scripts/hash-baseline-u2.txt` (mã băm gốc trước U2, code bdf52ee; phải không đổi tới cuối U2). `npm test` xanh 100/100. Commit: `U2 bước A1` trong git log.
- U2 bước A2 xong: giao thức lên 3 (`src/protocol/index.ts`: truy vấn `events`, `setupInfo`, kiểu `SetupInfo`); `src/engine/session/session.ts` thêm hai nhánh truy vấn và tách `lawInfos`/`ruleInfos` dùng chung với `catalog()`; `setupInfo` dựng thế giới tạm, chạy được khi chưa `init`. `npm test` xanh 100/100, mã băm sáu ván không đổi. Commit: `U2 bước A2` trong git log.
- U2 bước A3 xong: `tests/unit/setup-init.test.ts` (6 test: `setupInfo` khi chưa init và khớp `tick.laws`; luật đặt ở tháng 0 qua `setup.laws` có trong tick, `events`, qua lưu/tải; không kích hoạt `gov.revenueUse`; đối chiếu có kích hoạt; `setup: {}` cùng mã băm). Test 5 dùng tháng 3, xem D17. Mã băm trùng 6/6. `npm test` xanh 106/106. Commit: `U2 bước A3` trong git log.
- U2 bước A4 xong: app nạp lớp design (`main.tsx`), `app.css` bỏ biến màu cũ và dùng token (màu, cỡ chữ, bo góc, `--font-sans`/`--font-num`), `src/ui/theme.ts` (system/light/dark, `window.__theme` chỉ bản dev, chưa có nút), `IsoMap.tsx` và `Chart.tsx` theo `resolvedTheme()` và vẽ lại khi đổi theme, màu dòng tiền bản đồ lấy từ `tokens.ts`. `tsc`, `eslint` (0 lỗi), `build` qua; `npm test` xanh 106/106; mã băm trùng 6/6. Chưa kiểm bằng trình duyệt. Commit: `U2 bước A4` trong git log.
- U2 bước B1 xong: `store.ts` bỏ `panel`/`open`, thay bằng `left` (ngăn xếp: `openLeft`, `backLeft`, `closeLeft`), `screen` (`openScreen`), `dialog` (`openDialog`); `start` nhận `setup` (chỉ gửi khi có); tin `ready` gửi truy vấn `events` và thay `events`; `src/ui/saves.ts` (`listSaves`, `loadSave`, `deleteSave`, `saveCurrent(name, bytes)`, `lastSave`, `kb.last`). Mọi chỗ gọi `open` đã đổi; Drawer tạm đọc `dialog ?? screen ?? left` (tách ở B5). `npm test` xanh 106/106, `tsc` qua, `eslint` 0 lỗi. Chưa kiểm bằng trình duyệt. Commit: `U2 bước B1` trong git log.
- U2 bước B2 xong: `src/ui/learningPath.ts` (xếp tô-pô ổn định theo `prereq`, bỏ prereq lạ, vòng thì nối theo thứ tự gốc), `src/ui/delta.ts` (`delta12`, `deltaKindOf`), `tests/unit/learning-path.test.ts` (15 kịch bản thật, ca prereq lạ, ca vòng) và `tests/unit/delta.test.ts`. `npm test` xanh 117/117, `tsc`, `eslint` qua. Commit: `U2 bước B2` trong git log.
- U2 bước B3 xong: `src/ui/screens/Home.tsx` + `screens.css` (ba khối: lộ trình học theo `learningPath` với thẻ có nhãn Đã xong/Ngoài vùng đã kiểm định và nhấn thẻ đầu ở lần đầu; Tự do (sandbox) với quy mô, hạt giống, Bắt đầu, Tiếp tục ván gần nhất, chỗ chừa cho cài đặt ban đầu của đợt C; Ván đã lưu và Mở từ file đi thẳng `loadBytes`). Bỏ `Menu` và CSS chết của nó. `npm test` xanh 117/117, `tsc`, `eslint` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước B3` trong git log.
- U2 bước B4 xong: `src/ui/frame/` có `TopBar.tsx` (nút Kinh Bang, tên ván, ngày, tốc độ bằng SegmentedControl, +1 tháng, tab vai bằng Tabs, bốn nút Biểu đồ/Nguồn tiền/Soi tác nhân/Phòng thí nghiệm, Menu), `AppMenu.tsx` (Lưu ván, Lưu tải xuất, Mô hình bỏ qua gì, Giao diện Theo máy/Sáng/Tối, dòng quy mô và ms, Về màn hình đầu; đóng khi bấm ngoài hoặc Esc), `Banners.tsx` (đã sửa quy luật; ngoài vùng đã kiểm định), `frame.css`. Bỏ `window.__theme`, dòng meta và CSS chết của thanh trên cũ. Lựa chọn con của tab vai (Bạn giữ / Bạn nhập vai, hoặc "Vai của kịch bản") đã đặt tạm ở đầu `RolePanel` để không mất việc chọn Bộ Tài chính/NHNN; toolbar cũ trong RolePanel còn tới B5. `npm test` xanh 117/117, `tsc`, `eslint`, `build` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước B4` trong git log.
- U2 bước B5 xong: bố cục lưới (thanh trên, dải cảnh báo, sân khấu, dải chỉ số, dòng thời gian); `Drawer.tsx` tách thành `src/ui/views/` (Causal, Agent, Agents, Money, Lab, Notes, Compare, Report, Charts, Files, useQuery; nội dung và chữ giữ nguyên) và đã xoá; `frame/LeftPanel.tsx` (SidePanel trái, nút quay lại khi có từ 2 phần tử), `ScreenView.tsx` (phủ sân khấu và dải chỉ số), `Dialogs.tsx` (notes, file, events) và `GuessDialog.tsx` (hộp đoán dùng Dialog, chỉ hiện khi `dialog` là null), `Strip.tsx` (StatTile, mức đổi 12 tháng từ `delta12`), `TimelineBar.tsx` + `EventList.tsx` (mốc ▲ ● ◆ · theo người ban hành, bảng nổi theo tháng, "Mọi sự kiện"); bản tin thành ô thu gọn ở góc trên phải kèm ▲/▼, chú giải xuống góc dưới trái; RolePanel bỏ thanh công cụ và Timeline; Esc: hộp thoại tự xử lý, rồi màn hình riêng, rồi ngăn trái. Bỏ `Spark` và CSS chết. `npm test` xanh 117/117, `tsc`, `eslint`, `build` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước B5` trong git log.
- U2 bước B6 xong: đối chiếu F1-F28, không dòng nào mất (bảng đối chiếu nằm trong báo cáo của Sonnet cho người điều phối). `npx tsx scripts/hash-check.ts` trùng `hash-baseline-u2.txt` 6/6. Đợt B xong code; CHƯA kiểm bằng trình duyệt (người điều phối tự mở: 50 và 5.000 hộ, sáng và tối). Đợt C (nội dung bảng vai, cài đặt ban đầu, đổi "cậu" thành "bạn") chưa làm. Commit: `U2 bước B6` trong git log.
- U2 bước C1 xong: `LawInfo` thêm `doc`, `article`, `effective` (chỉ sửa `lawInfos` trong session.ts và chú thích PROTOCOL_VERSION; giao thức vẫn 3); `src/ui/lawGroups.ts` (bảng nhóm luật theo việc, `groupLaws`), `src/ui/LawField.tsx` + `law.css` (ô nhập, dòng "Hiện hành", thẻ nguồn dùng chung), bảng Chính phủ trong `RolePanel.tsx` theo nhóm mới, nút Ban hành chỉ bật khi giá trị nháp khác hiện hành, luật bật/tắt là SegmentedControl ban hành ngay. `tests/unit/law-groups.test.ts` (5 test). `npm test` xanh 129/129, `tsc`, `eslint` qua, mã băm trùng 9/9, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước C1` trong git log.
- U2 bước C2 xong: `RolePanel.tsx` vai Người tham gia thành ba khối (Tình hình của tôi: vốn ròng và `facts` từ truy vấn `agent` mỗi tháng, nút Xem sổ sách và Thả ra; Quyết định tháng này: các ô Lever giữ nguyên; Lý do của quy tắc tự động: `decisions` của tháng gần nhất có quyết định, hoặc "Tháng này quy tắc không đổi gì."); vai Quan sát thêm khối Bản tin (toàn bộ `news`, mới nhất trên, ▲/▼, bấm mở chuỗi nhân quả). `format.ts` thêm `factText` (rút từ `views/Agent.tsx`, hai nơi dùng chung). `npm test` xanh 129/129, `tsc`, `eslint` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước C2` trong git log.
- U2 bước C3 xong: `src/ui/setup.ts` (`buildSetup`, `changedCount`), `src/ui/screens/SetupBlock.tsx` (khối "Cài đặt ban đầu" đóng mặc định, tải `setupInfo` một lần khi mở lần đầu; nhóm Luật theo `groupLaws` với nút "Về mức hiện hành", nhóm Quy luật với biến thể đầu ghi "(gốc)"), Home gửi `setup` chỉ khi có mục đổi và có câu giải thích dưới khối; glossary thêm `van-tu-do`. `tests/unit/setup-build.test.ts` (7 test). `npm test` xanh 136/136, `tsc`, `eslint`, `build` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước C3` trong git log.
- U2 bước C4 xong: mọi chữ "cậu" trong `src/ui` đổi thành "bạn" (RolePanel, GuessDialog, Lab, Report, Compare); `grep -rn "cậu" src/ui` rỗng. `GlossaryTerm` đặt ở: Home (nhãn Hạt giống, hai ô), bảng Chính phủ (chú thích đầu thân nhóm Vay và in tiền, Lãi suất, Dự trữ, Room tín dụng, Lương tối thiểu; tiêu đề nhóm con Thuế GTGT, TNCN, TNDN), Causal ("Phân rã"), Lab (câu đầu). Bỏ qua: "đối chứng" trong nút "Khác gì với đối chứng?" (lồng trong nút) và nhãn "Lãi suất tái cấp vốn" (nhãn ô nhập là chuỗi). `npm test` xanh 136/136, `tsc`, `eslint` qua, grep CSS rỗng. Chưa kiểm bằng trình duyệt. Commit: `U2 bước C4` trong git log.
- U2 bước C5 xong: ba chỗ bố cục. Thanh trên: bốn nút công cụ và Menu thành nhóm `kb-top__right` canh phải, tên ván co lại có dấu ba chấm, từ 1280px không xuống dòng (nút, nhóm tốc độ và tab nhỏ một bậc cỡ chữ và đệm, ghi đè bằng bộ chọn trong `frame.css`). Dải chỉ số: ô số gọn (giá trị `--font-size-5`, đệm và bề rộng tối thiểu nhỏ hơn, ẩn `.kb-stat__vs`), thêm dòng "Mũi tên: mức đổi so với 12 tháng trước." ở đầu dải. Đầu phải dòng thời gian ghi "Bây giờ". Đo bằng Chrome ở 1446x840 (ván 50 hộ): thanh trên một dòng, dải thấy trọn 10 ô; ở 1280px một dòng, thấy trọn 9 ô; ván tự do với một luật và một quy luật đổi ở Cài đặt ban đầu vào được ván, dải "đã sửa quy luật" hiện, bảng Chính phủ ghi 10,0%, dòng thời gian có mốc ◆, console không lỗi. Chưa kiểm: 5.000 hộ, giao diện tối, mở ván lưu của bản trước, offline. `npm test` xanh 136/136, `tsc`, `eslint`, `build` qua, mã băm trùng 9/9, grep CSS rỗng. Commit: `U2 bước C5` trong git log.

### U6b Sandbox đầy đủ (Dương duyệt 15/11/2026, đã ghi spec, CHƯA LÀM; xếp sau U6, trước U7)

- Quyết định của Dương (15/11/2026) với danh sách "Điều kiện ban đầu" bên dưới: duyệt việc 1, 2, 4 thành mốc U6b; bỏ việc 3 và 6; hoãn việc 5 (chưa xếp giai đoạn). Ô tắt làm nóng phải dùng được cùng tham số ban đầu, kèm câu giải thích phân phối sẽ tự trôi. U2 làm như spec hiện tại.
- Đã ghi: gd1-5.md mục 4.5 (thiết kế, câu chữ nguyên văn, bảng tham số và khoảng), mục 10 (ngoại lệ U6b: đúng bốn chỗ được đổi), mục 11 (dòng U6b, tiêu chí 7), mục 12 dòng 8.
- **Việc 4 (năm bắt đầu) CHỜ DƯƠNG XÁC NHẬN LẠI.** Người điều phối đã báo sai "luật có phiên bản từ 2000 tới 2027". Số thật (đọc `src/config/vn/laws.ts` 16/11): phần lớn luật chỉ có phiên bản từ 2016 trở về sau (TNCN 2026, lương tối thiểu 7/2024, tái cấp vốn 6/2023, giảm trừ gia cảnh 7/2020, TNDN 2016); mốc 2000 chỉ là nhãn hằng số. Chọn năm 2010 ra luật gần 2024-2026, mức giá vẫn 2026. Dương có thể bỏ việc 4 hoặc giữ với câu cảnh báo ở mục 4.5.
- Người điều phối sửa một chỗ trong thiết kế (16/11): `init.soeShare` chỉ cho 0/10/20/25/50%, vì `init.ts` dùng `round(1/x)`.
- Khoảng của bảng tham số chưa kiểm; script kiểm khoảng là bước đầu của U6b.

### U1 (XONG CODE tối 15/11/2026, đã báo Dương)

Phạm vi: chỉ U1 (spec gd1-5.md mục 3, mục 11). Xong U1 thì soát, báo Dương, rồi DỪNG; không tự sang U2. Lời giao đầy đủ có sáu bước: (1) token + test tương phản, (2) phông, (3) bảng thuật ngữ `src/content/glossary.ts`, (4) `format.ts` theo mục 3.5, (5) thành phần `src/ui/design/components/`, (6) trang xem thử `?design` chỉ bản dev.

Quyết định của người điều phối (tự quyết theo spec mục 13, đã phản biện phương án khác):
- **Bảng màu**: giữ nền, chữ, hổ phách làm màu nhấn như `app.css`. Màu "mua hàng" đổi từ hổ phách sang xanh mòng két, vì spec 3.1 nói một màu nhấn và màu còn lại dành cho nghĩa; phương án giữ hổ phách cho mua hàng bị bỏ vì một màu mang hai nghĩa. "Thuế" đổi sang hồng để khác "xấu" (trước trùng tông đỏ). Mọi màu chữ và màu nghĩa đạt ≥ 4,5:1 trên ba mức nền ở cả hai theme (đo trước khi giao, thấp nhất 4,73). Bản đồ, biểu đồ cũ giữ màu cũ tới U2/U4.
- **Tên biến CSS mới** có tiền tố `--color-`, `--space-`... để không đè biến cũ của `app.css`; U2 chuyển `app.css` sang token.
- **Phông** chỉ nạp từ lớp design ở U1, chưa nạp vào app.
- **`format.ts` sửa ngay ở U1** (hậu tố "tỷ đồng", "điểm phần trăm", thêm `fmtPctChange`) vì trang xem thử phải đúng văn phong và mọi số đi qua file này; bỏ phương án viết hàm định dạng thứ hai vì sẽ có hai cách làm tròn. Màn hình cũ đổi chữ theo, là chủ ý.
- **Bảng thuật ngữ**: 34 mục, người điều phối viết nguyên văn, có cột "từ không dùng".
- **StatTile không tự tính mức đổi 12 tháng**: nơi gọi đưa vào (spec mục 13 dòng 3).

Tiến độ từng bước (Sonnet cập nhật, mỗi bước một dòng):

- U1 bước 1 xong: `src/ui/design/tokens.ts` + `tokens.css` (20 màu hai theme, khoảng cách, bo góc, cỡ chữ, chuyển động) và `tests/unit/design-tokens.test.ts` (tương phản ≥ 4,5:1 mọi cặp, so khớp ts với css). `npm test` xanh 84/84. Commit: `U1 bước 1` trong git log.
- U1 bước 2 xong: `@fontsource/be-vietnam-pro` (dependencies), `src/ui/design/fonts.css` (sáu tập con vietnamese/latin × 400/500/600), `src/ui/design/index.ts` nạp tokens.css và fonts.css. Chưa nạp vào `main.tsx`/`app.css`. Kiểm `tabular-nums` làm ở bước 6. Commit: `U1 bước 2` trong git log.
- U1 bước 3 xong: `src/content/glossary.ts` (34 mục chép nguyên văn từ lời giao, `GLOSSARY` và `term(id)`), `tests/unit/glossary.test.ts`. `npm test` xanh 89/89. Commit: `U1 bước 3` trong git log.
- U1 bước 4 xong: `src/ui/format.ts` (`money` hậu tố "... đồng", `fmtDelta` tỷ lệ ghi "điểm phần trăm", thêm `fmtPctChange`; không đổi `fmtAxis`, `num`, `monthLabel`), `tests/unit/format.test.ts`. Chữ màn hình cũ đổi theo, là chủ ý. `npm test` xanh 96/96. Commit: `U1 bước 4` trong git log.
- U1 bước 5a xong: `src/ui/design/components/` Button, SegmentedControl, NumberInput, Slider (+ `util.ts` có `parseViNumber`, `decimalsOf`), `src/ui/design/components.css` (chỉ dùng token), `tests/unit/number-input.test.ts` (tự thêm, logic đọc số). `npm test` xanh 100/100. Commit: `U1 bước 5a` trong git log.
- U1 bước 5b xong: StatTile, Card, DataTable, TAccount, StatusBadge, WarningBanner, Dialog, SidePanel, Tabs, Tooltip, GlossaryTerm, SourceTag trong `src/ui/design/components/`, kiểu dáng thêm vào `components.css` (grep không còn mã màu, cỡ chữ hay px khác 1px). Xuất hết ở `src/ui/design/index.ts`. `npm test` xanh 100/100, tsc và eslint qua. Commit: `U1 bước 5b` trong git log.
- U1 bước 6 XONG CODE NHƯNG ĐANG DỪNG CHỜ NGƯỜI ĐIỀU PHỐI: `src/ui/design/Preview.tsx` + `preview.css`, `main.tsx` thêm đúng đoạn `?design` (dev), tsc/eslint/build qua, `dist/` không có chuỗi trang xem thử. **Kiểm `tabular-nums` KHÔNG ĐẠT**: Be Vietnam Pro 5.3.0 đã nạp nhưng `font-variant-numeric: tabular-nums` không đổi gì; "1111" = 30,813 px, "8888" = 50,734 px ở đậm 400 (bằng đúng số tỷ lệ). Theo lời giao: dừng, không đổi phông. Đã xem bằng trình duyệt ở Sáng (theo máy) và Tối, console không lỗi. Commit: `U1 bước 6` trong git log.

**Review của người điều phối (tối 15/11, tới `6cf4adb`):** diff chỉ chạm `src/ui/design/`, `src/ui/format.ts`, `src/ui/main.tsx` (đúng đoạn `?design`), `src/content/glossary.ts`, `package.json`, bốn test mới; không chạm engine, config, scenarios, notes, tests cũ. 34 mục thuật ngữ khớp nguyên văn lời giao (so bằng script). CSS thành phần không có màu, cỡ chữ đặt tại chỗ. `npm test` 100/100.
- **[ĐÃ GỠ, xem dòng soát cuối khối] Be Vietnam Pro không có số đều bề rộng.** Người điều phối đọc thẳng file phông của gói 5.3.0: bảng tính năng chỉ có `ccmp dnom frac liga locl numr`, không có `tnum`. Spec 3.2 đòi `tabular-nums`; mục 12 chọn Be Vietnam Pro. Hai mục đụng nhau, đổi phông là quyết định của Dương. Đã kiểm phương án: Inter 5.3.0 có `tnum` ở cả tập con latin và vietnamese.
- Việc nhỏ người điều phối sẽ giao sau khi Dương quyết: `fonts.css` tự khai `@font-face` có `unicode-range` (file tập con của gói không có `unicode-range`, nên trình duyệt có thể tải cả hai file cho mọi chữ); sửa chữ "khi focus bằng bàn phím" trên trang xem thử. Người điều phối chưa tự mở `?design` bằng trình duyệt; Sonnet đã xem một phần (xem báo cáo bước 6), chưa xem Hộp thoại, Ngăn bên, Tab, Tooltip, Thẻ nguồn, Thanh kéo, Ô nhập số, chưa thử bàn phím.
- U1 bước 7a xong: thêm `@fontsource/inter`; `fonts.css` tự khai 12 `@font-face` (Be Vietnam Pro và Inter × 400/500/600 × vietnamese/latin, woff2, `unicode-range` chép từ `400.css` của gói); token `--font-num`; `.kb-num` dùng Inter và `tabular-nums` (StatTile tách mức đổi khỏi cụm "so với 12 tháng trước", NumberInput gắn `.kb-num` cho ô nhập và đơn vị). Kiểm tnum Inter ở 20px: "1111" và "8888" bằng nhau ở cả ba độ đậm (400: 51,875; 500: 51,836; 600: 51,758); Be Vietnam Pro để đối chiếu vẫn lệch (400: 30,805 và 50,727). Dist với design layer nạp thử có đúng 12 woff2. `npm test` xanh 100/100. Commit: `U1 bước 7a` trong git log.
- U1 bước 7b xong: Preview.tsx đổi câu chú thích thành "Chú thích hiện khi rê chuột hoặc khi chọn bằng bàn phím." Commit: `U1 bước 7b` trong git log.

**Soát U1 của người điều phối (tối 15/11, tới `4a225d7`):**
- Dương quyết (15/11): đã kiểm bản Be Vietnam Pro gốc v1.002 (Google Fonts và kho tác giả, cả TTF, OTF) và file nguồn `.glyphs`: không có `tnum`. Vì vậy dùng hai phông, Inter cho phần hiển thị số. Đã ghi vào gd1-5.md mục 12 và 3.2 (`213afb7`).
- Diff bước 7 đúng lời giao. `npm test` 100/100, `tsc` qua, `eslint` 0 lỗi (1 cảnh báo có sẵn ở `src/engine/core/rng.ts:45`, không thuộc U1), `npm run build` qua, `dist/` không chứa trang xem thử.
- Người điều phối tự mở `?design` bằng Chrome: Sáng và Tối đúng, console không lỗi. Hộp thoại mở bằng nút và đóng bằng phím Esc thật, mở lại được. Ngăn bên trái có nút "Quay lại". Thanh kéo có vạch "Hiện hành". Chú thích thuật ngữ hiện khi chọn bằng bàn phím, lấy chữ từ bảng. Thẻ nguồn mở ra, Esc đóng, không có mức xác minh. Tab và nhóm nút chọn một đổi lựa chọn bằng phím mũi tên (thử bằng sự kiện phím giả lập, chưa thử tay).
- App ở 50 hộ mở được sau khi đổi `format.ts`: tiền hiện "triệu đồng", "tỷ đồng", vừa ô, console không lỗi.
- **Chưa kiểm:** phím trên ô nhập số và thanh kéo; `prefers-reduced-motion` bằng trình duyệt (chỉ kiểm qua token về 0ms); màn hình hẹp (thuộc U6); app ở 5.000 hộ, lưu, tải ván, offline sau khi đổi `format.ts` (U1 không đụng các đường đó ngoài chữ số).
- Ghi nhận nhỏ, để U2: mũi tên ▲▼ của StatTile nằm ngoài vùng ký tự của hai phông nên dùng phông hệ thống; chữ giao diện cũ còn "cậu" (đã biết, đổi ở U2).
- Ảnh chụp: thư mục scratchpad của phiên, `shots/opus-*.jpg` (không lưu trong kho).

**Điều kiện ban đầu: engine có gì, thiếu gì** (Dương hỏi 15/11/2026; người điều phối đọc code, chưa đổi gì; Dương ĐÃ QUYẾT 15/11, xem khối U6b ở trên). Phần đã có ghi vào U2 (gd1-5.md mục 4.4).

Đã có, dùng được ngay qua giao thức:
- Quy mô 50/500/5.000 hộ, hạt giống.
- Luật lúc đầu (`init.setup.laws`), áp ở tháng 0 SAU khi dựng nền kinh tế theo luật hiện hành. Không kích hoạt `gov.revenueUse`. Ván lưu giữ.
- Biến thể quy tắc (`init.setup.variants`), gắn nhãn "đã sửa quy luật".

Engine có nhưng giao thức hoặc Session chưa nối (đổi `session.ts`, giao thức tăng phiên bản; chạm khởi tạo World, nên theo spec mục 10 phải Dương duyệt):
1. **Luật áp TRƯỚC khi dựng nền kinh tế.** `Engine.newWorld` nhận `laws` (ghi `lawOverrides` từ tháng 0, "Điều kiện ban đầu"), nhưng `Session.init` không truyền. Hệ quả hiện nay: giá, lãi vay, số công chức lúc dựng tính theo luật mặc định, rồi tháng đầu mới chỉnh. Công: nhỏ, khoảng nửa ngày Sonnet kèm test mã băm.
2. **Tham số khởi tạo `init.*`** (của cải ban đầu theo tháng thu nhập, xuất phát bình đẳng hay theo thu nhập, thất nghiệp lúc đầu, phần lao động chính thức, cỡ doanh nghiệp, phần doanh nghiệp nhà nước, phần người tự làm). `newWorld` nhận `params` trước khi dựng, Session không truyền; `setup.params` áp sau khi dựng nên vô tác dụng với nhóm này. Công: chung với việc 1. Cần thêm: đổi tham số thì gắn nhãn "ngoài vùng đã kiểm định" (hiện `setParam` không gắn nhãn gì, xem phát hiện bên dưới).
3. **Số hộ bất kỳ.** `newWorld` nhận `nHouseholds`, số doanh nghiệp và ngân hàng suy theo công thức. Giao thức chỉ có ba mức. Ngoài 500 và 5.000 hộ chưa kiểm định. Công: nhỏ, nửa ngày, kèm nhãn "ngoài vùng".
4. **Năm bắt đầu** (chọn bộ luật của năm đó). `newWorld` nhận `startYear`; [SAI, sửa 16/11: phần lớn luật chỉ có phiên bản từ 2016 về sau, xem khối U6b] luật có phiên bản từ 2000 tới 2027. Giao thức chỉ cho kịch bản đặt năm. Công: nhỏ, nửa ngày. Năm cũ chỉ đổi luật, không đổi cấu trúc kinh tế.

Thiếu hẳn, cần cơ chế mới:
5. **Hình dạng phân phối tài sản** (ví dụ chọn mức chênh lệch, một nhóm giàu). Hiện chỉ có hai kiểu: chia đều, hoặc theo thu nhập. Thêm kiểu khác phải viết ở `init.ts`, cần nguồn. Công: vừa, 1-2 ngày. **Vướng làm nóng:** ván tự do sẽ chạy trước 240 tháng (U5), mô hình tự sinh lại phân phối, nên phân phối đặt lúc dựng có thể mất gần hết khi người chơi vào ván. Phải đo trước. Nếu muốn phân phối có hiệu lực lúc nhận ván thì là "chia lại của cải lúc nhận ván": giao dịch qua sổ cái, có mã lý do, cơ chế mới. Công: 2-3 ngày, và phải thiết kế rồi Dương duyệt.
6. **Cơ cấu đặt cứng trong `init.ts`**: số ngân hàng theo quy mô, tỷ lệ doanh nghiệp và hộ kinh doanh trên số hộ, `HKD_MIX` chia hộ kinh doanh theo ngành. Biến thành tham số, giữ mặc định cũ để mã băm không đổi. Công: nửa ngày đến một ngày.
7. **Dân số theo tuổi, kỹ năng, người phụ thuộc**: trường có sẵn, hành vi là GĐ2. Không làm ở GĐ1.5.

Gộp 1-4 và 6: khoảng 2-3 ngày Sonnet cộng review. Thêm 5: thêm 2-3 ngày và một vòng thiết kế.

Phát hiện khi đọc code (chưa sửa, ngoài phạm vi): `Session.setParam` đổi tham số hành vi mà không gắn `meta.modified`, nên đổi tham số giữa ván không bật dải "đã sửa quy luật"; chỉ đổi biến thể quy tắc mới bật. Đã xem: giao diện hiện không có chỗ nào gọi `store.param` (chỉ khai trong `store.ts`), nên người chơi chưa đổi được tham số, chưa phải lỗi đang xảy ra. Thành lỗi nếu sau này giao diện mở chỗ đổi tham số mà engine không sửa.

### Trạng thái lúc này (tối 15/11/2026)

- **BÀN GIAO (Dương quyết tối 15/11/2026): từ GĐ1.5, Opus điều phối, Sonnet code. Fable không làm tiếp.** Opus bắt đầu từ U1 và CHỜ DƯƠNG BẢO mới giao (Dương đã cho tạm dừng sau khi push). Đọc trước: `docs/design/gd1-5.md` (spec đã duyệt; mục 13 "Lưu ý cho người điều phối" nói cách review và khi nào được tự quyết), `docs/validation/chot-gd1.md`, CLAUDE.md mục "Ai làm gì".
  - Trạng thái lúc bàn giao: cây làm việc sạch, `main` = `origin/main`, `npm test` xanh 75/75. U1 CHƯA bắt đầu: Fable đã giao Sonnet một lần rồi ngắt ngay theo lời Dương, chưa có file hay commit nào (`src/ui/design/` chưa tồn tại).
  - Lời giao U1 Fable đã soạn (Opus dùng lại hoặc viết lại): năm bước, mỗi bước một commit: (1) `src/ui/design/tokens.css` + `tokens.ts`, giá trị xuất phát lấy từ `:root` của `app.css`, kiểm tương phản; (2) phông Be Vietnam Pro qua gói `@fontsource/be-vietnam-pro`, tập con `vietnamese` và `latin`, đậm 400/500/600; (3) các thành phần ở spec mục 3.3 trừ biểu đồ, không phụ thuộc `store.ts`; (4) trang xem thử ở `?design`, chỉ bản dev; (5) test tương phản token. U1 chỉ thêm mới, không sửa màn hình đang có (đó là U2). Dương thêm sau đó mục 3.5 "Văn phong giao diện" vào spec (gọi "bạn", bảng thuật ngữ ở `src/content/glossary.ts`, số kiểu Việt Nam): lời giao U1 phải kèm mục này, và U1 có thêm việc lập bảng thuật ngữ.
  - Việc Fable để lại chưa làm: mục "Mô hình bỏ qua gì" trong game (`src/content/notes.ts`) chưa đồng bộ với bảng "đã biết" của chot-gd1.md (làm ở U6); mô tả nhánh "Trả nợ" dùng chung hai kịch bản còn ghi "nợ công thấp dần" (không chắc ở `keo-vao-luoi-thue`); mục 7b (U7) của spec mới là khung.
- **Nhánh `thu/3d-dai-ton-kho` ĐÃ XOÁ (Dương bảo 15/11/2026).** Mọi chỗ bên dưới nhắc tới nhánh này đã cũ. Nó chỉ có một commit WIP `ecf39ca` (bản thử S38, 26 dòng ở `gd1.ts`, `firms.ts`, `index.ts`, `schema.ts`), chưa từng lên origin; còn lấy lại được bằng `git branch <tên> ecf39ca` cho tới khi git dọn rác. Mô tả quy tắc và số đo vẫn ở mục "việc 2" bên dưới và sai-khac.md D11. Kho giờ chỉ còn `main`.
- **GĐ1 ĐÃ CHỐT CÓ ĐIỀU KIỆN (tối 15/11/2026).** Tóm tắt, danh sách "đã biết" và phần cần Dương soát: `docs/validation/chot-gd1.md` (thay cho báo cáo dài, Dương quyết). Đã push lên origin.
  - Kiểm định kịch bản chạy lại trên điểm tách nhánh 240: lượt `011f00d` hỏng 4 khẳng định (3 ở `hai-tay-lai`, 1 ở `keo-vao-luoi-thue`/debt). Người điều phối đo 10 seed (`scripts/scendiag.ts`), viết lại câu chữ theo số đo, Sonnet áp (`9cde756`, `bc3633c`); lượt `bc3633c` qua hết (`9d0294c`). Một bài học phụ của "Hai tay lái" bị đảo (lãi suất cao KHÔNG hãm được tín dụng rõ), đã báo Dương trong chot-gd1.md.
  - **Kiểm định thống kê KHÔNG chạy lại** (Dương quyết): `docs/validation/gd1.md` vẫn là lượt `dccfcc0`, tách ở tháng 120. Chạy lại đầy đủ, dời `BURN` sang 240: GĐ1 update 1.
  - **chong-va-ngam.md KHÔNG chạy cho mốc này** (Dương quyết 15/11/2026): dời sang đầu GĐ3. Đây là ngoại lệ một lần, luật trong CLAUDE.md không đổi.
  - Còn chờ Dương soát (chot-gd1.md mục b): `prewarm: 0` ở `thu-cu-soc`, S37, danh sách thay đổi test và khẳng định.
- **GĐ1.5: spec `docs/design/gd1-5.md` Dương đã duyệt 15/11/2026** (ba vai gộp, Be Vietnam Pro, sáng tối theo máy, thêm mốc U7 bản đồ sống sau U6, S11 sau U7, ván tự do mặc định làm nóng 240 tháng). Thứ tự: U1 hệ thiết kế, U2 khung và ba vai, U3 nhân quả và biểu đồ, U4 bản đồ tĩnh, U5 làm nóng, U6 onboarding, U7 bản đồ sống. **Mục 7b (U7) mới là khung: phải viết chi tiết và chờ Dương duyệt trước khi code U7.** Việc kế tiếp: U1.
- Các dòng bên dưới ghi "chờ Dương (D16)", "Bước 3d ... chờ Dương quyết", "Bước 5, 6 chưa làm" đã cũ.
- **Test đỏ `session.test.ts` "control = shock" đã xử lý theo quyết định của người điều phối 15/11/2026 (thêm `prewarm: 0` vào kịch bản giả, xem mục "Thay đổi test và khẳng định"); `npm test` xanh 75/75. Kiểm định chạy lại sau đó.**
- **Đã dời điểm tách nhánh (Dương quyết 15/11/2026, sai-khac.md D16, mục F có hai dòng mới).** A: meta của World có `prewarm` (bội của 12, mặc định 0); `dateOf` tính lịch theo `max(0, tick - prewarm)`; tick, sổ cái, số ngẫu nhiên vẫn theo tick. `prewarm` = 0 cho trạng thái trùng từng bit với trước (đã so mã băm trên 2 ván với meta bỏ trường mới). B: `ScenarioDef.prewarm?`, `SCENARIO_PREWARM = 240`; Session mở kịch bản với `prewarm` đó và `t0 = prewarm + warmup`; `vach-xuat-phat` khai `prewarm: 0`; ván tự do vẫn 0; `scripts/optdiag.ts` sửa theo. C: `FORK = 240` trong gd1-lib.ts, mọi thí nghiệm chạy đôi tách ở 240; `BURN = 120` của lần chạy gốc giữ nguyên.
- **Vì sao sửa `core` (quy tắc 9):** luật có ngày hiệu lực (GTGT 8% về 10% từ 01/01/2027) và kịch bản `het-han-giam-thue` gắn với lịch; chạy thêm 240 tháng mà không đứng lịch thì lịch trôi 20 năm. Sửa chỉ ở `world.ts` (trường meta, `createWorld`, `dateOf`) và `engine.ts` (tuỳ chọn `prewarm`). Các chỗ tính "tháng trong năm" cho hành vi (`firms.ts`, `gov.ts`, `banks.ts`) giữ nguyên vì `prewarm` là bội của 12.

- **Xong và đã commit:** bước 0, 1, 2, 3a, 3b, 3c, 3e, 7 của bảng kế hoạch dưới. `npm test` xanh 69/69 trên main.
- **Bước 3d (dải tồn kho Lengnick, S38): đã đo, CHƯA NHẬN, chờ Dương quyết.** Bản Sonnet viết dở nằm ở nhánh `thu/3d-dai-ton-kho` (một commit WIP: code engine có, thiếu test và mục F, `npm test` đỏ 2 chỗ). Main KHÔNG có S38. Số đo và lý do: sai-khac.md D11, đoạn "Đo tối 15/11/2026". Tóm tắt: thất nghiệp 6,3% xuống 4,9% chứ không về 2-3%; việc cắt người chỉ đổi lý do sang "không đủ tiền trả lương"; test "bỏ một chính sách" đỏ lại ở 50 hộ seed 3 (nhiễu một seed: 9/10 seed ở 50 hộ và 10/10 ở 500 hộ vẫn dương). Người điều phối đề xuất không đưa S38 vào GĐ1. **Không nhập nhánh này vào main khi Dương chưa quyết.**
- **Bước 4 (kiểm định đầy đủ): chạy lại xong 15/11 trên mã `dccfcc0` (sau các quyết định đợt cuối ngày 15/11, bên dưới); chờ điều phối đọc.** Kịch bản 301s: không còn khẳng định KHÔNG QUA; `thue-nguoi-giau/debt` đầu tư 8/10 (khuôn mới so với hai nhánh chi lại). GĐ1 (500 hộ, 20 seed; 5000 hộ, 5 seed): không còn mục KHÔNG QUA nào ngoài nhãn "đã biết". Không qua và đã biết: K1.19 (1/20), K1.28 (7/20), K1.29 (14/20), K1.31 (10/20), K1.13 (3/5 ở 5000 hộ). K1.24 20/20 (tỷ lệ chuyển 0,90-1,31, trần 1,39); K1.26 20/20 (đo năm 2-4). Kết quả: `docs/validation/gd1.md`, `scenarios.md`, `parts/*.json`. Số lượt cũ `b7ce617` ở khối ngay dưới (đã cũ). Chạy từng phần: `KB_PART=M|X|L|S|report npm run validate:gd1`.
- **Quyết định của Dương 15/11/2026 (đợt cuối) đã áp:** (A) K1.26 đo ở năm 2-4 thay cho 10 năm (`b8734d9`, sai-khac D15, mục F). (B) K1.24 giữ trần 1,39 và ghi rõ giới hạn: mô hình chuyển trọn sau ngày đổi thuế, phần SAU ngày đổi thuế ở bằng chứng chỉ khoảng 0,68, nên mô hình đang thổi phồng; sửa ở việc 8 và 8b (`0b03ad3`, mục F). (C) `thue-nguoi-giau`, nhánh `debt`: khẳng định đầu tư đổi thành "thấp hơn cả hai nhánh chi lại", thêm `Ctx.others` và khuôn `lowerThanOptions` (`98b0c85`). (D) hai ghi chú S13 trong game: `cu-soc-khuech-dai`, `chuyen-thue-vao-gia` (`dccfcc0`). `npm test` xanh 71/71.
- **Bước 5 vẫn chờ Dương** (chốt GĐ1 có điều kiện, báo cáo GĐ0 + GĐ1).
- **Chưa làm:** bước 5 (chốt GĐ1 có điều kiện, báo cáo GĐ0 + GĐ1), 6 (spec GĐ1.5).

**[ĐÃ CŨ, thay bằng lượt chạy lại trên `dccfcc0` ở trên] Kết quả bước 4 (tối 15/11/2026, code `b7ce617`, main không có S38). Người điều phối đã review diff giàn chạy: chỉ đổi hai file `tests/validation/*.test.ts`, không đổi ngưỡng hay cách đo. BƯỚC 5 CHỜ DƯƠNG QUYẾT bốn mục hỏng dưới đây; chưa mục nào được gắn "đã biết".**
- **K1.24** 12/20 (500 hộ). 8 seed hỏng đều vì tỷ lệ chuyển thuế sau 2 năm TRÊN 1 (1,03 đến 1,31); 12 seed đạt ở 0,90-0,99. Đúng như dự báo sau S36. Cần Dương duyệt ngưỡng mới, hoặc gắn "đã biết" tới việc 8.
- **K1.26** 13/20 (500 hộ), bản trưa 14/11 là 17/20. MỚI, chưa chẩn đoán. 7 seed hỏng: 3 seed thu/GDP giảm (6, 10, 11), 5 seed doanh số thực hộ kinh doanh tăng (6, 12, 13, 14, 16). Seed 6 và 14 có lao động phi chính thức +8 đến +9 điểm. Thay đổi từ trưa 14/11 có thể liên quan: S31/S36 (chuyển thuế), S32 (lương), S34.
- **K1.13** ở 5000 hộ 3/5 (500 hộ 20/20). Đúng dự báo: thiếu cơ chế tích tụ, sửa ở GĐ3/GĐ4. Kết quả phụ thuộc quy mô.
- **Kịch bản `thue-nguoi-giau`, nhánh trả nợ**: "doanh nghiệp đầu tư ít hẳn đi" 6/10. Các khẳng định khác của mọi kịch bản qua. Lời giải thích phải viết lại theo số đo hoặc bỏ khẳng định: Dương duyệt.
- Đã biết, vẫn hỏng: K1.19 1/20, K1.28 7/20, K1.29 14/20, K1.31 10/20. Kế toán qua hết ở ba quy mô. K1.12 ở 5000 hộ qua 4/5.

**Tối 15/11, người điều phối đã review diff của Sonnet tới `e962f81` (đúng lời giao, không nâng trần nào) và đo D16.** Kiểm định trên `dccfcc0`: không còn mục hỏng ngoài "đã biết"; mọi khẳng định kịch bản qua (`thue-nguoi-giau/debt` đầu tư 8/10, không có lề). Sau đó người điều phối sửa một câu trong `src/content/notes.ts` (mục `cu-soc-khuech-dai`, số 25% thành 5%/13% kèm điều kiện); chỉ là chữ hiển thị, engine không đổi, nên báo cáo kiểm định ghi `dccfcc0` vẫn dùng được dù mã "commit cuối chạm src" đã khác.

**CHỜ DƯƠNG (D16):** (a) duyệt hướng làm nóng sẵn cho game; (b) dời điểm tách nhánh của kiểm định và kịch bản sang tháng 240 ngay khi chốt GĐ1, hay để GĐ1.5. Bước 5 chưa làm. Khi làm bước 5 phải rà: ghi chú K1.22 trong gd1-lib.ts, ghi chú K1.26 (câu "số lao động phi chính thức KHÔNG giảm" không đúng ở 3 seed trong cửa sổ năm 2-4), kịch bản "Hai tay lái" và các kịch bản dài.

**Những thứ phải đưa vào báo cáo cho Dương (chưa báo đủ):**
1. **K1.24 nhiều khả năng hỏng lại** ở khoảng một nửa số seed: nó đòi tỷ lệ chuyển thuế sau 2 năm dưới 1, mà S36 cho chuyển trọn (quanh 1). Chưa đổi ngưỡng; chờ số đo bước 4. Đổi ngưỡng cần Dương duyệt.
2. **K1.13 tiêu chí mới hỏng ở 5000 hộ** theo đo nhanh 3 seed (Gini của cải 0,28-0,31 so với Gini thu nhập 0,28-0,34; đạt 1/3); ở 500 hộ đạt 3/3 (0,52-0,54 so với 0,31-0,36). K1.13 đã ra khỏi danh sách "đã biết", nên bước 4 sẽ hiện nó là hỏng thật nếu đúng vậy. Bước 5 phải ghi lại là "đã biết, thiếu cơ chế tích tụ, sửa ở GĐ3/GĐ4" và báo Dương.
3. **Cơ chế S37 (`gov.revenueUse`) là thiết kế của người điều phối, Dương chưa soát chi tiết** (sai-khac.md D14): cách định nghĩa "thu thêm" (tỷ lệ thu thuế/GDP 12 tháng so với mốc trước khi đổi luật), chỉ kích hoạt khi người chơi hay thí nghiệm đổi luật thuế (thay đổi theo lịch như GTGT về 10% tháng 1/2027 không kích hoạt), bốn đơn giản hoá.
4. **K1.24, K1.25, K1.26 khai `keep`** (giữ lại không chi) để giữ nguyên cách đo đã duyệt. Đổi sang "chi lại" là đổi cách đo: Dương quyết.
5. **S37 chưa có mã lý do riêng trong chuỗi nhân quả.** Chi của Chính phủ không có bản ghi quyết định; phần chi lại hiện nằm chung trong `d_wage_public`, `d_purchase`, `d_transfer`. Mới có một sự kiện lúc kích hoạt và chỉ số `gov.respend`. Gợi ý rẻ của Sonnet: thêm `gov.respend` vào upstream của ba mã đó. Chưa làm, chờ quyết.
6. **Phần dịch vụ của dải tồn kho (S38) là tự thiết kế**: dịch vụ không có tồn kho nên dùng phần sức làm bỏ không của tháng trước, co dải theo `firm.nuServices / firm.nu`. Dương đã duyệt quy tắc Lengnick nhưng chưa soát riêng phần này.
8. **S38 không giải được thất nghiệp** (D11, đoạn đo tối 15/11): Dương quyết bỏ khỏi GĐ1, hay làm bản khác.
7. Số đo việc 10 (đã đóng): sau S36 và S37, tăng GTGT lên 20% làm CPI tháng 24 cao hơn đối chứng ở cả hai quy mô: 500 hộ +3,82% (chi lại) và +3,24% (giữ lại), 10/10 seed; 5000 hộ +3,67% và +3,07%, 5/5 seed. Chi lại làm GDP thực năm thứ hai giảm 2,9-4,3% thay vì 5,5-7,4%.

**Kiểm định đầy đủ (bước 4): đã chạy 15/11 trên `b7ce617`.** Giàn đã sửa: `stamp` lấy mã commit cuối chạm src/tests lúc bắt đầu; `gd1.test.ts` chạy từng phần và ghi `docs/validation/parts/gd1-<phần>.json`.

### Tóm tắt một dòng

**Dương quyết 15/11/2026: hoàn thiện GĐ1 rồi sang GĐ1.5, không phát triển thêm cơ chế.** Kế hoạch hiện hành là bảng "Kế hoạch 15/11" ngay dưới; nó thay thứ tự và phạm vi của các mục "VIỆC CHO OPUS" phía sau (các mục đó giữ lại làm đặc tả chi tiết của từng việc). Phân việc: CLAUDE.md mục "Ai làm gì" (người điều phối giữ phần phán đoán, Sonnet code). Đọc chong-va-ngam.md trước khi sửa engine.

### Kế hoạch 15/11/2026 (hiện hành)

Số ở cột "Việc cũ" trỏ tới đặc tả trong các mục "VIỆC CHO OPUS" bên dưới. Cập nhật cột trạng thái sau mỗi bước.

| Bước | Ai | Nội dung | Việc cũ | Trạng thái |
|---|---|---|---|---|
| 0 | Điều phối | Ghi phân việc vào CLAUDE.md, ghi bảng này | | Xong 15/11 |
| 1 | Điều phối | Lập nhóm "GĐ1 update 1" (làm cùng GĐ3): việc 3, 5, 6, 8, 8b. GĐ1 là nền kinh tế không tăng trưởng; mục tiêu hiệu chỉnh tiền, tín dụng, tăng trưởng chuyển sang GĐ4. Ghi vào đây và lộ trình CLAUDE.md | 3, 5, 6, 8, 8b | Xong 15/11 |
| 2 | Sonnet | Tạm thay việc 8: tăng thuế chuyển TRỌN vào giá (`firm.taxPassUp` = 1), giảm thuế giữ 0,065 (Benzarti). Ghi sai-khac.md là đơn giản hoá tạm, thay bằng việc 8 ở GĐ1 update 1 | thay 8 | Xong 15/11 (S36) |
| 3a | Sonnet | Việc 9: khai rõ tiền thuế đi đâu | 9 | Xong 15/11 (S37, D14) |
| 3b | Sonnet | Việc 1: K1.13 tiêu chí mới | 1 | Xong 15/11 (đo nhanh: đạt 3/3 ở 500 hộ, 1/3 ở 5000 hộ; xem D8) |
| 3c | Sonnet | Việc 4: bản thuế đối xứng làm biến thể Phòng thí nghiệm | 4 | Xong 15/11 |
| 3d | Sonnet | Việc 2: dải tồn kho Lengnick | 2 | Bỏ khỏi GĐ1 (Dương quyết 15/11), chuyển sang GĐ1 update 1. Số đo ở D11 |
| 3e | Điều phối | Việc 10: nếu khác dấu 500/5000 hộ tự hết sau bước 2 thì ghi nhận và đóng; còn thì phân tích, tốn nhiều thì chuyển GĐ1 update 1 | 10 | Đóng 15/11: hết khác dấu sau S36, S37 (số đo ở D13). Đo lại khi làm việc 8 |
| 4 | Sonnet chạy, điều phối đọc | Kiểm định đầy đủ: ghi log ra file, chạy từng phần | 0 | Thống kê: lượt `dccfcc0`, không chạy lại sau khi dời điểm tách (Dương quyết). Kịch bản: chạy lại trên `bc3633c`, qua hết |
| 5 | Điều phối | Chốt GĐ1 có điều kiện: mục còn hỏng ghi "đã biết" trong sai-khac.md kèm nơi sẽ sửa; mục S13 trong game liệt kê các lỗi này. Cập nhật CLAUDE.md để quy tắc kiểm định không chặn GĐ1.5. Viết báo cáo GĐ0 + GĐ1. Chạy chong-va-ngam.md, liệt kê thay đổi `tests/unit` và khẳng định kịch bản kèm lý do | 7 | Xong 15/11, bản rút gọn: `docs/validation/chot-gd1.md`. Không viết báo cáo dài; chong-va-ngam.md dời sang đầu GĐ3 (Dương quyết) |
| 6 | Điều phối | Spec GĐ1.5 phạm vi tối thiểu chơi được: 3 vai, kịch bản, sandbox, phòng thí nghiệm, biểu đồ, chuỗi nhân quả, onboarding. Bản đồ isometric tĩnh đơn giản; phần "sống" để sau. Chờ Dương duyệt | | Xong 15/11: `docs/design/gd1-5.md`, Dương đã duyệt |
| 7 | Sonnet | Thêm `cozy_japanese_startup_office.json` vào `.gitignore` | | Xong 15/11 |

**Nhóm "GĐ1 update 1"** (làm cùng GĐ3, không làm bây giờ). Đặc tả từng việc nằm ở các mục "VIỆC CHO OPUS" bên dưới, giữ nguyên số:
- Việc 8: biên lãi hồi dần sau khi đổi thuế. Trước đó dùng đơn giản hoá tạm của bước 2.
- Việc 8b: tăng giá đón trước ngày thuế có hiệu lực.
- Việc 5: phân tích độ nhạy, soát nguồn 10 tham số mạnh nhất.
- Việc 6: lấp 11% GDP danh nghĩa chưa gán lý do. Dòng "phải xong trước khi sang GĐ1.5" trong đặc tả cũ KHÔNG còn hiệu lực; trần 0,15 trong `chot-chan.test.ts` giữ nguyên cho tới lúc đó, và báo cáo GĐ1 phải nêu khoản này.
- Việc 3: đề xuất tăng năng suất (có thể thuộc GĐ4).
- Việc 2 (Dương quyết 15/11/2026: bỏ khỏi GĐ1): quy tắc giữ người qua tháng bán chậm. Bản dải tồn kho Lengnick (S38) đã thử và không hợp (sai-khac.md D11, đoạn đo tối 15/11); code thử ở nhánh `thu/3d-dai-ton-kho`. Phải thiết kế lại cùng cách quyết sản lượng.

**GĐ1 là nền kinh tế không tăng trưởng.** Các mục tiêu hiệu chỉnh thô về lạm phát, bội chi/GDP (đi theo tiền, tín dụng, tăng trưởng) chuyển sang GĐ4; ở GĐ1 chỉ báo cáo số đo (gd1.md mục 14).

Hết quota giữa chừng: trạng thái trong bảng này cộng `git log` là đủ để phiên sau làm tiếp.

### `npm test`: xanh từ 15/11/2026

Test `session.test.ts` "bỏ một chính sách..." tự xanh lại nhờ S36 (tăng thuế chuyển trọn vào giá, Dương quyết 15/11/2026). Đây là đơn giản hoá tạm; việc 8 sẽ thay ở GĐ1 update 1 và phải giữ test này xanh. 61/61 test qua.

### KIỂM ĐỊNH GĐ1 ĐẦY ĐỦ: CHƯA CÓ KẾT QUẢ, phải chạy lại

Lượt `npm run validate:gd1` bắt đầu 23:43 ngày 14/11 trên commit `6490ec6` đã **chết giữa chừng** (tiến trình biến mất sau hơn 30 phút, không ghi báo cáo, không in lỗi; nhiều khả năng bị dừng cùng phiên làm việc). `docs/validation/gd1.md` vẫn là bản trưa 14/11, cũ hơn S31, S32, S34 và bất đối xứng thuế. Opus chạy lại (việc 0) trước mọi việc khác, không chạy song song với thứ gì nặng, và không sửa `src` hay `tests/validation` trong lúc chạy. Sửa luôn lỗi nhỏ: dòng "Bản code" trong hai file `tests/validation/*.test.ts` lấy mã commit lúc chạy xong, phải lấy lúc bắt đầu.

Kiểm định kịch bản thì đã xong trên `6490ec6`: mọi khẳng định qua (`docs/validation/scenarios.md`).

### VIỆC CHO OPUS, đợt bốn: quyết định D13 của Dương, đêm 14/11/2026 (chưa làm)

Áp SAU khi có kết quả kiểm định GĐ1 đầy đủ ở trên. Thứ tự gợi ý trong toàn bộ danh sách: 0, 8, 9, 8b, 1, 4, 2, 3, 5, 6, rồi chạy lại kiểm định. Việc 8 và 9 đi trước vì chúng làm `npm test` xanh lại.

**8. Biên lãi hồi dần sau khi thuế đổi.** Mục tiêu: mức chuyển thuế vào giá đi từ ngắn hạn 0,34 (Benzarti, `firm.taxPassUp`) tới gần trọn trong khoảng 2 năm (Benedek, De Mooij, Keen, Wingender 2015, IMF WP/15/214, đã đọc toàn văn; bản text ở thư mục scratchpad của phiên Fable có thể đã mất, tải lại từ imf.org).
   - **Tốc độ hồi lấy từ bài, không chọn cho test xanh.** Số trong Bảng 3 của bài, thuế suất phổ thông: trong tháng đổi thuế 0,30; 12 tháng sau cộng thêm 0,38; 12 tháng trước 0,71; cả kỳ 1,39 (sai số 0,36). Một cách quy đổi Fable đã nghĩ nhưng CHƯA kiểm: nếu coi đích dài hạn là 1 và bỏ phần tăng giá đón trước (mô hình chưa có), thì trong 12 tháng sau giá đi thêm 0,38 trên quãng còn lại 0,70, tức 54% quãng đường mỗi năm, khoảng 6,3% quãng còn lại mỗi tháng, và sau 24 tháng đi được khoảng 79%. Opus mở lại bài, xem Hình 2 (đường tích luỹ theo tháng) để kiểm phép quy đổi này, và ghi phép tính vào sai-khac.md. Phải quyết và ghi rõ: đích dài hạn là 1 hay con số khác, và có mô hình hoá việc tăng giá đón trước không (0,71 là phần lớn nhất, bỏ nó là một đơn giản hoá phải nói thật).
   - **Cách làm gợi ý** (Opus quyết): mỗi đơn vị giữ một cột "phần thuế đang gánh" (mức biên lãi đã hạ ở `p_tax_absorb`). Mỗi tháng nó trả lại một phần `firm.taxPassRecover` vào biên lãi, ghi mã lý do riêng (ví dụ `p_tax_recover`), upstream là các luật thuế. Biên lãi vẫn đi theo sức mua như cũ ở phần còn lại. Tham số mới phải khai `basis` và nguồn; ghi dòng vào sai-khac.md mục F (chốt chặn sẽ đòi).
   - **Mục tiêu của việc 8 chỉ tính phần SAU ngày đổi thuế** (Dương quyết đêm 14/11/2026). Không ép phần hồi bù cho phần tăng giá đón trước. Theo Bảng 3: trong tháng 0,30 cộng 12 tháng sau 0,38, tức khoảng 0,68 sau một năm kể từ ngày đổi thuế; phần còn lại để tới gần trọn thuộc về việc 8b. Cho tới khi 8b xong, ghi vào sai-khac.md và `firm.taxPassUp` rằng thiếu phần đón trước là một đơn giản hoá, và mô hình sẽ chuyển thuế vào giá ÍT hơn bằng chứng dài hạn. Nếu vì thế test 24 tháng vẫn đỏ sau việc 8 và 9 thì báo Dương số đo, không tăng tốc độ hồi cho đủ.
   - **Giữ bất đối xứng cho chiều giảm thuế.** Benzarti: sau khi giảm thuế, giá và biên lãi ở lại mức mới nhiều năm. Vậy chiều giảm hoặc không hồi, hoặc hồi chậm hơn hẳn: lấy từ bài Benzarti (đoạn về độ bền của chênh lệch sau 2012), không tự đặt.
   - Sau khi làm: chạy `npx tsx scripts/vatcpi.ts M 10` và `L 3`; test đỏ phải xanh; K1.24 đo lại (ngưỡng "giữa 0 và 1 sau 2 năm" có thể phải sửa theo bằng chứng, Dương đã cho phép ở đợt hai, nhưng vẫn báo số đo trước).

**8b. Tăng giá đón trước ngày thuế có hiệu lực** (Dương quyết đêm 14/11/2026: mô hình hoá). Khi một luật thuế được công bố trước ngày hiệu lực, người bán nâng giá dần trong các tháng trước ngày đó.
   - Dùng hệ luật theo ngày hiệu lực sẵn có (`src/config/law.ts`, `LawVersion.from`): một phiên bản luật có ngày hiệu lực trong tương lai là thứ người bán nhìn thấy trước. Ca có sẵn để thử: GTGT 8% về 10% từ 01/01/2027. Cần thêm khái niệm **ngày công bố** (luật do người chơi ban hành có hiệu lực ngay thì không có đón trước, trừ khi người chơi chọn ngày hiệu lực về sau: giao diện và giao thức phải cho đặt ngày hiệu lực; đây là việc UI, giao Sonnet sau khi engine xong).
   - Tham số từ IMF 2015 (Benedek và cộng sự, Bảng 3 và Hình 2): thuế suất phổ thông, phần tăng trong 12 tháng trước ngày đổi là 0,71 (sai số 0,22). Bài cũng nói hàng lâu bền có khoảng 35% mức chuyển xảy ra trước, hàng không lâu bền không có đón trước (mục VI): mô hình có ba ngành, phải quyết có phân biệt không. Lấy hình dạng theo tháng từ Hình 2; mở lại bài, không dùng số Fable nhớ.
   - Lưu ý của Fable: 0,71 + 0,30 + 0,38 = 1,39 là ước lượng điểm, khoảng tin cậy rộng, và bài không bác được mức 1. Đừng để tổng ba phần trong mô hình vượt 1 chỉ vì cộng ba ước lượng điểm; ghi rõ đã chọn đích nào và vì sao.
   - Chiều giảm thuế: bài không tách đón trước theo chiều cho riêng thuế suất phổ thông (Bảng 4 gộp: tăng 0,13, giảm 0,01, khác biệt không có ý nghĩa). Giữ nguyên tắc bất đối xứng của Benzarti; nếu không có số thì không đón trước ở chiều giảm và ghi là đơn giản hoá.
   - Cơ chế ngoài thiết kế: ghi sai-khac.md trước khi code, tham số khai `basis`, mục F, quy tắc có biến thể tắt đón trước cho Phòng thí nghiệm.
   - Sau 8b: đo lại `scripts/vatcpi.ts`, K1.24, và kịch bản `het-han-giam-thue` (ở đó thuế về 10% là luật đã biết trước: giá phải bắt đầu nhích từ trước tháng 1/2027; lời giải thích viết lại theo số đo).

**9. Mọi thí nghiệm và kịch bản có đổi thuế phải khai rõ tiền thuế thu thêm đi đâu.** Mặc định: **chi lại theo cơ cấu chi hiện tại**. Giữ lại không chi là biến thể so sánh.
   - Cần một cơ chế có tên trong engine, vì "thu thêm" phải tính được mà không cần thế giới đối chứng. Gợi ý: một luật `gov.revenueUse` (0 giữ lại, 1 chi lại) và quy tắc: phần thu ngân sách vượt mức "trước khi đổi luật thuế" được chia cho lương công chức, mua hàng, trợ cấp theo tỷ trọng 12 tháng gần nhất. Khó ở chỗ định nghĩa "vượt": cách của `revenueUseOptions` trong `src/content/scenarios.ts` (thu 12 tháng sau trừ 12 tháng trước đã chỉnh theo GDP danh nghĩa, tính một lần sau năm đầu) là một điểm bắt đầu, nhưng nó chậm một năm. Opus viết đề xuất ngắn vào sai-khac.md trước khi giao code; đây là cơ chế ngoài thiết kế nên theo chong-va-ngam.md mục A.
   - Rà và khai báo ở: `tests/validation/gd1-lib.ts` (K1.24 tăng GTGT, K1.25 hạ giảm trừ, K1.26 nộp thuế đủ), `tests/unit` (hai test tăng GTGT trong `session.test.ts`, test chuyển thuế trong `scenario-options.test.ts`), kịch bản `het-han-giam-thue`, `thue-nguoi-giau`, `keo-vao-luoi-thue`, và `scripts/vatcpi.ts`. Mỗi chỗ ghi rõ đang dùng "chi lại" hay "giữ lại". Sửa `gd1-lib.ts` thì phải ghi mục F.
   - **Chiều giảm thuế** (ví dụ gia hạn 8%), Dương quyết đêm 14/11/2026: mặc định **vay bù, giữ nguyên chi tiêu**; cắt chi là biến thể. **Nguyên tắc chung Dương đặt: mặc định theo hành vi thực tế của Chính phủ Việt Nam, và ghi rõ trong sai-khac.md** (mỗi mặc định kèm một câu nói nó dựa trên hành vi nào, và nguồn nếu có). Vậy hai chiều không đối xứng: tăng thuế thì chi lại, giảm thuế thì vay bù. Hệ quả phải ghi: nợ công trôi lên qua các lần giảm thuế.
   - Thêm vào bảng kiểm chong-va-ngam.md mục F một chốt: thí nghiệm đổi thuế không khai nơi tiền đi thì không được nhận.

**10. Vì sao 500 hộ và 5000 hộ khác dấu ở tháng 24** (D13: +0,36% so với −0,23%). Manh mối: phần `p_wage` là −0,35 điểm ở 500 hộ và −0,85 ở 5000 hộ; GDP thực giảm 4,2% so với 6,1%. Giả thuyết chưa kiểm: ở 500 hộ có ít doanh nghiệp nên đợt xét lương và cắt người thưa hơn, cầu sụt ít hơn. Chạy `scripts/vatcpi.ts L` với nhiều seed hơn (mới có 3), thêm in phân rã lương theo lý do và số doanh nghiệp. Làm lại sau việc 8 và 9, vì cả hai sẽ đổi hiện tượng. Kết quả ghi vào D13.

### VIỆC CHO OPUS: quyết định đợt ba của Dương, tối 14/11/2026 (chưa làm)

Làm theo thứ tự. Mỗi việc: code, `npm test`, commit, cập nhật mục này. Phân vai theo CLAUDE.md mục "Ai làm gì": Opus điều phối và chẩn đoán, Sonnet code, Opus chạy chong-va-ngam.md trước khi báo xong.

Lưu ý về chốt chặn (thêm tối 14/11): đổi giá trị tham số trong `gd1.ts`, hoặc sửa `tests/validation/gd1-lib.ts`, `scenarios-lib.ts`, thì `npm test` hỏng cho tới khi có dòng mới trong sai-khac.md mục F. Việc 1 (K1.13) và việc 4 đều chạm vào đó. Tham số mới phải khai `basis`.

**0. Chạy lại kiểm định đầy đủ trên bản code hiện tại, trước khi sửa gì.** `npm run validate:scenarios` rồi `npm run validate:gd1`. Bản `docs/validation/gd1.md` đang có là của trưa 14/11, cũ hơn S31, S32, S34. Bản `docs/validation/scenarios.md` là của bản code trước S34 và trước bất đối xứng thuế. Lượt chạy tối 14/11 bị dừng giữa chừng, không có kết quả. Việc phải xem sau khi chạy:
   - K1.24: nếu hỏng vì tỷ lệ chuyển sau 2 năm, sửa NGƯỠNG theo bằng chứng ở sai-khac.md D9 (Dương đã cho phép), không sửa tham số.
   - `het-han-giam-thue`: với bất đối xứng, khẳng định "gia hạn 8% giữ giá thấp hơn" có thể hỏng hoặc gần 0. Viết lại lời giải thích theo số đo: giảm thuế lại thì giá không xuống mấy.
   - Điền cột "mô hình hiện tại" của bảng mục tiêu hiệu chỉnh thô (gd1.md mục 14) bằng số 20 seed.

**1. K1.13: bỏ ngưỡng 0,4** (không có nguồn). Tiêu chí mới: Gini của cải ròng năm 30 > Gini thu nhập năm 30 (bình quân 12 tháng cuối của năm 30 cho đỡ nhiễu), và phân phối lệch phải. Áp ở mọi quy mô. Sửa `tests/validation/gd1-lib.ts` (dòng K1.13 và mục K1.13 trong `KNOWN_FAIL`: xoá nếu qua), gd1.md dòng K1.13, sai-khac.md D8. **Không làm B.** Ghi B (chủ tái đầu tư cổ tức, chọn người góp vốn theo của cải ròng) và mua bán cổ phần vào việc GĐ3; sở hữu tập trung vào GĐ4. Đã ghi sẵn trong phac-thao-gd3-gd5.md.

**2. Thất nghiệp: quy tắc dải tồn kho của Lengnick 2013** (Dương duyệt). Chẩn đoán ở sai-khac.md D11. Việc phải làm:
   - **Quy tắc đã lấy từ bài gốc** (Fable đọc toàn văn đêm 14/11: Lengnick 2011, Kiel Economics Working Paper 2011-04, https://www.econstor.eu/bitstream/10419/45012/1/654079951.pdf, mục 2.2, phương trình 6-7, Bảng 1). Ngưỡng trên = 1 × cầu của tháng gần nhất; ngưỡng dưới = 0,25 × cầu của tháng gần nhất. Tồn kho dưới ngưỡng dưới: mở MỘT chỗ tuyển, ngay. Tồn kho trên ngưỡng trên: cho MỘT người nghỉ, chọn ngẫu nhiên, **có hiệu lực sau một tháng** ("vì luật bảo vệ việc làm"). Trong dải: giữ nguyên. Cùng dải đó cũng quyết việc xét đổi giá (mô hình ta không dùng phần này). Mô hình của Lengnick: 1000 hộ, thất nghiệp 0-4,2%. Bản JEBO 2013 chưa đọc; nếu khác thì ghi lại.
   - **Bản nháp Fable đã soạn nhưng CHƯA áp, CHƯA chạy** (ý tưởng, Opus kiểm lại): trong `planFirms`, với đơn vị không phải tự làm, đang có người và tháng trước có bán được: số người cần = số đang có; +1 nếu tồn kho < `firm.invBandLow` × lượng bán tháng trước; nếu tồn kho > `firm.invBandHigh` × lượng bán thì ghi nhớ (cột mới `fireAt` = số người lúc quyết) và tháng sau mới −1, trừ khi lúc đó hàng đã thiếu hoặc đã có người tự rời đi. Vẫn chặn theo sức máy. Đơn vị mới, chưa có người hoặc chưa bán được: giữ cách cũ. Hàm đầu tư vẫn dùng sản lượng mong muốn như cũ. **Ngành dịch vụ không có tồn kho**: nháp lấy phần sức làm bỏ không của tháng trước (sản lượng trừ lượng bán) thay cho tồn kho và nhân dải với `firm.nuServices / firm.nu`; đây là tự thiết kế, phải ghi rõ và có thể cần Dương duyệt.
   - Làm thành quy tắc có biến thể trong sổ quy tắc (`firm.staffing`: `band` mặc định, `track` là bản cũ bám sát từng tháng), tham số có nguồn. Ngành dịch vụ không có tồn kho: phải quyết dùng gì thay (ví dụ phần công suất bỏ không); đó là tự thiết kế, ghi rõ.
   - Đo lại bằng `scripts/demand.ts 5 M`: người mất việc mỗi tháng, thời gian thất nghiệp, chỗ trống, thất nghiệp. **Báo Dương số đo trước khi làm tiếp.** Không chỉnh hai ngưỡng để thất nghiệp ra 2%.
   - Rủi ro: K1.9 (Okun), K1.10 (Phillips, Beveridge), K1.27, và mọi kịch bản có khẳng định về thất nghiệp sẽ đổi. Chạy lại kiểm định đầy đủ sau việc này.

**3. Lạm phát: KHÔNG đặt bội chi theo Việt Nam khi GDP còn đi ngang.** Việc phải làm là viết ĐỀ XUẤT, chưa code: một xu hướng tăng năng suất đơn giản, có nguồn, ngay trong GĐ1. Ghi vào sai-khac.md một mục mới "CHỜ DƯƠNG DUYỆT". Gợi ý để Opus kiểm, không phải quyết định: `firm.aL` tăng đều g mỗi năm cho mọi đơn vị (Caiani 2016 không có tăng năng suất; Dosi và cộng sự 2010 "Schumpeter meeting Keynes" có nhưng là nội sinh qua R&D, thuộc GĐ4; bản ngoại sinh đơn giản phải tìm nguồn, ví dụ số liệu tăng năng suất lao động Việt Nam của Cục Thống kê). Phải nói rõ hệ quả: lương thực phải tăng theo năng suất thì cầu mới theo kịp (cần một số hạng năng suất trong đợt xét lương, có nguồn), lộ trình đang ghi "năng suất tăng: GĐ4", và mọi mục tiêu hiệu chỉnh thô đổi nghĩa. Hiệu chỉnh tiền và tín dụng CHỈ làm sau khi đã có tăng trưởng.

**4. Bất đối xứng thuế: giữ theo Benzarti.** Thêm bản đối xứng thành biến thể Phòng thí nghiệm: quy tắc mới trong sổ quy tắc (ví dụ `firm.taxPass`: `base` bất đối xứng, `symmetric` dùng `firm.taxPassUp` cho cả hai chiều), có `teaches`. Thêm một test nhanh. Cập nhật sai-khac.md S31.

**5. Phân tích độ nhạy** (Dương thêm tối 14/11/2026). Tìm khoảng 10 tham số ảnh hưởng mạnh nhất tới các chỉ số chính (thất nghiệp, lạm phát, GDP thực, tín dụng, tỷ lệ phi chính thức, Gini, bội chi). Cách làm gợi ý: với từng tham số hành vi, chạy đôi ở nửa và gấp đôi giá trị (hoặc ±20% với tham số là tỷ lệ), 5 seed, 500 hộ, 20 năm; xếp theo mức đổi của chỉ số so với độ lệch giữa các seed. Viết script `scripts/sensitivity.ts`, kết quả ghi vào một mục mới trong sai-khac.md. Rồi:
   - Ưu tiên tìm nguồn cho 10 tham số đó, nhất là nhóm `tu-thiet-ke` (55 cái) và `tri-nho` (12 cái).
   - Với những cái đang mang nhãn `nguon` trong 10 cái đó: **soát lại là đã đọc toàn văn**, con số trích đúng, phép quy đổi đúng. Nhãn `nguon` hiện nay Fable gán theo chữ trong ô nguồn, CHƯA soát từng cái. Cái nào chưa đọc toàn văn thì hạ xuống `tri-nho` cho tới khi đọc (trần 12 trong `chot-chan.test.ts` khi đó phải nâng: đây là ngoại lệ duy nhất, ghi rõ trong mục F và báo Dương).
   - Không đổi giá trị tham số trong việc này. Nguồn nói khác giá trị đang dùng thì báo Dương.

**6. Lấp phần GDP danh nghĩa chưa gán lý do** (Dương thêm). Phân rã của `gdp.nominal` còn 11% mức đổi rơi vào "yếu tố khác" (đo ở 50 hộ, 48 tháng, hai lần đổi luật; trần trong `chot-chan.test.ts` đang để 0,15). Tìm phần thiếu (gợi ý: GDP tính cả lương công chức và thay đổi tồn kho; so từng số hạng của `gdpNominal()` trong `gov.ts` với bốn phần của `flowContrib` trong `indicators.ts`, và xem tháng đầu sau khi `s.prev` trống). Sửa xong hạ trần về mặc định. **Phải xong trước khi sang GĐ1.5.** Nếu còn sức thì làm tiếp `credit.denied` (5,5%), `gov.revenue` (2,9%), `gov.debtGdp` (1,7%).

**7. Quy ước báo cáo mốc** (Dương thêm). Mỗi khi báo xong một mốc, báo cáo phải có một mục liệt kê **mọi thay đổi trong `tests/unit` và mọi thay đổi khẳng định kịch bản** (`claims`, `goals`, ngưỡng trong `src/content/scenarios.ts`) kể từ mốc trước, từng cái kèm lý do, để Dương soát. Lấy bằng `git diff <commit mốc trước>..HEAD -- tests/unit src/content/scenarios.ts`. Hai chỗ này không có dấu vân tay tự động (chong-va-ngam.md, bảng "Cần người soát"), nên đây là chốt chặn bằng người. Danh sách cho mốc hiện tại (tính từ commit `746b1cb`, trưa 14/11) ở mục "Thay đổi test và khẳng định từ trưa 14/11" bên dưới.

Sau bảy việc: chạy lại kiểm định đầy đủ, cập nhật sai-khac.md D6, viết báo cáo GĐ0 và GĐ1 (có mục của việc 7 và kết quả đi hết bảng "Cần người soát"), rồi mới viết `docs/design/gd1-5.md` và dừng chờ duyệt.

### Thay đổi test và khẳng định từ trưa 14/11 (cho việc 7)

`tests/unit`:
- `prewarm.test.ts` (mới, 15/11, việc A, test MỚI, không sửa test cũ): bốn test. Luật GTGT giữ 8% suốt `prewarm` 24 + 11 tháng và đổi sang 10% đúng ở tick 36; lịch ở tick 24 trùng lịch ở tick 0 của thế giới không `prewarm`. `prewarm` không phải bội của 12 (hoặc âm, không nguyên) thì ném lỗi. `pack`/`load` và `fork` giữ `prewarm`; ván lưu không có trường này đọc thành 0. `prewarm: 0` cho mã băm trùng với không khai.
- `session.test.ts`, "control = shock" (15/11, **người điều phối quyết 15/11/2026, CHỜ DƯƠNG SOÁT**): kịch bản giả `thu-cu-soc` thêm `prewarm: 0`, không đổi gì khác (ngưỡng 0,01 và seed 4 giữ nguyên). Lý do: test kiểm cơ chế thế giới đối chứng của Session, không kiểm kinh tế; khai `prewarm: 0` giữ nó chạy đúng thế giới như trước (trùng từng bit). Số đo kèm: với chạy trước 240 tháng, ở 50 hộ chênh CPI tháng 24 sau khi tăng GTGT lên 20% là 0,0018 ở seed 4 và 0,0556 / 0,0303 / 0,0314 ở seed 1 / 2 / 3. Các kịch bản giả khác trong `tests/unit` đang xanh nên không đổi.
- `scenario-options.test.ts`, mục "khẳng định so nhánh với nhánh (lowerThanOptions)" (mới, 15/11, test MỚI, không sửa test cũ): hai test. Một: có `others` thì so đúng (nhánh A thấp hơn nhánh B thì B không thấp hơn A; `detail` in mã nhánh được so và dấu %). Hai: thiếu nhánh nêu tên hoặc thiếu `others` thì `ok` là false và `detail` nói rõ thiếu gì, không ném lỗi.
- `session.test.ts`, "control = shock": ngưỡng chênh CPI sau khi tăng GTGT hạ từ 1% xuống 0,3%. Lý do: người bán giờ chỉ chuyển ngay một phần thuế vào giá (S31). Test này kiểm thế giới đối chứng khác ván thật, không kiểm mức chuyển thuế.
- `session.test.ts`, "bỏ một chính sách": **đã hoàn lại assertion gốc theo yêu cầu của Dương; test đỏ từ 14/11, xanh lại từ 15/11 nhờ S36 (xem D13).** Trước đó Fable đã đổi "CPI ván thật cao hơn đối chứng" thành "khác đối chứng". Lý do: ở 50 hộ, sau 24 tháng tăng GTGT lên 20%, CPI ván thật THẤP hơn đối chứng (108,3 so với 109,9) vì cầu yếu đi. Ý chính của test (thế giới đối chứng trùng ván chưa có chính sách) không đổi. **Đây là chỗ Dương nên soát kỹ nhất**: một lần tăng thuế làm mức giá thấp hơn sau hai năm là kết quả lạ, mới thấy ở một seed, 50 hộ.
- `scenario-options.test.ts`, "tăng GTGT: giá có thuế tăng ít hơn..." (15/11, S36): mặc định giờ là chuyển trọn (`firm.taxPassUp` = 1), nên đảo vai: thế giới `b` đặt `firm.taxPassUp` = 0,34 và khẳng định `rise(b) < rise(a)`; đổi tên test cho khớp. Ý giữ nguyên: cơ chế chuyển một phần vẫn chạy khi đặt tham số dưới 1.
- `session.test.ts`, "control = shock" (15/11, S36): ngưỡng chênh CPI đưa về 0,01 như gốc trước 14/11 (đã hạ xuống 0,003 vì chuyển một phần); test qua với 0,01. Chú thích dòng sửa theo.
- `scenario-options.test.ts`, "giảm GTGT: biến thể symmetric..." (mới, 15/11, việc 3c): seed 5 scale S, 24 tháng, fork; một bản đặt biến thể `firm.taxPass` = `symmetric`; cả hai hạ `vat.rate.standard` xuống 0,02, chạy 1 tháng; giá có thuế bản symmetric giảm (< 0) và giảm nhiều hơn bản mặc định. Test mới, không sửa test cũ.
- `scenario-options.test.ts` (mới): phân rã ba chỉ số Chính phủ, chuyển thuế vào giá, lương bám lạm phát, so sánh nhánh.
- `chot-chan.test.ts` (mới): chốt chặn.
- `revenue-use.test.ts` (mới, 15/11, S37): bốn test của `gov.revenueUse`: không đổi thuế thì `gov.respend` = 0; tăng GTGT 15% thì `base` chi nhiều hơn `keep`; hạ GTGT 5% thì `base` chi bằng `keep`, `balanced` chi thấp hơn (đo 12 tháng đầu, vì xa hơn một vụ cứu ngân hàng ở một nhánh có thể đảo thứ tự); GTGT 8% về 10% theo lịch không kích hoạt.

Khẳng định kịch bản:
- `thue-nguoi-giau`, nhánh `debt` (15/11/2026, Dương duyệt): khẳng định đầu tư đổi từ "Không chi phần thu thêm: doanh nghiệp đầu tư ít hẳn đi" (so với thế giới đối chứng, 12-60 tháng; 6/10 ở lượt `b7ce617`) sang "đầu tư thấp hơn cả hai cách chi lại (transfer, purchase)" kèm câu nói rõ so với không tăng thuế thì không chắc (`lowerThanOptions`). Lý do: đo 10 seed, hiệu tương đối đầu tư so với đối chứng của nhánh `debt` có cả dấu dương lẫn âm (−31,4% đến +14,7%), nhưng thấp hơn cả hai nhánh kia ở 8/10 seed. Lời giải thích chung đổi "đầu tư ít đi" thành "đầu tư thấp hơn hai cách chi lại (so với không tăng thuế thì không chắc)". Kết quả kiểm định lượt `dccfcc0`: 8/10 qua. Truyền `others` ở `Session.scenarioOptions()` (src/engine/session/session.ts), không đổi giao thức, không đổi giàn `scenarios-lib.ts`. Không đổi khẳng định hay `goals` nào khác.
- `K1.26` (gd1-lib.ts): cửa sổ đo năm 2-4 thay cho 10 năm; `K1.24`: chỉ thêm chữ ghi chú. Chi tiết ở mục F của sai-khac.md.- `thue-nguoi-giau`: làm lại thành ba nhánh; khẳng định cũ "đầu tư thấp hơn", "thất nghiệp cao hơn", "Gini không thấp hơn" chuyển vào nhánh trả nợ; thêm khẳng định cho hai nhánh kia (D10). Hai khẳng định Gini của nhánh trợ cấp và đầu tư công có lề hẹp: ngưỡng 0,03, số đo lớn nhất 0,024 và 0,019.
- `keo-vao-luoi-thue`: thêm ba nhánh; khẳng định "thu nhập thực phi chính thức thấp hơn" đổi cửa sổ từ tháng 12 sang tháng 24.
- `het-han-giam-thue`, `gia-luong-tien`, `can-ngan-sach`, `that-lung-buoc-bung`: chỉ đổi lời giải thích và mục đơn giản hoá, không đổi khẳng định.
- 15/11 (S37, D14): `simplifications` của `thue-nguoi-giau`, `keo-vao-luoi-thue`, `het-han-giam-thue` thêm một câu khai nơi tiền thuế đi; hai kịch bản đầu thêm `setup.variants` đặt `gov.revenueUse = keep` cho mọi nhánh. Không đổi `claims`, `goals`.

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

Không còn việc nào treo từ phía Dương. Hai việc sẽ cần Dương sau: số đo sau khi sửa thất nghiệp (việc 2), và đề xuất tăng năng suất (việc 3).

### Các quyết định của Dương sáng và trưa 14/11/2026 (đã làm hết, chi tiết ở [design/sai-khac.md](design/sai-khac.md) mục B và D)

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
