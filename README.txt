
BỘ FILE THI TRẮC NGHIỆM TRỰC TUYẾN

1) index.html
- Trang thi cho thí sinh và trang xem kết quả cho admin.

2) questions_template.xlsx
- Mẫu Excel để tạo ngân hàng câu hỏi.
- Đổi tên file này thành questions.xlsx khi dùng thật.

3) apps_script.gs
- Mã Google Apps Script để lưu kết quả tập trung vào Google Sheet.

CẤU TRÚC EXCEL:
ID | Question | A | B | C | D | Correct | Explanation

Ví dụ:
1 | PCCC là viết tắt của cụm từ nào? | Phòng cháy chữa cháy | ... | ... | ... | A | 

LƯU Ý QUAN TRỌNG:
- HTML tĩnh có thể đọc file Excel cùng thư mục.
- Nhưng để admin xem kết quả tập trung từ nhiều thí sinh, cần có backend.
- Bộ này dùng Google Apps Script + Google Sheet làm backend nhẹ, miễn phí, dễ triển khai.

CÁCH TRIỂN KHAI NHANH:
1. Tạo file questions.xlsx theo mẫu.
2. Mở apps_script.gs trong Google Apps Script, triển khai Web App.
3. Dán URL Web App vào biến SCRIPT_URL trong index.html
4. Đưa index.html và questions.xlsx lên hosting (ví dụ GitHub Pages).

TÀI KHOẢN ADMIN:
- Mật khẩu mặc định trong index.html: admin123
- Có thể đổi tại biến ADMIN_PASSWORD
