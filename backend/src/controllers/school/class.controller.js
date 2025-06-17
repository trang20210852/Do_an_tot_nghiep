const classModel = require("../../services/school/class.service");

// ✅ Tạo lớp học mới (Không yêu cầu token)
const createLopHoc = async (req, res) => {
    try {
        const { idTruong, tenLop, doTuoi, namHoc } = req.body;

        if (!idTruong || !tenLop || !doTuoi || !namHoc) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        const result = await classModel.createLopHoc(idTruong, tenLop, doTuoi, namHoc);
        res.status(201).json({ message: "Lớp học đã được tạo", lopHocId: result.insertId });
    } catch (error) {
        console.error("Lỗi khi tạo lớp học:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// ✅ Lấy danh sách lớp học theo ID trường (Không yêu cầu token)
const getLopHocByTruong = async (req, res) => {
    try {
        const { idTruong } = req.query;

        if (!idTruong) {
            return res.status(400).json({ message: "Thiếu ID trường" });
        }

        const danhSachLop = await classModel.getLopHocByTruong(idTruong);
        res.status(200).json(danhSachLop);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const assignGiaoVienChuNhiem = async (req, res) => {
    const { IDLopHoc, IDGiaoVien } = req.body;

    try {
        const result = await classModel.assignGiaoVienChuNhiem(IDLopHoc, IDGiaoVien);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lớp học hoặc không thể cập nhật." });
        }
        res.status(200).json({ message: "Phân giáo viên chủ nhiệm thành công!" });
    } catch (error) {
        console.error("Lỗi khi phân giáo viên chủ nhiệm:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
// Chia học sinh vào lớp học
const assignHocSinhToLop = async (req, res) => {
    const { danhSachHocSinh, IDLopHoc } = req.body;

    if (!Array.isArray(danhSachHocSinh) || danhSachHocSinh.length === 0) {
        return res.status(400).json({ message: "Danh sách học sinh không hợp lệ!" });
    }

    try {
        const result = await classModel.assignHocSinhToLop(danhSachHocSinh, IDLopHoc);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không thể cập nhật học sinh vào lớp." });
        }

        res.status(200).json({ message: "Chia học sinh vào lớp thành công!", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("Lỗi khi chia học sinh vào lớp:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
// Lấy chi tiết lớp học
const getLopHocDetail = async (req, res) => {
    const { idLopHoc } = req.params;

    try {
        const lopHoc = await classModel.getLopHocDetail(idLopHoc);

        if (!lopHoc) {
            return res.status(404).json({ message: "Không tìm thấy lớp học!" });
        }

        res.status(200).json(lopHoc);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết lớp học:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const createZaloGroup = async (req, res) => {
    const { idLopHoc } = req.params;
    const { linkZaloGroup } = req.body;

    try {
        const result = await classModel.updateZaloGroup(idLopHoc, linkZaloGroup);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lớp học!" });
        }
        res.status(200).json({ message: "Nhóm Zalo đã được tạo thành công!" });
    } catch (error) {
        console.error("Lỗi khi tạo nhóm Zalo:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa lớp học
const deleteLopHoc = async (req, res) => {
    const { idLopHoc } = req.params;

    try {
        const result = await classModel.deleteLopHoc(idLopHoc);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lớp học!" });
        }

        res.status(200).json({ message: "Xóa lớp học thành công!" });
    } catch (error) {
        console.error("Lỗi khi xóa lớp học:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
module.exports = {
    createLopHoc,
    getLopHocByTruong,
    assignGiaoVienChuNhiem,
    assignHocSinhToLop,
    getLopHocDetail,
    createZaloGroup,
    deleteLopHoc,
};
