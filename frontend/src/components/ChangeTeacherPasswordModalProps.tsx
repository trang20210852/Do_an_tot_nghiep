import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaKey } from "react-icons/fa";
import { changePasswordGiaoVien } from "../services/apiTeacher";

interface ChangeGVPasswordModalProps {
    show: boolean;
    onClose: () => void;
    showToastMessage: (message: string, type: "success" | "error") => void;
}
const ChangeGVPasswordModal: React.FC<ChangeGVPasswordModalProps> = ({ show, onClose, showToastMessage }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isChanging, setIsChanging] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirm) {
            showToastMessage("Vui lòng nhập đầy đủ thông tin!", "error");
            return;
        }
        if (newPassword !== confirm) {
            showToastMessage("Mật khẩu mới không khớp!", "error");
            return;
        }
        setIsChanging(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập");
            await changePasswordGiaoVien(token, oldPassword, newPassword);
            showToastMessage("Đổi mật khẩu thành công!", "success");
            setOldPassword("");
            setNewPassword("");
            setConfirm("");
            onClose();
        } catch (err: any) {
            showToastMessage(err.response?.data?.message || "Không thể đổi mật khẩu.", "error");
        } finally {
            setIsChanging(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[999]">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 shadow-xl min-w-[320px] max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold flex items-center gap-2 text-gray-800">
                        <FaKey />
                        Đổi mật khẩu giáo viên
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-amber-500">
                        <FaTimes size={20} />
                    </button>
                </div>
                <form className="space-y-4" onSubmit={handleChangePassword}>
                    <div>
                        <label className="block mb-1 text-gray-700 text-sm">Mật khẩu cũ</label>
                        <input type="password" className="w-full border border-amber-300 rounded-lg p-3" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} autoFocus required />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 text-sm">Mật khẩu mới</label>
                        <input type="password" className="w-full border border-amber-300 rounded-lg p-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 text-sm">Xác nhận mật khẩu mới</label>
                        <input type="password" className="w-full border border-amber-300 rounded-lg p-3" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200" disabled={isChanging}>
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:bg-amber-400" disabled={isChanging}>
                            {isChanging ? "Đang đổi..." : "Đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangeGVPasswordModal;
