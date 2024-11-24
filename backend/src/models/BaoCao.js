const db = require("../config/db");

class BaoCao {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM BaoCao");
        return rows;
    }

    static async create({ LoaiBaoCao, NgayTao, NhanVienID, NoiDung }) {
        const [result] = await db.execute("INSERT INTO BaoCao (LoaiBaoCao, NgayTao, NhanVienID, NoiDung) VALUES (?, ?, ?, ?)", [LoaiBaoCao, NgayTao, NhanVienID, NoiDung]);
        return result.insertId;
    }

    static async update(IDBaoCao, { LoaiBaoCao, NgayTao, NhanVienID, NoiDung }) {
        const [result] = await db.execute("UPDATE BaoCao SET LoaiBaoCao = ?, NgayTao = ?, NhanVienID = ?, NoiDung = ? WHERE IDBaoCao = ?", [LoaiBaoCao, NgayTao, NhanVienID, NoiDung, IDBaoCao]);
        return result.affectedRows;
    }

    static async delete(IDBaoCao) {
        const [result] = await db.execute("DELETE FROM BaoCao WHERE IDBaoCao = ?", [IDBaoCao]);
        return result.affectedRows;
    }
}

module.exports = BaoCao;
