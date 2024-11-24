const db = require("../config/db");

// Get all parents
exports.getAllPhuHuynh = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM PhuHuynh");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching parents", error: err });
    }
};

// Create a new parent
exports.createPhuHuynh = async (req, res) => {
    const { hoTen, soDienThoai, email, diaChi, matKhau, idHocSinh } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO PhuHuynh (HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh) VALUES (?, ?, ?, ?, ?, ?)", [
            hoTen,
            soDienThoai,
            email,
            diaChi,
            matKhau,
            idHocSinh,
        ]);
        res.status(201).json({ message: "Parent created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating parent", error: err });
    }
};
// Update PhuHuynh
exports.updatePhuHuynh = async (req, res) => {
    const { IDPhuHuynh } = req.params;
    const { HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh } = req.body;
    try {
        const rowsAffected = await PhuHuynh.update(IDPhuHuynh, { HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh });
        if (rowsAffected) {
            res.json({ message: "PhuHuynh updated successfully" });
        } else {
            res.status(404).json({ message: "PhuHuynh not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating PhuHuynh", error: err });
    }
};

// Delete PhuHuynh
exports.deletePhuHuynh = async (req, res) => {
    const { IDPhuHuynh } = req.params;
    try {
        const rowsAffected = await PhuHuynh.delete(IDPhuHuynh);
        if (rowsAffected) {
            res.json({ message: "PhuHuynh deleted successfully" });
        } else {
            res.status(404).json({ message: "PhuHuynh not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting PhuHuynh", error: err });
    }
};
