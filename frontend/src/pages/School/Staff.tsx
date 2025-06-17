import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedNhanVien, getPendingNhanVien, approveNhanVien, deleteStaff, updateChucVuPhongBan } from "../../services/school/apiSchool";
import { useAuth } from "../../context/AuthContext";

type NhanVien = {
    IDNhanVien: string;
    hoTen: string;
    gioiTinh: string;
    chucVu?: string;
    phongBan?: string;
    SDT: string;
    Status: string;
};

const Staff = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const [listNhanVien, setListNhanVien] = useState<NhanVien[]>([]);
    const [type, setType] = useState("approved");
    const [countApproved, setCountApproved] = useState(0);
    const [countPending, setCountPending] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNhanVien, setSelectedNhanVien] = useState<NhanVien | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [chucVu, setChucVu] = useState("Chưa Phân");
    const [phongBan, setPhongBan] = useState("");
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

    useEffect(() => {
        fetchData();
    }, [idTruongStr, type]);

    const fetchData = async () => {
        if (!idTruongStr) return;
        setIsLoading(true);
        try {
            const approvedData = await getApprovedNhanVien(idTruongStr);
            const pendingData = await getPendingNhanVien(idTruongStr);

            setCountApproved(approvedData.length);
            setCountPending(pendingData.length);
            setListNhanVien(type === "approved" ? approvedData : pendingData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowApproved = () => {
        setType("approved");
        setCurrentPage(1);
    };

    const handleShowPending = () => {
        setType("pending");
        setCurrentPage(1);
    };

    const handleApprove = async (idNhanVien: string, duyet: boolean) => {
        try {
            await approveNhanVien(idTruongStr, [idNhanVien], duyet);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái nhân viên:", error);
        }
    };

    const handleViewDetail = (idNhanVien: string) => {
        navigate(`/dashboard/staff/${idTruongStr}/${idNhanVien}`);
    };

    const handleDeleteStaff = async (idNhanVien: string) => {
        try {
            await deleteStaff(idTruongStr, idNhanVien);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error);
        }
    };
    const handleEdit = (nhanVien: NhanVien) => {
        setSelectedNhanVien(nhanVien);
        setChucVu(nhanVien.chucVu || "Chưa Phân");
        setPhongBan(nhanVien.phongBan || "");
        setShowPopup(true);
    };
    const handleUpdate = async () => {
        if (!selectedNhanVien) return;
        try {
            await updateChucVuPhongBan(idTruongStr, selectedNhanVien.IDNhanVien, { chucVu, phongBan });
            alert("Cập nhật thành công!");
            setShowPopup(false);
            fetchData();
        } catch (error) {
            alert("Cập nhật thất bại!");
        }
    };
    const totalPages = Math.ceil(listNhanVien.length / itemsPerPage);
    const paginatedData = listNhanVien.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="py-6 px-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
                <h2 className="text-3xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Quản Lý Cán Bộ
                </h2>
            </div>

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
                        Cán Bộ Chính Thức
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
                        Cán Bộ Chờ Duyệt
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-800 text-white text-xs font-medium">{countPending}</span>
                    </button>
                </div>
            </div>

            {/* Content area */}
            <div className="px-8 pb-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                        </div>
                    ) : listNhanVien.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="py-4 px-4 text-left font-medium">STT</th>
                                    <th className="py-4 px-4 text-left font-medium">Họ Tên</th>
                                    <th className="py-4 px-4 text-left font-medium">Giới Tính</th>
                                    <th className="py-4 px-4 text-left font-medium">Chức Vụ</th>
                                    <th className="py-4 px-4 text-left font-medium">SĐT</th>
                                    <th className="py-4 px-4 text-left font-medium">Trạng Thái</th>

                                    <th className="py-4 px-4 text-left font-medium">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.map((nv, index) => (
                                    <tr key={nv.IDNhanVien}>
                                        <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{nv.hoTen}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{nv.gioiTinh}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{nv.chucVu || "Chưa phân"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{nv.SDT}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{nv.Status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(nv.IDNhanVien)}
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

                                                {type === "approved" && (
                                                    <>
                                                        <button onClick={() => handleEdit(nv)} className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">
                                                            ✏ Cập Nhật
                                                        </button>

                                                        <button
                                                            className={`${colors.danger} ${colors.dangerHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                            onClick={() => handleDeleteStaff(nv.IDNhanVien)}
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
                                                    </>
                                                )}
                                                {type === "pending" && (
                                                    <>
                                                        <button
                                                            className={`${colors.success} ${colors.successHover} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                                                            onClick={() => handleApprove(nv.IDNhanVien, true)}
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
                                                            onClick={() => handleApprove(nv.IDNhanVien, false)}
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
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && listNhanVien.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, listNhanVien.length)} trong tổng số {listNhanVien.length} cán bộ
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"} border border-gray-300`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === i + 1 ? `${colors.primary} text-gray-800 border border-yellow-500 font-medium` : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Cập nhật thông tin cho {selectedNhanVien?.hoTen}</h3>

                        <label className="block mb-2">Chức Vụ:</label>
                        <select value={chucVu} onChange={(e) => setChucVu(e.target.value)} className="w-full p-2 border rounded">
                            <option value="Chưa Phân">Chưa Phân</option>
                            <option value="Hiệu trưởng">Hiệu trưởng</option>
                            <option value="Cán Bộ">Cán Bộ</option>
                        </select>
                        {/* <label className="block mt-4 mb-2">Phòng Ban:</label> */}
                        <input type="text" value={phongBan} onChange={(e) => setPhongBan(e.target.value)} className="w-full p-2 border rounded" />
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                Hủy
                            </button>
                            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Cập Nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
