# 🌕 Banhtrungthu - Thiệp Chúc Trung Thu Tặng Người Yêu (Mobile-First) 🏮

Một trang web chúc Tết Trung Thu lung linh và lãng mạn dành riêng cho người yêu, tối ưu 100% cho màn hình điện thoại (dọc 9:16) với hiệu ứng đèn trời kỷ niệm bay lên theo chiều sâu xa - gần và nhạc nền du dương.

Bất kỳ ai cũng có thể dễ dàng tạo ra một trang web riêng mang tên mình và người yêu để gửi tặng, chỉ mất **3 phút** mà **không cần biết lập trình**!

---

## ✨ Điểm Nổi Bật

- 🌕 **Không gian trăng rằm ấm áp**: Vầng trăng phát sáng, bầu trời ngàn sao lung linh và đom đóm vàng lượn quanh (Canvas 60fps mượt mà).
- ✍️ **Lời chúc gõ chữ tự động (Typewriter)**: Tên người yêu và lời chúc tình cảm xuất hiện từng ký tự sâu lắng.
- 🏮 **Đèn Trời Kỷ Niệm (Sky Lantern)**: Các bức ảnh kỷ niệm bay lên như những chiếc đèn trời lung linh với ánh nến nhấp nháy, vành tre và dây tua rua đỏ may mắn.
- 🌌 **Độ sâu 3 tầng xa - gần**: Đèn bay thẳng đứng tự nhiên, chia 2 luồng Trái - Phải so le, không bao giờ bị đè lấn lên nhau.
- 🔍 **Xem ảnh phóng to (Lightbox)**: Chạm nhẹ vào bất kỳ chiếc đèn trời nào để mở xem ảnh rõ nét kèm lời nhắn gửi.
- 🎵 **Tự động phát nhạc (Smart Autoplay)**: Tự động kích hoạt giai điệu Trung Thu ngọt ngào kèm nút đĩa xoay bật/tắt tiện lợi.
- ⚡ **Tùy chỉnh siêu đơn giản**: Chỉ cần sửa file text `noidung.txt` và chép ảnh vào thư mục `anh/`.

---

## 🚀 Hướng Dẫn Sử Dụng (Dành Cho Mọi Người)

### 👉 Cách 1: Tải Về Máy Tính & Đồng Bộ 1-Click (Khuyên Dùng)

#### Bước 1: Chuẩn bị kho GitHub của bạn
1. Đăng nhập tài khoản [GitHub](https://github.com/) của bạn.
2. Bấm vào nút **"+"** (góc trên bên phải) -> Chọn **New repository**.
3. Đặt tên kho (ví dụ: `Banhtrungthu` hoặc `Tang-Em`), chọn **Public** rồi bấm **Create repository**.
4. Sao chép đường link repository của bạn (dạng: `https://github.com/<tai-khoan>/<ten-kho>.git`).

#### Bước 2: Tải mã nguồn về máy & thay đổi nội dung
1. Tải toàn bộ mã nguồn dự án này về máy tính (bấm nút **Code** -> **Download ZIP** rồi giải nén).
2. **Sửa lời chúc**: Mở file `noidung.txt` và nhập tên người yêu cùng lời chúc của bạn -> Bấm `Ctrl + S` để lưu.
3. **Thêm ảnh**: Mở thư mục `anh/` và chép những bức ảnh kỷ niệm của hai bạn vào đó (chấp nhận mọi định dạng `.jpg`, `.png`, `.webp`...).

#### Bước 3: Đẩy lên GitHub tự động
1. Nhấp đúp chuột vào file **`DONG-BO-LEN-GITHUB.bat`**.
2. Nếu là lần đầu tiên, màn hình sẽ yêu cầu dán link GitHub repository bạn đã tạo ở **Bước 1**. Dán vào và nhấn **Enter**.
3. Chương trình sẽ tự động đồng bộ ảnh, nội dung lên GitHub và hiển thị ngay đường link website của bạn!

---

### 👉 Cách 2: Fork / Dùng Trực Tiếp Trên Trình Duyệt

1. Bấm nút **Fork** (hoặc **Use this template**) ở góc trên bên phải trang repository này để nhân bản về tài khoản của bạn.
2. Chỉnh sửa file `noidung.txt` trực tiếp trên web GitHub.
3. Vào thư mục `anh/`, bấm **Add file** -> **Upload files** để tải ảnh của bạn lên.
4. Bấm **Commit changes** để lưu lại.

---

## 🌐 Kích Hoạt GitHub Pages (Để Có Link Gửi Người Yêu)

Sau khi mã nguồn đã được tải lên kho GitHub của bạn:

1. Mở kho GitHub của bạn trên trình duyệt, chọn thẻ **Settings** (Cài đặt) -> Chọn mục **Pages** ở menu bên trái.
2. Tại mục **Build and deployment** -> **Branch**:
   - Chọn nhánh **`main`** (hoặc `master`).
   - Chọn thư mục **`/(root)`**.
   - Bấm nút **Save**.
3. Đợi khoảng **1 - 2 phút**, GitHub sẽ tạo cho bạn một đường link website trực tiếp:
   ```text
   👉 https://<tai-khoan-cua-ban>.github.io/<ten-kho>/
   ```
4. Gửi đường link này cho người yêu của bạn mở trên điện thoại và tận hưởng bất ngờ! 💖

---

## 📁 Cấu Trúc Thư Mục

```text
Banhtrungthu/
├── noidung.txt              # NƠI SỬA LỜI CHÚC (Tên người yêu, thư chúc, lời nhắn đèn trời)
├── anh/                     # NƠI THẢ ẢNH KỶ NIỆM (Tự động nạp toàn bộ ảnh trong thư mục này)
├── DONG-BO-LEN-GITHUB.bat   # 1-CLICK TỰ ĐỘNG ĐẨY LÊN GITHUB CỦA BẠN
├── audio/                   # Nhạc nền Trung Thu lãng mạn
├── index.html               # Cấu trúc giao diện chuẩn Mobile Viewport
├── style.css                # Hiệu ứng đèn trời, trăng rằm và hoạt họa CSS
└── script.js                # Logic kịch bản gõ chữ, thả đèn lồng & phát nhạc
```

---

## 💡 Mẹo Nhỏ
- Bạn có thể thay đổi bài hát bằng cách chép file nhạc của bạn vào thư mục `audio/mid-autumn-love.mp3`.
- Khi người yêu mở web trên điện thoại, chạm vào màn hình bất kỳ đâu để bài hát tự động phát ngân vang.
- Chạm vào từng chiếc đèn trời đang bay để xem bức ảnh phóng to rõ nét nhất!
