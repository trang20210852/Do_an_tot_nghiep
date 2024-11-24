const db = require("../config/db");

class DanhGia {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM DanhGia");
        return rows;
    }

    static async create({ IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia }) {
        const [result] = await db.execute("INSERT INTO DanhGia (IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia) VALUES (?, ?, ?, ?, ?, ?)", [
            IDPhuHuynh,
            IDGiaoVien,
            IDHocSinh,
            MucDoHaiLong,
            NhanXet,
            NgayDanhGia,
        ]);
        return result.insertId;
    }

    static async update(IDDanhGia, { IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia }) {
        const [result] = await db.execute("UPDATE DanhGia SET IDPhuHuynh = ?, IDGiaoVien = ?, IDHocSinh = ?, MucDoHaiLong = ?, NhanXet = ?, NgayDanhGia = ? WHERE IDDanhGia = ?", [
            IDPhuHuynh,
            IDGiaoVien,
            IDHocSinh,
            MucDoHaiLong,
            NhanXet,
            NgayDanhGia,
            IDDanhGia,
        ]);
        return result.affectedRows;
    }

    static async delete(IDDanhGia) {
        const [result] = await db.execute("DELETE FROM DanhGia WHERE IDDanhGia = ?", [IDDanhGia]);
        return result.affectedRows;
    }
}

module.exports = DanhGia;
