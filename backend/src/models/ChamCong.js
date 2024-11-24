const db = require("../config/db");

class ChamCong {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM ChamCong");
        return rows;
    }

    static async create({ IDNhanVien, NgayLamViec, TrangThai }) {
        const [result] = await db.execute("INSERT INTO ChamCong (IDNhanVien, NgayLamViec, TrangThai) VALUES (?, ?, ?)", [IDNhanVien, NgayLamViec, TrangThai]);
        return result.insertId;
    }

    static async update(IDChamCong, { IDNhanVien, NgayLamViec, TrangThai }) {
        const [result] = await db.execute("UPDATE ChamCong SET IDNhanVien = ?, NgayLamViec = ?, TrangThai = ? WHERE IDChamCong = ?", [IDNhanVien, NgayLamViec, TrangThai, IDChamCong]);
        return result.affectedRows;
    }

    static async delete(IDChamCong) {
        const [result] = await db.execute("DELETE FROM ChamCong WHERE IDChamCong = ?", [IDChamCong]);
        return result.affectedRows;
    }
}

module.exports = ChamCong;
