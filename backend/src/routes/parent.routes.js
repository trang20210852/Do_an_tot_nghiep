const express = require("express");
const router = express.Router();
const phuHuynhController = require("../controllers/parent/parent.controller");
const { verifyToken } = require("../config/auth");
const { addDanhGia, getDanhGiaByTruong } = require("../controllers/parent/schoolReview.controller");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "phuhuynh-avatars", // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const upload = multer({ storage });

// Route: Lấy thông tin chi tiết phụ huynh
router.post("/me", verifyToken, phuHuynhController.getThongTinPhuHuynh);

router.post("/thong-bao", verifyToken, phuHuynhController.getThongBaoPhuHuynh);

router.post("/zalo-groups", verifyToken, phuHuynhController.getZaloGroupByParent);

// Thêm đánh giá
router.post("/rate", verifyToken, addDanhGia);

// Lấy danh sách đánh giá của một trường
router.get("/rate/:IDTruong", getDanhGiaByTruong);

// Route cập nhật avatar
router.put("/avatar", verifyToken, upload.single("avatar"), phuHuynhController.updateAvatarPhuHuynh);

// Route cập nhật trạng thái thông báo
router.put("/:IDThongBao/read", verifyToken, phuHuynhController.markThongBaoAsRead);

// Lấy thông báo theo trạng thái
router.get("/thongbao", verifyToken, phuHuynhController.getThongBaoByTrangThai);

// Route xóa thông báo
router.delete("/thongbao/:idThongBao", verifyToken, phuHuynhController.deleteThongBao);

// Route cập nhật thông tin phụ huynh
router.put("/update-info", verifyToken, phuHuynhController.updateThongTinPhuHuynh);

// Đổi mật khẩu phụ huynh
router.put("/change-password", verifyToken, phuHuynhController.changePassword);

module.exports = router;
