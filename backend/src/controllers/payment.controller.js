const paymentModel = require("../services/payment.service");
const axios = require("axios");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// Hàm tạo nội dung biên lai HTML
function generateReceiptHTML({ hoTenPhuHuynh, hoTenHocSinh, tenTruong, thang, nam, soTien, ngayThanhToan, maGiaoDich }) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
            <div style="background: linear-gradient(90deg,#fbbf24,#f59e42); color: #fff; padding: 20px 30px;">
                <h2 style="margin:0;">Biên lai thanh toán học phí</h2>
                <p style="margin:0;">${tenTruong}</p>
            </div>
            <div style="padding: 24px 30px;">
                <p>Kính gửi: <b>${hoTenPhuHuynh}</b></p>
                <p>Xin xác nhận quý phụ huynh đã thanh toán học phí cho học sinh <b>${hoTenHocSinh}</b> như sau:</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr>
                        <td>Tháng/Năm:</td>
                        <td><b>${thang}/${nam}</b></td>
                    </tr>
                    <tr>
                        <td>Số tiền:</td>
                        <td><b style="color:#f59e42;">${soTien.toLocaleString()} VNĐ</b></td>
                    </tr>
                    <tr>
                        <td>Ngày thanh toán:</td>
                        <td>${ngayThanhToan}</td>
                    </tr>
                    <tr>
                        <td>Mã giao dịch:</td>
                        <td>${maGiaoDich}</td>
                    </tr>
                </table>
                <p style="margin-top:24px;">Cảm ơn quý phụ huynh đã tin tưởng và đồng hành cùng <b>${tenTruong}</b>!</p>
                <p style="font-size:13px;color:#888;">Nếu có thắc mắc về khoản thanh toán, vui lòng liên hệ nhà trường để được hỗ trợ.</p>
            </div>
            <div style="background:#fbbf24;color:#fff;text-align:center;padding:12px 0;font-size:13px;">
                &copy; ${new Date().getFullYear()} ${tenTruong}
            </div>
        </div>
    `;
}
// Tạo hóa đơn học phí
const createTuitionBill = async (req, res) => {
    try {
        const { IDHocSinh, thang, nam, soTien, hanCuoi, noiDung, ghiChu } = req.body;

        if (!IDHocSinh || !thang || !nam || !soTien || !hanCuoi) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin cần thiết để tạo hóa đơn" });
        }

        const IDHocPhi = await paymentModel.createTuitionBill({
            IDHocSinh,
            thang,
            nam,
            soTien,
            hanCuoi,
            noiDung,
            ghiChu,
        });

        res.status(201).json({ success: true, message: "Hóa đơn học phí được tạo thành công", IDHocPhi });
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn học phí:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Lấy danh sách học phí chưa thanh toán của phụ huynh
const getUnpaidTuitionByParent = async (req, res) => {
    try {
        const { IDHocSinh } = req.params;

        const unpaidTuition = await paymentModel.getUnpaidTuitionByParent(IDHocSinh);

        res.status(200).json({ success: true, data: unpaidTuition });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học phí chưa thanh toán:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getPaidTuitionByParent = async (req, res) => {
    try {
        const { IDHocSinh } = req.params;
        const paidTuition = await paymentModel.getPaidTuitionByParent(IDHocSinh);
        res.status(200).json({ success: true, data: paidTuition });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học phí đã thanh toán:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const ThanhToanHocPhi = async (req, res) => {
    try {
        const { IDHocPhi, soTien, noiDung } = req.body;

        if (!IDHocPhi || !soTien || !noiDung) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin thanh toán" });
        }

        // Tạo thông tin giao dịch
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const redirectUrl = `http://localhost:5173/parents/payment/success?IDHocPhi=${IDHocPhi}`;

        const ipnUrl = "https://8d7d-210-245-71-130.ngrok-free.app/callback";
        const requestType = "captureWallet";
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const amount = soTien.toString();
        const extraData = "";

        // Tạo chữ ký HMAC SHA256
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${noiDung}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        // Tạo request body
        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo: noiDung,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            signature,
        };

        // Gửi yêu cầu thanh toán đến MoMo
        const response = await axios.post(process.env.MOMO_ENDPOINT, requestBody);

        // Lưu thông tin giao dịch vào database
        await paymentModel.saveTransaction({
            maGiaoDich: orderId,
            maYeuCau: requestId,
            IDHocPhi,
            soTien,
            noiDung,
            maGiaoDichMoMo: null,
            trangThai: "Đang xử lý",
        });

        // Trả về URL thanh toán cho client
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
        res.status(500).json({ success: false, message: "Không thể tạo yêu cầu thanh toán" });
    }
};

// const MoMoCallback = async (req, res) => {
//     try {
//         res.status(200).json({ success: true, message: "Callback xử lý thành công" });
//     } catch (error) {
//         console.error("Lỗi khi xử lý callback:", error);
//         res.status(500).json({ success: false, message: "Lỗi khi xử lý callback" });
//     }
// };

// const MoMoCallback = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         if (!orderId) {
//             return res.status(400).json({ success: false, message: "Thiếu orderId trong callback" });
//         }
//         // Gọi checkStatus để xử lý cập nhật trạng thái
//         await checkStatus(req, res);
//     } catch (error) {
//         console.error("Lỗi khi xử lý callback:", error);
//         res.status(500).json({ success: false, message: "Lỗi khi xử lý callback" });
//     }
// };

const MoMoCallback = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Thiếu orderId trong callback" });
        }
        // Gọi lại checkStatus để xử lý cập nhật trạng thái hóa đơn
        await checkStatus(req, res);
    } catch (error) {
        console.error("Lỗi khi xử lý callback:", error);
        res.status(500).json({ success: false, message: "Lỗi khi xử lý callback" });
    }
};

const checkStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Thiếu mã đơn hàng (orderId)" });
        }

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;

        // Tạo chữ ký HMAC SHA256
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        // Tạo request body
        const requestBody = {
            partnerCode,
            accessKey,
            requestId: orderId,
            orderId,
            signature,
            lang: "vi",
        };

        // Gửi yêu cầu kiểm tra trạng thái giao dịch đến MoMo
        const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/query", requestBody);

        const { resultCode, transId } = response.data;

        // Kiểm tra trạng thái giao dịch
        const trangThai = resultCode === 0 ? "Thành công" : "Thất bại";

        // Cập nhật trạng thái giao dịch
        const updated = await paymentModel.updateTransactionStatus(orderId, trangThai, new Date());

        if (!updated) {
            return res.status(404).json({ success: false, message: "Không tìm thấy giao dịch để cập nhật" });
        }

        // Nếu giao dịch thành công hoặc thất bại, cập nhật trạng thái học phí
        if (resultCode === 0) {
            // Giao dịch thành công
            const [transaction] = await paymentModel.getTransactionByOrderId(orderId);
            if (transaction && transaction.IDHocPhi) {
                await paymentModel.updateTuitionStatus(transaction.IDHocPhi, "Đã thanh toán", new Date(), transId);

                // ...sau khi cập nhật trạng thái học phí thành "Đã thanh toán"
                if (resultCode === 0) {
                    // Lấy thông tin phụ huynh, học sinh, trường, số tiền, ... từ DB
                    const thongTin = await paymentModel.getReceiptInfoByOrderId(orderId); // bạn cần viết hàm này
                    // Ví dụ: { emailPhuHuynh, hoTenPhuHuynh, hoTenHocSinh, tenTruong, thang, nam, soTien, ngayThanhToan, maGiaoDich }

                    // Tạo transporter
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "your-email@gmail.com",
                            pass: "your-app-password",
                        },
                    });

                    // Tạo nội dung biên lai
                    const html = generateReceiptHTML(thongTin);

                    // Gửi mail
                    await transporter.sendMail({
                        from: `"${thongTin.tenTruong}" <your-email@gmail.com>`,
                        to: thongTin.emailPhuHuynh,
                        subject: "Biên lai thanh toán học phí",
                        html,
                    });
                }
            }
            res.status(200).json({ success: true, message: "Giao dịch thành công", data: response.data });
        } else {
            // Giao dịch thất bại
            const [transaction] = await paymentModel.getTransactionByOrderId(orderId);
            if (transaction && transaction.IDHocPhi) {
                await paymentModel.updateTuitionStatus(transaction.IDHocPhi, "Thất bại", null, null);
            }
            res.status(200).json({ success: false, message: "Giao dịch thất bại", data: response.data });
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái giao dịch:", error);
        res.status(500).json({ success: false, message: "Không thể kiểm tra trạng thái giao dịch" });
    }
};

// const checkStatus = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         if (!orderId) {
//             return res.status(400).json({ success: false, message: "Thiếu orderId" });
//         }

//         // Lấy thông tin cấu hình MoMo từ .env
//         const partnerCode = process.env.MOMO_PARTNER_CODE;
//         const accessKey = process.env.MOMO_ACCESS_KEY;
//         const secretKey = process.env.MOMO_SECRET_KEY;

//         // Tạo chữ ký HMAC SHA256
//         const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
//         const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

//         // Tạo request body
//         const requestBody = {
//             partnerCode,
//             accessKey,
//             requestId: orderId,
//             orderId,
//             signature,
//             lang: "vi",
//         };

//         // Gửi yêu cầu kiểm tra trạng thái giao dịch đến MoMo
//         const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/query", requestBody);
//         const { resultCode, transId } = response.data;

//         // Lấy transaction từ DB
//         const [transaction] = await paymentModel.getTransactionByOrderId(orderId);

//         if (!transaction || !transaction.IDHocPhi) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy giao dịch để cập nhật" });
//         }

//         // Cập nhật trạng thái học phí
//         if (resultCode === 0) {
//             await paymentModel.updateTuitionStatus(transaction.IDHocPhi, "Đã thanh toán", new Date(), transId);
//         } else {
//             await paymentModel.updateTuitionStatus(transaction.IDHocPhi, "Thất bại", null, null);
//         }

//         res.status(200).json({
//             success: resultCode === 0,
//             resultCode,
//             message: resultCode === 0 ? "Giao dịch thành công" : "Giao dịch thất bại",
//             data: response.data,
//         });
//     } catch (error) {
//         console.error("Lỗi khi kiểm tra trạng thái giao dịch:", error);
//         res.status(500).json({ success: false, message: "Không thể kiểm tra trạng thái giao dịch" });
//     }
// };

module.exports = {
    createTuitionBill,
    getUnpaidTuitionByParent,
    ThanhToanHocPhi,
    MoMoCallback,
    checkStatus, // Thêm hàm checkStatus vào exports
    getPaidTuitionByParent,
};
