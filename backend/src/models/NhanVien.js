const db = require("../config/db");

class NhanVien {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM NhanVien");
        return rows;
    }

    static async create({ HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau }) {
        const [result] = await db.execute("INSERT INTO NhanVien (HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            HoTen,
            ChucVu,
            NgaySinh,
            DiaChi,
            SoDienThoai,
            Email,
            MatKhau,
        ]);
        return result.insertId;
    }

    static async update(IDNhanVien, { HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau }) {
        const [result] = await db.execute("UPDATE NhanVien SET HoTen = ?, ChucVu = ?, NgaySinh = ?, DiaChi = ?, SoDienThoai = ?, Email = ?, MatKhau = ? WHERE IDNhanVien = ?", [
            HoTen,
            ChucVu,
            NgaySinh,
            DiaChi,
            SoDienThoai,
            Email,
            MatKhau,
            IDNhanVien,
        ]);
        return result.affectedRows;
    }

    static async delete(IDNhanVien) {
        const [result] = await db.execute("DELETE FROM NhanVien WHERE IDNhanVien = ?", [IDNhanVien]);
        return result.affectedRows;
    }
}

module.exports = NhanVien;
