import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApprovedNhanVien, getThongTinTruongHoc, updateAvatar, updateBackground, updateThongTinTruongHoc } from "../../services/school/apiSchool";
import Modal from "../../components/Modal";
import {
    FaEdit,
    FaSchool,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaUsers,
    FaUserGraduate,
    FaUserTie,
    FaMapMarkerAlt,
    FaChalkboardTeacher,
    FaFileAlt,
    FaImage,
    FaBuilding,
    FaCheck,
    FaExclamationCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getDanhSachHocSinhDuyet } from "../../services/apiStudent";
import { getClasses } from "../../services/school/apiClass";
import { toast } from "react-toastify";

interface TruongHoc {
    IDTruong: number;
    tenTruong: string;
    diaChi: string;
    SDT: string;
    email_business: string;
    email_hieutruong: string;
    ngayThanhLap: string;
    soLuongLop: number;
    tongSoHocSinh: number;
    tongSoCanBo: number;
    Status: "Hoạt động" | "Dừng";
    Avatar: string | null;
    background?: string;
    moTa?: string;
    website?: string;
    fanpage?: string;
    slogan?: string;
    loaiHinh?: string;
    giayPhepHoatDong?: string;
}

interface StatsData {
    totalStudents: number;
    totalClasses: number;
    totalStaff: number;
    recentNotifications: number;
}
const TruongProfile: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const [thongTinTruong, setThongTinTruong] = useState<TruongHoc | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<TruongHoc | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "statistics" | "contacts">("overview");
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isBannerEdit, setIsBannerEdit] = useState(false);
    const [stats, setStats] = useState<StatsData>({
        totalStudents: 0,
        totalClasses: 0,
        totalStaff: 0,
        recentNotifications: 0, // Placeholder
    });
    // Dữ liệu mẫu cho banner và mô tả (thay thế khi có API)
    const defaultBanner = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=300&q=80";
    const defaultDescription =
        "Trường Hệ Thống Quản Lý Mầm Non TinyCare là môi trường giáo dục mầm non chất lượng cao, tập trung vào việc phát triển toàn diện cho trẻ em từ 18 tháng đến 6 tuổi. Với đội ngũ giáo viên giàu kinh nghiệm, cơ sở vật chất hiện đại và chương trình giáo dục tiên tiến, chúng tôi cam kết mang đến cho các em một môi trường học tập an toàn, thân thiện và sáng tạo.";
    const [avatar, setAvatar] = useState<string | null>(null);
    const [background, setBackground] = useState<string | null>(null);

    const handleAvatarUpload = async (file: File) => {
        try {
            setIsUploading(true);
            toast.info("Đang tải lên ảnh đại diện...", { autoClose: 2000 }); // Hiển thị thông báo bắt đầu upload
            const response = await updateAvatar(thongTinTruong?.IDTruong || 1, file); // Gọi API cập nhật avatar
            setThongTinTruong((prev) => {
                if (!prev) return prev; // Nếu `prev` là null, không làm gì cả
                return {
                    ...prev,
                    Avatar: response.avatar, // Cập nhật Avatar mới
                };
            });
            toast.success("Cập nhật ảnh đại diện thành công!"); // Hiển thị thông báo thành công
        } catch (error) {
            console.error("Lỗi khi cập nhật Avatar:", error);
            toast.error("Lỗi khi cập nhật ảnh đại diện!"); // Hiển thị thông báo lỗi
        } finally {
            setIsUploading(false);
        }
    };
    const handleBackgroundUpload = async (file: File) => {
        try {
            setIsUploading(true);
            toast.info("Đang tải lên ảnh nền...", { autoClose: 2000 }); // Hiển thị thông báo bắt đầu upload
            const response = await updateBackground(thongTinTruong?.IDTruong || 1, file); // Gọi API cập nhật background
            setThongTinTruong((prev) => {
                if (!prev) return prev; // Nếu `prev` là null, không làm gì cả
                return {
                    ...prev,
                    background: response.background, // Cập nhật Background mới
                };
            });
            toast.success("Cập nhật ảnh nền thành công!"); // Hiển thị thông báo thành công
        } catch (error) {
            console.error("Lỗi khi cập nhật Background:", error);
            toast.error("Lỗi khi cập nhật ảnh nền!"); // Hiển thị thông báo lỗi
        } finally {
            setIsUploading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (idTruongStr) {
                    // Fetch school information
                    const schoolData = await getThongTinTruongHoc(idTruongStr);
                    setThongTinTruong({
                        ...schoolData,
                        background: schoolData.background || defaultBanner,
                        moTa: schoolData.moTa || defaultDescription,
                        slogan: schoolData.slogan || "Nuôi dưỡng tương lai, vun đắp ước mơ",
                    });

                    // Fetch statistics
                    const [students, classes, staff] = await Promise.all([getDanhSachHocSinhDuyet(idTruongStr), getClasses(Number(idTruongStr)), getApprovedNhanVien(idTruongStr)]);

                    setStats({
                        totalStudents: students.length,
                        totalClasses: classes.length,
                        totalStaff: staff.length,
                        recentNotifications: 5, // Placeholder, would come from notifications API
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idTruongStr]);

    const handleEditClick = () => {
        setEditedData(thongTinTruong);
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedData) {
            setEditedData({ ...editedData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (editedData) {
            try {
                await updateThongTinTruongHoc(editedData);
                setThongTinTruong(editedData);
                setIsEditing(false);
            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin", error);
            }
        }
    };

    if (!thongTinTruong) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 border-opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 min-h-screen">
            {/* Banner */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <img src={thongTinTruong.background || defaultBanner} alt="Background trường học" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center px-4">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{thongTinTruong.tenTruong}</h1>
                        <p className="text-xl md:text-2xl italic">{thongTinTruong.slogan}</p>
                    </div>
                </div>
                <label htmlFor="background-upload" className="absolute bottom-3 right-3 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer">
                    <FaEdit />
                </label>
                <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleBackgroundUpload(e.target.files[0]); // Gọi hàm upload background
                        }
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Thông tin chung và avatar */}
                    <div className="md:flex">
                        <div className="md:shrink-0 p-6 flex flex-col items-center justify-center">
                            <div className="relative">
                                {thongTinTruong.Avatar ? (
                                    <img src={thongTinTruong.Avatar} alt="Avatar Trường" className="w-40 h-40 object-cover rounded-full border-4 border-amber-500" />
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 border-4 border-amber-500">
                                        <FaSchool size={60} />
                                    </div>
                                )}
                                <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md cursor-pointer">
                                    <FaEdit />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleAvatarUpload(e.target.files[0]); // Gọi hàm upload ảnh
                                        }
                                    }}
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-semibold text-gray-800">ID: {thongTinTruong.IDTruong}</h2>
                                <div className="mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${thongTinTruong.Status === "Hoạt động" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {thongTinTruong.Status === "Hoạt động" ? (
                                            <>
                                                <FaCheck className="inline mr-1" /> {thongTinTruong.Status}
                                            </>
                                        ) : (
                                            <>
                                                <FaExclamationCircle className="inline mr-1" /> {thongTinTruong.Status}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 md:flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{thongTinTruong.tenTruong}</h1>
                                    <div className="flex items-center text-gray-600 mt-2">
                                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                                        <span>{thongTinTruong.diaChi}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                        <FaCalendarAlt className="mr-2 text-amber-500" />
                                        <span>Thành lập: {new Date(thongTinTruong.ngayThanhLap).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                </div>
                                <button onClick={handleEditClick} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center">
                                    <FaEdit className="mr-2" /> Cập nhật thông tin
                                </button>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Mô tả</h3>
                                <p className="text-gray-600">{thongTinTruong.moTa}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 bg-amber-50 p-4 rounded-lg">
                                <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                                    <div className="text-amber-500 mb-1">
                                        <FaChalkboardTeacher size={24} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
                                    <div className="text-sm text-gray-500">Lớp học</div>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                                    <div className="text-amber-500 mb-1">
                                        <FaUserGraduate size={24} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                                    <div className="text-sm text-gray-500">Học sinh</div>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                                    <div className="text-amber-500 mb-1">
                                        <FaUserTie size={24} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800">{stats.totalStaff}</div>
                                    <div className="text-sm text-gray-500">Cán bộ</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab navigation */}
                    <div className="border-t border-gray-200">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === "overview" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab("statistics")}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === "statistics" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Thống kê
                            </button>
                            <button
                                onClick={() => setActiveTab("contacts")}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === "contacts" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Liên hệ
                            </button>
                        </div>

                        {/* Tab content */}
                        <div className="p-6">
                            {activeTab === "overview" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin trường học</h3>
                                            <ul className="space-y-3">
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Tên trường:</span>
                                                    <span className="text-gray-900">{thongTinTruong.tenTruong}</span>
                                                </li>
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Mã trường:</span>
                                                    <span className="text-gray-900">TH-{thongTinTruong.IDTruong}</span>
                                                </li>
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Ngày thành lập:</span>
                                                    <span className="text-gray-900">{new Date(thongTinTruong.ngayThanhLap).toLocaleDateString("vi-VN")}</span>
                                                </li>
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Trạng thái:</span>
                                                    <span className={thongTinTruong.Status === "Hoạt động" ? "text-green-600" : "text-red-600"}>{thongTinTruong.Status}</span>
                                                </li>
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Loại hình:</span>
                                                    <span className="text-gray-900">{thongTinTruong.loaiHinh || "Chưa cập nhật"}</span>
                                                </li>
                                                <li className="flex">
                                                    <span className="w-40 text-gray-600 font-medium">Địa chỉ:</span>
                                                    <span className="text-gray-900">{thongTinTruong.diaChi}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Giấy phép hoạt động</h3>
                                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                                                {thongTinTruong.giayPhepHoatDong ? (
                                                    <img src={thongTinTruong.giayPhepHoatDong} alt="Giấy phép hoạt động" className="max-h-44 max-w-full object-contain rounded shadow" />
                                                ) : (
                                                    <div className="text-center text-gray-500">
                                                        <FaFileAlt className="mx-auto mb-2" size={24} />
                                                        <p>Chưa cập nhật giấy phép hoạt động</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Cơ sở vật chất</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-amber-50 p-4 rounded-lg text-center">
                                                <FaBuilding className="mx-auto text-amber-500" size={24} />
                                                <p className="mt-2 font-medium">4 khu nhà</p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-lg text-center">
                                                <FaUsers className="mx-auto text-amber-500" size={24} />
                                                <p className="mt-2 font-medium">Sân chơi 500m²</p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-lg text-center">
                                                <FaChalkboardTeacher className="mx-auto text-amber-500" size={24} />
                                                <p className="mt-2 font-medium">{thongTinTruong.soLuongLop} phòng học</p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-lg text-center">
                                                <FaFileAlt className="mx-auto text-amber-500" size={24} />
                                                <p className="mt-2 font-medium">Thư viện</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "statistics" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thống kê học sinh</h3>
                                            <div className="space-y-4">
                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Tổng số học sinh</span>
                                                        <span className="font-bold">{stats.totalStudents}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Học sinh nam</span>
                                                        <span className="font-bold">{Math.floor(stats.totalStudents * 0.52)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "52%" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thống kê cán bộ giáo viên</h3>
                                            <div className="space-y-4">
                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Tổng số cán bộ</span>
                                                        <span className="font-bold">{stats.totalStaff}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Học sinh nữ</span>
                                                        <span className="font-bold">{Math.floor(stats.totalStudents * 0.48)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: "48%" }}></div>
                                                    </div>
                                                </div>

                                                {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Giáo viên</span>
                                                        <span className="font-bold">{Math.floor(thongTinTruong.tongSoCanBo * 0.75)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600">Nhân viên hỗ trợ</span>
                                                        <span className="font-bold">{Math.floor(thongTinTruong.tongSoCanBo * 0.25)}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "contacts" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-amber-50 p-5 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin liên hệ</h3>
                                            <ul className="space-y-4">
                                                <li className="flex items-center">
                                                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                        <FaPhone className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                                        <p className="font-medium">{thongTinTruong.SDT}</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                        <FaEnvelope className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email doanh nghiệp</p>
                                                        <p className="font-medium">{thongTinTruong.email_business}</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                        <FaEnvelope className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email hiệu trưởng</p>
                                                        <p className="font-medium">{thongTinTruong.email_hieutruong}</p>
                                                    </div>
                                                </li>
                                                <li className="flex items-center">
                                                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                                                        <FaMapMarkerAlt className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Địa chỉ</p>
                                                        <p className="font-medium">{thongTinTruong.diaChi}</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Gửi tin nhắn</h3>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                                    <textarea
                                                        rows={4}
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md font-medium">
                                                    Gửi tin nhắn
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal cập nhật thông tin */}
            {isEditing && editedData && (
                <Modal title="Cập nhật thông tin trường" onClose={() => setIsEditing(false)}>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Thông tin cơ bản */}
                        <h3 className="font-medium text-gray-900 border-b pb-2">Thông tin cơ bản</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tên trường */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường</label>
                                <input
                                    type="text"
                                    name="tenTruong"
                                    value={editedData.tenTruong}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                />
                            </div>

                            {/* Slogan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                                <input
                                    type="text"
                                    name="slogan"
                                    value={editedData.slogan || ""}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                    placeholder="Nhập slogan của trường"
                                />
                            </div>
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="diaChi"
                                value={editedData.diaChi}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                            />
                        </div>

                        {/* Mô tả */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea
                                name="moTa"
                                value={editedData.moTa || ""}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                            ></textarea>
                        </div>

                        {/* Thông tin liên hệ */}
                        <h3 className="font-medium text-gray-900 border-b pb-2 mt-6">Thông tin liên hệ</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="SDT"
                                    value={editedData.SDT}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={editedData.website || ""}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email doanh nghiệp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email doanh nghiệp</label>
                                <input
                                    type="email"
                                    name="email_business"
                                    value={editedData.email_business}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                />
                            </div>

                            {/* Email hiệu trưởng */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email hiệu trưởng</label>
                                <input
                                    type="email"
                                    name="email_hieutruong"
                                    value={editedData.email_hieutruong}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                />
                            </div>
                        </div>

                        {/* Fanpage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fanpage</label>
                            <input
                                type="text"
                                name="fanpage"
                                value={editedData.fanpage || ""}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                                placeholder="https://facebook.com/mamnonxanh"
                            />
                        </div>

                        {/* Nút lưu */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Hủy
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TruongProfile;
