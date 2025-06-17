// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate để chuyển hướng
// import { motion, AnimatePresence } from "framer-motion";
// import { FaBell, FaUserCircle, FaSignOutAlt, FaSchool, FaBars } from "react-icons/fa";
// import { getThongBaoByTrangThai } from "../services/apiPhuHuynh";
// import ChangePasswordModal from "./ChangePasswordModal";

// interface HeaderProps {
//     userRole?: string;
//     userName?: string;
//     userAvatar?: string;
//     notificationCount?: number;
//     isSidebarOpen?: boolean;
//     onToggleSidebar?: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ userRole = "", userName = "", userAvatar = "", isSidebarOpen = true, onToggleSidebar = () => {} }) => {
//     const [showChangePassword, setShowChangePassword] = useState(false);
//     const [toastMessage, setToastMessage] = useState("");
//     const [toastType, setToastType] = useState<"success" | "error">("success");
//     const [showToast, setShowToast] = useState(false);
//     const [showUserMenu, setShowUserMenu] = useState(false);
//     const [hoTen, setHoTen] = useState<string | null>(null);
//     const [avatar, setAvatar] = useState<string | null>(null);
//     const [unreadCount, setUnreadCount] = useState<number>(0);
//     const navigate = useNavigate(); // Hook để chuyển hướng

//     useEffect(() => {
//         // Lấy số lượng thông báo chưa đọc từ API
//         const fetchUnreadNotifications = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

//                 const notifications = await getThongBaoByTrangThai(token, "Chưa đọc");
//                 setUnreadCount(notifications.length);
//             } catch (error) {
//                 console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
//             }
//         };

//         fetchUnreadNotifications();
//     }, []);

//     useEffect(() => {
//         // Lấy hoTen, avatar và role từ localStorage
//         const storedHoTen = localStorage.getItem("hoTen");
//         const storedAvatar = localStorage.getItem("avatar");
//         const role = localStorage.getItem("role");

//         setHoTen(storedHoTen);
//         setAvatar(storedAvatar);
//     }, []);
//     const showToastMessage = (message: string, type: "success" | "error") => {
//         setToastMessage(message);
//         setToastType(type);
//         setShowToast(true);
//         setTimeout(() => {
//             setShowToast(false);
//         }, 1000);
//     };
//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("hoTen");
//         localStorage.removeItem("avatar");
//         localStorage.removeItem("role");
//         localStorage.removeItem("SubRole");
//         localStorage.removeItem("idNhanVien");
//         localStorage.removeItem("idTruong");
//         window.location.href = "/";
//     };
//     const handleBellClick = () => {
//         navigate("/parents/notifications"); // Điều hướng tới trang thông báo
//     };
//     return (
//         <header className="bg-white shadow-md flex justify-between items-center px-4 py-3 sticky top-0 z-40">
//             {/* Logo và nút toggle sidebar */}
//             <div className="flex items-center">
//                 <button onClick={onToggleSidebar} className="mr-2 text-gray-600 hover:text-amber-500 lg:hidden p-2 rounded-full hover:bg-amber-50">
//                     <FaBars size={20} />
//                 </button>
//                 <div className="flex items-center gap-2">
//                     <div className="bg-amber-500 text-white p-2 rounded-lg">
//                         <FaSchool size={20} />
//                     </div>
//                     <h1 className="text-xl font-bold text-gray-800 hidden md:block">Hệ Thống Quản Lý Mầm Non TinyCare</h1>
//                 </div>
//             </div>

//             {/* Các nút chức năng */}
//             <div className="flex items-center gap-1 sm:gap-3">
//                 {/* Nút thông báo */}
//                 <div className="relative notification-container">
//                     <button onClick={handleBellClick} className="text-gray-600 hover:text-amber-500 p-2 rounded-full hover:bg-amber-50 transition-colors relative">
//                         <FaBell size={20} />
//                         {unreadCount > 0 && (
//                             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                                 {unreadCount > 9 ? "9+" : unreadCount}
//                             </span>
//                         )}
//                     </button>
//                 </div>

//                 {/* Menu người dùng */}
//                 <div className="relative user-menu-container">
//                     <button className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-amber-50 transition-colors" onClick={() => setShowUserMenu(!showUserMenu)}>
//                         <div className="text-right hidden md:block">
//                             <p className="text-sm font-medium text-gray-900">{hoTen}</p>
//                             <p className="text-xs text-gray-500">{userRole}</p>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center overflow-hidden">
//                             {avatar ? <img src={avatar} className="h-full w-full object-cover" /> : <FaUserCircle size={24} />}
//                         </div>
//                     </button>

//                     <AnimatePresence>
//                         {showUserMenu && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: 10 }}
//                                 className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
//                             >
//                                 <div className="p-4 border-b border-gray-100">
//                                     <p className="font-medium text-gray-900">{hoTen}</p>
//                                     <p className="text-sm text-gray-500">{userRole}</p>
//                                 </div>
//                                 <div className="divide-y divide-gray-100">
//                                     <Link
//                                         to={localStorage.getItem("role") === "Phụ Huynh" ? "/parents/profile" : "/dashboard/giaovien/profile"}
//                                         className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
//                                     >
//                                         <FaUserCircle className="text-amber-500" />
//                                         <span className="text-sm text-gray-700">Tài khoản cá nhân</span>
//                                     </Link>

//                                     <button onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</button>
//                                     <ChangePasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} showToastMessage={showToastMessage} />
//                                     <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-left transition-colors">
//                                         <FaSignOutAlt className="text-red-500" />
//                                         <span className="text-sm text-red-600">Đăng xuất</span>
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaUserCircle, FaSignOutAlt, FaSchool, FaBars, FaUser, FaCog, FaKey } from "react-icons/fa";
import { getThongBaoByTrangThai } from "../services/apiParent";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeGVPasswordModal from "./ChangeTeacherPasswordModalProps";

interface HeaderProps {
    userRole?: string;
    userName?: string;
    userAvatar?: string;
    notificationCount?: number;
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole = "", userName = "", userAvatar = "", isSidebarOpen = true, onToggleSidebar = () => {} }) => {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const role = localStorage.getItem("role"); // Lấy role từ localStorage
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [showToast, setShowToast] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [hoTen, setHoTen] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

                const notifications = await getThongBaoByTrangThai(token, "Chưa đọc");
                setUnreadCount(notifications.length);
            } catch (error) {
                console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
            }
        };

        fetchUnreadNotifications();
    }, []);

    useEffect(() => {
        const storedHoTen = localStorage.getItem("hoTen");
        const storedAvatar = localStorage.getItem("avatar");
        const role = localStorage.getItem("role");

        setHoTen(storedHoTen);
        setAvatar(storedAvatar);
    }, []);

    const showToastMessage = (message: string, type: "success" | "error") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("hoTen");
        localStorage.removeItem("avatar");
        localStorage.removeItem("role");
        localStorage.removeItem("SubRole");
        localStorage.removeItem("idNhanVien");
        localStorage.removeItem("idTruong");
        window.location.href = "/";
    };

    const handleBellClick = () => {
        navigate("/parents/notifications");
        setShowUserMenu(false);
    };

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const menu = document.querySelector(".user-menu-container");
            if (menu && !menu.contains(target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-md flex justify-between items-center px-4 py-2 sticky top-0 z-40">
            {/* Logo và nút toggle sidebar */}
            <div className="flex items-center">
                {isMobile && (
                    <button onClick={onToggleSidebar} className="mr-3 text-gray-600 hover:text-amber-500 p-2 rounded-full hover:bg-amber-50 transition-all duration-300" aria-label="Menu">
                        <FaBars size={20} />
                    </button>
                )}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2.5 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                        <FaSchool size={20} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent hidden md:block transition-all duration-300">
                        Hệ Thống Quản Lý Mầm Non TinyCare
                    </h1>
                </Link>
            </div>

            {/* Các nút chức năng */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Nút thông báo */}
                <div className="relative notification-container">
                    <button onClick={handleBellClick} className="text-gray-600 hover:text-amber-500 p-2.5 rounded-full hover:bg-amber-50 transition-all duration-300 relative" aria-label="Thông báo">
                        <FaBell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Menu người dùng */}
                <div className="relative user-menu-container">
                    <button
                        className="flex items-center gap-3 py-1.5 px-3 rounded-full hover:bg-amber-50 transition-all duration-300 border border-transparent hover:border-amber-100"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        aria-label="Menu người dùng"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">{hoTen || "Người dùng"}</p>
                            <p className="text-xs text-gray-500">{userRole || "Vai trò"}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center overflow-hidden shadow-md">
                            {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : hoTen?.charAt(0) || "P"}
                        </div>
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center overflow-hidden shadow-md">
                                            {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : hoTen?.charAt(0) || "P"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-0.5">{hoTen || "Người dùng"}</p>
                                            <p className="text-sm text-gray-500">{userRole || "Vai trò"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to={localStorage.getItem("role") === "Phụ Huynh" ? "/parents/profile" : "/dashboard/giaovien/profile"}
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <FaUser size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Tài khoản cá nhân</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setShowChangePassword(true);
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-left transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <FaKey size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Đổi mật khẩu</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-left transition-colors">
                                        <div className="w-8 h-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
                                            <FaSignOutAlt size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-red-600">Đăng xuất</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {showToast && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999]
                    ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white animate-bounce-in`}
                    style={{ minWidth: 250, fontSize: 18 }}
                >
                    {toastType === "success" ? (
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{toastMessage}</span>
                </div>
            )}

            {showChangePassword && role === "Phụ Huynh" && <ChangePasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} showToastMessage={showToastMessage} />}
            {showChangePassword && (role === "Cán Bộ" || role === "Giáo viên") && (
                <ChangeGVPasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} showToastMessage={showToastMessage} />
            )}
        </header>
    );
};

export default Header;
