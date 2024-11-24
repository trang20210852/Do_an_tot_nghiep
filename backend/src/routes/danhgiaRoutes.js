const express = require("express");
const router = express.Router();
const danhGiaController = require("../controllers/danhgiaController");

// Define routes for DanhGia
router.get("/getAllDanhGia", danhGiaController.getAllDanhGia);
router.post("/addDanhGia", danhGiaController.createDanhGia);
router.put("/updateDanhGia/:IDDanhGia", danhGiaController.updateDanhGia);
router.delete("/deleteDanhGia/:IDDanhGia", danhGiaController.deleteDanhGia);

module.exports = router;
