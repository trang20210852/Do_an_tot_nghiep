import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSchool, FaUserGraduate, FaBook, FaFileAlt, FaExchangeAlt, FaDownload, FaChartLine, FaPrint, FaEdit, FaTimes, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import {
    getThongTinHocSinhByPhuHuynh,
    getDonNghiHocByHocSinh,
    createDonNghiHoc,
    createDonChuyenTruong,
    // getLichSuChuyenTruong,
    getDiemDanhByHocSinh,
    getNhanXetByHocSinh,
    getDonChuyenTruongByCon,
    updateAvatarHocSinh,
} from "../../services/apiStudent";
import TransferForm from "../../components/TransferForm";
import NhapHocForm from "../../components/AdmissionForm";
import { toast } from "react-toastify";
import ChildTransferTab from "../../components/ChildTransferTab";
import ChildAbsenceTab from "../../components/ChildAbsenceTab";
import ChildStudyTab from "../../components/ChildStudyTab";
import ChildInfoTab from "../../components/ChildInfoTab";
import ImagePopup from "../../components/ImagePopup";
import ChildPaymentTab from "../../components/ChildPaymentTab";

interface DiemDanh {
    ngay: string;
    trangThai: "Có mặt" | "Vắng mặt" | "Vắng có phép";
}

interface NhanXet {
    ngayNhanXet: string;
    noiDung: string;
    giaoVien: string;
    sucKhoe?: string;
    hocTap?: string;
}

const ChildDetail: React.FC = () => {
    const { idHocSinh } = useParams<{ idHocSinh: string }>();
    const [hocSinh, setHocSinh] = useState<any>(null);
    const [donNghiHoc, setDonNghiHoc] = useState<any[]>([]);
    // Thêm vào đầu component ChildDetail
    const [imagePopup, setImagePopup] = useState<{ url: string; title: string } | null>(null);
    const [form, setForm] = useState({ ngayBatDau: "", ngayKetThuc: "", lyDo: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lichSuChuyenTruong, setLichSuChuyenTruong] = useState<any[]>([]);
    const [formChuyenTruong, setFormChuyenTruong] = useState({ IDTruongMuonChuyen: "", lyDo: "" });
    const [isModalChuyenTruongOpen, setIsModalChuyenTruongOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState<any>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [diemDanh, setDiemDanh] = useState<DiemDanh[]>([]);
    const [nhanXet, setNhanXet] = useState<NhanXet[]>([]);
    const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, excused: 0 });
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNhapHocModalOpen, setIsNhapHocModalOpen] = useState(false);
    const [isTransferFormOpen, setIsTransferFormOpen] = useState(false); // Quản lý trạng thái mở/đóng TransferForm
    const navigate = useNavigate();
    // Lấy thông tin học sinh
    useEffect(() => {
        const fetchHocSinh = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

                const data = await getThongTinHocSinhByPhuHuynh(token, Number(idHocSinh));
                setHocSinh(data);

                // Lấy danh sách đơn xin nghỉ
                const donData = await getDonNghiHocByHocSinh(token, Number(idHocSinh));
                setDonNghiHoc(donData);

                // Lấy danh sách đơn chuyển trường
                try {
                    const lichSuData = await getDonChuyenTruongByCon(token, Number(idHocSinh));
                    setLichSuChuyenTruong(lichSuData || []); // Đảm bảo luôn có giá trị mảng
                } catch (err: any) {
                    if (err.response?.status === 404) {
                        console.warn("Không có lịch sử chuyển trường.");
                        setLichSuChuyenTruong([]); // Nếu không có dữ liệu, đặt mảng rỗng
                    } else {
                        throw err;
                    }
                }

                // Lấy dữ liệu điểm danh
                const diemDanhData: DiemDanh[] = await getDiemDanhByHocSinh(token, Number(idHocSinh));
                setDiemDanh(diemDanhData);

                // Tính toán thống kê điểm danh
                const stats = {
                    present: diemDanhData.filter((item) => item.trangThai === "Có mặt").length,
                    absent: diemDanhData.filter((item) => item.trangThai === "Vắng mặt").length,
                    excused: diemDanhData.filter((item) => item.trangThai === "Vắng có phép").length,
                };
                setAttendanceStats(stats);

                // Lấy dữ liệu nhận xét
                const nhanXetData: NhanXet[] = await getNhanXetByHocSinh(token, Number(idHocSinh));
                setNhanXet(nhanXetData);
            } catch (err: any) {
                console.error("Lỗi khi lấy thông tin:", err);
                setError(err.message || "Không thể lấy thông tin.");
            } finally {
                setLoading(false);
            }
        };

        fetchHocSinh();
    }, [idHocSinh]);

    // Xử lý tạo đơn xin nghỉ
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await createDonNghiHoc(token, { IDHocSinh: Number(idHocSinh), ...form });

            // Show success notification
            const notification = document.getElementById("notification");
            if (notification) {
                notification.classList.remove("hidden");
                setTimeout(() => {
                    notification.classList.add("hidden");
                }, 3000);
            }

            setForm({ ngayBatDau: "", ngayKetThuc: "", lyDo: "" });
            setIsModalOpen(false);

            // Refresh danh sách đơn xin nghỉ
            const donData = await getDonNghiHocByHocSinh(token, Number(idHocSinh));
            setDonNghiHoc(donData);
        } catch (err) {
            console.error("Lỗi khi tạo đơn xin nghỉ:", err);
            alert("Không thể tạo đơn xin nghỉ.");
        }
    };

    const handleOpenTransferForm = () => {
        setIsTransferFormOpen(true);
    };

    const handleCloseTransferForm = () => {
        setIsTransferFormOpen(false);
    };
    const navigateToSchoolDetail = (idTruongHoc: number | undefined, state: string) => {
        if (!idTruongHoc) {
            console.warn("Không có ID trường để điều hướng.");
            return;
        }
        console.log("Navigating to school detail with ID:", idTruongHoc);
        navigate(`/${idTruongHoc}/${state}`);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Lấy file từ event.target.files
        if (!file) return;

        try {
            setLoading(true);
            toast.info("Đang tải lên ảnh đại diện...", { autoClose: 2000 }); // Hiển thị thông báo bắt đầu upload
            const response = await updateAvatarHocSinh(Number(idHocSinh), file); // Gọi API cập nhật avatar
            setHocSinh((prev: any) => {
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
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center">
                <div className="bg-red-100 border-l-4 border-red-500 p-4 max-w-md">
                    <p className="text-red-700">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">
                        Thử lại
                    </button>
                </div>
            </div>
        );

    // Lấy danh sách ngày trong tháng
    const getDaysInMonth = (month: number, year: number) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    // Tìm trạng thái của ngày trong lịch
    const getDayStatus = (day: Date) => {
        const dayString = day.toISOString().split("T")[0];

        // Tìm dữ liệu điểm danh
        const diemDanhData = diemDanh.find((item) => {
            const itemDate = new Date(item.ngay).toISOString().split("T")[0];
            return itemDate === dayString;
        });

        // Tìm dữ liệu nhận xét
        const nhanXetData = nhanXet.filter((item) => {
            const itemDate = new Date(item.ngayNhanXet).toISOString().split("T")[0];
            return itemDate === dayString;
        });

        // Kết hợp dữ liệu
        const result = {
            date: dayString,
            status: diemDanhData?.trangThai || "Không có thông tin",
            details: nhanXetData.map((item) => ({
                noiDung: item.noiDung,
                giaoVien: item.giaoVien,
                sucKhoe: item.sucKhoe,
                hocTap: item.hocTap,
            })),
        };

        return result;
    };

    // Chuyển sang tháng trước
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Chuyển sang tháng sau
    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Lấy danh sách ngày trong tháng hiện tại
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());

    // // Xử lý hover để hiển thị nhận xét

    const handleMouseEnter = (e: React.MouseEvent, dayStatus: any, day: Date) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setPopupPosition({
            top: rect.top + window.scrollY + 40,
            left: rect.left + window.scrollX,
        });

        // Gán chính xác ngày đang hover
        setHoveredDay({
            ...dayStatus,
            date: day, // Truyền trực tiếp đối tượng Date
        });
    };

    // Xử lý click để mở popup chi tiết
    const handleDayClick = (dayStatus: any, day: Date) => {
        setSelectedDay({
            ...dayStatus,
            date: day, // Truyền trực tiếp đối tượng Date
        });
        setIsPopupOpen(true);
    };

    // Đóng popup chi tiết
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedDay(null);
    };

    // Lọc đơn nghỉ học theo từ khóa
    const filteredDonNghiHoc = donNghiHoc.filter((don) => don.lyDo.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-amber-50 p-6">
            {/* Notification */}
            <div id="notification" className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 hidden">
                Thao tác thành công!
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b-2 border-amber-500 pb-4">
                    <h1 className="text-3xl font-bold text-amber-700">
                        <span className="mr-2">👧</span>
                        Thông Tin Chi Tiết Học Sinh
                    </h1>
                </div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 mb-8 shadow-md">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg">
                            {hocSinh?.Avatar ? (
                                <img src={hocSinh.Avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-amber-300 text-gray-800 text-4xl font-bold">{hocSinh?.hoTen?.charAt(0) || "?"}</div>
                            )}
                        </div> */}
                        <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg relative">
                            {hocSinh?.Avatar ? (
                                <img src={hocSinh.Avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-amber-300 text-gray-800 text-4xl font-bold">{hocSinh?.hoTen?.charAt(0) || "?"}</div>
                            )}
                            <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md cursor-pointer">
                                <FaEdit />
                            </label>
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{hocSinh?.hoTen}</h2>
                            <div className="flex flex-col md:flex-row md:gap-8">
                                <p className="text-gray-600 mb-2 md:mb-0">
                                    <span className="font-semibold text-gray-700">Tên gọi ở nhà:</span> {hocSinh?.nickname || "Chưa có"}
                                </p>

                                <p className="text-gray-600">
                                    <span className="font-semibold text-gray-700">Lớp:</span> {hocSinh?.tenLop || "Chưa có thông tin"}
                                </p>
                            </div>
                            <div className="font-semibold text-gray-700">
                                Truy cập nhóm Zalo :
                                <a href={hocSinh?.linkZaloGroup} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {hocSinh?.linkZaloGroup}
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow">
                            <div className="text-center text-sm font-semibold text-gray-700 mb-1">Trạng thái học tập</div>
                            <div
                                className={`text-center text-lg font-bold px-3 py-1 rounded ${
                                    hocSinh?.Status === "Đang học" ? "bg-green-100 text-green-700" : hocSinh?.Status === "Đã nghỉ học" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {hocSinh?.Status || "Chưa có thông tin"}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap overflow-x-auto mb-6 border-b border-amber-200">
                    <button
                        className={`px-5 py-3 font-medium ${activeTab === "info" ? "bg-amber-500 text-white rounded-t-lg" : "text-gray-700 hover:bg-amber-100"}`}
                        onClick={() => setActiveTab("info")}
                    >
                        <FaUserGraduate className="inline mr-2" /> Thông Tin Của Con
                    </button>
                    <button
                        className={`px-5 py-3 font-medium ${activeTab === "study" ? "bg-amber-500 text-white rounded-t-lg" : "text-gray-700 hover:bg-amber-100"}`}
                        onClick={() => setActiveTab("study")}
                    >
                        <FaBook className="inline mr-2" /> Học Tập & Điểm Danh
                    </button>
                    <button
                        className={`px-5 py-3 font-medium ${activeTab === "absence" ? "bg-amber-500 text-white rounded-t-lg" : "text-gray-700 hover:bg-amber-100"}`}
                        onClick={() => setActiveTab("absence")}
                    >
                        <FaCalendarAlt className="inline mr-2" /> Xin Nghỉ Học
                    </button>
                    <button
                        className={`px-5 py-3 font-medium ${activeTab === "transfer" ? "bg-amber-500 text-white rounded-t-lg" : "text-gray-700 hover:bg-amber-100"}`}
                        onClick={() => setActiveTab("transfer")}
                    >
                        <FaExchangeAlt className="inline mr-2" /> Chuyển Trường
                    </button>
                    <button onClick={() => setActiveTab("payment")}>Thanh toán học phí</button>
                </div>

                {/* Tab Content */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {/* Tab content */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        {activeTab === "info" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ChildInfoTab hocSinh={hocSinh} setImagePopup={setImagePopup} />
                            </motion.div>
                        )}
                        {activeTab === "study" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ChildStudyTab
                                    attendanceStats={attendanceStats}
                                    currentMonth={currentMonth}
                                    handlePrevMonth={handlePrevMonth}
                                    handleNextMonth={handleNextMonth}
                                    daysInMonth={daysInMonth}
                                    getDayStatus={getDayStatus}
                                    handleMouseEnter={handleMouseEnter}
                                    setHoveredDay={setHoveredDay}
                                    handleDayClick={handleDayClick}
                                    nhanXet={nhanXet}
                                />
                            </motion.div>
                        )}
                        {activeTab === "absence" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ChildAbsenceTab
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    isFilterActive={isFilterActive}
                                    setIsFilterActive={setIsFilterActive}
                                    filteredDonNghiHoc={filteredDonNghiHoc}
                                    setIsModalOpen={setIsModalOpen}
                                />
                            </motion.div>
                        )}
                        {activeTab === "transfer" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <ChildTransferTab
                                    hocSinh={hocSinh}
                                    lichSuChuyenTruong={lichSuChuyenTruong}
                                    handleOpenTransferForm={handleOpenTransferForm}
                                    setIsNhapHocModalOpen={setIsNhapHocModalOpen}
                                    navigateToSchoolDetail={navigateToSchoolDetail}
                                    isTransferFormOpen={isTransferFormOpen}
                                    handleCloseTransferForm={handleCloseTransferForm}
                                    idHocSinh={Number(idHocSinh)}
                                    TransferForm={TransferForm}
                                />
                            </motion.div>
                        )}
                        {activeTab === "payment" && <ChildPaymentTab idHocSinh={Number(idHocSinh)} />}
                    </div>
                </div>

                {/* Popup xem ảnh giấy tờ */}
                {imagePopup && <ImagePopup imagePopup={imagePopup} onClose={() => setImagePopup(null)} />}
            </div>
            {isNhapHocModalOpen && <NhapHocForm onClose={() => setIsNhapHocModalOpen(false)} studentId={Number(idHocSinh)} />}

            {/* Modal Tạo Đơn Xin Nghỉ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl relative">
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl" onClick={() => setIsModalOpen(false)}>
                            ×
                        </button>

                        <h2 className="text-2xl font-bold text-amber-700 mb-6 flex items-center gap-2">
                            <FaFileAlt className="text-amber-500" /> Tạo Đơn Xin Nghỉ
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block mb-2 text-gray-700 font-medium">Ngày Bắt Đầu:</label>
                                <input
                                    type="date"
                                    value={form.ngayBatDau}
                                    onChange={(e) => setForm({ ...form, ngayBatDau: e.target.value })}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium">Ngày Kết Thúc:</label>
                                <input
                                    type="date"
                                    value={form.ngayKetThuc}
                                    onChange={(e) => setForm({ ...form, ngayKetThuc: e.target.value })}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium">Lý Do:</label>
                                <textarea
                                    value={form.lyDo}
                                    onChange={(e) => setForm({ ...form, lyDo: e.target.value })}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
                                    required
                                    placeholder="Vui lòng nhập lý do chi tiết..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                                    Hủy
                                </button>
                                <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                                    Gửi Đơn
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Popup thông tin chi tiết */}
            {isPopupOpen && selectedDay && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-amber-500" /> Thông Tin Chi Tiết
                        </h2>

                        <div className="bg-amber-50 p-4 rounded-lg mb-4">
                            <p className="mb-2">
                                <strong className="text-gray-700">Ngày:</strong> {new Date(selectedDay.date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong className="text-gray-700">Trạng thái:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded ${
                                        selectedDay.status === "Có mặt"
                                            ? "bg-green-100 text-green-700"
                                            : selectedDay.status === "Vắng mặt"
                                            ? "bg-red-100 text-red-700"
                                            : selectedDay.status === "Vắng có phép"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {selectedDay.status}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="font-bold text-gray-800 mb-2">Nhận xét:</p>
                            {selectedDay.details.length > 0 ? (
                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                    {selectedDay.details.map((detail: NhanXet, index: number) => (
                                        <div key={index} className="bg-white p-3 border-l-4 border-amber-500 rounded shadow-sm">
                                            <p className="text-gray-800 mb-1">
                                                <strong>Giáo viên:</strong> {detail.giaoVien}
                                            </p>
                                            y{" "}
                                            <p className="text-gray-600">
                                                <strong>Nội dung:</strong> {detail.noiDung}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Học tập:</strong> {detail.hocTap}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>Sức khoẻ:</strong> {detail.sucKhoe}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="italic text-gray-500">Không có nhận xét</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={handleClosePopup} className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
                                Đóng
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Popup hiển thị nhận xét khi hover */}
            {hoveredDay && popupPosition && (
                <div className="absolute bg-white shadow-lg p-4 rounded-lg border border-amber-200 z-40" style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "300px" }}>
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-amber-700">Nhận xét:</p>
                        <span className="text-xs bg-amber-100 px-2 py-1 rounded-full">{new Date(hoveredDay.date).toLocaleDateString()}</span>
                    </div>

                    {hoveredDay.details && hoveredDay.details.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {hoveredDay.details.map((detail: { noiDung: string; giaoVien: string }, index: number) => (
                                <div key={index} className="text-sm border-l-2 border-amber-300 pl-2">
                                    <p className="text-gray-800 font-medium">{detail.giaoVien}:</p>
                                    <p className="text-gray-600">{detail.noiDung}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Không có nhận xét</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChildDetail;
