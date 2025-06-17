import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { changePasswordPhuHuynh } from "../services/apiParent";

interface ChangePasswordModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    showToastMessage: (msg: string, type: "success" | "error") => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onClose, onSuccess, showToastMessage }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChanging, setIsChanging] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            showToastMessage("Vui lòng nhập đầy đủ thông tin!", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            showToastMessage("Mật khẩu mới không khớp!", "error");
            return;
        }
        setIsChanging(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập.");
            await changePasswordPhuHuynh(token, oldPassword, newPassword);
            showToastMessage("Đổi mật khẩu thành công!", "success");
            onClose();
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            onSuccess && onSuccess();
        } catch (err: any) {
            showToastMessage(err.response?.data?.message || "Đổi mật khẩu thất bại!", "error");
        } finally {
            setIsChanging(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Mật khẩu cũ</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                            placeholder="Nhập mật khẩu cũ"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                            Hủy
                        </button>
                        <button type="submit" disabled={isChanging} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                            {isChanging ? "Đang đổi..." : "Đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePasswordModal;
