import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { approveHocSinh, deleteHocSinh, getDanhSachDonChuyenTruong, getDanhSachHocSinhChuaDuyet, getDanhSachHocSinhDuyet, updateNhapHoc } from "../../services/apiStudent";
import ImagePopup from "../../components/ImagePopup";

type HocSinh = {
    IDHocSinh: string;
    hoTen: string;
    nickname: string;
    gioiTinh: string;
    tenPhuHuynh: string;
    soDienThoaiPhuHuynh: string;
    emailPhuHuynh: string;
    IDLopHoc: string;
    Status: string;

    IDDon?: string;
    IDTruong?: string | null;
    IDTruongMuonChuyen: string;
    truongMuonChuyen?: string;
    minhChung?: string;
    lyDo?: string;
    ngayTao?: string;
};

const StudentPage: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const navigate = useNavigate();
    const [imagePopup, setImagePopup] = useState<{ url: string; title: string } | null>(null);
    // States
    const [listHocSinh, setListHocSinh] = useState<HocSinh[]>([]);
    const [type, setType] = useState("approved");
    const [countApproved, setCountApproved] = useState(0);
    const [countPending, setCountPending] = useState(0);
    const [countTransfer, setCountTransfer] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHocSinh, setSelectedHocSinh] = useState<HocSinh | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showTransferDetailPopup, setShowTransferDetailPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const itemsPerPage = 5;

    // Màu chủ đạo
    const colors = {
        primary: "bg-amber-500", // Vàng amber
        primaryHover: "hover:bg-amber-600",
        secondary: "bg-gray-800", // Xanh than
        secondaryHover: "hover:bg-gray-900",
        accent: "bg-blue-800",
        accentHover: "hover:bg-blue-900",
        danger: "bg-red-600",
        dangerHover: "hover:bg-red-700",
        success: "bg-green-600",
        successHover: "hover:bg-green-700",
    };

    // Memoize fetchData function to prevent unnecessary rerenders
    const fetchData = useCallback(async () => {
        if (!idTruongStr) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch all types of data to keep counts updated
            const [approvedData, pendingData, transferData] = await Promise.all([
                getDanhSachHocSinhDuyet(idTruongStr),
                getDanhSachHocSinhChuaDuyet(idTruongStr),
                getDanhSachDonChuyenTruong(idTruongStr, true),
            ]);

            setCountApproved(Array.isArray(approvedData) ? approvedData.length : 0);
            setCountPending(Array.isArray(pendingData) ? pendingData.length : 0);
            setCountTransfer(Array.isArray(transferData) ? transferData.length : 0);

            // Set list based on current tab
            if (type === "approved") {
                setListHocSinh(Array.isArray(approvedData) ? approvedData : []);
            } else if (type === "pending") {
                setListHocSinh(Array.isArray(pendingData) ? pendingData : []);
            } else if (type === "transfer") {
                setListHocSinh(Array.isArray(transferData) ? transferData : []);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            showNotification("Không thể tải danh sách học sinh", "error");
            setListHocSinh([]);
        } finally {
            setIsLoading(false);
        }
    }, [idTruongStr, type]);

    // Initial data load with a slight delay to ensure routing is complete
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 100);

        return () => clearTimeout(timer);
    }, [fetchData]);

    // Show notification
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });

        // Auto dismiss after 3 seconds
        const timer = setTimeout(() => {
            setNotification(null);
        }, 3000);

        return () => clearTimeout(timer);
    };

    // Tab change handlers
    const handleShowApproved = () => {
        setType("approved");
        setCurrentPage(1);
    };

    const handleShowPending = () => {
        setType("pending");
        setCurrentPage(1);
    };

    const handleShowTransfer = () => {
        setType("transfer");
        setCurrentPage(1);
    };

    // Action handlers
    const handleApprove = async (idHocSinh: string, duyet: boolean) => {
        setIsLoading(true);
        try {
            await approveHocSinh(idTruongStr, [idHocSinh], duyet);
            const message = duyet ? "Học sinh đã được duyệt thành công!" : "Đã từ chối yêu cầu của học sinh!";

            showNotification(message, "success");
            await fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            showNotification("Lỗi khi cập nhật trạng thái học sinh!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (hocSinh: HocSinh) => {
        setIsLoading(true);
        // setSelectedHocSinh(hocSinh);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const IDHocSinh = selectedHocSinh?.IDHocSinh; // Lấy từ học sinh đã chọn
            const IDTruong = selectedHocSinh?.IDTruong; // Lấy từ trường muốn chuyển
            console.log("IDHocSinh:", IDHocSinh);
            console.log("IDTruong:", IDTruong);
            // if (!IDHocSinh || IDTruong) throw new Error("Thiếu thông tin ID học sinh và truòng học.");

            // Gọi API updateNhapHoc để đặt IDTruong về null (hoặc giá trị mặc định)
            await updateNhapHoc(token, {
                IDHocSinh: Number(IDHocSinh),
                IDTruong: null, // Giá trị mặc định
            });

            // Hiển thị thông báo thành công
            showNotification("Đã từ chối yêu cầu của học sinh!", "success");

            // Tải lại dữ liệu sau khi cập nhật
            await fetchData();
        } catch (error) {
            console.error("Lỗi khi từ chối học sinh:", error);
            showNotification("Lỗi khi từ chối học sinh!", "error");
        } finally {
            setIsLoading(false);
        }
    };
    const handleApproveTransfer = async (idDonChuyenTruong: string, duyet: boolean) => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            // Lấy IDHocSinh và IDTruong từ dữ liệu phù hợp
            const IDHocSinh = selectedHocSinh?.IDHocSinh; // Lấy từ học sinh đã chọn
            const IDTruong = selectedHocSinh?.IDTruongMuonChuyen; // Lấy từ trường muốn chuyển
            console.log("IDHocSinh:", IDHocSinh);
            console.log("IDTruong:", IDTruong);
            if (!IDHocSinh || !IDTruong) {
                throw new Error("Thiếu thông tin học sinh hoặc trường muốn chuyển.");
            }

            // Gọi API updateNhapHoc
            await updateNhapHoc(token, {
                IDHocSinh: Number(IDHocSinh),
                IDTruong: IDTruong,
            });

            const message = duyet ? "Đã chấp nhận yêu cầu chuyển trường!" : "Đã từ chối yêu cầu chuyển trường!";
            showNotification(message, "success");

            setShowTransferDetailPopup(false);
            await fetchData();
        } catch (error) {
            console.error("Lỗi khi xử lý đơn chuyển trường:", error);
            showNotification("Lỗi khi xử lý đơn chuyển trường!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetail = (idHocSinh: string) => {
        navigate(`/dashboard/student/${idTruongStr}/${idHocSinh}`);
    };

    const handleViewTransferDetail = (hocSinh: HocSinh) => {
        setSelectedHocSinh(hocSinh);
        setShowTransferDetailPopup(true);
    };

    const handleDeleteStudentClick = (hocSinh: HocSinh) => {
        setSelectedHocSinh(hocSinh);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async (status: "Đã tốt nghiệp" | "Nghỉ học") => {
        if (!selectedHocSinh) return;

        setIsLoading(true);
        try {
            await deleteHocSinh(selectedHocSinh.IDHocSinh, status);
            showNotification(`Học sinh đã được chuyển sang trạng thái "${status}"`, "success");

            // Close modal first for better UX
            setShowDeletePopup(false);
            setSelectedHocSinh(null);

            // Then fetch updated data
            await fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            showNotification("Lỗi khi cập nhật trạng thái học sinh!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setSelectedHocSinh(null);
        setShowDeletePopup(false);
    };

    const handleCloseTransferDetail = () => {
        setSelectedHocSinh(null);
        setShowTransferDetailPopup(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate total pages and paginated data
    const totalPages = Math.ceil(listHocSinh.length / itemsPerPage);
    const paginatedData = listHocSinh.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Format date helper
    // Format date helper
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="flex flex-col w-full bg-amber-50 min-h-screen">
            {/* Header */}
            <div className="py-6 px-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
                <h2 className="text-3xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Quản Lý Học Sinh
                </h2>
            </div>

            {/* Notification */}
            {notification && (
                <div
                    className={`mx-8 mt-4 p-4 rounded-lg ${
                        notification.type === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" : "bg-red-100 text-red-800 border-l-4 border-red-500"
                    } flex items-center`}
                >
                    {notification.type === "success" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Tab navigation */}
            <div className="px-8 pt-6">
                <div className="flex space-x-2 mb-6">
                    <button
                        className={`px-6 py-3 rounded-t-lg font-medium transition-colors duration-200 flex items-center 
                        ${type === "approved" ? `${colors.primary} text-gray-800` : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                        onClick={handleShowApproved}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Học Sinh Chính Thức
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-800 text-white text-xs font-medium">{countApproved}</span>
                    </button>
                    <button
                        className={`px-6 py-3 rounded-t-lg font-medium transition-colors duration-200 flex items-center
                        ${type === "pending" ? `${colors.primary} text-gray-800` : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                        onClick={handleShowPending}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Học Sinh Chờ Duyệt
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-800 text-white text-xs font-medium">{countPending}</span>
                    </button>
                    <button
                        className={`px-6 py-3 rounded-t-lg font-medium transition-colors duration-200 flex items-center
                        ${type === "transfer" ? `${colors.primary} text-gray-800` : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                        onClick={handleShowTransfer}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Xin Chuyển Trường
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-800 text-white text-xs font-medium">{countTransfer}</span>
                    </button>
                </div>
            </div>

            {/* Content area */}
            <div className="px-8 pb-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                        </div>
                    ) : listHocSinh.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <p className="text-xl font-medium">Không có dữ liệu</p>
                            <p className="mt-2">{type === "transfer" ? "Hiện không có đơn xin chuyển trường nào" : "Hiện không có học sinh nào trong danh sách này"}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Bảng dành cho học sinh chính thức và học sinh chờ duyệt */}
                            {(type === "approved" || type === "pending") && (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800 text-white">
                                            <th className="py-4 px-4 text-left font-medium">STT</th>
                                            <th className="py-4 px-4 text-left font-medium">Họ Tên</th>
                                            <th className="py-4 px-4 text-left font-medium">Nickname</th>
                                            <th className="py-4 px-4 text-left font-medium">Giới Tính</th>
                                            <th className="py-4 px-4 text-left font-medium">Lớp Học</th>
                                            {type === "approved" && <th className="py-4 px-4 text-left font-medium">Trạng thái</th>}
                                            <th className="py-4 px-4 text-center font-medium">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((hs, index) => (
                                            <tr key={hs.IDHocSinh} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="py-4 px-4 font-medium">{hs.hoTen}</td>
                                                <td className="py-4 px-4 text-gray-600">{hs.nickname}</td>
                                                <td className="py-4 px-4">
                                                    {hs.gioiTinh === "Nam" ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Nam
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Nữ
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{hs.IDLopHoc}</span>
                                                </td>
                                                {type === "approved" && (
                                                    <td className="py-4 px-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${
                                                            hs.Status === "Đang học"
                                                                ? "bg-green-100 text-green-800"
                                                                : hs.Status === "Đã tốt nghiệp"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                        >
                                                            {hs.Status}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="py-4 px-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(hs.IDHocSinh)}
                                                            className={`${colors.secondary} ${colors.secondaryHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Xem
                                                        </button>

                                                        {type === "approved" ? (
                                                            <button
                                                                className={`${colors.danger} ${colors.dangerHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                                onClick={() => handleDeleteStudentClick(hs)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                Xoá
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className={`${colors.success} ${colors.successHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                                    onClick={() => handleApprove(hs.IDHocSinh, true)}
                                                                    disabled={isLoading}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Duyệt
                                                                </button>
                                                                <button
                                                                    className={`${colors.danger} ${colors.dangerHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                                    onClick={() => {
                                                                        setSelectedHocSinh(hs); // Lưu đối tượng hs vào state
                                                                        handleReject(hs);
                                                                    }} // Truyền toàn bộ đối tượng hs
                                                                    disabled={isLoading}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Bảng dành cho danh sách học sinh xin chuyển trường */}
                            {type === "transfer" && (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800 text-white">
                                            <th className="py-4 px-4 text-left font-medium">STT</th>
                                            <th className="py-4 px-4 text-left font-medium">Họ Tên</th>
                                            <th className="py-4 px-4 text-left font-medium">Lớp Học</th>
                                            <th className="py-4 px-4 text-left font-medium">Trường muốn chuyển</th>
                                            <th className="py-4 px-4 text-left font-medium">Trạng thái</th>
                                            <th className="py-4 px-4 text-left font-medium">Ngày tạo đơn</th>
                                            <th className="py-4 px-4 text-center font-medium">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((hs, index) => (
                                            <tr key={hs.IDHocSinh + (hs.IDDon || "")} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="py-4 px-4 font-medium">{hs.hoTen}</td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{hs.IDLopHoc}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                        {hs.truongMuonChuyen || "Không xác định"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{hs.ngayTao ? formatDate(hs.ngayTao) : "N/A"}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewTransferDetail(hs)}
                                                            className={`${colors.secondary} ${colors.secondaryHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Chi tiết
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && listHocSinh.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, listHocSinh.length)} trong tổng số {listHocSinh.length}
                                {type === "transfer" ? " đơn chuyển trường" : " học sinh"}
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"
                                    } border border-gray-300`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === i + 1
                                                ? `${colors.primary} text-gray-800 border border-amber-500 font-medium`
                                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"
                                    } border border-gray-300`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeletePopup && selectedHocSinh && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[90%] max-w-md shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xoá học sinh</h3>
                            <p className="text-gray-600 mb-6">
                                Bạn muốn chuyển học sinh <span className="font-semibold text-gray-800">{selectedHocSinh.hoTen}</span> sang trạng thái nào?
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                className={`${colors.accent} ${colors.accentHover} text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm`}
                                onClick={() => handleConfirmDelete("Đã tốt nghiệp")}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                Đã tốt nghiệp
                            </button>
                            <button
                                className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm`}
                                onClick={() => handleConfirmDelete("Nghỉ học")}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                Nghỉ học
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200" disabled={isLoading}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chi tiết đơn chuyển trường modal */}
            {showTransferDetailPopup && selectedHocSinh && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Chi tiết đơn chuyển trường
                            </h2>
                            <button onClick={handleCloseTransferDetail} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Thông tin học sinh */}
                            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                                <h3 className="font-semibold text-lg mb-3 text-amber-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    Thông tin học sinh
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Họ và tên:</span>
                                        <span className="text-gray-800">{selectedHocSinh.hoTen}</span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Giới tính:</span>
                                        <span className="text-gray-800">{selectedHocSinh.gioiTinh}</span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Tên phụ huynh:</span>
                                        <span className="text-gray-800">{selectedHocSinh.tenPhuHuynh}</span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Số điện thoại:</span>
                                        <span className="text-gray-800">{selectedHocSinh.soDienThoaiPhuHuynh}</span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Email:</span>
                                        <span className="text-gray-800">{selectedHocSinh.emailPhuHuynh}</span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Lớp học:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{selectedHocSinh.IDLopHoc}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin đơn chuyển */}
                            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                                <h3 className="font-semibold text-lg mb-3 text-amber-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                        />
                                    </svg>
                                    Thông tin chuyển trường
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Trường muốn chuyển:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                            {selectedHocSinh.truongMuonChuyen || "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <span className="font-medium w-32 text-gray-600">Ngày tạo đơn:</span>
                                        <span className="text-gray-800">{selectedHocSinh.ngayTao ? formatDate(selectedHocSinh.ngayTao) : "N/A"}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center">
                                        <span className="font-medium w-32 text-gray-600">Minh chứng:</span>
                                        <button className="text-blue-600 underline ml-2" onClick={() => setImagePopup({ url: selectedHocSinh.minhChung || "", title: "Minh chứng chuyển trường" })}>
                                            Xem minh chứng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lý do chuyển trường */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-800">Lý do chuyển trường:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700 whitespace-pre-line">{selectedHocSinh.lyDo || "Không có lý do được cung cấp"}</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button onClick={handleCloseTransferDetail} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Đóng
                            </button>
                            {/* <button
                                onClick={() => handleApproveTransfer(selectedHocSinh.IDDon || "", false)}
                                className={`${colors.danger} ${colors.dangerHover} text-white px-4 py-2 rounded-lg font-medium flex items-center`}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Từ chối
                            </button> */}
                            <button
                                onClick={() => handleApproveTransfer(selectedHocSinh.IDDon || "", true)}
                                className={`${colors.success} ${colors.successHover} text-white px-4 py-2 rounded-lg font-medium flex items-center`}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {imagePopup && <ImagePopup imagePopup={imagePopup} onClose={() => setImagePopup(null)} />}
        </div>
    );
};

export default StudentPage;
