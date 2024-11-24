const db = require("../config/db");

class ThongBaoPhuHuynh {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM ThongBaoPhuHuynh");
        return rows;
    }

    static async create({ IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID }) {
        const [result] = await db.execute("INSERT INTO ThongBaoPhuHuynh (IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID) VALUES (?, ?, ?, ?, ?)", [
            IDHocSinh,
            LoaiThongBao,
            NoiDung,
            NgayGui,
            GiaoVienID,
        ]);
        return result.insertId;
    }

    static async update(IDThongBao, { IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID }) {
        const [result] = await db.execute("UPDATE ThongBaoPhuHuynh SET IDHocSinh = ?, LoaiThongBao = ?, NoiDung = ?, NgayGui = ?, GiaoVienID = ? WHERE IDThongBao = ?", [
            IDHocSinh,
            LoaiThongBao,
            NoiDung,
            NgayGui,
            GiaoVienID,
            IDThongBao,
        ]);
        return result.affectedRows;
    }

    static async delete(IDThongBao) {
        const [result] = await db.execute("DELETE FROM ThongBaoPhuHuynh WHERE IDThongBao = ?", [IDThongBao]);
        return result.affectedRows;
    }
}

module.exports = ThongBaoPhuHuynh;
