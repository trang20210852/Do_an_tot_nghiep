import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createClass, deleteClass, getClassDetail, getClasses } from "../../services/school/apiClass";
import { motion } from "framer-motion";

// Icons
import { FaPlus, FaSearch, FaBook, FaUsers, FaCalendarAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaSchool, FaTrashAlt, FaEye, FaGraduationCap } from "react-icons/fa";

export interface ClassType {
    IDLopHoc: number;
    tenLop: string;
    doTuoi: string;
    siSo: number;
    IDGiaoVien?: number;
    namHoc: string;
}

const ClassesPage: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const navigate = useNavigate();

    const [classes, setClasses] = useState<ClassType[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<ClassType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newClassAge, setNewClassAge] = useState<string>("");
    const [newClassYear, setNewClassYear] = useState<string>("");
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("Tất cả");

    const fetchClasses = useCallback(async () => {
        if (!idTruongStr) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await getClasses(Number(idTruongStr));

            // Lấy thông tin chi tiết từng lớp học để tính sĩ số
            const formattedClasses = await Promise.all(
                data.map(async (cls: any) => {
                    const classDetail = await getClassDetail(cls.IDLopHoc);
                    return {
                        IDLopHoc: cls.IDLopHoc,
                        tenLop: cls.tenLop,
                        doTuoi: cls.doTuoi,
                        siSo: classDetail.danhSachHocSinh.length, // Đếm số học sinh
                        namHoc: cls.namHoc,
                    };
                })
            );

            setClasses(formattedClasses);
            setFilteredClasses(formattedClasses);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lớp học:", error);
            showNotification("Không thể tải danh sách lớp học", "error");
            setClasses([]);
            setFilteredClasses([]);
        } finally {
            setIsLoading(false);
        }
    }, [idTruongStr]);

    // Simplified effect for data fetching
    useEffect(() => {
        // Add a small timeout to ensure routing completes first
        const timer = setTimeout(() => {
            fetchClasses();
        }, 100);

        return () => clearTimeout(timer);
    }, [fetchClasses]);

    // Lấy danh sách năm học duy nhất
    const schoolYears = Array.from(new Set(classes.map((cls) => cls.namHoc))).filter(Boolean);

    // Effect filter theo searchTerm và selectedYear
    useEffect(() => {
        let filtered = classes;
        if (searchTerm && classes.length > 0) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter((cls) => cls.tenLop.toLowerCase().includes(searchTermLower) || cls.doTuoi.toLowerCase().includes(searchTermLower));
        }
        if (selectedYear !== "Tất cả") {
            filtered = filtered.filter((cls) => cls.namHoc === selectedYear);
        }
        setFilteredClasses(filtered);
    }, [searchTerm, classes, selectedYear]);

    // Simple notification system with cleanup
    const showNotification = (message: string, type: string) => {
        // Clear any existing notification first
        setNotification({ message: "", type: "" });

        // Set new notification after a brief delay
        setTimeout(() => {
            setNotification({ message, type });
        }, 10);

        // Clear notification after 3 seconds
        const timer = setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 3000);

        return () => clearTimeout(timer);
    };

    const addNewClass = async () => {
        if (newClassName.trim() === "" || newClassAge.trim() === "" || newClassYear.trim() === "") {
            showNotification("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        setIsLoading(true);
        const classData = {
            idTruong: Number(idTruongStr),
            tenLop: newClassName,
            doTuoi: newClassAge,
            namHoc: newClassYear, // Default to current school year
        };

        try {
            await createClass(classData);

            // Reset form and close modal first for better UX
            setNewClassName("");
            setNewClassAge("");
            setNewClassYear("");
            setIsModalOpen(false);

            // Then fetch data
            await fetchClasses();
            showNotification("Lớp học đã được thêm thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi thêm lớp học:", error);
            showNotification("Không thể thêm lớp học", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClass = async (id: number) => {
        setIsLoading(true);
        try {
            await deleteClass(id);
            // Đóng hộp thoại xác nhận
            setDeleteConfirm(null);

            // Lấy lại danh sách lớp học
            await fetchClasses();
            showNotification("Lớp học đã được xoá thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi xoá lớp học:", error);
            showNotification("Không thể xoá lớp học", "error");
            setDeleteConfirm(null);
        } finally {
            setIsLoading(false);
        }
    };

    const viewClassDetail = (id: number) => {
        navigate(`/dashboard/classes/${id}`);
    };

    // Very simplified animations
    const modalVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    };

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header - Simplified */}
            <div className="py-6 px-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FaSchool className="mr-3 text-gray-900" size={28} />
                        Quản Lý Lớp Học
                    </h1>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300"
                        disabled={isLoading}
                    >
                        <FaPlus />
                        <span>Thêm Lớp Học</span>
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                {/* Notification - Simplified */}
                {notification.message && (
                    <div
                        className={`flex items-center p-4 mb-6 rounded-lg ${
                            notification.type === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" : "bg-red-100 text-red-800 border-l-4 border-red-500"
                        }`}
                    >
                        {notification.type === "success" ? <FaCheckCircle size={20} className="mr-3" /> : <FaExclamationTriangle size={20} className="mr-3" />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                )}

                {/* Search, Filter & Stats */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-1/3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm lớp học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-gray-700 font-medium">Năm học:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="Tất cả">Tất cả</option>
                                {schoolYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-6 text-gray-700 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                                <div className="bg-amber-100 p-2 rounded-full">
                                    <FaBook className="text-amber-600" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Tổng số lớp</span>
                                    <p className="font-bold text-gray-800">{classes.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-amber-100 p-2 rounded-full">
                                    <FaGraduationCap className="text-amber-600" />
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Năm học hiện tại</span>
                                    <p className="font-bold text-gray-800">
                                        {new Date().getFullYear()}-{new Date().getFullYear() + 1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classes List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <FaBook size={42} className="text-amber-500" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-gray-800">{searchTerm ? "Không tìm thấy lớp học phù hợp" : "Chưa có lớp học nào"}</h3>
                            <p className="mb-6 text-gray-600">{searchTerm ? `Không có kết quả cho "${searchTerm}"` : "Bắt đầu bằng cách thêm lớp học mới"}</p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-300"
                                >
                                    <FaPlus />
                                    <span>Thêm lớp học</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClasses.map((cls) => (
                            <div key={cls.IDLopHoc} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-amber-500">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{cls.tenLop}</h3>
                                    <div className="space-y-4 mb-2">
                                        <div className="flex items-center text-gray-700">
                                            <div className="bg-amber-100 p-2 rounded-full mr-2">
                                                <FaUsers className="text-amber-600" />
                                            </div>
                                            <span className="font-medium">Sĩ số:</span>
                                            <span className="text-sm text-gray-500 mr-1">{cls.siSo} học sinh</span>
                                        </div>
                                        {cls.doTuoi && (
                                            <div className="flex items-center text-gray-700">
                                                <div className="bg-amber-100 p-2 rounded-full mr-2">
                                                    <FaCalendarAlt className="text-amber-600" />
                                                </div>
                                                <span className="font-medium">Độ tuổi:</span>
                                                <span className="text-sm text-gray-500 mr-1">{cls.doTuoi}</span>
                                            </div>
                                        )}
                                        {cls.namHoc && (
                                            <div className="flex items-center text-gray-700">
                                                <div className="bg-amber-100 p-2 rounded-full mr-2">
                                                    <FaGraduationCap className="text-amber-600" />
                                                </div>
                                                <span className="font-medium">Năm học:</span>
                                                <span className="text-sm text-gray-500 mr-1">{cls.namHoc}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => viewClassDetail(cls.IDLopHoc)}
                                            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-300"
                                        >
                                            <FaEye size={14} />
                                            <span>Chi tiết</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(cls.IDLopHoc)}
                                            className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-colors duration-300 border border-red-200 hover:border-red-600"
                                            disabled={isLoading}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal xác nhận xoá */}
            {deleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <FaExclamationTriangle size={28} className="text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận xóa lớp</h2>
                            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác.</p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDeleteClass(deleteConfirm)}
                                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" /> Đang xử lý
                                    </>
                                ) : (
                                    "Xác nhận xóa"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thêm lớp */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                    <FaPlus className="text-amber-600" />
                                </div>
                                Thêm Lớp Học Mới
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên lớp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Ví dụ: Lớp Mầm 1, Lớp Chồi 2..."
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ tuổi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newClassAge}
                                onChange={(e) => setNewClassAge(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Ví dụ: 3-4 tuổi, 4-5 tuổi..."
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Năm học <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newClassYear}
                                onChange={(e) => setNewClassYear(e.target.value)}
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Ví dụ: 2023-2024, 2024-2025..."
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={addNewClass}
                                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium flex items-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" /> Đang xử lý
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="mr-2" /> Lưu lớp học
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesPage;
