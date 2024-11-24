const db = require("../config/db");

// Get all parent notifications
exports.getAllThongBaoPhuHuynh = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM ThongBaoPhuHuynh");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching parent notifications", error: err });
    }
};

// Create a new parent notification
exports.createThongBaoPhuHuynh = async (req, res) => {
    const { IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO ThongBaoPhuHuynh (IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID) VALUES (?, ?, ?, ?, ?)", [
            IDHocSinh,
            LoaiThongBao,
            NoiDung,
            NgayGui,
            GiaoVienID,
        ]);
        res.status(201).json({ message: "Parent notification created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating parent notification", error: err });
    }
};

// Update ThongBaoPhuHuynh
exports.updateThongBaoPhuHuynh = async (req, res) => {
    const { IDThongBao } = req.params;
    const { IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID } = req.body;
    try {
        const rowsAffected = await ThongBaoPhuHuynh.update(IDThongBao, { IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID });
        if (rowsAffected) {
            res.json({ message: "ThongBaoPhuHuynh updated successfully" });
        } else {
            res.status(404).json({ message: "ThongBaoPhuHuynh not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating ThongBaoPhuHuynh", error: err });
    }
};

// Delete ThongBaoPhuHuynh
exports.deleteThongBaoPhuHuynh = async (req, res) => {
    const { IDThongBao } = req.params;
    try {
        const rowsAffected = await ThongBaoPhuHuynh.delete(IDThongBao);
        if (rowsAffected) {
            res.json({ message: "ThongBaoPhuHuynh deleted successfully" });
        } else {
            res.status(404).json({ message: "ThongBaoPhuHuynh not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting ThongBaoPhuHuynh", error: err });
    }
};
