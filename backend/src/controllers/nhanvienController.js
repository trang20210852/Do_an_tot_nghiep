const db = require("../config/db");

// Get all employees
exports.getAllNhanVien = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM NhanVien");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching employees", error: err });
    }
};

// Create a new employee
exports.createNhanVien = async (req, res) => {
    const { HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO NhanVien (HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            HoTen,
            ChucVu,
            NgaySinh,
            DiaChi,
            SoDienThoai,
            Email,
            MatKhau,
        ]);
        res.status(201).json({ message: "Employee created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating employee", error: err });
    }
};

// Update NhanVien
exports.updateNhanVien = async (req, res) => {
    const { IDNhanVien } = req.params;
    const { HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau } = req.body;
    try {
        const rowsAffected = await NhanVien.update(IDNhanVien, { HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau });
        if (rowsAffected) {
            res.json({ message: "NhanVien updated successfully" });
        } else {
            res.status(404).json({ message: "NhanVien not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating NhanVien", error: err });
    }
};

// Delete NhanVien
exports.deleteNhanVien = async (req, res) => {
    const { IDNhanVien } = req.params;
    try {
        const rowsAffected = await NhanVien.delete(IDNhanVien);
        if (rowsAffected) {
            res.json({ message: "NhanVien deleted successfully" });
        } else {
            res.status(404).json({ message: "NhanVien not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting NhanVien", error: err });
    }
};
