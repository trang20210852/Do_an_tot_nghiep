const mysql = require("../config/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

// 📌 Hàm tạo token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, "secret_key", { expiresIn: "7d" });
};

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

// 📌 Đăng ký Trường Học và Tạo Hiệu Trưởng
const registerTruongHoc = async (req, res) => {
    console.log("[DEBUG] registerTruongHoc - Request Body:", req.body);

    try {
        const { tenTruong, diaChi, SDT, email_business, email_hieutruong, ngayThanhLap } = req.body;

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
        });

        console.log("[SUCCESS] TruongHoc Registered - ID:", IDTruong);

        // Gửi mật khẩu đến email của Hiệu trưởng
        await sendEmail(email, "Tài khoản Hiệu trưởng", `Mật khẩu đăng nhập của bạn: ${matKhau}`);

        // Tạo token đăng nhập cho trường
        const token = generateToken(IDTruong, "truong");

        res.status(201).json({ message: "Đăng ký trường học thành công! Mật khẩu đã được gửi đến email Hiệu trưởng.", token });
    } catch (error) {
        console.error("[ERROR] registerTruongHoc Failed:", error);
        res.status(500).json({ error: error.message });
    }
};

// 📌 Đăng ký Cán Bộ (Yêu cầu chờ phê duyệt)
const registerCanBo = async (req, res) => {
    try {
        const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, IDTruong, matKhau } = req.body;
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

// 📌 Đăng ký Phụ Huynh
const registerPhuHuynh = async (req, res) => {
    try {
        const { hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau } = req.body;
        const hashedPassword = await bcrypt.hash(matKhau, 10);

        // Đăng ký phụ huynh và lấy ID
        const IDPhuHuynh = await authModel.registerPhuHuynh({
            hoTen,
            gioiTinh,
            ngaySinh,
            diaChi,
            SDT,
            email,
            matKhau: hashedPassword,
        });

        // Tạo token cho phụ huynh
        const token = generateToken(IDPhuHuynh, "phuhuynh");

        res.status(201).json({ message: "Đăng ký phụ huynh thành công!", token, IDPhuHuynh });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // 📌 Đăng nhập
// const login = async (req, res) => {
//     try {
//         const { emailOrPhone, matKhau, role } = req.body;
//         const [users] = await authModel.findUserByEmailOrPhone(emailOrPhone, role);

//         if (users.length === 0) return res.status(401).json({ error: "Tài khoản không tồn tại!" });

//         const user = users[0];
//         const isMatch = await bcrypt.compare(matKhau, user.matKhau);
//         if (!isMatch) return res.status(401).json({ error: "Mật khẩu không chính xác!" });

//         const token = generateToken(user.id, role);
//         res.json({ message: "Đăng nhập thành công!", token, ID: user.id });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const login = async (req, res) => {
    try {
        const { emailOrPhone, matKhau, role } = req.body;

        // 1️⃣ Kiểm tra nếu thiếu dữ liệu
        if (!emailOrPhone || !matKhau || !role) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        // 2️⃣ Tìm user theo email hoặc SDT
        const [users] = await authModel.findUserByEmailOrPhone(emailOrPhone, role);

        if (!users || users.length === 0) {
            return res.status(401).json({ message: "Tài khoản không tồn tại!" });
        }

        const user = users[0]; // Lấy user đầu tiên

        // 3️⃣ Kiểm tra mật khẩu NULL/undefined
        if (!user.matKhau) {
            return res.status(500).json({ message: "Lỗi dữ liệu: Mật khẩu không hợp lệ!" });
        }

        // 4️⃣ So sánh mật khẩu đã nhập với mật khẩu hash trong database
        const isMatch = await bcrypt.compare(matKhau, user.matKhau);

        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        let IDTruong = null;

        // 5️⃣ Nếu là "Cán Bộ", lấy IDTruong từ bảng TruongHoc_NhanVien
        if (role === "Cán Bộ") {
            const [result] = await authModel.findTruongByCanBo(user.IDNhanVien);

            IDTruong = result.length > 0 ? result[0].IDTruong : null;
        }

        // 6️⃣ Tạo token
        const tokenPayload = {
            ID: role === "Cán Bộ" ? user.IDNhanVien : user.ID,
            Email: user.Email,
            Role: role,
            IDTruong: IDTruong,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "7d" });

        res.json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                ID: tokenPayload.ID,
                Email: user.Email,
                Role: role,
                IDTruong: IDTruong,
            },
        });
    } catch (error) {
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
