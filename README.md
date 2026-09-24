# 🌕 Banhtrungthu - Thiệp Chúc Trung Thu Người Yêu (Mobile-First) 🏮

Một trang web chúc Tết Trung Thu lãng mạn dành riêng cho người yêu, tối ưu hiển thị 100% trên điện thoại di động với hiệu ứng động chạy liên tục và tự động phát nhạc.

![Demo](images/sample1.jpg)

## ✨ Tính Năng Nổi Bật

- 🌕 **Không gian đêm trăng lãng mạn**: Vầng trăng rằm phát sáng, đom đóm vàng lượn quanh và bầu trời ngàn sao lấp lánh (Canvas 60fps).
- ✍️ **Lời chúc gõ chữ tự động (Typewriter)**: Lời chúc mở đầu xuất hiện nhanh, mượt mà và sâu lắng.
- 🏮 **Đèn Trời Kỷ Niệm (Sky Lantern)**: Các bức ảnh kỷ niệm bay lên như những chiếc đèn trời lung linh với ngọn nến nhấp nháy chân thực.
- 🌌 **Chiều sâu 3 tầng xa - gần**: Đèn trời ở xa nhỏ mờ dịu, đèn ở gần to sáng rực rỡ kèm dây tua rua may mắn đung đưa.
- 🛡️ **Hệ thống phân 3 làn bay độc lập**: Chống va chạm, đèn bay so le thoáng đãng và không bao giờ bị đè lấn lên nhau.
- 🔍 **Xem ảnh phóng to (Lightbox)**: Chạm vào bất kỳ chiếc đèn trời nào (dù ở xa hay gần) để phóng to ngắm nhìn rõ nét.
- 🎵 **Tự động phát nhạc (Smart Autoplay)**: Tự động kích hoạt giai điệu Trung thu lãng mạn ngay khi vào trang, kèm nút đĩa xoay góc màn hình.

## 📁 Cấu Trúc Dự Án

```text
Banhtrungthu/
├── index.html        # Khung giao diện HTML5 chuẩn mobile
├── style.css         # Styling, animation GPU và hiệu ứng đèn trời
├── script.js         # Kịch bản gõ chữ, phân làn bay và autoplay nhạc
├── images/           # Thư mục chứa ảnh kỷ niệm
└── audio/            # File âm thanh nhạc nền
```

## 🛠️ Tùy Chỉnh Lời Chúc & Ảnh (Trong `script.js`)

Chỉ cần mở `script.js` và chỉnh sửa biến `CONFIG` ở ngay đầu tệp:

```javascript
const CONFIG = {
  recipientName: "Bé Yêu Của Anh 💕",
  openingGreeting: "Chúc em một mùa Trung Thu thật ấm áp...",
  photos: [
    { url: "images/sample1.jpg", caption: "Lời nhắn 1", date: "Đêm Rằm Tháng 8" },
    { url: "images/sample2.jpg", caption: "Lời nhắn 2", date: "Hội An Hoài Niệm" }
  ],
  musicUrl: "audio/mid-autumn-love.mp3"
};
```

## 🚀 Kích Hoạt GitHub Pages (Để có link web gửi người yêu)

1. Vào repository **Banhtrungthu** trên GitHub.
2. Chọn **Settings** -> **Pages**.
3. Tại mục **Branch**, chọn `main` (hoặc `master`) và thư mục `/(root)`, sau đó bấm **Save**.
4. Chờ 1 phút, bạn sẽ có đường link trực tiếp dạng: `https://<ten-tai-khoan>.github.io/Banhtrungthu/` để gửi cho người yêu mở xem trên điện thoại!
