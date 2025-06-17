# Hệ Thống Quản Lý Mầm Non TinyCare

## Giới thiệu

**TinyCare** là hệ thống quản lý trường mầm non hiện đại, hỗ trợ số hóa các nghiệp vụ quản lý trường học, giáo viên, học sinh, phụ huynh, lớp học, phòng học, học phí, thông báo, điểm danh, nhận xét, chuyển trường, xin nghỉ học,...  
Dự án gồm 2 phần: **Backend** (Node.js/Express/MySQL) và **Frontend** (React/TypeScript/TailwindCSS).

---

## Tính năng chính

- Quản lý trường học, lớp học, phòng học, giáo viên, học sinh, phụ huynh
- Đăng ký, đăng nhập, phân quyền (Trường, Cán bộ, Giáo viên, Phụ huynh)
- Quản lý học sinh: nhập học, chuyển trường, xin nghỉ học, điểm danh, nhận xét
- Quản lý học phí, thanh toán học phí qua MoMo
- Gửi/nhận thông báo giữa giáo viên và phụ huynh
- Quản lý tài khoản, đổi mật khẩu, cập nhật thông tin cá nhân
- Giao diện thân thiện, dễ sử dụng trên cả máy tính và thiết bị di động

---

## Cài đặt & Cách chạy

### 1. Yêu cầu

- Node.js >= 16.x
- MySQL >= 8.x
- (Khuyến nghị) Docker để chạy nhanh môi trường


### 3. Cài đặt & chạy Backend

```sh
cd backend
npm install
```

- Tạo file `.env` theo mẫu trong `backend/.env`
- Khởi tạo database MySQL và import file `db.sql` hoặc `db_gr2.sql`
- Chỉnh sửa thông tin kết nối DB trong `.env` cho đúng

**Chạy backend:**
```sh
npm start
```
Mặc định backend chạy ở `http://localhost:3000`

---

### 4. Cài đặt & chạy Frontend

```sh
cd ../frontend
npm install
```

**Chạy frontend:**
```sh
npm run dev
```
Mặc định frontend chạy ở `http://localhost:5173`

---

## Sử dụng

- Truy cập `http://localhost:5173` để sử dụng hệ thống.
- Đăng ký tài khoản theo vai trò (Trường học, Cán bộ, Phụ huynh).
- Quản trị viên có thể duyệt trường học mới tại `/admin`.

---

## Cấu trúc thư mục

```
Project2/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── db.sql
└── README.md
```

---

## Công nghệ sử dụng

- **Backend:** Node.js, Express, MySQL, JWT, Multer, Cloudinary, MoMo API
- **Frontend:** React, TypeScript, TailwindCSS, React Router, React Toastify

---


---

**Sinh viên phát triển:**  
- Hà Quỳnh Trang

**Liên hệ:**  
- Email: mamnonxanh1906@gmail.com
