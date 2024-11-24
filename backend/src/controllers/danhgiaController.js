const db = require("../config/db");

// Get all evaluations
exports.getAllDanhGia = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM DanhGia");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching evaluations", error: err });
    }
};

// Create a new evaluation
exports.createDanhGia = async (req, res) => {
    const { IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO DanhGia (IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia) VALUES (?, ?, ?, ?, ?, ?)", [
            IDPhuHuynh,
            IDGiaoVien,
            IDHocSinh,
            MucDoHaiLong,
            NhanXet,
            NgayDanhGia,
        ]);
        res.status(201).json({ message: "Evaluation created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating evaluation", error: err });
    }
};
// Update DanhGia
exports.updateDanhGia = async (req, res) => {
    const { IDDanhGia } = req.params;
    const { IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia } = req.body;
    try {
        const rowsAffected = await DanhGia.update(IDDanhGia, { IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia });
        if (rowsAffected) {
            res.json({ message: "DanhGia updated successfully" });
        } else {
            res.status(404).json({ message: "DanhGia not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating DanhGia", error: err });
    }
};

// Delete DanhGia
exports.deleteDanhGia = async (req, res) => {
    const { IDDanhGia } = req.params;
    try {
        const rowsAffected = await DanhGia.delete(IDDanhGia);
        if (rowsAffected) {
            res.json({ message: "DanhGia deleted successfully" });
        } else {
            res.status(404).json({ message: "DanhGia not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting DanhGia", error: err });
    }
};
