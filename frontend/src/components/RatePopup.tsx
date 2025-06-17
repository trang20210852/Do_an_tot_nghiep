import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTimes, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { addDanhGia } from "../services/apiParent";

interface RatePopupProps {
    IDTruong: number;
    onClose: () => void;
    onSuccess: () => void;
}

const RatePopup: React.FC<RatePopupProps> = ({ IDTruong, onClose, onSuccess }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }

        try {
            setIsSubmitting(true);
            await addDanhGia(IDTruong, rating, comment);
            toast.success("Đánh giá của bạn đã được gửi thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi đánh giá! Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRatingText = () => {
        const activeRating = hoverRating || rating;
        switch (activeRating) {
            case 0:
                return "Chưa đánh giá";
            case 1:
                return "Rất tệ";
            case 2:
                return "Tệ";
            case 3:
                return "Bình thường";
            case 4:
                return "Tốt";
            case 5:
                return "Tuyệt vời";
            default:
                return "Chưa đánh giá";
        }
    };

    const starColors = (index: number) => {
        const activeRating = hoverRating || rating;
        if (index <= activeRating) {
            return "text-amber-400"; // Màu vàng cho sao đã chọn
        }
        return "text-gray-300"; // Màu xám cho sao chưa chọn
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Đánh giá trường học</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="text-center mb-2">
                            <div className="flex justify-center space-x-3 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-all duration-200 transform hover:scale-110"
                                        disabled={isSubmitting}
                                    >
                                        <FaStar className={`text-3xl ${starColors(star)}`} />
                                    </button>
                                ))}
                            </div>
                            <p className="text-amber-500 font-medium mt-1">{getRatingText()}</p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chia sẻ trải nghiệm của bạn</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                disabled={isSubmitting}
                                className="w-full border border-amber-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-700"
                                placeholder="Hãy chia sẻ cảm nhận của bạn về trường học này..."
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Đánh giá của bạn sẽ giúp các phụ huynh khác có cái nhìn khách quan hơn về trường.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center gap-2">
                            <FaTimes size={16} /> Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang gửi...</span>
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane size={16} /> Gửi đánh giá
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RatePopup;
