const GiaoVien = require("../services/teacher.service");

// Lấy danh sách học sinh theo IDLopHoc và IDGiaoVien
const getHocSinhByLop = async (req, res) => {
    try {
        const { IDLopHoc } = req.params; // Lấy IDLopHoc từ URL
        const IDGiaoVien = req.user.ID; // Lấy IDGiaoVien từ token (đã được verifyToken thêm vào req.user)

        if (!IDLopHoc || !IDGiaoVien) {
            return res.status(400).json({ message: "IDLopHoc hoặc IDGiaoVien không hợp lệ!" });
        }

        const danhSachHocSinh = await GiaoVien.getHocSinhByLop(IDLopHoc, IDGiaoVien);

        if (danhSachHocSinh.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy học sinh nào trong lớp này!" });
        }

        res.status(200).json(danhSachHocSinh);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Thêm nhận xét học sinh
const addNhanXetHocSinh = async (req, res) => {
    const { IDHocSinh, noiDung, sucKhoe, hocTap } = req.body;
    const { ID } = req.user; // Lấy ID giáo viên từ token
    try {
        const IDNhanXet = await GiaoVien.addNhanXetHocSinh(IDHocSinh, ID, noiDung, sucKhoe, hocTap);
        res.status(201).json({ message: "Thêm nhận xét thành công", IDNhanXet });
    } catch (error) {
        console.error("Lỗi khi thêm nhận xét:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Gửi thông báo tới phụ huynh
const sendThongBao = async (req, res) => {
    const { IDPhuHuynh, tieuDe, noiDung, loaiThongBao, mucDoUuTien } = req.body;
    const { ID } = req.user; // Lấy ID giáo viên từ token
    try {
        const IDThongBao = await GiaoVien.sendThongBao(ID, IDPhuHuynh, tieuDe, noiDung, loaiThongBao, mucDoUuTien);
        res.status(201).json({ message: "Gửi thông báo thành công", IDThongBao });
    } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách đơn xin nghỉ học của lớp do giáo viên chủ nhiệm
const getDonNghiHocByLop = async (req, res) => {
    const { ID } = req.user; // Lấy ID giáo viên từ token
    try {
        if (!ID) {
            return res.status(400).json({ message: "ID giáo viên không hợp lệ!" });
        }

        const danhSachDon = await GiaoVien.getDonNghiHocByLop(ID);
        // if (!danhSachDon || danhSachDon.length === 0) {
        //     return res.status(404).json({ message: "Không có đơn xin nghỉ học nào!" });
        // }

        res.status(200).json(danhSachDon);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn xin nghỉ học:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đơn xin nghỉ học." });
    }
};

// Duyệt hoặc từ chối đơn nghỉ học
const approveDonNghiHoc = async (req, res) => {
    const { idDon } = req.params; // Lấy ID đơn từ URL
    const { approve } = req.body; // Lấy trạng thái duyệt từ body
    const { ID } = req.user; // Lấy ID giáo viên từ token

    try {
        if (!ID) {
            return res.status(400).json({ message: "ID giáo viên không hợp lệ!" });
        }

        const result = await GiaoVien.updateTrangThaiDonNghiHoc(idDon, approve);

        // if (result.affectedRows === 0) {
        //     return res.status(404).json({ message: "Không tìm thấy đơn nghỉ học hoặc không thể cập nhật!" });
        // }

        res.status(200).json({ message: approve ? "Đơn nghỉ học đã được duyệt!" : "Đơn nghỉ học đã bị từ chối!" });
    } catch (error) {
        console.error("Lỗi khi duyệt đơn nghỉ học:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi duyệt đơn nghỉ học." });
    }
};

const diemDanhHocSinh = async (req, res) => {
    const { IDHocSinh, ngay, trangThai } = req.body;

    try {
        const result = await GiaoVien.diemDanhHocSinh(IDHocSinh, ngay, trangThai);
        res.status(200).json({ message: "Điểm danh thành công!", result });
    } catch (error) {
        console.error("Lỗi khi điểm danh học sinh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getLopChuNhiem = async (req, res) => {
    const { ID } = req.user; // Lấy ID giáo viên từ token

    try {
        const lopChuNhiem = await GiaoVien.getLopChuNhiem(ID);

        if (!lopChuNhiem || lopChuNhiem.length === 0) {
            return res.status(200).json([]); // Trả về mảng rỗng nếu không có lớp
        }

        res.status(200).json(lopChuNhiem); // Trả về danh sách lớp chủ nhiệm
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp chủ nhiệm:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { ID } = req.user; // Lấy ID giáo viên từ token
        // Lấy ID giáo viên từ URL
        const avatarUrl = req.file.path; // Đường dẫn ảnh trên Cloudinary

        // Cập nhật avatar trong cơ sở dữ liệu
        const result = await GiaoVien.updateAvatar(ID, avatarUrl);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy giáo viên hoặc không thể cập nhật avatar" });
        }

        res.json({ message: "Cập nhật avatar thành công", avatar: avatarUrl });
    } catch (error) {
        console.error("Lỗi khi cập nhật avatar giáo viên:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const updateThongTinGiaoVien = async (req, res) => {
    try {
        const { ID } = req.user; // Lấy ID giáo viên từ token
        const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, CCCD } = req.body;

        const result = await GiaoVien.updateThongTinGiaoVien(ID, { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, CCCD });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy giáo viên hoặc không thể cập nhật thông tin" });
        }

        res.json({ message: "Cập nhật thông tin giáo viên thành công" });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin giáo viên:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Thêm hàm đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const { ID } = req.user; // Lấy ID giáo viên từ token xác thực
        const { oldPassword, newPassword } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ mật khẩu cũ và mật khẩu mới",
            });
        }

        // Kiểm tra độ phức tạp của mật khẩu mới (tùy chọn)
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
            });
        }

        // Gọi model để đổi mật khẩu
        const result = await GiaoVien.changePassword(ID, oldPassword, newPassword);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        res.json({
            success: true,
            message: "Đổi mật khẩu thành công",
        });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu giáo viên:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message,
        });
    }
};

module.exports = {
    getHocSinhByLop,
    addNhanXetHocSinh,
    sendThongBao,
    getDonNghiHocByLop,
    approveDonNghiHoc,
    diemDanhHocSinh,
    getLopChuNhiem,
    updateAvatar,
    updateThongTinGiaoVien,
    changePassword,
};
