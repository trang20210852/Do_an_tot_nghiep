import React, { useState } from "react";
import { addNhanXetHocSinh } from "../../services/apiTeacher";

const StudentFeedback: React.FC = () => {
    const [studentId, setStudentId] = useState("");
    const [feedback, setFeedback] = useState("");
    const [study, setStudy] = useState("");
    const [health, setHealth] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await addNhanXetHocSinh(token, { IDHocSinh: Number(studentId), noiDung: feedback, hocTap: study, sucKhoe: health });
            alert("Nhận xét đã được gửi thành công!");
            setStudentId("");
            setFeedback("");
            setStudy("");
            setHealth("");
        } catch (err) {
            console.error("Lỗi khi gửi nhận xét:", err);
            alert("Không thể gửi nhận xét.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Nhận Xét Học Sinh</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div>
                    <label className="block font-medium mb-2">ID Học Sinh</label>
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block font-medium mb-2">Nội Dung Nhận Xét</label>
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border rounded" rows={4} required />
                </div>
                <div>
                    <label className="block font-medium mb-2">Tình Hình Học Tập</label>
                    <textarea value={study} onChange={(e) => setStudy(e.target.value)} className="w-full p-2 border rounded" rows={2} required />
                </div>
                <div>
                    <label className="block font-medium mb-2">Thông Tin Sức Khỏe</label>
                    <textarea value={health} onChange={(e) => setHealth(e.target.value)} className="w-full p-2 border rounded" rows={2} required />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi Nhận Xét"}
                </button>
            </form>
        </div>
    );
};

export default StudentFeedback;
