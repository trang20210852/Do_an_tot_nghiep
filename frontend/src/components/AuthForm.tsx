import React, { useState } from "react";
import { login } from "../services/apiAuth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface AuthFormProps {
    role: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ role }) => {
    const { setIdTruong } = useAuth();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [matKhau, setmatKhau] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError("");
    //     try {
    //         const response = await login(emailOrPhone, matKhau, role);
    //         localStorage.setItem("token", response.data.token);
    //         localStorage.setItem("idTruong", response.data.idTruong); // 👈 Lưu ID trường học
    //         window.location.href = "/dashboard";
    //     } catch (err: any) {
    //         setError(err.response?.data?.error || "Đăng nhập thất bại");
    //     }
    // };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError("");
    //     try {
    //         const response = await login(emailOrPhone, matKhau, role);
    //         const { token, idTruong } = response.data;
    //         console.log("Login response:", response.data);

    //         // Lưu vào localStorage
    //         localStorage.setItem("token", token);
    //         localStorage.setItem("idTruong", idTruong);

    //         // Lưu vào context để dùng ở các component khác
    //         setIdTruong(idTruong);

    //         // Điều hướng tới dashboard
    //         navigate("/dashboard");
    //     } catch (err: any) {
    //         setError(err.response?.data?.error || "Đăng nhập thất bại");
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await login(emailOrPhone, matKhau, role);
            console.log("Login response:", response.data);

            const { token, user } = response.data; // 👈 Đảm bảo lấy `user`
            if (!user || !user.IDTruong) {
                throw new Error("IDTruong không tồn tại trong response");
            }

            const idTruong = user.IDTruong; // 👈 Lấy `IDTruong` từ `user`

            // Lưu vào localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("idTruong", idTruong);

            // Lưu vào context
            setIdTruong(idTruong);

            // Điều hướng tới dashboard
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="flex justify-center  items-center min-h-screen bg-[#f8f1e8] bg-orange-50">
            <div className="flex max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden max-h-[650px] ">
                {/* Cột hình ảnh */}
                <div className="hidden md:block  w-1/2 relative">
                    <img
                        src="https://kidsactivitiesblog.com/wp-content/uploads/2013/02/Good-Friend.png" // 🔥 Sử dụng ảnh bạn đã tải lên
                        alt="Login Background"
                        className="h-full w-full"
                    />
                </div>

                {/* Cột form đăng nhập */}
                <div className="w-1/2 p-12 flex flex-col justify-center bg-[#fff7eb] max-h-[650px]">
                    <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập - {role}</h2>
                    <h3 className="text-center mb-5 mt-5">Chào mừng đến với hệ thống quản lí Mầm Non Xanh</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Input Username */}
                        <div className="mt-10 mb-10 w-full flex items-center justify-center">
                            <label className="w-1/4">Username : </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="border rounded-lg px-4 py-2 w-2/3"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="relative mb-10 w-full flex items-center justify-center">
                            <label className="text-gray-700 font-semibold w-1/4">Password : </label>
                            <div className="relative ">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="border rounded-lg px-4 py-2 w-2/3 "
                                    value={matKhau}
                                    onChange={(e) => setmatKhau(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 3.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 3.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM2.3 8c-.1-.3-.3-.6-.5-.9L1 7.9C1.7 9.1 3 10.4 4.5 11.1l1.1-1.1C3.6 10 2.6 9.2 2.3 8z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Hiển thị lỗi nếu có */}
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {/* Nút Login - căn giữa */}
                        <div className="flex justify-center">
                            <button type="submit" className="w-3/4 bg-black text-white font-semibold rounded-md px-4 py-3 hover:bg-gray-800 transition duration-200">
                                LOG IN
                            </button>
                        </div>
                    </form>

                    {/* Đăng ký tài khoản */}
                    <p className="text-black mt-10 flex text-center gap-2 justify-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;

// import React, { useState } from "react";
// import { login } from "../services/apiAuth";
// import { Link } from "react-router-dom";

// interface AuthFormProps {
//     role: string;
// }

// const AuthForm: React.FC<AuthFormProps> = ({ role }) => {
//     const [emailOrPhone, setEmailOrPhone] = useState("");
//     const [matKhau, setmatKhau] = useState("");
//     const [error, setError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         try {
//             const response = await login(emailOrPhone, matKhau, role);
//             window.location.href = "/dashboard";
//         } catch (err: any) {
//             setError(err.response?.data?.error || "Đăng nhập thất bại");
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-[#f8f1e8]">
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//                 <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập - {role}</h2>
//                 <input type="text" placeholder="Email hoặc SĐT" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} required />
//                 <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={matKhau} onChange={(e) => setmatKhau(e.target.value)} required />
//                 <button type="submit">Đăng nhập</button>
//                 {error && <p>{error}</p>}
//             </form>
//         </div>
//     );
// };
// export default AuthForm;
