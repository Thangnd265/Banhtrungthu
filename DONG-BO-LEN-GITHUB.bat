@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title ĐỒNG BỘ NỘI DUNG VÀ ẢNH LÊN GITHUB
color 0F

echo ===================================================================
echo       ĐANG TỰ ĐỘNG ĐỒNG BỘ ẢNH VÀ NỘI DUNG LÊN GITHUB
echo ===================================================================
echo.

:: 1. TÌM KIẾM CÔNG CỤ GIT TRÊN MÁY TỰ ĐỘNG
set "GIT_CMD="
where.exe git >nul 2>nul
if %errorlevel% equ 0 set "GIT_CMD=git"

if not defined GIT_CMD (
    for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
        if exist "%%D\resources\app\git\cmd\git.exe" set "GIT_CMD=%%D\resources\app\git\cmd\git.exe"
    )
)
if not defined GIT_CMD (
    if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
)
if not defined GIT_CMD (
    if exist "%ProgramFiles%\Git\cmd\git.exe" set "GIT_CMD=%ProgramFiles%\Git\cmd\git.exe"
)
if not defined GIT_CMD (
    if exist "%ProgramFiles(x86)%\Git\cmd\git.exe" set "GIT_CMD=%ProgramFiles(x86)%\Git\cmd\git.exe"
)

if not defined GIT_CMD (
    echo [LỖI] Không tìm thấy Git hoặc GitHub Desktop trên máy tính!
    echo.
    echo Vui lòng tải và cài đặt một trong hai phần mềm sau:
    echo  - GitHub Desktop (Khuyên dùng, rất dễ dùng): https://desktop.github.com/
    echo  - Git for Windows: https://git-scm.com/
    echo.
    echo Sau khi cài đặt xong, vui lòng chạy lại file này!
    echo ===================================================================
    pause
    exit /b 1
)

:: 2. KHỞI TẠO GIT NẾU CHƯA CÓ
if not exist ".git" (
    echo [*] Đang khởi tạo kho Git cục bộ...
    "!GIT_CMD!" init -b main >nul 2>&1
    "!GIT_CMD!" branch -M main >nul 2>&1
)

:: 3. KIỂM TRA VÀ CẤU HÌNH KHO GITHUB CỦA NGƯỜI DÙNG
set "CURRENT_REPO="
for /f "delims=" %%u in ('"!GIT_CMD!" remote get-url origin 2^>nul') do set "CURRENT_REPO=%%u"

if not defined CURRENT_REPO (
    echo ===================================================================
    echo             BẠN CHƯA LIÊN KẾT VỚI KHO GITHUB CỦA BẠN
    echo ===================================================================
    echo Để tạo web riêng gửi người yêu, bạn cần 1 repository trên GitHub của mình:
    echo   1. Đăng nhập https://github.com và bấm nút "+" -^> "New repository"
    echo   2. Đặt tên kho (ví dụ: Banhtrungthu hoặc Tang-Em), chọn Public
    echo   3. Bấm "Create repository" và sao chép đường link kho của bạn
    echo      (Dạng: https://github.com/ten-tai-khoan/ten-kho.git)
    echo.
    set /p "USER_REPO=>> Dán link GitHub repository của bạn vào đây: "
    if defined USER_REPO (
        "!GIT_CMD!" remote remove origin >nul 2>&1
        "!GIT_CMD!" remote add origin "!USER_REPO!"
        set "CURRENT_REPO=!USER_REPO!"
    ) else (
        echo [!] Bạn chưa nhập link GitHub. Hủy bỏ đồng bộ.
        pause
        exit /b 1
    )
) else (
    echo !CURRENT_REPO! | findstr /i "Thangnd265/Banhtrungthu" >nul
    if !errorlevel! equ 0 (
        echo ===================================================================
        echo   KHO HIỆN TẠI ĐANG LÀ KHO MẪU CỦA TÁC GIẢ (Thangnd265/Banhtrungthu)
        echo ===================================================================
        echo Để trang web hiển thị trên tài khoản GitHub của chính bạn:
        echo   1. Tạo 1 repo mới trên tài khoản GitHub của bạn (hoặc Fork về)
        echo   2. Dán link repo của bạn vào đây (Ví dụ: https://github.com/ban/Banhtrungthu.git)
        echo   (Nếu chính bạn là tác giả Thangnd265, chỉ cần nhấn Enter để tiếp tục)
        echo.
        set /p "USER_REPO=>> Link GitHub của bạn [Enter nếu giữ nguyên]: "
        if defined USER_REPO (
            "!GIT_CMD!" remote set-url origin "!USER_REPO!"
            set "CURRENT_REPO=!USER_REPO!"
        )
    ) else (
        echo Kho GitHub đích đang kết nối:
        echo    !CURRENT_REPO!
        echo.
        echo Nhấn [Enter] để tiếp tục đẩy dữ liệu lên kho này.
        echo (Hoặc gõ 'doi' rồi nhấn Enter nếu muốn đổi sang link kho GitHub khác)
        set /p "USER_CHOICE=>> Lựa chọn [Mặc định: Enter]: "
        if /i "!USER_CHOICE!"=="doi" (
            set /p "USER_REPO=>> Nhập link GitHub mới của bạn: "
            if defined USER_REPO (
                "!GIT_CMD!" remote set-url origin "!USER_REPO!"
                set "CURRENT_REPO=!USER_REPO!"
            )
        )
    )
)

:: 4. THỰC HIỆN COMMIT VÀ PUSH
echo.
echo 1. Đang thêm các tệp thay đổi (lời chúc, hình ảnh)...
"!GIT_CMD!" branch -M main >nul 2>&1
"!GIT_CMD!" add .

echo 2. Đang tạo commit lưu nội dung mới...
"!GIT_CMD!" commit -m "Cập nhật ảnh và lời chúc Trung Thu mới" >nul 2>&1

echo 3. Đang đẩy lên GitHub (!CURRENT_REPO!)...
"!GIT_CMD!" push -u origin main || git push origin main
if !errorlevel! neq 0 (
    echo.
    echo ===================================================================
    echo [LỖI] Đẩy lên GitHub không thành công!
    echo.
    echo Nguyên nhân có thể là:
    echo  - Bạn chưa đăng nhập tài khoản GitHub trên máy (hãy mở GitHub Desktop đăng nhập).
    echo  - Link kho GitHub chưa chính xác hoặc bạn không có quyền ghi.
    echo  - Kho trên GitHub chưa để ở chế độ Public.
    echo ===================================================================
    pause
    exit /b 1
)

:: 5. PHÂN TÍCH TÊN USER VÀ TÊN REPO ĐỂ TẠO LINK GITHUB PAGES
set "CLEAN_URL=!CURRENT_REPO:.git=!"
set "CLEAN_URL=!CLEAN_URL:https://github.com/=!"
set "CLEAN_URL=!CLEAN_URL:http://github.com/=!"
set "CLEAN_URL=!CLEAN_URL:git@github.com:=!"
if "!CLEAN_URL:~-1!"=="/" set "CLEAN_URL=!CLEAN_URL:~0,-1!"

for /f "tokens=1,2 delims=/" %%a in ("!CLEAN_URL!") do (
    set "GH_USER=%%a"
    set "GH_REPO=%%b"
)

echo.
echo ===================================================================
echo               ĐÃ ĐỒNG BỘ THÀNH CÔNG LÊN GITHUB!
echo ===================================================================
echo  - Kho GitHub     : https://github.com/!GH_USER!/!GH_REPO!
echo  - Cài đặt Pages  : https://github.com/!GH_USER!/!GH_REPO!/settings/pages
echo.
echo  👉 ĐƯỜNG LINK WEBSITE CỦA BẠN:
echo     https://!GH_USER!.github.io/!GH_REPO!/
echo.
echo ===================================================================
echo HƯỚNG DẪN BẬT GITHUB PAGES (Chỉ cần làm 1 lần đầu tiên):
echo  1. Mở link cài đặt: https://github.com/!GH_USER!/!GH_REPO!/settings/pages
echo  2. Tại mục "Build and deployment" -^> "Branch":
echo     Chọn branch "main" (hoặc "master") và thư mục "/(root)" -^> Bấm "Save"
echo  3. Chờ 1-2 phút rồi mở đường link website ở trên trên điện thoại!
echo ===================================================================
echo.
echo Bấm phím bất kỳ để hoàn tất...
pause >nul
