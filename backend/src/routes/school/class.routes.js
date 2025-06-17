const express = require("express");
const router = express.Router();
const classController = require("../../controllers/school/class.controller");

// ✅ Tạo lớp học mới (Không cần token)
router.post("/create", classController.createLopHoc);

// ✅ Lấy danh sách lớp học theo ID trường (Không cần token)
router.get("/list", classController.getLopHocByTruong);
// Phân giáo viên chủ nhiệm cho lớp học
router.put("/assign-giao-vien", classController.assignGiaoVienChuNhiem);
// Chia học sinh vào lớp học
router.put("/assign-lop", classController.assignHocSinhToLop);
// Lấy chi tiết lớp học
router.get("/:idLopHoc", classController.getLopHocDetail);

router.post("/:idLopHoc/zalo-group", classController.createZaloGroup);

// Route xóa lớp học
router.delete("/:idLopHoc", classController.deleteLopHoc);

module.exports = router;
