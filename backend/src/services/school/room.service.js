const mysql = require("../../config/db");

const PhongHoc = {
    // Thêm phòng học mới
    addPhongHoc: async ({ IDTruong, tenPhong, sucChua, moTa, IDGVCN, IDLopHoc }) => {
        const query = `
            INSERT INTO PhongHoc (IDTruong, tenPhong, sucChua, moTa, IDGVCN, IDLopHoc)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await mysql.execute(query, [IDTruong, tenPhong, sucChua, moTa, IDGVCN, IDLopHoc]);
        return result;
    },

    // Lấy danh sách phòng học theo trường
    getPhongHocByTruong: async (IDTruong) => {
        const query = `
            SELECT * FROM PhongHoc WHERE IDTruong = ?
        `;
        const [rows] = await mysql.execute(query, [IDTruong]);
        return rows;
    },

    // Lấy thông tin chi tiết phòng học
    getPhongHocByID: async (IDPhongHoc) => {
        const query = `
            SELECT * FROM PhongHoc WHERE IDPhongHoc = ?
        `;
        const [rows] = await mysql.execute(query, [IDPhongHoc]);
        return rows.length ? rows[0] : null;
    },
    // Cập nhật thông tin phòng học
    updatePhongHoc: async (IDPhongHoc, { tenPhong, sucChua, moTa, IDGVCN, IDLopHoc, Status }) => {
        const query = `
            UPDATE PhongHoc 
            SET tenPhong = ?, sucChua = ?, moTa = ?, IDGVCN = ?, IDLopHoc = ?, Status = ?
            WHERE IDPhongHoc = ?
        `;
        const [result] = await mysql.execute(query, [tenPhong, sucChua, moTa, IDGVCN, IDLopHoc, Status, IDPhongHoc]);
        return result;
    },
    // Xóa phòng học (cập nhật trạng thái thành 'Ngừng sử dụng')
    deletePhongHoc: async (IDPhongHoc) => {
        const query = `
            UPDATE PhongHoc 
            SET Status = 'Ngừng sử dụng'
            WHERE IDPhongHoc = ?
        `;
        const [result] = await mysql.execute(query, [IDPhongHoc]);
        return result;
    },
};

module.exports = PhongHoc;
