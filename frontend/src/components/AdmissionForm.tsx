import React, { useState, useEffect } from "react";
import { getThongTinHocSinhByPhuHuynh, updateNhapHoc } from "../services/apiStudent";
import { FaEnvelope, FaPhone, FaSchool, FaUser } from "react-icons/fa";
import { getDanhSachTruong } from "../services/school/apiSchool";
import { getThongTinPhuHuynh } from "../services/apiParent";

interface NhapHocFormProps {
    onClose: () => void;
    studentId: number; // ID của học sinh
}

const NhapHocForm: React.FC<NhapHocFormProps> = ({ onClose, studentId }) => {
    const [form, setForm] = useState({
        IDTruong: "",
    });
    const [danhSachTruong, setDanhSachTruong] = useState<{ IDTruong: number; tenTruong: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [parentInfo, setParentInfo] = useState<any>(null);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [truongDuocChon, setTruongDuocChon] = useState<number | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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

            await updateNhapHoc(token, {
                IDHocSinh: studentId,
                IDTruong: form.IDTruong,
            });

            showNotification("success", "Nhập học thành công!");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error("Lỗi khi nhập học:", error);
            showNotification("error", "Không thể nhập học. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setLoading(false);
        }
    };

    const handleTruongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruongDuocChon(Number(e.target.value));
        setForm({ ...form, IDTruong: e.target.value });
    };

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
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto relative overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Nhập Học</h2>
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
                                    <span className="font-semibold text-gray-800"> {studentInfo ? studentInfo.hoTen : "Đang tải..."}</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-28 text-gray-600">Ngày sinh:</span>
                                    <span className="text-gray-800">{studentInfo ? new Date(studentInfo.ngaySinh).toLocaleDateString("vi-VN") : "Đang tải..."}</span>
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
                                    <span className="font-semibold text-gray-800">{parentInfo ? parentInfo.hoTen : "Đang tải..."}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium w-28 text-gray-600">Số điện thoại:</span>
                                    <span className="text-gray-800 flex items-center">
                                        <FaPhone className="mr-1 text-xs text-amber-600" />
                                        {parentInfo ? parentInfo.SDT : "Đang tải..."}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-medium w-28 text-gray-600">Email:</span>
                                    <span className="text-gray-800 flex items-center">
                                        <FaEnvelope className="mr-1 text-xs text-amber-600" />
                                        {parentInfo ? parentInfo.email : "Đang tải..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
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

                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Hủy bỏ
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                                {loading ? "Đang xử lý..." : "Nhập Học"}
                            </button>
                        </div>
                    </form>
                </div>

                {notification && (
                    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>{notification.message}</div>
                )}
            </div>
        </div>
    );
};

export default NhapHocForm;
