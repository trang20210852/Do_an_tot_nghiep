const roomModel = require("../../services/school/room.service");

const addPhongHoc = async (req, res) => {
    try {
        const { IDTruong, tenPhong, sucChua, moTa, IDGVCN, IDLopHoc } = req.body;

        if (!IDTruong || !tenPhong || !sucChua) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
        }

        const result = await roomModel.addPhongHoc({ IDTruong, tenPhong, sucChua, moTa, IDGVCN, IDLopHoc });
        res.status(201).json({ message: "Thêm phòng học thành công!", IDPhongHoc: result.insertId });
    } catch (error) {
        console.error("Lỗi khi thêm phòng học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getPhongHocByTruong = async (req, res) => {
    try {
        const { IDTruong } = req.params;

        const phongHocList = await roomModel.getPhongHocByTruong(IDTruong);
        res.status(200).json(phongHocList);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getPhongHocByID = async (req, res) => {
    try {
        const { IDPhongHoc } = req.params;

        const phongHoc = await roomModel.getPhongHocByID(IDPhongHoc);
        if (!phongHoc) {
            return res.status(404).json({ message: "Không tìm thấy phòng học!" });
        }

        res.status(200).json(phongHoc);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật phòng học
const updatePhongHoc = async (req, res) => {
    try {
        const { IDPhongHoc } = req.params;
        const { tenPhong, sucChua, moTa, IDGVCN, IDLopHoc, Status } = req.body;

        if (!tenPhong || !sucChua) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
        }

        // Kiểm tra phòng học tồn tại
        const phongHoc = await roomModel.getPhongHocByID(IDPhongHoc);
        if (!phongHoc) {
            return res.status(404).json({ message: "Không tìm thấy phòng học!" });
        }

        // Cập nhật thông tin phòng học
        const result = await roomModel.updatePhongHoc(IDPhongHoc, {
            tenPhong,
            sucChua,
            moTa,
            IDGVCN,
            IDLopHoc,
            Status: Status || phongHoc.Status, // Nếu không có Status mới, giữ nguyên Status cũ
        });

        res.status(200).json({ message: "Cập nhật phòng học thành công!", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("Lỗi khi cập nhật phòng học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Xóa phòng học (cập nhật trạng thái)
const deletePhongHoc = async (req, res) => {
    try {
        const { IDPhongHoc } = req.params;

        // Kiểm tra phòng học tồn tại
        const phongHoc = await roomModel.getPhongHocByID(IDPhongHoc);
        if (!phongHoc) {
            return res.status(404).json({ message: "Không tìm thấy phòng học!" });
        }

        // Thay đổi trạng thái phòng học thành "Ngừng sử dụng"
        const result = await roomModel.deletePhongHoc(IDPhongHoc);

        res.status(200).json({ message: "Xóa phòng học thành công!", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("Lỗi khi xóa phòng học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};
module.exports = {
    addPhongHoc,
    getPhongHocByTruong,
    getPhongHocByID,
    updatePhongHoc,
    deletePhongHoc,
};
