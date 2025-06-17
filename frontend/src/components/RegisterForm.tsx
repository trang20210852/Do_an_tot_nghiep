import React, { useEffect, useState } from "react";
import { registerTruongHoc, registerCanBo, registerPhuHuynh } from "../services/apiAuth";
import { Link, useNavigate } from "react-router-dom";
import { getDanhSachTruong } from "../services/school/apiSchool";
import { motion } from "framer-motion";
import {
    FaUser,
    FaSchool,
    FaIdCard,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaVenusMars,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaUserGraduate,
    FaCheckCircle,
    FaArrowLeft,
    FaShieldAlt,
    FaInfoCircle,
} from "react-icons/fa";

interface RegisterFormProps {
    role: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
    const [formData, setFormData] = useState<any>({
        tenTruong: "",
        diaChi: "",
        CCCD: "",
        SDT: "",
        email: "",
        email_business: "",
        email_hieutruong: "",
        ngayThanhLap: "",
        matKhau: "",
        nhapLaiMatKhau: "",
        hoTen: "",
        gioiTinh: "",
        ngaySinh: "",
        IDTruong: "",
        giayPhepHoatDong: "",
        loaiHinh: "",
    });

    const [gioiTinh, setGioiTinh] = useState("");
    const [giayPhepHoatDongFile, setGiayPhepHoatDongFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [danhSachTruong, setDanhSachTruong] = useState<{ IDTruong: number; tenTruong: string }[]>([]);
    const [truongDuocChon, setTruongDuocChon] = useState<number | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [passwordFeedback, setPasswordFeedback] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDanhSachTruong();
                setDanhSachTruong(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách trường:", err);
            }
        };
        fetchData();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(""); // Reset error on input change
        setIsLoading(false);
        // Check password strength when password field changes
        if (name === "matKhau") {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password: string) => {
        let strength = 0;

        // Validate: Mật khẩu phải dài hơn 6 ký tự
        if (password.length < 7) {
            setPasswordStrength(0);
            setPasswordFeedback("Mật khẩu phải dài hơn 6 ký tự");
            return;
        }

        // Check password length >= 8
        if (password.length >= 8) strength += 1;

        // Check for mixed case
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;

        // Check for numbers
        if (password.match(/\d/)) strength += 1;

        // Check for special chars
        if (password.match(/[^a-zA-Z\d]/)) strength += 1;

        setPasswordStrength(strength);

        // Set feedback message
        if (strength === 0) setPasswordFeedback("Mật khẩu quá yếu");
        else if (strength === 1) setPasswordFeedback("Mật khẩu yếu");
        else if (strength === 2) setPasswordFeedback("Mật khẩu trung bình");
        else if (strength === 3) setPasswordFeedback("Mật khẩu mạnh");
        else setPasswordFeedback("Mật khẩu rất mạnh");
    };
    const handleGioiTinhChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGioiTinh(e.target.value);
        setFormData({ ...formData, gioiTinh: e.target.value });
    };

    const handleTruongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruongDuocChon(Number(e.target.value));
        setFormData({ ...formData, IDTruong: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (error) return;
        setError("");
        if (formData.matKhau !== formData.nhapLaiMatKhau) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }

        setIsLoading(true);

        try {
            let response;
            if (role === "Trường Học") {
                // Tạo FormData để gửi file
                const data = new FormData();
                data.append("tenTruong", formData.tenTruong);
                data.append("diaChi", formData.diaChi);
                data.append("SDT", formData.SDT);
                data.append("email_business", formData.email_business);
                data.append("email_hieutruong", formData.email_hieutruong);
                data.append("ngayThanhLap", formData.ngayThanhLap);
                data.append("loaiHinh", formData.loaiHinh);
                if (giayPhepHoatDongFile) {
                    data.append("giayPhepHoatDong", giayPhepHoatDongFile);
                }

                response = await registerTruongHoc(data);

                alert("Đăng ký thành công!");
                navigate("/");
            } else if (role === "Cán Bộ") {
                response = await registerCanBo({
                    hoTen: formData.hoTen,
                    gioiTinh: formData.gioiTinh,
                    ngaySinh: formData.ngaySinh,
                    diaChi: formData.diaChi,
                    SDT: formData.SDT,
                    email: formData.email,
                    IDTruong: Number(formData.IDTruong),
                    matKhau: formData.matKhau,
                });

                alert("Đăng ký thành công, vui lòng chờ duyệt.");
                navigate("/");
            } else if (role === "Phụ Huynh") {
                response = await registerPhuHuynh({
                    hoTen: formData.hoTen,
                    gioiTinh: formData.gioiTinh,
                    ngaySinh: formData.ngaySinh,
                    diaChi: formData.diaChi,
                    CCCD: formData.CCCD,
                    SDT: formData.SDT,
                    email: formData.email,
                    matKhau: formData.matKhau,
                });

                alert("Đăng ký thành công!");
                navigate("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Đăng ký thất bại");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    const getFormTitle = () => {
        switch (role) {
            case "Trường Học":
                return "Đăng Ký Trường Học";
            case "Cán Bộ":
                return "Đăng Ký Tài Khoản Cán Bộ";
            case "Phụ Huynh":
                return "Đăng Ký Tài Khoản Phụ Huynh";
            default:
                return "Đăng Ký";
        }
    };

    const getFormIcon = () => {
        switch (role) {
            case "Trường Học":
                return <FaSchool className="text-4xl text-amber-500" />;
            case "Cán Bộ":
                return <FaUserGraduate className="text-4xl text-amber-500" />;
            case "Phụ Huynh":
                return <FaUser className="text-4xl text-amber-500" />;
            default:
                return <FaUser className="text-4xl text-amber-500" />;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8">
            <motion.div className="w-full max-w-5xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-2xl">
                    {/* Left side - Image with overlay */}
                    <div className="hidden md:block md:w-2/5 bg-black relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 to-black/80 z-10"></div>
                        <img
                            src="https://kidsactivitiesblog.com/wp-content/uploads/2013/02/Good-Friend.png"
                            alt="Hệ Thống Quản Lý Mầm Non TinyCare"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between z-20 p-8">
                            <div className="mb-auto">
                                <div className="flex items-center">
                                    <div className="bg-amber-500 p-3 rounded-full">
                                        <FaSchool className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl ml-3">Hệ Thống Quản Lý Mầm Non TinyCare</h3>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Nuôi dưỡng tương lai, vun đắp ước mơ</h2>
                                <p className="text-amber-200 mb-6">Hệ thống giáo dục mầm non chất lượng cao</p>

                                <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                                    <div className="flex items-center text-yellow-300 mb-2">
                                        <FaShieldAlt className="mr-2" />
                                        <span className="font-medium">Bảo vệ thông tin</span>
                                    </div>
                                    <p className="text-white/80 text-sm">Thông tin của bạn được bảo mật tuyệt đối. Chúng tôi cam kết không chia sẻ dữ liệu cá nhân với bất kỳ bên thứ ba nào.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto max-h-[700px]">
                        <Link to="/" className="flex items-center text-amber-600 hover:text-amber-700 mb-6 transition-colors">
                            <FaArrowLeft className="mr-2" />
                            <span>Quay lại trang đăng nhập</span>
                        </Link>

                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-4 shadow-md">{getFormIcon()}</div>
                            <h2 className="text-2xl font-bold text-gray-900">{getFormTitle()}</h2>
                            <p className="text-gray-600 mt-2">Hoàn thành thông tin để tạo tài khoản mới</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <FaInfoCircle className="mr-2 text-red-500" />
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Form fields for Trường Học */}
                            {role === "Trường Học" && (
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-5">
                                    <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">Thông tin trường học</h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Tên trường <span className="text-amber-600">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaSchool className="text-amber-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="tenTruong"
                                                    placeholder="Tên trường học"
                                                    onChange={handleChange}
                                                    className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Địa chỉ <span className="text-amber-600">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaMapMarkerAlt className="text-amber-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="diaChi"
                                                    placeholder="Địa chỉ trường học"
                                                    onChange={handleChange}
                                                    className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Số điện thoại <span className="text-amber-600">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaPhone className="text-amber-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="SDT"
                                                    placeholder="Số điện thoại liên hệ"
                                                    onChange={handleChange}
                                                    className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Email trường <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaEnvelope className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email_business"
                                                        placeholder="Email chính thức của trường"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Email hiệu trưởng <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaEnvelope className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email_hieutruong"
                                                        placeholder="Email của hiệu trưởng"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            {/* ...existing code... */}
                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Loại hình <span className="text-amber-600">*</span>
                                                </label>
                                                <select
                                                    name="loaiHinh"
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm bg-white"
                                                    required
                                                >
                                                    <option value="">Chọn loại hình</option>
                                                    <option value="Công lập">Công lập</option>
                                                    <option value="Tư thục">Tư thục</option>
                                                </select>
                                            </div>

                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Giấy phép hoạt động <span className="text-amber-600">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="giayPhepHoatDong"
                                                    accept="image/*"
                                                    onChange={(e) => setGiayPhepHoatDongFile(e.target.files?.[0] || null)}
                                                    className="w-full p-2 border border-amber-300 rounded-lg"
                                                    required
                                                />
                                            </div>
                                            {/* ...existing code... */}
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Ngày thành lập <span className="text-amber-600">*</span>
                                            </label>
                                            <div className="flex items-center">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaCalendarAlt className="text-amber-500" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="ngayThanhLap"
                                                    onChange={handleChange}
                                                    className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form fields for Cán Bộ */}
                            {role === "Cán Bộ" && (
                                <>
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-5">
                                        <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">Thông tin cá nhân</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Họ và tên <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaUser className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="hoTen"
                                                        placeholder="Họ và tên đầy đủ"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Giới tính <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaVenusMars className="text-amber-500" />
                                                        </div>
                                                        <select
                                                            name="gioiTinh"
                                                            value={gioiTinh}
                                                            onChange={handleGioiTinhChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm bg-white"
                                                            required
                                                        >
                                                            <option value="">Chọn giới tính</option>
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Ngày sinh <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaCalendarAlt className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="date"
                                                            name="ngaySinh"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Địa chỉ <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaMapMarkerAlt className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="diaChi"
                                                        placeholder="Địa chỉ thường trú"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Số điện thoại <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaPhone className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="SDT"
                                                            placeholder="Số điện thoại liên hệ"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Email <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaEnvelope className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Địa chỉ email"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-5">
                                        <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">Thông tin làm việc</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Trường học <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaSchool className="text-amber-500" />
                                                    </div>
                                                    <select
                                                        name="IDTruong"
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm bg-white"
                                                        value={truongDuocChon || ""}
                                                        onChange={handleTruongChange}
                                                        required
                                                    >
                                                        <option value="">Chọn trường học</option>
                                                        {danhSachTruong.map((truong) => (
                                                            <option key={truong.IDTruong} value={truong.IDTruong}>
                                                                {truong.tenTruong}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Mật khẩu <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            name="matKhau"
                                                            placeholder="Nhập mật khẩu"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                            <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-amber-500 focus:outline-none">
                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {formData.matKhau && (
                                                        <div className="mt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-gray-600">{passwordFeedback}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                                                <div
                                                                    className={`h-full rounded-full ${
                                                                        passwordStrength === 0
                                                                            ? "bg-red-500"
                                                                            : passwordStrength === 1
                                                                            ? "bg-orange-500"
                                                                            : passwordStrength === 2
                                                                            ? "bg-yellow-500"
                                                                            : passwordStrength === 3
                                                                            ? "bg-green-500"
                                                                            : "bg-emerald-500"
                                                                    }`}
                                                                    style={{ width: `${passwordStrength * 25}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Xác nhận mật khẩu <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="nhapLaiMatKhau"
                                                            placeholder="Nhập lại mật khẩu"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                            <button type="button" onClick={toggleConfirmPasswordVisibility} className="text-gray-500 hover:text-amber-500 focus:outline-none">
                                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Form fields for Phụ Huynh */}
                            {role === "Phụ Huynh" && (
                                <>
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-5">
                                        <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">Thông tin cá nhân</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Họ và tên <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaUser className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="hoTen"
                                                        placeholder="Họ và tên đầy đủ"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Giới tính <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaVenusMars className="text-amber-500" />
                                                        </div>
                                                        <select
                                                            name="gioiTinh"
                                                            value={gioiTinh}
                                                            onChange={handleGioiTinhChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm bg-white"
                                                            required
                                                        >
                                                            <option value="">Chọn giới tính</option>
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Ngày sinh <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaCalendarAlt className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="date"
                                                            name="ngaySinh"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Địa chỉ <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaMapMarkerAlt className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="diaChi"
                                                        placeholder="Địa chỉ thường trú"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-5">
                                        <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">Thông tin liên hệ và tài khoản</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Số CCCD <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaIdCard className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="CCCD"
                                                            placeholder="Căn cước công dân"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Số điện thoại <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaPhone className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="SDT"
                                                            placeholder="Số điện thoại liên hệ"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Email <span className="text-amber-600">*</span>
                                                </label>
                                                <div className="flex items-center">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaEnvelope className="text-amber-500" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Địa chỉ email"
                                                        onChange={handleChange}
                                                        className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Mật khẩu <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            name="matKhau"
                                                            placeholder="Nhập mật khẩu"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                            <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-amber-500 focus:outline-none">
                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {formData.matKhau && (
                                                        <div className="mt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-gray-600">{passwordFeedback}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                                                <div
                                                                    className={`h-full rounded-full ${
                                                                        passwordStrength === 0
                                                                            ? "bg-red-500"
                                                                            : passwordStrength === 1
                                                                            ? "bg-orange-500"
                                                                            : passwordStrength === 2
                                                                            ? "bg-yellow-500"
                                                                            : passwordStrength === 3
                                                                            ? "bg-green-500"
                                                                            : "bg-emerald-500"
                                                                    }`}
                                                                    style={{ width: `${passwordStrength * 25}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative">
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                        Xác nhận mật khẩu <span className="text-amber-600">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <FaLock className="text-amber-500" />
                                                        </div>
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="nhapLaiMatKhau"
                                                            placeholder="Nhập lại mật khẩu"
                                                            onChange={handleChange}
                                                            className="pl-10 w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                                            required
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                            <button type="button" onClick={toggleConfirmPasswordVisibility} className="text-gray-500 hover:text-amber-500 focus:outline-none">
                                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-4">
                                {/* <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all ${
                                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Đăng ký tài khoản
                                        </>
                                    )}
                                </button> */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all ${
                                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Đăng ký tài khoản
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Đã có tài khoản?{" "}
                                    <Link to="/" className="font-medium text-amber-600 hover:text-amber-700 transition-colors">
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterForm;
