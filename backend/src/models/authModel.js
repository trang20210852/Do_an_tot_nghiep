const mysql = require("../config/db");
const bcrypt = require("bcryptjs");

// 📌 Hàm kiểm tra tài khoản có tồn tại hay không (dùng cho đăng nhập)
const findUserByEmailOrPhone = (emailOrPhone, role) => {
    let table = "";
    if (role === "Cán Bộ") table = "NhanVien";
    else if (role === "Phụ Huynh") table = "PhuHuynh";
    else return Promise.reject("Vai trò không hợp lệ");

    const sql = `SELECT * FROM ${table} WHERE email = ? OR SDT = ? LIMIT 1`;
    return mysql.execute(sql, [emailOrPhone, emailOrPhone]);
};

const findTruongByCanBo = async (IDNhanVien) => {
    const sql = "SELECT IDTruong FROM TruongHoc_NhanVien WHERE IDNhanVien = ?";
    return await mysql.execute(sql, [IDNhanVien]);
};

// 📌 Hàm đăng ký trường học và tạo hiệu trưởng
const registerTruongHoc = async ({ tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap }) => {
    const connection = await mysql.getConnection();
    await connection.beginTransaction(); // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu

    try {
        // 1️⃣. Chèn trường học vào bảng TruongHoc
        const sqlTruong = `
            INSERT INTO TruongHoc (tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await connection.execute(sqlTruong, [tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap]);
        const IDTruong = result.insertId;

        // 2️⃣. Tạo mật khẩu ngẫu nhiên cho Hiệu trưởng
        const matKhau = Math.random().toString(36).slice(-8); // Mật khẩu ngẫu nhiên 8 ký tự

        const hashedPassword = await bcrypt.hash(matKhau, 10);

        // 3️⃣. Thêm Hiệu trưởng vào bảng Nhân Viên
        const sqlNhanVien = `
            INSERT INTO NhanVien (hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const [resultNV] = await connection.execute(sqlNhanVien, ["Hiệu trưởng", "Nam", "1970-01-01", diaChi, SDT, email_hieutruong, hashedPassword]);
        const IDNhanVien = resultNV.insertId;

        // 4️⃣. Gán Hiệu trưởng vào bảng TruongHoc_NhanVien
        const sqlTruongNhanVien = `
            INSERT INTO TruongHoc_NhanVien (IDTruong, IDNhanVien, chucVu, ngayVaoLam, duyet) 
            VALUES (?, ?, 'Hiệu trưởng', CURDATE(), true);
        `;
        await connection.execute(sqlTruongNhanVien, [IDTruong, IDNhanVien]);

        await connection.commit(); // Xác nhận transaction
        connection.release(); // Giải phóng kết nối

        return { IDTruong, matKhau, email_hieutruong };
    } catch (error) {
        await connection.rollback(); // Hoàn tác nếu có lỗi
        connection.release();
        throw error;
    }
};

// 📌 Hàm đăng ký cán bộ
const registerCanBo = ({ hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, IDTruong, matKhau }) => {
    const sqlNhanVien = `INSERT INTO NhanVien (hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    return mysql.execute(sqlNhanVien, [hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau]).then(([result]) => {
        const IDNhanVien = result.insertId;
        const sqlTruongHocNhanVien = `INSERT INTO TruongHoc_NhanVien (IDTruong, IDNhanVien, chucVu, ngayVaoLam, duyet) VALUES (?, ?, 'Chưa phân', CURDATE(), false)`;
        return mysql.execute(sqlTruongHocNhanVien, [IDTruong, IDNhanVien]);
    });
};

// 📌 Hàm đăng ký phụ huynh
const registerPhuHuynh = ({ hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau }) => {
    const sql = `INSERT INTO PhuHuynh (hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return mysql.execute(sql, [hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau]);
};

// 📌 Hàm đăng xuất (Có thể lưu token vào DB nếu cần)
const logoutUser = (userId, role) => {
    return Promise.resolve({ message: "Đăng xuất thành công!" });
};

module.exports = {
    findUserByEmailOrPhone,
    findTruongByCanBo,
    registerTruongHoc,
    registerCanBo,
    registerPhuHuynh,
    logoutUser,
};
