import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaChild, FaUserTie, FaCalendarAlt, FaNewspaper, FaBell, FaChartBar, FaSchool, FaGraduationCap } from "react-icons/fa";
import { getThongTinTruongHoc } from "../../services/school/apiSchool";
import { getDanhSachHocSinhDuyet } from "../../services/apiStudent";
import { getClasses } from "../../services/school/apiClass";
import { getApprovedNhanVien } from "../../services/school/apiSchool";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

interface StatsData {
    totalStudents: number;
    totalClasses: number;
    totalStaff: number;
    recentNotifications: number;
}

interface SchoolInfo {
    IDTruong: number;
    tenTruong: string;
    diaChi: string;
    Avatar?: string;
    bannerImage?: string;
    slogan?: string;
    moTa?: string;
}

const SchoolHomePage: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StatsData>({
        totalStudents: 0,
        totalClasses: 0,
        totalStaff: 0,
        recentNotifications: 5, // Placeholder
    });
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

    // Current date formatted
    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Recent activities - would typically come from API
    const recentActivities = [
        { id: 1, title: "Kế hoạch năm học mới đã được phê duyệt", date: "Hôm nay" },
        { id: 2, title: "Tuyển dụng 5 giáo viên mầm non", date: "Hôm qua" },
        { id: 3, title: "Lịch họp phụ huynh lớp Mầm 3", date: "23/04/2025" },
        { id: 4, title: "Cập nhật danh sách phân lớp", date: "21/04/2025" },
    ];

    // Quick links - these would link to other parts of the application
    const quickLinks = [
        { name: "Quản lý học sinh", icon: <FaChild size={20} />, path: "/dashboard/student" },
        { name: "Quản lý giáo viên", icon: <FaChalkboardTeacher size={20} />, path: "/dashboard/staff" },
        { name: "Quản lý lớp học", icon: <FaGraduationCap size={20} />, path: "/dashboard/classes" },
        { name: "Thông tin trường", icon: <FaSchool size={20} />, path: `/dashboard/truong/${idTruong}/profile` },
    ];

    // Upcoming events - would typically come from API
    const upcomingEvents = [
        { id: 1, title: "Lễ khai giảng năm học mới", date: "05/05/2025", time: "07:30" },
        { id: 2, title: "Họp hội đồng trường", date: "10/05/2025", time: "14:00" },
        { id: 3, title: "Kiểm tra cơ sở vật chất", date: "15/05/2025", time: "09:00" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!idTruongStr) return;

                // Fetch school information
                const schoolData = await getThongTinTruongHoc(idTruongStr);
                setSchoolInfo(schoolData);

                // Fetch statistics
                const [students, classes, staff] = await Promise.all([getDanhSachHocSinhDuyet(idTruongStr), getClasses(Number(idTruongStr)), getApprovedNhanVien(idTruongStr)]);

                setStats({
                    totalStudents: students.length,
                    totalClasses: classes.length,
                    totalStaff: staff.length,
                    recentNotifications: 5, // Placeholder, would come from notifications API
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idTruongStr]);

    return (
        <div className="min-h-screen bg-amber-50 p-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500 border-solid"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Xin chào, Ban Giám Hiệu {schoolInfo?.tenTruong || "Trường Hệ Thống Quản Lý Mầm Non TinyCare"}</h1>
                                <p className="text-amber-100">{today}</p>
                                <p className="mt-2 max-w-2xl">{schoolInfo?.slogan || "Nuôi dưỡng tương lai, vun đắp ước mơ"}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <button
                                    onClick={() => navigate(`/dashboard/truong/${idTruong}/profile`)}
                                    className="bg-white text-amber-600 hover:bg-amber-100 hover:text-amber-700 px-6 py-2 rounded-lg transition-colors duration-300 font-medium flex items-center"
                                >
                                    <FaSchool className="mr-2" />
                                    Xem thông tin trường
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Tổng số học sinh</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents}</h3>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <FaChild className="text-amber-500" size={24} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => navigate("/dashboard/student")} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
                                    Xem chi tiết
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Tổng số lớp học</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalClasses}</h3>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <FaGraduationCap className="text-amber-500" size={24} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => navigate("/dashboard/classes")} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
                                    Xem chi tiết
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Tổng số cán bộ</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalStaff}</h3>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <FaUserTie className="text-amber-500" size={24} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => navigate("/dashboard/staff")} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
                                    Xem chi tiết
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">Thông báo mới</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stats.recentNotifications}</h3>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <FaBell className="text-amber-500" size={24} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
                                    Xem chi tiết
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaChartBar className="text-amber-500 mr-2" />
                                    Truy cập nhanh
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {quickLinks.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => navigate(link.path)}
                                            className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                        >
                                            <div className="text-amber-500 mb-2">{link.icon}</div>
                                            <span className="text-sm font-medium text-gray-700">{link.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* School Description */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaSchool className="text-amber-500 mr-2" />
                                    Giới thiệu trường
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {schoolInfo?.moTa ||
                                        "Trường Hệ Thống Quản Lý Mầm Non TinyCare là môi trường giáo dục mầm non chất lượng cao, tập trung vào việc phát triển toàn diện cho trẻ em từ 18 tháng đến 6 tuổi. Với đội ngũ giáo viên giàu kinh nghiệm, cơ sở vật chất hiện đại và chương trình giáo dục tiên tiến, chúng tôi cam kết mang đến cho các em một môi trường học tập an toàn, thân thiện và sáng tạo."}
                                </p>
                                <button onClick={() => navigate(`/dashboard/truong/${idTruong}/profile`)} className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                                    Xem thêm
                                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaNewspaper className="text-amber-500 mr-2" />
                                    Hoạt động gần đây
                                </h2>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="border-l-2 border-amber-500 pl-4 py-1 hover:bg-amber-50 transition-colors rounded">
                                            <p className="font-medium text-gray-800">{activity.title}</p>
                                            <p className="text-sm text-gray-500">{activity.date}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <button className="text-amber-600 hover:text-amber-700 font-medium">Xem tất cả hoạt động</button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
                            {/* Calendar/Upcoming Events */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaCalendarAlt className="text-amber-500 mr-2" />
                                    Sự kiện sắp tới
                                </h2>
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-amber-50 transition-colors">
                                            <div className="bg-amber-100 text-amber-500 rounded-lg p-3 mr-4 text-center min-w-[60px]">
                                                <div className="text-xs font-medium">
                                                    {event.date.split("/")[1]}/{event.date.split("/")[0]}
                                                </div>
                                                <div className="text-lg font-bold">{event.date.split("/")[0]}</div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{event.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    <span className="inline-block mr-2">⏰</span>
                                                    {event.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">Thêm sự kiện mới</button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaChartBar className="text-amber-500 mr-2" />
                                    Thống kê nhanh
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">Tỷ lệ giáo viên/học sinh</span>
                                            <span className="text-sm font-medium text-amber-600">1:15</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">Tỷ lệ nam/nữ</span>
                                            <span className="text-sm font-medium text-amber-600">45%/55%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">Tỷ lệ lấp đầy lớp học</span>
                                            <span className="text-sm font-medium text-amber-600">85%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <button onClick={() => navigate(`/dashboard/truong/${idTruong}/profile?tab=statistics`)} className="text-amber-600 hover:text-amber-700 font-medium">
                                        Xem thống kê chi tiết
                                    </button>
                                </div>
                            </div>

                            {/* Support Box */}
                            <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white">
                                <h2 className="text-xl font-bold mb-4">Cần hỗ trợ?</h2>
                                <p className="text-gray-300 mb-4">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn với mọi vấn đề.</p>
                                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">Liên hệ hỗ trợ</button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolHomePage;
