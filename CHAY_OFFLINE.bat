@echo off
chcp 65001 >nul
title Website Giang Vien Trinh Minh Phu - Offline Server

echo =====================================================================
echo    WEBSITE CÁ NHÂN GIẢNG VIÊN TRỊNH MINH PHÚ (KHOA TOÁN - TIN)
echo    Khởi động hệ thống ở chế độ OFFLINE (Không cần Internet)
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Kiểm tra môi trường Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [LỖI] Chưa tìm thấy Node.js trên máy tính!
    echo Vui lòng cài đặt Node.js để chạy hệ thống.
    pause
    exit /b 1
)

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
    )
)

echo [2/3] Kiểm tra cơ sở dữ liệu SQLite và tài nguyên...
if not exist "prisma\dev.db" (
    echo Chưa có cơ sở dữ liệu, đang khởi tạo cơ sở dữ liệu SQLite...
    call npx prisma db push --skip-generate
    call node prisma/seed.js
)

if not exist ".next" (
    echo Chưa có bản build, đang tiến hành biên dịch ứng dụng...
    call npx next build
)

echo [3/3] Khởi động máy chủ web tại http://localhost:3000...
echo.
echo =====================================================================
echo  HỆ THỐNG ĐÃ SẴN SÀNG!
echo.
echo  Trang chủ:       http://localhost:3000
echo  Nộp bài tập:     http://localhost:3000/submissions
echo  Tài liệu số:     http://localhost:3000/resources
echo  Quản trị Admin:  http://localhost:3000/admin
echo  Tài khoản Admin: phutm@tnus.edu.vn / AdminPassword2026@
echo.
echo  Trình duyệt sẽ tự động mở sau 3 giây.
echo  (Nhấn Ctrl + C để dừng máy chủ khi không sử dụng)
echo =====================================================================
echo.

start "" "http://localhost:3000"
call npx next start -p 3000
pause
