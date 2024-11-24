const db = require("../config/db");

// Get all subjects
exports.getAllMonHoc = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM MonHoc");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching subjects", error: err });
    }
};

// Create a new subject
exports.createMonHoc = async (req, res) => {
    const { TenMonHoc, NoiDungMonHoc } = req.body;
    try {
        const [result] = await db.execute("INSERT INTO MonHoc (TenMonHoc, NoiDungMonHoc) VALUES (?, ?)", [TenMonHoc, NoiDungMonHoc]);
        res.status(201).json({ message: "Subject created successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating subject", error: err });
    }
};

// Update MonHoc
exports.updateMonHoc = async (req, res) => {
    const { IDMonHoc } = req.params;
    const { TenMonHoc, NoiDungMonHoc } = req.body;
    try {
        const rowsAffected = await MonHoc.update(IDMonHoc, { TenMonHoc, NoiDungMonHoc });
        if (rowsAffected) {
            res.json({ message: "MonHoc updated successfully" });
        } else {
            res.status(404).json({ message: "MonHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating MonHoc", error: err });
    }
};

// Delete MonHoc
exports.deleteMonHoc = async (req, res) => {
    const { IDMonHoc } = req.params;
    try {
        const rowsAffected = await MonHoc.delete(IDMonHoc);
        if (rowsAffected) {
            res.json({ message: "MonHoc deleted successfully" });
        } else {
            res.status(404).json({ message: "MonHoc not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting MonHoc", error: err });
    }
};
