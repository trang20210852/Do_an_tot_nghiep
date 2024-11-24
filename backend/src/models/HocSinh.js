// const db = require("../config/db");

// class HocSinh {
//     static async getAll() {
//         console.log("Hello");
//         const [rows] = await db.execute("SELECT * FROM HocSinh");
//         return rows;
//     }

//     static async create({ hoTen, ngaySinh, gioiTinh, idLopHoc, thongTinSucKhoe, tinhHinhHocTap }) {
//         console.log(hoTen);
//         const [result] = await db.execute("INSERT INTO HocSinh (HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap) VALUES (?, ?, ?, ?, ?, ?)", [
//             hoTen,
//             ngaySinh,
//             gioiTinh,
//             idLopHoc,
//             thongTinSucKhoe,
//             tinhHinhHocTap,
//         ]);
//         return result.insertId;
//     }
//     static async update(IDHocSinh, { HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap }) {
//         const [result] = await db.execute("UPDATE HocSinh SET HoTen = ?, NgaySinh = ?, GioiTinh = ?, IDLopHoc = ?, ThongTinSucKhoe = ?, TinhHinhHocTap = ? WHERE IDHocSinh = ?", [
//             HoTen,
//             NgaySinh,
//             GioiTinh,
//             IDLopHoc,
//             ThongTinSucKhoe,
//             TinhHinhHocTap,
//             IDHocSinh,
//         ]);
//         return result.affectedRows;
//     }

//     static async delete(IDHocSinh) {
//         const [result] = await db.execute("DELETE FROM HocSinh WHERE IDHocSinh = ?", [IDHocSinh]);
//         return result.affectedRows;
//     }
// }

// module.exports = HocSinh;

const db = require("../config/db");

// Lấy tất cả học sinh
exports.findAll = async () => {
    const [rows] = await db.execute("SELECT * FROM HocSinh");
    return rows;
};

// Lấy học sinh theo ID
exports.findByIds = async (ids) => {
    const [rows] = await db.execute("SELECT * FROM HocSinh WHERE IDHocSinh IN (?)", [ids]);
    return rows;
};

// Thêm mới học sinh
exports.create = async (hocSinh) => {
    const { hoTen, ngaySinh, gioiTinh, idLopHoc, thongTinSucKhoe, tinhHinhHocTap } = hocSinh;
    const [result] = await db.execute("INSERT INTO HocSinh (HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap) VALUES (?, ?, ?, ?, ?, ?)", [
        hoTen,
        ngaySinh,
        gioiTinh,
        idLopHoc,
        thongTinSucKhoe,
        tinhHinhHocTap,
    ]);
    return { id: result.insertId, ...hocSinh };
};

// Cập nhật học sinh
exports.update = async (ids, updatedData) => {
    const keys = Object.keys(updatedData);
    const values = Object.values(updatedData);
    const [result] = await db.execute(`UPDATE HocSinh SET ${keys.map((key) => `${key} = ?`).join(", ")} WHERE IDHocSinh IN (?)`, [...values, ids]);
    return result;
};
