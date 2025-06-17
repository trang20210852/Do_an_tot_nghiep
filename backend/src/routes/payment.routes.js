const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

// Tạo hóa đơn học phí
router.post("/tuition/create", paymentController.createTuitionBill);

// Lấy danh sách học phí chưa thanh toán
router.get("/tuition/unpaid/:IDHocSinh", paymentController.getUnpaidTuitionByParent);

// Tạo yêu cầu thanh toán qua MoMo
router.post("/tuition/pay", paymentController.ThanhToanHocPhi);

// Xử lý callback từ MoMo
router.post("/tuition/callback", paymentController.MoMoCallback);

// Kiểm tra trạng thái giao dịch
router.post("/tuition/check-status", paymentController.checkStatus);

// Route lấy danh sách học phí đã thanh toán của phụ huynh
router.get("/tuition/paid/:IDHocSinh", paymentController.getPaidTuitionByParent);

module.exports = router;
