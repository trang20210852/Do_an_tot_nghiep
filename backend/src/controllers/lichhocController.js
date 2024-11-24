const db = require("../config/db");

// Get all schedules
exports.getAllLichHoc = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM LichHoc");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching schedules", error: err });
    }
};

// Create a new schedule
exports.createLichHoc = async (req, res) => {
    const { IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO LichHoc (IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc) VALUES (?, ?, ?, ?, ?)", [
            IDLopHoc,
            IDMonHoc,
            NgayHoc,
            ThoiGianBatDau,
            ThoiGianKetThuc,
        ]);
        res.status(201).json({ message: "Schedule created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating schedule", error: err });
    }
};

// Update LichHoc
exports.updateLichHoc = async (req, res) => {
    const { IDLichHoc } = req.params;
    const { IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc } = req.body;
    try {
        const rowsAffected = await LichHoc.update(IDLichHoc, { IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc });
        if (rowsAffected) {
            res.json({ message: "LichHoc updated successfully" });
        } else {
            res.status(404).json({ message: "LichHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating LichHoc", error: err });
    }
};

// Delete LichHoc
exports.deleteLichHoc = async (req, res) => {
    const { IDLichHoc } = req.params;
    try {
        const rowsAffected = await LichHoc.delete(IDLichHoc);
        if (rowsAffected) {
            res.json({ message: "LichHoc deleted successfully" });
        } else {
            res.status(404).json({ message: "LichHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting LichHoc", error: err });
    }
};
