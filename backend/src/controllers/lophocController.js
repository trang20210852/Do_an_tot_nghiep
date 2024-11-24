const db = require("../config/db");

// Get all classes
exports.getAllLopHoc = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM LopHoc");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching classes", error: err });
    }
};

// Create a new class
exports.createLopHoc = async (req, res) => {
    const { TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO LopHoc (TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh) VALUES (?, ?, ?, ?)", [TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh]);
        res.status(201).json({ message: "Class created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating class", error: err });
    }
};

// Update LopHoc
exports.updateLopHoc = async (req, res) => {
    const { IDLopHoc } = req.params;
    const { TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh } = req.body;
    try {
        const rowsAffected = await LopHoc.update(IDLopHoc, { TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh });
        if (rowsAffected) {
            res.json({ message: "LopHoc updated successfully" });
        } else {
            res.status(404).json({ message: "LopHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating LopHoc", error: err });
    }
};

// Delete LopHoc
exports.deleteLopHoc = async (req, res) => {
    const { IDLopHoc } = req.params;
    try {
        const rowsAffected = await LopHoc.delete(IDLopHoc);
        if (rowsAffected) {
            res.json({ message: "LopHoc deleted successfully" });
        } else {
            res.status(404).json({ message: "LopHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting LopHoc", error: err });
    }
};
