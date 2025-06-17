import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaFilter, FaSearch, FaRegBell, FaSchool, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";
import { deleteThongBao, getThongBaoByTrangThai, getThongBaoPhuHuynh, markThongBaoAsRead } from "../../services/apiParent";

interface ThongBao {
    IDThongBao: number;
    tieuDe: string;
    noiDung: string;
    ngayGui: string;
    trangThai: "Đã đọc" | "Chưa đọc";
    nguoiGui: string;
    loaiThongBao?: string;
    mucDoUuTien?: string;
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<ThongBao[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedNotification, setSelectedNotification] = useState<ThongBao | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

                let data;
                if (filter === "all") {
                    data = await getThongBaoPhuHuynh(token);
                } else if (filter === "unread" || filter === "read") {
                    data = await getThongBaoByTrangThai(token, filter === "unread" ? "Chưa đọc" : "Đã đọc");
                } else {
                    data = await getThongBaoPhuHuynh(token);
                    data = data.filter((item: ThongBao) => item.loaiThongBao?.toLowerCase() === filter.toLowerCase());
                }

                const sortedData = data.sort((a: ThongBao, b: ThongBao) => new Date(b.ngayGui).getTime() - new Date(a.ngayGui).getTime());
                setNotifications(sortedData);

                const unread = sortedData.filter((item: any) => item.trangThai === "Chưa đọc").length;
                setUnreadCount(unread);
            } catch (err: any) {
                setError(err.message || "Đã có lỗi xảy ra khi tải thông báo.");
                console.error("Lỗi khi lấy thông báo:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [filter]);

    const handleDeleteNotification = async (idThongBao: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;

        try {
            await deleteThongBao(idThongBao); // Gọi API xóa thông báo
            setNotifications((prev) => prev.filter((item) => item.IDThongBao !== idThongBao)); // Cập nhật danh sách thông báo
            alert("Xóa thông báo thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa thông báo:", error);
            alert("Không thể xóa thông báo!");
        }
    };

    const markAsRead = async (idThongBao: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await markThongBaoAsRead(token, idThongBao);

            setNotifications((prev) => prev.map((item) => (item.IDThongBao === idThongBao ? { ...item, trangThai: "Đã đọc" } : item)));
            setUnreadCount((prev) => prev - 1);
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
            alert("Không thể cập nhật trạng thái thông báo.");
        }
    };

    const handleNotificationClick = (notification: ThongBao) => {
        setSelectedNotification(notification);
        if (notification.trangThai === "Chưa đọc") {
            markAsRead(notification.IDThongBao);
        }
    };

    const searchedNotifications = notifications.filter(
        (notification) =>
            notification.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.noiDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.nguoiGui.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
                <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600" onClick={() => window.location.reload()}>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 flex">
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <FaBell className="text-amber-500 mr-3" /> Thông Báo
                        </h1>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">{unreadCount}</span> thông báo chưa đọc
                        </div>
                    </div>

                    <div className="flex justify-between mb-6">
                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    className="pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white text-gray-700"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả thông báo</option>
                                    <option value="unread">Chưa đọc</option>
                                    <option value="read">Đã đọc</option>
                                    <option value="học tập">Học tập</option>
                                    <option value="hoạt động">Hoạt động</option>
                                    <option value="sức khỏe">Sức khỏe</option>
                                    <option value="nhà trường">Nhà trường</option>
                                    <option value="khác">Khác</option>
                                </select>
                                <div className="absolute left-3 top-2.5 text-amber-500">
                                    <FaFilter />
                                </div>
                            </div>
                        </div>

                        <div className="relative w-80">
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3 top-3 text-amber-500">
                                <FaSearch />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-2/5 h-[calc(100vh-250px)] overflow-y-auto pr-1">
                            {searchedNotifications.length > 0 ? (
                                <div className="space-y-4">
                                    {searchedNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.IDThongBao}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`relative p-4 rounded-lg shadow-sm border-l-4 cursor-pointer transition-all hover:shadow-md ${
                                                selectedNotification?.IDThongBao === notification.IDThongBao
                                                    ? "bg-amber-50 border-amber-500"
                                                    : notification.trangThai === "Chưa đọc"
                                                    ? "bg-yellow-100 border-yellow-500" // Làm nổi bật thông báo chưa đọc bằng màu nền
                                                    : "bg-white border-gray-200"
                                            }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {/* Hiển thị ký hiệu hoặc màu sắc nếu thông báo chưa đọc */}
                                            {notification.trangThai === "Chưa đọc" && <span className="absolute top-2 right-2 text-red-500 text-lg">📌</span>}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {notification.loaiThongBao === "Học tập" && <FaUserGraduate className="text-blue-500" />}
                                                        {notification.loaiThongBao === "Hoạt động" && <FaCalendarAlt className="text-green-500" />}
                                                        {notification.loaiThongBao === "Sức khỏe" && <FaBell className="text-red-500" />}
                                                        {notification.loaiThongBao === "Nhà trường" && <FaSchool className="text-amber-500" />}
                                                        {!notification.loaiThongBao && <FaRegBell className="text-gray-500" />}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-medium ${notification.trangThai === "Chưa đọc" ? "text-gray-900 font-semibold" : "text-gray-700"}`}>
                                                            {notification.tieuDe}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{notification.noiDung}</p>
                                                        <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                                                            <span>{new Date(notification.ngayGui).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>{notification.nguoiGui}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nút xóa thông báo */}
                                                <button onClick={() => handleDeleteNotification(notification.IDThongBao)} className="text-red-500 hover:text-red-700 transition-colors">
                                                    Xóa
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <FaRegBell className="text-gray-300 text-5xl mx-auto mb-4" />
                                    <p className="text-gray-500">Không có thông báo nào</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-3/5 h-[calc(100vh-250px)] overflow-y-auto bg-white rounded-lg shadow-md">
                            {selectedNotification ? (
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold text-amber-800">{selectedNotification.tieuDe}</h2>
                                        <div className="flex gap-2">
                                            {selectedNotification.loaiThongBao && (
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        selectedNotification.loaiThongBao === "Học tập"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : selectedNotification.loaiThongBao === "Hoạt động"
                                                            ? "bg-green-100 text-green-600"
                                                            : selectedNotification.loaiThongBao === "Sức khỏe"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-amber-100 text-amber-600"
                                                    }`}
                                                >
                                                    {selectedNotification.loaiThongBao}
                                                </span>
                                            )}
                                            {selectedNotification.mucDoUuTien && (
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        selectedNotification.mucDoUuTien === "Cao"
                                                            ? "bg-red-100 text-red-600"
                                                            : selectedNotification.mucDoUuTien === "Trung bình"
                                                            ? "bg-amber-100 text-amber-600"
                                                            : "bg-green-100 text-green-600"
                                                    }`}
                                                >
                                                    Mức độ: {selectedNotification.mucDoUuTien}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-6">
                                        <span>
                                            {new Date(selectedNotification.ngayGui).toLocaleDateString()} - {new Date(selectedNotification.ngayGui).toLocaleTimeString()}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>Người gửi: {selectedNotification.nguoiGui}</span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="prose max-w-none text-gray-800 leading-relaxed">
                                            <p>{selectedNotification.noiDung}</p>
                                        </div>
                                        <div className="mt-6">
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
                                                <p className="text-gray-700">
                                                    Nếu bạn có bất kỳ thắc mắc nào về thông báo này, vui lòng liên hệ với giáo viên chủ nhiệm hoặc nhà trường theo số điện thoại được cung cấp.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-6">
                                    <FaRegBell className="text-amber-300 text-6xl mb-4" />
                                    <p className="text-gray-500 text-center">Chọn một thông báo để xem chi tiết</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
