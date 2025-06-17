import React, { useEffect, useState } from "react";
import { getRooms, createRoom, getRoomDetail, updateRoom, deleteRoom } from "../../services/school/apiRoom";
import { toast } from "react-toastify";
import { FaPlus, FaSearch, FaBuilding, FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getApprovedNhanVien } from "../../services/school/apiSchool";

const RoomPage: React.FC = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [danhSachGiaoVien, setDanhSachGiaoVien] = useState<any[]>([]);
    const [selectedGiaoVien, setSelectedGiaoVien] = useState<number | null>(null);

    const [newRoom, setNewRoom] = useState<{
        tenPhong: string;
        sucChua: number;
        moTa: string;
        IDGVCN: number | null;
        IDLopHoc: number | null;
        Status: string;
    }>({
        tenPhong: "",
        sucChua: 0,
        moTa: "",
        IDGVCN: null,
        IDLopHoc: null,
        Status: "Hoạt động",
    });
    const [idTruong] = useState<number>(1); // ID trường học (có thể lấy từ context hoặc params)
    const [activeTab, setActiveTab] = useState<string>("Hoạt động"); // Tab hiện tại

    // Lấy danh sách phòng học
    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const data = await getRooms(idTruong);
            setRooms(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phòng học:", error);
            toast.error("Không thể tải danh sách phòng học!");
        } finally {
            setIsLoading(false);
        }
    };

    // Lọc phòng học theo trạng thái
    const filteredRooms = rooms.filter((room) => room.Status === activeTab);

    // Thêm phòng học
    const handleAddRoom = async () => {
        if (!newRoom.tenPhong || newRoom.sucChua <= 0) {
            toast.error("Vui lòng nhập đầy đủ thông tin phòng học!");
            return;
        }

        try {
            await createRoom({ ...newRoom, IDTruong: idTruong });
            toast.success("Thêm phòng học thành công!");
            setNewRoom({ tenPhong: "", sucChua: 0, moTa: "", IDGVCN: null, IDLopHoc: null, Status: "Hoạt động" });
            setIsPopupOpen(false);
            fetchRooms();
        } catch (error) {
            console.error("Lỗi khi thêm phòng học:", error);
            toast.error("Không thể thêm phòng học!");
        }
    };

    // Cập nhật phòng học
    // Cập nhật phòng học
    const handleUpdateRoom = async () => {
        if (!newRoom.tenPhong || newRoom.sucChua <= 0) {
            toast.error("Vui lòng nhập đầy đủ thông tin phòng học!");
            return;
        }

        try {
            if (selectedRoom) {
                await updateRoom(selectedRoom.IDPhongHoc, newRoom);
                toast.success("Cập nhật phòng học thành công!");
                setNewRoom({ tenPhong: "", sucChua: 0, moTa: "", IDGVCN: null, IDLopHoc: null, Status: "Hoạt động" });
                setIsEditPopupOpen(false);
                fetchRooms();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật phòng học:", error);
            toast.error("Không thể cập nhật phòng học!");
        }
    };

    // Mở popup để chỉnh sửa phòng học
    const handleEditRoom = async (idPhongHoc: number) => {
        try {
            const room = await getRoomDetail(idPhongHoc);
            setSelectedRoom(room);
            setNewRoom({
                tenPhong: room.tenPhong,
                sucChua: room.sucChua,
                moTa: room.moTa || "",
                IDGVCN: room.IDGVCN || null,
                IDLopHoc: room.IDLopHoc || null,
                Status: room.Status || "Hoạt động",
            });
            setSelectedGiaoVien(room.IDGVCN || null);
            // Lấy danh sách giáo viên
            const dsGV = await getApprovedNhanVien(String(idTruong));
            setDanhSachGiaoVien(dsGV);
            setIsEditPopupOpen(true);
        } catch (error) {
            toast.error("Không thể lấy thông tin phòng học!");
        }
    };

    // Xóa phòng học
    const handleDeleteRoom = async (idPhongHoc: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phòng học này?")) return;

        try {
            await deleteRoom(idPhongHoc);
            toast.success("Xóa phòng học thành công!");
            fetchRooms();
        } catch (error) {
            console.error("Lỗi khi xóa phòng học:", error);
            toast.error("Không thể xóa phòng học!");
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className="p-6 bg-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng học</h1>
                    <button onClick={() => setIsPopupOpen(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center">
                        <FaPlus className="mr-2" /> Thêm phòng học
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    {["Hoạt động", "Bảo trì"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search bar */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {/* Danh sách phòng học */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <div key={room.IDPhongHoc} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-amber-100">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{room.tenPhong}</h3>
                                    </div>
                                    <div className="p-5">
                                        {/* Badge status */}
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                                                room.Status === "Hoạt động" ? "bg-green-100 text-green-800" : room.Status === "Bảo trì" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {room.Status}
                                        </span>

                                        {/* Room info */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center">
                                                <FaUsers className="text-amber-500 mr-2 flex-shrink-0" />
                                                <p className="text-gray-700">
                                                    Sức chứa: <span className="font-medium">{room.sucChua}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-amber-500">
                                                        <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L17 3.689V3.5A3.5 3.5 0 0 0 13.5 0h-3A3.5 3.5 0 0 0 7 3.5v.189l.782-.783c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.414.586-.586.88-.586 1.414.208 1.036.586 1.414L11 11.78v8.722c0 .829.671 1.5 1.5 1.5s1.5-.671 1.5-1.5V11.78l6.045-6.379zM16 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-700 ml-2">
                                                    {room.moTa ? <span className="line-clamp-2">{room.moTa}</span> : <span className="italic text-gray-400">Không có mô tả</span>}
                                                </p>
                                            </div>
                                            {/* Hiển thị tên giáo viên chủ nhiệm */}
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">G</div>
                                                <p className="text-gray-600 ml-2 text-sm">
                                                    Người phụ trách:{" "}
                                                    {room.tenGiaoVienChuNhiem ? (
                                                        <span className="font-medium">{room.tenGiaoVienChuNhiem}</span>
                                                    ) : room.IDGVCN ? (
                                                        <span className="font-medium">GV-{room.IDGVCN}</span>
                                                    ) : (
                                                        <span className="italic text-gray-400">Chưa phân công</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional info */}
                                        {/* <div className="rounded-lg bg-gray-50 p-3 space-y-2 mb-4">
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">G</div>
                                                <p className="text-gray-600 ml-2 text-sm">
                                                    Người phụ trách:{" "}
                                                    {room.IDGVCN ? <span className="font-medium">GV-{room.IDGVCN}</span> : <span className="italic text-gray-400">Chưa phân công</span>}
                                                </p>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">L</div>
                                                <p className="text-gray-600 ml-2 text-sm">
                                                    Lớp học liên kết:{" "}
                                                    {room.IDLopHoc ? <span className="font-medium">Lớp {room.IDLopHoc}</span> : <span className="italic text-gray-400">Chưa liên kết</span>}
                                                </p>
                                            </div>
                                        </div> */}

                                        {/* Action buttons */}
                                        <div className="flex justify-end space-x-2 pt-2 border-t">
                                            <button
                                                onClick={() => handleEditRoom(room.IDPhongHoc)}
                                                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit className="mr-1" /> Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoom(room.IDPhongHoc)}
                                                className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                                                title="Xóa"
                                            >
                                                <FaTrash className="mr-1" /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center p-12 bg-white rounded-lg shadow-md border border-dashed border-gray-300">
                                <div className="bg-amber-50 inline-flex rounded-full p-4 mb-4">
                                    <FaBuilding className="text-amber-300 text-4xl" />
                                </div>
                                <p className="text-gray-500 text-lg font-medium">Không tìm thấy phòng học nào</p>
                                <p className="text-gray-400 mt-2">Thêm phòng học mới hoặc thay đổi bộ lọc tìm kiếm</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Popup thêm phòng học */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Thêm phòng học</h2>
                            <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên phòng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên phòng"
                                    value={newRoom.tenPhong}
                                    onChange={(e) => setNewRoom({ ...newRoom, tenPhong: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sức chứa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Nhập số lượng học sinh"
                                    value={newRoom.sucChua}
                                    onChange={(e) => setNewRoom({ ...newRoom, sucChua: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    placeholder="Nhập mô tả phòng học"
                                    value={newRoom.moTa}
                                    onChange={(e) => setNewRoom({ ...newRoom, moTa: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end space-x-3">
                            <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg">
                                Hủy
                            </button>
                            <button onClick={handleAddRoom} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup cập nhật phòng học */}
            {isEditPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Cập nhật phòng học</h2>
                            <button onClick={() => setIsEditPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên phòng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên phòng"
                                    value={newRoom.tenPhong}
                                    onChange={(e) => setNewRoom({ ...newRoom, tenPhong: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sức chứa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Nhập số lượng học sinh"
                                    value={newRoom.sucChua}
                                    onChange={(e) => setNewRoom({ ...newRoom, sucChua: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Người phụ trách </label>
                                <select
                                    value={selectedGiaoVien || ""}
                                    onChange={(e) => setSelectedGiaoVien(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">-- Chọn giáo viên --</option>
                                    {danhSachGiaoVien.map((gv) => (
                                        <option key={gv.IDGiaoVien} value={gv.IDGiaoVien}>
                                            {gv.hoTen}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <select
                                    value={newRoom.Status}
                                    onChange={(e) => setNewRoom({ ...newRoom, Status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Bảo trì">Bảo trì</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    placeholder="Nhập mô tả phòng học"
                                    value={newRoom.moTa}
                                    onChange={(e) => setNewRoom({ ...newRoom, moTa: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end space-x-3">
                            <button onClick={() => setIsEditPopupOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg">
                                Hủy
                            </button>
                            <button onClick={() => handleAddRoom()} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomPage;
