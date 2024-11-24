const db = require("../config/db");

// Get all reports
exports.getAllBaoCao = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM BaoCao");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reports", error: err });
    }
};

// Create a new report
exports.createBaoCao = async (req, res) => {
    const { LoaiBaoCao, NgayTao, NhanVienID, NoiDung } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO BaoCao (LoaiBaoCao, NgayTao, NhanVienID, NoiDung) VALUES (?, ?, ?, ?)", [LoaiBaoCao, NgayTao, NhanVienID, NoiDung]);
        res.status(201).json({ message: "Report created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating report", error: err });
    }
};

// Update BaoCao
exports.updateBaoCao = async (req, res) => {
    const { IDBaoCao } = req.params;
    const { LoaiBaoCao, NgayTao, NhanVienID, NoiDung } = req.body;
    try {
        const rowsAffected = await BaoCao.update(IDBaoCao, { LoaiBaoCao, NgayTao, NhanVienID, NoiDung });
        if (rowsAffected) {
            res.json({ message: "BaoCao updated successfully" });
        } else {
            res.status(404).json({ message: "BaoCao not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating BaoCao", error: err });
    }
};

// Delete BaoCao
exports.deleteBaoCao = async (req, res) => {
    const { IDBaoCao } = req.params;
    try {
        const rowsAffected = await BaoCao.delete(IDBaoCao);
        if (rowsAffected) {
            res.json({ message: "BaoCao deleted successfully" });
        } else {
            res.status(404).json({ message: "BaoCao not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting BaoCao", error: err });
    }
};
