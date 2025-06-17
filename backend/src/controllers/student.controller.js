const HocSinh = require("../services/student.service");

// API: GET /api/student/cccd/:cccd
const getHocSinhByCCCD = async (req, res) => {
    const { cccd } = req.params;

    try {
        const hocSinh = await HocSinh.findHocSinhByCCCD(cccd);

        if (!hocSinh) {
            return res.status(404).json({ message: "Không tìm thấy học sinh với CCCD này" });
        }

        return res.status(200).json(hocSinh);
    } catch (error) {
        console.error("Lỗi khi tìm học sinh theo CCCD:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

// // API để phụ huynh thêm học sinh
// const themHocSinhBangPhuHuynh = async (req, res) => {
//     console.log(">>> Bắt đầu thêm học sinh bằng phụ huynh");

//     // Kiểm tra thông tin user từ middleware
//     console.log("req.user:", req.user);

//     if (!req.user || !req.user.ID) {
//         return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
//     }

//     const IDPhuHuynh = req.user.ID; // từ middleware xác thực JWT
//     const { hoTen, nickname, gioiTinh, ngaySinh, thongTinSucKhoe, tinhHinhHocTap, Avatar, cccd, giayKhaiSinh, hoKhau, soThich, uuDiem, nhuocDiem, benhTat, doTuoi, moiQuanHe } = req.body;

//     try {
//         const existingHocSinh = await HocSinh.findHocSinhByCCCD(cccd);
//         console.log("existingHocSinh:", existingHocSinh); // Log thông tin học sinh đã tồn tại
//         let IDHocSinh;

//         if (existingHocSinh) {
//             // Nếu đã tồn tại học sinh, chỉ tạo liên kết
//             IDHocSinh = existingHocSinh.IDHocSinh;
//         } else {
//             // Tạo học sinh mới
//             IDHocSinh = await HocSinh.createHocSinh({
//                 hoTen,
//                 nickname,
//                 gioiTinh,
//                 ngaySinh,
//                 thongTinSucKhoe,
//                 tinhHinhHocTap,
//                 Avatar,
//                 cccd,
//                 giayKhaiSinh,
//                 hoKhau,
//                 soThich,
//                 uuDiem,
//                 nhuocDiem,
//                 benhTat,
//                 doTuoi,
//             });
//         }

//         // Tạo liên kết phụ huynh - học sinh
//         await HocSinh.createPhuHuynhHocSinh(IDPhuHuynh, IDHocSinh, moiQuanHe);

//         return res.status(200).json({ message: "Thêm học sinh thành công", IDHocSinh });
//     } catch (error) {
//         console.error("Lỗi khi thêm học sinh:", error);
//         return res.status(500).json({ message: "Lỗi máy chủ" });
//     }
// };

const themHocSinhBangPhuHuynh = async (req, res) => {
    console.log(">>> Bắt đầu thêm học sinh bằng phụ huynh");
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID;
    // Lấy các trường text từ body
    const { hoTen, nickname, gioiTinh, ngaySinh, thongTinSucKhoe, tinhHinhHocTap, cccd, soThich, uuDiem, nhuocDiem, benhTat, doTuoi, moiQuanHe } = req.body;

    // Lấy file upload từ req.files
    let giayKhaiSinhUrl = null;
    let hoKhauUrl = null;
    if (req.files && req.files.giayKhaiSinh && req.files.giayKhaiSinh[0]) {
        giayKhaiSinhUrl = req.files.giayKhaiSinh[0].path;
    }
    if (req.files && req.files.hoKhau && req.files.hoKhau[0]) {
        hoKhauUrl = req.files.hoKhau[0].path;
    }

    try {
        const existingHocSinh = await HocSinh.findHocSinhByCCCD(cccd);
        let IDHocSinh;

        if (existingHocSinh) {
            IDHocSinh = existingHocSinh.IDHocSinh;
        } else {
            // Tạo học sinh mới, KHÔNG truyền Avatar
            IDHocSinh = await HocSinh.createHocSinh({
                hoTen,
                nickname,
                gioiTinh,
                ngaySinh,
                thongTinSucKhoe,
                tinhHinhHocTap,
                cccd,
                giayKhaiSinh: giayKhaiSinhUrl,
                hoKhau: hoKhauUrl,
                soThich,
                uuDiem,
                nhuocDiem,
                benhTat,
                doTuoi,
            });
        }

        // Tạo liên kết phụ huynh - học sinh
        await HocSinh.createPhuHuynhHocSinh(IDPhuHuynh, IDHocSinh, moiQuanHe);

        return res.status(200).json({ message: "Thêm học sinh thành công", IDHocSinh });
    } catch (error) {
        console.error("Lỗi khi thêm học sinh:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

const updateNhapHoc = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }
    const { IDHocSinh, IDTruong } = req.body;

    if (!IDHocSinh) {
        return res.status(400).json({ message: "Thiếu thông tin IDHocSinh hoặc IDTruong." });
    }

    try {
        const result = await HocSinh.updateHocSinhNhapHoc(IDHocSinh, IDTruong);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy học sinh hoặc không thể cập nhật." });
        }

        res.status(200).json({ message: "Cập nhật thông tin nhập học thành công!" });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin nhập học:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// ✅ Lấy danh sách học sinh theo trường
const getHocSinhByTruong = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const danhSachHocSinh = await HocSinh.getHocSinhByTruong(idTruong);
        res.status(200).json(danhSachHocSinh);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Lấy danh sách học sinh theo trạng thái duyệt
const getHocSinhDaDuyet = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const danhSachHocSinh = await HocSinh.getHocSinhByDuyet(idTruong, true);
        res.status(200).json(danhSachHocSinh);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh theo trạng thái:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Lấy danh sách học sinh theo trạng thái duyệt
const getHocSinhChuaDuyet = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const danhSachHocSinh = await HocSinh.getHocSinhByDuyet(idTruong, false);
        res.status(200).json(danhSachHocSinh);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh theo trạng thái:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// ✅ Duyệt hoặc từ chối danh sách học sinh
const approveHocSinh = async (req, res) => {
    try {
        const { idTruong } = req.params;
        const { danhSachHocSinh, duyet } = req.body;

        if (!Array.isArray(danhSachHocSinh) || danhSachHocSinh.length === 0) {
            return res.status(400).json({ error: "Danh sách học sinh không hợp lệ!" });
        }

        const result = await HocSinh.updateTrangThaiDuyetHocSinh(idTruong, danhSachHocSinh, duyet);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không có học sinh nào được cập nhật!" });
        }

        res.json({ message: `${duyet ? "Duyệt" : "Từ chối"} thành công ${result.affectedRows} học sinh trong trường ${idTruong}` });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái duyệt học sinh:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Lấy thông tin chi tiết của một học sinh
const getThongTinHocSinh = async (req, res) => {
    try {
        const { idTruong, idHocSinh } = req.params;

        if (!idTruong || !idHocSinh) {
            return res.status(400).json({ error: "Thiếu IDTruong hoặc IDHocSinh!" });
        }

        const hocSinh = await HocSinh.getThongTinHocSinh(idTruong, idHocSinh);

        if (!hocSinh || hocSinh.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy học sinh!" });
        }

        res.json({ hocSinh });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin học sinh:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi truy xuất thông tin học sinh." });
    }
};

// // ✅ Cập nhật thông tin học sinh
// const updateThongTinHocSinh = async (req, res) => {
//     try {
//         const { idHocSinh } = req.params;
//         const { hoTen, gioiTinh, ngaySinh, diaChi, lopHoc, trangThai } = req.body;

//         const result = await HocSinh.updateThongTinHocSinh(idHocSinh, { hoTen, gioiTinh, ngaySinh, diaChi, lopHoc, trangThai });
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Không tìm thấy hoặc không thể cập nhật học sinh" });
//         }

//         res.json({ message: "Cập nhật thông tin học sinh thành công" });
//     } catch (error) {
//         console.error("Lỗi khi cập nhật thông tin học sinh:", error);
//         res.status(500).json({ message: "Lỗi server", error });
//     }
// };

const updateHocSinh = async (req, res) => {
    const { IDHocSinh } = req.params;
    console.log("IDHocSinh:", IDHocSinh); // Log IDHocSinh để kiểm tra
    const { hoTen, nickname, gioiTinh, ngaySinh, ngayNhapHoc, thongTinSucKhoe, tinhHinhHocTap, Avatar, IDTruong, IDLopHoc, cccd, giayKhaiSinh, hoKhau, soThich, uuDiem, nhuocDiem, benhTat, doTuoi } =
        req.body;

    try {
        const result = await HocSinh.updateHocSinh(IDHocSinh, {
            hoTen,
            nickname,
            gioiTinh,
            ngaySinh,
            ngayNhapHoc,
            thongTinSucKhoe,
            tinhHinhHocTap,
            Avatar,
            IDTruong,
            IDLopHoc,
            cccd,
            giayKhaiSinh,
            hoKhau,
            soThich,
            uuDiem,
            nhuocDiem,
            benhTat,
            doTuoi,
        });

        return res.status(200).json({ message: "Cập nhật thông tin học sinh thành công", result });
    } catch (error) {
        console.error("Lỗi khi cập nhật học sinh:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
// ✅ Xóa học sinh (chuyển trạng thái thành 'Nghỉ học')
const updateStatusHocSinh = async (req, res) => {
    const { IDHocSinh } = req.params;
    const { status } = req.body;

    const validStatuses = ["Đang học", "Đã tốt nghiệp", "Nghỉ học"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    try {
        const result = await HocSinh.updateStatusAndNgayRaTruong(IDHocSinh, status);
        return res.status(200).json({ message: "Cập nhật trạng thái học sinh thành công", result });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái học sinh:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

const getHocSinhByPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // từ middleware xác thực JWT

    try {
        const danhSachHocSinh = await HocSinh.getHocSinhByPhuHuynh(IDPhuHuynh);

        // if (!danhSachHocSinh || danhSachHocSinh.length === 0) {
        //     return res.status(404).json({ message: "Không tìm thấy học sinh nào liên kết với phụ huynh này!" });
        // }

        res.status(200).json(danhSachHocSinh);
    } catch (error) {
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách học sinh." });
    }
};

const deleteHocSinhByPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
    const { IDHocSinh } = req.params; // Lấy ID học sinh từ URL

    try {
        const result = await HocSinh.deleteHocSinhByPhuHuynh(IDHocSinh, IDPhuHuynh);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy học sinh hoặc bạn không có quyền xóa học sinh này!" });
        }

        res.status(200).json({ message: "Xóa học sinh thành công!" });
    } catch (error) {
        console.error("[ERROR] Lỗi khi xóa học sinh:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xóa học sinh." });
    }
};

const getThongTinHocSinhByPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
    const { IDHocSinh } = req.params; // Lấy ID học sinh từ URL

    try {
        const hocSinh = await HocSinh.getThongTinHocSinhByPhuHuynh(IDHocSinh, IDPhuHuynh);

        if (!hocSinh) {
            return res.status(404).json({ message: "Không tìm thấy học sinh hoặc bạn không có quyền xem thông tin học sinh này!" });
        }

        res.status(200).json(hocSinh);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy thông tin học sinh:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin học sinh." });
    }
};

// Tạo đơn xin nghỉ
const createDonNghiHoc = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
    const { IDHocSinh, ngayBatDau, ngayKetThuc, lyDo } = req.body;

    try {
        // Kiểm tra xem học sinh có thuộc phụ huynh này không
        const hocSinh = await HocSinh.getThongTinHocSinhByPhuHuynh(IDHocSinh, IDPhuHuynh);
        if (!hocSinh) {
            return res.status(403).json({ message: "Bạn không có quyền tạo đơn xin nghỉ cho học sinh này!" });
        }

        // Nếu nghỉ 1 ngày, ngày bắt đầu và ngày kết thúc phải trùng nhau
        if (ngayBatDau === ngayKetThuc) {
            console.log("Đơn xin nghỉ 1 ngày");
        } else if (new Date(ngayBatDau) > new Date(ngayKetThuc)) {
            return res.status(400).json({ message: "Ngày bắt đầu không được lớn hơn ngày kết thúc!" });
        }

        // Tạo đơn xin nghỉ
        const IDDon = await HocSinh.createDonNghiHoc(IDHocSinh, IDPhuHuynh, ngayBatDau, ngayKetThuc, lyDo);
        res.status(201).json({ message: "Tạo đơn xin nghỉ thành công!", IDDon });
    } catch (error) {
        console.error("[ERROR] Lỗi khi tạo đơn xin nghỉ:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn xin nghỉ." });
    }
};

const getDonNghiHocByHocSinh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const { IDHocSinh } = req.params;

    try {
        const danhSachDon = await HocSinh.getDonNghiHocByHocSinh(IDHocSinh);
        res.status(200).json(danhSachDon);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn xin nghỉ:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đơn xin nghỉ." });
    }
};

// // Tạo đơn chuyển trường
// const createDonChuyenTruong = async (req, res) => {
//     if (!req.user || !req.user.ID) {
//         return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
//     }

//     const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
//     const { IDHocSinh, IDTruongHienTai, IDTruongMuonChuyen, lyDo } = req.body;

//     try {
//         const IDDon = await HocSinh.createDonChuyenTruong({
//             IDHocSinh,
//             IDPhuHuynh,
//             IDTruongHienTai,
//             IDTruongMuonChuyen,
//             lyDo,
//         });
//         res.status(201).json({ message: "Tạo đơn chuyển trường thành công!", IDDon });
//     } catch (error) {
//         console.error("[ERROR] Lỗi khi tạo đơn chuyển trường:", error);
//         res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn chuyển trường." });
//     }
// };

// Tạo đơn chuyển trường
// Tạo đơn chuyển trường

// Tạo đơn chuyển trường
const createDonChuyenTruong = async (req, res) => {
    try {
        const { IDHocSinh, IDTruongHienTai, IDTruongMuonChuyen, lyDo } = req.body;
        const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
        const minhChung = req.file ? req.file.path : null; // Xử lý file minh chứng

        if (!IDHocSinh || !IDTruongHienTai || !IDTruongMuonChuyen || !lyDo) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
        }

        const IDDon = await HocSinh.createDonChuyenTruong({
            IDHocSinh,
            IDPhuHuynh,
            IDTruongHienTai,
            IDTruongMuonChuyen,
            lyDo,
            minhChung,
        });

        res.status(201).json({ message: "Tạo đơn chuyển trường thành công!", IDDon });
    } catch (error) {
        console.error("[ERROR] Lỗi khi tạo đơn chuyển trường:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn chuyển trường." });
    }
};

// Lấy danh sách đơn chuyển trường theo phụ huynh
const getDonChuyenTruongByPhuHuynh = async (req, res) => {
    if (!req.user || !req.user.ID) {
        console.log("[ERROR] Token không hợp lệ hoặc thiếu thông tin người dùng!");
        return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin người dùng!" });
    }

    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token
    console.log("[DEBUG] IDPhuHuynh từ token:", IDPhuHuynh);

    try {
        const donChuyenTruongList = await HocSinh.getDonChuyenTruongByPhuHuynh(IDPhuHuynh);
        console.log("[DEBUG] Kết quả từ database:", donChuyenTruongList);

        res.status(200).json(donChuyenTruongList);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn chuyển trường:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đơn chuyển trường." });
    }
};

const getDonChuyenTruongByCon = async (req, res) => {
    const { IDHocSinh } = req.params;
    const IDPhuHuynh = req.user.ID; // Lấy ID phụ huynh từ token

    try {
        const donChuyenTruong = await HocSinh.getDonChuyenTruongByCon(IDPhuHuynh, IDHocSinh);

        res.status(200).json(donChuyenTruong || []);
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn chuyển trường:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đơn chuyển trường." });
    }
};

// Lấy danh sách đơn chuyển trường theo trạng thái
const getDanhSachDonChuyenTruong = async (req, res) => {
    const { IDTruong } = req.params;
    const { isCurrentSchool } = req.query; // true nếu là trường hiện tại, false nếu là trường muốn chuyển

    try {
        const danhSachDon = await HocSinh.getDanhSachDonChuyenTruong(IDTruong, isCurrentSchool === "true");

        // if (!danhSachDon || danhSachDon.length === 0) {
        //     return res.status(404).json({ message: "Không có đơn chuyển trường nào!" });
        // }
        res.status(200).json(danhSachDon || []); // Trả
    } catch (error) {
        console.error("[ERROR] Lỗi khi lấy danh sách đơn chuyển trường:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách đơn chuyển trường." });
    }
};

// Duyệt hoặc từ chối đơn chuyển trường
const approveChuyenTruong = async (req, res) => {
    const { IDDon } = req.params;
    const { trangThai, isCurrentSchool } = req.body; // isCurrentSchool: true nếu là trường hiện tại, false nếu là trường muốn chuyển

    try {
        if (isCurrentSchool) {
            // Duyệt ở trường hiện tại
            await HocSinh.updateTrangThaiDonChuyenTruong(IDDon, trangThai, null);
        } else {
            // Duyệt ở trường muốn chuyển
            await HocSinh.updateTrangThaiDonChuyenTruong(IDDon, "Đã duyệt", trangThai);
        }

        res.status(200).json({ message: `Đơn chuyển trường đã được cập nhật trạng thái: ${trangThai}` });
    } catch (error) {
        console.error("[ERROR] Lỗi khi duyệt đơn chuyển trường:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi duyệt đơn chuyển trường." });
    }
};

// const approveChuyenTruong = async (req, res) => {
//     const { IDDon } = req.params;
//     const { trangThai, isCurrentSchool } = req.body; // isCurrentSchool: true nếu là trường hiện tại, false nếu là trường muốn chuyển

//     try {
//         // Kiểm tra trạng thái hiện tại của đơn
//         const donChuyenTruong = await HocSinh.getDonChuyenTruongByID(IDDon);

//         if (!donChuyenTruong) {
//             return res.status(404).json({ message: "Không tìm thấy đơn chuyển trường!" });
//         }

//         if (isCurrentSchool) {
//             // Duyệt ở trường hiện tại
//             if (donChuyenTruong.trangThaiTruongHienTai === "Đã duyệt") {
//                 return res.status(400).json({ message: "Trường hiện tại đã duyệt đơn này!" });
//             }

//             await HocSinh.updateTrangThaiDonChuyenTruong(IDDon, trangThai, "Chờ duyệt");
//             res.status(200).json({ message: `Đơn chuyển trường đã được duyệt bởi trường hiện tại: ${trangThai}` });
//         } else {
//             // Duyệt ở trường muốn chuyển
//             if (donChuyenTruong.trangThaiTruongHienTai !== "Đã duyệt") {
//                 return res.status(400).json({ message: "Trường hiện tại chưa duyệt đơn này!" });
//             }

//             await HocSinh.updateTrangThaiDonChuyenTruong(IDDon, "Đã duyệt", trangThai);

//             // Nếu trường muốn chuyển duyệt, gửi đơn tới phần approveHocSinh
//             if (trangThai === "Đã duyệt") {
//                 await HocSinh.approveHocSinh(donChuyenTruong.IDHocSinh, donChuyenTruong.IDTruongMuonChuyen);
//             }

//             res.status(200).json({ message: `Đơn chuyển trường đã được duyệt bởi trường muốn chuyển: ${trangThai}` });
//         }
//     } catch (error) {
//         console.error("[ERROR] Lỗi khi duyệt đơn chuyển trường:", error);
//         res.status(500).json({ message: "Đã xảy ra lỗi khi duyệt đơn chuyển trường." });
//     }
// };

// Lấy danh sách điểm danh của học sinh
const getDiemDanhByHocSinh = async (req, res) => {
    const { IDHocSinh } = req.params;

    try {
        const diemDanh = await HocSinh.getDiemDanhByHocSinh(IDHocSinh);
        res.status(200).json(diemDanh);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách điểm danh:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách nhận xét của giáo viên về học sinh
const getNhanXetByHocSinh = async (req, res) => {
    const { IDHocSinh } = req.params;

    try {
        const nhanXet = await HocSinh.getNhanXetByHocSinh(IDHocSinh);
        res.status(200).json(nhanXet);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhận xét:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const updateAvatarHocSinh = async (req, res) => {
    try {
        const { IDHocSinh } = req.params;
        const avatarUrl = req.file.path; // Đường dẫn ảnh trên Cloudinary

        const result = await HocSinh.updateAvatarHocSinh(IDHocSinh, avatarUrl);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy học sinh hoặc không thể cập nhật avatar" });
        }

        res.json({ message: "Cập nhật avatar thành công", avatar: avatarUrl });
    } catch (error) {
        console.error("[ERROR] Lỗi khi cập nhật avatar học sinh:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

module.exports = {
    getHocSinhByCCCD,
    themHocSinhBangPhuHuynh,
    updateNhapHoc,
    getHocSinhByTruong,
    getHocSinhDaDuyet,
    getHocSinhChuaDuyet,
    approveHocSinh,
    getThongTinHocSinh,
    updateHocSinh,
    updateStatusHocSinh,
    getHocSinhByPhuHuynh,
    deleteHocSinhByPhuHuynh,
    getThongTinHocSinhByPhuHuynh,
    createDonNghiHoc,

    getDonNghiHocByHocSinh,
    createDonChuyenTruong,
    getDonChuyenTruongByPhuHuynh,
    getDiemDanhByHocSinh,
    getNhanXetByHocSinh,
    getDonChuyenTruongByCon,
    approveChuyenTruong,
    getDanhSachDonChuyenTruong,
    updateAvatarHocSinh,
};
