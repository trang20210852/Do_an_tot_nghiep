const mysql = require("../../config/db");

// ✅ Tạo lớp học mới
const createLopHoc = async (idTruong, tenLop, doTuoi, namHoc) => {
    const [result] = await mysql.execute(`INSERT INTO LopHoc (IDTruong, tenLop, doTuoi,namHoc) VALUES (?, ?, ?,?)`, [idTruong, tenLop, doTuoi, namHoc]);
    return result;
};

// Lấy chi tiết lớp học
const getLopHocDetail = async (idLopHoc) => {
    const sqlLopHoc = `
        SELECT lh.IDLopHoc, lh.tenLop, lh.doTuoi, lh.siSo, lh.linkZaloGroup, lh.namHoc, gv.hoTen AS giaoVienChuNhiem
        FROM LopHoc lh
        LEFT JOIN NhanVien gv ON lh.IDGiaoVien = gv.IDNhanVien
        WHERE lh.IDLopHoc = ?
    `;
    const [lopHoc] = await mysql.execute(sqlLopHoc, [idLopHoc]);

    const sqlHocSinh = `
        SELECT hs.IDHocSinh, hs.hoTen, hs.gioiTinh, hs.ngaySinh, hs.Avatar
        FROM HocSinh hs
        WHERE hs.IDLopHoc = ?
    `;
    const [danhSachHocSinh] = await mysql.execute(sqlHocSinh, [idLopHoc]);

    return { ...lopHoc[0], danhSachHocSinh };
};

// ✅ Lấy danh sách lớp học theo ID trường
const getLopHocByTruong = async (idTruong) => {
    const [rows] = await mysql.execute(`SELECT IDLopHoc, tenLop, doTuoi, siSo, namHoc FROM LopHoc WHERE IDTruong = ?`, [idTruong]);
    return rows;
};

// Cập nhật giáo viên chủ nhiệm cho lớp học
const assignGiaoVienChuNhiem = async (IDLopHoc, IDGiaoVien) => {
    const sql = `
        UPDATE LopHoc
        SET IDGiaoVien = ?
        WHERE IDLopHoc = ?
    `;
    const [result] = await mysql.execute(sql, [IDGiaoVien, IDLopHoc]);
    return result;
};

// Cập nhật lớp học cho học sinh
const assignHocSinhToLop = async (danhSachHocSinh, IDLopHoc) => {
    const placeholders = danhSachHocSinh.map(() => "?").join(", ");
    const sql = `
        UPDATE HocSinh
        SET IDLopHoc = ?
        WHERE IDHocSinh IN (${placeholders})
    `;
    const values = [IDLopHoc, ...danhSachHocSinh];

    const [result] = await mysql.execute(sql, values);
    return result;
};

const updateZaloGroup = async (idLopHoc, linkZaloGroup) => {
    const sql = `
        UPDATE LopHoc
        SET  linkZaloGroup = ?
        WHERE IDLopHoc = ?
    `;
    const [result] = await mysql.execute(sql, [linkZaloGroup, idLopHoc]);
    return result;
};

// Xóa lớp học
const deleteLopHoc = async (idLopHoc) => {
    const sql = `DELETE FROM LopHoc WHERE IDLopHoc = ?`;
    const [result] = await mysql.execute(sql, [idLopHoc]);
    return result;
};

module.exports = {
    createLopHoc,
    getLopHocByTruong,
    assignGiaoVienChuNhiem,
    assignHocSinhToLop,
    getLopHocDetail,
    updateZaloGroup,
    deleteLopHoc,
};
