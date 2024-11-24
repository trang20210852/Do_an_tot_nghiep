const db = require("../config/db");

// Get all departments
exports.getAllPhongBan = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM PhongBan");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching departments", error: err });
    }
};

// Create a new department
exports.createPhongBan = async (req, res) => {
    const { TenPhongBan, VaiTro } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO PhongBan (TenPhongBan, VaiTro) VALUES (?, ?)", [TenPhongBan, VaiTro]);
        res.status(201).json({ message: "Department created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating department", error: err });
    }
};

// Update PhongBan
exports.updatePhongBan = async (req, res) => {
    const { IDPhongBan } = req.params;
    const { TenPhongBan, VaiTro } = req.body;
    try {
        const rowsAffected = await PhongBan.update(IDPhongBan, { TenPhongBan, VaiTro });
        if (rowsAffected) {
            res.json({ message: "PhongBan updated successfully" });
        } else {
            res.status(404).json({ message: "PhongBan not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating PhongBan", error: err });
    }
};

// Delete PhongBan
exports.deletePhongBan = async (req, res) => {
    const { IDPhongBan } = req.params;
    try {
        const rowsAffected = await PhongBan.delete(IDPhongBan);
        if (rowsAffected) {
            res.json({ message: "PhongBan deleted successfully" });
        } else {
            res.status(404).json({ message: "PhongBan not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting PhongBan", error: err });
    }
};
