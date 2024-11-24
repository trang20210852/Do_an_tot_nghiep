const express = require("express");
const router = express.Router();
const lichHocController = require("../controllers/lichhocController");

// Define routes for LichHoc
router.get("/getAllLichHoc", lichHocController.getAllLichHoc);
router.post("/addLichHoc", lichHocController.createLichHoc);
router.put("/updateLichHoc/:IDLichHoc", lichHocController.updateLichHoc);
router.delete("/deleteLichHoc/:IDLichHoc", lichHocController.deleteLichHoc);

module.exports = router;
