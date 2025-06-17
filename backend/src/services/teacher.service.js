const mysql = require("../config/db");
const bcrypt = require("bcryptjs");
// // Lấy danh sách học sinh của lớp do giáo viên chủ nhiệm
// const getHocSinhByLop = async (IDGiaoVien) => {
//     if (!IDGiaoVien) {
//         throw new Error("IDGiaoVien không hợp lệ!");
//     }

//     const sql = `
//        SELECT
//     hs.*, -- tất cả thông tin học sinh
//     ph.IDPhuHuynh,
//     ph.hoTen AS tenPhuHuynh,
//     ph.gioiTinh AS gioiTinhPhuHuynh,
//     ph.ngaySinh AS ngaySinhPhuHuynh,
//     ph.diaChi AS diaChiPhuHuynh,
//     ph.SDT AS SDTPhuHuynh,
//     ph.email AS emailPhuHuynh,
//     ph.nhanThongBao,
//     ph.Status AS StatusPhuHuynh,
//     ph.CCCD AS CCCDPhuHuynh,
//     phhs.moiQuanHe,
//     phhs.rating,
//     phhs.comment
// FROM LopHoc lh
// INNER JOIN HocSinh hs ON lh.IDLopHoc = hs.IDLopHoc
// INNER JOIN PhuHuynh_HocSinh phhs ON hs.IDHocSinh = phhs.IDHocSinh
// INNER JOIN PhuHuynh ph ON phhs.IDPhuHuynh = ph.IDPhuHuynh
// WHERE lh.IDGiaoVien = ?;

//     `;
//     const [rows] = await mysql.execute(sql, [IDGiaoVien]);
//     return rows;
// };

// Lấy danh sách học sinh theo IDLopHoc và IDGiaoVien
const getHocSinhByLop = async (IDLopHoc, IDGiaoVien) => {
    if (!IDLopHoc || !IDGiaoVien) {
        throw new Error("IDLopHoc hoặc IDGiaoVien không hợp lệ!");
    }

    const sql = `
        SELECT 
            hs.*, -- tất cả thông tin học sinh
            ph.IDPhuHuynh,
            ph.hoTen AS tenPhuHuynh,
            ph.SDT AS SDTPhuHuynh,
            ph.email AS emailPhuHuynh,
            phhs.moiQuanHe,
            phhs.rating,
            phhs.comment
        FROM LopHoc lh
        INNER JOIN HocSinh hs ON lh.IDLopHoc = hs.IDLopHoc
        INNER JOIN PhuHuynh_HocSinh phhs ON hs.IDHocSinh = phhs.IDHocSinh
        INNER JOIN PhuHuynh ph ON phhs.IDPhuHuynh = ph.IDPhuHuynh
        WHERE lh.IDLopHoc = ? AND lh.IDGiaoVien = ?;
    `;

    const [rows] = await mysql.execute(sql, [IDLopHoc, IDGiaoVien]);
    return rows;
};

// Thêm nhận xét học sinh
const addNhanXetHocSinh = async (IDHocSinh, IDGiaoVien, noiDung, sucKhoe, hocTap) => {
    const sql = `
        INSERT INTO NhanXetHocSinh (IDHocSinh, IDGiaoVien, ngayNhanXet, noiDung,sucKhoe, hocTap)
        VALUES (?, ?, CURDATE(), ?,?,?)
    `;
    const [result] = await mysql.execute(sql, [IDHocSinh, IDGiaoVien, noiDung, sucKhoe, hocTap]);
    return result.insertId;
};

// Gửi thông báo tới phụ huynh
const sendThongBao = async (IDNguoiGui, IDPhuHuynh, tieuDe, noiDung, loaiThongBao, mucDoUuTien) => {
    const sql = `
        INSERT INTO ThongBao (IDNguoiGui, IDPhuHuynh, tieuDe, noiDung,loaiThongBao, mucDoUuTien, ngayGui)
        VALUES (?, ?, ?, ?, ?,?,CURDATE())
    `;
    const [result] = await mysql.execute(sql, [IDNguoiGui, IDPhuHuynh, tieuDe, noiDung, loaiThongBao, mucDoUuTien]);
    return result.insertId;
};

// Lấy danh sách đơn xin nghỉ học của lớp do giáo viên chủ nhiệm
const getDonNghiHocByLop = async (idGiaoVien) => {
    if (!idGiaoVien) {
        throw new Error("ID giáo viên không hợp lệ!");
    }

    const sql = `
        SELECT 
            dn.IDDon, 
            hs.hoTen AS hoTenHocSinh, 
            dn.ngayBatDau, 
            dn.ngayKetThuc, 
            dn.lyDo, 
            dn.trangThai, 
            dn.ngayTao
        FROM DonNghiHoc dn
        INNER JOIN HocSinh hs ON dn.IDHocSinh = hs.IDHocSinh
        INNER JOIN LopHoc lh ON hs.IDLopHoc = lh.IDLopHoc
        WHERE lh.IDGiaoVien = ?
        ORDER BY dn.ngayTao DESC
    `;

    try {
        const [rows] = await mysql.execute(sql, [idGiaoVien]);
        return rows;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn xin nghỉ học:", error);
        throw error;
    }
};

// Cập nhật trạng thái đơn nghỉ học
const updateTrangThaiDonNghiHoc = async (idDon, approve) => {
    const sql = `
        UPDATE DonNghiHoc
        SET trangThai = ?
        WHERE IDDon = ?
    `;
    const trangThai = approve ? "Đã duyệt" : "Từ chối";
    const [result] = await mysql.execute(sql, [trangThai, idDon]);
    return result;
};

// Điểm danh học sinh
const diemDanhHocSinh = async (IDHocSinh, ngay, trangThai) => {
    const sql = `
        INSERT INTO DiemDanh (IDHocSinh, ngay, trangThai)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE trangThai = VALUES(trangThai)
    `;
    const [result] = await mysql.execute(sql, [IDHocSinh, ngay, trangThai]);
    return result;
};

//Lấy thông tin lớp chủ nhiệm của giáo viên
const getLopChuNhiem = async (IDGiaoVien) => {
    const sql = `
        SELECT lh.IDLopHoc, lh.tenLop, lh.siSo, lh.doTuoi, lh.namHoc, lh.linkZaloGroup
        FROM LopHoc lh
        WHERE lh.IDGiaoVien = ?
    `;
    try {
        const [rows] = await mysql.execute(sql, [IDGiaoVien]);
        return rows; // Trả về mảng (nếu không có dữ liệu, rows sẽ là mảng rỗng)
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp chủ nhiệm từ database:", error);
        throw error;
    }
};

// const getLopChuNhiem = async (IDNhanVien) => {
//     const query = `
//         SELECT lh.IDLopHoc, lh.tenLop, lh.siSo, lh.namHoc, lh.linkZaloGroup
//          FROM LopHoc lh
//          WHERE lh.IDGiaoVien = ?
//     `;

//     try {
//         const [rows] = await mysql.execute(query, [IDNhanVien]);
//         return rows; // Trả về mảng (nếu không có dữ liệu, rows sẽ là mảng rỗng)
//     } catch (error) {
//         console.error("Lỗi khi lấy danh sách lớp chủ nhiệm từ database:", error);
//         throw error;
//     }
// };

const updateAvatar = async (IDGiaoVien, avatarUrl) => {
    const sql = `
        UPDATE NhanVien
        SET avatar = ?
        WHERE IDNhanVien = ?
    `;
    try {
        const [result] = await mysql.execute(sql, [avatarUrl, IDGiaoVien]);
        return result;
    } catch (error) {
        console.error("Lỗi khi cập nhật avatar giáo viên:", error);
        throw error;
    }
};

const updateThongTinGiaoVien = async (IDGiaoVien, data) => {
    const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email } = data;

    const sql = `
        UPDATE NhanVien
        SET hoTen = ?, gioiTinh = ?, ngaySinh = ?, diaChi = ?, SDT = ?, email = ?
        WHERE IDNhanVien = ?
    `;
    const [result] = await mysql.execute(sql, [hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, IDGiaoVien]);
    return result;
};

// Thêm hàm đổi mật khẩu
const changePassword = async (IDGiaoVien, oldPassword, newPassword) => {
    // Lấy mật khẩu hiện tại từ DB để so sánh
    const [rows] = await mysql.execute("SELECT matKhau FROM NhanVien WHERE IDNhanVien = ?", [IDGiaoVien]);

    if (rows.length === 0) {
        return { success: false, message: "Không tìm thấy giáo viên" };
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, rows[0].matKhau);
    if (!isMatch) {
        return { success: false, message: "Mật khẩu cũ không đúng" };
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    const [result] = await mysql.execute("UPDATE NhanVien SET matKhau = ? WHERE IDNhanVien = ?", [hashedPassword, IDGiaoVien]);
    return {
        success: result.affectedRows > 0,
        message: result.affectedRows > 0 ? "Đổi mật khẩu thành công" : "Không thể đổi mật khẩu",
    };
};

module.exports = {
    getHocSinhByLop,
    addNhanXetHocSinh,
    sendThongBao,
    getDonNghiHocByLop,
    updateTrangThaiDonNghiHoc,
    diemDanhHocSinh,
    getLopChuNhiem,
    updateAvatar,
    updateThongTinGiaoVien,
    changePassword,
};
