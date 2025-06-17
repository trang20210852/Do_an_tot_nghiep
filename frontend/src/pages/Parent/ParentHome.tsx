import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaBell, FaCalendarAlt, FaChartBar, FaPlus, FaEye, FaTrash, FaChild, FaSchool } from "react-icons/fa";
import { getHocSinhByPhuHuynh, themHocSinh, deleteHocSinhByPhuHuynh } from "../../services/apiStudent";
import { getThongBaoPhuHuynh } from "../../services/apiParent";
import AddChildForm from "../../components/AddChildForm";
import Sidebar from "../../components/Sidebar";

interface HocSinh {
    IDHocSinh: number;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    lopHoc?: string;
    tenTruong?: string;
    anhDaiDien?: string;
}

interface ThongBao {
    IDThongBao: number;
    tieuDe: string;
    noiDung: string;
    ngayGui: string;
    tenGiaoVien: string;
}

const ParentHome: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [danhSachCon, setDanhSachCon] = useState<HocSinh[]>([]);
    const [thongBao, setThongBao] = useState<ThongBao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            // Fetch danh sách con
            const danhSachCon = await getHocSinhByPhuHuynh(token);
            setDanhSachCon(danhSachCon);

            // Fetch thông báo
            const thongBaoData = await getThongBaoPhuHuynh(token);
            setThongBao(thongBaoData.slice(0, 3)); // Chỉ lấy 3 thông báo mới nhất
        } catch (error: any) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            setError(error.message || "Không thể lấy dữ liệu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddChild = async (formData: any) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await themHocSinh(token, formData);

            // Hiển thị thông báo thành công
            const notification = document.getElementById("toast-notification");
            if (notification) {
                notification.textContent = "Thêm học sinh thành công!";
                notification.classList.remove("hidden");
                setTimeout(() => {
                    notification.classList.add("hidden");
                }, 3000);
            }

            fetchData(); // Refresh data
            closeModal();
        } catch (err: any) {
            console.error("Lỗi khi thêm học sinh:", err);
            setError(err.message || "Lỗi khi thêm học sinh.");
        }
    };

    const handleViewDetail = (idHocSinh: number) => {
        navigate(`/parents/children/${idHocSinh}`);
    };

    const confirmDelete = (idHocSinh: number) => {
        setDeleteConfirm(idHocSinh);
    };

    const handleDeleteChild = async (idHocSinh: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await deleteHocSinhByPhuHuynh(token, idHocSinh);

            // Hiển thị thông báo thành công
            const notification = document.getElementById("toast-notification");
            if (notification) {
                notification.textContent = "Xóa học sinh thành công!";
                notification.classList.remove("hidden");
                setTimeout(() => {
                    notification.classList.add("hidden");
                }, 3000);
            }

            fetchData(); // Refresh data
            setDeleteConfirm(null);
        } catch (error: any) {
            console.error("Lỗi khi xóa học sinh:", error);
            setError(error.message || "Không thể xóa học sinh.");
        }
    };

    useEffect(() => {
        fetchData();

        // Hiển thị chào mừng
        const welcomeMessage = document.getElementById("welcome-message");
        if (welcomeMessage) {
            welcomeMessage.classList.remove("opacity-0");
            welcomeMessage.classList.add("opacity-100");
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 flex">
            <div className="flex-1 p-6 ">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Trang Chủ Phụ Huynh</h1>
                    <p className="text-gray-600">Quản lý thông tin học tập của con em bạn</p>
                </div>

                {/* Thông tin chào mừng */}
                <motion.div
                    id="welcome-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-amber-400 to-amber-600 text-white p-6 rounded-lg shadow-lg mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Chào mừng quay trở lại!</h2>
                            <p className="opacity-90">Cập nhật thông tin học tập của con em bạn nhanh chóng và tiện lợi.</p>
                        </div>
                        <button onClick={openModal} className="bg-white text-amber-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition flex items-center gap-2">
                            <FaPlus /> Thêm Con
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách con */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-amber-500 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FaChild /> Danh Sách Con
                            </h3>
                            <span className="bg-amber-600 text-white text-sm px-3 py-1 rounded-full">{danhSachCon.length} học sinh</span>
                        </div>

                        <div className="p-4">
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                                    <p>{error}</p>
                                </div>
                            )}

                            {danhSachCon.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {danhSachCon.map((con) => (
                                        <motion.div
                                            key={con.IDHocSinh}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex items-center p-4">
                                                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 text-2xl mr-4 overflow-hidden">
                                                    {con.anhDaiDien ? <img src={con.anhDaiDien} alt={con.hoTen} className="w-full h-full object-cover" /> : <FaUserGraduate />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800">{con.hoTen}</h4>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        <span className="inline-block bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-xs mr-2">{con.gioiTinh}</span>
                                                        <span>{new Date(con.ngaySinh).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <FaSchool className="text-gray-500 mr-1" />
                                                        <span className="text-gray-700">
                                                            {con.lopHoc ? `Lớp ${con.lopHoc}` : "Chưa có lớp"}
                                                            {con.tenTruong ? `, ${con.tenTruong}` : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 px-4 py-3 border-t flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(con.IDHocSinh)}
                                                    className="text-amber-600 hover:text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded flex items-center gap-1 transition-colors text-sm"
                                                >
                                                    <FaEye size={14} /> Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(con.IDHocSinh)}
                                                    className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded flex items-center gap-1 transition-colors text-sm"
                                                >
                                                    <FaTrash size={14} /> Xóa
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded">
                                    <FaUserGraduate className="mx-auto text-gray-300 text-5xl mb-3" />
                                    <p className="text-gray-500 mb-4">Chưa có thông tin con nào.</p>
                                    <button onClick={openModal} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition flex items-center gap-2 mx-auto">
                                        <FaPlus /> Thêm Con
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Thông báo mới nhất */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-amber-500 text-white p-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FaBell /> Thông Báo Mới Nhất
                            </h3>
                        </div>

                        <div className="p-4">
                            {thongBao.length > 0 ? (
                                <div className="space-y-4">
                                    {thongBao.map((item) => (
                                        <div key={item.IDThongBao} className="border-l-4 border-amber-500 bg-white p-3 rounded shadow-sm hover:shadow-md transition cursor-pointer">
                                            <h4 className="font-semibold text-gray-800 mb-1">{item.tieuDe}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.noiDung}</p>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{new Date(item.ngayGui).toLocaleDateString()}</span>
                                                <span>Gửi bởi: {item.tenGiaoVien}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="text-center pt-2">
                                        <button onClick={() => navigate("/parents/notifications")} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                                            Xem tất cả thông báo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaBell className="mx-auto text-gray-300 text-4xl mb-3" />
                                    <p className="text-gray-500">Không có thông báo mới</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Thông tin nhanh */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-500">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                                <FaCalendarAlt />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Sự Kiện Sắp Tới</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Xem lịch sự kiện, hoạt động sắp diễn ra tại trường học của con em bạn.</p>
                        <button onClick={() => navigate("/parents/calendar")} className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">
                            Xem lịch
                        </button>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-500">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                                <FaChartBar />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Kết Quả Học Tập</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Theo dõi kết quả học tập, điểm danh và đánh giá của con em bạn.</p>
                        <button className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">Xem thống kê</button>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-500">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                                <FaBook />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Tài Liệu & Hướng Dẫn</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Truy cập tài liệu, sách giáo khoa và hướng dẫn hỗ trợ học tập.</p>
                        <button className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">Xem tài liệu</button>
                    </motion.div>
                </div>
            </div>

            {/* Modal thêm con */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-xl relative" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl" onClick={closeModal}>
                                ×
                            </button>
                            <h2 className="text-2xl font-bold text-amber-700 mb-6 flex items-center gap-2">
                                <FaUserGraduate className="text-amber-500" /> Thêm Thông Tin Con
                            </h2>
                            <AddChildForm onSubmit={handleAddChild} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal xác nhận xóa */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa</h3>
                            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa thông tin học sinh này? Hành động này không thể hoàn tác.</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
                                    Hủy
                                </button>
                                <button onClick={() => handleDeleteChild(deleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    Xóa
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast notification */}
            <div id="toast-notification" className="hidden fixed bottom-4 right-4 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg">
                Thao tác thành công!
            </div>
        </div>
    );
};

export default ParentHome;
