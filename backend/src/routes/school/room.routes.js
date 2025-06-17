const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/school/room.controller");

// Thêm phòng học mới
router.post("/create", roomController.addPhongHoc);

// Lấy danh sách phòng học theo trường
router.get("/:IDTruong", roomController.getPhongHocByTruong);

// Lấy thông tin chi tiết phòng học
router.get("/detail/:IDPhongHoc", roomController.getPhongHocByID);

// Cập nhật thông tin phòng học
router.put("/update/:IDPhongHoc", roomController.updatePhongHoc);

// Xóa phòng học
router.delete("/:IDPhongHoc", roomController.deletePhongHoc);

module.exports = router;
