import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { changePasswordPhuHuynh, getThongTinPhuHuynh, updateAvatarPhuHuynh, updateThongTinPhuHuynh } from "../../services/apiParent";
import { FaEdit, FaSave, FaTimes, FaCheck, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaBirthdayCake, FaLock } from "react-icons/fa";
import ChangePasswordModal from "../../components/ChangePasswordModal";

interface PhuHuynh {
    IDPhuHuynh: number;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    diaChi: string;
    SDT: string;
    email: string;
    Avatar: string;
    Status: string;
    CCCD: string;
}

const ParentAccount: React.FC = () => {
    const [phuHuynh, setPhuHuynh] = useState<PhuHuynh | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<PhuHuynh>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    // ...existing code...
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        fetchThongTinPhuHuynh();
    }, []);

    const fetchThongTinPhuHuynh = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const data = await getThongTinPhuHuynh(token);
            setPhuHuynh(data);
        } catch (err: any) {
            console.error("Lỗi khi lấy thông tin phụ huynh:", err);
            setError(err.message || "Không thể lấy thông tin phụ huynh.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const response = await updateAvatarPhuHuynh(token, file);

            // Cập nhật avatar mới vào state
            setPhuHuynh((prev) => (prev ? { ...prev, Avatar: response.avatar } : prev));
            showToastMessage("Cập nhật avatar thành công!", "success");
            setIsEditingAvatar(false);
        } catch (err: any) {
            console.error("Lỗi khi cập nhật avatar:", err);
            showToastMessage(err.message || "Không thể cập nhật avatar.", "error");
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

            await updateThongTinPhuHuynh(token, formData);

            setPhuHuynh({ ...phuHuynh, ...formData } as PhuHuynh);
            setIsEditing(false);
            showToastMessage("Cập nhật thông tin thành công!", "success");
        } catch (err: any) {
            console.error("Lỗi khi cập nhật thông tin:", err);
            showToastMessage(err.message || "Không thể cập nhật thông tin.", "error");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 flex">
            <div className="flex-1 p-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b border-amber-200 pb-4">Thông Tin Tài Khoản</h1>

                    {error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                            <p>{error}</p>
                            <button onClick={fetchThongTinPhuHuynh} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                                Thử lại
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Profile card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                                <div className="h-40 bg-gradient-to-r from-amber-400 to-amber-600 relative">
                                    <div className="absolute -bottom-16 left-8">
                                        <div className="w-32 h-32 rounded-full border-4 border-white bg-amber-100 flex items-center justify-center text-amber-500 text-3xl overflow-hidden relative">
                                            {phuHuynh?.Avatar ? <img src={phuHuynh.Avatar} alt="Avatar" className="w-full h-full object-cover" /> : phuHuynh?.hoTen?.charAt(0) || "P"}
                                        </div>
                                        <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md cursor-pointer">
                                            <FaEdit />
                                        </label>
                                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    </div>
                                    <div className="absolute bottom-4 right-6">
                                        <button
                                            onClick={() => {
                                                setFormData(phuHuynh || {}); // <-- Thêm dòng này để set dữ liệu hiện tại vào form
                                                setIsEditing(true);
                                            }}
                                            className="px-4 py-2 bg-white text-amber-600 rounded-lg shadow-md hover:bg-gray-100 transition flex items-center gap-2"
                                        >
                                            <FaEdit /> Cập nhật thông tin
                                        </button>
                                    </div>
                                </div>

                                {/* Profile content */}
                                <div className="pt-20 px-8 pb-8">
                                    <div className="flex flex-col md:flex-row border-b border-gray-100 pb-6 mb-6">
                                        <div className="md:w-1/2">
                                            <h2 className="text-2xl font-bold text-gray-800">{phuHuynh?.hoTen}</h2>
                                            <p className="text-amber-600 font-medium">Phụ huynh</p>
                                            <div className="mt-4 flex items-center text-gray-600">
                                                <FaIdCard className="mr-2" />
                                                <span>CCCD: {phuHuynh?.CCCD || "Chưa cập nhật"}</span>
                                            </div>
                                            <div className="mt-2 flex items-center text-gray-600">
                                                <FaBirthdayCake className="mr-2" />
                                                <span>Ngày sinh: {phuHuynh?.ngaySinh ? new Date(phuHuynh.ngaySinh).toLocaleDateString() : "Chưa cập nhật"}</span>
                                            </div>
                                        </div>

                                        <div className="md:w-1/2 mt-4 md:mt-0">
                                            <div className="bg-amber-50 p-4 rounded-lg">
                                                <div className="text-gray-800 font-semibold mb-2">Trạng thái tài khoản</div>
                                                <div className="flex items-center">
                                                    <div className={`w-3 h-3 rounded-full mr-2 ${phuHuynh?.Status === "Hoạt động" ? "bg-green-500" : "bg-red-500"}`}></div>
                                                    <span className={phuHuynh?.Status === "Hoạt động" ? "text-green-600" : "text-red-600"}>{phuHuynh?.Status || "Không xác định"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <FaPhone className="mr-2 text-amber-500" />
                                                <span className="font-medium">Số điện thoại</span>
                                            </div>
                                            <p className="text-gray-800">{phuHuynh?.SDT || "Chưa cập nhật"}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <FaEnvelope className="mr-2 text-amber-500" />
                                                <span className="font-medium">Email</span>
                                            </div>
                                            <p className="text-gray-800">{phuHuynh?.email || "Chưa cập nhật"}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center text-gray-700 mb-2">
                                                <FaMapMarkerAlt className="mr-2 text-amber-500" />
                                                <span className="font-medium">Địa chỉ</span>
                                            </div>
                                            <p className="text-gray-800">{phuHuynh?.diaChi || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setShowChangePassword(true)}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition flex items-center gap-2"
                                >
                                    <FaLock /> Đổi mật khẩu
                                </button>
                                <ChangePasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} showToastMessage={showToastMessage} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Toast notification */}
            {showToast && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[9999]
        ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white animate-bounce-in`}
                    style={{ minWidth: 250, fontSize: 18 }}
                >
                    {toastType === "success" ? <FaCheck size={22} className="mr-2 text-white" /> : <FaTimes size={22} className="mr-2 text-white" />}
                    <span>{toastMessage}</span>
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
                    >
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Cập nhật thông tin</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Họ tên */}
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        <FaIdCard className="inline mr-2 text-amber-500" /> Họ và tên
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

                                {/* Giới tính và CCCD */}
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
                                        <FaIdCard className="inline mr-2 text-amber-500" /> CCCD
                                    </label>
                                    <input
                                        type="text"
                                        name="CCCD"
                                        value={formData.CCCD || ""}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                        required
                                        placeholder="Nhập số CCCD"
                                    />
                                </div>

                                {/* Ngày sinh và Địa chỉ */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        <FaBirthdayCake className="inline mr-2 text-amber-500" /> Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        name="ngaySinh"
                                        value={formData.ngaySinh || ""}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-amber-50/30 transition-all"
                                        required
                                    />
                                </div>

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

                                {/* Email và Địa chỉ */}
                                <div className="col-span-2">
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
                                    <FaTimes size={16} /> Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <FaSave size={16} /> Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ParentAccount;
