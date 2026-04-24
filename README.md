# An Nam Lợi CMS

Node.js app chung source cho frontend SSR và trang admin. Dữ liệu dùng Turso SQLite/libSQL, deploy được trên Vercel.

## Chạy local

```bash
npm install
npm run dev
```

Local mặc định dùng `file:local.db` và tự tạo admin:

- Email: `admin@annamloi.vn`
- Password: `admin123456`

Frontend: `http://localhost:3000`
Admin: `http://localhost:3000/admin`

## Cấu hình Turso trên Vercel

Tạo database Turso rồi thêm Environment Variables trên Vercel:

```env
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
ADMIN_EMAIL=admin@annamloi.vn
ADMIN_PASSWORD=change-this-password
COOKIE_SECRET=change-this-long-random-secret
PUBLIC_SITE_URL=https://your-domain.vercel.app
```

Khi request đầu tiên chạy, app sẽ tự tạo schema, seed settings, seed 3 dự án mẫu, FAQ và tài khoản admin nếu database chưa có admin.

## Admin quản lý

- SEO metadata: title, description, keywords, OG image, canonical URL.
- Hero: eyebrow, title, mô tả, ảnh.
- Công ty/liên hệ/footer.
- Nội dung section: nhu cầu, rủi ro, quy trình và JSON render danh sách/card.
- Dự án: trạng thái còn mở/đã chốt, giá thuê, thời hạn thuê, tăng giá, upload ảnh, gallery, note.
- FAQ.
- Lead gửi từ frontend.

Ảnh upload trong admin được lưu vào `public/uploads/` khi chạy local hoặc self-host. Nếu deploy Vercel serverless và cần upload bền vững sau mỗi lần deploy, nên chuyển phần lưu file sang storage ngoài như Vercel Blob hoặc S3.

## Deploy Vercel

Repo dùng `api/index.js` làm serverless entry và `vercel.json` rewrite toàn bộ route về Node app. Static assets nằm trong `public/`.
