const PhuHuynh = require("../../services/parent/parent.service");
// Lấy thông tin chi tiết phụ huynh
const getThongTinPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token

    try {
        const phuHuynh = await PhuHuynh.getThongTinPhuHuynh(IDPhuHuynh);

        if (!phuHuynh) {
            return res.status(404).json({ message: "Không tìm thấy thông tin phụ huynh!" });
        }

        res.status(200).json(phuHuynh);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông tin phụ huynh:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin phụ huynh." });
    }
};

const getThongBaoPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token

    try {
        const thongBaoList = await PhuHuynh.getThongBaoPhuHuynh(IDPhuHuynh);

        // if (!thongBaoList || thongBaoList.length === 0) {
        //     return res.status(404).json({ message: "Không có thông báo nào!" });
        // }

        res.status(200).json(thongBaoList);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông báo phụ huynh:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông báo." });
    }
};

const getZaloGroupByParent = async (req, res) => {
    const { ID } = req.user; // Lấy ID phụ huynh từ token

    try {
        const zaloGroups = await PhuHuynh.getZaloGroupByParent(ID);
        if (!zaloGroups || zaloGroups.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy nhóm Zalo nào!" });
        }
        res.status(200).json(zaloGroups);
    } catch (error) {
        console.error("Lỗi khi lấy nhóm Zalo:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const updateAvatarPhuHuynh = async (req, res) => {
    try {
        const { ID } = req.user; // Lấy IDPhuHuynh từ token đã xác thực

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "Không có file avatar được tải lên" });
        }

        const avatarUrl = req.file.path; // Đường dẫn ảnh trên Cloudinary

        const result = await PhuHuynh.updateAvatarPhuHuynh(ID, avatarUrl);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy phụ huynh hoặc không thể cập nhật avatar" });
        }

        res.json({ message: "Cập nhật avatar thành công", avatar: avatarUrl });
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật avatar phụ huynh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const markThongBaoAsRead = async (req, res) => {
    try {
        const { IDThongBao } = req.params;
        const IDPhuHuynh = req.user.ID; // Lấy IDPhuHuynh từ token đã xác thực

        const result = await PhuHuynh.updateTrangThaiThongBao(IDThongBao, IDPhuHuynh);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy thông báo hoặc không thể cập nhật trạng thái" });
        }

        res.json({ message: "Cập nhật trạng thái thông báo thành công" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật trạng thái thông báo:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy thông báo theo trạng thái
const getThongBaoByTrangThai = async (req, res) => {
    try {
        const { trangThai } = req.query; // Lấy trạng thái từ query params
        const IDPhuHuynh = req.user.ID; // Lấy IDPhuHuynh từ token đã xác thực

        const notifications = await PhuHuynh.getThongBaoByTrangThai(IDPhuHuynh, trangThai);

        res.json(notifications);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông báo:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const deleteThongBao = async (req, res) => {
    try {
        const { idThongBao } = req.params; // Lấy ID thông báo từ URL
        const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token

        const result = await PhuHuynh.deleteThongBao(idThongBao, IDPhuHuynh);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy thông báo hoặc không thể xóa" });
        }

        res.json({ message: "Xóa thông báo thành công" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi xóa thông báo:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const updateThongTinPhuHuynh = async (req, res) => {
    try {
        const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
        const { hoTen, gioiTinh, ngaySinh, diaChi, CCCD, SDT, email } = req.body;

        const result = await PhuHuynh.updateThongTinPhuHuynh(IDPhuHuynh, { hoTen, gioiTinh, ngaySinh, diaChi, CCCD, SDT, email });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy phụ huynh hoặc không thể cập nhật thông tin" });
        }

        res.json({ message: "Cập nhật thông tin phụ huynh thành công" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật thông tin phụ huynh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const changePassword = async (req, res) => {
    try {
        const IDPhuHuynh = req.user.ID;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới!" });
        }

        const result = await PhuHuynh.changePassword(IDPhuHuynh, oldPassword, newPassword);
        if (!result.success) {
            return res.status(400).json({ message: result.message || "Đổi mật khẩu thất bại!" });
        }

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi đổi mật khẩu phụ huynh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};
module.exports = {
    getThongTinPhuHuynh,
    getThongBaoPhuHuynh,
    getZaloGroupByParent,
    updateAvatarPhuHuynh,
    markThongBaoAsRead,
    getThongBaoByTrangThai,
    deleteThongBao,
    updateThongTinPhuHuynh,
    changePassword,
};
