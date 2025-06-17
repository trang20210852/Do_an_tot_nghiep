import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaCamera, FaIdCard, FaKey } from "react-icons/fa";
import { motion } from "framer-motion";
import { getThongTinCanBo } from "../../services/school/apiSchool";
import { useAuth } from "../../context/AuthContext";
import { updateAvatarCanBo, updateThongTinGiaoVien } from "../../services/apiTeacher";
import ChangeGVPasswordModal from "../../components/ChangeTeacherPasswordModalProps";

const TeacherProfile: React.FC = () => {
    const [canBo, setCanBo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const handleEditClick = () => {
        setFormData(canBo || {});
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const submitData = { ...formData };
            if (submitData.ngaySinh) {
                submitData.ngaySinh = submitData.ngaySinh.slice(0, 10); // chỉ lấy YYYY-MM-DD
            }
            await updateThongTinGiaoVien(token, submitData);

            setCanBo({ ...canBo, ...formData });
            setIsEditing(false);
            showToastMessage("Cập nhật thông tin thành công!", "success");
        } catch (err: any) {
            showToastMessage(err.message || "Không thể cập nhật thông tin.", "error");
        }
    };

    useEffect(() => {
        const fetchCanBoInfo = async () => {
            try {
                const idNhanVien = localStorage.getItem("idNhanVien");
                console.log("ID nhân viên từ localStorage:", idNhanVien); // Kiểm tra giá trị
                if (!idNhanVien) {
                    throw new Error("Không tìm thấy ID nhân viên trong localStorage.");
                }
                const idTruong = localStorage.getItem("idTruong");
                console.log("ID Trường từ localStorage:", idTruong); // Kiểm tra giá trị
                if (!idTruong) {
                    throw new Error("Không tìm thấy ID trường trong localStorage.");
                }

                const data = await getThongTinCanBo(idTruong, idNhanVien);
                setCanBo(data);
                setAvatar(data.avatar);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin cán bộ:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCanBoInfo();
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const response = await updateAvatarCanBo(token, file);

            // Cập nhật avatar mới vào state
            setCanBo((prev: any) => (prev ? { ...prev, Avatar: response.avatar } : prev));
            showToastMessage("Cập nhật avatar thành công!", "success");
            setIsEditingAvatar(false);
        } catch (err: any) {
            console.error("Lỗi khi cập nhật avatar:", err);
            showToastMessage(err.message || "Không thể cập nhật avatar.", "error");
        }
    };

    const showToastMessage = (message: string, type: "success" | "error") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 1000);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-amber-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!canBo) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-gray-800">Không tìm thấy thông tin cán bộ</h2>
                <p className="text-gray-600">Vui lòng kiểm tra lại hoặc liên hệ quản trị viên.</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-amber-50 py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaUser className="text-amber-500 mr-2" />
                            Thông tin cá nhân cán bộ
                        </h1>
                        <div className="flex justify-end mb-4">
                            <button onClick={handleEditClick} className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition flex items-center gap-2">
                                <FaUser /> Cập nhật thông tin
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-amber-100 flex items-center justify-center text-amber-500 text-3xl overflow-hidden relative">
                                    {canBo?.Avatar ? <img src={canBo.Avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-2 border-amber-500" /> : canBo?.hoTen?.charAt(0) || "P"}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full cursor-pointer hover:bg-amber-600 transition">
                                    <FaCamera />
                                </label>
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </div>
                            {isUploading && <p className="text-sm text-gray-500 mt-2">Đang tải lên...</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Thông tin cá nhân */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b border-amber-200 pb-2">Thông tin cá nhân</h2>
                                {canBo.hoTen && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaUser />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Họ và tên</p>
                                            <p className="font-medium text-gray-800">{canBo.hoTen}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.gioiTinh && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaBriefcase />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Giới tính</p>
                                            <p className="font-medium text-gray-800">{canBo.gioiTinh}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.ngaySinh && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaCalendarAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh</p>
                                            <p className="font-medium text-gray-800">{new Date(canBo.ngaySinh).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b border-amber-200 pb-2">Thông tin liên hệ</h2>
                                {canBo.email && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-800">{canBo.email}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.SDT && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaPhone />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-800">{canBo.SDT}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.diaChi && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Địa chỉ</p>
                                            <p className="font-medium text-gray-800">{canBo.diaChi}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thông tin công việc */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-amber-200 pb-2">Thông tin công việc</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {canBo.chucVu && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaBriefcase />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Chức vụ</p>
                                            <p className="font-medium text-gray-800">{canBo.chucVu}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.phongBan && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaBuilding />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phòng ban</p>
                                            <p className="font-medium text-gray-800">{canBo.phongBan}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.ngayVaoLam && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaCalendarAlt />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày vào làm</p>
                                            <p className="font-medium text-gray-800">{new Date(canBo.ngayVaoLam).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                                {canBo.luong && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaMoneyBillWave />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Lương</p>
                                            <p className="font-medium text-gray-800">{canBo.luong.toLocaleString()} VND</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition flex items-center gap-2 mt-3 w-fit"
                            >
                                <FaKey /> Đổi mật khẩu
                            </button>
                        </div>
                        <ChangeGVPasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} showToastMessage={showToastMessage} />
                    </div>
                </div>
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
                        >
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
                                <h3 className="text-xl font-bold text-gray-800">Cập nhật thông tin giáo viên</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Họ tên */}
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <FaUser className="inline mr-2 text-amber-500" /> Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="hoTen"
                                            value={formData.hoTen || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    {/* Giới tính và Ngày sinh */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <span className="inline-block mr-2">👤</span> Giới tính
                                        </label>
                                        <select
                                            name="gioiTinh"
                                            value={formData.gioiTinh || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <FaCalendarAlt className="inline mr-2 text-amber-500" /> Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            name="ngaySinh"
                                            value={formData.ngaySinh ? formData.ngaySinh.substring(0, 10) : ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Số điện thoại và Email */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <FaPhone className="inline mr-2 text-amber-500" /> Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            name="SDT"
                                            value={formData.SDT || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <FaEnvelope className="inline mr-2 text-amber-500" /> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                            placeholder="Nhập email"
                                        />
                                    </div>

                                    {/* Địa chỉ và CCCD */}
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            <FaMapMarkerAlt className="inline mr-2 text-amber-500" /> Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            name="diaChi"
                                            value={formData.diaChi || ""}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                            required
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {showToast && (
                    <div
                        className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999]
        ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
                        style={{ minWidth: 250, fontSize: 18 }}
                    >
                        {toastType === "success" ? (
                            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TeacherProfile;
