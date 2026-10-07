@echo off
chcp 65001 >nul
title Dung Server Website Trinh Minh Phu

echo =====================================================================
echo    ĐANG DỪNG MÁY CHỦ LOCALHOST:3000...
echo =====================================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Đang tắt tiến trình PID: %%a...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Đã dừng toàn bộ dịch vụ trên cổng 3000 thành công!
echo.
pause
