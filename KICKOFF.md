# DỰ ÁN: KINH BANG - MÔ PHỎNG NỀN KINH TẾ VIỆT NAM

## Mục tiêu

Xây một web app mô phỏng một quốc gia giả lập theo Việt Nam, chơi như game.
Mục tiêu là giúp tôi HIỂU cách một nền kinh tế và một quốc gia vận hành, đầy đủ
nhất có thể. Hãy sáng tạo, freestyle thoải mái, nhưng cơ chế phải sát thực tế.

Những câu hỏi tôi muốn app trả lời được (và cả những câu tương tự tôi chưa nghĩ ra):
in thêm tiền thì giá cả ra sao; đánh thuế người giàu thì chuyện gì xảy ra; vì sao
bất bình đẳng tự hình thành; khủng hoảng lan ra thế nào.

## Quyền sáng tạo

- Tôi muốn bạn vượt khỏi những gì tôi mô tả. Hãy đề xuất cơ chế, tính năng,
  cách trình bày mà tôi chưa nghĩ tới, kể cả táo bạo. Mỗi đề xuất ghi rõ
  vì sao nó giúp tôi hiểu kinh tế tốt hơn.
- Được phép phản biện lộ trình, thứ tự giai đoạn và mọi yêu cầu ở đây nếu
  có cách tốt hơn. Nói thẳng, kèm lý do.
- Giới hạn duy nhất: không đánh đổi độ đúng của cơ chế kinh tế để lấy hiệu ứng.

## Trải nghiệm học và chất game

- Tự thiết kế cách tôi học qua app: hướng dẫn, thử thách theo màn, sự kiện
  bất ngờ (thiên tai, khủng hoảng, chiến tranh thương mại...), mục tiêu và
  hậu quả cho từng vai, lý do để chơi tiếp.
- Trực quan, rõ ràng, có cảm giác "sống": thấy dòng tiền, hàng hoá, người
  di chuyển trên bản đồ isometric.

## Chế độ chơi

1. KỊCH BẢN: tình huống dựng sẵn có mục tiêu và giới hạn thời gian.
   - Càng nhiều càng tốt. Mỗi giai đoạn bổ sung kịch bản cho các cơ chế
     mới của giai đoạn đó.
   - Không chia độ khó. Mỗi kịch bản ghi "nên hiểu trước" (cơ chế nào)
     và luôn mở để chơi.
   - Có nhóm kịch bản lấy cảm hứng từ sự kiện thật (vd siêu lạm phát
     trước Đổi Mới, lạm phát VN 2008/2011, khủng hoảng châu Á 1997,
     siêu lạm phát Zimbabwe). Sau khi chơi, so sánh cách tôi xử lý với
     diễn biến thật, ghi rõ chỗ nào là đơn giản hoá.
   - Kết thúc mỗi kịch bản: giải thích chuỗi nhân quả, vì sao thắng/thua.

2. SANDBOX: tự cài mọi điều kiện ban đầu và chính sách (dân số, phân phối
   tài sản, thuế, luật, tài nguyên...). Quy luật kinh tế giữ như thật,
   kết quả tự sinh ra từ hành vi tác nhân.
3. PHÒNG THÍ NGHIỆM (nằm trong sandbox): được sửa hoặc tắt chính các quy
   luật kinh tế (vd tắt kỳ vọng lạm phát, cho mọi người nộp thuế đủ) để
   xem một cơ chế quan trọng tới đâu. Luôn hiện cảnh báo rõ khi đang ở
   thế giới đã bị sửa luật, và cho so sánh song song với thế giới gốc.

## Ràng buộc kỹ thuật

- Đề xuất stack phù hợp và giải thích; ưu tiên thứ phổ biến, dễ bảo trì.
- Lưu/tải ván chơi, chạy offline được, không cần server.

## Yêu cầu cố định (áp dụng mọi giai đoạn)

- 3 vai, chuyển qua lại được:
  - Chính phủ: thuế, chi tiêu, lãi suất, in tiền, luật, đầu tư công.
  - Người tham gia: một hộ gia đình hoặc doanh nghiệp do tôi điều khiển.
  - Người quan sát: dashboard, biểu đồ, soi từng tác nhân.
- 3 quy mô: 50 / 500 / 5000 tác nhân. Engine chạy trong Web Worker, tách khỏi
  UI, thiết kế để 5000 tác nhân vẫn mượt.
- Web app chạy trên trình duyệt, có biểu đồ và chế độ xem isometric giống game.
  Đọc skill anatomy của tôi (chuyên isometric quy trình) và phát triển từ đó.
- CHUỖI NHÂN QUẢ (tính năng quan trọng nhất): mọi biến động lớn phải truy được
  nguyên nhân. Bấm vào một chỉ số thì app chỉ ra chuỗi cơ chế dẫn tới nó, giải
  thích bằng tiếng Việt dễ hiểu.
- Chế độ kịch bản: mỗi câu hỏi tò mò là một kịch bản chạy được, có lời giải thích.
- Luật, thuế, tham số Việt Nam để trong file cấu hình riêng. Mỗi tham số ghi
  nguồn văn bản và ngày hiệu lực. Tra cứu luật hiện hành; chỗ nào đơn giản hoá
  thì ghi rõ.
- Kiểm định: mỗi giai đoạn liệt kê các "sự thật kinh tế" mô hình phải tái hiện
  được, kèm test tự động. Chưa qua kiểm định thì chưa sang giai đoạn sau.
- Kiến trúc dạng module: giai đoạn sau gắn vào mà không phải viết lại lõi.

## Lộ trình

GĐ0 - Nền móng kỹ thuật: vòng lặp thời gian, mô hình dữ liệu tác nhân, Web Worker,
khung ghi nhận chuỗi nhân quả, hệ cấu hình luật, hệ test kiểm định, khung UI
3 vai và 3 quy mô.

GĐ1 - Lõi kinh tế: hộ gia đình; doanh nghiệp (nông nghiệp, sản xuất, dịch vụ);
ngân hàng thương mại; ngân hàng trung ương; chính phủ với ngân sách và nợ công
cơ bản. Thị trường hàng hoá, lao động, tín dụng; tiền tệ; thuế (VAT, TNCN,
TNDN); kỳ vọng và tâm lý (dự đoán lạm phát, niềm tin); kinh tế phi chính thức
(buôn bán nhỏ, tiền mặt, ngoài lưới thuế).

GĐ2 - Con người: dân số (sinh, tử, già hoá, di cư nông thôn-thành thị); giáo dục
và kỹ năng; y tế; hưu trí và bảo hiểm xã hội; lương tối thiểu.

GĐ3 - Tài sản và tài chính: đất đai theo luật Việt Nam (sở hữu toàn dân, quyền
sử dụng đất); nhà ở; chứng khoán; nợ xấu; vỡ nợ dây chuyền; rút tiền ồ ạt;
khủng hoảng lây lan.

GĐ4 - Cấu trúc thị trường: cạnh tranh và độc quyền; doanh nghiệp nhà nước;
công nghệ, năng suất, đổi mới.

GĐ5 - Mở cửa: xuất nhập khẩu, tỷ giá, thuế quan, FDI, kiều hối, du lịch.

GĐ6 - Không gian và vật chất: vùng miền (đô thị, nông thôn, ĐBSCL, khu công
nghiệp); logistics và vận tải; hạ tầng và đầu tư công; năng lượng (giá điện,
xăng lan sang chi phí sản xuất).

GĐ7 - Môi trường và rủi ro: ô nhiễm, biến đổi khí hậu, thiên tai, xâm nhập mặn.

GĐ8 - Thể chế và xã hội mở rộng: hiệu quả bộ máy, tham nhũng, niềm tin chính
sách; phúc lợi xã hội; kinh tế ngầm và tội phạm; quốc phòng; các luật còn lại.

GĐ9 - Hiệu chỉnh theo dữ liệu thật: đối chiếu với số liệu Tổng cục Thống kê,
Ngân hàng Nhà nước, World Bank, IMF để các con số ở mức hợp lý.

Có thể đề xuất thêm mảng tôi chưa nghĩ tới; hãy ghi vào giai đoạn phù hợp
kèm lý do.

## Quy trình mỗi giai đoạn

1. THIẾT KẾ, chưa code: cập nhật CLAUDE.md (kiến trúc, cơ chế, quy tắc hành vi
   tác nhân, lý do chọn từng cơ chế, nguồn tham khảo uy tín như mô hình
   agent-based economics và sách giáo khoa kinh tế), danh sách kiểm định.
   Dừng lại, tóm tắt cho tôi duyệt.
2. Sau khi tôi duyệt: code, chạy kiểm định, làm kịch bản mẫu, cập nhật progress log.
3. Báo cáo: đã làm gì, kiểm định nào qua hoặc chưa qua, chỗ nào đơn giản hoá,
   rủi ro cho giai đoạn sau.

## Phân vai model

- Mặc định Fable làm toàn bộ.
- Khi tôi báo hết quota Fable, phần còn lại sẽ do model khác làm tiếp
  theo CLAUDE.md. Vì vậy luôn giữ đặc tả, giao diện dữ liệu giữa engine
  và UI, và progress log đủ rõ để model khác tiếp quản không cần hỏi lại.
- Trong mỗi giai đoạn, làm engine và kiểm định trước, giao diện sau,
  để nếu hết quota Fable giữa chừng thì phần khó nhất đã xong.

## Chế độ tự chạy (sau khi tôi duyệt thiết kế)

- Không dừng hỏi tôi với quyết định nhỏ. Tự chọn phương án hợp lý nhất,
  ghi lại giả định và lý do vào progress log để tôi xem sau.
- Chỉ dừng khi: phải đổi thiết kế đã duyệt, kiểm định thất bại mà không
  tự sửa được sau vài lần thử, hoặc cần thông tin chỉ tôi mới có.
- Chia việc thành bước nhỏ. Xong mỗi bước: chạy test, git commit với
  mô tả rõ, cập nhật progress log. Nếu bị ngắt giữa chừng, lần sau đọc
  progress log và git log để làm tiếp đúng chỗ.
- Không xoá file hay chạy lệnh ngoài thư mục dự án.

## Quyết định đã chốt từ research

- Xương sống engine theo hướng Caiani 2016: kế toán kép chặt, cho vay tạo ra tiền gửi, sổ giao dịch dùng làm dữ liệu cho chuỗi nhân quả.
- Không dùng lượng tiền cố định hay số nhân tiền.
- Khoản vay nhiều kỳ ngay từ GĐ1.
- Kinh tế phi chính thức tự thiết kế ở GĐ1, bắt đầu từ bản tối thiểu trong research/abm-models.md, ghi rõ là cơ chế chưa có mô hình tham chiếu.
- Mức 50 tác nhân là sa bàn học; kiểm định thống kê chạy ở 500 và 5000.
- Kịch bản siêu lạm phát gắn nhãn "ngoài vùng đã kiểm định" cho tới khi có cơ chế và test riêng.
- Đưa điều hành tín dụng bằng hạn mức (room) vào công cụ của NHNN và thành kịch bản.
- Tham số lấy từ research/vn-params.md. Mức C dùng giá trị tạm, chỉ gắn nhãn "chưa xác minh" trong file config để GĐ9 tra lại; không hiện cảnh báo trong app. Không chặn thiết kế vì các chỗ còn treo ở mục 8.

## Lần này

Viết CLAUDE.md tổng thể cho cả lộ trình, rồi thiết kế chi tiết GĐ0 + GĐ1.
Dừng sau bước thiết kế để tôi duyệt. Bản tóm tắt gồm 2 phần tách riêng:
(1) thiết kế theo yêu cầu, (2) danh sách đề xuất sáng tạo và phản biện,
mỗi mục ghi lợi ích, chi phí (độ phức tạp, quota), để tôi chọn từng mục.
Các lần sau tôi chỉ cần nói "Làm GĐ N" và bạn làm theo quy trình trên.

CLAUDE.md giữ gọn: tổng quan, kiến trúc, quy tắc, quyết định đã chốt, và link tới tài liệu chi tiết. Spec chi tiết từng giai đoạn ghi vào docs/design/gdN.md. Progress log ghi vào docs/progress.md.

Đọc thư mục research/ trước (nếu có). Dùng làm đầu vào, nhưng tự kiểm tra
lại chỗ nào đánh dấu chưa xác minh hoặc trông đáng ngờ.
