@echo off
chcp 65001 >nul
title Day Ma Nguon Len GitHub

echo =====================================================================
echo    ĐẨY TOÀN BỘ MÃ NGUỒN WEBSITE LÊN GITHUB
echo    Tài khoản GitHub: PHUTNVN (phutm@tnus.edu.vn)
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Cập nhật và đóng gói mã nguồn mới nhất...
git add .
git commit -m "update: cap nhat ma nguon website giang vien" >nul 2>&1

echo [2/3] Kiểm tra remote repository...
git remote -v

echo.
echo [3/3] Đang đẩy lên nhánh main của GitHub...
echo (Nếu xuất hiện cửa sổ yêu cầu đăng nhập GitHub, bạn chỉ cần chọn "Sign in with your browser")
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo   THÀNH CÔNG: Toàn bộ dữ liệu đã được đẩy lên GitHub!
    echo   Xem dự án tại: https://github.com/PHUTNVN/PHUTNVN1984
    echo =====================================================================
) else (
    echo.
    echo =====================================================================
    echo  [HƯỚNG DẪN XỬ LÝ NẾU BÁO LỖI REPOSITORY NOT FOUND]
    echo  1. Bạn vào https://github.com/new
    echo  2. Tạo mới một repository tên là: PHUTNVN1984 (chọn Public hoặc Private)
    echo  3. Chạy lại tệp DAY_LEN_GITHUB.bat này là sẽ thành công ngay!
    echo =====================================================================
)

echo.
pause
