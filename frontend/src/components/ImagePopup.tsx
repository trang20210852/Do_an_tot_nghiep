import { motion } from "framer-motion";
import { FaFileAlt, FaHome, FaDownload, FaTimes } from "react-icons/fa";

interface Props {
    imagePopup: { url: string; title: string };
    onClose: () => void;
}

const ImagePopup: React.FC<Props> = ({ imagePopup, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm p-4">
        <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col relative overflow-hidden"
        >
            {/* Header với tên tài liệu */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center justify-between text-white">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        {imagePopup.title === "Giấy khai sinh" ? (
                            <>
                                <FaFileAlt /> Giấy khai sinh
                            </>
                        ) : imagePopup.title === "Hộ khẩu" ? (
                            <>
                                <FaHome /> Hộ khẩu
                            </>
                        ) : (
                            <>
                                <FaFileAlt /> Minh chứng chuyển trường
                            </>
                        )}
                    </h2>
                </h2>
                <div className="flex gap-2">
                    {/* Nút đóng */}
                    <button className="p-2 bg-amber-700 rounded-full transition-all" onClick={onClose} title="Đóng">
                        <FaTimes size={20} />
                    </button>
                </div>
            </div>

            {/* Container hình ảnh có thể cuộn */}
            <div className="p-6 flex items-center justify-center overflow-auto flex-grow">
                <img src={imagePopup.url} alt={imagePopup.title} className="max-w-full h-auto object-contain rounded-lg shadow-md" style={{ maxHeight: "calc(90vh - 120px)" }} />
            </div>

            {/* Footer với thông tin nhỏ */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center rounded-b-xl">Nhấn nút X để đóng | {new Date().toLocaleDateString()}</div>
        </motion.div>
    </motion.div>
);

export default ImagePopup;
