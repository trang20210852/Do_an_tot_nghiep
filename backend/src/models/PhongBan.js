const db = require("../config/db");

class PhongBan {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM PhongBan");
        return rows;
    }

    static async create({ TenPhongBan, VaiTro }) {
        const [result] = await db.execute("INSERT INTO PhongBan (TenPhongBan, VaiTro) VALUES (?, ?)", [TenPhongBan, VaiTro]);
        return result.insertId;
    }

    static async update(IDPhongBan, { TenPhongBan, VaiTro }) {
        const [result] = await db.execute("UPDATE PhongBan SET TenPhongBan = ?, VaiTro = ? WHERE IDPhongBan = ?", [TenPhongBan, VaiTro, IDPhongBan]);
        return result.affectedRows;
    }

    static async delete(IDPhongBan) {
        const [result] = await db.execute("DELETE FROM PhongBan WHERE IDPhongBan = ?", [IDPhongBan]);
        return result.affectedRows;
    }
}

module.exports = PhongBan;
