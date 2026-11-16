# Lộ trình

Chuyển nguyên từ CLAUDE.md ngày 15/11/2026 (Dương bảo). Chỉ sửa đường dẫn cho đúng vị trí file mới, mục GĐ1.5, và thêm ngoại lệ GĐ1 ở cuối.

Thứ tự đã duyệt (khác [KICKOFF.md](../KICKOFF.md), giữ nguyên số hiệu giai đoạn):

GĐ0 nền móng kỹ thuật → GĐ1 lõi kinh tế → **GĐ1.5** đánh bóng trải nghiệm → **GĐ3** tài sản và tài chính (kèm **GĐ1 update 1**) → **GĐ5** mở cửa → **GĐ2** con người → GĐ4 cấu trúc thị trường → GĐ6 không gian và vật chất → GĐ7 môi trường và rủi ro → GĐ8 thể chế và xã hội → GĐ9 hiệu chỉnh tinh theo dữ liệu thật.

**GĐ1.5 - Đánh bóng trải nghiệm.** Spec đã duyệt ngày 15/11/2026 ở [docs/design/gd1-5.md](design/gd1-5.md) (U1-U7).

**GĐ1 update 1** (Dương quyết 15/11/2026). GĐ1 chốt là một nền kinh tế **không tăng trưởng**, không phát triển thêm cơ chế. Nhóm việc sau làm cùng GĐ3: biên lãi hồi dần sau khi đổi thuế (việc 8), tăng giá đón trước ngày thuế có hiệu lực (8b), phân tích độ nhạy và soát nguồn tham số (5), lấp phần GDP danh nghĩa chưa gán lý do (6), đề xuất tăng năng suất (3, có thể thuộc GĐ4), quy tắc giữ người qua tháng bán chậm để hạ thất nghiệp (việc 2; bản dải tồn kho Lengnick S38 đã thử ngày 15/11/2026 và không hợp, xem sai-khac.md D11). Đặc tả từng việc ở progress.md. Mục tiêu hiệu chỉnh về tiền, tín dụng, tăng trưởng (và lạm phát, bội chi đi theo chúng) chuyển sang GĐ4.

Nội dung từng giai đoạn ở KICKOFF.md, với các thay đổi đã duyệt:
- Lương tối thiểu vùng chuyển từ GĐ2 về GĐ1. BHXH và phần còn lại của GĐ2 giữ nguyên.
- Kiểm định K1.31 (nâng mạnh lương tối thiểu) chuyển sang GĐ2 (Dương quyết 14/11/2026): cần lương phân tán theo kỹ năng. Lý do: [sai-khac.md mục D6](design/sai-khac.md).
- Vốn cố định dạng đơn giản có ngay GĐ1; đời máy, R&D vẫn ở GĐ4.
- Thêm vào GĐ3: tín dụng ngoài ngân hàng (hụi họ, tín dụng đen) và thị trường liên ngân hàng.
- Thêm vào GĐ3 (Dương quyết 14/11/2026): vay tiêu dùng của hộ (kênh lãi suất tới cầu, để K1.19 đạt) và cơ chế giảm phát nợ. Lý do và số đo: [sai-khac.md mục D](design/sai-khac.md).
- Thêm vào GĐ5: vàng và đô la làm nơi trú ẩn; kịch bản 1997, Zimbabwe và siêu lạm phát đầy đủ.
- Thêm vào GĐ8: mức đồng thuận của các nhóm dân cư với Chính phủ.
- Thêm vào GĐ9 (Dương quyết 16/11/2026): chọn năm bắt đầu cho ván tự do, dời từ U6b của GĐ1.5 (việc 4). Cần nạp đủ phiên bản luật cũ vào `src/config/vn/laws.ts` trước (biểu thuế TNCN 7 bậc, GTGT, lương tối thiểu trước 7/2024, thuế khoán hộ kinh doanh...), cùng đợt với kịch bản lịch sử. Hiện luật chỉ khác nhau thật trong 2025-2027; chọn năm cũ hơn sẽ trộn luật nhiều thời kỳ. Lý do: gd1-5.md mục 12 dòng 8.
- Mỗi giai đoạn có mục tiêu hiệu chỉnh thô; GĐ9 chỉ còn hiệu chỉnh tinh.
- Mỗi kịch bản phải qua kiểm định riêng: lời giải thích đúng ở ít nhất 80% số seed.
- Tính năng học đã nhận: nút đối chứng, đoán trước khi chạy, bảng nguồn tiền, bảng cân đối sống, bản tin, hộ có tên, tách Bộ Tài chính và NHNN, mục "mô hình bỏ qua gì", xuất CSV, một figure anatomy cuối GĐ1. Để sau GĐ1: theo dấu đồng tiền, tua lại, vai chủ ngân hàng, sổ tay khái niệm. Chi tiết: [de-xuat.md](design/de-xuat.md).

Mỗi giai đoạn: (1) thiết kế vào `docs/design/gdN.md`, dừng chờ duyệt; (2) code, kiểm định, kịch bản, progress log; (3) báo cáo. Chưa qua kiểm định thì chưa sang giai đoạn sau.

**Ngoại lệ GĐ1** (Dương quyết 15/11/2026). GĐ1 được chốt có điều kiện: các mục còn hỏng ghi là "đã biết" kèm nơi sẽ sửa, ở [docs/validation/chot-gd1.md](validation/chot-gd1.md). Quy tắc "chưa qua kiểm định thì chưa sang giai đoạn sau" không chặn GĐ1.5. Bảng kiểm [chong-va-ngam.md](design/chong-va-ngam.md) cho GĐ1 dời sang đầu GĐ3.
