@echo off
chcp 65001 >nul
title ĐỒNG BỘ NỘI DUNG VÀ ẢNH LÊN GITHUB
echo ===================================================================
echo       ĐANG TỰ ĐỘNG ĐỒNG BỘ ẢNH VÀ NỘI DUNG LÊN GITHUB...
echo ===================================================================
echo.

set GIT_EXE="%LOCALAPPDATA%\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe"
if not exist %GIT_EXE% set GIT_EXE="%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
if not exist %GIT_EXE% set GIT_EXE=git

echo 1. Đang thêm các tệp thay đổi...
%GIT_EXE% add .

echo 2. Đang tạo commit lưu nội dung mới...
%GIT_EXE% commit -m "Cập nhật ảnh và lời chúc Trung Thu mới"

echo 3. Đang đẩy lên GitHub (https://github.com/Thangnd265/Banhtrungthu)...
%GIT_EXE% push origin main || git push origin main

echo.
echo ===================================================================
echo    ĐÃ ĐỒNG BỘ THÀNH CÔNG!
echo.
echo    Trang web sẽ tự động cập nhật trong 1-2 phút tại:
echo    https://thangnd265.github.io/Banhtrungthu/
echo ===================================================================
echo.
echo Bấm phím bất kỳ để đóng cửa sổ này...
pause >nul
