const db = require("../config/db");

class MonHoc {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM MonHoc");
        return rows;
    }

    static async create({ TenMonHoc, NoiDungMonHoc }) {
        const [result] = await db.execute("INSERT INTO MonHoc (TenMonHoc, NoiDungMonHoc) VALUES (?, ?)", [TenMonHoc, NoiDungMonHoc]);
        return result.insertId;
    }

    static async update(IDMonHoc, { TenMonHoc, NoiDungMonHoc }) {
        const [result] = await db.execute("UPDATE MonHoc SET TenMonHoc = ?, NoiDungMonHoc = ? WHERE IDMonHoc = ?", [TenMonHoc, NoiDungMonHoc, IDMonHoc]);
        return result.affectedRows;
    }

    static async delete(IDMonHoc) {
        const [result] = await db.execute("DELETE FROM MonHoc WHERE IDMonHoc = ?", [IDMonHoc]);
        return result.affectedRows;
    }
}

module.exports = MonHoc;
