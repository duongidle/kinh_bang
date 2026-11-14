# Kiểm định kịch bản GĐ1

Mỗi kịch bản chạy lời giải mẫu ở 10 seed. Một khẳng định qua khi đúng ở ít nhất 80% số seed. Cột "mục tiêu" cho biết lời giải mẫu đạt mục tiêu ở bao nhiêu seed (chỉ để tham khảo, không phải điều kiện).

## Một khoản vay (`mot-khoan-vay`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Mỗi khoản vay mới tạo ra đúng bấy nhiêu tiền gửi mới. Ngân hàng không lấy tiền của người gửi khác đem cho vay. | 10/10 | QUA | tiền sinh ra 3,5 tỷ, tiền mất đi 2,9 tỷ, thay đổi ròng 0,5 tỷ đồng |
| Tiền mặt do NHNN phát hành chỉ là phần nhỏ của tổng tiền. Phần lớn là tiền gửi, tức là nợ của ngân hàng thương mại. | 10/10 | QUA | tiền mặt chiếm 15,3% tổng tiền của công chúng |

- Mục tiêu "Xem hết giai đoạn": lời giải mẫu đạt ở 10/10 seed.

## Máy in tiền (`may-in-tien`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| In tiền để chi làm mức giá cao hơn hẳn. | 10/10 | QUA | mức giá cuối kỳ +14,1% so với thế giới đối chứng |
| Hai năm đầu sản lượng thực có tăng: tiền mới thành đơn hàng trước khi thành giá. | 10/10 | QUA | +5,0% so với thế giới đối chứng |
| Tiền mới không vào đều. Trong năm đầu, lợi nhuận doanh nghiệp (nơi Chính phủ mua hàng) tăng nhiều hơn quỹ lương của người làm công. | 10/10 | QUA | lợi nhuận thực +18,8%, quỹ lương thực +2,4% |

- Mục tiêu "GDP thực năm cuối cao hơn lúc bắt đầu ít nhất 2%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Lạm phát năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Từ vạch xuất phát (`vach-xuat-phat`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Không ai cố ý tạo ra, bất bình đẳng của cải vẫn tự hình thành. | 10/10 | QUA | Gini của cải ở thế giới gốc đi từ 0,05 lên 0,48 |
| Chia đều cổ tức cho mọi hộ làm Gini thu nhập thấp hơn: sở hữu là một nguồn chênh lệch. | 9/10 | QUA | −4,1 điểm so với thế giới đối chứng |

- Mục tiêu "Gini thu nhập bình quân 5 năm cuối dưới 0,22": lời giải mẫu đạt ở 0/10 seed.

## Đánh thuế người giàu (`thue-nguoi-giau`)

Kịch bản có nhiều lựa chọn: mỗi nhánh chạy từ cùng trạng thái xuất phát, và khẳng định chung phải đúng ở mọi nhánh.

### Nhánh: Trợ cấp (`transfer`)

Từ năm thứ hai, phần thu thêm chia đều cho mọi hộ mỗi tháng.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Ở cả ba cách, thu ngân sách so với GDP đều tăng. | 10/10 | QUA | +1,3 điểm so với thế giới đối chứng |
| Chia phần thu thêm cho mọi hộ thì sản lượng không tụt như khi giữ tiền lại: GDP thực chỉ lệch vài phần trăm so với không tăng thuế. | 10/10 | QUA | +1,4% so với thế giới đối chứng |
| Bất bình đẳng thu nhập không tăng như ở cách trả nợ. Nhưng nó cũng không giảm chắc chắn: có ván giảm, có ván tăng. | 10/10 | QUA | −2,0 điểm so với thế giới đối chứng |

### Nhánh: Đầu tư công (`purchase`)

Từ năm thứ hai, Chính phủ dùng phần thu thêm mua thêm hàng của doanh nghiệp. Ở GĐ1 khoản mua này chưa tạo ra đường sá hay tài sản công làm tăng năng suất.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Ở cả ba cách, thu ngân sách so với GDP đều tăng. | 10/10 | QUA | +0,7 điểm so với thế giới đối chứng |
| Chính phủ mua thêm hàng thì sản lượng cũng không tụt: tiền thuế quay lại thành đơn hàng của doanh nghiệp. | 10/10 | QUA | +1,3% so với thế giới đối chứng |
| Bất bình đẳng thu nhập không tăng như ở cách trả nợ. | 10/10 | QUA | −1,2 điểm so với thế giới đối chứng |

### Nhánh: Trả nợ (`debt`)

Không chi thêm. Phần thu thêm làm bội chi nhỏ lại và nợ công thấp dần.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Ở cả ba cách, thu ngân sách so với GDP đều tăng. | 10/10 | QUA | +0,7 điểm so với thế giới đối chứng |
| Không chi phần thu thêm: doanh nghiệp đầu tư ít hẳn đi. | 10/10 | QUA | −19,1% so với thế giới đối chứng |
| Sản lượng thực thấp hơn: tiền thuế rời khỏi vòng chi tiêu. | 10/10 | QUA | −3,3% so với thế giới đối chứng |
| Thất nghiệp cao hơn trong bốn năm đầu. | 9/10 | QUA | +0,1 điểm so với thế giới đối chứng |
| Kết quả ngược mong đợi: Gini thu nhập cao hơn. Người mất việc kéo khoảng cách rộng ra, lấn át phần thuế lấy bớt của người có vốn. | 10/10 | QUA | +0,8 điểm so với thế giới đối chứng |
| Đổi lại, số nợ công tính bằng đồng thấp hơn. | 10/10 | QUA | −9,2% so với thế giới đối chứng |

Các cột so sánh, trung bình qua các seed (nhỏ nhất đến lớn nhất):

| Nhánh | Gini thu nhập | Thất nghiệp | GDP thực | Đầu tư (5 năm đầu) | Tiêu dùng thực | Nợ công (2 năm cuối) | Nợ công/GDP (2 năm cuối) |
|---|---|---|---|---|---|---|---|
| Trợ cấp | −0,35 điểm (−3,35 điểm đến +2,37 điểm) | +0,09 điểm (−1,14 điểm đến +1,98 điểm) | −0,4% (−3,8% đến +4,5%) | +6,6% (−14,7% đến +48,4%) | −0,5% (−3,8% đến +3,4%) | −2,4% (−10,9% đến +6,1%) | +0,05 điểm (−5,04 điểm đến +3,06 điểm) |
| Đầu tư công | −0,21 điểm (−2,07 điểm đến +1,91 điểm) | +0,13 điểm (−0,61 điểm đến +1,22 điểm) | −0,2% (−3,4% đến +2,6%) | +0,5% (−16,3% đến +24,4%) | −1,5% (−3,9% đến +1,2%) | −4,9% (−10,7% đến +1,5%) | −1,01 điểm (−3,80 điểm đến +1,61 điểm) |
| Trả nợ | +3,20 điểm (+0,43 điểm đến +5,93 điểm) | +0,84 điểm (−0,07 điểm đến +1,57 điểm) | −6,5% (−10,1% đến −1,8%) | −27,9% (−40,1% đến −9,9%) | −6,2% (−8,3% đến −2,0%) | −5,7% (−9,2% đến −0,7%) | +0,56 điểm (−6,05 điểm đến +6,86 điểm) |

## Room hay lãi suất (`room-hay-lai-suat`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Room chặn được tín dụng: dư nợ thấp hơn thế giới không có room. | 10/10 | QUA | −24,9% so với thế giới đối chứng |
| Khi room không đủ cho mọi người, hồ sơ yếu bị loại trước. | 10/10 | QUA | vốn ròng trên tài sản của nhóm được vay cao hơn nhóm bị từ chối 0,03 |
| Đầu tư thấp hơn: doanh nghiệp muốn mua máy mà không vay được. | 10/10 | QUA | −31,1% so với thế giới đối chứng |

- Mục tiêu "Dư nợ cuối kỳ không cao hơn lúc bắt đầu quá 10%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Hết hạn giảm thuế (`het-han-giam-thue`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Gia hạn 8% giữ giá hàng chịu thuế thấp hơn so với để thuế về 10%. | 10/10 | QUA | −0,0% so với thế giới đối chứng |
| Đổi lại, thu GTGT thấp hơn. | 10/10 | QUA | −19,2% so với thế giới đối chứng |
| Tiêu dùng thực cao hơn. | 9/10 | QUA | +0,6% so với thế giới đối chứng |

- Mục tiêu "Bội chi năm cuối không quá 2,5% GDP": lời giải mẫu đạt ở 10/10 seed.

## Kéo vào lưới thuế (`keo-vao-luoi-thue`)

Kịch bản có nhiều lựa chọn: mỗi nhánh chạy từ cùng trạng thái xuất phát, và khẳng định chung phải đúng ở mọi nhánh.

### Nhánh: Trợ cấp (`transfer`)

Từ năm thứ hai, phần thu thêm chia đều cho mọi hộ mỗi tháng.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Hạ ngưỡng thì thu được thuế từ hộ kinh doanh. | 10/10 | QUA | thu thuế hộ kinh doanh +23 triệu đồng mỗi tháng so với thế giới đối chứng |
| (chung) Dù tiền thuế được dùng cách nào, thu nhập thực của người làm ở khu vực phi chính thức vẫn thấp hơn. | 9/10 | QUA | −1,1% so với thế giới đối chứng |
| (chung) Nhưng khu vực phi chính thức không nhỏ đi về số người: không ai "lên" doanh nghiệp vì bị đánh thuế. | 10/10 | QUA | tỷ lệ lao động phi chính thức +0,0 điểm |
| Chia lại cho mọi hộ thì tiêu dùng thực vẫn thấp hơn một chút: thuế đã nằm trong giá hàng của hộ kinh doanh. | 9/10 | QUA | −0,0% so với thế giới đối chứng |

### Nhánh: Đầu tư công (`purchase`)

Từ năm thứ hai, Chính phủ dùng phần thu thêm mua thêm hàng của doanh nghiệp. Ở GĐ1 khoản mua này chưa tạo ra đường sá hay tài sản công làm tăng năng suất.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Hạ ngưỡng thì thu được thuế từ hộ kinh doanh. | 10/10 | QUA | thu thuế hộ kinh doanh +23 triệu đồng mỗi tháng so với thế giới đối chứng |
| (chung) Dù tiền thuế được dùng cách nào, thu nhập thực của người làm ở khu vực phi chính thức vẫn thấp hơn. | 10/10 | QUA | −2,2% so với thế giới đối chứng |
| (chung) Nhưng khu vực phi chính thức không nhỏ đi về số người: không ai "lên" doanh nghiệp vì bị đánh thuế. | 10/10 | QUA | tỷ lệ lao động phi chính thức +0,1 điểm |
| Chính phủ mua thêm hàng của doanh nghiệp thì tiêu dùng thực của hộ vẫn thấp hơn. | 10/10 | QUA | −0,3% so với thế giới đối chứng |

### Nhánh: Trả nợ (`debt`)

Không chi thêm. Phần thu thêm làm bội chi nhỏ lại và nợ công thấp dần.

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| (chung) Hạ ngưỡng thì thu được thuế từ hộ kinh doanh. | 10/10 | QUA | thu thuế hộ kinh doanh +22 triệu đồng mỗi tháng so với thế giới đối chứng |
| (chung) Dù tiền thuế được dùng cách nào, thu nhập thực của người làm ở khu vực phi chính thức vẫn thấp hơn. | 10/10 | QUA | −1,3% so với thế giới đối chứng |
| (chung) Nhưng khu vực phi chính thức không nhỏ đi về số người: không ai "lên" doanh nghiệp vì bị đánh thuế. | 10/10 | QUA | tỷ lệ lao động phi chính thức −0,0 điểm |
| Không chi phần thu thêm thì tiêu dùng thực thấp hơn. | 10/10 | QUA | −0,2% so với thế giới đối chứng |
| Và bất bình đẳng thu nhập cao hơn. | 9/10 | QUA | +0,2 điểm so với thế giới đối chứng |
| Đổi lại, nợ công thấp hơn. | 10/10 | QUA | −2,6% so với thế giới đối chứng |

Các cột so sánh, trung bình qua các seed (nhỏ nhất đến lớn nhất):

| Nhánh | Thu nhập thực phi chính thức | Lao động phi chính thức | GDP thực | Tiêu dùng thực | Gini thu nhập | Nợ công (năm cuối) |
|---|---|---|---|---|---|---|
| Trợ cấp | −1,8% (−5,1% đến +0,5%) | +0,23 điểm (−0,68 điểm đến +1,72 điểm) | −0,7% (−2,5% đến +0,3%) | −0,7% (−2,0% đến +0,1%) | +0,00 điểm (−0,54 điểm đến +0,89 điểm) | −0,7% (−2,2% đến +2,0%) |
| Đầu tư công | −1,9% (−3,8% đến −0,4%) | −0,04 điểm (−0,52 điểm đến +0,60 điểm) | −0,2% (−1,0% đến +0,7%) | −0,6% (−1,6% đến −0,2%) | −0,13 điểm (−0,98 điểm đến +0,37 điểm) | −1,6% (−2,9% đến −0,1%) |
| Trả nợ | −3,2% (−6,3% đến −1,3%) | +0,54 điểm (−0,21 điểm đến +1,70 điểm) | −1,3% (−3,3% đến +0,0%) | −1,3% (−3,0% đến −0,2%) | +0,60 điểm (−0,34 điểm đến +2,19 điểm) | −3,9% (−6,3% đến −2,5%) |

## Cân ngân sách (`can-ngan-sach`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Cắt chi làm bội chi nhỏ lại. | 10/10 | QUA | −3,1 điểm so với thế giới đối chứng |
| Năm đầu GDP thực thấp hơn: đơn hàng của Chính phủ mất đi kéo theo việc làm và tiêu dùng. | 10/10 | QUA | −1,8% so với thế giới đối chứng |
| Thất nghiệp năm đầu cao hơn. | 10/10 | QUA | +0,3 điểm so với thế giới đối chứng |

- Mục tiêu "Bội chi năm cuối không quá 2% GDP": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp bình quân cả giai đoạn không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Thắt lưng buộc bụng (`that-lung-buoc-bung`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Mọi nhà cùng bớt tiêu thì tiêu dùng thực cả nước thấp hơn. | 10/10 | QUA | −7,0% so với thế giới đối chứng |
| Sản lượng thấp hơn: tiền nhà này không tiêu là doanh thu nhà khác không có. | 10/10 | QUA | −6,2% so với thế giới đối chứng |
| Thất nghiệp cao hơn. | 10/10 | QUA | +0,8 điểm so với thế giới đối chứng |

- Mục tiêu "Xem hết giai đoạn": lời giải mẫu đạt ở 10/10 seed.

## Sống bằng lương (`song-bang-luong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| In tiền để chi làm mức giá cao hơn hẳn. | 10/10 | QUA | mức giá cuối kỳ +13,9% so với thế giới đối chứng |
| Lạm phát kỳ vọng tăng theo: người ta tính trước giá sẽ lên. | 10/10 | QUA | +1,0 điểm so với thế giới đối chứng |
| Năm đầu, quỹ lương của người làm công tăng chậm hơn lợi nhuận doanh nghiệp. | 10/10 | QUA | lợi nhuận thực +21,7%, quỹ lương thực +2,1% |

- Mục tiêu "Lương thực của người làm công ăn lương không tụt quá 5% so với lúc đầu": lời giải mẫu đạt ở 10/10 seed.

## Chủ xưởng (`chu-xuong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Room 0% làm dư nợ thấp hơn. | 10/10 | QUA | −28,8% so với thế giới đối chứng |
| Đầu tư thấp hơn. | 10/10 | QUA | −33,3% so với thế giới đối chứng |
| Tiền vay bị từ chối nhiều hơn trong năm đầu. | 10/10 | QUA | +44,0% so với thế giới đối chứng |

- Mục tiêu "Xưởng còn hoạt động khi hết giai đoạn": lời giải mẫu đạt ở 3/10 seed.

## Tín dụng nóng 2007-2011 (`tin-dung-nong`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Cắt chi tiêu công, dừng in tiền và hãm tín dụng làm lạm phát thấp hơn. | 10/10 | QUA | −3,5 điểm so với thế giới đối chứng |
| Cái giá: GDP thực năm đầu thấp hơn. | 10/10 | QUA | −3,2% so với thế giới đối chứng |
| Thất nghiệp năm đầu cao hơn. | 10/10 | QUA | +0,7 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối không quá 6%": lời giải mẫu đạt ở 10/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 8%": lời giải mẫu đạt ở 10/10 seed.

## Giá - lương - tiền (`gia-luong-tien`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Dừng in tiền và cắt chi làm lạm phát thấp hơn. | 10/10 | QUA | −1,0 điểm so với thế giới đối chứng |
| Nhưng lạm phát không tắt ngay: kỳ vọng và lương còn đuổi theo giá cũ, và thất nghiệp năm đầu cao hơn. | 8/10 | QUA | +0,1 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối không quá 10%": lời giải mẫu đạt ở 10/10 seed.

## Tăng lương tối thiểu (`luong-toi-thieu`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Lương của nhóm doanh nghiệp trả thấp tăng lên. | 10/10 | QUA | +1,3% so với thế giới đối chứng |
| Việc làm ở doanh nghiệp giảm, hoặc tỷ lệ lao động phi chính thức tăng: sàn lương không với tới người làm ở hộ kinh doanh. | 9/10 | QUA | việc làm chính thức −0,0%, lao động phi chính thức +0,2 điểm |

- Mục tiêu "Lương thực bình quân năm cuối cao hơn lúc bắt đầu": lời giải mẫu đạt ở 3/10 seed.
- Mục tiêu "Thất nghiệp năm cuối không quá 7%": lời giải mẫu đạt ở 10/10 seed.

## Hai tay lái (`hai-tay-lai`)

| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |
|---|---|---|---|
| Lãi suất cao làm dư nợ thấp hơn. | 8/10 | QUA | −3,0% so với thế giới đối chứng |
| Nhưng tiền lãi Chính phủ trả phình ra, bội chi lớn hơn. | 10/10 | QUA | +0,3 điểm so với thế giới đối chứng |
| Nợ công cao hơn. | 10/10 | QUA | +14,9% so với thế giới đối chứng |
| Kết quả ngược mong đợi: từ năm thứ năm lạm phát cao hơn thế giới không tăng lãi suất. | 10/10 | QUA | +1,1 điểm so với thế giới đối chứng |

- Mục tiêu "Lạm phát năm cuối thấp hơn lúc bắt đầu": lời giải mẫu đạt ở 9/10 seed.

