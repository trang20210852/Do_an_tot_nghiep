import React, { useEffect, useState } from "react";
import { createDonChuyenTruong, getThongTinHocSinhByPhuHuynh } from "../services/apiStudent";
import { getThongTinPhuHuynh } from "../services/apiParent";
import { motion } from "framer-motion";
import { FaUser, FaSchool, FaCalendarAlt, FaPhone, FaEnvelope, FaFileAlt, FaUpload, FaPaperPlane, FaTimes } from "react-icons/fa";
import { getDanhSachTruong } from "../services/school/apiSchool";

interface TransferFormProps {
    onClose: () => void;
    studentId: number; // ID của học sinh
}

const TransferForm: React.FC<TransferFormProps> = ({ onClose, studentId }) => {
    const [form, setForm] = useState({
        IDHocSinh: studentId,
        IDTruongHienTai: "",
        IDTruongMuonChuyen: "",
        lyDo: "",
        minhChung: null as File | null,
    });
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [parentInfo, setParentInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [danhSachTruong, setDanhSachTruong] = useState<{ IDTruong: number; tenTruong: string }[]>([]);
    const [truongDuocChon, setTruongDuocChon] = useState<number | null>(null);
    // Lấy thông tin học sinh và phụ huynh từ backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập!");

                // Lấy thông tin học sinh
                const studentData = await getThongTinHocSinhByPhuHuynh(token, studentId);
                setStudentInfo(studentData);

                // Lấy thông tin phụ huynh
                const parentData = await getThongTinPhuHuynh(token);
                setParentInfo(parentData);

                try {
                    const data = await getDanhSachTruong();
                    setDanhSachTruong(data);
                } catch (err) {
                    console.error("Lỗi khi lấy danh sách trường:", err);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
                showNotification("error", "Không thể tải thông tin. Vui lòng thử lại sau.");
            }
        };

        fetchData();
    }, [studentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setForm((prev) => ({ ...prev, minhChung: files[0] }));
            setSelectedFileName(files[0].name);
        }
    };

    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập!");

            const formData = new FormData();
            formData.append("IDHocSinh", String(studentId));
            formData.append("IDPhuHuynh", String(parentInfo?.IDPhuHuynh));
            formData.append("IDTruongHienTai", String(studentInfo?.IDTruongHoc));
            formData.append("IDTruongMuonChuyen", form.IDTruongMuonChuyen);
            formData.append("lyDo", form.lyDo);
            if (form.minhChung) {
                formData.append("minhChung", form.minhChung);
            }
            await createDonChuyenTruong(token, formData);
            showNotification("success", "Gửi đơn chuyển trường thành công!");
        } catch (error: any) {
            console.error("Lỗi khi gửi đơn chuyển trường:", error);
            showNotification("error", "Không thể gửi đơn chuyển trường. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setLoading(false);
        }
    };
    const handleTruongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruongDuocChon(Number(e.target.value));
        setForm({ ...form, IDTruongMuonChuyen: e.target.value });
    };

    if (!studentInfo || !parentInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-xl p-8 shadow-2xl max-w-2xl w-full mx-4">
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto relative overflow-hidden">
                {/* Header với gradient */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-5 px-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaFileAlt className="mr-3 text-2xl" />
                            <h2 className="text-2xl font-bold">Đơn Chuyển Trường</h2>
                        </div>
                        <button onClick={onClose} className="text-black hover:text-gray-200 transition-colors">
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Thông báo */}
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 p-3 rounded-lg flex items-center ${
                                notification.type === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" : "bg-red-100 text-red-800 border-l-4 border-red-500"
                            }`}
                        >
                            <div className={`rounded-full p-1 mr-3 ${notification.type === "success" ? "bg-green-200" : "bg-red-200"}`}>
                                {notification.type === "success" ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span>{notification.message}</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Thông tin học sinh */}
                        <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-100">
                            <div className="flex items-center mb-4 text-amber-800">
                                <FaUser className="mr-2 text-amber-600" />
                                <h3 className="text-lg font-semibold">Thông Tin Học Sinh</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Họ và tên:</span>
                                    <span className="font-semibold text-gray-800">{studentInfo.hoTen}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Ngày sinh:</span>
                                    <span className="text-gray-800">{new Date(studentInfo.ngaySinh).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Lớp học:</span>
                                    <span className="text-gray-800">
                                        {studentInfo.IDLopHoc ? (
                                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">{studentInfo.IDLopHoc}</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">Chưa phân lớp</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Trường:</span>
                                    <span className="text-gray-800 flex items-center">
                                        <FaSchool className="mr-1 text-xs text-amber-600" />
                                        {studentInfo.tenTruongHoc || "Không xác định"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin phụ huynh */}
                        <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-100">
                            <div className="flex items-center mb-4 text-amber-800">
                                <FaUser className="mr-2 text-amber-600" />
                                <h3 className="text-lg font-semibold">Thông Tin Phụ Huynh</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Họ và tên:</span>
                                    <span className="font-semibold text-gray-800">{parentInfo.hoTen}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium w-28 text-gray-600">Số điện thoại:</span>
                                    <span className="text-gray-800 flex items-center">
                                        <FaPhone className="mr-1 text-xs text-amber-600" />
                                        {parentInfo.SDT}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium w-28 text-gray-600">Email:</span>
                                    <span className="text-gray-800 flex items-center">
                                        <FaEnvelope className="mr-1 text-xs text-amber-600" />
                                        {parentInfo.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form điền thông tin */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trường muốn nhập học <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="IDTruong"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                value={truongDuocChon || ""}
                                onChange={handleTruongChange}
                                required
                            >
                                <option value="">Chọn trường học</option>
                                {danhSachTruong.map((truong) => (
                                    <option key={truong.IDTruong} value={truong.IDTruong}>
                                        {truong.tenTruong}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lý do chuyển trường <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="lyDo"
                                value={form.lyDo}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                placeholder="Vui lòng nêu chi tiết lý do chuyển trường..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minh chứng chuyển trường</label>
                            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                                <input type="file" name="minhChung" id="minhChung" onChange={handleFileChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" />
                                <div className="bg-gray-50 p-3 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-amber-100 rounded-lg p-2 mr-3">
                                            <FaUpload className="text-amber-600" />
                                        </div>
                                        <span className="text-gray-500">{selectedFileName ? selectedFileName : "Chọn file đính kèm..."}</span>
                                    </div>
                                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Tải lên</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Hỗ trợ các định dạng: PDF, JPG, PNG (tối đa 5MB)</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2" />
                                        Gửi đơn
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default TransferForm;
