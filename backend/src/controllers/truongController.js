const TruongHoc = require("../models/TruongHoc");

const getAllTruongHoc = async (req, res) => {
    try {
        const danhSachTruong = await TruongHoc.getAllTruongHoc();
        res.status(200).json(danhSachTruong);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách trường học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Lấy danh sách nhân viên đã duyệt của trường
const getApprovedNhanVien = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const danhSach = await TruongHoc.getNhanVienByDuyet(idTruong, true);
        res.status(200).json(danhSach);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cán bộ đã duyệt:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Lấy danh sách nhân viên chưa duyệt của trường
const getPendingNhanVien = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const danhSach = await TruongHoc.getNhanVienByDuyet(idTruong, false);
        res.status(200).json(danhSach);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cán bộ chưa duyệt:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Duyệt một hoặc nhiều cán bộ theo danh sách ID
const approveSelectedCanBo = async (req, res) => {
    try {
        const { idTruong } = req.params; // Lấy idTruong từ URL
        const { danhSachCanBo, duyet } = req.body; // Lấy danh sách ID nhân viên và trạng thái duyệt

        if (!Array.isArray(danhSachCanBo) || danhSachCanBo.length === 0) {
            return res.status(400).json({ error: "Danh sách cán bộ không hợp lệ!" });
        }

        const result = await TruongHoc.updateTrangThaiDuyetTheoDanhSach(idTruong, danhSachCanBo, duyet);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không có cán bộ nào được cập nhật!" });
        }

        res.json({ message: `${duyet ? "Duyệt" : "Từ chối"} thành công ${result.affectedRows} cán bộ trong trường ${idTruong}` });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái duyệt cán bộ:", error);
        res.status(500).json({ error: error.message });
    }
};

const getThongTinCanBo = async (req, res) => {
    try {
        const { idTruong, idNhanVien } = req.params;
        const canBo = await TruongHoc.getThongTinCanBo(idTruong, idNhanVien);
        if (!canBo) {
            return res.status(404).json({ error: "Không tìm thấy cán bộ trong trường" });
        }
        res.status(200).json(canBo);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin cán bộ:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const updateThongTinCanBo = async (req, res) => {
    try {
        const { idTruong, idNhanVien } = req.params;
        const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email } = req.body;

        const result = await TruongHoc.updateThongTinCanBo(idTruong, idNhanVien, { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy hoặc không thể cập nhật cán bộ" });
        }

        res.json({ message: "Cập nhật thông tin cán bộ thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const deleteCanBo = async (req, res) => {
    try {
        const { idTruong, idNhanVien } = req.params;

        const result = await TruongHoc.deleteCanBo(idTruong, idNhanVien);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy cán bộ hoặc không thể xóa" });
        }

        res.json({ message: "Cán bộ đã được cập nhật trạng thái thành 'Dừng'" });
    } catch (error) {
        console.error("Lỗi khi xoá cán bộ:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const updateChucVu_PhongBan = async (req, res) => {
    try {
        const { idTruong, idNhanVien } = req.params;
        const { chucVu, phongBan } = req.body;

        const result = await TruongHoc.updateChucVu_PhongBan(idTruong, idNhanVien, { chucVu, phongBan });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy cán bộ hoặc không thể cập nhật" });
        }

        res.json({ message: "Cập nhật chức vụ và phòng ban thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật chức vụ và phòng ban:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getThongTinTruongHoc = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const thongTin = await TruongHoc.getThongTinTruongHocByID(idTruong);
        if (!thongTin) {
            return res.status(404).json({ message: "Không tìm thấy thông tin trường học." });
        }
        res.status(200).json(thongTin);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin trường học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const updateThongTinTruong = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const { tenTruong, diaChi, SDT, email_business, email_hieutruong } = req.body;

        const result = await TruongHoc.updateThongTinTruongHoc(idTruong, { tenTruong, diaChi, SDT, email_business, email_hieutruong });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy trường học hoặc không thể cập nhật" });
        }

        res.json({ message: "Cập nhật thông tin trường học thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin trường học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

module.exports = {
    getAllTruongHoc,
    getApprovedNhanVien,
    getPendingNhanVien,
    approveSelectedCanBo,
    getThongTinCanBo,
    updateThongTinCanBo,
    deleteCanBo,
    updateChucVu_PhongBan,
    getThongTinTruongHoc,
    updateThongTinTruong,
};
