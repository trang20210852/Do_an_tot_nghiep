const db = require("../config/db");

// Get all attendance records
exports.getAllChamCong = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM ChamCong");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance records", error: err });
    }
};

// Create a new attendance record
exports.createChamCong = async (req, res) => {
    const { IDNhanVien, NgayLamViec, TrangThai } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO ChamCong (IDNhanVien, NgayLamViec, TrangThai) VALUES (?, ?, ?)", [IDNhanVien, NgayLamViec, TrangThai]);
        res.status(201).json({ message: "Attendance record created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating attendance record", error: err });
    }
};

// Update ChamCong
exports.updateChamCong = async (req, res) => {
    const { IDChamCong } = req.params;
    const { IDNhanVien, NgayLamViec, TrangThai } = req.body;
    try {
        const rowsAffected = await ChamCong.update(IDChamCong, { IDNhanVien, NgayLamViec, TrangThai });
        if (rowsAffected) {
            res.json({ message: "ChamCong updated successfully" });
        } else {
            res.status(404).json({ message: "ChamCong not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating ChamCong", error: err });
    }
};

// Delete ChamCong
exports.deleteChamCong = async (req, res) => {
    const { IDChamCong } = req.params;
    try {
        const rowsAffected = await ChamCong.delete(IDChamCong);
        if (rowsAffected) {
            res.json({ message: "ChamCong deleted successfully" });
        } else {
            res.status(404).json({ message: "ChamCong not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting ChamCong", error: err });
    }
};
