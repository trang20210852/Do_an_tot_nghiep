const mysql = require("../config/db");

// 📌 Lấy danh sách trường học (chỉ ID và Tên Trường)
const getAllTruongHoc = async () => {
    const [rows] = await mysql.execute(`SELECT * FROM TruongHoc`);
    return rows; // Chỉ trả về dữ liệu
};

// ✅ Lấy danh sách nhân viên theo trạng thái duyệt (true = đã duyệt, false = chưa duyệt)
const getNhanVienByDuyet = async (idTruong, daDuyet) => {
    const [rows] = await mysql.execute(
        `SELECT 
            nv.IDNhanVien, nv.hoTen, nv.gioiTinh, nv.ngaySinh, nv.diaChi, nv.SDT, 
            nv.email,thnv.IDTruong, thnv.chucVu, thnv.ngayVaoLam, thnv.phongBan, thnv.luong, thnv.Status
        FROM TruongHoc_NhanVien thnv
        JOIN NhanVien nv ON thnv.IDNhanVien = nv.IDNhanVien
        WHERE thnv.IDTruong = ? AND thnv.duyet = ?`,
        [idTruong, daDuyet]
    );
    return rows;
};

// ✅ Duyệt hoặc từ chối một hoặc nhiều cán bộ trong trường
const updateTrangThaiDuyetTheoDanhSach = async (idTruong, danhSachCanBo, duyet) => {
    const placeholders = danhSachCanBo.map(() => "?").join(", "); // Tạo chuỗi `?,?,?` cho câu lệnh SQL
    const query = `
        UPDATE TruongHoc_NhanVien 
        SET duyet = ? 
        WHERE IDTruong = ? AND IDNhanVien IN (${placeholders})
    `;

    const params = [duyet ? 1 : 0, idTruong, ...danhSachCanBo];
    const [result] = await mysql.execute(query, params);
    return result;
};

const getThongTinCanBo = async (idTruong, idNhanVien) => {
    const [rows] = await mysql.execute(
        `SELECT 
            nv.IDNhanVien, nv.hoTen, nv.gioiTinh, nv.ngaySinh, nv.diaChi, nv.SDT, nv.email, 
            thnv.chucVu, thnv.ngayVaoLam, thnv.phongBan, thnv.luong, thnv.Status 
        FROM TruongHoc_NhanVien thnv
        JOIN NhanVien nv ON thnv.IDNhanVien = nv.IDNhanVien
        WHERE thnv.IDTruong = ? AND thnv.IDNhanVien = ?`,
        [idTruong, idNhanVien]
    );
    return rows.length ? rows[0] : null;
};

const updateThongTinCanBo = async (idTruong, idNhanVien, data) => {
    const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email } = data;

    const query = `
        UPDATE NhanVien 
        SET hoTen = ?, gioiTinh = ?, ngaySinh = ?, diaChi = ?, SDT = ?, email = ?
        WHERE IDNhanVien IN (
            SELECT IDNhanVien FROM TruongHoc_NhanVien WHERE IDTruong = ? AND IDNhanVien = ?
        )
    `;

    try {
        const [result] = await mysql.execute(query, [hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, idTruong, idNhanVien]);

        return result;
    } catch (error) {
        throw error;
    }
};

const deleteCanBo = async (idTruong, idNhanVien) => {
    const query = `
        UPDATE TruongHoc_NhanVien
        SET Status = 'Dừng'
        WHERE IDTruong = ? AND IDNhanVien = ?
    `;

    const [result] = await mysql.execute(query, [idTruong, idNhanVien]);
    return result;
};

const updateChucVu_PhongBan = async (idTruong, idNhanVien, data) => {
    const { chucVu, phongBan } = data;
    const query = `
        UPDATE TruongHoc_NhanVien
        SET chucVu = ?, phongBan = ?
        WHERE IDTruong = ? AND IDNhanVien = ?
    `;

    const [result] = await mysql.execute(query, [chucVu, phongBan, idTruong, idNhanVien]);
    return result;
};

// 📌 Lấy thông tin chi tiết của một trường học theo ID
const getThongTinTruongHocByID = async (idTruong) => {
    const [rows] = await mysql.execute(`SELECT * FROM TruongHoc WHERE IDTruong = ?`, [idTruong]);
    return rows.length ? rows[0] : null;
};

const updateThongTinTruongHoc = async (idTruong, data) => {
    const { tenTruong, diaChi, SDT, email_business, email_hieutruong } = data;
    const query = `
        UPDATE TruongHoc
        SET tenTruong = ?, diaChi = ?, SDT = ?, email_business = ?, email_hieutruong = ?
        WHERE IDTruong = ?
    `;

    const [result] = await mysql.execute(query, [tenTruong, diaChi, SDT, email_business, email_hieutruong, idTruong]);
    return result;
};
module.exports = {
    getAllTruongHoc,
    getNhanVienByDuyet,
    updateTrangThaiDuyetTheoDanhSach,
    getThongTinCanBo,
    updateThongTinCanBo,
    deleteCanBo,
    updateChucVu_PhongBan,
    getThongTinTruongHocByID,
    updateThongTinTruongHoc,
};
