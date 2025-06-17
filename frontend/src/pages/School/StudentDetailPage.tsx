import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHocSinhDetail, getThongTinHocSinh, updateHocSinh } from "../../services/apiStudent";
import { User, Calendar, Book, Heart, Star, AlertTriangle, Phone, Mail, Home, Edit2, X, Save, Loader, UserPlus, Activity, Check } from "lucide-react";

interface HocSinh {
    IDHocSinh: number;
    hoTen: string;
    nickname: string;
    gioiTinh: string;
    ngaySinh: string;
    ngayNhapHoc: string;
    ngayRaTruong: string | null;
    thongTinSucKhoe: string;
    tinhHinhHocTap: string;
    Avatar: string;
    duyet: number;
    Status: string;
    IDTruong: number;
    IDLopHoc: number | null;
    cccd: string;
    giayKhaiSinh: string;
    hoKhau: string;
    soThich: string;
    uuDiem: string;
    nhuocDiem: string;
    benhTat: string;
    doTuoi: number;
    IDPhuHuynh: number;
    hoTenPhuHuynh: string;
    gioiTinhPhuHuynh: string;
    ngaySinhPhuHuynh: string;
    diaChiPhuHuynh: string;
    SDT: string;
    email: string;
    avatarPhuHuynh: string | null;
    statusPhuHuynh: string;
    cccdPhuHuynh: string;
    moiQuanHe: string;
}

interface HocSinhResponse {
    hocSinh: HocSinh[];
}

const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const StudentDetailPage: React.FC = () => {
    const { idTruong, idHocSinh } = useParams<{ idTruong: string; idHocSinh: string }>();
    const [hocSinh, setHocSinh] = useState<HocSinh | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<HocSinh>>({});
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [activeTab, setActiveTab] = useState("info"); // 'info', 'health', 'parent'

    useEffect(() => {
        const fetchHocSinhDetail = async () => {
            setLoading(true);
            try {
                if (!idTruong || !idHocSinh) throw new Error("Thiếu ID trường hoặc ID học sinh.");
                const response: HocSinhResponse = await getThongTinHocSinh(idTruong, idHocSinh);
                const data = response.hocSinh[0]; // Lấy học sinh đầu tiên từ danh sách
                setHocSinh(data);
                setFormData(data); // Khởi tạo form với dữ liệu học sinh
            } catch (err: any) {
                console.error("Lỗi khi lấy thông tin học sinh:", err);
                setError(err.message || "Không thể lấy thông tin học sinh.");
            } finally {
                setLoading(false);
            }
        };

        fetchHocSinhDetail();
    }, [idTruong, idHocSinh]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            if (!idHocSinh) throw new Error("Thiếu ID học sinh.");
            await updateHocSinh(Number(idHocSinh), formData);
            setNotification({ message: "Cập nhật thông tin học sinh thành công!", type: "success" });
            setIsPopupOpen(false);
            setHocSinh({ ...hocSinh, ...formData } as HocSinh); // Cập nhật lại dữ liệu hiển thị

            setTimeout(() => {
                setNotification({ message: "", type: "" });
            }, 3000);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin học sinh:", err);
            setNotification({ message: "Không thể cập nhật thông tin học sinh.", type: "error" });

            setTimeout(() => {
                setNotification({ message: "", type: "" });
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !hocSinh) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="flex flex-col items-center">
                    <Loader className="animate-spin text-yellow-500 mb-4" size={40} />
                    <p className="text-gray-600">Đang tải thông tin học sinh...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <AlertTriangle size={48} />
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
                    <p className="text-center text-gray-600 mb-6">{error}</p>
                    <button onClick={() => window.history.back()} className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Notification */}
                {notification.message && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg max-w-md animate-fade-in ${
                            notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                    >
                        {notification.type === "success" ? <Check size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-t-xl shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-amber-100 ring-4 ring-yellow-400">
                                <img
                                    src={hocSinh?.Avatar || "https://via.placeholder.com/150"}
                                    alt="Ảnh học sinh"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "#";
                                    }}
                                />
                            </div>
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${hocSinh?.Status === "active" ? "bg-green-500" : "bg-gray-400"} border-2 border-white`}></div>
                        </div>
                        <div className="md:ml-6 mt-4 md:mt-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{hocSinh?.hoTen || "Tên học sinh"}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-gray-600">
                                {hocSinh?.nickname && (
                                    <div className="flex items-center">
                                        <User size={16} className="mr-1" />
                                        <span>Nickname: {hocSinh.nickname}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    <span>{formatDate(hocSinh?.ngaySinh || "")}</span>
                                </div>
                                <div className="flex items-center">
                                    <UserPlus size={16} className="mr-1" />
                                    <span>Ngày nhập học: {formatDate(hocSinh?.ngayNhapHoc || "")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all mt-4 md:mt-0"
                        disabled={loading}
                    >
                        <Edit2 size={16} />
                        <span>Cập nhật</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-t-lg overflow-hidden mb-1">
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-3 font-medium text-sm flex-1 md:flex-none ${
                                activeTab === "info" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-500 hover:text-yellow-500"
                            }`}
                            onClick={() => setActiveTab("info")}
                        >
                            Thông tin chung
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm flex-1 md:flex-none ${
                                activeTab === "health" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-500 hover:text-yellow-500"
                            }`}
                            onClick={() => setActiveTab("health")}
                        >
                            Tình hình sức khỏe
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm flex-1 md:flex-none ${
                                activeTab === "parent" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-500 hover:text-yellow-500"
                            }`}
                            onClick={() => setActiveTab("parent")}
                        >
                            Thông tin phụ huynh
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-xl shadow-sm p-6">
                    {/* Thông tin chung */}
                    {activeTab === "info" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Họ và tên</p>
                                            <p className="font-medium">{hocSinh?.hoTen || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nickname</p>
                                            <p className="font-medium">{hocSinh?.nickname || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh</p>
                                            <p className="font-medium">{formatDate(hocSinh?.ngaySinh || "")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Giới tính</p>
                                            <p className="font-medium">{hocSinh?.gioiTinh || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                                            <Book size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Lớp</p>
                                            <p className="font-medium">{hocSinh?.IDLopHoc ? `Lớp ${hocSinh.IDLopHoc}` : "Chưa phân lớp"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:border-l md:border-gray-100 md:pl-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Đặc điểm cá nhân</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Heart size={16} className="text-yellow-500 mr-2" />
                                            <h3 className="font-medium">Sở thích</h3>
                                        </div>
                                        <p className="bg-amber-50 p-3 rounded-lg text-gray-700">{hocSinh?.soThich || "Chưa cập nhật"}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Star size={16} className="text-yellow-500 mr-2" />
                                            <h3 className="font-medium">Ưu điểm</h3>
                                        </div>
                                        <p className="bg-amber-50 p-3 rounded-lg text-gray-700">{hocSinh?.uuDiem || "Chưa cập nhật"}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                                            <h3 className="font-medium">Nhược điểm</h3>
                                        </div>
                                        <p className="bg-amber-50 p-3 rounded-lg text-gray-700">{hocSinh?.nhuocDiem || "Chưa cập nhật"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tình hình sức khỏe */}
                    {activeTab === "health" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tình trạng sức khỏe</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-3">
                                        <Activity size={20} className="text-yellow-500 mr-2" />
                                        <h3 className="font-medium">Thông tin sức khỏe</h3>
                                    </div>
                                    <p className="text-gray-700">{hocSinh?.thongTinSucKhoe || "Chưa cập nhật"}</p>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-3">
                                        <AlertTriangle size={20} className="text-yellow-500 mr-2" />
                                        <h3 className="font-medium">Tình trạng bệnh tật</h3>
                                    </div>
                                    <p className="text-gray-700">{hocSinh?.benhTat || "Không có"}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium mb-2">Ghi chú</h3>
                                <p className="bg-gray-50 p-4 rounded-lg text-gray-700 italic">Thông tin sức khỏe cần được cập nhật định kỳ và thông báo cho giáo viên chủ nhiệm.</p>
                            </div>
                        </div>
                    )}

                    {/* Thông tin phụ huynh */}
                    {activeTab === "parent" && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin phụ huynh</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 bg-amber-100 rounded-full overflow-hidden mr-4">
                                            {/* <img
                                                src={hocSinh?.avatarPhuHuynh || "#"}
                                                alt="Avatar phụ huynh"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "#";
                                                }}
                                            /> */}
                                            {hocSinh?.Avatar ? <img src={hocSinh.Avatar} alt="Avatar" className="w-full h-full object-cover" /> : hocSinh?.hoTen?.charAt(0) || "P"}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">{hocSinh?.hoTenPhuHuynh || "Chưa cập nhật"}</h3>
                                            <p className="text-yellow-600">{hocSinh?.moiQuanHe || "Mối quan hệ chưa xác định"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Phone size={16} className="text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">{hocSinh?.SDT || "Chưa cập nhật"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail size={16} className="text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{hocSinh?.email || "Chưa cập nhật"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Home size={16} className="text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                                <p className="font-medium">{hocSinh?.diaChiPhuHuynh || "Chưa cập nhật"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:border-l md:border-gray-100 md:pl-8">
                                    <h3 className="font-medium mb-4">Thông tin khác</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh phụ huynh</p>
                                            <p className="font-medium">{formatDate(hocSinh?.ngaySinhPhuHuynh || "")}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Giới tính phụ huynh</p>
                                            <p className="font-medium">{hocSinh?.gioiTinhPhuHuynh || "Chưa cập nhật"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">CCCD phụ huynh</p>
                                            <p className="font-medium">{hocSinh?.cccdPhuHuynh || "Chưa cập nhật"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Trạng thái</p>
                                            <p className="font-medium">{hocSinh?.statusPhuHuynh || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal cập nhật thông tin */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Cập Nhật Thông Tin Học Sinh</h2>
                            <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none" disabled={loading}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Họ tên:</label>
                                <input
                                    type="text"
                                    name="hoTen"
                                    value={formData.hoTen || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Nickname:</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Giới tính:</label>
                                <select
                                    name="gioiTinh"
                                    value={formData.gioiTinh || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Ngày sinh:</label>
                                <input
                                    type="date"
                                    name="ngaySinh"
                                    value={formData.ngaySinh?.split("T")[0] || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Sở thích:</label>
                                <textarea
                                    name="soThich"
                                    value={formData.soThich || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Ưu điểm:</label>
                                <textarea
                                    name="uuDiem"
                                    value={formData.uuDiem || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Nhược điểm:</label>
                                <textarea
                                    name="nhuocDiem"
                                    value={formData.nhuocDiem || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Thông tin sức khỏe:</label>

                                <textarea
                                    name="thongTinSucKhoe"
                                    value={formData.thongTinSucKhoe || ""}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none" disabled={loading}>
                                Hủy
                            </button>
                            <button onClick={handleUpdate} className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none" disabled={loading}>
                                {loading ? <Loader size={16} className="animate-spin inline-block mr-2" /> : <Save size={16} className="inline-block mr-2" />}
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetailPage;
