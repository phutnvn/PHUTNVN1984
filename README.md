# WEBSITE CÁ NHÂN GIẢNG VIÊN TRỊNH MINH PHÚ & HỆ THỐNG THU BÀI TẬP TRỰC TUYẾN

> **Hệ thống Full-stack hoàn chỉnh** xây dựng trên nền tảng **Next.js 14 (App Router, TypeScript)**, **Tailwind CSS**, **Prisma ORM**, **JWT Authentication** và **Private Storage Engine**. Phục vụ công tác giới thiệu hồ sơ học thuật, công bố học liệu số và quản lý - thu nhận bài tập trực tuyến an toàn cho hoạt động giảng dạy đại học.

---

## 🌟 TỔNG QUAN HỆ THỐNG

### 1. Bảng màu thương hiệu chuẩn học thuật
- **Xanh dương đậm chủ đạo**: `#123B65`
- **Xanh dương sáng điểm nhấn**: `#2F80ED`
- **Trắng nền chính**: `#FFFFFF`
- **Xám nhạt nền khối nội dung**: `#F4F7FB`
- **Xám đậm màu chữ phụ**: `#344054`

### 2. Các phân hệ chức năng đã hoàn thiện 100%
1. **Trang chủ (`/`)**:
   - Header nhận diện thương hiệu `TRINH MINH PHU`.
   - Ảnh chân dung giảng viên chuyên nghiệp độ phân giải cao (`/images/lecturer-portrait.jpg`).
   - Khẩu hiệu: *“Giảng viên | Công nghệ thông tin | Giáo dục và sáng tạo”*.
   - Khối đếm số liệu thống kê học phần, tài liệu, sinh viên.
   - Thẻ lĩnh vực chuyên môn & nghiên cứu trọng tâm.
   - Danh sách bài tập đang mở nhận bài với nút chuyển nhanh đến form nộp.
   - Thông báo học tập mới nhất & Học liệu mới cập nhật.
2. **Trang Giới thiệu (`/about`)**:
   - Hồ sơ học thuật, chức danh, đơn vị công tác, phòng làm việc.
   - Timeline Quá trình đào tạo & Bằng cấp (Đại học Bách Khoa).
   - Timeline Quá trình công tác và giảng dạy đại học.
   - Lĩnh vực nghiên cứu chuyên sâu (Web nâng cao, CSDL phân tán, Machine Learning).
   - Chứng chỉ, giải thưởng và hoạt động cố vấn học thuật CLB sinh viên.
   - Liên kết học thuật: Google Scholar, GitHub, LinkedIn, ResearchGate.
3. **Trang Giảng dạy (`/teaching`)**:
   - Thẻ học phần trực quan: `IT3010` (Lập trình Web nâng cao), `IT2020` (Hệ Quản trị CSDL), `IT1050` (Cấu trúc dữ liệu & Giải thuật), `IT4080` (Trí tuệ nhân tạo).
   - Đề cương chi tiết, chuẩn đầu ra (CLO), đối tượng sinh viên.
   - Danh sách bài tập liên quan kèm hạn nộp và nút nộp bài trực tiếp.
4. **Trang Tài liệu học tập (`/resources`)**:
   - Kho học liệu hỗ trợ PDF, DOCX, PPTX, XLSX và Link liên kết.
   - Bộ lọc thời gian thực theo học phần và theo định dạng tệp.
   - Thanh tìm kiếm tài liệu theo từ khóa.
   - Phân định rõ ràng giữa **Tài liệu Công khai** và **Tài liệu Nội bộ lớp**.
5. **Cổng Nộp bài tập trực tuyến (`/submissions`)** *(Chức năng trọng tâm)*:
   - **Tab 1: Danh sách bài tập**: Hiển thị bài tập đang mở, sắp đến hạn, đã đóng kèm yêu cầu chi tiết.
   - **Tab 2: Biểu mẫu nộp bài**:
     * Kiểm tra trường bắt buộc: Họ tên, MSSV, Lớp, Học phần, Bài tập, Email.
     * Kiểm định định dạng tệp (PDF, DOCX, ZIP, SQL, CPP,...) và giới hạn dung lượng máy chủ (MB).
     * Ghi nhận thời gian nộp theo đồng hồ máy chủ Việt Nam (GMT+7).
     * Tự động xác định và gắn nhãn **Đúng hạn** hoặc **Nộp muộn**.
     * Cấp **Mã Biên Nhận (Receipt Code)** độc nhất (VD: `REC-202610-8472`).
     * Modal Biên nhận nộp bài hỗ trợ in và sao chép mã.
     * Lưu trữ tệp an toàn trong thư mục máy chủ riêng tư (`private_storage/submissions`), tuyệt đối **không** để trong thư mục `public`.
   - **Tab 3: Tra cứu biên nhận bảo mật**:
     * Sinh viên tra cứu bằng **MSSV + Mã Biên Nhận (hoặc Email)**.
     * Bảo mật tuyệt đối: Không để lộ bài làm, email hay thông tin cá nhân của sinh viên khác.
     * Xem kết quả chấm điểm, điểm số (thang điểm 10) và lời nhận xét của giảng viên.
6. **Trang Liên hệ (`/contact`)**:
   - Thông tin văn phòng, giờ tiếp sinh viên, email, số điện thoại.
   - Biểu mẫu gửi tin nhắn trực tuyến lưu trữ trực tiếp vào CSDL quản trị.
7. **Cổng Quản trị Giảng viên (`/admin`)**:
   - **Bảo mật xác thực**: Đăng nhập mã hóa mật khẩu bằng `bcryptjs` và phiên làm việc JWT HTTP-only Cookie.
   - **Dashboard thống kê**: Tổng số học phần, bài tập đang mở, tổng bài nộp, số bài chưa chấm, số bài nộp muộn, biểu đồ phân bổ nộp bài theo học phần.
   - **Quản lý bài nộp (`/admin/submissions`)**:
     * Tìm kiếm theo tên, MSSV, lớp, email, mã biên nhận.
     * Lọc theo môn học, bài tập, trạng thái chấm (Chờ/Đã chấm), thời gian (Đúng hạn/Muộn).
     * Modal chấm điểm trực tiếp: Cho điểm (0 - 10), nhận xét, cập nhật trạng thái.
     * Tải bài nộp từng sinh viên.
     * **Tải hàng loạt dưới dạng tệp ZIP** (tự động gom file kèm manifest CSV).
     * **Xuất danh sách bài nộp ra Excel / CSV** chuẩn ký tự tiếng Việt UTF-8 BOM.
   - **Quản lý bài tập (`/admin/assignments`)**: Tạo mới, sửa, đóng/mở bài tập, đặt hạn nộp, định dạng tệp cho phép, dung lượng tối đa.
   - **Quản lý học phần (`/admin/courses`)**: Thêm/sửa học phần, đề cương chi tiết, ẩn/hiện học phần.
   - **Quản lý tài liệu (`/admin/resources`)**: Thêm tài liệu, phân quyền công khai/nội bộ.
   - **Quản lý thông báo (`/admin/announcements`)**: Đăng thông báo, ghim lên đầu trang.
   - **Hồ sơ giảng viên (`/admin/profile`)**: Cập nhật thông tin cá nhân, tiểu sử, phòng làm việc.
   - **Hòm thư liên hệ (`/admin/messages`)**: Đọc tin nhắn sinh viên gửi, đánh dấu đã đọc/chưa đọc.

---

## 🔑 THÔNG TIN TÀI KHOẢN QUẢN TRỊ MẪU

| Vai trò | Email đăng nhập | Mật khẩu | Đường dẫn |
| :--- | :--- | :--- | :--- |
| **Giảng viên / Admin** | `phutm@tnus.edu.vn` | `AdminPassword2026@` | `http://localhost:3000/admin/login` |

---

## 🛠️ HƯỚNG DẪN CLONE TỪ GITHUB & CHẠY LOCAL

### Yêu cầu môi trường
- **Git**: Đã cài đặt trên máy.
- **Node.js**: Phiên bản 18.x trở lên (khuyên dùng Node 20+ hoặc 22+).

### Các bước khởi chạy:
```bash
# 1. Clone mã nguồn từ GitHub về máy
git clone https://github.com/PHUTNVN/PHUTNVN1984.git
cd PHUTNVN1984

# 2. Cài đặt các gói thư viện
npm install

# 3. Tạo file cấu hình môi trường từ mẫu
copy .env.example .env

# 4. Khởi tạo cơ sở dữ liệu SQLite và nạp dữ liệu mẫu
npx prisma db push
node prisma/seed.js
node scripts/setup_offline.js

# 5. Khởi chạy máy chủ phát triển
npm run dev
```

> **Mẹo chạy nhanh 1-Click trên Windows:**
> Sau khi `npm install`, bạn chỉ cần nhấp đúp vào tệp **`CHAY_OFFLINE.bat`**, hệ thống sẽ tự động build và mở trình duyệt web tại `http://localhost:3000`.

---

## ⚙️ CẤU HÌNH BIẾN MÔI TRƯỜNG (`.env`)

Tệp `.env` tại thư mục gốc:
```env
# 1. Cơ sở dữ liệu:
# Mặc định sử dụng SQLite độc lập không cần cài đặt thêm phần mềm máy chủ CSDL:
DATABASE_URL="file:./dev.db"

# Khi triển khai lên Supabase hoặc PostgreSQL trên Cloud:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]?schema=public"

# 2. Bảo mật Token JWT:
JWT_SECRET="trinh_minh_phu_academic_portal_secret_key_2026_xyz"

# 3. Tài khoản Giảng viên mặc định:
ADMIN_EMAIL="admin@trinhminhphu.edu.vn"
ADMIN_PASSWORD="AdminPassword2026@"

# 4. Thư mục lưu trữ tệp bài nộp riêng tư:
STORAGE_DIR="./private_storage/submissions"
MAX_FILE_SIZE_MB=50
```

---

## 🚀 HƯỚNG DẪN TRIỂN KHAI LÊN CLOUD (VERCEL / SUPABASE)

1. **Cơ sở dữ liệu PostgreSQL (Supabase)**:
   - Tạo một dự án mới trên [Supabase](https://supabase.com).
   - Lấy chuỗi kết nối `DATABASE_URL` (Connection string dạng `postgresql://...`).
   - Trong `prisma/schema.prisma`, đổi `provider = "sqlite"` thành `provider = "postgresql"`.
   - Chạy lệnh `npx prisma db push && node prisma/seed.js` để tạo bảng và dữ liệu khởi tạo.

2. **Triển khai Web Frontend & Backend (Vercel)**:
   - Đẩy mã nguồn lên kho GitHub/GitLab.
   - Nhập dự án vào [Vercel](https://vercel.com).
   - Thiết lập các biến môi trường: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
   - Với lưu trữ tệp trên môi trường serverless không trạng thái (stateless), có thể tích hợp Supabase Storage bucket riêng tư (Private Bucket) hoặc AWS S3 bằng cách cấu hình S3 SDK trong `/api/submissions`.

---

## 🔒 KIẾN TRÚC AN TOÀN & BẢO MẬT DỮ LIỆU

1. **Bảo vệ tệp bài làm sinh viên**:
   - Tệp bài làm **không bao giờ** đặt trong thư mục tĩnh `/public`.
   - Được ghi trực tiếp vào `private_storage/submissions/` với tên tệp mã hóa kèm mã biên nhận ngẫu nhiên.
   - Endpoint tải tệp `/api/submissions/[id]/download` kiểm tra phiên làm việc (Session Giảng viên) hoặc Mã biên nhận sở hữu hợp lệ.
2. **Bảo vệ thông tin cá nhân**:
   - Sinh viên tra cứu kết quả bắt buộc phải có đồng thời: **Mã Sinh Viên (MSSV)** và **Mã Biên Nhận (Receipt Code)**.
   - Ngăn chặn hoàn toàn việc sinh viên xem được danh sách bài nộp, điểm số hay tệp tin của người khác.
3. **Mã hóa mật khẩu**:
   - Sử dụng giải thuật băm một chiều `bcryptjs` (salt rounds = 10). Mật khẩu gốc không bao giờ lưu trữ dạng văn bản thuần (plaintext).
