const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { verifyToken } = require("../config/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
// Cấu hình multer với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Thư mục trên Cloudinary
        allowedFormats: ["jpg", "png", "jpeg"], // Các định dạng cho phép
    },
});
const upload = multer({ storage: storage });
router.get("/cccd/:cccd", studentController.getHocSinhByCCCD);

// ✅ Thêm học sinh mới
// // router.post("/them-hoc-sinh", verifyToken, studentController.themHocSinh);
// router.post("/them-hocsinh", verifyToken, studentController.themHocSinhBangPhuHuynh);
// Thêm học sinh bằng phụ huynh (có upload file)
router.post(
    "/them-hocsinh",
    verifyToken,
    upload.fields([
        { name: "giayKhaiSinh", maxCount: 1 },
        { name: "hoKhau", maxCount: 1 },
    ]),
    studentController.themHocSinhBangPhuHuynh
);
// Route cập nhật thông tin nhập học
// Route cập nhật thông tin nhập học
router.put("/nhap-hoc", verifyToken, studentController.updateNhapHoc);

// ✅ Lấy danh sách học sinh của trường
router.get("/:idTruong", studentController.getHocSinhByTruong);

// ✅ Lấy danh sách học sinh đã duyệt
router.get("/:idTruong/approved", studentController.getHocSinhDaDuyet);

// ✅ Lấy danh sách học sinh chưa duyệt
router.get("/:idTruong/pending", studentController.getHocSinhChuaDuyet);

// ✅ Duyệt hoặc từ chối danh sách học sinh
router.put("/:idTruong/approve", studentController.approveHocSinh);

// ✅ Lấy thông tin chi tiết học sinh
router.get("/:idTruong/:idHocSinh", studentController.getThongTinHocSinh);

// Cập nhật thông tin học sinh
router.put("/update/:IDHocSinh", studentController.updateHocSinh);

// ✅ Xóa học sinh (chuyển trạng thái nghỉ học)
// Cập nhật trạng thái học sinh (xóa mềm)
router.put("/status/:IDHocSinh", studentController.updateStatusHocSinh);

// Route lấy danh sách học sinh theo ID phụ huynh
router.post("/listStudentOfParent", verifyToken, studentController.getHocSinhByPhuHuynh);

//Xoá học sinh boi phu huynh
router.delete("/delete/:IDHocSinh", verifyToken, studentController.deleteHocSinhByPhuHuynh);

// ✅ Lấy thông tin chi tiết học sinh theo phụ huynh
router.post("/parent/:IDHocSinh", verifyToken, studentController.getThongTinHocSinhByPhuHuynh);

router.post("/createDonXinNghi", verifyToken, studentController.createDonNghiHoc);

router.post("/:IDHocSinh/donnghihoc", verifyToken, studentController.getDonNghiHocByHocSinh);

// // Tạo đơn chuyển trường
// router.post("/createDonChyenTruong", verifyToken, studentController.createDonChuyenTruong);

// // Lấy danh sách đơn chuyển trường theo phụ huynh
// router.post("/:IDHocSinh/getListDonChuyenTruong", verifyToken, studentController.getDonChuyenTruongByPhuHuynh);

// Tạo đơn chuyển trường
router.post("/createDonChuyenTruong", verifyToken, upload.single("minhChung"), studentController.createDonChuyenTruong);

// Lấy danh sách đơn chuyển trường theo phụ huynh
router.post("/listDonChuyenTruong", verifyToken, studentController.getDonChuyenTruongByPhuHuynh);

/// Lấy danh sách đơn chuyển trường theo trạng thái
router.post("/:IDTruong/donChuyenTruong", verifyToken, studentController.getDanhSachDonChuyenTruong);

// Lấy danh sách đơn chuyển trường theo con của phụ huynh
router.post("/:IDHocSinh/donchuyentruongbycon", verifyToken, studentController.getDonChuyenTruongByCon);

// Duyệt hoặc từ chối đơn chuyển trường
router.put("/donChuyenTruong/:IDDon", verifyToken, studentController.approveChuyenTruong);

// Lấy danh sách điểm danh của học sinh
router.post("/:IDHocSinh/diemdanh", verifyToken, studentController.getDiemDanhByHocSinh);

// Lấy danh sách nhận xét của giáo viên về học sinh
router.post("/:IDHocSinh/nhanxet", verifyToken, studentController.getNhanXetByHocSinh);

// Route cập nhật avatar học sinh
router.put("/:IDHocSinh/avatar", upload.single("avatar"), studentController.updateAvatarHocSinh);

module.exports = router;
