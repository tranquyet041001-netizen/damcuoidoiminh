# Website Thiệp Cưới Phong Cách Việt Cổ

Một website thiệp cưới trực tuyến one-page trang nhã, ấm cúng và thuần Việt, được phát triển bằng **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion** và **Lucide Icons**.

Thiết kế lấy cảm hứng từ mỹ cảm truyền thống Việt Nam: nền **giấy dó**, sắc **chàm đậm**, **đỏ son trầm**, **nâu mực**, kết hợp họa tiết **trống đồng Đông Sơn**, **chim Lạc** và **hoa sen** tối giản.

---

## 🌸 Tính Năng Nổi Bật

1. **Màn hình mở thiệp tương tác (Interactive Hero)**:
   - Mô phỏng phong bao thiệp sáp son truyền thống.
   - Nút *"Mở Thiệp Cưới"* mở ra toàn bộ nội dung thiệp kèm hiệu ứng pháo giấy nhẹ nhàng.
2. **Lời ngỏ gia đình & dâu rể**:
   - Giới thiệu song thân phụ mẫu hai họ (Nhà Trai - Nhà Gái) theo gia phong truyền thống.
   - Bức tâm thư tri ân chân thành.
3. **Chuyện mình (Love Story Timeline)**:
   - Dòng thời gian 4 cột mốc quan trọng (Lần đầu gặp, Hẹn hò, Cầu hôn, Ngày chung đôi).
   - Thiết kế tối ưu theo trục dọc trên màn hình điện thoại.
4. **Thông tin Lễ Cưới & Tiệc Cưới**:
   - Thẻ riêng biệt cho Lễ Thành Hôn và Tiệc Mừng Hạnh Phúc.
   - Nút **"Chỉ đường"** mở thẳng Google Maps.
   - Nút **"Thêm vào lịch"** tự động tạo và tải file `.ics` tương thích Apple Calendar, Google Calendar, Outlook.
5. **Đồng hồ đếm ngược (Countdown)**:
   - Đếm ngược thời gian thực (Ngày, Giờ, Phút, Giây) phong cách thẻ bài giấy dó.
6. **Xác nhận tham dự (RSVP Form)**:
   - Form xác nhận tiện lợi: Khách của ai, có tham dự hay không, số người đi cùng, ghi chú ăn uống.
   - Kiểm tra dữ liệu (validation), lưu vào `/api/rsvp` và phản hồi trạng thái rõ ràng.
7. **Album ảnh cưới & Lightbox**:
   - Lưới ảnh bố cục linh hoạt, hỗ trợ phóng to toàn màn hình, chuyển ảnh trước/sau và hỗ trợ phím mũi tên/phím ESC.
8. **Sổ lưu bút trực tuyến (Wish Book)**:
   - Khách có thể đọc các lời chúc của bạn bè và trực tiếp gửi lời chúc mới ngay trên trang.
9. **Hộp mừng cưới tế nhị (Gift Section)**:
   - Tab riêng cho Chú Rể và Cô Dâu với đầy đủ tên ngân hàng, số tài khoản, tên chủ tài khoản và mã QR VietQR.
   - Nút **"Sao chép số tài khoản"** 1-chạm kèm thông báo toast.
10. **Trợ năng & Trải nghiệm (UX/A11y)**:
    - Nhạc nền **mặc định tắt**, chỉ phát khi người dùng chủ động bấm nút bật nhạc.
    - Thanh điều hướng nổi: Bật/tắt nhạc, chia sẻ thiệp, nút cuộn nhanh tới form RSVP, nút cuộn lên đầu trang.
    - Hỗ trợ `prefers-reduced-motion` và tối ưu cỡ chữ, độ tương phản.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18 trở lên.
- **npm** hoặc **yarn** / **pnpm**.

### 2. Cài đặt các gói phụ thuộc
```bash
cd wedding-invitation
npm install
```

### 3. Khởi động môi trường phát triển (Dev)
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Kiểm tra bản build sản xuất
```bash
npm run build
npm run start
```

---

## 📝 Hướng Dẫn Thay Đổi Dữ Liệu Thiệp Cưới

Toàn bộ thông tin được gom về duy nhất một file cấu hình: `data/wedding.ts`. Bạn chỉ cần mở file này và chỉnh sửa:

### 1. Thông tin cô dâu, chú rể & phụ mẫu
```typescript
export const weddingData = {
  groom: {
    fullName: "Trần Quang Minh",
    shortName: "Quang Minh",
    parents: "Quý nam của Ông Trần Quốc Toàn & Bà Phạm Thị Lan",
    avatarUrl: "...",
  },
  bride: {
    fullName: "Nguyễn Thục An",
    shortName: "Thục An",
    parents: "Ái nữ của Ông Nguyễn Văn Nam & Bà Lê Thị Mai",
    avatarUrl: "...",
  },
  // Ngày cưới (chuẩn ISO 8601 dùng cho bộ đếm ngược)
  weddingDate: "2027-01-24T10:30:00+07:00",
  weddingDateFormatted: "Chủ Nhật, 24 Tháng 01 Năm 2027",
  lunarDateFormatted: "Nhằm ngày 17 tháng Chạp năm Bính Ngọ",
  // ...
};
```

### 2. Sự kiện cưới & địa điểm (Lễ & Tiệc)
Cập nhật thời gian, địa chỉ và đường dẫn Google Maps trong mảng `events`:
```typescript
events: [
  {
    id: "ceremony",
    title: "Lễ Thành Hôn",
    date: "Chủ Nhật, 24 Tháng 01 Năm 2027",
    isoDate: "2027-01-24T09:30:00+07:00",
    time: "09:30",
    venue: "Tư gia Nhà Trai",
    address: "Số 68 Đường Tràng Thi, Hà Nội",
    mapUrl: "https://maps.google.com/?q=...",
  },
  // ...
]
```

### 3. Tài khoản ngân hàng & Mã QR
Dự án tích hợp chuẩn tạo mã QR tự động của **VietQR** hoặc bạn có thể thay bằng ảnh chụp mã QR riêng của bạn:
```typescript
bankAccounts: [
  {
    ownerType: "groom",
    label: "Mừng Cưới Chú Rể",
    bankName: "Ngân hàng Ngoại thương (Vietcombank)",
    accountNumber: "1012345678",
    accountHolder: "TRAN QUANG MINH",
    qrImageUrl: "https://api.vietqr.io/image/970436-1012345678-qMvjUqR.jpg?accountName=TRAN%20QUANG%20MINH&amount=0",
  },
  // ...
]
```

### 4. Thay đổi hình ảnh & Nhạc nền
- Thêm ảnh vào thư mục `public/images/` hoặc sử dụng đường dẫn ảnh trực tuyến (lưu ý khai báo domain trong `next.config.ts` nếu dùng host bên ngoài).
- Thêm bài hát yêu thích định dạng `.mp3` vào thư mục `public/audio/wedding-song.mp3` và cập nhật `musicUrl: "/audio/wedding-song.mp3"` trong `data/wedding.ts`.

---

## 🗄️ Tích Hợp Cơ Sở Dữ Liệu Thật (Supabase / Google Sheets)

Mặc định, các endpoint `/api/rsvp` và `/api/wishes` hoạt động ở dạng mock trong bộ nhớ nhằm phục vụ xem trước tức thì. Để lưu dữ liệu thực tế vào CSDL khi khách gửi:

### Cách 1: Sử dụng Supabase
1. Cài đặt SDK: `npm install @supabase/supabase-js`
2. Tạo 2 bảng `rsvps` và `wishes` trên Supabase Dashboard.
3. Trong file `app/api/rsvp/route.ts` và `app/api/wishes/route.ts`, thay thế thao tác `store.push()` bằng lệnh `supabase.from('rsvps').insert(...)`.

### Cách 2: Gửi về Google Sheets qua Apps Script hoặc SheetDB
Bạn có thể trỏ fetch trong form hoặc API route tới webhook Google Apps Script để nhận danh sách khách RSVP trực tiếp về bảng tính Google Sheets của bạn một cách tiện lợi nhất.

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Thiệp cưới phong cách Việt Cổ"
   git remote add origin https://github.com/your-username/wedding-invitation.git
   git push -u origin main
   ```
2. **Triển khai trên Vercel**:
   - Đăng nhập vào [Vercel](https://vercel.com).
   - Bấm **Add New** > **Project** và chọn repository GitHub vừa tạo.
   - Giữ nguyên cấu hình mặc định (Framework Preset: Next.js) và nhấn **Deploy**.
3. **Gắn tên miền riêng (ví dụ: `an-minh.vn`)**:
   - Vào mục **Settings** > **Domains** trên Vercel project.
   - Điền tên miền của bạn và cấu hình bản ghi DNS (CNAME hoặc A record) theo hướng dẫn của Vercel.

---

Chúc bạn có một ngày trọng đại thật viên mãn và ngập tràn hạnh phúc!
