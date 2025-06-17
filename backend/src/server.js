const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { json } = require("body-parser");
const axios = require("axios");
dotenv.config(); // Load biến môi trường từ .env
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mysql = require("./config/db");
const app = express(); // Khởi tạo ứng dụng Express
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json()); // Middleware để parse JSON
app.use(cors()); // Middleware để xử lý CORS
app.use(express.urlencoded({ extended: true })); // Middleware để parse URL-encoded dữ liệu
// Middleware để parse dữ liệu từ form
// Định tuyến API

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/truonghoc", require("./routes/school/school.routes"));
app.use("/api/class", require("./routes/school/class.routes"));
app.use("/api/student", require("./routes/student.routes"));
app.use("/api/room", require("./routes/school/room.routes"));
app.use("/api/giaovien", require("./routes/teacher.routes"));
app.use("/api/phuhuynh", require("./routes/parent.routes"));
app.use("/api/payment", require("./routes/payment.routes")); // Add this line
async function createDefaultAdmin() {
    const [rows] = await mysql.execute("SELECT * FROM NhanVien WHERE email = 'admin@system.com'");
    if (rows.length === 0) {
        const hash = await bcrypt.hash("1234567", 10);
        await mysql.execute("INSERT INTO NhanVien (hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau, role, Status, Avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            "Admin",
            "Nam",
            "1990-01-01",
            "Hệ thống",
            "0123456789",
            "admin@system.com",
            hash,
            "Admin",
            "Hoạt động",
            "data:image/png;base64,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",
        ]);
        console.log("✅ Đã tạo tài khoản admin mặc định!");
    }
}
createDefaultAdmin();

// Lắng nghe server
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
