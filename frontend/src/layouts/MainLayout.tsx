import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const MainLayout: React.FC = () => {
    const role = localStorage.getItem("role") || "";
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { idTruong } = useAuth(); // Lấy idTruong từ AuthContext
    const idTruongStr = idTruong ? String(idTruong) : "";
    // Theo dõi kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSidebarOpen]);

    // Giả lập fetch thông tin người dùng
    useEffect(() => {
        // Simulate fetching user data
        setTimeout(() => {
            if (role === "Giáo Viên") {
                setUserName("Nguyễn Thị Hương");
                setNotificationCount(5);
            } else if (role === "Phụ Huynh") {
                setUserName("Trần Văn Minh");
                setNotificationCount(3);
            } else if (role === "Cán Bộ") {
                setUserName("Lê Thị Ngọc");
                setNotificationCount(8);
            }
        }, 500);
    }, [role]);

    // Kiểm tra nếu trang hiện tại là trang đăng nhập/đăng ký
    const isAuthPage = location.pathname.includes("/login") || location.pathname.includes("/register");

    if (isAuthPage) {
        return <Outlet />;
    }

    // Xử lý toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-amber-50">
            {/* Sidebar - Fixed position with z-index */}
            <div className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar role={role} isMobile={isMobile} isSidebarOpen={isSidebarOpen} onCloseSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main content area - Flexible width with sidebar margin */}
            <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${isSidebarOpen && !isMobile ? "ml-[280px]" : "ml-0"}`}>
                {/* Header - Fixed at top */}
                <div className="sticky top-0 z-40 w-full">
                    <Header userRole={role} userName={userName} userAvatar={userAvatar} notificationCount={notificationCount} isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
                </div>

                {/* Toggle sidebar button (desktop only) */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="fixed z-40 bg-white hover:bg-amber-100 text-amber-500 rounded-full p-2 shadow-md top-20 left-6 transition-colors duration-200"
                        style={{ left: isSidebarOpen ? "260px" : "20px" }}
                    >
                        {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
                    </button>
                )}

                {/* Content area with Outlet */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-7xl mx-auto pb-6"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-4 px-6 text-center text-sm z-20 mt-auto">
                    <div className="max-w-7xl mx-auto">
                        <p>© 2025 Hệ Thống Quản Lý Mầm Non TinyCare. Bản quyền thuộc về Hà Quỳnh Trang.</p>
                        <p className="text-gray-400 text-xs mt-1">Phiên bản 1.0.0</p>
                    </div>
                </footer>
            </div>

            {/* Overlay for mobile sidebar */}
            {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleSidebar} />}
        </div>
    );
};

export default MainLayout;
