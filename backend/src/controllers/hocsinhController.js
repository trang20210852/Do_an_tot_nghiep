const db = require("../config/db");

// // Get all students
// exports.getAllHocSinh = async (req, res) => {
//     try {
//         const [rows] = await db.execute("SELECT * FROM HocSinh");
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching students", error: err });
//     }
// };

// //Create a new student
// exports.createHocSinh = async (req, res) => {
//     const { HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap } = req.body;
//     try {
//         const [result] = await db.execute("INSERT INTO HocSinh (HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap) VALUES (?, ?, ?, ?, ?, ?)", [
//             HoTen,
//             NgaySinh,
//             GioiTinh,
//             IDLopHoc,
//             ThongTinSucKhoe,
//             TinhHinhHocTap,
//         ]);
//         res.status(201).json({ message: "Student created successfully", id: result.insertId });
//     } catch (err) {
//         res.status(500).json({ message: "Error creating student", error: err });
//     }
// };

// // Update HocSinh
// exports.updateHocSinh = async (req, res) => {
//     const { IDHocSinh } = req.params;
//     const { HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap } = req.body;
//     try {
//         const rowsAffected = await HocSinh.update(IDHocSinh, { HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap });
//         if (rowsAffected) {
//             res.json({ message: "HocSinh updated successfully" });
//         } else {
//             res.status(404).json({ message: "HocSinh not found" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Error updating HocSinh", error: err });
//     }
// };

// // Delete HocSinh
// exports.deleteHocSinh = async (req, res) => {
//     const { IDHocSinh } = req.params;
//     try {
//         const rowsAffected = await HocSinh.delete(IDHocSinh);
//         if (rowsAffected) {
//             res.json({ message: "HocSinh deleted successfully" });
//         } else {
//             res.status(404).json({ message: "HocSinh not found" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting HocSinh", error: err });
//     }
// };

// Lấy danh sách tất cả học sinh
exports.getAllHocSinh = async (req, res) => {
    try {
        const hocSinhs = await db.execute("SELECT * FROM HocSinh");
        res.json(hocSinhs);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách học sinh", error: err.message });
    }
};
// exports.getAllHocSinh = async (req, res) => {
//     try {
//         const [rows] = await db.execute("SELECT * FROM HocSinh");
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching students", error: err });
//     }
// };

// Lấy danh sách học sinh theo ID
exports.getHocSinhByIDs = async (req, res) => {
    const { ids } = req.query; // ids là mảng ID học sinh
    try {
        const hocSinhs = await db.findByIds(ids.split(","));
        res.json(hocSinhs);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy học sinh theo ID", error: err.message });
    }
};

// Thêm mới một học sinh
exports.addHocSinh = async (req, res) => {
    const { hoTen, ngaySinh, gioiTinh, idLopHoc, thongTinSucKhoe, tinhHinhHocTap } = req.body;
    try {
        const hocSinh = await HocSinh.create({
            hoTen,
            ngaySinh,
            gioiTinh,
            idLopHoc,
            thongTinSucKhoe,
            tinhHinhHocTap,
        });
        res.status(201).json(hocSinh);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thêm học sinh mới", error: err.message });
    }
};

// Cập nhật học sinh
exports.updateHocSinh = async (req, res) => {
    const { ids } = req.body;
    const { hoTen, ngaySinh, gioiTinh, idLopHoc, thongTinSucKhoe, tinhHinhHocTap } = req.body.data;
    try {
        const updatedHocSinhs = await db.update(ids, {
            hoTen,
            ngaySinh,
            gioiTinh,
            idLopHoc,
            thongTinSucKhoe,
            tinhHinhHocTap,
        });
        res.json(updatedHocSinhs);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật học sinh", error: err.message });
    }
};
