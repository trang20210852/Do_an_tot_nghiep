import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assignGiaoVien, assignHocSinhToLop, createZaloGroup, getLopHocDetail } from "../../services/school/apiClass";
import { getDanhSachHocSinhDuyet } from "../../services/apiStudent";
import { getApprovedNhanVien } from "../../services/school/apiSchool";
import { useAuth } from "../../context/AuthContext";

interface LopHocDetail {
    IDLopHoc: number;
    tenLop: string;
    doTuoi: string;
    siSo: number;
    linkZaloGroup: string;
    giaoVienChuNhiem?: string;
    danhSachHocSinh: Array<{
        IDHocSinh: number;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: string;
        Avatar: string;
    }>;
}

const ClassDetail: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const { id } = useParams<{ id?: string }>();
    const [lopHoc, setLopHoc] = useState<LopHocDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [danhSachGiaoVien, setDanhSachGiaoVien] = useState<any[]>([]);
    const [danhSachHocSinh, setDanhSachHocSinh] = useState<any[]>([]);
    const [selectedGiaoVien, setSelectedGiaoVien] = useState<number | null>(null);
    const [selectedHocSinh, setSelectedHocSinh] = useState<number[]>([]);
    const [isGiaoVienPopupOpen, setIsGiaoVienPopupOpen] = useState(false);
    const [isHocSinhPopupOpen, setIsHocSinhPopupOpen] = useState(false);
    const [searchHocSinh, setSearchHocSinh] = useState("");
    const [zaloLink, setZaloLink] = useState("");
    const [isCreatingZaloGroup, setIsCreatingZaloGroup] = useState(false);

    useEffect(() => {
        const fetchLopHocDetail = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getLopHocDetail(Number(id));
                setLopHoc(data);
                setZaloLink(data.linkZaloGroup || "");
            } catch (err: any) {
                console.error("Lỗi khi lấy chi tiết lớp học:", err);
                setError(err.message || "Không thể lấy thông tin lớp học.");
            } finally {
                setLoading(false);
            }
        };

        const fetchDanhSach = async () => {
            try {
                const giaoVienList = await getApprovedNhanVien(idTruongStr);
                const hocSinhList = await getDanhSachHocSinhDuyet(idTruongStr);
                setDanhSachGiaoVien(giaoVienList);
                setDanhSachHocSinh(hocSinhList);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách giáo viên hoặc học sinh:", err);
            }
        };

        fetchLopHocDetail();
        fetchDanhSach();
    }, [id, idTruongStr]);

    const handleAssignGiaoVien = async () => {
        if (!id || !selectedGiaoVien) return;
        try {
            await assignGiaoVien(Number(id), selectedGiaoVien);
            const data = await getLopHocDetail(Number(id));
            setLopHoc(data);
            setSelectedGiaoVien(null);
            setIsGiaoVienPopupOpen(false);
            showNotification("Phân giáo viên chủ nhiệm thành công!", "success");
        } catch (err) {
            console.error("Lỗi khi phân giáo viên:", err);
            showNotification("Không thể phân giáo viên.", "error");
        }
    };

    const handleAssignHocSinh = async () => {
        if (!id || selectedHocSinh.length === 0) return;
        try {
            await assignHocSinhToLop(selectedHocSinh, Number(id));
            const data = await getLopHocDetail(Number(id));
            setLopHoc(data);
            setSelectedHocSinh([]);
            setIsHocSinhPopupOpen(false);
            showNotification("Thêm học sinh vào lớp thành công!", "success");
        } catch (err) {
            console.error("Lỗi khi chia học sinh:", err);
            showNotification("Không thể chia học sinh.", "error");
        }
    };

    const handleCreateZaloGroup = async () => {
        if (!id || !zaloLink.trim()) return;
        setIsCreatingZaloGroup(true);
        try {
            await createZaloGroup(Number(id), zaloLink);
            const updatedData = await getLopHocDetail(Number(id));
            setLopHoc(updatedData);
            setZaloLink(updatedData.linkZaloGroup || "");
            alert("Tạo nhóm Zalo thành công!");
        } catch (err) {
            console.error("Lỗi khi tạo nhóm Zalo:", err);
            alert("Không thể tạo nhóm Zalo.");
        } finally {
            setIsCreatingZaloGroup(false);
        }
    };

    const showNotification = (message: string, type: "success" | "error") => {
        const notifyDiv = document.createElement("div");
        notifyDiv.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${type === "success" ? "bg-amber-500" : "bg-red-500"} text-white font-medium z-50 animate-fade-in-out`;
        notifyDiv.textContent = message;
        document.body.appendChild(notifyDiv);

        setTimeout(() => {
            notifyDiv.classList.add("opacity-0");
            setTimeout(() => document.body.removeChild(notifyDiv), 500);
        }, 3000);
    };
    // Hàm tính tuổi từ ngày sinh
    const tinhTuoi = (ngaySinh: string) => {
        const birth = new Date(ngaySinh);
        const today = new Date();
        let tuoi = today.getFullYear() - birth.getFullYear();

        return tuoi;
    };

    // Lọc theo tên và theo độ tuổi lớp
    // const filteredHocSinh = danhSachHocSinh.filter((hs) => {
    //     const matchName = hs.hoTen.toLowerCase().includes(searchHocSinh.toLowerCase());
    //     // Giả sử lopHoc.doTuoi là số tuổi, ví dụ: "5" hoặc "4"
    //     const matchAge = lopHoc && tinhTuoi(hs.ngaySinh) === Number(lopHoc.doTuoi);
    //     return matchName && matchAge;
    // });
    const filteredHocSinh = danhSachHocSinh.filter((hs) => {
        const matchName = hs.hoTen.toLowerCase().includes(searchHocSinh.toLowerCase());
        const matchAge = lopHoc && tinhTuoi(hs.ngaySinh) === Number(lopHoc.doTuoi);
        const chuaCoLop = !hs.IDLopHoc; // hoặc hs.lopHienTai === null
        return matchName && matchAge && chuaCoLop;
    });
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                <span className="ml-3 text-lg font-medium text-gray-600">Đang tải...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 my-4 rounded">
                <div className="flex items-center">
                    <div className="text-red-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Chi Tiết Lớp Học</h1>
                <div className="h-1 w-20 bg-amber-500 mt-2"></div>
            </div>

            {lopHoc && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header section with class info */}
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 px-6 py-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">{lopHoc.tenLop}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-light opacity-80">Giáo viên chủ nhiệm</p>
                                    <p className="font-semibold">{lopHoc.giaoVienChuNhiem || "Chưa có"}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-light opacity-80">Sĩ số</p>
                                    <p className="font-semibold">{lopHoc.danhSachHocSinh.length} học sinh</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-light opacity-80">Độ tuổi</p>
                                    <p className="font-semibold">{lopHoc.doTuoi}</p>
                                </div>
                            </div>
                        </div>
                        {/* Nhóm Zalo */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Nhóm Zalo</h3>
                            {lopHoc.linkZaloGroup ? (
                                <a href={lopHoc.linkZaloGroup} target="_blank" rel="noopener noreferrer" className="text-amber-900 underline">
                                    Truy cập nhóm Zalo : {lopHoc.linkZaloGroup}
                                </a>
                            ) : (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Nhập link nhóm Zalo"
                                        value={zaloLink}
                                        onChange={(e) => setZaloLink(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-2 w-full text-black"
                                    />
                                    <button onClick={handleCreateZaloGroup} disabled={isCreatingZaloGroup} className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-lg">
                                        {isCreatingZaloGroup ? "Đang tạo..." : "Tạo nhóm Zalo"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-4">
                        <button
                            onClick={() => setIsGiaoVienPopupOpen(true)}
                            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Phân Công
                        </button>

                        <button
                            onClick={() => setIsHocSinhPopupOpen(true)}
                            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Thêm Học Sinh
                        </button>
                    </div>

                    {/* Student list */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Danh Sách Học Sinh</h3>
                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Tổng số: {lopHoc.danhSachHocSinh.length} học sinh</div>
                        </div>

                        {lopHoc.danhSachHocSinh.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <p className="text-lg">Chưa có học sinh nào trong lớp này</p>
                                <button onClick={() => setIsHocSinhPopupOpen(true)} className="mt-4 text-amber-600 hover:underline font-medium focus:outline-none">
                                    Thêm học sinh ngay
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lopHoc.danhSachHocSinh.map((hs) => (
                                    <div key={hs.IDHocSinh} className="flex items-center p-4 bg-gray-50 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center text-white
                                                ${hs.gioiTinh.toLowerCase() === "nam" ? "bg-amber-800" : "bg-yellow-300"}`}
                                            >
                                                {hs.Avatar ? <img src={hs.Avatar} className="w-full h-full rounded-full object-cover" /> : hs.hoTen.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-800">{hs.hoTen}</p>
                                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                                <span
                                                    className={`inline-block h-2 w-2 rounded-full mr-2
                                                    ${hs.gioiTinh.toLowerCase() === "nam" ? "bg-amber-800" : "bg-yellow-300"}`}
                                                ></span>
                                                {hs.gioiTinh} • {new Date(hs.ngaySinh).toLocaleDateString("vi-VN")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal assign teacher */}
            {isGiaoVienPopupOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                        {/* Modal header */}
                        <div className="bg-amber-600 text-white px-6 py-4 rounded-t-xl">
                            <h3 className="text-xl font-medium">Chọn Giáo Viên Chủ Nhiệm</h3>
                            <p className="text-amber-100 text-sm mt-1">Lớp: {lopHoc?.tenLop}</p>
                        </div>

                        {/* Modal body */}
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh sách giáo viên</label>
                                <select
                                    value={selectedGiaoVien || ""}
                                    onChange={(e) => setSelectedGiaoVien(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-500 transition-all"
                                >
                                    <option value="">-- Chọn giáo viên --</option>
                                    {danhSachGiaoVien.map((gv) => (
                                        <option key={gv.IDNhanVien} value={gv.IDNhanVien}>
                                            {gv.hoTen}
                                        </option>
                                    ))}
                                </select>
                                {danhSachGiaoVien.length === 0 && <p className="mt-2 text-sm text-orange-600">Không có giáo viên nào trong danh sách.</p>}
                            </div>

                            {/* Modal footer */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsGiaoVienPopupOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    onClick={handleAssignGiaoVien}
                                    disabled={!selectedGiaoVien}
                                    className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                                        ${!selectedGiaoVien ? "bg-amber-300 text-white cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700 transition-colors"}`}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal assign students */}
            {isHocSinhPopupOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                        {/* Modal header */}
                        <div className="bg-amber-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-medium">Thêm Học Sinh </h3>
                                <p className="text-amber-100 text-sm mt-1">Lớp: {lopHoc?.tenLop}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Đã chọn: {selectedHocSinh.length}</div>
                        </div>

                        {/* Modal body */}
                        <div className="p-6">
                            {/* Search bar */}
                            <div className="mb-4 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm học sinh..."
                                    value={searchHocSinh}
                                    onChange={(e) => setSearchHocSinh(e.target.value)}
                                    className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-amber-200 focus:border-amber-500"
                                />
                            </div>

                            {/* Student list */}
                            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                                {filteredHocSinh.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">Không tìm thấy học sinh nào</div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {filteredHocSinh.map((hs) => (
                                            <li key={hs.IDHocSinh} className="p-3 hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`hs-${hs.IDHocSinh}`}
                                                        value={hs.IDHocSinh}
                                                        checked={selectedHocSinh.includes(hs.IDHocSinh)}
                                                        onChange={(e) => {
                                                            const id = Number(e.target.value);
                                                            setSelectedHocSinh((prev) => (e.target.checked ? [...prev, id] : prev.filter((item) => item !== id)));
                                                        }}
                                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                                    />
                                                    <label htmlFor={`hs-${hs.IDHocSinh}`} className="ml-3 flex items-center cursor-pointer flex-1">
                                                        <div
                                                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white mr-3
                                                            ${hs.gioiTinh?.toLowerCase() === "nam" ? "bg-amber-500" : "bg-pink-500"}`}
                                                        >
                                                            {hs.hoTen.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{hs.hoTen}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {hs.gioiTinh} • {hs.ngaySinh && new Date(hs.ngaySinh).toLocaleDateString("vi-VN")}
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Select all option */}
                            {filteredHocSinh.length > 0 && (
                                <div className="mt-3 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="select-all"
                                        checked={filteredHocSinh.length > 0 && filteredHocSinh.every((hs) => selectedHocSinh.includes(hs.IDHocSinh))}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const allIds = filteredHocSinh.map((hs) => hs.IDHocSinh);
                                                setSelectedHocSinh((prev) => {
                                                    const newSelection = [...prev];
                                                    allIds.forEach((id) => {
                                                        if (!newSelection.includes(id)) newSelection.push(id);
                                                    });
                                                    return newSelection;
                                                });
                                            } else {
                                                const allIds = filteredHocSinh.map((hs) => hs.IDHocSinh);
                                                setSelectedHocSinh((prev) => prev.filter((id) => !allIds.includes(id)));
                                            }
                                        }}
                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                    />
                                    <label htmlFor="select-all" className="ml-2 text-sm text-gray-700 cursor-pointer">
                                        Chọn tất cả học sinh hiển thị
                                    </label>
                                </div>
                            )}

                            {/* Modal footer */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsHocSinhPopupOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    onClick={handleAssignHocSinh}
                                    disabled={selectedHocSinh.length === 0}
                                    className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                                        ${selectedHocSinh.length === 0 ? "bg-amber-300 text-white cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700 transition-colors"}`}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetail;
