const db = require("../config/db");

class LopHoc {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM LopHoc");
        return rows;
    }

    static async create({ TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh }) {
        const [result] = await db.execute("INSERT INTO LopHoc (TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh) VALUES (?, ?, ?, ?)", [TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh]);
        return result.insertId;
    }

    static async update(IDLopHoc, { TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh }) {
        const [result] = await db.execute("UPDATE LopHoc SET TenLop = ?, IDGiaoVien = ?, DoTuoi = ?, SoLuongHocSinh = ? WHERE IDLopHoc = ?", [TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh, IDLopHoc]);
        return result.affectedRows;
    }

    static async delete(IDLopHoc) {
        const [result] = await db.execute("DELETE FROM LopHoc WHERE IDLopHoc = ?", [IDLopHoc]);
        return result.affectedRows;
    }
}

module.exports = LopHoc;
