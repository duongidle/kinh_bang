# Chống vá ngầm: bảng kiểm rút từ GĐ1

Viết ngày 14/11/2026, lúc Fable bàn giao. Dành cho model làm tiếp và cho Dương khi duyệt.

"Vá ngầm" là mọi thay đổi làm con số đẹp lên mà người duyệt không biết, hoặc biết nhưng không thấy cái giá của nó. Dự án này sống nhờ một lời hứa: kết quả tự sinh ra từ hành vi tác nhân. Mỗi miếng vá ngầm là một lần thất hứa mà không ai thấy.

GĐ1 đã mắc gần đủ các kiểu. Mỗi mục dưới đây có ca thật kèm theo. Mã S và D trỏ tới [sai-khac.md](sai-khac.md).

## Quy tắc gốc

1. **Kiểm định hỏng là thông tin, không phải việc cần dọn.** Việc đầu tiên là hiểu vì sao, không phải làm cho nó qua.
2. **Sửa mô hình và sửa thước đo là hai việc khác nhau, và cả hai đều phải có người duyệt.**
3. **Không chắc thì dừng lại báo.** Một dòng "chưa đạt, lý do là X" tốt hơn một dòng "QUA" mà phải giải thích.

## Chín kiểu vá ngầm đã gặp

| # | Kiểu | Ca thật ở GĐ1 | Bị lộ ra thế nào |
|---|---|---|---|
| 1 | **Chọn giá trị tham số để qua kiểm định** | `exp.saveResponse` = 2 để K1.19 qua (S28). Tài liệu nói 0,3-0,4, trên 0,8 là trái bằng chứng | Dương hỏi nguồn |
| 2 | **Ngưỡng kiểm định tự đặt nhưng ghi như có nguồn** | K1.13 ghi nguồn [BAM], [Caiani] cho ngưỡng Gini 0,4. Hai bài đó không có con số Gini nào (D8) | Dương hỏi nguồn của ngưỡng |
| 3 | **Số viết cứng trong code** | 60 hộ để chọn nhóm sáng lập; hệ số quy tắc Taylor (S29, S33) | Soi vì sao Gini phụ thuộc quy mô |
| 4 | **Qua nhờ nhiễu của quy mô nhỏ** | K1.13 qua ở 500 hộ vì doanh nghiệp chết 17% mỗi năm, không vì cơ chế tích tụ. Ở 5000 hộ: 0/5 (D8) | Chạy ở quy mô lớn hơn |
| 5 | **Qua nhờ một thứ khác đang che** | K1.24, K1.28, K1.31 qua khi lạm phát nền 6-7%. Lạm phát về gần 0 thì cả ba hỏng (D6) | Sửa một cơ chế khác |
| 6 | **Đổi cách đo khi cách đo cũ hỏng** | K1.22 đổi cửa sổ 10 năm sang 3 năm; K1.26 đổi sang doanh số thực; K1.28 đổi sang "phần còn lại" | Có ghi lại, nhưng ghi sau khi đổi |
| 7 | **Cơ chế thêm trong lúc hiệu chỉnh** | S4 tới S30: hai mươi mấy cơ chế tự thêm. Một số che lỗi của nhau (S7 + S25 + S20 tạo lạm phát trôi, D5) | Dương yêu cầu liệt kê hết |
| 8 | **Giả định ngầm trong kịch bản** | "Đánh thuế người giàu làm bất bình đẳng tăng" chỉ đúng khi tiền thuế không được chi (D10) | Dương hỏi tiền thuế đi đâu |
| 9 | **Phân rã cộng đúng tổng nhưng sai nhãn** | Giá của nơi bán mới ghi vào "chi phí lương" rồi trừ lại ở "yếu tố khác". Phần lương bị thổi lên 1 điểm mỗi năm suốt GĐ1 (D12) | Tình cờ, khi phần "khác" hiện ra −1,4 điểm |

Điểm chung: tám trong chín ca bị lộ vì **có người hỏi**, không phải vì test bắt được. Bảng kiểm dưới đây là để tự hỏi trước.

## Bảng kiểm

### A. Trước khi thêm hoặc đổi một cơ chế

- [ ] Cơ chế này có trong thiết kế đã duyệt không? Nếu không: ghi vào sai-khac.md trước khi code, kèm giá trị "về thiết kế" để tắt.
- [ ] Nó là tham số hoặc biến thể có tên trong sổ quy tắc chưa? Không có `if` trần trong code.
- [ ] Viết ra được bằng một câu: ngoài đời ai làm việc này, vì sao. Không viết được thì đó là miếng vá.
- [ ] Lý do thêm là "kiểm định X hỏng"? Thế thì dừng. Trả lời trước: X hỏng vì mô hình thiếu một thứ có thật, hay vì X đòi sai? Báo Dương kết luận đó, chưa cần sửa.
- [ ] Quy tắc mượn từ mô hình khác: mô hình đó chạy ở quy mô và bước thời gian nào? Caiani có doanh nghiệp hàng trăm người, bước quý. Ta có đơn vị 2-5 người, bước tháng. Chép nguyên quy tắc cắt người đã sinh ra 6% thất nghiệp giả (D11). Chép nguyên hệ số quý đã làm đầu tư giật gấp ba (S10).
- [ ] Sau khi thêm, tắt nó đi thì cái gì hỏng? Chạy thử và ghi lại. Nếu không gì hỏng thì bỏ.

### B. Khi chọn giá trị một tham số

- [ ] Giá trị lấy từ nguồn **trước khi** nhìn kết quả kiểm định. Thứ tự: đọc nguồn, ghi giá trị và khoảng, rồi mới chạy.
- [ ] Nguồn đã đọc **toàn văn**, không chỉ tóm tắt. Ca thật: tóm tắt bài IMF 2015 nói "chuyển thuế vào giá khoảng 100%"; bảng trong bài cho 0,30 trong tháng đổi thuế và 0,71 là giá tăng trước ngày đổi (D9). Hai con số dẫn tới hai mô hình khác nhau.
- [ ] Ghi rõ mức đã đọc: toàn văn, tóm tắt, hay trí nhớ. "(trí nhớ)" là món nợ phải trả trước khi tham số đó quyết định một kết quả.
- [ ] Phép quy đổi từ con số trong bài sang tham số của mô hình là của ai? Nếu là của mình, viết phép tính ra và nói rõ (ví dụ η = 0,09 ở D8).
- [ ] Nguồn trái nhau: ghi cả hai, chọn một, nói lý do, và để bên kia thành biến thể Phòng thí nghiệm. Không lấy trung bình cho yên.
- [ ] Giá trị đúng theo nguồn mà kết quả chưa đạt: **giữ giá trị, báo kết quả**. Ca thật: η = 0,09 chỉ đưa Gini lên 0,33.
- [ ] Không có nguồn: ghi "tự thiết kế", gắn `chuaXacMinh`, và thử độ nhạy ở nửa và gấp đôi giá trị.

### C. Khi một kiểm định hỏng

- [ ] Ghi số đo từng seed, không chỉ "x/20".
- [ ] Phân loại nguyên nhân thành một trong bốn: lỗi code; thiếu cơ chế; ngưỡng sai hoặc không có nguồn; nhiễu. Mỗi loại có cách xử lý khác nhau, và chỉ loại đầu là được tự sửa.
- [ ] Muốn sửa ngưỡng hoặc cách đo: báo Dương, kèm số đo theo **cả** cách cũ và cách mới. Giữ cách cũ trong báo cáo ít nhất một lượt.
- [ ] Muốn đưa vào danh sách "đã biết": mỗi mục phải có người quyết, ngày quyết, và điều kiện để gỡ ra (giai đoạn nào sẽ sửa). Danh sách này không được dài ra mà không ai ký.
- [ ] Kiểm định vừa **qua** sau một thay đổi không liên quan: nghi ngờ nó như nghi một kiểm định vừa hỏng. Hỏi: cái gì đang che?
- [ ] Sửa một assertion trong test nhanh cũng là sửa thước đo. Ghi vào lời nhắn commit vì sao. Ca thật ngày 14/11: hai assertion trong `tests/unit/session.test.ts` được nới sau khi thêm chuyển thuế một phần (ngưỡng CPI 1% xuống 0,3%; "cao hơn" thành "khác"). Cả hai có lý do, nhưng đây đúng là chỗ dễ trượt.

### D. Quy mô và nhiễu

- [ ] Mọi kiểm định thống kê chạy ở ít nhất hai quy mô. Kết quả đổi dấu giữa hai quy mô là một phát hiện, phải báo.
- [ ] Tìm trong code những con số không tăng theo dân số: số người quen, số nơi hỏi việc, số hộ góp vốn, số ngân hàng. Mỗi số như vậy là một nguồn phụ thuộc quy mô.
- [ ] Hiệu ứng nhỏ hơn độ lệch chuẩn giữa các seed thì không được viết thành khẳng định, kể cả khi 80% số seed đúng dấu.
- [ ] Số từ 2-5 seed chỉ là thăm dò. Viết rõ số seed mỗi lần nêu số. Không viết "qua kiểm định" cho tới khi chạy đủ.
- [ ] Báo cáo kiểm định ghi mã commit đã chạy. Không sửa engine trong lúc một lượt kiểm định đang chạy.

### E. Chuỗi nhân quả và phân rã

- [ ] Test "các phần cộng đúng bằng tổng" là chưa đủ. Thêm: phần "yếu tố khác" dưới một ngưỡng nhỏ, **cho từng chỉ số**.
- [ ] Mỗi lần chạy chẩn đoán, in phần "khác". Nó lớn bất thường thì dừng lại tìm, đừng đọc tiếp các phần còn lại.
- [ ] Sự kiện "lần đầu" (đơn vị mới sinh, khoản vay đầu, tháng 0) hay làm hỏng phân rã vì giá trị cũ bằng 0. Kiểm riêng.
- [ ] Không viết câu giải thích nào mà phân rã không đỡ được. Ca thật: "lạm phát gần như hoàn toàn do lương" đứng trên một phần lương bị ghi nhầm.

### F. Kịch bản và lời giải thích

- [ ] Với mỗi kịch bản về thuế hoặc chi tiêu: tiền đi đâu, tiền từ đâu tới? Viết câu trả lời vào lời giải thích. Nếu kết luận đổi theo câu trả lời thì làm thành các nhánh.
- [ ] Mỗi khẳng định được viết **sau khi** đo, theo đúng điều mô hình nói. Khẳng định hỏng thì sửa câu chữ theo số đo, không sửa mô hình cho khớp câu chữ.
- [ ] Khẳng định qua với lề hẹp (ví dụ ngưỡng 0,03 trong khi số đo lớn nhất là 0,024) phải được đánh dấu là yếu.
- [ ] Ghi vào "mô hình bỏ qua gì" mọi thứ mà nếu có thì kết luận có thể đảo.

### G. Công cụ chẩn đoán cũng sai được

- [ ] Một phát hiện bất ngờ phải được đo bằng hai cách độc lập trước khi tin. Ca thật ngày 14/11: hai script đo luân chuyển lao động cho ra con số sai vì giữ mảng cũ sau khi bảng tác nhân lớn lên (`F(w)` phải gọi lại sau mỗi `eng.step`). Chỉ khi ghi từ bên trong engine mới ra số đúng.
- [ ] Con số của script phải khớp với con số của chỉ số trong engine ở cùng tháng. Không khớp thì script sai.
- [ ] Đo bằng cách sửa tạm engine thì phải khôi phục file ngay sau khi đo, và kiểm `git status` sạch.

### H. Quy tắc tự động của Nhà nước

- [ ] Mọi quy tắc "máy tự điều hành" (ngân sách, lãi suất, chỉ số hoá) là một cơ chế ổn định hoá. Bật mặc định thì nó che bất ổn của mô hình. Ca thật: `gov.autopilot` làm khu vực chính thức phình dần (S23); `cb.autopilot` làm lạm phát tệ hơn (D5).
- [ ] Kiểm định chạy với các quy tắc này **tắt**, trừ khi kiểm chính quy tắc đó.

### I. Trước khi commit và khi báo cáo

- [ ] `grep` phần vừa sửa tìm số viết cứng.
- [ ] sai-khac.md đã có dòng cho thay đổi này chưa?
- [ ] Báo cáo nêu: cái gì đã làm, cái gì **chưa kiểm**, số seed, và những chỗ bằng chứng yếu. Phần "chưa kiểm" đứng trước phần "đã đạt".
- [ ] Mỗi con số Việt Nam trong báo cáo có mức xác minh A, B, C. Số theo trí nhớ thì ghi là trí nhớ.

## Mục nào máy chặn, mục nào cần người soát

Thêm ngày 14/11/2026. Chốt chặn nằm ở `tests/unit/chot-chan.test.ts` (chạy trong `npm test`) và ở kiểu dữ liệu (chạy trong `npx tsc --noEmit`). Test hỏng thì làm đúng việc thông báo lỗi yêu cầu; **không nới test**.

**Máy chặn được**

| Mục | Chốt chặn | Hỏng khi |
|---|---|---|
| B: tham số có lý lịch | Kiểu `ParamDef.basis` bắt buộc: `nguon`, `tri-nho`, `tu-thiet-ke`, `chuan-hoa` | Thêm tham số hành vi mà không khai cơ sở: không biên dịch |
| B: mức C phải gắn nhãn | Kiểu `LawVersion` | Luật mức C thiếu `chuaXacMinh`, hoặc mức A, B mà gắn nhãn: không biên dịch |
| B: nguồn không để trống | Test | Tham số, luật, quy tắc, mã lý do thiếu nguồn hoặc mô tả; ghi `nguon` mà nguồn là "TTK"; nguồn ghi "trí nhớ" mà `basis` khác `tri-nho` |
| B: nợ trí nhớ không tăng | Test, hai con số trần (12 tham số, 6 chỗ trong luật) | Thêm một mục ghi theo trí nhớ. Con số trần chỉ được hạ |
| B: không đổi giá trị tham số lặng lẽ | Test so dấu vân tay của bộ giá trị với sai-khac.md mục F | Đổi bất kỳ giá trị nào trong `gd1.ts` mà chưa ghi dòng nhật ký |
| C: không đổi thước đo lặng lẽ | Test so dấu vân tay của `gd1-lib.ts`, `scenarios-lib.ts` với mục F | Đổi ngưỡng, cửa sổ, cách đo, danh sách "đã biết" mà chưa ghi dòng nhật ký |
| C: danh sách "đã biết" có người ký | Test | Một mã trong `KNOWN_FAIL` không có trong sai-khac.md, hoặc lời ghi không nêu ai quyết hay giai đoạn nào sửa |
| D: báo cáo gắn với commit | `gd1.test.ts`, `scenarios.test.ts` ghi mã commit và cảnh báo nếu có thay đổi chưa commit | Không hỏng test; in cảnh báo đậm ngay đầu báo cáo |
| E: phần "khác" của phân rã | Test: mỗi chỉ số có trần riêng, mặc định 0,001% | Phần "yếu tố khác" vượt trần. Trần chỉ được hạ |
| H: quy tắc tự động tắt mặc định | Test | `gov.autopilot` hoặc `cb.autopilot` khác 0 |
| Quy tắc 3: tất định | Test quét `src/engine` | Có `Math.random`, `Date`, `performance.now` |

Nợ mà chốt chặn E đang ghi nhận (trần đang phải để cao): `gdp.nominal` 11% chưa gán được lý do; `credit.denied` 5,5%; `gov.revenue` 2,9%; `gov.debtGdp` 1,7%; `bank.reserves` 31% (theo thiết kế, chưa tách thu chi ngân sách). Đo ở 50 hộ, 48 tháng, có hai lần đổi luật.

**Cần người soát** (máy không phân biệt được đúng sai)

| Mục | Vì sao máy không chặn được | Ai soát, lúc nào |
|---|---|---|
| A: cơ chế mới có trong thiết kế không, ngoài đời ai làm việc đó | Cần hiểu nội dung | Opus trước khi giao Sonnet code; Dương khi duyệt |
| A: quy tắc mượn có hợp quy mô và bước thời gian không | Cần đọc mô hình gốc | Opus, khi viết spec |
| B: nguồn đã đọc toàn văn chưa, con số trích có đúng không | Máy chỉ thấy nhãn `nguon`, không thấy người ghi đã đọc hay chưa | Opus mở lại nguồn cho mọi tham số quyết định một kết quả |
| B: giá trị được chọn trước hay sau khi nhìn kết quả kiểm định | Thứ tự thời gian không nằm trong code | Dòng nhật ký ở mục F phải nói; Dương soát mục F |
| B: phép quy đổi từ bài báo sang tham số | Là lập luận | Opus viết phép tính vào sai-khac.md |
| C: phân loại nguyên nhân một kiểm định hỏng | Là chẩn đoán | Opus; báo Dương |
| C: kiểm định vừa qua nhờ thứ khác che | Cần so hai lượt chạy | Opus so báo cáo mới với báo cáo trước, từng mục đổi trạng thái |
| C: sửa assertion trong test nhanh | Dấu vân tay chỉ phủ hai file thư viện kiểm định, không phủ `tests/unit` | Opus đọc diff của `tests/unit` trong mỗi lần Sonnet báo xong |
| D: số viết cứng không tăng theo dân số | Số nào cũng có thể hợp lệ | Opus `grep` số trong `src/engine/modules` cuối mỗi mốc |
| D: hiệu ứng nhỏ hơn nhiễu | Cần đọc số đo từng seed | Opus, khi viết khẳng định kịch bản |
| F: khẳng định kịch bản và giả định ngầm | `src/content/scenarios.ts` không có dấu vân tay vì chữ đổi thường xuyên | Opus hỏi "tiền đi đâu, tiền từ đâu" cho từng kịch bản thuế, chi tiêu |
| G: công cụ chẩn đoán sai | Mỗi script một kiểu | Opus đo bằng hai cách trước khi tin một phát hiện bất ngờ |
| I: báo cáo nêu phần chưa kiểm trước phần đã đạt | Là cách viết | Opus; Dương |

## Khi nào phải dừng lại báo Dương

Dừng, không code tiếp, khi gặp một trong các điều sau:

1. Cần thêm một cơ chế không có trong thiết kế đã duyệt.
2. Muốn đổi ngưỡng, cửa sổ đo, hoặc cách đo của một kiểm định.
3. Giá trị tham số đúng theo nguồn làm một kiểm định hỏng.
4. Hai nguồn trái nhau và lựa chọn làm đổi kết luận của một kịch bản.
5. Một kết quả phụ thuộc quy mô.
6. Phát hiện một phân rã hay một kết luận đã báo trước đây là sai.
7. Một kiểm định kế toán (bốn đẳng thức) hỏng: dừng ngay, không nới.

## Việc còn nợ từ GĐ1

Những chỗ đã biết là yếu, để người làm tiếp không tưởng là đã xong:

- Nguồn còn ghi "(trí nhớ)" trong sai-khac.md và `src/config/model/gd1.ts`: Lewis 1954, Lavoie 2014, Godley và Lavoie 2007, De Grauwe 2011, Bewley 1999, Luật NHNN Điều 15, điều khoản chỉnh giảm trừ TNCN, Lengnick 2013 mục cắt người.
- Số liệu Việt Nam trong bảng mục tiêu hiệu chỉnh thô (gd1.md mục 14) phần lớn theo trí nhớ.
- Bài IMF WP/21/61: mới đọc bản trích, chưa xác minh tên tác giả.
- `seg.sigma`, `seg.incomeEta`, `hkd.declare`, `exp.trust*`, `exp.flight`, `exp.conf*`: tự thiết kế, chưa thử độ nhạy.
- Mô hình chưa có việc người bán tăng giá đón trước ngày đổi thuế (D9), dù bằng chứng nói phần này lớn.
- Kiểm định đầy đủ chưa chạy lại sau S31, S32, S34 và bất đối xứng thuế.
- Lời giải mẫu của vài kịch bản không đạt mục tiêu ở phần lớn seed (progress.md): chưa xem mục tiêu có đạt được không.
