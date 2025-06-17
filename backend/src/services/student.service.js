const mysql = require("../config/db");

// Tìm học sinh theo CCCD
const findHocSinhByCCCD = async (cccd) => {
    const [rows] = await mysql.execute("SELECT * FROM HocSinh WHERE cccd = ?", [cccd]);
    return rows.length ? rows[0] : null;
};

// // Tạo học sinh mới
// const createHocSinh = async (data) => {
//     const sql = `
//         INSERT INTO HocSinh
//         (hoTen, nickname, gioiTinh, ngaySinh, thongTinSucKhoe, tinhHinhHocTap,
//          Avatar, cccd, giayKhaiSinh, hoKhau, soThich, uuDiem, nhuocDiem,
//          benhTat, doTuoi)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//         data.hoTen,
//         data.nickname,
//         data.gioiTinh,
//         data.ngaySinh,
//         data.thongTinSucKhoe,
//         data.tinhHinhHocTap,
//         data.Avatar,
//         data.cccd,
//         data.giayKhaiSinh,
//         data.hoKhau,
//         data.soThich,
//         data.uuDiem,
//         data.nhuocDiem,
//         data.benhTat,
//         data.doTuoi,
//     ];

//     const [result] = await mysql.execute(sql, values);
//     return result.insertId;
// };

const createHocSinh = async (data) => {
    const sql = `
        INSERT INTO HocSinh
        (hoTen, nickname, gioiTinh, ngaySinh, thongTinSucKhoe, tinhHinhHocTap,
         cccd, giayKhaiSinh, hoKhau, soThich, uuDiem, nhuocDiem,
         benhTat, doTuoi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.hoTen,
        data.nickname,
        data.gioiTinh,
        data.ngaySinh,
        data.thongTinSucKhoe,
        data.tinhHinhHocTap,
        data.cccd,
        data.giayKhaiSinh,
        data.hoKhau,
        data.soThich,
        data.uuDiem,
        data.nhuocDiem,
        data.benhTat,
        data.doTuoi,
    ];

    const [result] = await mysql.execute(sql, values);
    return result.insertId;
};

const updateHocSinhNhapHoc = async (IDHocSinh, IDTruong) => {
    const sql = `
        UPDATE HocSinh
        SET IDTruong = ?, duyet = FALSE, Status = 'Chờ duyệt'
        WHERE IDHocSinh = ?
    `;
    try {
        const [result] = await mysql.execute(sql, [IDTruong, IDHocSinh]);
        return result;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin nhập học:", error);
        throw error;
    }
};

// Tạo liên kết phụ huynh - học sinh
const createPhuHuynhHocSinh = async (IDPhuHuynh, IDHocSinh, moiQuanHe) => {
    const sql = `
        INSERT IGNORE INTO PhuHuynh_HocSinh (IDPhuHuynh, IDHocSinh, moiQuanHe)
        VALUES (?, ?, ?)
    `;
    const [result] = await mysql.execute(sql, [IDPhuHuynh, IDHocSinh, moiQuanHe]);
    return result;
};

// 📌 Lấy danh sách học sinh của một trường
const getHocSinhByTruong = async (idTruong) => {
    const [rows] = await mysql.execute(`SELECT * FROM HocSinh WHERE IDTruong = ?`, [idTruong]);
    return rows;
};

// ✅ Lấy danh sách học sinh theo trạng thái duyệt
const getHocSinhByDuyet = async (idTruong, daDuyet) => {
    const [rows] = await mysql.execute(`SELECT * FROM HocSinh WHERE IDTruong = ? AND duyet = ?`, [idTruong, daDuyet]);
    return rows;
};

// ✅ Duyệt hoặc từ chối một hoặc nhiều học sinh
const updateTrangThaiDuyetHocSinh = async (idTruong, danhSachHocSinh, duyet) => {
    const placeholders = danhSachHocSinh.map(() => "?").join(", ");
    const query = `
        UPDATE HocSinh 
        SET duyet = ? , Status = 'Đang học'
        WHERE IDTruong = ? AND IDHocSinh IN (${placeholders})
    `;

    const params = [duyet ? 1 : 0, idTruong, ...danhSachHocSinh];
    const [result] = await mysql.execute(query, params);
    return result;
};

const getThongTinHocSinh = async (idTruong, idHocSinh) => {
    if (idTruong === undefined || idHocSinh === undefined) {
        throw new Error("IDTruong hoặc IDHocSinh bị undefined");
    }

    const [rows] = await mysql.execute(
        `
        SELECT 
            hs.*, 
            ph.IDPhuHuynh, ph.hoTen AS hoTenPhuHuynh, ph.gioiTinh AS gioiTinhPhuHuynh, 
            ph.ngaySinh AS ngaySinhPhuHuynh, ph.diaChi AS diaChiPhuHuynh, 
            ph.SDT, ph.email, ph.Avatar AS avatarPhuHuynh, 
            ph.Status AS statusPhuHuynh, ph.CCCD AS cccdPhuHuynh, 
            p_hs.moiQuanHe
        FROM HocSinh hs
        LEFT JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        LEFT JOIN PhuHuynh ph ON p_hs.IDPhuHuynh = ph.IDPhuHuynh
        WHERE hs.IDTruong = ? AND hs.IDHocSinh = ?
    `,
        [idTruong, idHocSinh]
    );

    return rows;
};

// Cập nhật thông tin học sinh
const updateHocSinh = async (IDHocSinh, data) => {
    const sql = `
        UPDATE HocSinh SET
            hoTen = ?, 
            nickname = ?, 
            gioiTinh = ?, 
            ngaySinh = ?, 
            ngayNhapHoc = ?, 
            thongTinSucKhoe = ?, 
            tinhHinhHocTap = ?, 
            Avatar = ?, 
            IDTruong = ?, 
            IDLopHoc = ?, 
            cccd = ?, 
            giayKhaiSinh = ?, 
            hoKhau = ?, 
            soThich = ?, 
            uuDiem = ?, 
            nhuocDiem = ?, 
            benhTat = ?, 
            doTuoi = ?
        WHERE IDHocSinh = ?
    `;
    const values = [
        data.hoTen,
        data.nickname,
        data.gioiTinh,
        data.ngaySinh,
        data.ngayNhapHoc,
        data.thongTinSucKhoe,
        data.tinhHinhHocTap,
        data.Avatar,
        data.IDTruong,
        data.IDLopHoc,
        data.cccd,
        data.giayKhaiSinh,
        data.hoKhau,
        data.soThich,
        data.uuDiem,
        data.nhuocDiem,
        data.benhTat,
        data.doTuoi,
        IDHocSinh,
    ];

    const [result] = await mysql.execute(sql, values);
    return result;
};
// Cập nhật trạng thái học sinh (xoá mềm)
const updateStatusHocSinh = async (IDHocSinh, status) => {
    const sql = `UPDATE HocSinh SET Status = ? WHERE IDHocSinh = ?`;
    const [result] = await mysql.execute(sql, [status, IDHocSinh]);
    return result;
};

const updateStatusAndNgayRaTruong = async (IDHocSinh, status) => {
    let sql, values;

    if (status === "Đã tốt nghiệp") {
        sql = `UPDATE HocSinh SET Status = ?, ngayRaTruong = ? WHERE IDHocSinh = ?`;
        values = [status, new Date(), IDHocSinh];
    } else {
        sql = `UPDATE HocSinh SET Status = ? WHERE IDHocSinh = ?`;
        values = [status, IDHocSinh];
    }

    const [result] = await mysql.execute(sql, values);
    return result;
};

const getHocSinhByPhuHuynh = async (IDPhuHuynh) => {
    const sql = `
        SELECT 
            hs.IDHocSinh, 
            hs.hoTen, 
            hs.gioiTinh, 
            hs.ngaySinh, 
            hs.Avatar, 
            hs.IDTruong, 
            hs.IDLopHoc, 
            hs.cccd, 
            hs.doTuoi, 
            p_hs.moiQuanHe
        FROM HocSinh hs
        INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        WHERE p_hs.IDPhuHuynh = ?
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const deleteHocSinhByPhuHuynh = async (IDHocSinh, IDPhuHuynh) => {
    const sql = `
        DELETE hs
        FROM HocSinh hs
        INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        WHERE hs.IDHocSinh = ? AND p_hs.IDPhuHuynh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [IDHocSinh, IDPhuHuynh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi xóa học sinh:", error);
        throw error;
    }
};

const getThongTinHocSinhByPhuHuynh = async (IDHocSinh, IDPhuHuynh) => {
    const sql = `
        SELECT 
    hs.*, 
    lh.*, 
    th.tenTruong AS tenTruongHoc,
    th.IDTruong AS IDTruongHoc, 
            th.diaChi AS diaChiTruong, 
            th.SDT AS SDTTruong, 
            th.email_business AS emailTruong
FROM HocSinh hs
INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
LEFT JOIN LopHoc lh ON hs.IDLopHoc = lh.IDLopHoc
LEFT JOIN TruongHoc th ON hs.IDTruong = th.IDTruong
WHERE hs.IDHocSinh = ? AND p_hs.IDPhuHuynh = ?;
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDHocSinh, IDPhuHuynh]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông tin học sinh:", error);
        throw error;
    }
};

// Tạo đơn xin nghỉ
const createDonNghiHoc = async (IDHocSinh, IDPhuHuynh, ngayBatDau, ngayKetThuc, lyDo) => {
    const sql = `
        INSERT INTO DonNghiHoc (IDHocSinh, IDPhuHuynh, ngayBatDau, ngayKetThuc, lyDo)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await mysql.execute(sql, [IDHocSinh, IDPhuHuynh, ngayBatDau, ngayKetThuc, lyDo]);
        return result.insertId;
    } catch (error) {
        console.error("[ERROR] Lỗi khi tạo đơn xin nghỉ:", error);
        throw error;
    }
};

const getDonNghiHocByHocSinh = async (IDHocSinh) => {
    const sql = `
        SELECT 
            IDDon, ngayBatDau, ngayKetThuc, lyDo, trangThai, ngayTao
        FROM DonNghiHoc
        WHERE IDHocSinh = ?
        ORDER BY ngayTao DESC
    `;
    try {
        const [rows] = await mysql.execute(sql, [IDHocSinh]);
        return rows;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn xin nghỉ:", error);
        throw error;
    }
};

// Tạo đơn chuyển trường

const createDonChuyenTruong = async (data) => {
    const sql = `
        INSERT INTO DonChuyenTruong
        (IDHocSinh, IDPhuHuynh, IDTruongHienTai, IDTruongMuonChuyen, lyDo, minhChung)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [data.IDHocSinh, data.IDPhuHuynh, data.IDTruongHienTai, data.IDTruongMuonChuyen, data.lyDo, data.minhChung || null];
    const [result] = await mysql.execute(sql, values);
    return result.insertId;
};

// Lấy danh sách đơn chuyển trường theo ID phụ huynh
const getDonChuyenTruongByPhuHuynh = async (IDPhuHuynh) => {
    const sql = `
    SELECT 
        dct.*, 
        hs.hoTen AS tenHocSinh, 
        hs.ngaySinh AS ngaySinhHocSinh, 
        hs.gioiTinh AS gioiTinhHocSinh, 
        ph.hoTen AS tenPhuHuynh, 
        ph.SDT AS soDienThoaiPhuHuynh, 
        ph.email AS emailPhuHuynh
    FROM DonChuyenTruong dct
    JOIN HocSinh hs ON dct.IDHocSinh = hs.IDHocSinh
    JOIN PhuHuynh ph ON dct.IDPhuHuynh = ph.IDPhuHuynh
    WHERE dct.IDPhuHuynh = ?
    ORDER BY dct.ngayTao DESC
`;
    console.log("[DEBUG] SQL Query:", sql);
    console.log("[DEBUG] IDPhuHuynh:", IDPhuHuynh);

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh]);
        console.log("[DEBUG] Kết quả từ database:", rows);
        return rows;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn chuyển trường:", error);
        throw error;
    }
};

// Lấy danh sách đơn chuyển trường theo con của phụ huynh
const getDonChuyenTruongByCon = async (IDPhuHuynh, IDHocSinh) => {
    const sql = `
        SELECT 
            dct.IDDon,
            dct.IDHocSinh,
            hs.hoTen AS tenHocSinh,
            hs.ngaySinh AS ngaySinhHocSinh,
            hs.gioiTinh AS gioiTinhHocSinh,
            dct.IDTruongHienTai,
            th1.tenTruong AS truongHienTai,
            dct.IDTruongMuonChuyen,
            th2.tenTruong AS truongMuonChuyen,
            dct.lyDo,
            
            dct.ngayTao
        FROM DonChuyenTruong dct
        JOIN HocSinh hs ON dct.IDHocSinh = hs.IDHocSinh
        JOIN TruongHoc th1 ON dct.IDTruongHienTai = th1.IDTruong
        JOIN TruongHoc th2 ON dct.IDTruongMuonChuyen = th2.IDTruong
        WHERE dct.IDPhuHuynh = ? AND dct.IDHocSinh = ?
        ORDER BY dct.ngayTao DESC
    `;

    try {
        const [rows] = await mysql.execute(sql, [IDPhuHuynh, IDHocSinh]);
        return rows;
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn chuyển trường:", error);
        throw error;
    }
};

// Duyệt hoặc từ chối đơn chuyển trường
const updateTrangThaiDonChuyenTruong = async (IDDon, trangThaiTruongHienTai, trangThaiTruongMuonChuyen = null) => {
    const sql = `
        UPDATE DonChuyenTruong
        SET trangThaiTruongHienTai = ?, trangThaiTruongMuonChuyen = ?
        WHERE IDDon = ?
    `;
    const [result] = await mysql.execute(sql, [trangThaiTruongHienTai, trangThaiTruongMuonChuyen, IDDon]);
    return result;
};

// Lấy danh sách đơn chuyển trường theo trạng thái
const getDanhSachDonChuyenTruong = async (IDTruong, isCurrentSchool) => {
    const sql = `
        SELECT 
            dct.IDDon,
            hs.IDHocSinh,
            hs.hoTen,
            hs.gioiTinh,
            hs.ngaySinh,
            hs.IDLopHoc,
            ph.hoTen AS tenPhuHuynh, 
        ph.SDT AS soDienThoaiPhuHuynh, 
        ph.email AS emailPhuHuynh,
            dct.IDTruongHienTai,
            th1.tenTruong AS truongHienTai,
            dct.IDTruongMuonChuyen,
            th2.tenTruong AS truongMuonChuyen,
            dct.lyDo,
            dct.minhChung,
            dct.ngayTao
        FROM DonChuyenTruong dct
        JOIN HocSinh hs ON dct.IDHocSinh = hs.IDHocSinh
          JOIN PhuHuynh ph ON dct.IDPhuHuynh = ph.IDPhuHuynh
        JOIN TruongHoc th1 ON dct.IDTruongHienTai = th1.IDTruong
        JOIN TruongHoc th2 ON dct.IDTruongMuonChuyen = th2.IDTruong
        WHERE ${isCurrentSchool ? "dct.IDTruongHienTai" : "dct.IDTruongMuonChuyen"} = ?
        ORDER BY dct.ngayTao DESC
    `;
    const [rows] = await mysql.execute(sql, [IDTruong]);
    return rows;
};

// Lấy danh sách điểm danh của học sinh
const getDiemDanhByHocSinh = async (IDHocSinh) => {
    const sql = `
        SELECT ngay, trangThai
        FROM DiemDanh
        WHERE IDHocSinh = ?
        ORDER BY ngay DESC
    `;
    const [rows] = await mysql.execute(sql, [IDHocSinh]);
    return rows;
};

// Lấy danh sách nhận xét của giáo viên về học sinh
const getNhanXetByHocSinh = async (IDHocSinh) => {
    const sql = `
        SELECT nx.*, gv.hoTen AS giaoVien
        FROM NhanXetHocSinh nx
        JOIN NhanVien gv ON nx.IDGiaoVien = gv.IDNhanVien
        WHERE nx.IDHocSinh = ?
        ORDER BY nx.ngayNhanXet DESC
    `;
    const [rows] = await mysql.execute(sql, [IDHocSinh]);
    return rows;
};

const updateAvatarHocSinh = async (IDHocSinh, avatarUrl) => {
    const sql = `
        UPDATE HocSinh
        SET Avatar = ?
        WHERE IDHocSinh = ?
    `;

    try {
        const [result] = await mysql.execute(sql, [avatarUrl, IDHocSinh]);
        return result;
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật avatar học sinh:", error);
        throw error;
    }
};

module.exports = {
    findHocSinhByCCCD,
    createHocSinh,
    updateHocSinhNhapHoc,
    createPhuHuynhHocSinh,
    getHocSinhByTruong,
    getHocSinhByDuyet,
    updateTrangThaiDuyetHocSinh,
    getThongTinHocSinh,
    updateHocSinh,
    updateStatusHocSinh,
    updateStatusAndNgayRaTruong,
    getHocSinhByPhuHuynh,
    deleteHocSinhByPhuHuynh,
    getThongTinHocSinhByPhuHuynh,
    createDonNghiHoc,
    getDonNghiHocByHocSinh,
    createDonChuyenTruong,
    getDonChuyenTruongByPhuHuynh,
    getDiemDanhByHocSinh,
    getNhanXetByHocSinh,
    getDonChuyenTruongByCon,
    updateTrangThaiDonChuyenTruong,
    getDanhSachDonChuyenTruong,
    updateAvatarHocSinh,
};
