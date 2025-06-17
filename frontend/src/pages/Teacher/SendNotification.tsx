import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaUserFriends, FaEnvelope, FaSearch, FaCheckCircle, FaTimes, FaRegClock, FaTag, FaExclamationCircle, FaRegStickyNote, FaChalkboardTeacher } from "react-icons/fa";
import { RiSendPlaneFill, RiUserSearchLine } from "react-icons/ri";
import { MdOutlinePriorityHigh } from "react-icons/md";
import { getHocSinhByLop, getLopChuNhiem, sendThongBao } from "../../services/apiTeacher";

interface HocSinh {
    IDHocSinh: number;
    hoTen: string;
    lop: string;
    IDPhuHuynh: number;
    tenPhuHuynh: string;
    emailPhuHuynh: string;
}

interface LopChuNhiem {
    IDLopHoc: number;
    tenLop: string;
}

const SendNotification: React.FC = () => {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [classes, setClasses] = useState<LopChuNhiem[]>([]);
    const [hocSinh, setHocSinh] = useState<HocSinh[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<HocSinh[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [loaiThongBao, setLoaiThongBao] = useState("Học tập");
    const [mucDoUuTien, setMucDoUuTien] = useState("Trung bình");
    const [classLoading, setClassLoading] = useState(false);

    // Fetch danh sách lớp chủ nhiệm
    useEffect(() => {
        const fetchClasses = async () => {
            setClassLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập!");

                const data = await getLopChuNhiem(token);
                if (!Array.isArray(data)) throw new Error("Dữ liệu trả về không phải là mảng.");
                setClasses(data);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách lớp chủ nhiệm:", err);
                showToastMessage("Không thể tải danh sách lớp chủ nhiệm.", "error");
            } finally {
                setClassLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Fetch danh sách học sinh khi chọn lớp
    useEffect(() => {
        if (selectedClass) {
            const fetchHocSinh = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("Bạn chưa đăng nhập!");

                    setLoading(true);
                    const data = await getHocSinhByLop(token, selectedClass);
                    setHocSinh(data);
                    setFilteredStudents(data);
                } catch (err) {
                    console.error("Lỗi khi lấy danh sách học sinh:", err);
                    showToastMessage("Không thể tải danh sách học sinh.", "error");
                } finally {
                    setLoading(false);
                }
            };

            fetchHocSinh();
        }
    }, [selectedClass]);

    // Lọc danh sách học sinh theo từ khóa tìm kiếm
    useEffect(() => {
        const filtered = hocSinh.filter((student) => student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || student.tenPhuHuynh.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredStudents(filtered);
    }, [searchTerm, hocSinh]);

    // Xử lý chọn học sinh
    const handleSelectStudent = (idHocSinh: number) => {
        setSelectedStudents((prev) => (prev.includes(idHocSinh) ? prev.filter((id) => id !== idHocSinh) : [...prev, idHocSinh]));
    };

    // Xử lý chọn tất cả học sinh
    const handleSelectAll = () => {
        if (selectedStudents.length === hocSinh.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(hocSinh.map((student) => student.IDHocSinh));
        }
    };

    // Gửi thông báo
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedStudents.length === 0) {
            showToastMessage("Vui lòng chọn ít nhất một học sinh.", "error");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập!");

            const selectedHocSinh = hocSinh.filter((student) => selectedStudents.includes(student.IDHocSinh));

            const promises = selectedHocSinh.map((student) =>
                sendThongBao(token, {
                    IDPhuHuynh: student.IDPhuHuynh,
                    tieuDe: title,
                    noiDung: content,
                    loaiThongBao,
                    mucDoUuTien,
                })
            );

            await Promise.all(promises);
            showToastMessage(`Đã gửi thông báo thành công đến phụ huynh của ${selectedHocSinh.length} học sinh!`, "success");

            // Reset form
            setTitle("");
            setContent("");
            setSelectedStudents([]);
        } catch (err) {
            console.error("Lỗi khi gửi thông báo:", err);
            showToastMessage("Không thể gửi thông báo.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị thông báo
    const showToastMessage = (message: string, type: "success" | "error") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Cao":
                return "bg-red-100 text-red-600";
            case "Trung bình":
                return "bg-amber-100 text-amber-600";
            case "Thấp":
                return "bg-blue-100 text-blue-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getNotificationTypeColor = (type: string) => {
        switch (type) {
            case "Học tập":
                return "bg-indigo-100 text-indigo-600";
            case "Hoạt động":
                return "bg-green-100 text-green-600";
            case "Sức khỏe":
                return "bg-pink-100 text-pink-600";
            case "Nhà trường":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-800 flex items-center">
                            <div className="bg-amber-500 text-white p-3 rounded-xl shadow-lg mr-4">
                                <FaBell className="text-2xl" />
                            </div>
                            <span>Gửi Thông Báo</span>
                        </h1>
                        <p className="mt-3 text-gray-600 text-lg pl-16">Gửi thông báo quan trọng đến phụ huynh của học sinh trong lớp chủ nhiệm.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 h-full">
                                <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <FaUserFriends /> Danh Sách Học Sinh
                                    </h3>
                                </div>

                                <div className="p-6">
                                    {/* Phần chọn lớp chủ nhiệm được đặt trong phần danh sách học sinh */}
                                    <div className="mb-5">
                                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                            <FaChalkboardTeacher className="mr-2 text-amber-500" /> Lớp Chủ Nhiệm
                                        </label>
                                        <div className="relative">
                                            {classLoading && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                                                </div>
                                            )}
                                            <select
                                                value={selectedClass || ""}
                                                onChange={(e) => setSelectedClass(Number(e.target.value))}
                                                className="w-full p-3.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-700 font-medium"
                                                disabled={classLoading}
                                            >
                                                <option value="" disabled>
                                                    {classLoading ? "Đang tải danh sách lớp..." : "-- Chọn lớp chủ nhiệm --"}
                                                </option>
                                                {classes.map((cls) => (
                                                    <option key={cls.IDLopHoc} value={cls.IDLopHoc}>
                                                        {cls.tenLop}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {selectedClass ? (
                                        <>
                                            <div className="relative mb-5">
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm học sinh hoặc phụ huynh..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                                                />
                                                <div className="absolute left-4 top-3.5 text-amber-500">
                                                    <RiUserSearchLine className="text-xl" />
                                                </div>
                                            </div>

                                            <div className="mb-5 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                        Đã chọn: <span className="font-bold">{selectedStudents.length}</span>/{hocSinh.length}
                                                    </span>
                                                    {filteredStudents.length !== hocSinh.length && (
                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">Đang lọc: {filteredStudents.length}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleSelectAll}
                                                    className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 font-medium"
                                                >
                                                    <FaCheckCircle className="text-xs" />
                                                    {selectedStudents.length === hocSinh.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div className="flex flex-col justify-center items-center py-20">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
                                                    <p className="mt-4 text-amber-600 font-medium">Đang tải danh sách học sinh...</p>
                                                </div>
                                            ) : (
                                                <div className="max-h-[calc(100vh-460px)] overflow-y-auto rounded-lg border border-amber-100 bg-amber-50/30">
                                                    {filteredStudents.length > 0 ? (
                                                        <AnimatePresence>
                                                            {filteredStudents.map((student, index) => (
                                                                <motion.div
                                                                    key={student.IDHocSinh}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                                                    className={`p-4 border-b border-amber-100 flex items-center cursor-pointer hover:bg-amber-50 transition-colors duration-200 ${
                                                                        selectedStudents.includes(student.IDHocSinh) ? "bg-amber-50" : "bg-white"
                                                                    }`}
                                                                    onClick={() => handleSelectStudent(student.IDHocSinh)}
                                                                >
                                                                    <div
                                                                        className={`min-w-[24px] h-6 mr-3 rounded-md border flex items-center justify-center transition-all ${
                                                                            selectedStudents.includes(student.IDHocSinh) ? "bg-amber-500 border-amber-500" : "border-gray-300"
                                                                        }`}
                                                                    >
                                                                        {selectedStudents.includes(student.IDHocSinh) && <FaCheckCircle className="text-white text-sm" />}
                                                                    </div>

                                                                    <div className="flex-1">
                                                                        <p className="font-semibold text-gray-800">{student.hoTen}</p>
                                                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded mr-2 font-medium">{student.lop}</span>
                                                                            <span className="text-gray-600">Phụ huynh: {student.tenPhuHuynh}</span>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-16 px-4">
                                                            <FaExclamationCircle className="text-4xl text-amber-400 mb-3" />
                                                            <p className="text-gray-500 text-center">Không tìm thấy học sinh phù hợp với tiêu chí tìm kiếm</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-amber-300 rounded-lg bg-amber-50/50">
                                            <FaChalkboardTeacher className="text-5xl text-amber-400 mb-4" />
                                            <h3 className="text-lg font-medium text-amber-700 mb-2">Vui lòng chọn lớp</h3>
                                            <p className="text-gray-500 text-center">Chọn một lớp chủ nhiệm để xem danh sách học sinh</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 h-full">
                                <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <FaEnvelope /> Soạn Thông Báo
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                            <FaRegStickyNote className="mr-2 text-amber-500" /> Tiêu Đề
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full p-4 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                                            placeholder="Nhập tiêu đề thông báo..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <FaTag className="mr-2 text-amber-500" /> Loại Thông Báo
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={loaiThongBao}
                                                    onChange={(e) => setLoaiThongBao(e.target.value)}
                                                    className="w-full p-4 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none"
                                                >
                                                    <option value="Học tập">Học tập</option>
                                                    <option value="Hoạt động">Hoạt động</option>
                                                    <option value="Sức khỏe">Sức khỏe</option>
                                                    <option value="Nhà trường">Nhà trường</option>
                                                    <option value="Khác">Khác</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <div className={`px-3 py-1 rounded-full ${getNotificationTypeColor(loaiThongBao)} text-xs font-medium`}>{loaiThongBao}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <MdOutlinePriorityHigh className="mr-2 text-amber-500" /> Mức Độ Ưu Tiên
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={mucDoUuTien}
                                                    onChange={(e) => setMucDoUuTien(e.target.value)}
                                                    className="w-full p-4 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none"
                                                >
                                                    <option value="Cao">Cao</option>
                                                    <option value="Trung bình">Trung bình</option>
                                                    <option value="Thấp">Thấp</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <div className={`px-3 py-1 rounded-full ${getPriorityColor(mucDoUuTien)} text-xs font-medium`}>{mucDoUuTien}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                            <FaRegStickyNote className="mr-2 text-amber-500" /> Nội Dung
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full p-4 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                                            rows={8}
                                            placeholder="Nhập nội dung thông báo chi tiết..."
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                        <div className="text-gray-600">
                                            {selectedStudents.length > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="flex items-center text-green-600 font-medium">
                                                        <FaUserFriends className="mr-2" />
                                                        Đã chọn <span className="font-bold mx-1">{selectedStudents.length}</span> học sinh
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-6 mt-1">Thông báo sẽ được gửi đến phụ huynh của các học sinh đã chọn</span>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 flex items-center">
                                                    <FaExclamationCircle className="mr-2" /> Vui lòng chọn ít nhất một học sinh
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                            disabled={loading || selectedStudents.length === 0 || !title || !content}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                    <span>Đang gửi...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <RiSendPlaneFill className="text-xl" />
                                                    <span>Gửi Thông Báo</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl flex items-center ${
                            toastType === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"
                        } text-white z-50 max-w-md`}
                    >
                        <div className={`p-2 rounded-full mr-3 ${toastType === "success" ? "bg-green-400" : "bg-red-400"}`}>
                            {toastType === "success" ? <FaCheckCircle className="text-white text-xl" /> : <FaTimes className="text-white text-xl" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{toastType === "success" ? "Thành công!" : "Lỗi!"}</h4>
                            <p className="font-medium">{toastMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SendNotification;
