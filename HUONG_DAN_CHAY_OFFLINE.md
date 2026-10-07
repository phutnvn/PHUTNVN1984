# HƯỚNG DẪN KHỞI CHẠY VÀ SỬ DỤNG OFFLINE (KHÔNG CẦN INTERNET)
### Website Cá nhân Giảng viên: ThS. Trịnh Minh Phú
**Khoa Toán - Tin, Trường Đại học Khoa học — Đại học Thái Nguyên**

---

## I. TÍNH NĂNG TỰ CHỦ HOÀN TOÀN KHI CHẠY OFFLINE
Dự án đã được thiết kế và đóng gói để hoạt động độc lập 100% trên máy tính cá nhân hoặc mạng nội bộ (LAN / Intranet), không đòi hỏi kết nối mạng Internet:

1. **Cơ sở dữ liệu nội bộ:** Sử dụng SQLite (`prisma/dev.db`) tích hợp sẵn ngay trong thư mục dự án, không cần cài đặt SQL Server hay kết nối Internet đến Cloud.
2. **Lưu trữ bài tập cục bộ:** Tệp sinh viên nộp được lưu trữ riêng tư tại `private_storage/submissions/` trên ổ đĩa máy tính, tuyệt đối an toàn và không bị lộ ra ngoài.
3. **Kho học liệu và tài liệu mẫu:** Toàn bộ slide, đề cương, bài tập và mã nguồn mẫu được lưu trữ trực tiếp tại `public/materials/` và có thể tải về/mở ngoại tuyến.
4. **Giao diện và icon độc lập:** Thư viện icon Lucide và CSS Tailwind được biên dịch tĩnh đóng gói sẵn (Offline Bundle), không tải CDN từ bên ngoài.
5. **Dễ dàng sao lưu:** Khi muốn sao lưu dữ liệu điểm số và bài nộp, chỉ cần copy tệp `prisma/dev.db` và thư mục `private_storage/`.

---

## II. CÁCH KHỞI CHẠY HỆ THỐNG OFFLINE

### Cách 1: Khởi động nhanh bằng 1 Click chuột (Khuyên dùng)
1. Mở thư mục dự án `D:\PHUTNVN1984`.
2. Nhấp đúp chuột (Double click) vào tệp:
   ```text
   CHAY_OFFLINE.bat
   ```
3. Hệ thống sẽ tự động khởi động máy chủ và tự động mở trình duyệt web đến địa chỉ:
   ```text
   http://localhost:3000
   ```

### Cách 2: Khởi động từ Command Prompt / Terminal
Mở cửa sổ Command Prompt tại thư mục dự án và gõ:
```bash
npm run start
```
*(Hoặc `npm run dev` nếu muốn bật chế độ phát triển/chỉnh sửa mã nguồn trực tiếp)*

---

## III. CÁCH DỪNG MÁY CHỦ (TẮT SERVER)
- Nhấn tổ hợp phím `Ctrl + C` trên cửa sổ dòng lệnh đang chạy.
- Hoặc nhấp đúp chuột vào tệp:
  ```text
  DUNG_SERVER.bat
  ```
  để tự động giải phóng cổng kết nối 3000.

---

## IV. CÁC ĐỊA CHỈ TRUY CẬP VÀ KIỂM THỬ

| Chức năng | Đường dẫn (URL) | Mô tả |
| :--- | :--- | :--- |
| **Trang chủ** | `http://localhost:3000` | Giới thiệu giảng viên, ảnh chân dung, tin mới |
| **Giới thiệu** | `http://localhost:3000/about` | Quá trình công tác, đơn vị, liên hệ Thái Nguyên |
| **Giảng dạy** | `http://localhost:3000/teaching` | Danh sách học phần, bài giảng, đề cương |
| **Tài liệu học tập** | `http://localhost:3000/resources` | Tìm kiếm, lọc và tải tệp ngoại tuyến (PDF, Word, Excel) |
| **Nộp bài tập trực tuyến** | `http://localhost:3000/submissions` | Nộp bài, kiểm tra kích thước file, cấp mã biên nhận |
| **Tra cứu bài nộp** | `http://localhost:3000/submissions?tab=lookup` | Tra cứu theo Mã sinh viên + Mã biên nhận |
| **Cổng Quản trị** | `http://localhost:3000/admin` | Khu vực dành riêng cho giảng viên |

---

## V. THÔNG TIN ĐĂNG NHẬP CỔNG QUẢN TRỊ (ADMIN)
- **Đường dẫn đăng nhập:** `http://localhost:3000/admin/login`
- **Email quản trị:** `phutm@tnus.edu.vn`
- **Mật khẩu:** `AdminPassword2026@`

### Các quyền năng của Giảng viên trong trang Quản trị:
1. **Quản lý & Chấm điểm bài tập:** Xem danh sách nộp bài, xem ghi chú sinh viên, nhập điểm và lời phê nhận xét.
2. **Tải bài tập ngoại tuyến:** Tải từng bài nộp của sinh viên hoặc tải hàng loạt toàn bộ bài làm dưới dạng một tệp nén **ZIP**.
3. **Xuất báo cáo điểm:** Xuất danh sách sinh viên nộp bài ra tệp **Excel / CSV** chuẩn Tiếng Việt (UTF-8).
4. **Cập nhật bài tập & Học phần:** Tạo thêm bài tập mới, quy định hạn nộp, định dạng tệp và đóng/mở nhận bài.
5. **Quản lý Học liệu & Thông báo:** Tải lên tài liệu mới, đăng thông báo học tập ghim lên trang chủ.
