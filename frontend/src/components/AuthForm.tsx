import React, { useState } from "react";
import { login } from "../services/apiAuth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaSchool, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface AuthFormProps {
    role: string;
}

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const AuthForm: React.FC<AuthFormProps> = ({ role }) => {
    const { setIdTruong } = useAuth();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [matKhau, setmatKhau] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError("");
    //     setIsLoading(true);

    //     try {
    //         const response = await login(emailOrPhone, matKhau, role);
    //         console.log("Login response:", response.data);

    //         const { token, user } = response.data;

    //         if (role === "Cán Bộ") {
    //             if (!user || !user.IDTruong) {
    //                 throw new Error("IDTruong không tồn tại trong response cho Cán Bộ");
    //             }
    //             const idTruong = user.IDTruong;
    //             localStorage.setItem("idTruong", idTruong);
    //             setIdTruong(idTruong);
    //         }

    //         localStorage.setItem("token", token);
    //         localStorage.setItem("role", role);

    //         if (role === "Cán Bộ") {
    //             if (!user || !user.IDTruong) {
    //                 throw new Error("IDTruong không tồn tại trong response cho Cán Bộ");
    //             }

    //             const idTruong = user.IDTruong;
    //             localStorage.setItem("idTruong", idTruong);
    //             setIdTruong(idTruong);

    //             // Kiểm tra SubRole
    //             if (user.SubRole === "Admin") {
    //                 navigate("/admin"); // Chuyển hướng đến trang admin
    //                 return;
    //             }

    //             navigate("/dashboard");
    //         } else if (role === "Phụ Huynh") {
    //             navigate("/parents");
    //         }
    //     } catch (err: any) {
    //         console.error("Login error:", err);
    //         setError(err.response?.data?.error || err.message || "Đăng nhập thất bại");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await login(emailOrPhone, matKhau, role);
            console.log("Login response:", response.data);

            const { token, user } = response.data;

            // Lưu token và role vào localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("hoTen", user.hoTen); // Lưu hoTen
            localStorage.setItem("avatar", user.avatar);
            localStorage.setItem("id", user.ID);
            localStorage.setItem("SubRole", user.SubRole);
            if (role === "Cán Bộ") {
                // Kiểm tra SubRole
                if (user.SubRole === "Admin") {
                    console.log("Đăng nhập với vai trò Admin");
                    localStorage.setItem("SubRole", "Admin");
                    navigate("/admin"); // Chuyển hướng đến trang admin
                    return;
                }

                // Nếu không phải Admin, kiểm tra IDTruong
                if (!user || !user.IDTruong) {
                    console.error("Lỗi: IDTruong không tồn tại trong response cho Cán Bộ", user);
                    throw new Error("IDTruong không tồn tại trong response cho Cán Bộ");
                }

                const idTruong = user.IDTruong;
                localStorage.setItem("idTruong", idTruong);
                setIdTruong(idTruong);

                navigate("/dashboard"); // Chuyển hướng đến trang dashboard
            } else if (role === "Phụ Huynh") {
                navigate("/parents"); // Chuyển hướng đến trang phụ huynh
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || err.message || "Đăng nhập thất bại");
        } finally {
            setIsLoading(false);
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
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
                                <FaSchool className="text-amber-600 text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Đăng Nhập - {role}</h2>
                            <p className="text-gray-600 mt-2">Chào mừng đến với hệ thống quản lý Hệ Thống Quản Lý Mầm Non TinyCare</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                                    Email hoặc Số điện thoại
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-amber-500" />
                                    </div>
                                    <input
                                        id="emailOrPhone"
                                        type="text"
                                        placeholder="Nhập email hoặc số điện thoại"
                                        className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-amber-500" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        className="block w-full pl-10 pr-10 py-3 border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                        value={matKhau}
                                        onChange={(e) => setmatKhau(e.target.value)}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-amber-500 focus:outline-none">
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
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
                                            <FaSignInAlt className="mr-2" />
                                            Đăng nhập
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-700">
                                    Chưa có tài khoản?{" "}
                                    <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthForm;
