const express = require("express");
const router = express.Router();
const nhanVienController = require("../controllers/nhanvienController");

// Define routes for NhanVien
router.get("/getAllNhanVien", nhanVienController.getAllNhanVien);
router.post("/addNhanVien", nhanVienController.createNhanVien);
router.put("/updateNhanVien/:IDNhanVien", nhanVienController.updateNhanVien);
router.delete("/deleteNhanVien/:IDNhanVien", nhanVienController.deleteNhanVien);

module.exports = router;
