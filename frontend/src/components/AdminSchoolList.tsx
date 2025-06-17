import React, { useEffect, useState } from "react";
import { approveTruongHoc, banTruongHoc, getDanhSachTruong } from "../services/school/apiSchool";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { FaSchool, FaCheck, FaBan, FaEye, FaHourglassHalf, FaList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface TruongHoc {
    IDTruong: number;
    tenTruong: string;
    diaChi: string;
    SDT: string;
    email_business: string;
    duyet: boolean;
    Status: string;
}

type TabType = "all" | "active" | "banned" | "pending";

const AdminSchoolList: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "";
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);
    const [schools, setSchools] = useState<TruongHoc[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<TruongHoc[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<TabType>("all");

    // Lấy danh sách trường học từ backend
    const fetchSchools = async () => {
        setIsLoading(true);
        try {
            const data = await getDanhSachTruong();
            setSchools(data);
            setFilteredSchools(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách trường học:", error);
            alert("Không thể tải danh sách trường học!");
        } finally {
            setIsLoading(false);
        }
    };

    // Duyệt trường
    const handleApprove = async (idTruong: number) => {
        try {
            await approveTruongHoc(idTruong);
            alert("Trường học đã được duyệt thành công!");
            fetchSchools(); // Cập nhật danh sách sau khi duyệt
        } catch (error) {
            console.error("Lỗi khi duyệt trường học:", error);
            alert("Không thể duyệt trường học!");
        }
    };

    // Ban trường
    const handleBan = async (idTruong: number) => {
        try {
            await banTruongHoc(idTruong);
            alert("Trường học đã bị ban thành công!");
            fetchSchools(); // Cập nhật danh sách sau khi ban
        } catch (error) {
            console.error("Lỗi khi ban trường học:", error);
            alert("Không thể ban trường học!");
        }
    };

    // Chuyển hướng đến trang chi tiết trường
    const handleViewDetails = (idTruong: number, state: string) => {
        navigate(`/${idTruong}/${state}`);
    };

    // Lọc trường học theo tab đang active
    const filterSchools = (tab: TabType) => {
        setActiveTab(tab);

        if (tab === "all") {
            setFilteredSchools(schools);
        } else if (tab === "active") {
            setFilteredSchools(schools.filter((school) => school.Status === "Hoạt động" && school.duyet));
        } else if (tab === "banned") {
            setFilteredSchools(schools.filter((school) => school.Status === "Dừng"));
        } else if (tab === "pending") {
            setFilteredSchools(schools.filter((school) => !school.duyet));
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const tabs = [
        { id: "all", label: "Tất cả", icon: <FaList /> },
        { id: "active", label: "Hoạt động", icon: <FaCheckCircle className="text-green-500" /> },
        { id: "banned", label: "Dừng hoạt động", icon: <FaTimesCircle className="text-red-500" /> },
        { id: "pending", label: "Chờ duyệt", icon: <FaHourglassHalf className="text-amber-500" /> },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="sticky top-0 z-40 w-full">
                <Header
                    userRole={role}
                    userName={userName}
                    userAvatar={userAvatar}
                    notificationCount={notificationCount}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Quản lý danh sách trường học</h1>
                            <p className="mt-1 text-sm text-gray-600">Quản lý và theo dõi các trường học trong hệ thống</p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-full">
                            <FaSchool className="text-amber-600 text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => filterSchools(tab.id as TabType)}
                                className={`flex items-center px-6 py-3 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                    activeTab === tab.id ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } -mb-px`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                {tab.id !== "all" && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}>
                                        {tab.id === "active" && schools.filter((s) => s.Status === "Hoạt động" && s.duyet).length}
                                        {tab.id === "banned" && schools.filter((s) => s.Status === "Dừng").length}
                                        {tab.id === "pending" && schools.filter((s) => !s.duyet).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
                    </div>
                ) : filteredSchools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-amber-500 mb-4">
                            <FaSchool size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy trường học nào</h3>
                        <p className="mt-1 text-sm text-gray-500">Không có kết quả phù hợp với bộ lọc hiện tại</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchools.map((school) => (
                            <motion.div
                                key={school.IDTruong}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{school.tenTruong}</h2>
                                            <div
                                                className={`rounded-full px-4 py-4 text-xs font-medium ${
                                                    school.duyet ? (school.Status === "Hoạt động" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800") : "bg-amber-100 text-amber-800"
                                                }`}
                                            >
                                                {school.duyet ? (school.Status === "Hoạt động" ? "Hoạt động" : "Bị ban") : "Chờ duyệt"}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">ID: {school.IDTruong}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-start">
                                            <span className="text-gray-500 text-sm w-20">Địa chỉ:</span>
                                            <span className="text-gray-700 text-sm flex-1">{school.diaChi}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 text-sm w-20">SĐT:</span>
                                            <span className="text-gray-700 text-sm flex-1">{school.SDT}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-gray-500 text-sm w-20">Email:</span>
                                            <span className="text-gray-700 text-sm flex-1">{school.email_business}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            {!school.duyet && (
                                                <button
                                                    onClick={() => handleApprove(school.IDTruong)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-md"
                                                >
                                                    <FaCheck className="mr-1.5" />
                                                    Duyệt
                                                </button>
                                            )}
                                            {school.Status !== "Dừng" && (
                                                <button
                                                    onClick={() => handleBan(school.IDTruong)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-md"
                                                >
                                                    <FaBan className="mr-1.5" />
                                                    Dừng hoạt động
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleViewDetails(school.IDTruong, "details")}
                                            className="inline-flex items-center px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-md"
                                        >
                                            <FaEye className="mr-1.5" />
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminSchoolList;
