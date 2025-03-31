import React, { useEffect, useState } from "react";
import { getApprovedNhanVien, getPendingNhanVien, approveNhanVien, deleteStaff, updateChucVuPhongBan } from "../../services/apiTruongHoc";
import { Navigate, useNavigate } from "react-router-dom";
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
    const { idTruong } = useAuth(); // Lấy IDTruong từ context
    const idTruongStr = idTruong ? String(idTruong) : "";
    console.log("ID Trường:", idTruongStr);
    const [listNhanVien, setListNhanVien] = useState<NhanVien[]>([]);
    const [selectedNhanVien, setSelectedNhanVien] = useState<NhanVien | null>(null);
    const [type, setType] = useState("approved");
    const [countApproved, setCountApproved] = useState(0);
    const [countPending, setCountPending] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [chucVu, setChucVu] = useState("Chưa Phân");
    const [phongBan, setPhongBan] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [filterChucVu, setFilterChucVu] = useState("");
    const [filterPhongBan, setFilterPhongBan] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const itemsPerPage = 5;
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
    }, [idTruongStr]);

    const fetchData = async () => {
        if (!idTruongStr) return;
        const approvedData = await getApprovedNhanVien(idTruongStr);
        const pendingData = await getPendingNhanVien(idTruongStr);
        setListNhanVien(type === "approved" ? approvedData : pendingData);
        setCountApproved(approvedData.length);
        setCountPending(pendingData.length);
    };
    const filteredNhanVien = listNhanVien.filter(
        (nv) =>
            nv.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) &&
            nv.SDT.includes(searchPhone) &&
            (filterGender ? nv.gioiTinh === filterGender : true) &&
            (filterChucVu ? nv.chucVu === filterChucVu : true) &&
            (filterStatus ? nv.Status === filterStatus : true)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNhanVien.slice(indexOfFirstItem, indexOfLastItem);
    const nextPage = () => {
        if (indexOfLastItem < listNhanVien.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalPages = Math.ceil(listNhanVien.length / itemsPerPage);

    const handleShowApproved = async () => {
        setType("approved");
        const approvedData = await getApprovedNhanVien(idTruongStr);
        setListNhanVien(approvedData);
    };

    const handleShowPending = async () => {
        setType("pending");
        const pendingData = await getPendingNhanVien(idTruongStr);
        setListNhanVien(pendingData);
    };

    const handleApprove = async (idNhanVien: string, duyet: boolean) => {
        try {
            await approveNhanVien(idTruongStr, [idNhanVien], duyet);
            alert(`Nhân viên đã được ${duyet ? "duyệt" : "từ chối"}!`);
            if (!duyet) {
                setListNhanVien(listNhanVien.filter((nv) => nv.IDNhanVien !== idNhanVien));
                setCountPending(countPending - 1);
            } else {
                fetchData();
            }
        } catch (error) {
            console.error("Lỗi khi duyệt nhân viên:", error);
            alert("Lỗi khi cập nhật trạng thái nhân viên!");
        }
    };

    const handleEdit = (nhanVien: NhanVien) => {
        setSelectedNhanVien(nhanVien);
        setChucVu(nhanVien.chucVu || "Chưa Phân");
        setPhongBan(nhanVien.phongBan || "");
        setShowPopup(true);
    };
    const handleViewDetail = (idNhanVien: string) => {
        navigate(`/dashboard/staff/${idTruongStr}/${idNhanVien}`); // Chuyển hướng đến trang chi tiết
    };

    const handleDeleteStaff = async (idTruongStr: string, idNhanVien: string) => {
        try {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?");
            if (!confirmDelete) return;

            await deleteStaff(idTruongStr, idNhanVien);
            alert("Xóa nhân viên thành công!");

            // Cập nhật danh sách nhân viên chính thức chỉ với những người có Status = 'Hoạt động'
            const updatedList = await getApprovedNhanVien(idTruongStr);
            setListNhanVien(updatedList);
            setCountApproved(updatedList.length);
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error);
            alert("Không thể xóa nhân viên. Vui lòng thử lại.");
        }
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

    return (
        <div className="flex flex-col w-full items-center justify-center bg-gray-100 p-6">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Quản Lý Nhân Viên</h2>

            <div className="flex flex-row w-full max-w-6xl justify-between mb-4">
                <button className={`px-4 py-2 rounded-md transition ${type === "approved" ? "bg-blue-700 text-black" : "bg-blue-600 text-white"}`} onClick={handleShowApproved}>
                    Cán Bộ Cơ Hữu ({countApproved})
                </button>
                <button className={`px-4 py-2 rounded-md transition ${type === "pending" ? "bg-blue-700 text-black" : "bg-blue-600 text-white"}`} onClick={handleShowPending}>
                    Cán Bộ Chờ Duyệt ({countPending})
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 w-full max-w-6xl">
                <input type="text" placeholder="Tìm theo tên       " value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded" />

                <select onChange={(e) => setFilterGender(e.target.value)} className="p-2 border rounded">
                    <option value="">Giới Tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <select onChange={(e) => setFilterChucVu(e.target.value)} className="p-2 border rounded">
                    <option value="">Chức vụ</option>
                    <option value="Chưa phân">Chưa phân</option>
                    <option value="Hiệu trưởng">Hiệu trưởng</option>
                    <option value="Cán bộ">Cán bộ</option>
                </select>
                <input type="text" placeholder="Tìm theo SĐT" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className="p-2 border rounded" />
                <select onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
                    <option value="">Trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Dừng">Dừng</option>
                </select>
            </div>

            <div className="w-full max-w-6xl bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-600 text-black">
                            {type === "approved" ? (
                                <>
                                    <th className="py-3 px-4 text-left">STT</th>
                                    <th className="py-3 px-4 text-left">Họ Tên</th>
                                    <th className="py-3 px-4 text-left">Giới Tính</th>
                                    <th className="py-3 px-4 text-left">Chức Vụ</th>
                                    <th className="py-3 px-4 text-left">SĐT</th>
                                    <th className="py-3 px-4 text-left">Trạng thái</th>
                                    <th className="py-3 px-4 text-center">Hành Động</th>
                                </>
                            ) : (
                                <>
                                    <th className="py-3 px-4 text-left">STT</th>
                                    <th className="py-3 px-4 text-left">Họ Tên</th>
                                    <th className="py-3 px-4 text-left">Giới Tính</th>
                                    <th className="py-3 px-4 text-left">SĐT</th>
                                    <th className="py-3 px-4 text-center">Hành Động</th>
                                </>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((nv, index) => (
                                <tr key={nv.IDNhanVien} className="border-b">
                                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="py-3 px-4">{nv.hoTen}</td>
                                    <td className="py-3 px-4">{nv.gioiTinh}</td>
                                    {type === "approved" ? (
                                        <>
                                            <td className="py-3 px-4">{nv.chucVu}</td>
                                            <td className="py-3 px-4">{nv.SDT}</td>
                                            <td className="py-3 px-4">{nv.Status}</td>
                                        </>
                                    ) : (
                                        <td className="py-3 px-4">{nv.SDT}</td>
                                    )}
                                    <td className="py-3 px-4 flex justify-center gap-2">
                                        <button onClick={() => handleViewDetail(nv.IDNhanVien)} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                                            👁 Xem
                                        </button>
                                        {type === "approved" && (
                                            <>
                                                <button onClick={() => handleEdit(nv)} className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">
                                                    ✏ Cập Nhật
                                                </button>
                                                <button onClick={() => handleDeleteStaff(idTruongStr, nv.IDNhanVien)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                    🗑 Xoá
                                                </button>
                                            </>
                                        )}
                                        {type === "pending" && (
                                            <>
                                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => handleApprove(nv.IDNhanVien, true)}>
                                                    ✔ Duyệt
                                                </button>
                                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleApprove(nv.IDNhanVien, false)}>
                                                    ✖ Không Duyệt
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={type === "approved" ? 7 : 5} className="text-center py-4 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between w-full max-w-6xl mt-4">
                <button onClick={prevPage} className="bg-gray-300 px-4 py-2 rounded" disabled={currentPage === 1}>
                    ◀ Trước
                </button>
                <span>
                    Trang {currentPage} / {totalPages}
                </span>
                <button onClick={nextPage} className="bg-gray-300 px-4 py-2 rounded" disabled={indexOfLastItem >= listNhanVien.length}>
                    Sau ▶
                </button>
            </div>

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
                        <label className="block mt-4 mb-2">Phòng Ban:</label>
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
