import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaHome,
    FaSchool,
    FaUsers,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaDoorOpen,
    FaFileAlt,
    FaList,
    FaBell,
    FaClipboardCheck,
    FaStar,
    FaSignOutAlt,
    FaUser,
    FaCaretDown,
    FaCaretUp,
    FaTachometerAlt,
    FaUserTie,
    FaBook,
    FaBars,
    FaTimes,
} from "react-icons/fa";

interface SidebarProps {
    role?: string;
    isMobile?: boolean;
    isSidebarOpen?: boolean; // thêm prop này
    onCloseSidebar?: () => void; // thêm prop này
}

const Sidebar: React.FC<SidebarProps> = ({ role = "", isMobile = false, isSidebarOpen = true, onCloseSidebar = () => {} }) => {
    const cleanRole = role.trim();
    const SubRole = localStorage.getItem("SubRole");
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        school: false,
        staff: false,
        parent: false,
    });
    // const [collapsed, setCollapsed] = useState(isMobile);
    const [notificationCount, setNotificationCount] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    // Simulated notification count
    useEffect(() => {
        if (cleanRole === "Phụ Huynh") {
            setNotificationCount(3); // Example notification count
        }
    }, [cleanRole]);

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
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

    const menuVariants = {
        open: {
            height: "auto",
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.2,
            },
        },
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const itemVariants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 },
            },
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 },
            },
        },
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile menu toggle */}
            {/* {isMobile && (
                <button onClick={() => setCollapsed(!collapsed)} className="fixed top-4 left-4 z-50 rounded-full bg-amber-500 text-white p-2 shadow-lg">
                    {collapsed ? <FaBars /> : <FaTimes />}
                </button>
            )} */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0 }}
                className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl overflow-hidden z-40 ${isSidebarOpen ? "w-[280px]" : "w-0"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                                    {cleanRole === "Cán Bộ" ? (
                                        <FaUserTie size={18} />
                                    ) : cleanRole === "Phụ Huynh" ? (
                                        <FaUser size={18} />
                                    ) : cleanRole === "Giáo Viên" ? (
                                        <FaChalkboardTeacher size={18} />
                                    ) : (
                                        "?"
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">Xin chào</h2>
                                    <div className="text-sm text-amber-300">{cleanRole || "Người dùng"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-grow overflow-y-auto py-4 px-2 sidebar-scrollbar">
                        {/* Cán Bộ Menu */}
                        {cleanRole === "Cán Bộ" && (
                            <nav>
                                <ul className="space-y-2">
                                    {SubRole === "Hiệu trưởng" && (
                                        <li>
                                            <button
                                                onClick={() => toggleSection("school")}
                                                className={`w-full text-left py-2.5 px-4 rounded-lg flex items-center justify-between ${
                                                    openSections.school ? "bg-amber-500 text-white" : "hover:bg-gray-700/50 text-gray-800"
                                                } transition-colors duration-200`}
                                            >
                                                <div className="flex items-center gap-3 ">
                                                    <FaSchool className="text-amber-300" size={18} />
                                                    <span>Quản Lý Trường</span>
                                                </div>
                                                {openSections.school ? <FaCaretUp /> : <FaCaretDown />}
                                            </button>

                                            <AnimatePresence>
                                                {openSections.school && (
                                                    <motion.ul variants={menuVariants} initial="closed" animate="open" exit="closed" className="mt-2 ml-4 space-y-1 overflow-hidden">
                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaTachometerAlt size={14} />
                                                                <span>Trang Chủ</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/staff"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/staff") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaUsers size={14} />
                                                                <span>Cán Bộ</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/student"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/student") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaUserGraduate size={14} />
                                                                <span>Học Sinh</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/classes"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/classes") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaUsers size={14} />
                                                                <span>Lớp</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/phonghoc"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/phonghoc") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaDoorOpen size={14} />
                                                                <span>Phòng Học</span>
                                                            </Link>
                                                        </motion.li>
                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/tuition-management"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/tuition-management") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaStar size={14} />
                                                                <span>Học Phí</span>
                                                            </Link>
                                                        </motion.li>
                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="truong/:idTruong/profile"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("truong/:idTruong/profile") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaFileAlt size={14} />
                                                                <span>Hồ Sơ Trường</span>
                                                            </Link>
                                                        </motion.li>
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    )}

                                    {/* Nếu là Cán Bộ: hiển thị trực tiếp các link quản lý cán bộ */}
                                    {SubRole === "Cán bộ" && (
                                        <li>
                                            <Link
                                                to="/dashboard/giaovien/lop-chu-nhiem"
                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                    isActive("/dashboard/giaovien/lop-chu-nhiem") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                } transition-colors duration-200`}
                                            >
                                                <FaList size={14} />
                                                <span>Danh Sách Lớp Quản Lý</span>
                                            </Link>
                                            <Link
                                                to="/dashboard/giaovien/send-notification"
                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                    isActive("/dashboard/giaovien/send-notification") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                } transition-colors duration-200`}
                                            >
                                                <FaBell size={14} />
                                                <span>Gửi Thông Báo</span>
                                            </Link>
                                            <Link
                                                to="/dashboard/giaovien/approve-leave"
                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                    isActive("/dashboard/giaovien/approve-leave") ? "bg-amber-600/20 text-amber-400" : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                } transition-colors duration-200`}
                                            >
                                                <FaClipboardCheck size={14} />
                                                <span>Duyệt Đơn Xin Nghỉ</span>
                                            </Link>
                                        </li>
                                    )}
                                    {/* Quản Lý Cán Bộ: luôn hiện với cả Hiệu trưởng và Cán bộ */}
                                    {SubRole === "Hiệu trưởng" && (
                                        <li>
                                            <button
                                                onClick={() => toggleSection("staff")}
                                                className={`w-full text-left py-2.5 px-4 rounded-lg flex items-center justify-between ${
                                                    openSections.staff ? "bg-amber-500 text-white" : "hover:bg-gray-700/50 text-gray-800"
                                                } transition-colors duration-200`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FaChalkboardTeacher className="text-amber-300" size={18} />
                                                    <span>Quản Lý Thông Tin</span>
                                                </div>
                                                {openSections.staff ? <FaCaretUp /> : <FaCaretDown />}
                                            </button>

                                            <AnimatePresence>
                                                {openSections.staff && (
                                                    <motion.ul variants={menuVariants} initial="closed" animate="open" exit="closed" className="mt-2 ml-4 space-y-1 overflow-hidden">
                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/giaovien/lop-chu-nhiem"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/giaovien/lop-chu-nhiem")
                                                                        ? "bg-amber-600/20 text-amber-400"
                                                                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaList size={14} />
                                                                <span>Danh Sách Lớp Quản Lý</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/giaovien/send-notification"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/giaovien/send-notification")
                                                                        ? "bg-amber-600/20 text-amber-400"
                                                                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaBell size={14} />
                                                                <span>Gửi Thông Báo</span>
                                                            </Link>
                                                        </motion.li>

                                                        <motion.li variants={itemVariants}>
                                                            <Link
                                                                to="/dashboard/giaovien/approve-leave"
                                                                className={`block py-2 px-4 rounded-lg flex items-center gap-3 ${
                                                                    isActive("/dashboard/giaovien/approve-leave")
                                                                        ? "bg-amber-600/20 text-amber-400"
                                                                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                                                } transition-colors duration-200`}
                                                            >
                                                                <FaClipboardCheck size={14} />
                                                                <span>Duyệt Đơn Xin Nghỉ</span>
                                                            </Link>
                                                        </motion.li>
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}

                        {/* Phụ Huynh Menu */}
                        {cleanRole === "Phụ Huynh" && (
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/parents"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/parents") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaHome className={isActive("/parents") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Trang Chủ</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/parents/profile"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/parents/profile") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaUser className={isActive("/parents/profile") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Tài Khoản</span>
                                        </Link>
                                    </li>

                                    {/* <li>
                                        <Link
                                            to="/parents/notifications"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/parents/notifications") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <div className="relative">
                                                <FaBell className={isActive("/parents/notifications") ? "text-white" : "text-amber-300"} size={18} />
                                                {notificationCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                        {notificationCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>Thông Báo</span>
                                        </Link>
                                    </li> */}

                                    {/* <li>
                                        <Link
                                            to="/parents/payment"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/parents/payment") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <div className="relative">
                                                <FaStar className={isActive("/parents/payment") ? "text-white" : "text-amber-300"} size={18} />
                                            </div>
                                            <span>Học Phí</span>
                                        </Link>
                                    </li> */}
                                </ul>
                            </nav>
                        )}

                        {/* Giáo Viên Menu */}
                        {cleanRole === "Giáo Viên" && (
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/teacher/home"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/teacher/home") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaHome className={isActive("/teacher/home") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Trang Chủ</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/teacher/student-list"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/teacher/student-list") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaList className={isActive("/teacher/student-list") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Danh Sách Học Sinh</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/teacher/send-notification"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/teacher/send-notification") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaBell className={isActive("/teacher/send-notification") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Gửi Thông Báo</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/teacher/approve-leave"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/teacher/approve-leave") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaClipboardCheck className={isActive("/teacher/approve-leave") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Duyệt Đơn Xin Nghỉ</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/teacher/evaluate-student"
                                            className={`block py-2.5 px-4 rounded-lg flex items-center gap-3 ${
                                                isActive("/teacher/evaluate-student") ? "bg-amber-500 text-white" : "text-gray-200 hover:bg-gray-700/50"
                                            } transition-colors duration-200`}
                                        >
                                            <FaStar className={isActive("/teacher/evaluate-student") ? "text-white" : "text-amber-300"} size={18} />
                                            <span>Đánh Giá Học Sinh</span>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700/50">
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                        >
                            <FaSignOutAlt size={16} />
                            <span>Đăng Xuất</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Overlay for mobile */}
            {/* {isMobile && !collapsed && <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setCollapsed(true)} />} */}
            {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-30" onClick={onCloseSidebar} />}
            {/* Content margin for desktop */}
            {!isMobile && <div className="ml-[280px]">{/* Main content goes here */}</div>}
        </>
    );
};

export default Sidebar;
