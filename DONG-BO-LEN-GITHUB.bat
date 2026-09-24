@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title ĐỒNG BỘ NỘI DUNG VÀ ẢNH LÊN GITHUB
color 0F

echo ===================================================================
echo       ĐANG TỰ ĐỘNG ĐỒNG BỘ ẢNH VÀ NỘI DUNG LÊN GITHUB
echo ===================================================================
echo.

rem 1. TÌM KIẾM CÔNG CỤ GIT TRÊN MÁY TỰ ĐỘNG
set "GIT_CMD="
where.exe git >nul 2>nul
if %errorlevel% equ 0 set "GIT_CMD=git"

if not defined GIT_CMD for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do if exist "%%D\resources\app\git\cmd\git.exe" set "GIT_CMD=%%D\resources\app\git\cmd\git.exe"
if not defined GIT_CMD if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
if not defined GIT_CMD if exist "%ProgramFiles%\Git\cmd\git.exe" set "GIT_CMD=%ProgramFiles%\Git\cmd\git.exe"
if not defined GIT_CMD if exist "%ProgramFiles(x86)%\Git\cmd\git.exe" set "GIT_CMD=%ProgramFiles(x86)%\Git\cmd\git.exe"

if defined GIT_CMD goto :git_ready
echo [LỖI] Không tìm thấy Git hoặc GitHub Desktop trên máy tính!
echo.
echo Vui lòng tải và cài đặt một trong hai phần mềm sau:
echo  - GitHub Desktop [Khuyên dùng, rất dễ dùng]: https://desktop.github.com/
echo  - Git for Windows: https://git-scm.com/
echo.
echo Sau khi cài đặt xong, vui lòng chạy lại file này!
echo ===================================================================
pause
exit /b 1

:git_ready

rem 2. KHỞI TẠO GIT NẾU CHƯA CÓ
if not exist ".git" (
    echo [*] Đang khởi tạo kho Git cục bộ...
    "!GIT_CMD!" init -b main >nul 2>&1
    "!GIT_CMD!" branch -M main >nul 2>&1
)

rem 3. XÁC ĐỊNH KHO GITHUB ĐÍCH
set "PARAM_REPO=%~1"
set "USER_REPO="

rem 3.1 Nhận trực tiếp từ tham số nếu có
if defined PARAM_REPO set "USER_REPO=!PARAM_REPO!"

rem 3.2 Đọc từ file github_repo.txt nếu có
if not defined USER_REPO if exist "github_repo.txt" (
    set /p FILE_REPO=<"github_repo.txt"
    if defined FILE_REPO set "USER_REPO=!FILE_REPO!"
)

rem 3.3 Đọc từ cấu hình remote origin hiện tại
set "CURRENT_REPO="
for /f "delims=" %%u in ('"!GIT_CMD!" remote get-url origin 2^>nul') do set "CURRENT_REPO=%%u"

rem 3.4 Nếu chưa có kho nào, hỏi người dùng
if defined USER_REPO goto :configure_repo
if defined CURRENT_REPO goto :prompt_existing_repo

echo ===================================================================
echo             BẠN CHƯA LIÊN KẾT VỚI KHO GITHUB CỦA BẠN
echo ===================================================================
echo Nhập hoặc dán link GitHub Repository của bạn vào đây:
echo   - Link SSH   : git@github.com:Tai-Khoan/Ten-Kho.git
echo   - Link HTTPS : https://github.com/Tai-Khoan/Ten-Kho.git
echo.
set /p "INPUT_REPO=>> Dán link GitHub của bạn vào đây: "
if not defined INPUT_REPO (
    echo [!] Bạn chưa nhập link GitHub. Hủy bỏ đồng bộ.
    pause
    exit /b 1
)
set "USER_REPO=!INPUT_REPO!"
goto :configure_repo

:prompt_existing_repo
echo ===================================================================
echo Kho GitHub đang được liên kết:
echo    !CURRENT_REPO!
echo ===================================================================
echo Nhấn [Enter] để tiếp tục đẩy dữ liệu lên kho này.
echo Hoặc dán link GitHub mới [SSH hoặc HTTPS] rồi nhấn Enter:
set /p "INPUT_REPO=>> Link mới [Enter để giữ nguyên]: "
if defined INPUT_REPO (
    set "USER_REPO=!INPUT_REPO!"
) else (
    set "USER_REPO=!CURRENT_REPO!"
)

:configure_repo
set "USER_REPO=!USER_REPO: =!"
if defined USER_REPO (
    "!GIT_CMD!" remote remove origin >nul 2>&1
    "!GIT_CMD!" remote add origin "!USER_REPO!"
    set "CURRENT_REPO=!USER_REPO!"
    echo !USER_REPO!> "github_repo.txt"
)

rem 4. THỰC HIỆN COMMIT VÀ PUSH
echo.
echo 1. Đang chuẩn bị các tệp nội dung...
"!GIT_CMD!" branch -M main >nul 2>&1
"!GIT_CMD!" add .

echo 2. Đang tạo commit lưu nội dung mới...
"!GIT_CMD!" commit -m "Cập nhật ảnh và lời chúc Trung Thu mới" >nul 2>&1

echo 3. Đang đẩy dữ liệu lên GitHub (!CURRENT_REPO!)...
"!GIT_CMD!" push -u origin main || git push origin main
if !errorlevel! equ 0 goto :push_success

rem Tự động chuyển SSH sang HTTPS nếu thiếu SSH key
echo !CURRENT_REPO! | findstr /i "git@github.com:" >nul
if !errorlevel! equ 0 (
    echo.
    echo [!] Kết nối SSH gặp lỗi xác thực, đang tự động chuyển sang HTTPS...
    set "TEMP_FB=!CURRENT_REPO:github.com=!"
    set "TEMP_FB=!TEMP_FB:.git=!"
    for /f "tokens=2,3 delims=/:@ " %%a in ("!TEMP_FB!") do (
        set "FALLBACK_HTTPS=https://github.com/%%a/%%b.git"
    )
    "!GIT_CMD!" remote set-url origin "!FALLBACK_HTTPS!"
    "!GIT_CMD!" push -u origin main || git push origin main
    if !errorlevel! equ 0 (
        set "CURRENT_REPO=!FALLBACK_HTTPS!"
        echo !FALLBACK_HTTPS!> "github_repo.txt"
        goto :push_success
    )
)

echo.
echo ===================================================================
echo [LỖI] Đẩy lên GitHub không thành công!
echo.
echo Nguyên nhân có thể là:
echo  - Bạn chưa đăng nhập tài khoản GitHub trên máy [mở GitHub Desktop hoặc đăng nhập Git].
echo  - Link kho GitHub chưa chính xác hoặc bạn không có quyền ghi vào kho này.
echo  - Kho trên GitHub chưa để ở chế độ Public.
echo ===================================================================
pause
exit /b 1

:push_success

rem 5. PHÂN TÍCH TÊN USER VÀ TÊN REPO ĐỂ TẠO LINK GITHUB PAGES
set "TEMP_PARSE=!CURRENT_REPO:github.com=!"
set "TEMP_PARSE=!TEMP_PARSE:.git=!"
for /f "tokens=2,3 delims=/:@ " %%a in ("!TEMP_PARSE!") do (
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
echo HƯỚNG DẪN BẬT GITHUB PAGES [Chỉ cần làm 1 lần đầu tiên]:
echo  1. Mở link cài đặt: https://github.com/!GH_USER!/!GH_REPO!/settings/pages
echo  2. Tại mục "Build and deployment" -^> "Branch":
echo     Chọn branch "main" [hoặc "master"] và thư mục "/(root)" -^> Bấm "Save"
echo  3. Chờ 1-2 phút rồi mở đường link website ở trên trên điện thoại!
echo ===================================================================
echo.
echo Bấm phím bất kỳ để hoàn tất...
pause >nul
