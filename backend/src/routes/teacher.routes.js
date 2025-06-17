const express = require("express");
const router = express.Router();
const giaoVienController = require("../controllers/teacher.controller");
const { verifyToken } = require("../config/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình multer với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars", // Thư mục trên Cloudinary
        allowedFormats: ["jpg", "png", "jpeg"], // Các định dạng cho phép
    },
});
const upload = multer({ storage: storage });

// Route cập nhật avatar giáo viên
router.put("/avatar", verifyToken, upload.single("avatar"), giaoVienController.updateAvatar);

// // Lấy danh sách học sinh của lớp do giáo viên chủ nhiệm
// router.post("/hoc-sinh", verifyToken, giaoVienController.getHocSinhByLop);

// Lấy danh sách học sinh của một lớp do giáo viên chủ nhiệm
router.post("/lop/:IDLopHoc/hocsinh", verifyToken, giaoVienController.getHocSinhByLop);

// Thêm nhận xét học sinh
router.post("/nhan-xet", verifyToken, giaoVienController.addNhanXetHocSinh);

// Gửi thông báo tới phụ huynh
router.post("/thong-bao", verifyToken, giaoVienController.sendThongBao);

// Lấy danh sách đơn xin nghỉ học của lớp do giáo viên chủ nhiệm
router.post("/donnghihoc", verifyToken, giaoVienController.getDonNghiHocByLop);

// Duyệt hoặc từ chối đơn nghỉ học
router.put("/donnghihoc/:idDon", verifyToken, giaoVienController.approveDonNghiHoc);

// Điểm danh học sinh
router.post("/diem-danh", verifyToken, giaoVienController.diemDanhHocSinh);

// Lấy thông tin lớp chủ nhiệm
router.post("/lop-chu-nhiem", verifyToken, giaoVienController.getLopChuNhiem);

// Route cập nhật thông tin giáo viên
router.put("/update-info", verifyToken, giaoVienController.updateThongTinGiaoVien);

// Route đổi mật khẩu giáo viên
router.put("/change-password", verifyToken, giaoVienController.changePassword);

module.exports = router;
