# Kiểm định kịch bản GĐ1

Mỗi kịch bản chạy lời giải mẫu ở 10 seed. Một khẳng định qua khi đúng ở ít nhất 80% số seed. Cột "mục tiêu" cho biết lời giải mẫu đạt mục tiêu ở bao nhiêu seed (chỉ để tham khảo, không phải điều kiện).

## Một khoản vay (`mot-khoan-vay`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Mỗi khoản vay mới tạo ra đúng bấy nhiêu tiền gửi mới. Ngân hàng không lấy tiền của người gửi khác đem cho vay. | 10/10 | QUA | tiền sinh ra 3,5 tỷ, tiền mất đi 2,8 tỷ, thay đổi ròng 0,6 tỷ đồng |
| Tiền mặt do NHNN phát hành chỉ là phần nhỏ của tổng tiền. Phần lớn là tiền gửi, tức là nợ của ngân hàng thương mại. | 10/10 | QUA | tiền mặt chiếm 15,2% tổng tiền của công chúng |

- Mục tiêu "Xem hết giai đoạn": lời giải mẫu đạt ở 10/10 seed.

## Máy in tiền (`may-in-tien`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| In tiền để chi làm mức giá cao hơn hẳn. | 10/10 | QUA | mức giá cuối kỳ +8,3% so với thế giới đối chứng |
| Hai năm đầu sản lượng thực có tăng: tiền mới thành đơn hàng trước khi thành giá. | 10/10 | QUA | +4,7% so với thế giới đối chứng |
| Tiền mới không vào đều. Trong năm đầu, lợi nhuận doanh nghiệp (nơi Chính phủ mua hàng) tăng nhiều hơn quỹ lương của người làm công. | 10/10 | QUA | lợi nhuận thực +14,1%, quỹ lương thực +0,7% |

- Mục tiêu "GDP thực năm cuối cao hơn lúc bắt đầu ít nhất 2%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Lạm phát năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Từ vạch xuất phát (`vach-xuat-phat`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Không ai cố ý tạo ra, bất bình đẳng của cải vẫn tự hình thành. | 10/10 | QUA | Gini của cải ở thế giới gốc đi từ 0,05 lên 0,52 |
| Chia đều cổ tức cho mọi hộ làm Gini thu nhập thấp hơn: sở hữu là một nguồn chênh lệch. | 9/10 | QUA | −3,5 điểm so với thế giới đối chứng |

- Mục tiêu "Gini thu nhập bình quân 5 năm cuối dưới 0,22": lời giải mẫu đạt ở 0/10 seed.

## Đánh thuế người giàu (`thue-nguoi-giau`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Thu ngân sách so với GDP tăng. | 9/10 | QUA | +0,9 điểm so với thế giới đối chứng |
| Lợi nhuận sau thuế thấp hơn nên doanh nghiệp đầu tư ít đi. | 9/10 | QUA | −24,0% so với thế giới đối chứng |
| Thất nghiệp cao hơn trong bốn năm đầu: tiền thuế thu thêm không quay lại vòng chi tiêu. | 10/10 | QUA | +1,3 điểm so với thế giới đối chứng |
| Kết quả ngược mong đợi: Gini thu nhập không thấp hơn. Người mất việc kéo khoảng cách thu nhập rộng ra, lấn át phần thuế lấy bớt của người có vốn. | 10/10 | QUA | Gini thu nhập +2,4 điểm so với thế giới đối chứng |

- Mục tiêu "Gini thu nhập bình quân 3 năm cuối thấp hơn lúc bắt đầu": lời giải mẫu đạt ở 3/10 seed.

## Room hay lãi suất (`room-hay-lai-suat`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Room chặn được tín dụng: dư nợ thấp hơn thế giới không có room. | 10/10 | QUA | −23,2% so với thế giới đối chứng |
| Khi room không đủ cho mọi người, hồ sơ yếu bị loại trước. | 10/10 | QUA | vốn ròng trên tài sản của nhóm được vay cao hơn nhóm bị từ chối 0,04 |
| Đầu tư thấp hơn: doanh nghiệp muốn mua máy mà không vay được. | 10/10 | QUA | −26,7% so với thế giới đối chứng |

- Mục tiêu "Dư nợ cuối kỳ không cao hơn lúc bắt đầu quá 10%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Hết hạn giảm thuế (`het-han-giam-thue`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Gia hạn 8% giữ giá hàng chịu thuế thấp hơn so với để thuế về 10%. | 10/10 | QUA | −1,5% so với thế giới đối chứng |
| Đổi lại, thu GTGT thấp hơn. | 10/10 | QUA | −17,6% so với thế giới đối chứng |
| Tiêu dùng thực cao hơn. | 10/10 | QUA | +0,8% so với thế giới đối chứng |

- Mục tiêu "Bội chi năm cuối không quá 2,5% GDP": lời giải mẫu đạt ở 10/10 seed.

## Kéo vào lưới thuế (`keo-vao-luoi-thue`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Hạ ngưỡng thì thu được thuế từ hộ kinh doanh. | 10/10 | QUA | thu thuế hộ kinh doanh +23 triệu đồng mỗi tháng so với thế giới đối chứng |
| Thu nhập thực của người làm ở khu vực phi chính thức thấp hơn. | 10/10 | QUA | −2,3% so với thế giới đối chứng |
| Nhưng khu vực phi chính thức không nhỏ đi về số người: không ai "lên" doanh nghiệp vì bị đánh thuế. | 10/10 | QUA | tỷ lệ lao động phi chính thức −0,1 điểm |

- Mục tiêu "Thu thuế hộ kinh doanh năm cuối cao hơn lúc bắt đầu": lời giải mẫu đạt ở 10/10 seed.

## Cân ngân sách (`can-ngan-sach`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Cắt chi làm bội chi nhỏ lại. | 10/10 | QUA | −2,9 điểm so với thế giới đối chứng |
| Năm đầu GDP thực thấp hơn: đơn hàng của Chính phủ mất đi kéo theo việc làm và tiêu dùng. | 10/10 | QUA | −2,7% so với thế giới đối chứng |
| Thất nghiệp năm đầu cao hơn. | 10/10 | QUA | +0,6 điểm so với thế giới đối chứng |

- Mục tiêu "Bội chi năm cuối không quá 2% GDP": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp bình quân cả giai đoạn không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Thắt lưng buộc bụng (`that-lung-buoc-bung`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Mọi nhà cùng bớt tiêu thì tiêu dùng thực cả nước thấp hơn. | 10/10 | QUA | −7,3% so với thế giới đối chứng |
| Sản lượng thấp hơn: tiền nhà này không tiêu là doanh thu nhà khác không có. | 10/10 | QUA | −6,9% so với thế giới đối chứng |
| Thất nghiệp cao hơn. | 10/10 | QUA | +1,0 điểm so với thế giới đối chứng |

- Mục tiêu "Xem hết giai đoạn": lời giải mẫu đạt ở 10/10 seed.

## Sống bằng lương (`song-bang-luong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| In tiền để chi làm mức giá cao hơn hẳn. | 10/10 | QUA | mức giá cuối kỳ +8,4% so với thế giới đối chứng |
| Lạm phát kỳ vọng tăng theo: người ta tính trước giá sẽ lên. | 10/10 | QUA | +0,3 điểm so với thế giới đối chứng |
| Năm đầu, quỹ lương của người làm công tăng chậm hơn lợi nhuận doanh nghiệp. | 10/10 | QUA | lợi nhuận thực +19,6%, quỹ lương thực +1,9% |

- Mục tiêu "Lương thực của người làm công ăn lương không tụt quá 5% so với lúc đầu": lời giải mẫu đạt ở 10/10 seed.

## Chủ xưởng (`chu-xuong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Room 0% làm dư nợ thấp hơn. | 10/10 | QUA | −28,2% so với thế giới đối chứng |
| Đầu tư thấp hơn. | 10/10 | QUA | −34,1% so với thế giới đối chứng |
| Tiền vay bị từ chối nhiều hơn trong năm đầu. | 10/10 | QUA | +40,6% so với thế giới đối chứng |

- Mục tiêu "Xưởng còn hoạt động khi hết giai đoạn": lời giải mẫu đạt ở 4/10 seed.

## Tín dụng nóng 2007-2011 (`tin-dung-nong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Cắt chi tiêu công, dừng in tiền và hãm tín dụng làm lạm phát thấp hơn. | 10/10 | QUA | −2,6 điểm so với thế giới đối chứng |
| Cái giá: GDP thực năm đầu thấp hơn. | 10/10 | QUA | −3,9% so với thế giới đối chứng |
| Thất nghiệp năm đầu cao hơn. | 10/10 | QUA | +0,7 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối không quá 6%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Giá - lương - tiền (`gia-luong-tien`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Dừng in tiền và cắt chi làm lạm phát thấp hơn. | 10/10 | QUA | −1,0 điểm so với thế giới đối chứng |
| Nhưng lạm phát không tắt ngay: kỳ vọng và lương còn đuổi theo giá cũ, và thất nghiệp năm đầu cao hơn. | 9/10 | QUA | +0,2 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối không quá 10%": lời giải mẫu đạt ở 10/10 seed.

## Tăng lương tối thiểu (`luong-toi-thieu`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Lương của nhóm doanh nghiệp trả thấp tăng lên. | 10/10 | QUA | +0,5% so với thế giới đối chứng |
| Việc làm ở doanh nghiệp giảm, hoặc tỷ lệ lao động phi chính thức tăng: sàn lương không với tới người làm ở hộ kinh doanh. | 8/10 | QUA | việc làm chính thức +0,0%, lao động phi chính thức −0,1 điểm |

- Mục tiêu "Lương thực bình quân năm cuối cao hơn lúc bắt đầu": lời giải mẫu đạt ở 3/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 7%": lời giải mẫu đạt ở 10/10 seed.

## Hai tay lái (`hai-tay-lai`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Lãi suất cao làm dư nợ thấp hơn. | 9/10 | QUA | −3,3% so với thế giới đối chứng |
| Nhưng tiền lãi Chính phủ trả phình ra, bội chi lớn hơn. | 10/10 | QUA | +0,1 điểm so với thế giới đối chứng |
| Nợ công cao hơn. | 10/10 | QUA | +12,4% so với thế giới đối chứng |
| Kết quả ngược mong đợi: từ năm thứ năm lạm phát cao hơn thế giới không tăng lãi suất. | 9/10 | QUA | +0,1 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối thấp hơn lúc bắt đầu": lời giải mẫu đạt ở 9/10 seed.

