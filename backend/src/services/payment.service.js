// const mysql = require("../config/db");

// // Lấy danh sách học phí chưa thanh toán của phụ huynh
// const getUnpaidTuitionByParent = async (idPhuHuynh) => {
//     const query = `
//         SELECT hp.IDHocPhi, hp.IDHocSinh, hs.hoTen AS tenHocSinh, hp.thang, hp.nam,
//                hp.soTien, hp.trangThai, hp.hanCuoi, hp.ghiChu
//         FROM HocPhi hp
//         JOIN HocSinh hs ON hp.IDHocSinh = hs.IDHocSinh
//         JOIN PhuHuynh_HocSinh phhs ON hs.IDHocSinh = phhs.IDHocSinh
//         WHERE phhs.IDPhuHuynh = ? AND hp.trangThai = 'Chưa thanh toán'
//         ORDER BY hp.hanCuoi ASC
//     `;
//     const [rows] = await mysql.execute(query, [idPhuHuynh]);
//     return rows;
// };

// // Tạo hóa đơn học phí

// const createTuitionBill = async ({ IDHocSinh, thang, nam, soTien, hanCuoi, ghiChu }) => {
//     const query = `
//         INSERT INTO HocPhi (IDHocSinh, thang, nam, soTien, trangThai, hanCuoi, ghiChu)
//         VALUES (?, ?, ?, ?, 'Chưa thanh toán', ?, ?)
//     `;
//     const [result] = await mysql.execute(query, [IDHocSinh, thang, nam, soTien, hanCuoi, ghiChu]);
//     return result.insertId; // Trả về ID của hóa đơn vừa tạo
// };
// // Lấy danh sách học phí theo tháng
// const getTuitionBillsByMonth = async (idTruong, thang, nam) => {
//     const query = `
//         SELECT hp.IDHocPhi, hp.IDHocSinh, hs.hoTen AS tenHocSinh, hp.thang, hp.nam,
//                hp.soTien, hp.trangThai, hp.hanCuoi, hp.ghiChu
//         FROM HocPhi hp
//         JOIN HocSinh hs ON hp.IDHocSinh = hs.IDHocSinh
//         JOIN LopHoc lh ON hs.IDLopHoc = lh.IDLopHoc
//         WHERE lh.IDTruong = ? AND hp.thang = ? AND hp.nam = ?
//     `;
//     const [rows] = await mysql.execute(query, [idTruong, thang, nam]);
//     return rows;
// };

// // Lưu thông tin giao dịch thanh toán
// const saveTransaction = async ({ maGiaoDich, maYeuCau, IDHocPhi, soTien, noiDung, maGiaoDichMoMo, trangThai }) => {
//     const query = `
//         INSERT INTO GiaoDichThanhToan (maGiaoDich, maYeuCau, IDHocPhi, soTien, noiDung, maGiaoDichMoMo, ngayTao, trangThai)
//         VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
//     `;
//     const [result] = await mysql.execute(query, [maGiaoDich, maYeuCau, IDHocPhi, soTien, noiDung, maGiaoDichMoMo, trangThai]);
//     return result.insertId;
// };

// // Cập nhật trạng thái giao dịch
// const updateTuitionStatus = async (orderId, trangThai, ngayThanhToan, maGiaoDich) => {
//     const query = `
//         UPDATE HocPhi
//         SET trangThai = ?, ngayThanhToan = ?, maGiaoDich = ?
//         WHERE IDHocPhi = ?
//     `;
//     const [result] = await mysql.execute(query, [trangThai, ngayThanhToan, maGiaoDich, orderId]);
//     return result.affectedRows > 0;
// };

// // Cập nhật trạng thái học phí
// const updateTransactionStatus = async (orderId, trangThai, ngayCapNhat) => {
//     const query = `
//         UPDATE GiaoDichThanhToan
//         SET trangThai = ?, ngayCapNhat = ?
//         WHERE maGiaoDich = ?
//     `;
//     const [result] = await mysql.execute(query, [trangThai, ngayCapNhat, orderId]);
//     return result.affectedRows > 0;
// };

// const getTransactionByOrderId = async (orderId) => {
//     const query = `
//         SELECT * FROM GiaoDichThanhToan
//         WHERE IDHocPhi = ?
//     `;
//     const [rows] = await mysql.execute(query, [orderId]);
//     return rows;
// };

// module.exports = {
//     getUnpaidTuitionByParent,
//     saveTransaction,
//     updateTransactionStatus,
//     createTuitionBill,
//     getTuitionBillsByMonth,
//     updateTuitionStatus,
//     getTransactionByOrderId,
// };

const mysql = require("../config/db");

// Tạo hóa đơn học phí
const createTuitionBill = async ({ IDHocSinh, thang, nam, soTien, hanCuoi, noiDung, ghiChu }) => {
    const query = `
        INSERT INTO HocPhi (IDHocSinh, thang, nam, soTien, trangThai, hanCuoi, ngayTao, noiDung, ghiChu)
        VALUES (?, ?, ?, ?, 'Chưa thanh toán', ?, NOW(), ?, ?)
    `;
    const [result] = await mysql.execute(query, [IDHocSinh, thang, nam, soTien, hanCuoi, noiDung, ghiChu]);
    return result.insertId; // Trả về ID của hóa đơn vừa tạo
};

// Lấy danh sách học phí chưa thanh toán của phụ huynh
const getUnpaidTuitionByParent = async (IDHocSinh) => {
    const query = `
        SELECT hp.*, hs.hoTen AS tenHocSinh
        FROM HocPhi hp
        JOIN HocSinh hs ON hp.IDHocSinh = hs.IDHocSinh
        WHERE hp.IDHocSinh = ? AND hp.trangThai != 'Thành công'
    `;
    const [rows] = await mysql.execute(query, [IDHocSinh]);
    return rows;
};

// Lấy danh sách học phí đã thanh toán của một học sinh
const getPaidTuitionByParent = async (IDHocSinh) => {
    const [rows] = await mysql.execute(`
         SELECT hp.*, hs.hoTen AS tenHocSinh
        FROM HocPhi hp
        JOIN HocSinh hs ON hp.IDHocSinh = hs.IDHocSinh
        WHERE hp.IDHocSinh = ? AND hp.trangThai = 'Thành công'
        ORDER BY hp.thang DESC, hp.nam DESC`, [IDHocSinh]);
    return rows;
};

// Lưu thông tin giao dịch thanh toán
const saveTransaction = async ({ maGiaoDich, maGiaoDichMoMo, IDHocPhi, soTien, trangThai }) => {
    const query = `
        UPDATE HocPhi
        SET maGiaoDich = ?, maGiaoDichMoMo = ?, ngayThanhToan = NOW(), trangThai = ?
        WHERE IDHocPhi = ?
    `;
    const [result] = await mysql.execute(query, [maGiaoDich, maGiaoDichMoMo, trangThai, IDHocPhi]);
    return result.affectedRows > 0;
};

// Lấy thông tin học phí theo ID
const getTuitionById = async (IDHocPhi) => {
    const query = `
        SELECT * FROM HocPhi
        WHERE IDHocPhi = ?
    `;
    const [rows] = await mysql.execute(query, [IDHocPhi]);
    return rows.length ? rows[0] : null;
};

// // Cập nhật trạng thái học phí
const updateTransactionStatus = async (orderId, trangThai, ngayThanhToan) => {
    const query = `
        UPDATE HocPhi
        SET trangThai = ?, ngayThanhToan = ?
        WHERE maGiaoDich = ?
    `;
    const [result] = await mysql.execute(query, [trangThai, ngayThanhToan, orderId]);
    return result.affectedRows > 0;
};

const getTransactionByOrderId = async (orderId) => {
    const query = `
        SELECT * FROM HocPhi
        WHERE IDHocPhi = ?
    `;
    const [rows] = await mysql.execute(query, [orderId]);
    return rows;
};

module.exports = {
    createTuitionBill,
    getUnpaidTuitionByParent,
    saveTransaction,
    getTuitionById,
    updateTransactionStatus,
    getTransactionByOrderId,
    getPaidTuitionByParent,
};
