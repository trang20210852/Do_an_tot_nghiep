const db = require("../config/db");

class PhuHuynh {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM PhuHuynh");
        return rows;
    }

    static async create({ hoTen, soDienThoai, email, diaChi, matKhau, idHocSinh }) {
        const [result] = await db.execute("INSERT INTO PhuHuynh (HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh) VALUES (?, ?, ?, ?, ?, ?)", [
            hoTen,
            soDienThoai,
            email,
            diaChi,
            matKhau,
            idHocSinh,
        ]);
        return result.insertId;
    }

    static async update(IDPhuHuynh, { HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh }) {
        const [result] = await db.execute("UPDATE PhuHuynh SET HoTen = ?, SoDienThoai = ?, Email = ?, DiaChi = ?, MatKhau = ?, IDHocSinh = ? WHERE IDPhuHuynh = ?", [
            HoTen,
            SoDienThoai,
            Email,
            DiaChi,
            MatKhau,
            IDHocSinh,
            IDPhuHuynh,
        ]);
        return result.affectedRows;
    }

    static async delete(IDPhuHuynh) {
        const [result] = await db.execute("DELETE FROM PhuHuynh WHERE IDPhuHuynh = ?", [IDPhuHuynh]);
        return result.affectedRows;
    }
}

module.exports = PhuHuynh;
