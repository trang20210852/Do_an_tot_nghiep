const DanhGiaTruong = require("../../services/parent/schoolReview.service");
const TruongHoc = require("../../services/school/school.service");

const addDanhGia = async (req, res) => {
    const { IDTruong, rating, comment } = req.body;
    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token

    if (!IDTruong || !rating) {
        return res.status(400).json({ message: "Thiếu thông tin IDTruong hoặc rating!" });
    }

    try {
        // Thêm đánh giá
        await DanhGiaTruong.addDanhGia(IDPhuHuynh, IDTruong, rating, comment);

        // Cập nhật rating trung bình cho trường
        const averageRating = await DanhGiaTruong.getAverageRating(IDTruong);
        await TruongHoc.updateRating(IDTruong, averageRating);

        res.status(201).json({ message: "Đánh giá thành công!" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi thêm đánh giá:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi thêm đánh giá." });
    }
};

const getDanhGiaByTruong = async (req, res) => {
    const { IDTruong } = req.params;

    try {
        const danhGiaList = await DanhGiaTruong.getDanhGiaByTruong(IDTruong);
        res.status(200).json(danhGiaList);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đánh giá:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đánh giá." });
    }
};

module.exports = {
    addDanhGia,
    getDanhGiaByTruong,
};
