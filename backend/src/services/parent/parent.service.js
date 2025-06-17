const mysql = require("../../config/db");
const bcrypt = require("bcryptjs");

// Lấy thông tin chi tiết phụ huynh theo ID
const getThongTinPhuHuynh = async (IDPhuHuynh) => {
    const sql = `
        SELECT 
            IDPhuHuynh, hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, Avatar, Status, CCCD
        FROM PhuHuynh
        WHERE IDPhuHuynh = ?
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông tin phụ huynh:", error);
        throw error;
    }
};

const getThongBaoPhuHuynh = async (IDPhuHuynh) => {
    const sql = `
        SELECT 
            tb.IDThongBao, 
            tb.tieuDe, 
            tb.noiDung, 
            tb.ngayGui, 
             tb.loaiThongBao,
              tb.mucDoUuTien,
            nv.hoTen AS tenGiaoVien
        FROM ThongBao tb
        JOIN NhanVien nv ON tb.IDNguoiGui = nv.IDNhanVien
        WHERE tb.IDPhuHuynh = ?
        ORDER BY tb.ngayGui DESC
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh]);
        return rows;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông báo phụ huynh:", error);
        throw error;
    }
};

const getZaloGroupByParent = async (IDPhuHuynh) => {
    const sql = `
        SELECT hs.hoTen AS hoTenCon, lh.IDLopHoc, lh.tenLop, lh.linkZaloGroup
        FROM PhuHuynh_HocSinh ph
        JOIN HocSinh hs ON ph.IDHocSinh = hs.IDHocSinh
        JOIN LopHoc lh ON hs.IDLopHoc = lh.IDLopHoc
        WHERE ph.IDPhuHuynh = ?
    `;
    const [rows] = await mysql.execute(sql, [IDPhuHuynh]);
    return rows;
};

const updateAvatarPhuHuynh = async (IDPhuHuynh, avatarUrl) => {
    if (!IDPhuHuynh || !avatarUrl) {
        throw new Error("IDPhuHuynh hoặc avatarUrl không hợp lệ");
    }

    const sql = `
        UPDATE PhuHuynh
        SET Avatar = ?
        WHERE IDPhuHuynh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [avatarUrl, IDPhuHuynh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật avatar phụ huynh:", error);
        throw error;
    }
};

const updateTrangThaiThongBao = async (IDThongBao, IDPhuHuynh) => {
    const sql = `
        UPDATE ThongBao
        SET trangThai = 'Đã đọc'
        WHERE IDThongBao = ? AND IDPhuHuynh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [IDThongBao, IDPhuHuynh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật trạng thái thông báo:", error);
        throw error;
    }
};

// Lấy thông báo theo trạng thái
const getThongBaoByTrangThai = async (IDPhuHuynh, trangThai) => {
    const sql = `
        SELECT *
        FROM ThongBao
        WHERE IDPhuHuynh = ? AND trangThai = ?
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh, trangThai]);
        return rows;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông báo:", error);
        throw error;
    }
};

const deleteThongBao = async (IDThongBao, IDPhuHuynh) => {
    const sql = `
        DELETE FROM ThongBao
        WHERE IDThongBao = ? AND IDPhuHuynh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [IDThongBao, IDPhuHuynh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi xóa thông báo:", error);
        throw error;
    }
};

const updateThongTinPhuHuynh = async (IDPhuHuynh, data) => {
    const { hoTen, gioiTinh, ngaySinh, diaChi, CCCD, SDT, email } = data;

    const sql = `
        UPDATE PhuHuynh
        SET hoTen = ?, gioiTinh = ?, ngaySinh = ?, diaChi = ?, CCCD = ?, SDT = ?, email = ?
        WHERE IDPhuHuynh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [hoTen, gioiTinh, ngaySinh, diaChi, CCCD, SDT, email, IDPhuHuynh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật thông tin phụ huynh:", error);
        throw error;
    }
};

const changePassword = async (IDPhuHuynh, oldPassword, newPassword) => {
    // Lấy mật khẩu hiện tại
    const [rows] = await mysql.execute("SELECT matKhau FROM PhuHuynh WHERE IDPhuHuynh = ?", [IDPhuHuynh]);
    if (!rows || rows.length === 0) return { success: false, message: "Không tìm thấy phụ huynh" };

    const isMatch = await bcrypt.compare(oldPassword, rows[0].matKhau);
    if (!isMatch) return { success: false, message: "Mật khẩu cũ không đúng" };

    const hashed = await bcrypt.hash(newPassword, 10);
    const [result] = await mysql.execute("UPDATE PhuHuynh SET matKhau = ? WHERE IDPhuHuynh = ?", [hashed, IDPhuHuynh]);
    return { success: result.affectedRows > 0 };
};
module.exports = {
    getThongTinPhuHuynh,
    getThongBaoPhuHuynh,
    getZaloGroupByParent,
    updateAvatarPhuHuynh,
    updateTrangThaiThongBao,
    getThongBaoByTrangThai,
    deleteThongBao,
    updateThongTinPhuHuynh,
    changePassword,
};
