const mysql = require("../config/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const authModel = require("../services/auth.service");

// 📌 Hàm tạo token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, "secret_key", { expiresIn: "7d" });
};

// const generateToken = (userId, role, IDTruong = null) => {
//     return jwt.sign(
//         {
//             IDPhuHuynh: userId, // 👈 Dùng đúng tên trường để lấy ra sau này
//             Role: role,
//             IDTruong,
//         },
//         process.env.JWT_SECRET || "super_secret_key",
//         { expiresIn: "7d" }
//     );
// };

// 📌 Hàm gửi email
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mamnonxanh1906@gmail.com",
            pass: "qexd bhlh ydfp bpqy",
        },
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("[SUCCESS] Email Sent!");
    } catch (error) {
        console.error("[ERROR] Failed to Send Email:", error);
    }
};

const registerTruongHoc = async (req, res) => {
    console.log("[DEBUG] registerTruongHoc - Request Body:", req.body);

    try {
        const { tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap, loaiHinh } = req.body;

        // Validate các trường bắt buộc
        if (!tenTruong || !diaChi || !SDT || !email_business || !email_hieutruong || !ngayThanhLap || !loaiHinh) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_business) || !emailRegex.test(email_hieutruong)) {
            return res.status(400).json({ message: "Email không hợp lệ!" });
        }

        // Validate số điện thoại (10-11 số)
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(SDT)) {
            return res.status(400).json({ message: "Số điện thoại phải dài 10-11 số" });
        }

        // Validate ngày thành lập (yyyy-mm-dd)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ngayThanhLap)) {
            return res.status(400).json({ message: "Ngày thành lập không hợp lệ! Định dạng yyyy-mm-dd" });
        }

        // Nếu dùng multer upload file cloudinary
        let giayPhepHoatDong = null;
        if (req.file && req.file.path) {
            giayPhepHoatDong = req.file.path;
        }

        // Gọi Model để tạo trường học và tài khoản Hiệu trưởng
        const {
            IDTruong,
            matKhau,
            email_hieutruong: email,
        } = await authModel.registerTruongHoc({
            tenTruong,
            diaChi,
            SDT,
            email_business,
            email_hieutruong,
            ngayThanhLap,
            giayPhepHoatDong,
            loaiHinh,
        });

        console.log("[SUCCESS] TruongHoc Registered - ID:", IDTruong);

        // Gửi mật khẩu đến email của Hiệu trưởng
        await sendEmail(email, "Tài khoản Hiệu trưởng", `Mật khẩu đăng nhập của bạn: ${matKhau}`);

        // Tạo token đăng nhập cho trường
        const token = generateToken(IDTruong, "Trường Học");

        res.status(201).json({ message: "Đăng ký trường học thành công! Mật khẩu đã được gửi đến email Hiệu trưởng.", token });
    } catch (error) {
        console.error("[ERROR] registerTruongHoc Failed:", error);
        res.status(500).json({ error: error.message });
    }
};

// // 📌 Đăng ký Trường Học và Tạo Hiệu Trưởng
// const registerTruongHoc = async (req, res) => {
//     console.log("[DEBUG] registerTruongHoc - Request Body:", req.body);

//     try {
//         const { tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap, loaiHinh } = req.body;
//         // Nếu dùng multer upload file cloudinary
//         let giayPhepHoatDong = null;
//         if (req.file && req.file.path) {
//             giayPhepHoatDong = req.file.path;
//         }

//         // Gọi Model để tạo trường học và tài khoản Hiệu trưởng
//         const {
//             IDTruong,
//             matKhau,
//             email_hieutruong: email,
//         } = await authModel.registerTruongHoc({
//             tenTruong,
//             diaChi,
//             SDT,
//             email_business,
//             email_hieutruong,
//             ngayThanhLap,
//             giayPhepHoatDong,
//             loaiHinh,
//         });

//         console.log("[SUCCESS] TruongHoc Registered - ID:", IDTruong);

//         // Gửi mật khẩu đến email của Hiệu trưởng
//         await sendEmail(email, "Tài khoản Hiệu trưởng", `Mật khẩu đăng nhập của bạn: ${matKhau}`);

//         // Tạo token đăng nhập cho trường
//         const token = generateToken(IDTruong, "Trường Học");

//         res.status(201).json({ message: "Đăng ký trường học thành công! Mật khẩu đã được gửi đến email Hiệu trưởng.", token });
//     } catch (error) {
//         console.error("[ERROR] registerTruongHoc Failed:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

// 📌 Đăng ký Cán Bộ (Yêu cầu chờ phê duyệt)
const registerCanBo = async (req, res) => {
    try {
        const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, IDTruong, matKhau } = req.body;

        // Validate các trường bắt buộc
        if (!hoTen || !gioiTinh || !ngaySinh || !diaChi || !SDT || !email || !IDTruong || !matKhau) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ!" });
        }

        // Validate số điện thoại (10-11 số)
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(SDT)) {
            return res.status(400).json({ message: "Số điện thoại phải dài 10-11 số" });
        }

        // Validate mật khẩu tối thiểu 6 ký tự
        if (typeof matKhau !== "string" || matKhau.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        // Có thể kiểm tra trùng email hoặc SDT ở đây nếu muốn

        const hashedPassword = await bcrypt.hash(matKhau, 10);

        // Đăng ký cán bộ nhưng KHÔNG cấp token ngay (chờ phê duyệt)
        const IDCanBo = await authModel.registerCanBo({
            hoTen,
            gioiTinh,
            ngaySinh,
            diaChi,
            SDT,
            email,
            IDTruong,
            matKhau: hashedPassword,
        });

        res.status(201).json({ message: "Đăng ký cán bộ thành công! Vui lòng chờ phê duyệt từ nhà trường.", IDCanBo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // 📌 Đăng ký Cán Bộ (Yêu cầu chờ phê duyệt)
// const registerCanBo = async (req, res) => {
//     try {
//         const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, IDTruong, matKhau } = req.body;
//         const hashedPassword = await bcrypt.hash(matKhau, 10);

//         // Đăng ký cán bộ nhưng KHÔNG cấp token ngay (chờ phê duyệt)
//         const IDCanBo = await authModel.registerCanBo({
//             hoTen,
//             gioiTinh,
//             ngaySinh,
//             diaChi,
//             SDT,
//             email,
//             IDTruong,
//             matKhau: hashedPassword,
//         });

//         res.status(201).json({ message: "Đăng ký cán bộ thành công! Vui lòng chờ phê duyệt từ nhà trường.", IDCanBo });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
//};
// 📌 Đăng ký Phụ Huynh
const registerPhuHuynh = async (req, res) => {
    try {
        const { hoTen, gioiTinh, ngaySinh, diaChi, CCCD, SDT, email, matKhau } = req.body;

        // Validate các trường bắt buộc
        if (!hoTen || !gioiTinh || !ngaySinh || !diaChi || !CCCD || !SDT || !email || !matKhau) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ!" });
        }

        // Validate số điện thoại (10-11 số)
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(SDT)) {
            return res.status(400).json({ message: "Số điện thoại phải dài 10-11 số" });
        }

        // Validate mật khẩu tối thiểu 6 ký tự
        if (typeof matKhau !== "string" || matKhau.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        // Có thể kiểm tra trùng email hoặc SDT ở đây nếu muốn

        const hashedPassword = await bcrypt.hash(matKhau, 10);

        // Đăng ký phụ huynh và lấy ID
        const IDPhuHuynh = await authModel.registerPhuHuynh({
            hoTen,
            gioiTinh,
            ngaySinh,
            diaChi,
            CCCD,
            SDT,
            email,
            matKhau: hashedPassword,
        });

        // Tạo token cho phụ huynh
        const token = generateToken(IDPhuHuynh, "Phụ Huynh");

        res.status(201).json({ message: "Đăng ký phụ huynh thành công!", token, IDPhuHuynh });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const login = async (req, res) => {
//     try {
//         const { emailOrPhone, matKhau, role } = req.body;

//         if (!emailOrPhone || !matKhau || !role) {
//             return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
//         }

//         const [users] = await authModel.findUserByEmailOrPhone(emailOrPhone, role);

//         if (!users || users.length === 0) {
//             return res.status(401).json({ message: "Tài khoản không tồn tại!" });
//         }

//         const user = users[0];

//         if (!user.matKhau) {
//             return res.status(500).json({ message: "Lỗi dữ liệu: Mật khẩu không hợp lệ!" });
//         }

//         // const isMatch = await bcrypt.compare(matKhau, user.matKhau);
//         // if (!isMatch) {
//         //     return res.status(401).json({ message: "Sai mật khẩu!" });
//         // }

//         let IDTruong = null;
//         let ID = null;
//         if (role === "Cán Bộ") {
//             const [result] = await authModel.findTruongByCanBo(user.IDNhanVien);
//             IDTruong = result.length > 0 ? result[0].IDTruong : null;
//             ID = user.IDNhanVien;
//         } else if (role === "Phụ Huynh") {
//             ID = user.IDPhuHuynh;
//             // 📌 Nếu sau này muốn lấy IDTruong từ học sinh liên kết thì xử lý thêm ở đây
//         } else {
//             ID = user.ID; // fallback cho các vai trò khác
//         }

//         const tokenPayload = {
//             ID,
//             Role: role,
//             Email: user.Email || null,
//             IDTruong,
//         };

//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "7d" });

//         res.json({
//             message: "Đăng nhập thành công!",
//             token,
//             user: {
//                 ID,
//                 Role: role,
//                 Email: user.Email || null,
//                 IDTruong,
//             },
//         });
//     } catch (error) {
//         console.error("Lỗi đăng nhập:", error);
//         res.status(500).json({ message: "Lỗi server!" });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { emailOrPhone, matKhau, role } = req.body;

//         if (!emailOrPhone || !matKhau || !role) {
//             console.log("[DEBUG] ❌ Thiếu thông tin đăng nhập:", { emailOrPhone, matKhau, role }); // 👈 Log 1
//             return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
//         }

//         const [users] = await authModel.findUserByEmailOrPhone(emailOrPhone, role);

//         if (!users || users.length === 0) {
//             console.log("[DEBUG] ❌ Tài khoản không tồn tại:", { emailOrPhone, role }); // 👈 Log 2
//             return res.status(401).json({ message: "Tài khoản không tồn tại!" });
//         }

//         const user = users[0];

//         if (!user.matKhau) {
//             console.log("[DEBUG] ❌ Mật khẩu không hợp lệ trong cơ sở dữ liệu:", user); // 👈 Log 3
//             return res.status(500).json({ message: "Lỗi dữ liệu: Mật khẩu không hợp lệ!" });
//         }

//         // const isMatch = await bcrypt.compare(matKhau, user.matKhau);
//         // if (!isMatch) {
//         //     console.log("[DEBUG] ❌ Sai mật khẩu:", { emailOrPhone }); // 👈 Log 4
//         //     return res.status(401).json({ message: "Sai mật khẩu!" });
//         // }

//         let IDTruong = null;
//         let ID = null;
//         let subRole = null;
//         if (role === "Cán Bộ") {
//             const [result] = await authModel.findTruongByCanBo(user.IDNhanVien);
//             console.log("[DEBUG] ✅ Kết quả tìm trường của cán bộ:", result); // 👈 Log 5
//             IDTruong = result.length > 0 ? result[0].IDTruong : null;
//             ID = user.IDNhanVien;
//             subRole = user.role;
//         } else if (role === "Phụ Huynh") {
//             ID = user.IDPhuHuynh;
//             console.log("[DEBUG] ✅ Đăng nhập phụ huynh:", { ID }); // 👈 Log 6
//         } else {
//             ID = user.ID; // fallback cho các vai trò khác
//             console.log("[DEBUG] ✅ Đăng nhập vai trò khác:", { ID }); // 👈 Log 7
//         }

//         const tokenPayload = {
//             ID,
//             Role: role,

//             SubRole: subRole,
//             Email: user.Email || null,
//             IDTruong,
//         };

//         console.log("[DEBUG] ✅ Payload token:", tokenPayload); // 👈 Log 8

//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "7d" });

//         res.json({
//             message: "Đăng nhập thành công!",
//             token,
//             user: {
//                 ID,
//                 Role: role,
//                 SubRole: subRole,
//                 Email: user.Email || null,
//                 IDTruong,
//             },
//         });
//     } catch (error) {
//         console.error("[DEBUG] ❌ Lỗi trong quá trình đăng nhập:", error); // 👈 Log 9
//         res.status(500).json({ message: "Lỗi server!" });
//     }
// };

const login = async (req, res) => {
    try {
        const { emailOrPhone, matKhau, role } = req.body;

        if (!emailOrPhone || !matKhau || !role) {
            console.log("[DEBUG] ❌ Thiếu thông tin đăng nhập:", { emailOrPhone, matKhau, role }); // 👈 Log 1
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // Validate mật khẩu tối thiểu 6 ký tự
        if (typeof matKhau !== "string" || matKhau.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        // Validate emailOrPhone không được rỗng
        if (!emailOrPhone || typeof emailOrPhone !== "string") {
            return res.status(400).json({ message: "Email hoặc số điện thoại không hợp lệ!" });
        }
        const [users] = await authModel.findUserByEmailOrPhone(emailOrPhone, role);

        if (!users || users.length === 0) {
            console.log("[DEBUG] ❌ Tài khoản không tồn tại:", { emailOrPhone, role }); // 👈 Log 2
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        const user = users[0];

        if (!user.matKhau) {
            console.log("[DEBUG] ❌ Mật khẩu không hợp lệ trong cơ sở dữ liệu:", user); // 👈 Log 3
            return res.status(500).json({ message: "Lỗi dữ liệu: Mật khẩu không hợp lệ!" });
        }

        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) {
            console.log("[DEBUG] ❌ Sai mật khẩu:", { emailOrPhone }); // 👈 Log 4
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        let IDTruong = null;
        let ID = null;
        let subRole = null;
        if (role === "Cán Bộ") {
            const [result] = await authModel.findTruongByCanBo(user.IDNhanVien);
            console.log("[DEBUG] ✅ Kết quả tìm trường của cán bộ:", result); // 👈 Log 5
            IDTruong = result.length > 0 ? result[0].IDTruong : null;
            ID = user.IDNhanVien;
            subRole = user.role;
        } else if (role === "Phụ Huynh") {
            ID = user.IDPhuHuynh;
            console.log("[DEBUG] ✅ Đăng nhập phụ huynh:", { ID }); // 👈 Log 6
        } else {
            ID = user.ID; // fallback cho các vai trò khác
            console.log("[DEBUG] ✅ Đăng nhập vai trò khác:", { ID }); // 👈 Log 7
        }

        const tokenPayload = {
            ID,
            Role: role,
            SubRole: subRole,
            Email: user.Email || null,
            IDTruong,
        };

        console.log("[DEBUG] ✅ Payload token:", tokenPayload); // 👈 Log 8

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "7d" });

        res.json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                ID,
                Role: role,
                SubRole: subRole,
                Email: user.Email || null,
                IDTruong,
                hoTen: user.hoTen, // 👈 Thêm hoTen vào payload trả về
                avatar: user.Avatar, // 👈 Thêm avatar vào payload trả về
            },
        });
    } catch (error) {
        console.error("[DEBUG] ❌ Lỗi trong quá trình đăng nhập:", error); // 👈 Log 9
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// 📌 Đăng xuất
const logout = (req, res) => {
    res.json({ message: "Đăng xuất thành công!" });
};

module.exports = {
    registerTruongHoc,
    registerCanBo,
    registerPhuHuynh,
    login,
    logout,
};
