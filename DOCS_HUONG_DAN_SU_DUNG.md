# HƯỚNG DẪN SỬ DỤNG DÀNH CHO GIẢNG VIÊN
## WEBSITE CÁ NHÂN & CỔNG THU BÀI TẬP — THS. TRỊNH MINH PHÚ

---

### MỤC LỤC
1. [Đăng nhập vào Hệ thống Quản trị](#1-đăng-nhập-vào-hệ-thống-quản-trị)
2. [Quản lý và Khởi tạo Bài tập mới](#2-quản-lý-và-khởi-tạo-bài-tập-mới)
3. [Quản lý và Chấm điểm Bài nộp của Sinh viên](#3-quản-lý-và-chấm-điểm-bài-nộp-của-sinh-viên)
4. [Tải tệp Bài làm Hàng loạt (File ZIP)](#4-tải-tệp-bài-làm-hàng-loạt-file-zip)
5. [Xuất Danh sách Bài nộp ra Excel / CSV](#5-xuất-danh-sách-bài-nộp-ra-excel--csv)
6. [Quản lý Học phần, Đề cương và Học liệu số](#6-quản-lý-học-phần-đề-cương-và-học-liệu-số)
7. [Đăng Thông báo và Tiếp nhận Thư liên hệ](#7-đăng-thông-báo-và-tiếp-nhận-thư-liên-hệ)
8. [Cập nhật Hồ sơ cá nhân và Thông tin liên lạc](#8-cập-nhật-hồ-sơ-cá-nhân-và-thông-tin-liên-lạc)

---

### 1. ĐĂNG NHẬP VÀO HỆ THỐNG QUẢN TRỊ
1. Trên thanh điều hướng đầu trang của website, nhấn vào nút **"Cổng Giảng Viên"** ở góc phải (hoặc truy cập trực tiếp đường dẫn `/admin/login`).
2. Nhập thông tin đăng nhập:
   - **Email:** `admin@trinhminhphu.edu.vn`
   - **Mật khẩu:** `AdminPassword2026@`
3. Nhấn **"Đăng nhập Cổng Quản trị"**. Hệ thống sẽ chuyển hướng đến Dashboard tổng quan `/admin`.

---

### 2. QUẢN LÝ VÀ KHỞI TẠO BÀI TẬP MỚI
1. Truy cập menu **"Quản lý Bài tập"** (`/admin/assignments`).
2. Nhấn nút **"+ Tạo bài tập mới"**:
   - **Học phần:** Chọn môn học cần giao bài (VD: `IT3010 - Lập trình Web Nâng cao`).
   - **Tiêu đề bài tập:** Đặt tên rõ ràng (VD: *Bài tập lớn: Xây dựng hệ thống Web Full-stack*).
   - **Mô tả & Yêu cầu:** Ghi rõ tiêu chí đánh giá, quy cách nộp bài, định dạng báo cáo.
   - **Hạn nộp:** Chọn ngày và giờ kết thúc nhận bài (tính theo giờ máy chủ).
   - **Định dạng cho phép:** Liệt kê các đuôi tệp cách nhau bởi dấu phẩy, ví dụ: `PDF,DOCX,ZIP,SQL,CPP`.
   - **Dung lượng tối đa:** Mặc định là 50MB (hoặc tăng/giảm tùy yêu cầu).
   - **Trạng thái:**
     * `OPEN`: Đang nhận bài.
     * `CLOSING_SOON`: Sắp đến hạn (hệ thống gắn nhãn màu vàng cảnh báo).
     * `CLOSED`: Đã đóng (sinh viên không thể nộp thêm).
3. Nhấn **"Lưu Bài Tập"**.

---

### 3. QUẢN LÝ VÀ CHẤM ĐIỂM BÀI NỘP CỦA SINH VIÊN
1. Truy cập menu **"Quản lý Bài nộp"** (`/admin/submissions`).
2. Sử dụng thanh công cụ để tìm kiếm và lọc:
   - Tìm kiếm nhanh theo **Mã sinh viên (MSSV)**, **Họ tên**, **Lớp** hoặc **Mã biên nhận**.
   - Lọc theo **Môn học**, **Bài tập**, hoặc trạng thái nộp (**Đúng hạn / Nộp muộn**).
   - Lọc bài **Chờ chấm** hoặc **Đã chấm**.
3. **Chấm bài:**
   - Tại dòng của sinh viên cần chấm, nhấn nút **"Chấm bài"**.
   - Cửa sổ chấm điểm sẽ hiện ra với đầy đủ thông tin: Mã biên nhận, file bài làm, ghi chú của sinh viên.
   - Giảng viên nhập **Điểm số (Thang điểm 10)**, chọn trạng thái (`Đã chấm điểm` / `Cần chỉnh sửa`) và ghi chú **Nhận xét & Góp ý**.
   - Nhấn **"Lưu Điểm & Phản Hồi"**. Kết quả sẽ được lưu ngay lập tức và sinh viên có thể tra cứu bằng Mã biên nhận của họ.

---

### 4. TẢI TỆP BÀI LÀM HÀNG LOẠT (FILE ZIP)
1. Tại trang **Quản lý Bài nộp**, giảng viên có 2 cách tải:
   - **Cách 1 (Tải các bài được chọn):** Đánh dấu vào ô vuông đầu dòng của các sinh viên cần tải, sau đó nhấn nút **"Tải X bài đã chọn (ZIP)"**.
   - **Cách 2 (Tải toàn bộ bài của một bài tập):** Chọn bài tập ở bộ lọc, sau đó nhấn **"Tải toàn bộ bộ lọc (ZIP)"**.
2. Hệ thống sẽ tự động đóng gói tất cả các bài làm thành 1 tệp `.zip` duy nhất:
   - Mỗi file bên trong được tự động đổi tên theo định dạng chuẩn: `MSSV_HoTen_MaBienNhan_TenFileGoc`.
   - Bên trong file ZIP luôn đính kèm sẵn tệp `00_Danh_Sach_Bai_Nop.csv` tổng hợp bảng điểm và thời gian nộp của toàn bộ sinh viên.

---

### 5. XUẤT DANH SÁCH BÀI NỘP RA EXCEL / CSV
1. Tại trang **Quản lý Bài nộp**, nhấn nút **"Xuất Excel / CSV"** màu xanh lá.
2. Trình duyệt sẽ tải về tệp bảng tính có cấu trúc chuẩn:
   - Cột: STT, Mã Biên Nhận, MSSV, Họ Tên, Lớp, Email, Môn Học, Bài Tập, Tên File, Dung Lượng, Thời Gian Nộp, Trạng Thái Nộp (Đúng hạn/Muộn), Trạng Thái Chấm, Điểm Số, Nhận Xét.
   - Tệp được mã hóa UTF-8 BOM, đảm bảo mở trực tiếp trên **Microsoft Excel (Windows / Mac)** không bị lỗi font tiếng Việt.

---

### 6. QUẢN LÝ HỌC PHẦN, ĐỀ CƯƠNG VÀ HỌC LIỆU SỐ
- **Học phần (`/admin/courses`):** Giảng viên có thể cập nhật đề cương 15 tuần, chuẩn đầu ra (CLO) hoặc tạm thời ẩn bớt các môn chưa mở trong học kỳ.
- **Tài liệu học tập (`/admin/resources`):** Đăng tải đường dẫn slide bài giảng, file Word đề cương, link Google Drive hoặc GitHub starter kit. Có thể tích chọn **"Chỉ dành cho sinh viên nội bộ"** để gắn nhãn phân biệt với tài liệu công khai.

---

### 7. ĐĂNG THÔNG BÁO VÀ TIẾP NHẬN THƯ LIÊN HỆ
- **Thông báo (`/admin/announcements`):** Đăng các thông tin nhắc nhở lịch thi, dời phòng máy, nộp báo cáo. Tích chọn **"Ghim đầu trang"** để thông báo luôn nổi bật trên Trang chủ.
- **Thư liên hệ (`/admin/messages`):** Tiếp nhận câu hỏi, thắc mắc đồ án của sinh viên gửi từ form liên hệ ngoài website. Giảng viên có thể đánh dấu đã đọc hoặc xóa thư cũ.

---

### 8. CẬP NHẬT HỒ SƠ CÁ NHÂN VÀ THÔNG TIN LIÊN LẠC
- Truy cập mục **"Hồ sơ Giảng viên"** (`/admin/profile`).
- Có thể cập nhật chức danh, email công tác, số điện thoại, văn phòng làm việc và bài viết tiểu sử giới thiệu bản thân bất cứ lúc nào. Thay đổi sẽ hiển thị ngay tức thì ra trang chủ.
