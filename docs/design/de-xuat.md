# Đề xuất sáng tạo và phản biện

Ngày viết: 13/11/2026. **Dương đã duyệt ngày 13/11/2026**; cột trạng thái ghi quyết định. Mỗi mục có mã để cậu trả lời ngắn, ví dụ "nhận S1, S3; bỏ S5". Cột trạng thái cập nhật sau khi cậu chọn.

Chi phí ghi theo ba mức, tính cả độ phức tạp lẫn quota: **thấp** (dưới 5% công của GĐ0+GĐ1), **vừa** (5-10%), **cao** (trên 10%).

## T. Lựa chọn thiết kế cần duyệt

| Mã | Nội dung | Lợi ích | Chi phí | Trạng thái |
|---|---|---|---|---|
| T1 | Đưa vốn cố định dạng đơn giản (máy móc, đầu tư, khấu hao) vào GĐ1. Research đề nghị để GĐ4 | Không có đầu tư thì doanh nghiệp gần như không cần vay. Kênh lãi suất, room tín dụng, chu kỳ tín dụng đều yếu đi. Câu "khủng hoảng lan ra thế nào" cần nợ doanh nghiệp có thật | Vừa. Thêm quy tắc đầu tư, luồng mua máy, và thêm việc hiệu chỉnh | nhận |
| T2 | Lối thoát phi chính thức: người thất nghiệp lâu tự mở hộ kinh doanh một người | Tái hiện đúng nét Việt Nam: thất nghiệp thấp nhưng thu nhập thấp. Không có thì mô hình ra thất nghiệp kiểu châu Âu | Thấp về code, vừa về hiệu chỉnh. Cơ chế tự thiết kế | nhận |
| T3 | Chính phủ không được NHNN tự động mua trái phiếu ế. Phải chọn rõ: cắt chi hoặc in tiền | "In tiền" trở thành quyết định nhìn thấy được, không xảy ra ngầm | Thấp. Khác với Caiani nên mất chỗ dựa kiểm định ở phần này | nhận |

## S. Đề xuất sáng tạo

| Mã | Nội dung | Vì sao giúp hiểu kinh tế | Chi phí | Trạng thái |
|---|---|---|---|---|
| S1 | **Nút "Nếu không làm vậy thì sao?"** ở mọi hành động chính sách và mọi chuỗi nhân quả, không chỉ trong Phòng thí nghiệm. Tách thế giới song song, bỏ hành động đó, chạy lại, đặt hai đường cạnh nhau | Đây là cách duy nhất trả lời đúng câu hỏi nhân quả. Phần phân rã chỉ cho biết đóng góp trực tiếp. Người chơi học được thói quen so với đối chứng | Thấp. Engine đã có sẵn khả năng tách nhánh; chỉ thêm UI so sánh | nhận |
| S2 | **Đoán trước khi chạy.** Trước mỗi kịch bản và mỗi thay đổi chính sách lớn, app hỏi cậu đoán hướng đi của 2-3 chỉ số. Sau đó so với kết quả và chỉ ra mắt xích cậu đoán sai | Tự đoán rồi bị sửa giúp nhớ lâu hơn nhiều so với chỉ xem. Nó cũng lưu lại được cậu tiến bộ ở cơ chế nào | Thấp | nhận |
| S3 | **Bảng nguồn tạo và huỷ tiền.** Mỗi tháng: tiền sinh ra từ đâu (vay mới, chi ngân sách, NHNN mua trái phiếu), mất đi đâu (trả nợ, thuế). Ý tưởng từ bảng "vòi và cống" của EVE Online | Trả lời thẳng câu "tiền từ đâu ra". Thấy được ngân hàng thương mại tạo phần lớn tiền, không phải NHNN | Thấp. Lấy thẳng từ sổ cái | nhận |
| S4 | **Bảng cân đối sống.** Soi bất kỳ tác nhân nào cũng thấy tài sản và nợ dạng chữ T. Khi có giao dịch, hai bảng của hai bên cùng đổi trước mắt | Kế toán kép là thứ khó hình dung nhất và là nền của mọi thứ còn lại | Thấp đến vừa | nhận |
| S5 | **Theo dấu đồng tiền.** Đánh dấu một khoản tiền (ví dụ 100 tỷ vừa in) và xem nó qua tay ai, dừng ở đâu, sau bao lâu thì nằm trong tài khoản của nhóm nào | Cho thấy tiền mới không vào đều, và ai nhận trước thì mua được giá cũ | Vừa. Cần gắn nhãn tỷ lệ trên sổ cái | để sau GĐ1 |
| S6 | **Tua lại và rẽ nhánh.** Kéo dòng thời gian về một mốc đã tự lưu rồi chơi tiếp theo hướng khác | Thử nhiều cách xử lý cùng một tình huống mà không chơi lại từ đầu | Vừa. Dùng lại cơ chế lưu, tốn bộ nhớ | để sau GĐ1 |
| S7 | **Bản tin kinh tế.** Mỗi tháng hoặc quý, app sinh vài dòng tin từ chuỗi nhân quả: "Giá thực phẩm tăng 4% vì..." | Tạo cảm giác sống, và tập cho người chơi đọc nhân quả thành lời. Câu chữ sinh từ dữ liệu thật | Thấp | nhận |
| S8 | **Vài hộ có tên.** 5-8 hộ và doanh nghiệp có tên, nghề, hoàn cảnh, được theo suốt ván. Sau mỗi chính sách: "nhà chị Lan bán phở thay đổi thế nào" | Tác động phân phối trở nên cụ thể. Con số trung bình che mất ai được ai mất | Thấp | nhận |
| S9 | **Vai chủ ngân hàng.** Điều khiển một ngân hàng thương mại: lãi suất, duyệt vay, giữ bao nhiêu dự trữ, mua trái phiếu | Cách nhanh nhất để hiểu ngân hàng tạo tiền và vì sao chúng siết tín dụng đúng lúc tệ nhất | Vừa. Engine đã có quyết định, cần bảng điều khiển riêng | để sau GĐ1 |
| S10 | **Tách vai Chính phủ thành Bộ Tài chính và NHNN**, giữ một bên, bên kia chạy tự động | Hiểu vì sao hai chính sách phải phối hợp, và điều gì xảy ra khi chúng kéo ngược nhau | Thấp | nhận |
| S11 | **Máy giải thích kiểu anatomy.** Một figure isometric chi tiết cho mỗi cơ chế lõi, chạy bằng số thật của ván. Hai ứng viên: (a) bể thuỷ lực dòng tiền quốc gia kiểu máy MONIAC, mực nước là số dư các khu vực; (b) cỗ máy tạo tiền của ngân hàng | Đúng tinh thần skill anatomy: vật thể chính là lời giải thích. Bể thuỷ lực cho thấy cả vòng tuần hoàn trong một hình | Cao. Mỗi figure đạt chuẩn của skill tốn từ một đến vài giờ. Khuyên làm (a) trước, ở cuối GĐ1 | nhận: một figure (bể thuỷ lực) ở cuối GĐ1 |
| S12 | **Sổ tay khái niệm mở dần.** Mỗi cơ chế xuất hiện lần đầu trong ván thì mở một mục, kèm đường dẫn tới đúng thời điểm nó xảy ra trong ván của cậu | Khái niệm gắn với trải nghiệm của chính mình, không phải định nghĩa suông | Vừa | để sau GĐ1 |
| S13 | **Mục "mô hình này bỏ qua gì"** luôn mở được, liệt kê đơn giản hoá của giai đoạn hiện tại | Chống lại việc tin mô hình như tin thực tế, lỗi mà Starr 1994 phê bình SimCity | Thấp | nhận |
| S14 | **Xuất dữ liệu CSV** của mọi chuỗi và mọi lần chạy đôi | Cậu tự phân tích, tự vẽ lại được | Thấp | nhận |

## M. Mảng nên thêm vào lộ trình

| Mã | Mảng | Giai đoạn | Lý do | Trạng thái |
|---|---|---|---|---|
| M1 | Tín dụng ngoài ngân hàng: hụi họ, tín dụng đen, vay người quen | GĐ3 | Hộ kinh doanh không vay được ngân hàng nhưng ngoài đời vẫn vay. Bỏ qua thì khu vực phi chính thức bị bóp nghẹt quá mức, và mất một kênh lây lan khủng hoảng (vỡ hụi) | nhận |
| M2 | Vàng và đô la như nơi trú ẩn | GĐ5 | Người Việt bỏ đồng nội tệ sang vàng và đô la khi mất niềm tin. Đây là nửa còn lại của cơ chế siêu lạm phát | nhận |
| M3 | Ràng buộc chính trị: mức đồng thuận của các nhóm dân cư với Chính phủ | GĐ8 | Không có nó thì người chơi cứ chọn chính sách tối ưu về kinh tế. Ngoài đời chính sách tốt hay chết vì nhóm chịu thiệt phản đối | nhận |
| M4 | Thị trường liên ngân hàng | GĐ3 | GĐ1 cho NHNN cho vay tự động. Lây lan giữa các ngân hàng cần thị trường này | nhận |

## P. Phản biện

| Mã | Phản biện | Đề nghị | Chi phí | Trạng thái |
|---|---|---|---|---|
| P1 | **Thứ tự lộ trình.** Sau GĐ1, câu hỏi gốc còn thiếu là "khủng hoảng lan ra thế nào" (cần GĐ3). Và mọi kịch bản lịch sử cậu nêu (2008, 2011, 1997, Zimbabwe) đều có tỷ giá và vốn ngoại (cần GĐ5). Dân số và giáo dục (GĐ2) thay đổi chậm theo thập kỷ, ít liên quan bốn câu hỏi gốc | Đổi thành GĐ1 → GĐ3 → GĐ5 → GĐ2 → GĐ4 → GĐ6... Sau hai giai đoạn kế tiếp là trả lời đủ bốn câu hỏi và các kịch bản lịch sử trung thực hơn | Không tốn thêm. Điểm trừ: nhà ở GĐ3 sẽ chưa có di cư; lương tối thiểu và BHXH đến muộn hơn | nhận, có sửa: lương tối thiểu vùng kéo về GĐ1 |
| P2 | **Hiệu chỉnh để tận GĐ9 là muộn.** Tám giai đoạn xây trên tham số có thể lệch xa thực tế, tới GĐ9 mới phát hiện thì sửa lan ngược | Mỗi giai đoạn có vài mục tiêu hiệu chỉnh thô (tỷ lệ phi chính thức, tiền mặt, thu ngân sách...). GĐ9 giữ vai trò hiệu chỉnh tinh. Tớ đã làm vậy cho GĐ1 (gd1 mục 14.2) | Thấp mỗi giai đoạn | nhận |
| P3 | **Kịch bản lịch sử trong nền kinh tế đóng.** Ở GĐ1, làm 1997 hay Zimbabwe thì phải bịa cơ chế tỷ giá. Như vậy vi phạm giới hạn duy nhất của cậu | GĐ1 chỉ làm hai kịch bản lịch sử: tín dụng nóng 2007-2011 và giá-lương-tiền 1985. Cả hai ghi rõ thiếu kênh đối ngoại. 1997 và Zimbabwe để GĐ5 | Không | nhận |
| P4 | **"Càng nhiều kịch bản càng tốt."** Mỗi kịch bản có lời giải thích nhân quả. Mô hình ngẫu nhiên, nên một lời giải thích có thể đúng ở lần chạy này và sai ở lần khác. Kịch bản nhiều mà lời giải thích sai thì dạy sai | Mỗi kịch bản phải qua kiểm định riêng: khẳng định trong lời giải thích đúng ở ít nhất 80% số seed. Vì vậy mỗi giai đoạn khoảng 8-13 kịch bản thay vì vài chục | Vừa. Mỗi kịch bản thêm một test | nhận |
| P5 | **Bản đồ isometric trước GĐ6.** Ở GĐ1-5 vị trí không có ý nghĩa kinh tế. Vẽ bản đồ như thật dễ khiến người chơi tưởng khoảng cách có tác dụng | Trước GĐ6, bản đồ là một thị trấn sa bàn, UI nói rõ vị trí chỉ để nhìn. Dòng tiền và hàng trên bản đồ vẫn là giao dịch thật | Không | nhận |
| P6 | **Skill anatomy và bản đồ sống.** Skill làm figure SVG tĩnh, mỗi chi tiết một phần tử. 5000 tác nhân chuyển động bằng SVG sẽ giật | Lấy phép chiếu và ngôn ngữ hình ảnh của skill, công trình dựng bằng kit rồi chuyển thành sprite, lớp động vẽ bằng Canvas. Skill dùng nguyên bản cho các "máy giải thích" (S11) | Đã tính trong GĐ0 | nhận |
| P7 | **Chuỗi nhân quả "truy được nguyên nhân".** Phân rã theo sổ sách chỉ ra nguyên nhân trực tiếp. Nó không chứng minh được "nếu không có X thì Y không xảy ra", nhất là khi có vòng phản hồi | Tách hai loại câu trả lời, ghi nhãn rõ: phân rã (tức thì) và đối chứng (chạy lại). Đã thiết kế ở gd0 mục 5.3 | Đã tính | nhận |
| P8 | **Siêu lạm phát.** Ngoài việc chưa kiểm định, mô hình GĐ1 thiếu hai thứ quyết định của siêu lạm phát thật: chạy sang vàng và đô la, và sụp đổ năng lực thu thuế | Kịch bản 13 ở GĐ1 chỉ nên gọi là "lạm phát cao do in tiền", không gọi là siêu lạm phát. Bản đầy đủ làm sau GĐ5 cùng M2 | Không | nhận |
