const express = require("express");
const router = express.Router();
const truongController = require("../controllers/truongController");
router.get("/danhsachtruonghoc", truongController.getAllTruongHoc);
// ✅ Route lấy danh sách cán bộ ĐÃ DUYỆT trong một trường học
router.get("/:idTruong/approved", truongController.getApprovedNhanVien);

// ✅ Route lấy danh sách cán bộ CHƯA DUYỆT trong một trường học
router.get("/:idTruong/pending", truongController.getPendingNhanVien);
// ✅ Duyệt một hoặc nhiều cán bộ theo danh sách ID
router.put("/:idTruong/approve-canbo", truongController.approveSelectedCanBo);
// ✅ Lấy thông tin của 1 cán bộ trong trường
router.get("/:idTruong/canbo/:idNhanVien", truongController.getThongTinCanBo);

// ✅ Cập nhật thông tin của cán bộ
router.put("/:idTruong/canbo/:idNhanVien", truongController.updateThongTinCanBo);

// ✅ Xoá cán bộ (chuyển Status về 'Dừng')
router.delete("/:idTruong/canbo/:idNhanVien", truongController.deleteCanBo);

// ✅ Cập nhật chức vụ và phòng ban
router.put("/:idTruong/canbo/:idNhanVien/update-role", truongController.updateChucVu_PhongBan);

router.get("/:idTruong/thongtin", truongController.getThongTinTruongHoc);
router.put("/:idTruong/update", truongController.updateThongTinTruong);
module.exports = router;
