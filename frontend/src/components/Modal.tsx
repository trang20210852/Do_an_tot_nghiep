import React from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold">{title}</h2>
                <div className="mt-4">{children}</div>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default Modal;
