const TruongHoc = require("../../services/school/school.service");
const mysql = require("../../config/db");

// Duyệt trường
const approveTruongHoc = async (req, res) => {
    try {
        const { idTruong } = req.params;

        const result = await TruongHoc.approveTruongHoc(idTruong);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy trường học!" });
        }

        res.status(200).json({ message: "Trường học đã được duyệt thành công!" });
    } catch (error) {
        console.error("Lỗi khi duyệt trường học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Ban trường
const banTruongHoc = async (req, res) => {
    try {
        const { idTruong } = req.params;

        const result = await TruongHoc.banTruongHoc(idTruong);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy trường học!" });
        }

        res.status(200).json({ message: "Trường học đã bị ban thành công!" });
    } catch (error) {
        console.error("Lỗi khi ban trường học:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

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

const searchTruongHoc = async (req, res) => {
    try {
        const { diaChi } = req.query;

        if (!diaChi) {
            return res.status(400).json({ message: "Thiếu thông tin địa chỉ để tìm kiếm!" });
        }

        console.log("[DEBUG] Giá trị diaChi nhận được:", diaChi);

        const query = `
            SELECT IDTruong, tenTruong, diaChi, SDT, email_business, rating, Avatar
            FROM TruongHoc
            WHERE diaChi LIKE ?
        `;

        const [results] = await mysql.execute(query, [`%${diaChi}%`]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy trường học phù hợp!" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("[ERROR] Lỗi khi tìm kiếm trường học:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật Avatar
const updateAvatar = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const avatarUrl = req.file.path; // Đường dẫn ảnh trên Cloudinary

        // Cập nhật Avatar trong cơ sở dữ liệu
        const result = await TruongHoc.updateAnhHoacBackgroundTruongHoc(idTruong, { Avatar: avatarUrl });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy trường học hoặc không thể cập nhật" });
        }

        res.json({ message: "Cập nhật Avatar thành công", avatar: avatarUrl });
    } catch (error) {
        console.error("Lỗi khi cập nhật Avatar:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật Background
const updateBackground = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const backgroundUrl = req.file.path; // Đường dẫn ảnh trên Cloudinary

        // Cập nhật Background trong cơ sở dữ liệu
        const result = await TruongHoc.updateAnhHoacBackgroundTruongHoc(idTruong, { background: backgroundUrl });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy trường học hoặc không thể cập nhật" });
        }

        res.json({ message: "Cập nhật Background thành công", background: backgroundUrl });
    } catch (error) {
        console.error("Lỗi khi cập nhật Background:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

module.exports = {
    approveTruongHoc,
    banTruongHoc,
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
    searchTruongHoc,
    updateAvatar,
    updateBackground,
};
