# Báo cáo kiểm định GĐ1

Bản code: commit cuối chạm src hoặc tests: `dccfcc0`.

## Tóm tắt

Chạy 20 seed x 480 tháng ở 500 hộ, 5 seed ở 5000 hộ, 20 seed ở 50 hộ (chỉ kế toán). Bỏ 120 tháng đầu. Một mục qua khi đúng ở ít nhất 80% số seed, hoặc khi khoảng tin cậy 95% của trung bình nằm đúng phía (ghi "theo trung bình"). Mục kế toán phải đúng ở mọi seed.

Không qua: K1.19 (đã biết), K1.28 (đã biết), K1.29 (đã biết), K1.31 (đã biết), K1.13 (đã biết).

| Mã | Sự thật | Ngưỡng | Số seed đạt | Kết quả |
|---|---|---|---|---|

## Lần chạy gốc, 500 hộ

| Mã | Sự thật | Ngưỡng | Số seed đạt | Kết quả |
|---|---|---|---|---|
| K1.1 | Bốn đẳng thức kế toán đúng mọi tháng | tuyệt đối | 20/20 | QUA |
| K1.2 | Thay đổi tiền của công chúng khớp các kênh trong sổ cái | tuyệt đối | 20/20 | QUA |
| K1.3 | GDP theo chi tiêu = GDP theo thu nhập | tuyệt đối | 20/20 | QUA |
| K1.4 | Có phá sản và gia nhập mà sổ vẫn cân | tuyệt đối | 20/20 | QUA |
| K1.5 | Nền kinh tế tự ổn định | thất nghiệp 1-15% và lạm phát năm −2% đến 12% trong 95% số tháng | 20/20 | QUA |
| K1.6 | Thất nghiệp và hàng ế cùng có | hơn 90% số tháng | 20/20 | QUA |
| K1.7 | Chu kỳ tự sinh | tự tương quan GDP đã lọc dương ở trễ 1 và 2 quý | 20/20 | QUA |
| K1.8 | Đầu tư biến động hơn GDP, tiêu dùng ít hơn | tỷ số độ lệch chuẩn > 1,5 và < 1 | 20/20 | QUA |
| K1.9 | Thất nghiệp ngược chiều chu kỳ (Okun) | tương quan < −0,3 | 20/20 | QUA |
| K1.10 | Đường Phillips và Beveridge dốc xuống | hai tương quan âm | 18/20 | QUA |
| K1.11 | Tín dụng cùng chiều chu kỳ | tương quan > 0 | 20/20 | QUA |
| K1.12 | Lạm phát cùng chiều chu kỳ và trễ | tương quan chéo lớn nhất dương, ở trễ ≥ 1 quý | 12/20 | tham khảo |
| K1.13 | Bất bình đẳng tự hình thành | Gini của cải ròng > Gini thu nhập sau thuế (bình quân 12 tháng cuối năm 30); lệch phải | 20/20 | QUA |
| K1.14 | Quy mô doanh nghiệp lệch phải | độ lệch > 1 | 20/20 | QUA |
| K1.27 | Kinh tế xấu thì tỷ lệ phi chính thức tăng | tương quan với GDP đã lọc < 0 | 20/20 | QUA |
| K1.30 | Không doanh nghiệp nào trả dưới lương tối thiểu vùng | tuyệt đối | 20/20 | QUA |
| K1.32 | Tỷ lệ lao động phi chính thức ổn định quanh mục tiêu | bình quân 50-70%, trôi dưới 10 điểm | 20/20 | QUA |

<details><summary>K1.1: số đo từng seed</summary>

- seed 1: đạt (đúng mọi tháng)
- seed 2: đạt (đúng mọi tháng)
- seed 3: đạt (đúng mọi tháng)
- seed 4: đạt (đúng mọi tháng)
- seed 5: đạt (đúng mọi tháng)
- seed 6: đạt (đúng mọi tháng)
- seed 7: đạt (đúng mọi tháng)
- seed 8: đạt (đúng mọi tháng)
- seed 9: đạt (đúng mọi tháng)
- seed 10: đạt (đúng mọi tháng)
- seed 11: đạt (đúng mọi tháng)
- seed 12: đạt (đúng mọi tháng)
- seed 13: đạt (đúng mọi tháng)
- seed 14: đạt (đúng mọi tháng)
- seed 15: đạt (đúng mọi tháng)
- seed 16: đạt (đúng mọi tháng)
- seed 17: đạt (đúng mọi tháng)
- seed 18: đạt (đúng mọi tháng)
- seed 19: đạt (đúng mọi tháng)
- seed 20: đạt (đúng mọi tháng)

</details>

<details><summary>K1.2: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)
- seed 6: đạt (khớp)
- seed 7: đạt (khớp)
- seed 8: đạt (khớp)
- seed 9: đạt (khớp)
- seed 10: đạt (khớp)
- seed 11: đạt (khớp)
- seed 12: đạt (khớp)
- seed 13: đạt (khớp)
- seed 14: đạt (khớp)
- seed 15: đạt (khớp)
- seed 16: đạt (khớp)
- seed 17: đạt (khớp)
- seed 18: đạt (khớp)
- seed 19: đạt (khớp)
- seed 20: đạt (khớp)

</details>

<details><summary>K1.3: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)
- seed 6: đạt (khớp)
- seed 7: đạt (khớp)
- seed 8: đạt (khớp)
- seed 9: đạt (khớp)
- seed 10: đạt (khớp)
- seed 11: đạt (khớp)
- seed 12: đạt (khớp)
- seed 13: đạt (khớp)
- seed 14: đạt (khớp)
- seed 15: đạt (khớp)
- seed 16: đạt (khớp)
- seed 17: đạt (khớp)
- seed 18: đạt (khớp)
- seed 19: đạt (khớp)
- seed 20: đạt (khớp)

</details>

<details><summary>K1.4: số đo từng seed</summary>

- seed 1: đạt (121 phá sản, 102 gia nhập)
- seed 2: đạt (118 phá sản, 106 gia nhập)
- seed 3: đạt (128 phá sản, 110 gia nhập)
- seed 4: đạt (133 phá sản, 122 gia nhập)
- seed 5: đạt (123 phá sản, 106 gia nhập)
- seed 6: đạt (132 phá sản, 107 gia nhập)
- seed 7: đạt (140 phá sản, 112 gia nhập)
- seed 8: đạt (117 phá sản, 112 gia nhập)
- seed 9: đạt (114 phá sản, 93 gia nhập)
- seed 10: đạt (139 phá sản, 118 gia nhập)
- seed 11: đạt (115 phá sản, 99 gia nhập)
- seed 12: đạt (129 phá sản, 115 gia nhập)
- seed 13: đạt (138 phá sản, 111 gia nhập)
- seed 14: đạt (145 phá sản, 130 gia nhập)
- seed 15: đạt (134 phá sản, 116 gia nhập)
- seed 16: đạt (105 phá sản, 92 gia nhập)
- seed 17: đạt (158 phá sản, 146 gia nhập)
- seed 18: đạt (153 phá sản, 129 gia nhập)
- seed 19: đạt (139 phá sản, 121 gia nhập)
- seed 20: đạt (124 phá sản, 113 gia nhập)

</details>

<details><summary>K1.5: số đo từng seed</summary>

- seed 1: đạt (99.2% số tháng; thất nghiệp 6.0%, lạm phát 0.7%)
- seed 2: đạt (100.0% số tháng; thất nghiệp 5.8%, lạm phát 1.0%)
- seed 3: đạt (99.7% số tháng; thất nghiệp 6.0%, lạm phát 0.8%)
- seed 4: đạt (99.2% số tháng; thất nghiệp 5.8%, lạm phát 1.1%)
- seed 5: đạt (100.0% số tháng; thất nghiệp 6.1%, lạm phát 1.0%)
- seed 6: đạt (99.2% số tháng; thất nghiệp 7.2%, lạm phát 0.2%)
- seed 7: đạt (98.9% số tháng; thất nghiệp 7.1%, lạm phát 0.1%)
- seed 8: đạt (100.0% số tháng; thất nghiệp 5.7%, lạm phát 1.1%)
- seed 9: đạt (100.0% số tháng; thất nghiệp 6.2%, lạm phát 0.7%)
- seed 10: đạt (99.4% số tháng; thất nghiệp 6.5%, lạm phát 0.7%)
- seed 11: đạt (100.0% số tháng; thất nghiệp 6.3%, lạm phát 0.7%)
- seed 12: đạt (99.7% số tháng; thất nghiệp 6.6%, lạm phát 0.8%)
- seed 13: đạt (99.7% số tháng; thất nghiệp 6.8%, lạm phát 0.4%)
- seed 14: đạt (98.3% số tháng; thất nghiệp 5.5%, lạm phát 1.1%)
- seed 15: đạt (100.0% số tháng; thất nghiệp 6.3%, lạm phát 0.8%)
- seed 16: đạt (99.7% số tháng; thất nghiệp 5.6%, lạm phát 1.0%)
- seed 17: đạt (99.7% số tháng; thất nghiệp 5.3%, lạm phát 1.5%)
- seed 18: đạt (100.0% số tháng; thất nghiệp 5.7%, lạm phát 1.2%)
- seed 19: đạt (100.0% số tháng; thất nghiệp 5.9%, lạm phát 1.2%)
- seed 20: đạt (100.0% số tháng; thất nghiệp 7.0%, lạm phát 0.3%)

</details>

<details><summary>K1.6: số đo từng seed</summary>

- seed 1: đạt (100.0%)
- seed 2: đạt (100.0%)
- seed 3: đạt (100.0%)
- seed 4: đạt (100.0%)
- seed 5: đạt (100.0%)
- seed 6: đạt (100.0%)
- seed 7: đạt (100.0%)
- seed 8: đạt (100.0%)
- seed 9: đạt (100.0%)
- seed 10: đạt (100.0%)
- seed 11: đạt (100.0%)
- seed 12: đạt (100.0%)
- seed 13: đạt (100.0%)
- seed 14: đạt (100.0%)
- seed 15: đạt (100.0%)
- seed 16: đạt (100.0%)
- seed 17: đạt (100.0%)
- seed 18: đạt (100.0%)
- seed 19: đạt (100.0%)
- seed 20: đạt (100.0%)

</details>

<details><summary>K1.7: số đo từng seed</summary>

- seed 1: đạt (trễ 1: 0.83, trễ 2: 0.62)
- seed 2: đạt (trễ 1: 0.83, trễ 2: 0.61)
- seed 3: đạt (trễ 1: 0.81, trễ 2: 0.55)
- seed 4: đạt (trễ 1: 0.80, trễ 2: 0.66)
- seed 5: đạt (trễ 1: 0.76, trễ 2: 0.55)
- seed 6: đạt (trễ 1: 0.78, trễ 2: 0.57)
- seed 7: đạt (trễ 1: 0.79, trễ 2: 0.59)
- seed 8: đạt (trễ 1: 0.68, trễ 2: 0.44)
- seed 9: đạt (trễ 1: 0.67, trễ 2: 0.37)
- seed 10: đạt (trễ 1: 0.82, trễ 2: 0.65)
- seed 11: đạt (trễ 1: 0.73, trễ 2: 0.51)
- seed 12: đạt (trễ 1: 0.79, trễ 2: 0.57)
- seed 13: đạt (trễ 1: 0.75, trễ 2: 0.40)
- seed 14: đạt (trễ 1: 0.76, trễ 2: 0.55)
- seed 15: đạt (trễ 1: 0.72, trễ 2: 0.38)
- seed 16: đạt (trễ 1: 0.71, trễ 2: 0.45)
- seed 17: đạt (trễ 1: 0.71, trễ 2: 0.45)
- seed 18: đạt (trễ 1: 0.66, trễ 2: 0.36)
- seed 19: đạt (trễ 1: 0.81, trễ 2: 0.59)
- seed 20: đạt (trễ 1: 0.67, trễ 2: 0.34)

</details>

<details><summary>K1.8: số đo từng seed</summary>

- seed 1: đạt (đầu tư 8.84, tiêu dùng 0.70)
- seed 2: đạt (đầu tư 9.37, tiêu dùng 0.74)
- seed 3: đạt (đầu tư 8.96, tiêu dùng 0.60)
- seed 4: đạt (đầu tư 10.60, tiêu dùng 0.76)
- seed 5: đạt (đầu tư 8.13, tiêu dùng 0.54)
- seed 6: đạt (đầu tư 9.01, tiêu dùng 0.58)
- seed 7: đạt (đầu tư 9.27, tiêu dùng 0.58)
- seed 8: đạt (đầu tư 8.99, tiêu dùng 0.68)
- seed 9: đạt (đầu tư 8.71, tiêu dùng 0.55)
- seed 10: đạt (đầu tư 9.47, tiêu dùng 0.63)
- seed 11: đạt (đầu tư 8.84, tiêu dùng 0.69)
- seed 12: đạt (đầu tư 8.72, tiêu dùng 0.62)
- seed 13: đạt (đầu tư 12.15, tiêu dùng 0.53)
- seed 14: đạt (đầu tư 10.30, tiêu dùng 0.78)
- seed 15: đạt (đầu tư 9.34, tiêu dùng 0.59)
- seed 16: đạt (đầu tư 9.23, tiêu dùng 0.72)
- seed 17: đạt (đầu tư 10.76, tiêu dùng 0.72)
- seed 18: đạt (đầu tư 9.87, tiêu dùng 0.74)
- seed 19: đạt (đầu tư 9.07, tiêu dùng 0.63)
- seed 20: đạt (đầu tư 10.49, tiêu dùng 0.52)

</details>

<details><summary>K1.9: số đo từng seed</summary>

- seed 1: đạt (-0.90)
- seed 2: đạt (-0.82)
- seed 3: đạt (-0.86)
- seed 4: đạt (-0.54)
- seed 5: đạt (-0.86)
- seed 6: đạt (-0.83)
- seed 7: đạt (-0.84)
- seed 8: đạt (-0.79)
- seed 9: đạt (-0.85)
- seed 10: đạt (-0.83)
- seed 11: đạt (-0.87)
- seed 12: đạt (-0.82)
- seed 13: đạt (-0.82)
- seed 14: đạt (-0.78)
- seed 15: đạt (-0.78)
- seed 16: đạt (-0.80)
- seed 17: đạt (-0.80)
- seed 18: đạt (-0.75)
- seed 19: đạt (-0.88)
- seed 20: đạt (-0.82)

</details>

<details><summary>K1.10: số đo từng seed</summary>

- seed 1: đạt (Phillips -0.54, Beveridge -0.26)
- seed 2: đạt (Phillips -0.70, Beveridge -0.25)
- seed 3: đạt (Phillips -0.74, Beveridge -0.46)
- seed 4: đạt (Phillips -0.34, Beveridge -0.43)
- seed 5: đạt (Phillips -0.55, Beveridge -0.74)
- seed 6: đạt (Phillips -0.62, Beveridge -0.11)
- seed 7: đạt (Phillips -0.53, Beveridge -0.06)
- seed 8: đạt (Phillips -0.57, Beveridge -0.59)
- seed 9: không đạt (Phillips -0.69, Beveridge 0.04)
- seed 10: đạt (Phillips -0.63, Beveridge -0.36)
- seed 11: đạt (Phillips -0.74, Beveridge -0.31)
- seed 12: đạt (Phillips -0.63, Beveridge -0.38)
- seed 13: không đạt (Phillips -0.64, Beveridge 0.18)
- seed 14: đạt (Phillips -0.55, Beveridge -0.60)
- seed 15: đạt (Phillips -0.62, Beveridge -0.36)
- seed 16: đạt (Phillips -0.51, Beveridge -0.28)
- seed 17: đạt (Phillips -0.59, Beveridge -0.51)
- seed 18: đạt (Phillips -0.50, Beveridge -0.76)
- seed 19: đạt (Phillips -0.70, Beveridge -0.49)
- seed 20: đạt (Phillips -0.57, Beveridge -0.42)

</details>

<details><summary>K1.11: số đo từng seed</summary>

- seed 1: đạt (0.67)
- seed 2: đạt (0.65)
- seed 3: đạt (0.69)
- seed 4: đạt (0.65)
- seed 5: đạt (0.65)
- seed 6: đạt (0.62)
- seed 7: đạt (0.65)
- seed 8: đạt (0.60)
- seed 9: đạt (0.68)
- seed 10: đạt (0.70)
- seed 11: đạt (0.71)
- seed 12: đạt (0.59)
- seed 13: đạt (0.63)
- seed 14: đạt (0.57)
- seed 15: đạt (0.70)
- seed 16: đạt (0.58)
- seed 17: đạt (0.65)
- seed 18: đạt (0.64)
- seed 19: đạt (0.65)
- seed 20: đạt (0.59)

</details>

<details><summary>K1.12: số đo từng seed</summary>

Tham khảo: Chỉ xét ở 5000 hộ: ở 500 hộ đỉnh tương quan nhảy giữa cùng quý và trễ một quý vì ít doanh nghiệp (sai-khac.md D6).

- seed 1: đạt (lớn nhất 0.51 ở trễ 1 quý)
- seed 2: không đạt (lớn nhất 0.67 ở trễ 0 quý)
- seed 3: không đạt (lớn nhất 0.74 ở trễ 0 quý)
- seed 4: đạt (lớn nhất 0.23 ở trễ 1 quý)
- seed 5: đạt (lớn nhất 0.64 ở trễ 1 quý)
- seed 6: đạt (lớn nhất 0.65 ở trễ 1 quý)
- seed 7: đạt (lớn nhất 0.54 ở trễ 1 quý)
- seed 8: đạt (lớn nhất 0.61 ở trễ 1 quý)
- seed 9: không đạt (lớn nhất 0.65 ở trễ 0 quý)
- seed 10: đạt (lớn nhất 0.69 ở trễ 1 quý)
- seed 11: đạt (lớn nhất 0.72 ở trễ 1 quý)
- seed 12: đạt (lớn nhất 0.61 ở trễ 1 quý)
- seed 13: không đạt (lớn nhất 0.70 ở trễ 0 quý)
- seed 14: không đạt (lớn nhất 0.56 ở trễ 0 quý)
- seed 15: đạt (lớn nhất 0.68 ở trễ 1 quý)
- seed 16: đạt (lớn nhất 0.61 ở trễ 1 quý)
- seed 17: không đạt (lớn nhất 0.55 ở trễ 0 quý)
- seed 18: không đạt (lớn nhất 0.61 ở trễ 0 quý)
- seed 19: đạt (lớn nhất 0.74 ở trễ 1 quý)
- seed 20: không đạt (lớn nhất 0.69 ở trễ 0 quý)

</details>

<details><summary>K1.13: số đo từng seed</summary>

- seed 1: đạt (của cải 0.52, thu nhập 0.36; độ lệch 3.40)
- seed 2: đạt (của cải 0.54, thu nhập 0.32; độ lệch 3.66)
- seed 3: đạt (của cải 0.52, thu nhập 0.31; độ lệch 3.65)
- seed 4: đạt (của cải 0.58, thu nhập 0.37; độ lệch 3.55)
- seed 5: đạt (của cải 0.54, thu nhập 0.38; độ lệch 3.18)
- seed 6: đạt (của cải 0.46, thu nhập 0.41; độ lệch 4.36)
- seed 7: đạt (của cải 0.48, thu nhập 0.37; độ lệch 4.37)
- seed 8: đạt (của cải 0.48, thu nhập 0.34; độ lệch 4.30)
- seed 9: đạt (của cải 0.47, thu nhập 0.33; độ lệch 3.79)
- seed 10: đạt (của cải 0.48, thu nhập 0.32; độ lệch 4.78)
- seed 11: đạt (của cải 0.51, thu nhập 0.32; độ lệch 3.95)
- seed 12: đạt (của cải 0.51, thu nhập 0.31; độ lệch 3.79)
- seed 13: đạt (của cải 0.42, thu nhập 0.40; độ lệch 4.66)
- seed 14: đạt (của cải 0.55, thu nhập 0.31; độ lệch 3.72)
- seed 15: đạt (của cải 0.48, thu nhập 0.28; độ lệch 4.09)
- seed 16: đạt (của cải 0.54, thu nhập 0.34; độ lệch 3.27)
- seed 17: đạt (của cải 0.56, thu nhập 0.41; độ lệch 3.78)
- seed 18: đạt (của cải 0.50, thu nhập 0.28; độ lệch 4.22)
- seed 19: đạt (của cải 0.52, thu nhập 0.36; độ lệch 3.82)
- seed 20: đạt (của cải 0.39, thu nhập 0.31; độ lệch 2.19)

</details>

<details><summary>K1.14: số đo từng seed</summary>

- seed 1: đạt (2.88)
- seed 2: đạt (2.88)
- seed 3: đạt (2.43)
- seed 4: đạt (2.62)
- seed 5: đạt (2.84)
- seed 6: đạt (2.27)
- seed 7: đạt (2.53)
- seed 8: đạt (4.09)
- seed 9: đạt (2.80)
- seed 10: đạt (2.84)
- seed 11: đạt (2.83)
- seed 12: đạt (2.21)
- seed 13: đạt (2.65)
- seed 14: đạt (2.78)
- seed 15: đạt (3.04)
- seed 16: đạt (3.02)
- seed 17: đạt (2.99)
- seed 18: đạt (3.48)
- seed 19: đạt (2.88)
- seed 20: đạt (2.81)

</details>

<details><summary>K1.27: số đo từng seed</summary>

- seed 1: đạt (-0.97)
- seed 2: đạt (-0.96)
- seed 3: đạt (-0.96)
- seed 4: đạt (-0.95)
- seed 5: đạt (-0.94)
- seed 6: đạt (-0.95)
- seed 7: đạt (-0.97)
- seed 8: đạt (-0.94)
- seed 9: đạt (-0.94)
- seed 10: đạt (-0.96)
- seed 11: đạt (-0.95)
- seed 12: đạt (-0.97)
- seed 13: đạt (-0.96)
- seed 14: đạt (-0.96)
- seed 15: đạt (-0.96)
- seed 16: đạt (-0.94)
- seed 17: đạt (-0.97)
- seed 18: đạt (-0.95)
- seed 19: đạt (-0.96)
- seed 20: đạt (-0.94)

</details>

<details><summary>K1.30: số đo từng seed</summary>

- seed 1: đạt (0)
- seed 2: đạt (0)
- seed 3: đạt (0)
- seed 4: đạt (0)
- seed 5: đạt (0)
- seed 6: đạt (0)
- seed 7: đạt (0)
- seed 8: đạt (0)
- seed 9: đạt (0)
- seed 10: đạt (0)
- seed 11: đạt (0)
- seed 12: đạt (0)
- seed 13: đạt (0)
- seed 14: đạt (0)
- seed 15: đạt (0)
- seed 16: đạt (0)
- seed 17: đạt (0)
- seed 18: đạt (0)
- seed 19: đạt (0)
- seed 20: đạt (0)

</details>

<details><summary>K1.32: số đo từng seed</summary>

- seed 1: đạt (bình quân 55.3%, trôi 3.9 điểm)
- seed 2: đạt (bình quân 57.0%, trôi 1.7 điểm)
- seed 3: đạt (bình quân 57.9%, trôi 3.0 điểm)
- seed 4: đạt (bình quân 56.7%, trôi 0.8 điểm)
- seed 5: đạt (bình quân 55.1%, trôi -0.6 điểm)
- seed 6: đạt (bình quân 58.6%, trôi 8.4 điểm)
- seed 7: đạt (bình quân 59.8%, trôi 8.3 điểm)
- seed 8: đạt (bình quân 54.9%, trôi -4.3 điểm)
- seed 9: đạt (bình quân 55.2%, trôi 4.5 điểm)
- seed 10: đạt (bình quân 58.6%, trôi 4.8 điểm)
- seed 11: đạt (bình quân 56.4%, trôi 1.6 điểm)
- seed 12: đạt (bình quân 56.9%, trôi 3.8 điểm)
- seed 13: đạt (bình quân 59.1%, trôi 8.0 điểm)
- seed 14: đạt (bình quân 55.7%, trôi -0.8 điểm)
- seed 15: đạt (bình quân 55.4%, trôi 1.1 điểm)
- seed 16: đạt (bình quân 56.8%, trôi 1.4 điểm)
- seed 17: đạt (bình quân 56.1%, trôi -1.8 điểm)
- seed 18: đạt (bình quân 55.1%, trôi 2.8 điểm)
- seed 19: đạt (bình quân 55.8%, trôi -0.1 điểm)
- seed 20: đạt (bình quân 60.8%, trôi 5.9 điểm)

</details>

Trung bình các năm 11-40 của từng seed:

| seed | thất nghiệp | lạm phát | phi chính thức | thu/GDP | tiền mặt | Gini của cải | doanh nghiệp | phá sản/năm | mới/năm |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6.0% | 0.7% | 55.3% | 14.7% | 13.6% | 0.56 | 21 | 3.1 | 2.4 |
| 2 | 5.8% | 1.0% | 57.0% | 14.9% | 13.7% | 0.53 | 28 | 2.7 | 2.3 |
| 3 | 6.0% | 0.8% | 57.9% | 15.3% | 13.9% | 0.55 | 22 | 3.0 | 2.4 |
| 4 | 5.8% | 1.1% | 56.7% | 14.9% | 13.7% | 0.55 | 29 | 3.7 | 3.2 |
| 5 | 6.1% | 1.0% | 55.1% | 14.8% | 13.5% | 0.55 | 23 | 2.8 | 2.3 |
| 6 | 7.2% | 0.2% | 58.6% | 16.2% | 13.9% | 0.46 | 15 | 3.2 | 2.3 |
| 7 | 7.1% | 0.1% | 59.8% | 16.3% | 14.2% | 0.52 | 12 | 3.5 | 2.4 |
| 8 | 5.7% | 1.1% | 54.9% | 14.9% | 13.6% | 0.49 | 35 | 2.7 | 2.7 |
| 9 | 6.2% | 0.7% | 55.2% | 14.9% | 13.6% | 0.54 | 19 | 2.9 | 2.0 |
| 10 | 6.5% | 0.7% | 58.6% | 15.8% | 13.9% | 0.51 | 19 | 3.5 | 2.7 |
| 11 | 6.3% | 0.7% | 56.4% | 15.2% | 13.8% | 0.54 | 24 | 2.9 | 2.4 |
| 12 | 6.6% | 0.8% | 56.9% | 15.2% | 13.7% | 0.56 | 26 | 3.4 | 2.9 |
| 13 | 6.8% | 0.4% | 59.1% | 16.3% | 14.1% | 0.49 | 13 | 3.3 | 2.2 |
| 14 | 5.5% | 1.1% | 55.7% | 14.9% | 13.6% | 0.54 | 25 | 3.9 | 3.3 |
| 15 | 6.3% | 0.8% | 55.4% | 14.9% | 13.6% | 0.53 | 22 | 3.1 | 2.4 |
| 16 | 5.6% | 1.0% | 56.8% | 15.0% | 13.9% | 0.54 | 27 | 2.7 | 2.2 |
| 17 | 5.3% | 1.5% | 56.1% | 14.9% | 13.7% | 0.54 | 28 | 3.6 | 3.6 |
| 18 | 5.7% | 1.2% | 55.1% | 14.8% | 13.6% | 0.56 | 16 | 3.4 | 3.0 |
| 19 | 5.9% | 1.2% | 55.8% | 15.0% | 13.7% | 0.54 | 22 | 3.4 | 2.7 |
| 20 | 7.0% | 0.3% | 60.8% | 16.9% | 14.2% | 0.41 | 29 | 3.0 | 2.6 |

## Thí nghiệm chạy đôi, 500 hộ

| Mã | Sự thật | Ngưỡng | Số seed đạt | Kết quả |
|---|---|---|---|---|
| K1.15 | Chia đều cổ tức làm Gini thu nhập thấp hơn | hiệu chạy đôi < 0 (bình quân 20 năm) | 18/20 | QUA |
| K1.16 | Chi ngân sách bằng tiền NHNN in: giá tăng bền, sản lượng thực tăng trong ngắn hạn | CPI sau 10 năm cao hơn rõ; GDP thực 2 năm đầu cao hơn; mức tăng GDP thực nhỏ hơn mức tăng giá | 20/20 | QUA |
| K1.17 | In càng nhiều thì giá tăng càng nhiều | mức giá sau 10 năm tăng dần theo ba mức in | 20/20 | QUA |
| K1.18 | Tiền mới không vào đều: nơi nhận tiền trước lợi hơn người hưởng lương cố định | năm đầu: lợi nhuận thực của doanh nghiệp (nơi Chính phủ mua hàng) tăng nhiều hơn quỹ lương thực của người làm công ăn lương | 20/20 | QUA |
| K1.19 | Tăng lãi suất tái cấp vốn làm giảm tín dụng và giảm lạm phát sau độ trễ | hiệu chạy đôi âm ở quý 4-8 | 1/20 | **CHƯA ĐẠT (đã biết)** |
| K1.20 | Room đang chặn thì tín dụng không vượt room, hồ sơ yếu bị loại trước | tăng trưởng dư nợ năm ≤ room; nhóm bị từ chối kém lành mạnh hơn | 20/20 | QUA |
| K1.21 | Hộ giữ nhiều tiền mặt hơn thì ngân hàng mất dự trữ, phải nhờ NHNN nhiều hơn | hỗ trợ thanh khoản của NHNN (tái cấp vốn + trái phiếu mua lại) tăng | 20/20 | QUA |
| K1.22 | Biến thể "ngân hàng là trung gian" cho tín dụng và sản lượng thấp hơn | hiệu chạy đôi âm trong 3 năm đầu | 18/20 | QUA |
| K1.23 | Tăng chi ngân sách bằng vay nợ làm GDP tăng ngắn hạn và nợ công tăng | số nhân năm đầu > 0; nợ công cao hơn | 20/20 | QUA |
| K1.24 | Tăng GTGT: giá hàng chịu thuế tăng; tiêu dùng thực giảm; thu ngân sách tăng | tỷ lệ chuyển vào giá sau 2 năm lớn hơn 0 và không quá 1,39 | 20/20 | QUA |
| K1.25 | Thuế TNCN luỹ tiến làm Gini lương sau thuế thấp hơn trước thuế | hiệu > 0 | 20/20 | QUA |
| K1.26 | Bật "nộp thuế đủ" làm thu ngân sách tăng và doanh số thực của khu vực phi chính thức co lại | hiệu chạy đôi (năm 2-4) | 20/20 | QUA |
| K1.28 | Tắt kỳ vọng lạm phát làm lạm phát sau cú sốc tắt nhanh hơn | lạm phát vượt trội còn lại ở năm thứ hai sau khi cú sốc dừng: thấp hơn khi tắt kỳ vọng | 7/20 | **CHƯA ĐẠT (đã biết)** |
| K1.29 | Niềm tin làm suy thoái sâu hơn | GDP thực bình quân 2 năm sau cú sốc cầu thấp hơn khi bật niềm tin | 14/20 | **CHƯA ĐẠT (đã biết)** |
| K1.31 | Nâng mạnh lương tối thiểu: lương nhóm thấp ở doanh nghiệp tăng; việc làm chính thức giảm hoặc tỷ lệ phi chính thức tăng | hiệu chạy đôi đúng dấu (3 năm) | 10/20 | **CHƯA ĐẠT (đã biết)** |

<details><summary>K1.15: số đo từng seed</summary>

- seed 1: đạt (Gini thu nhập -0.030, Gini tiền -0.042)
- seed 2: đạt (Gini thu nhập -0.050, Gini tiền -0.057)
- seed 3: đạt (Gini thu nhập -0.045, Gini tiền -0.047)
- seed 4: đạt (Gini thu nhập -0.043, Gini tiền -0.057)
- seed 5: đạt (Gini thu nhập -0.030, Gini tiền -0.028)
- seed 6: không đạt (Gini thu nhập 0.007, Gini tiền 0.001)
- seed 7: đạt (Gini thu nhập -0.052, Gini tiền -0.057)
- seed 8: đạt (Gini thu nhập -0.040, Gini tiền -0.038)
- seed 9: đạt (Gini thu nhập -0.025, Gini tiền -0.015)
- seed 10: đạt (Gini thu nhập -0.022, Gini tiền -0.021)
- seed 11: đạt (Gini thu nhập -0.000, Gini tiền 0.004)
- seed 12: không đạt (Gini thu nhập 0.027, Gini tiền 0.028)
- seed 13: đạt (Gini thu nhập -0.022, Gini tiền -0.023)
- seed 14: đạt (Gini thu nhập -0.055, Gini tiền -0.053)
- seed 15: đạt (Gini thu nhập -0.016, Gini tiền -0.030)
- seed 16: đạt (Gini thu nhập -0.017, Gini tiền -0.020)
- seed 17: đạt (Gini thu nhập -0.043, Gini tiền -0.046)
- seed 18: đạt (Gini thu nhập -0.029, Gini tiền -0.044)
- seed 19: đạt (Gini thu nhập -0.032, Gini tiền -0.034)
- seed 20: đạt (Gini thu nhập -0.011, Gini tiền -0.001)

</details>

<details><summary>K1.16: số đo từng seed</summary>

Cả hai nhánh tắt quy tắc lãi suất tự động, để chỉ đo tác động của việc in tiền. Ngưỡng gốc đòi mức chênh GDP thu hẹp dần; xem ghi chú ở cuối báo cáo.

- seed 1: đạt (CPI +38.8%; GDP thực 2 năm đầu 9.7%, năm 9-10 28.2%)
- seed 2: đạt (CPI +24.5%; GDP thực 2 năm đầu 5.7%, năm 9-10 18.9%)
- seed 3: đạt (CPI +29.3%; GDP thực 2 năm đầu 17.7%, năm 9-10 19.1%)
- seed 4: đạt (CPI +30.5%; GDP thực 2 năm đầu 7.3%, năm 9-10 10.3%)
- seed 5: đạt (CPI +33.0%; GDP thực 2 năm đầu 11.7%, năm 9-10 22.8%)
- seed 6: đạt (CPI +33.0%; GDP thực 2 năm đầu 10.5%, năm 9-10 24.3%)
- seed 7: đạt (CPI +38.3%; GDP thực 2 năm đầu 12.3%, năm 9-10 24.0%)
- seed 8: đạt (CPI +40.6%; GDP thực 2 năm đầu 14.2%, năm 9-10 39.3%)
- seed 9: đạt (CPI +33.1%; GDP thực 2 năm đầu 7.9%, năm 9-10 12.7%)
- seed 10: đạt (CPI +29.4%; GDP thực 2 năm đầu 15.0%, năm 9-10 29.4%)
- seed 11: đạt (CPI +30.7%; GDP thực 2 năm đầu 9.9%, năm 9-10 16.5%)
- seed 12: đạt (CPI +23.5%; GDP thực 2 năm đầu 6.5%, năm 9-10 17.3%)
- seed 13: đạt (CPI +30.9%; GDP thực 2 năm đầu 9.4%, năm 9-10 24.0%)
- seed 14: đạt (CPI +40.9%; GDP thực 2 năm đầu 7.1%, năm 9-10 11.0%)
- seed 15: đạt (CPI +24.6%; GDP thực 2 năm đầu 14.9%, năm 9-10 18.4%)
- seed 16: đạt (CPI +30.6%; GDP thực 2 năm đầu 6.4%, năm 9-10 16.5%)
- seed 17: đạt (CPI +43.6%; GDP thực 2 năm đầu 7.5%, năm 9-10 35.8%)
- seed 18: đạt (CPI +53.9%; GDP thực 2 năm đầu 5.1%, năm 9-10 35.4%)
- seed 19: đạt (CPI +33.0%; GDP thực 2 năm đầu 13.7%, năm 9-10 18.8%)
- seed 20: đạt (CPI +34.2%; GDP thực 2 năm đầu 13.3%, năm 9-10 30.3%)

</details>

<details><summary>K1.17: số đo từng seed</summary>

- seed 1: đạt (9.0% < 38.8% < 94.7%)
- seed 2: đạt (7.8% < 24.5% < 92.3%)
- seed 3: đạt (5.3% < 29.3% < 100.9%)
- seed 4: đạt (11.4% < 30.5% < 97.9%)
- seed 5: đạt (12.7% < 33.0% < 104.0%)
- seed 6: đạt (13.3% < 33.0% < 95.7%)
- seed 7: đạt (13.7% < 38.3% < 106.2%)
- seed 8: đạt (16.5% < 40.6% < 95.6%)
- seed 9: đạt (9.8% < 33.1% < 99.8%)
- seed 10: đạt (6.4% < 29.4% < 101.8%)
- seed 11: đạt (8.9% < 30.7% < 90.7%)
- seed 12: đạt (11.2% < 23.5% < 85.7%)
- seed 13: đạt (8.4% < 30.9% < 100.5%)
- seed 14: đạt (17.8% < 40.9% < 97.8%)
- seed 15: đạt (4.5% < 24.6% < 100.9%)
- seed 16: đạt (10.0% < 30.6% < 96.3%)
- seed 17: đạt (14.5% < 43.6% < 86.2%)
- seed 18: đạt (25.0% < 53.9% < 99.7%)
- seed 19: đạt (12.4% < 33.0% < 97.4%)
- seed 20: đạt (15.1% < 34.2% < 110.6%)

</details>

<details><summary>K1.18: số đo từng seed</summary>

Cách đo đổi so với thiết kế: thiết kế so thu nhập của "nhóm bán hàng cho Chính phủ" với nhóm còn lại. Trong mô hình, tiền mới vào doanh nghiệp thành lợi nhuận trước, lương đổi chậm, nên so lợi nhuận với quỹ lương.

- seed 1: đạt (lợi nhuận doanh nghiệp 23.6%, quỹ lương 3.3%, thu nhập phi chính thức 3.9%)
- seed 2: đạt (lợi nhuận doanh nghiệp 18.9%, quỹ lương 2.2%, thu nhập phi chính thức 3.8%)
- seed 3: đạt (lợi nhuận doanh nghiệp 33.6%, quỹ lương 5.5%, thu nhập phi chính thức 5.8%)
- seed 4: đạt (lợi nhuận doanh nghiệp 26.6%, quỹ lương 4.4%, thu nhập phi chính thức 3.7%)
- seed 5: đạt (lợi nhuận doanh nghiệp 39.8%, quỹ lương 5.3%, thu nhập phi chính thức 6.0%)
- seed 6: đạt (lợi nhuận doanh nghiệp 21.9%, quỹ lương 3.7%, thu nhập phi chính thức 2.8%)
- seed 7: đạt (lợi nhuận doanh nghiệp 30.3%, quỹ lương 6.1%, thu nhập phi chính thức 7.6%)
- seed 8: đạt (lợi nhuận doanh nghiệp 51.3%, quỹ lương 7.1%, thu nhập phi chính thức 6.4%)
- seed 9: đạt (lợi nhuận doanh nghiệp 26.4%, quỹ lương 4.9%, thu nhập phi chính thức 5.3%)
- seed 10: đạt (lợi nhuận doanh nghiệp 43.0%, quỹ lương 6.2%, thu nhập phi chính thức 7.8%)
- seed 11: đạt (lợi nhuận doanh nghiệp 31.6%, quỹ lương 4.8%, thu nhập phi chính thức 4.3%)
- seed 12: đạt (lợi nhuận doanh nghiệp 20.5%, quỹ lương 3.2%, thu nhập phi chính thức 2.0%)
- seed 13: đạt (lợi nhuận doanh nghiệp 18.2%, quỹ lương 2.6%, thu nhập phi chính thức 4.2%)
- seed 14: đạt (lợi nhuận doanh nghiệp 26.4%, quỹ lương 6.0%, thu nhập phi chính thức 7.1%)
- seed 15: đạt (lợi nhuận doanh nghiệp 40.5%, quỹ lương 5.3%, thu nhập phi chính thức 5.3%)
- seed 16: đạt (lợi nhuận doanh nghiệp 20.8%, quỹ lương 4.4%, thu nhập phi chính thức 4.6%)
- seed 17: đạt (lợi nhuận doanh nghiệp 23.2%, quỹ lương 4.6%, thu nhập phi chính thức 4.0%)
- seed 18: đạt (lợi nhuận doanh nghiệp 18.5%, quỹ lương 3.0%, thu nhập phi chính thức 4.5%)
- seed 19: đạt (lợi nhuận doanh nghiệp 31.5%, quỹ lương 4.4%, thu nhập phi chính thức 5.3%)
- seed 20: đạt (lợi nhuận doanh nghiệp 37.1%, quỹ lương 4.1%, thu nhập phi chính thức 4.2%)

</details>

<details><summary>K1.19: số đo từng seed</summary>

Chưa đạt, đã biết: Kênh lãi suất tới cầu còn yếu. Hộ không vay, nên lãi suất chỉ chạm tiêu dùng qua thay thế liên thời gian (exp.saveResponse = 0,35 theo Havránek 2015) và chạm đầu tư. Kênh vay tiêu dùng (thiết kế mục 18) để GĐ3, khi có nhà đất làm tài sản thế chấp. Không nâng tham số để qua mục này.

Tăng 6 điểm phần trăm so với mức đang áp dụng; cả hai nhánh tắt quy tắc tự động. Đo dư nợ thay cho vay mới trong tháng, vì vay mới từng tháng rất nhiễu.

- seed 1: không đạt (dư nợ -3.5%, lạm phát 0.66 điểm)
- seed 2: không đạt (dư nợ -3.6%, lạm phát 0.98 điểm)
- seed 3: không đạt (dư nợ 9.8%, lạm phát 1.08 điểm)
- seed 4: không đạt (dư nợ -6.1%, lạm phát 0.67 điểm)
- seed 5: không đạt (dư nợ -1.3%, lạm phát 0.90 điểm)
- seed 6: không đạt (dư nợ -4.7%, lạm phát 1.11 điểm)
- seed 7: không đạt (dư nợ 0.4%, lạm phát 0.82 điểm)
- seed 8: không đạt (dư nợ 9.5%, lạm phát 1.19 điểm)
- seed 9: không đạt (dư nợ -1.3%, lạm phát 1.29 điểm)
- seed 10: không đạt (dư nợ 4.7%, lạm phát 1.17 điểm)
- seed 11: không đạt (dư nợ -6.8%, lạm phát 0.94 điểm)
- seed 12: đạt (dư nợ -7.4%, lạm phát -0.10 điểm)
- seed 13: không đạt (dư nợ -9.1%, lạm phát 0.08 điểm)
- seed 14: không đạt (dư nợ -2.8%, lạm phát 1.28 điểm)
- seed 15: không đạt (dư nợ 5.0%, lạm phát 0.90 điểm)
- seed 16: không đạt (dư nợ -6.2%, lạm phát 0.80 điểm)
- seed 17: không đạt (dư nợ -2.1%, lạm phát 1.31 điểm)
- seed 18: không đạt (dư nợ -2.3%, lạm phát 1.19 điểm)
- seed 19: không đạt (dư nợ 2.5%, lạm phát 1.50 điểm)
- seed 20: không đạt (dư nợ 3.5%, lạm phát 1.19 điểm)

</details>

<details><summary>K1.20: số đo từng seed</summary>

- seed 1: đạt (tăng trưởng cao nhất -2.5%; chênh độ lành mạnh 0.04)
- seed 2: đạt (tăng trưởng cao nhất -1.4%; chênh độ lành mạnh 0.06)
- seed 3: đạt (tăng trưởng cao nhất -13.0%; chênh độ lành mạnh 0.03)
- seed 4: đạt (tăng trưởng cao nhất -0.5%; chênh độ lành mạnh 0.06)
- seed 5: đạt (tăng trưởng cao nhất -0.6%; chênh độ lành mạnh 0.04)
- seed 6: đạt (tăng trưởng cao nhất -0.2%; chênh độ lành mạnh 0.06)
- seed 7: đạt (tăng trưởng cao nhất -1.0%; chênh độ lành mạnh 0.06)
- seed 8: đạt (tăng trưởng cao nhất -0.8%; chênh độ lành mạnh 0.03)
- seed 9: đạt (tăng trưởng cao nhất -3.4%; chênh độ lành mạnh 0.07)
- seed 10: đạt (tăng trưởng cao nhất -7.0%; chênh độ lành mạnh 0.04)
- seed 11: đạt (tăng trưởng cao nhất -0.6%; chênh độ lành mạnh 0.05)
- seed 12: đạt (tăng trưởng cao nhất 0.0%; chênh độ lành mạnh 0.05)
- seed 13: đạt (tăng trưởng cao nhất -7.7%; chênh độ lành mạnh 0.05)
- seed 14: đạt (tăng trưởng cao nhất 0.0%; chênh độ lành mạnh 0.06)
- seed 15: đạt (tăng trưởng cao nhất -3.0%; chênh độ lành mạnh 0.06)
- seed 16: đạt (tăng trưởng cao nhất -0.1%; chênh độ lành mạnh 0.07)
- seed 17: đạt (tăng trưởng cao nhất -0.1%; chênh độ lành mạnh 0.06)
- seed 18: đạt (tăng trưởng cao nhất 0.1%; chênh độ lành mạnh 0.05)
- seed 19: đạt (tăng trưởng cao nhất -2.0%; chênh độ lành mạnh 0.04)
- seed 20: đạt (tăng trưởng cao nhất -2.2%; chênh độ lành mạnh 0.05)

</details>

<details><summary>K1.21: số đo từng seed</summary>

- seed 1: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.7 tỷ)
- seed 2: đạt (tiền mặt +2.1 tỷ, hỗ trợ +1.9 tỷ)
- seed 3: đạt (tiền mặt +2.0 tỷ, hỗ trợ +1.8 tỷ)
- seed 4: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.0 tỷ)
- seed 5: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.0 tỷ)
- seed 6: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.1 tỷ)
- seed 7: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.6 tỷ)
- seed 8: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.0 tỷ)
- seed 9: đạt (tiền mặt +2.0 tỷ, hỗ trợ +2.0 tỷ)
- seed 10: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.0 tỷ)
- seed 11: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.9 tỷ)
- seed 12: đạt (tiền mặt +1.8 tỷ, hỗ trợ +2.0 tỷ)
- seed 13: đạt (tiền mặt +2.0 tỷ, hỗ trợ +1.6 tỷ)
- seed 14: đạt (tiền mặt +2.0 tỷ, hỗ trợ +2.0 tỷ)
- seed 15: đạt (tiền mặt +2.0 tỷ, hỗ trợ +1.9 tỷ)
- seed 16: đạt (tiền mặt +1.9 tỷ, hỗ trợ +2.2 tỷ)
- seed 17: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.6 tỷ)
- seed 18: đạt (tiền mặt +2.0 tỷ, hỗ trợ +1.9 tỷ)
- seed 19: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.7 tỷ)
- seed 20: đạt (tiền mặt +1.9 tỷ, hỗ trợ +1.5 tỷ)

</details>

<details><summary>K1.22: số đo từng seed</summary>

Cửa sổ đo đổi từ 10 năm sang 3 năm đầu. Siết tín dụng làm sản lượng thấp hơn rõ trong 3 năm đầu. Sau đó giá giảm theo lượng tiền, nhu cầu thực hồi lại và kinh tế bật lên thành một chu kỳ dài, nên bình quân 10 năm không âm. Số đo năm 6-10 in kèm để thấy điều này.

- seed 1: đạt (3 năm đầu: tín dụng -23.1%, đầu tư -46.7%, GDP thực -10.0%; năm 6-10: GDP thực 11.3%)
- seed 2: đạt (3 năm đầu: tín dụng -16.9%, đầu tư -23.9%, GDP thực -4.5%; năm 6-10: GDP thực 1.8%)
- seed 3: không đạt (3 năm đầu: tín dụng 0.2%, đầu tư 0.4%, GDP thực 0.3%; năm 6-10: GDP thực 5.1%)
- seed 4: đạt (3 năm đầu: tín dụng -15.3%, đầu tư -32.6%, GDP thực -7.1%; năm 6-10: GDP thực 8.4%)
- seed 5: đạt (3 năm đầu: tín dụng -4.0%, đầu tư -15.2%, GDP thực -2.5%; năm 6-10: GDP thực 0.8%)
- seed 6: đạt (3 năm đầu: tín dụng -7.8%, đầu tư -13.6%, GDP thực -3.1%; năm 6-10: GDP thực 1.0%)
- seed 7: đạt (3 năm đầu: tín dụng -19.4%, đầu tư -29.1%, GDP thực -6.2%; năm 6-10: GDP thực 4.7%)
- seed 8: đạt (3 năm đầu: tín dụng -10.7%, đầu tư -31.3%, GDP thực -4.9%; năm 6-10: GDP thực 10.1%)
- seed 9: đạt (3 năm đầu: tín dụng -29.4%, đầu tư -36.8%, GDP thực -9.7%; năm 6-10: GDP thực 2.2%)
- seed 10: đạt (3 năm đầu: tín dụng -11.3%, đầu tư -22.5%, GDP thực -2.7%; năm 6-10: GDP thực -8.8%)
- seed 11: đạt (3 năm đầu: tín dụng -21.0%, đầu tư -22.5%, GDP thực -5.7%; năm 6-10: GDP thực 5.4%)
- seed 12: đạt (3 năm đầu: tín dụng -32.2%, đầu tư -43.0%, GDP thực -10.9%; năm 6-10: GDP thực 5.9%)
- seed 13: đạt (3 năm đầu: tín dụng -21.7%, đầu tư -47.0%, GDP thực -9.9%; năm 6-10: GDP thực 0.2%)
- seed 14: đạt (3 năm đầu: tín dụng -15.3%, đầu tư -29.3%, GDP thực -6.0%; năm 6-10: GDP thực 0.8%)
- seed 15: đạt (3 năm đầu: tín dụng -17.4%, đầu tư -23.4%, GDP thực -4.9%; năm 6-10: GDP thực 0.9%)
- seed 16: đạt (3 năm đầu: tín dụng -21.0%, đầu tư -30.2%, GDP thực -6.8%; năm 6-10: GDP thực 10.8%)
- seed 17: đạt (3 năm đầu: tín dụng -15.8%, đầu tư -27.8%, GDP thực -5.7%; năm 6-10: GDP thực 7.1%)
- seed 18: đạt (3 năm đầu: tín dụng -19.1%, đầu tư -36.8%, GDP thực -7.9%; năm 6-10: GDP thực 12.7%)
- seed 19: đạt (3 năm đầu: tín dụng -6.4%, đầu tư -14.9%, GDP thực -2.1%; năm 6-10: GDP thực 2.4%)
- seed 20: không đạt (3 năm đầu: tín dụng 1.0%, đầu tư -0.6%, GDP thực -0.1%; năm 6-10: GDP thực 4.2%)

</details>

<details><summary>K1.23: số đo từng seed</summary>

- seed 1: đạt (số nhân 1.31; nợ +1.6 tỷ)
- seed 2: đạt (số nhân 1.03; nợ +2.1 tỷ)
- seed 3: đạt (số nhân 2.17; nợ +0.6 tỷ)
- seed 4: đạt (số nhân 1.39; nợ +2.2 tỷ)
- seed 5: đạt (số nhân 2.72; nợ +1.1 tỷ)
- seed 6: đạt (số nhân 1.08; nợ +1.3 tỷ)
- seed 7: đạt (số nhân 1.86; nợ +1.4 tỷ)
- seed 8: đạt (số nhân 1.98; nợ +1.4 tỷ)
- seed 9: đạt (số nhân 1.88; nợ +1.4 tỷ)
- seed 10: đạt (số nhân 1.80; nợ +1.2 tỷ)
- seed 11: đạt (số nhân 1.08; nợ +1.8 tỷ)
- seed 12: đạt (số nhân 0.92; nợ +1.8 tỷ)
- seed 13: đạt (số nhân 1.07; nợ +1.6 tỷ)
- seed 14: đạt (số nhân 1.34; nợ +2.2 tỷ)
- seed 15: đạt (số nhân 2.01; nợ +1.0 tỷ)
- seed 16: đạt (số nhân 1.50; nợ +2.1 tỷ)
- seed 17: đạt (số nhân 1.60; nợ +1.4 tỷ)
- seed 18: đạt (số nhân 1.44; nợ +2.0 tỷ)
- seed 19: đạt (số nhân 1.65; nợ +0.9 tỷ)
- seed 20: đạt (số nhân 1.71; nợ +0.4 tỷ)

</details>

<details><summary>K1.24: số đo từng seed</summary>

Tăng từ 10% lên 15%. Đo bằng giá hàng chịu thuế so với hàng cùng loại không chịu GTGT, để loại phần lạm phát chung. Từ 15/11/2026 tăng thuế chuyển trọn vào giá ngay (firm.taxPassUp = 1, đơn giản hoá tạm, sai-khac.md S36). Tiền thu thêm giữ lại không chi (gov.revenueUse = keep), để đo riêng tác động của thuế. Trần 1,39 lấy từ Benedek, De Mooij, Keen và Wingender 2015 (IMF WP/15/214, Bảng 3, thuế suất phổ thông): 0,71 trong 12 tháng trước ngày đổi thuế, 0,30 trong tháng đổi, 0,38 trong 12 tháng sau; sai số chuẩn của tổng là 0,36. Phải nói thật: theo cùng bảng đó, phần SAU ngày đổi thuế chỉ khoảng 0,68 (0,30 + 0,38); 0,71 còn lại là tăng giá đón trước, mô hình chưa có. Mô hình chuyển trọn (quanh 1) sau ngày đổi thuế, tức là đang thổi phồng phần này. Sửa ở việc 8 và 8b.

- seed 1: đạt (chuyển vào giá 1.04; tiêu dùng thực -3.5%; thu GTGT 36.3%)
- seed 2: đạt (chuyển vào giá 0.95; tiêu dùng thực -2.6%; thu GTGT 40.5%)
- seed 3: đạt (chuyển vào giá 0.94; tiêu dùng thực -3.0%; thu GTGT 39.2%)
- seed 4: đạt (chuyển vào giá 1.04; tiêu dùng thực -6.1%; thu GTGT 31.1%)
- seed 5: đạt (chuyển vào giá 0.97; tiêu dùng thực -4.8%; thu GTGT 36.6%)
- seed 6: đạt (chuyển vào giá 0.93; tiêu dùng thực -3.5%; thu GTGT 38.3%)
- seed 7: đạt (chuyển vào giá 0.90; tiêu dùng thực -4.7%; thu GTGT 37.0%)
- seed 8: đạt (chuyển vào giá 0.98; tiêu dùng thực -5.4%; thu GTGT 34.8%)
- seed 9: đạt (chuyển vào giá 0.99; tiêu dùng thực -4.0%; thu GTGT 38.4%)
- seed 10: đạt (chuyển vào giá 1.31; tiêu dùng thực -3.2%; thu GTGT 38.2%)
- seed 11: đạt (chuyển vào giá 0.96; tiêu dùng thực -4.6%; thu GTGT 34.3%)
- seed 12: đạt (chuyển vào giá 1.23; tiêu dùng thực -5.9%; thu GTGT 33.6%)
- seed 13: đạt (chuyển vào giá 0.92; tiêu dùng thực -5.0%; thu GTGT 34.7%)
- seed 14: đạt (chuyển vào giá 1.03; tiêu dùng thực -3.7%; thu GTGT 38.7%)
- seed 15: đạt (chuyển vào giá 0.97; tiêu dùng thực -3.9%; thu GTGT 36.8%)
- seed 16: đạt (chuyển vào giá 0.99; tiêu dùng thực -2.6%; thu GTGT 41.5%)
- seed 17: đạt (chuyển vào giá 0.92; tiêu dùng thực -1.5%; thu GTGT 49.1%)
- seed 18: đạt (chuyển vào giá 1.04; tiêu dùng thực -2.8%; thu GTGT 42.5%)
- seed 19: đạt (chuyển vào giá 1.31; tiêu dùng thực -3.5%; thu GTGT 38.5%)
- seed 20: đạt (chuyển vào giá 1.12; tiêu dùng thực -3.5%; thu GTGT 37.5%)

</details>

<details><summary>K1.25: số đo từng seed</summary>

Với mức giảm trừ 15,5 triệu của luật hiện hành, gần như không ai trong mô hình phải nộp TNCN từ lương (lương chưa phân tán, GĐ2 mới có kỹ năng), nên hiệu bằng 0. Thí nghiệm hạ mức giảm trừ xuống 4 triệu để kiểm tính chất của biểu thuế. Tiền thu thêm giữ lại không chi (gov.revenueUse = keep), để đo riêng tác động của thuế.

- seed 1: đạt (giảm trừ 4 triệu: Gini giảm 0.0048; theo luật hiện hành: 0.0000)
- seed 2: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 3: đạt (giảm trừ 4 triệu: Gini giảm 0.0048; theo luật hiện hành: 0.0000)
- seed 4: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 5: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 6: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 7: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 8: đạt (giảm trừ 4 triệu: Gini giảm 0.0048; theo luật hiện hành: 0.0000)
- seed 9: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 10: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 11: đạt (giảm trừ 4 triệu: Gini giảm 0.0048; theo luật hiện hành: 0.0000)
- seed 12: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 13: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 14: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 15: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 16: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 17: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 18: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)
- seed 19: đạt (giảm trừ 4 triệu: Gini giảm 0.0046; theo luật hiện hành: 0.0000)
- seed 20: đạt (giảm trừ 4 triệu: Gini giảm 0.0047; theo luật hiện hành: 0.0000)

</details>

<details><summary>K1.26: số đo từng seed</summary>

Với ngưỡng 1 tỷ đồng của luật 2026, hầu hết hộ kinh doanh trong mô hình được miễn hợp pháp, nên khai đủ hay khai thiếu không đổi gì. Thí nghiệm đặt ngưỡng về 100 triệu (mức trước 2025) ở cả hai nhánh. "Co lại" đo bằng doanh số thực của hộ kinh doanh. Phải nói thật: thị phần và số lao động phi chính thức KHÔNG giảm. Thuế thu thêm không được chi ra nên cầu chung giảm, người mất việc chuyển sang tự làm, và hộ kinh doanh không có đường chuyển lên doanh nghiệp (thiết kế mục 6). Khu vực này nghèo đi chứ không nhỏ đi về số người. Tiền thu thêm giữ lại không chi (gov.revenueUse = keep), để đo riêng tác động của thuế. Từ 15/11/2026 đo ở năm 2-4 (trước đó 10 năm): đây là tác động trực tiếp của thuế. Ở năm 5-10, một cuộc suy thoái do tiền thuế bị giữ lại lấn át, và người mất việc chính thức chuyển sang hộ kinh doanh (sai-khac.md D15).

- seed 1: đạt (ngưỡng 100 triệu: thu/GDP 0.63 điểm, doanh số thực của hộ kinh doanh -3.8%, thu nhập thực của người làm phi chính thức -7.8%, phần chi tiêu mua ở hộ kinh doanh 0.62 điểm, lao động phi chính thức 2.18 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 2: đạt (ngưỡng 100 triệu: thu/GDP 0.35 điểm, doanh số thực của hộ kinh doanh -3.4%, thu nhập thực của người làm phi chính thức -8.5%, phần chi tiêu mua ở hộ kinh doanh 0.63 điểm, lao động phi chính thức 2.89 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 3: đạt (ngưỡng 100 triệu: thu/GDP 0.88 điểm, doanh số thực của hộ kinh doanh -3.0%, thu nhập thực của người làm phi chính thức -11.1%, phần chi tiêu mua ở hộ kinh doanh 2.87 điểm, lao động phi chính thức 3.31 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 4: đạt (ngưỡng 100 triệu: thu/GDP 0.51 điểm, doanh số thực của hộ kinh doanh -6.8%, thu nhập thực của người làm phi chính thức -15.1%, phần chi tiêu mua ở hộ kinh doanh 0.47 điểm, lao động phi chính thức 5.42 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 5: đạt (ngưỡng 100 triệu: thu/GDP 0.63 điểm, doanh số thực của hộ kinh doanh -2.5%, thu nhập thực của người làm phi chính thức -4.7%, phần chi tiêu mua ở hộ kinh doanh -0.02 điểm, lao động phi chính thức 0.60 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 6: đạt (ngưỡng 100 triệu: thu/GDP 0.26 điểm, doanh số thực của hộ kinh doanh -4.6%, thu nhập thực của người làm phi chính thức -9.8%, phần chi tiêu mua ở hộ kinh doanh 0.23 điểm, lao động phi chính thức 2.64 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 7: đạt (ngưỡng 100 triệu: thu/GDP 0.68 điểm, doanh số thực của hộ kinh doanh -3.7%, thu nhập thực của người làm phi chính thức -6.3%, phần chi tiêu mua ở hộ kinh doanh -0.10 điểm, lao động phi chính thức 1.09 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 8: đạt (ngưỡng 100 triệu: thu/GDP 0.59 điểm, doanh số thực của hộ kinh doanh -4.6%, thu nhập thực của người làm phi chính thức -7.3%, phần chi tiêu mua ở hộ kinh doanh 0.00 điểm, lao động phi chính thức 1.45 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 9: đạt (ngưỡng 100 triệu: thu/GDP 0.68 điểm, doanh số thực của hộ kinh doanh -0.8%, thu nhập thực của người làm phi chính thức -0.7%, phần chi tiêu mua ở hộ kinh doanh -0.40 điểm, lao động phi chính thức -1.29 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 10: đạt (ngưỡng 100 triệu: thu/GDP 0.33 điểm, doanh số thực của hộ kinh doanh -7.0%, thu nhập thực của người làm phi chính thức -8.1%, phần chi tiêu mua ở hộ kinh doanh -2.38 điểm, lao động phi chính thức 0.60 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 11: đạt (ngưỡng 100 triệu: thu/GDP 0.27 điểm, doanh số thực của hộ kinh doanh -2.2%, thu nhập thực của người làm phi chính thức -2.4%, phần chi tiêu mua ở hộ kinh doanh -0.13 điểm, lao động phi chính thức -0.15 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 12: đạt (ngưỡng 100 triệu: thu/GDP 0.49 điểm, doanh số thực của hộ kinh doanh -2.9%, thu nhập thực của người làm phi chính thức -2.9%, phần chi tiêu mua ở hộ kinh doanh -0.87 điểm, lao động phi chính thức -0.59 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 13: đạt (ngưỡng 100 triệu: thu/GDP 0.39 điểm, doanh số thực của hộ kinh doanh -2.7%, thu nhập thực của người làm phi chính thức -4.5%, phần chi tiêu mua ở hộ kinh doanh 0.13 điểm, lao động phi chính thức 0.59 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 14: đạt (ngưỡng 100 triệu: thu/GDP 0.67 điểm, doanh số thực của hộ kinh doanh -3.1%, thu nhập thực của người làm phi chính thức -6.6%, phần chi tiêu mua ở hộ kinh doanh 0.07 điểm, lao động phi chính thức 1.11 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 15: đạt (ngưỡng 100 triệu: thu/GDP 0.29 điểm, doanh số thực của hộ kinh doanh -1.8%, thu nhập thực của người làm phi chính thức -4.0%, phần chi tiêu mua ở hộ kinh doanh 0.91 điểm, lao động phi chính thức 0.26 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 16: đạt (ngưỡng 100 triệu: thu/GDP 0.50 điểm, doanh số thực của hộ kinh doanh -1.5%, thu nhập thực của người làm phi chính thức -3.9%, phần chi tiêu mua ở hộ kinh doanh 0.66 điểm, lao động phi chính thức 0.69 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 17: đạt (ngưỡng 100 triệu: thu/GDP 0.71 điểm, doanh số thực của hộ kinh doanh -2.8%, thu nhập thực của người làm phi chính thức -5.6%, phần chi tiêu mua ở hộ kinh doanh 0.38 điểm, lao động phi chính thức 1.03 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 18: đạt (ngưỡng 100 triệu: thu/GDP 0.60 điểm, doanh số thực của hộ kinh doanh -3.1%, thu nhập thực của người làm phi chính thức -6.2%, phần chi tiêu mua ở hộ kinh doanh -0.01 điểm, lao động phi chính thức 0.98 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 19: đạt (ngưỡng 100 triệu: thu/GDP 0.51 điểm, doanh số thực của hộ kinh doanh -4.7%, thu nhập thực của người làm phi chính thức -8.5%, phần chi tiêu mua ở hộ kinh doanh 0.14 điểm, lao động phi chính thức 2.16 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)
- seed 20: đạt (ngưỡng 100 triệu: thu/GDP 0.40 điểm, doanh số thực của hộ kinh doanh -2.1%, thu nhập thực của người làm phi chính thức -3.9%, phần chi tiêu mua ở hộ kinh doanh 0.13 điểm, lao động phi chính thức 0.39 điểm; ngưỡng 1 tỷ hiện hành: thu/GDP 0.00 điểm)

</details>

<details><summary>K1.28: số đo từng seed</summary>

Chưa đạt, đã biết: Đã biết (Dương, 14/11/2026). Lương giờ bám một nửa lạm phát 12 tháng qua, không bám lạm phát kỳ vọng, nên tắt kỳ vọng gần như không đổi độ dai của lạm phát.

Cú sốc là ba năm chi ngân sách bằng tiền in rồi dừng hẳn. Cách đo đổi từ "số quý về nửa đỉnh" sang "phần lạm phát vượt trội còn lại ở năm thứ hai sau khi dừng", vì đỉnh từng lần chạy rất nhiễu.

- seed 1: không đạt (phần lạm phát vượt trội còn lại: bật 67.0%, tắt 90.5%)
- seed 2: không đạt (phần lạm phát vượt trội còn lại: bật 73.3%, tắt 101.2%)
- seed 3: không đạt (phần lạm phát vượt trội còn lại: bật 21.6%, tắt 42.0%)
- seed 4: không đạt (phần lạm phát vượt trội còn lại: bật 115.1%, tắt 136.1%)
- seed 5: không đạt (phần lạm phát vượt trội còn lại: bật 57.9%, tắt 66.3%)
- seed 6: không đạt (phần lạm phát vượt trội còn lại: bật 68.8%, tắt 96.9%)
- seed 7: đạt (phần lạm phát vượt trội còn lại: bật 79.6%, tắt 46.1%)
- seed 8: không đạt (phần lạm phát vượt trội còn lại: bật 62.5%, tắt 88.2%)
- seed 9: không đạt (phần lạm phát vượt trội còn lại: bật 87.8%, tắt 104.2%)
- seed 10: đạt (phần lạm phát vượt trội còn lại: bật 38.0%, tắt -16.0%)
- seed 11: đạt (phần lạm phát vượt trội còn lại: bật 81.2%, tắt 69.1%)
- seed 12: không đạt (phần lạm phát vượt trội còn lại: bật 152.5%, tắt 259.1%)
- seed 13: không đạt (phần lạm phát vượt trội còn lại: bật 47.7%, tắt 57.3%)
- seed 14: đạt (phần lạm phát vượt trội còn lại: bật 158.1%, tắt 132.8%)
- seed 15: không đạt (phần lạm phát vượt trội còn lại: bật 34.2%, tắt 38.8%)
- seed 16: không đạt (phần lạm phát vượt trội còn lại: bật 152.6%, tắt 249.9%)
- seed 17: đạt (phần lạm phát vượt trội còn lại: bật 110.4%, tắt 92.4%)
- seed 18: không đạt (phần lạm phát vượt trội còn lại: bật 175.3%, tắt 214.2%)
- seed 19: đạt (phần lạm phát vượt trội còn lại: bật 47.7%, tắt 30.3%)
- seed 20: đạt (phần lạm phát vượt trội còn lại: bật 43.3%, tắt 34.8%)

</details>

<details><summary>K1.29: số đo từng seed</summary>

Chưa đạt, đã biết: Đã biết (Dương, 14/11/2026). Hiệu đúng dấu nhưng nhỏ hơn nhiễu giữa các seed.

- seed 1: đạt (bật -10.1%, tắt -8.8%)
- seed 2: đạt (bật -9.0%, tắt -7.3%)
- seed 3: không đạt (bật -10.6%, tắt -15.6%)
- seed 4: đạt (bật -16.5%, tắt -13.0%)
- seed 5: đạt (bật -12.1%, tắt -10.8%)
- seed 6: không đạt (bật -6.3%, tắt -8.3%)
- seed 7: đạt (bật -10.4%, tắt -9.2%)
- seed 8: đạt (bật -10.9%, tắt -8.8%)
- seed 9: không đạt (bật -11.2%, tắt -11.7%)
- seed 10: đạt (bật -10.7%, tắt -8.4%)
- seed 11: đạt (bật -9.3%, tắt -8.0%)
- seed 12: đạt (bật -15.2%, tắt -10.7%)
- seed 13: đạt (bật -9.7%, tắt -9.0%)
- seed 14: không đạt (bật -7.3%, tắt -7.6%)
- seed 15: đạt (bật -8.4%, tắt -7.9%)
- seed 16: đạt (bật -12.0%, tắt -6.5%)
- seed 17: đạt (bật -7.2%, tắt -6.2%)
- seed 18: đạt (bật -6.5%, tắt -5.6%)
- seed 19: không đạt (bật -8.2%, tắt -8.9%)
- seed 20: không đạt (bật -6.9%, tắt -9.1%)

</details>

<details><summary>K1.31: số đo từng seed</summary>

Chưa đạt, đã biết: Chuyển sang GĐ2 (Dương, 14/11/2026). Lao động ở GĐ1 đồng nhất nên lương các doanh nghiệp tụm sát nhau, sàn lương không tách ra được một nhóm lương thấp. Kiểm lại khi có kỹ năng.

Sàn hiện hành thấp hơn nhiều so với lương đang trả nên nâng 30% không chạm ai. Thí nghiệm nâng sàn lên sát lương bình quân của doanh nghiệp (và ít nhất 30%).

- seed 1: đạt (lương nhóm thấp 1.0%; việc làm chính thức -3.6%; phi chính thức 1.40 điểm)
- seed 2: không đạt (lương nhóm thấp 1.2%; việc làm chính thức 1.0%; phi chính thức -0.39 điểm)
- seed 3: đạt (lương nhóm thấp 0.9%; việc làm chính thức -10.3%; phi chính thức 3.84 điểm)
- seed 4: đạt (lương nhóm thấp 1.2%; việc làm chính thức -0.8%; phi chính thức 0.29 điểm)
- seed 5: đạt (lương nhóm thấp 0.2%; việc làm chính thức 0.1%; phi chính thức 0.09 điểm)
- seed 6: không đạt (lương nhóm thấp 0.7%; việc làm chính thức 3.6%; phi chính thức -1.10 điểm)
- seed 7: đạt (lương nhóm thấp 1.2%; việc làm chính thức -2.7%; phi chính thức 0.49 điểm)
- seed 8: không đạt (lương nhóm thấp 0.4%; việc làm chính thức 3.0%; phi chính thức -0.86 điểm)
- seed 9: không đạt (lương nhóm thấp 1.0%; việc làm chính thức 1.3%; phi chính thức -0.22 điểm)
- seed 10: đạt (lương nhóm thấp 0.2%; việc làm chính thức -0.5%; phi chính thức 0.19 điểm)
- seed 11: đạt (lương nhóm thấp 0.4%; việc làm chính thức 0.4%; phi chính thức 0.09 điểm)
- seed 12: không đạt (lương nhóm thấp -0.2%; việc làm chính thức -4.8%; phi chính thức 1.76 điểm)
- seed 13: đạt (lương nhóm thấp 0.6%; việc làm chính thức -4.4%; phi chính thức 1.59 điểm)
- seed 14: đạt (lương nhóm thấp 1.5%; việc làm chính thức -0.6%; phi chính thức 0.42 điểm)
- seed 15: không đạt (lương nhóm thấp 0.4%; việc làm chính thức 0.9%; phi chính thức -0.38 điểm)
- seed 16: đạt (lương nhóm thấp 0.6%; việc làm chính thức -1.3%; phi chính thức 0.60 điểm)
- seed 17: không đạt (lương nhóm thấp 0.6%; việc làm chính thức 1.7%; phi chính thức -0.56 điểm)
- seed 18: không đạt (lương nhóm thấp 0.3%; việc làm chính thức 2.2%; phi chính thức -0.70 điểm)
- seed 19: không đạt (lương nhóm thấp 0.6%; việc làm chính thức 4.9%; phi chính thức -1.30 điểm)
- seed 20: không đạt (lương nhóm thấp 0.6%; việc làm chính thức 3.4%; phi chính thức -0.95 điểm)

</details>

## Lần chạy gốc, 5000 hộ

| Mã | Sự thật | Ngưỡng | Số seed đạt | Kết quả |
|---|---|---|---|---|
| K1.1 | Bốn đẳng thức kế toán đúng mọi tháng | tuyệt đối | 5/5 | QUA |
| K1.2 | Thay đổi tiền của công chúng khớp các kênh trong sổ cái | tuyệt đối | 5/5 | QUA |
| K1.3 | GDP theo chi tiêu = GDP theo thu nhập | tuyệt đối | 5/5 | QUA |
| K1.4 | Có phá sản và gia nhập mà sổ vẫn cân | tuyệt đối | 5/5 | QUA |
| K1.5 | Nền kinh tế tự ổn định | thất nghiệp 1-15% và lạm phát năm −2% đến 12% trong 95% số tháng | 5/5 | QUA |
| K1.6 | Thất nghiệp và hàng ế cùng có | hơn 90% số tháng | 5/5 | QUA |
| K1.7 | Chu kỳ tự sinh | tự tương quan GDP đã lọc dương ở trễ 1 và 2 quý | 5/5 | QUA |
| K1.8 | Đầu tư biến động hơn GDP, tiêu dùng ít hơn | tỷ số độ lệch chuẩn > 1,5 và < 1 | 5/5 | QUA |
| K1.9 | Thất nghiệp ngược chiều chu kỳ (Okun) | tương quan < −0,3 | 5/5 | QUA |
| K1.10 | Đường Phillips và Beveridge dốc xuống | hai tương quan âm | 5/5 | QUA |
| K1.11 | Tín dụng cùng chiều chu kỳ | tương quan > 0 | 5/5 | QUA |
| K1.12 | Lạm phát cùng chiều chu kỳ và trễ | tương quan chéo lớn nhất dương, ở trễ ≥ 1 quý | 4/5 | QUA |
| K1.13 | Bất bình đẳng tự hình thành | Gini của cải ròng > Gini thu nhập sau thuế (bình quân 12 tháng cuối năm 30); lệch phải | 3/5 | **CHƯA ĐẠT (đã biết)** |
| K1.14 | Quy mô doanh nghiệp lệch phải | độ lệch > 1 | 5/5 | QUA |
| K1.27 | Kinh tế xấu thì tỷ lệ phi chính thức tăng | tương quan với GDP đã lọc < 0 | 5/5 | QUA |
| K1.30 | Không doanh nghiệp nào trả dưới lương tối thiểu vùng | tuyệt đối | 5/5 | QUA |
| K1.32 | Tỷ lệ lao động phi chính thức ổn định quanh mục tiêu | bình quân 50-70%, trôi dưới 10 điểm | 5/5 | QUA |

<details><summary>K1.1: số đo từng seed</summary>

- seed 1: đạt (đúng mọi tháng)
- seed 2: đạt (đúng mọi tháng)
- seed 3: đạt (đúng mọi tháng)
- seed 4: đạt (đúng mọi tháng)
- seed 5: đạt (đúng mọi tháng)

</details>

<details><summary>K1.2: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)

</details>

<details><summary>K1.3: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)

</details>

<details><summary>K1.4: số đo từng seed</summary>

- seed 1: đạt (929 phá sản, 910 gia nhập)
- seed 2: đạt (804 phá sản, 817 gia nhập)
- seed 3: đạt (947 phá sản, 978 gia nhập)
- seed 4: đạt (873 phá sản, 892 gia nhập)
- seed 5: đạt (891 phá sản, 872 gia nhập)

</details>

<details><summary>K1.5: số đo từng seed</summary>

- seed 1: đạt (100.0% số tháng; thất nghiệp 6.4%, lạm phát 0.5%)
- seed 2: đạt (100.0% số tháng; thất nghiệp 6.5%, lạm phát 0.4%)
- seed 3: đạt (100.0% số tháng; thất nghiệp 6.2%, lạm phát 0.6%)
- seed 4: đạt (100.0% số tháng; thất nghiệp 6.4%, lạm phát 0.5%)
- seed 5: đạt (100.0% số tháng; thất nghiệp 6.3%, lạm phát 0.7%)

</details>

<details><summary>K1.6: số đo từng seed</summary>

- seed 1: đạt (100.0%)
- seed 2: đạt (100.0%)
- seed 3: đạt (100.0%)
- seed 4: đạt (100.0%)
- seed 5: đạt (100.0%)

</details>

<details><summary>K1.7: số đo từng seed</summary>

- seed 1: đạt (trễ 1: 0.90, trễ 2: 0.77)
- seed 2: đạt (trễ 1: 0.88, trễ 2: 0.70)
- seed 3: đạt (trễ 1: 0.91, trễ 2: 0.77)
- seed 4: đạt (trễ 1: 0.88, trễ 2: 0.72)
- seed 5: đạt (trễ 1: 0.95, trễ 2: 0.85)

</details>

<details><summary>K1.8: số đo từng seed</summary>

- seed 1: đạt (đầu tư 5.89, tiêu dùng 0.54)
- seed 2: đạt (đầu tư 6.70, tiêu dùng 0.53)
- seed 3: đạt (đầu tư 5.49, tiêu dùng 0.55)
- seed 4: đạt (đầu tư 6.08, tiêu dùng 0.56)
- seed 5: đạt (đầu tư 6.06, tiêu dùng 0.56)

</details>

<details><summary>K1.9: số đo từng seed</summary>

- seed 1: đạt (-0.95)
- seed 2: đạt (-0.87)
- seed 3: đạt (-0.90)
- seed 4: đạt (-0.83)
- seed 5: đạt (-0.94)

</details>

<details><summary>K1.10: số đo từng seed</summary>

- seed 1: đạt (Phillips -0.86, Beveridge -0.23)
- seed 2: đạt (Phillips -0.73, Beveridge -0.22)
- seed 3: đạt (Phillips -0.84, Beveridge -0.05)
- seed 4: đạt (Phillips -0.71, Beveridge -0.19)
- seed 5: đạt (Phillips -0.88, Beveridge -0.29)

</details>

<details><summary>K1.11: số đo từng seed</summary>

- seed 1: đạt (0.36)
- seed 2: đạt (0.41)
- seed 3: đạt (0.40)
- seed 4: đạt (0.49)
- seed 5: đạt (0.43)

</details>

<details><summary>K1.12: số đo từng seed</summary>

- seed 1: đạt (lớn nhất 0.85 ở trễ 1 quý)
- seed 2: không đạt (lớn nhất 0.68 ở trễ 0 quý)
- seed 3: đạt (lớn nhất 0.80 ở trễ 2 quý)
- seed 4: đạt (lớn nhất 0.60 ở trễ 2 quý)
- seed 5: đạt (lớn nhất 0.79 ở trễ 1 quý)

</details>

<details><summary>K1.13: số đo từng seed</summary>

Chưa đạt, đã biết: Đã biết (Dương, 15/11/2026). Ở 5000 hộ Gini của cải ròng không cao hơn Gini thu nhập ở mọi seed (lượt 15/11: 3/5 seed đạt; ở 500 hộ 20/20). Thiếu cơ chế tích tụ của cải: chủ tái đầu tư cổ tức, mua bán cổ phần, sở hữu tập trung. Sửa ở GĐ3 và GĐ4 (sai-khac.md D8). Kết quả phụ thuộc quy mô.

- seed 1: không đạt (của cải 0.31, thu nhập 0.34; độ lệch 2.83)
- seed 2: không đạt (của cải 0.28, thu nhập 0.33; độ lệch 2.26)
- seed 3: đạt (của cải 0.30, thu nhập 0.28; độ lệch 2.30)
- seed 4: đạt (của cải 0.31, thu nhập 0.31; độ lệch 3.29)
- seed 5: đạt (của cải 0.33, thu nhập 0.31; độ lệch 4.08)

</details>

<details><summary>K1.14: số đo từng seed</summary>

- seed 1: đạt (5.91)
- seed 2: đạt (5.12)
- seed 3: đạt (5.87)
- seed 4: đạt (6.03)
- seed 5: đạt (5.63)

</details>

<details><summary>K1.27: số đo từng seed</summary>

- seed 1: đạt (-0.93)
- seed 2: đạt (-0.91)
- seed 3: đạt (-0.93)
- seed 4: đạt (-0.93)
- seed 5: đạt (-0.95)

</details>

<details><summary>K1.30: số đo từng seed</summary>

- seed 1: đạt (0)
- seed 2: đạt (0)
- seed 3: đạt (0)
- seed 4: đạt (0)
- seed 5: đạt (0)

</details>

<details><summary>K1.32: số đo từng seed</summary>

- seed 1: đạt (bình quân 56.9%, trôi 4.0 điểm)
- seed 2: đạt (bình quân 56.5%, trôi 1.7 điểm)
- seed 3: đạt (bình quân 56.1%, trôi 1.5 điểm)
- seed 4: đạt (bình quân 56.5%, trôi 1.6 điểm)
- seed 5: đạt (bình quân 57.8%, trôi 3.6 điểm)

</details>

Trung bình các năm 11-40 của từng seed:

| seed | thất nghiệp | lạm phát | phi chính thức | thu/GDP | tiền mặt | Gini của cải | doanh nghiệp | phá sản/năm | mới/năm |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6.4% | 0.5% | 56.9% | 14.6% | 13.9% | 0.33 | 281 | 19.8 | 18.9 |
| 2 | 6.5% | 0.4% | 56.5% | 14.8% | 13.9% | 0.31 | 313 | 16.5 | 16.3 |
| 3 | 6.2% | 0.6% | 56.1% | 14.5% | 13.9% | 0.33 | 331 | 21.1 | 21.6 |
| 4 | 6.4% | 0.5% | 56.5% | 14.6% | 13.9% | 0.35 | 319 | 18.7 | 18.7 |
| 5 | 6.3% | 0.7% | 57.8% | 14.7% | 14.1% | 0.36 | 281 | 19.0 | 17.5 |

## Kế toán ở 50 hộ

| Mã | Sự thật | Ngưỡng | Số seed đạt | Kết quả |
|---|---|---|---|---|
| K1.1 | Bốn đẳng thức kế toán đúng mọi tháng | tuyệt đối | 20/20 | QUA |
| K1.2 | Thay đổi tiền của công chúng khớp các kênh trong sổ cái | tuyệt đối | 20/20 | QUA |
| K1.3 | GDP theo chi tiêu = GDP theo thu nhập | tuyệt đối | 20/20 | QUA |
| K1.4 | Có phá sản và gia nhập mà sổ vẫn cân | tuyệt đối | 20/20 | QUA |
| K1.30 | Không doanh nghiệp nào trả dưới lương tối thiểu vùng | tuyệt đối | 20/20 | QUA |

<details><summary>K1.1: số đo từng seed</summary>

- seed 1: đạt (đúng mọi tháng)
- seed 2: đạt (đúng mọi tháng)
- seed 3: đạt (đúng mọi tháng)
- seed 4: đạt (đúng mọi tháng)
- seed 5: đạt (đúng mọi tháng)
- seed 6: đạt (đúng mọi tháng)
- seed 7: đạt (đúng mọi tháng)
- seed 8: đạt (đúng mọi tháng)
- seed 9: đạt (đúng mọi tháng)
- seed 10: đạt (đúng mọi tháng)
- seed 11: đạt (đúng mọi tháng)
- seed 12: đạt (đúng mọi tháng)
- seed 13: đạt (đúng mọi tháng)
- seed 14: đạt (đúng mọi tháng)
- seed 15: đạt (đúng mọi tháng)
- seed 16: đạt (đúng mọi tháng)
- seed 17: đạt (đúng mọi tháng)
- seed 18: đạt (đúng mọi tháng)
- seed 19: đạt (đúng mọi tháng)
- seed 20: đạt (đúng mọi tháng)

</details>

<details><summary>K1.2: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)
- seed 6: đạt (khớp)
- seed 7: đạt (khớp)
- seed 8: đạt (khớp)
- seed 9: đạt (khớp)
- seed 10: đạt (khớp)
- seed 11: đạt (khớp)
- seed 12: đạt (khớp)
- seed 13: đạt (khớp)
- seed 14: đạt (khớp)
- seed 15: đạt (khớp)
- seed 16: đạt (khớp)
- seed 17: đạt (khớp)
- seed 18: đạt (khớp)
- seed 19: đạt (khớp)
- seed 20: đạt (khớp)

</details>

<details><summary>K1.3: số đo từng seed</summary>

- seed 1: đạt (khớp)
- seed 2: đạt (khớp)
- seed 3: đạt (khớp)
- seed 4: đạt (khớp)
- seed 5: đạt (khớp)
- seed 6: đạt (khớp)
- seed 7: đạt (khớp)
- seed 8: đạt (khớp)
- seed 9: đạt (khớp)
- seed 10: đạt (khớp)
- seed 11: đạt (khớp)
- seed 12: đạt (khớp)
- seed 13: đạt (khớp)
- seed 14: đạt (khớp)
- seed 15: đạt (khớp)
- seed 16: đạt (khớp)
- seed 17: đạt (khớp)
- seed 18: đạt (khớp)
- seed 19: đạt (khớp)
- seed 20: đạt (khớp)

</details>

<details><summary>K1.4: số đo từng seed</summary>

- seed 1: đạt (23 phá sản, 21 gia nhập)
- seed 2: đạt (19 phá sản, 17 gia nhập)
- seed 3: đạt (21 phá sản, 19 gia nhập)
- seed 4: đạt (18 phá sản, 18 gia nhập)
- seed 5: đạt (21 phá sản, 21 gia nhập)
- seed 6: đạt (21 phá sản, 18 gia nhập)
- seed 7: đạt (22 phá sản, 21 gia nhập)
- seed 8: đạt (17 phá sản, 16 gia nhập)
- seed 9: đạt (18 phá sản, 18 gia nhập)
- seed 10: đạt (23 phá sản, 20 gia nhập)
- seed 11: đạt (16 phá sản, 13 gia nhập)
- seed 12: đạt (14 phá sản, 13 gia nhập)
- seed 13: đạt (21 phá sản, 21 gia nhập)
- seed 14: đạt (21 phá sản, 19 gia nhập)
- seed 15: đạt (22 phá sản, 21 gia nhập)
- seed 16: đạt (17 phá sản, 16 gia nhập)
- seed 17: đạt (14 phá sản, 12 gia nhập)
- seed 18: đạt (19 phá sản, 17 gia nhập)
- seed 19: đạt (17 phá sản, 15 gia nhập)
- seed 20: đạt (16 phá sản, 15 gia nhập)

</details>

<details><summary>K1.30: số đo từng seed</summary>

- seed 1: đạt (0)
- seed 2: đạt (0)
- seed 3: đạt (0)
- seed 4: đạt (0)
- seed 5: đạt (0)
- seed 6: đạt (0)
- seed 7: đạt (0)
- seed 8: đạt (0)
- seed 9: đạt (0)
- seed 10: đạt (0)
- seed 11: đạt (0)
- seed 12: đạt (0)
- seed 13: đạt (0)
- seed 14: đạt (0)
- seed 15: đạt (0)
- seed 16: đạt (0)
- seed 17: đạt (0)
- seed 18: đạt (0)
- seed 19: đạt (0)
- seed 20: đạt (0)

</details>

