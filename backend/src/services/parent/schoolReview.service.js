const mysql = require("../../config/db");

const DanhGiaTruong = {
    // Thêm đánh giá
    addDanhGia: async (IDPhuHuynh, IDTruong, rating, comment) => {
        const query = `
            INSERT INTO DanhGiaTruong (IDPhuHuynh, IDTruong, rating, comment)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await mysql.execute(query, [IDPhuHuynh, IDTruong, rating, comment]);
        return result;
    },

    // Lấy danh sách đánh giá của một trường
    getDanhGiaByTruong: async (IDTruong) => {
        const query = `
            SELECT d.*, p.hoTen AS tenPhuHuynh
            FROM DanhGiaTruong d
            JOIN PhuHuynh p ON d.IDPhuHuynh = p.IDPhuHuynh
            WHERE d.IDTruong = ?
        `;
        const [rows] = await mysql.execute(query, [IDTruong]);
        return rows;
    },

    // Tính trung bình rating của một trường
    getAverageRating: async (IDTruong) => {
        const query = `
            SELECT AVG(rating) AS averageRating
            FROM DanhGiaTruong
            WHERE IDTruong = ?
        `;
        const [rows] = await mysql.execute(query, [IDTruong]);
        return rows[0].averageRating;
    },
};

module.exports = DanhGiaTruong;
