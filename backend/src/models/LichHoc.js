const db = require("../config/db");

class LichHoc {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM LichHoc");
        return rows;
    }

    static async create({ IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc }) {
        const [result] = await db.execute("INSERT INTO LichHoc (IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc) VALUES (?, ?, ?, ?, ?)", [
            IDLopHoc,
            IDMonHoc,
            NgayHoc,
            ThoiGianBatDau,
            ThoiGianKetThuc,
        ]);
        return result.insertId;
    }

    static async update(IDLichHoc, { IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc }) {
        const [result] = await db.execute("UPDATE LichHoc SET IDLopHoc = ?, IDMonHoc = ?, NgayHoc = ?, ThoiGianBatDau = ?, ThoiGianKetThuc = ? WHERE IDLichHoc = ?", [
            IDLopHoc,
            IDMonHoc,
            NgayHoc,
            ThoiGianBatDau,
            ThoiGianKetThuc,
            IDLichHoc,
        ]);
        return result.affectedRows;
    }

    static async delete(IDLichHoc) {
        const [result] = await db.execute("DELETE FROM LichHoc WHERE IDLichHoc = ?", [IDLichHoc]);
        return result.affectedRows;
    }
}

module.exports = LichHoc;
