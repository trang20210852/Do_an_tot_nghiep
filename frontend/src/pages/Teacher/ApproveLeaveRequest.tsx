import React, { useEffect, useState } from "react";
import { approveDonNghiHoc, getDonNghiHocByLop } from "../../services/apiTeacher";

const ApproveLeaveRequest: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

                const data = await getDonNghiHocByLop(token);
                setRequests(data);
            } catch (err: any) {
                console.error("Lỗi khi lấy danh sách đơn xin nghỉ:", err);
                setError(err.message || "Không thể lấy danh sách đơn xin nghỉ.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (id: number, approve: boolean) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await approveDonNghiHoc(token, id, approve);
            alert(approve ? "Đơn xin nghỉ đã được duyệt!" : "Đơn xin nghỉ đã bị từ chối!");

            // Cập nhật trạng thái của đơn trong danh sách hiển thị
            setRequests((prev) => prev.map((req) => (req.IDDon === id ? { ...req, trangThai: approve ? "Đã duyệt" : "Từ chối" } : req)));
        } catch (err) {
            console.error("Lỗi khi duyệt đơn xin nghỉ:", err);
            alert("Không thể duyệt đơn xin nghỉ.");
        }
    };

    // Lọc danh sách đơn theo trạng thái tab
    const filteredRequests = requests.filter((req) => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return req.trangThai === "Chờ duyệt";
        if (activeTab === "approved") return req.trangThai === "Đã duyệt";
        if (activeTab === "rejected") return req.trangThai === "Từ chối";
        return true;
    });

    // Đếm số lượng đơn theo từng trạng thái
    const countAll = requests.length;
    const countPending = requests.filter((req) => req.trangThai === "Chờ duyệt").length;
    const countApproved = requests.filter((req) => req.trangThai === "Đã duyệt").length;
    const countRejected = requests.filter((req) => req.trangThai === "Từ chối").length;

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-yellow-800 mb-6">Duyệt Đơn Xin Nghỉ Học</h1>

            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`py-2 px-4 font-medium text-sm rounded-t-lg mr-2 flex items-center ${
                        activeTab === "all" ? "bg-yellow-500 text-white border-b-2 border-yellow-700" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                >
                    <span className="mr-2">📋</span>
                    Tất cả
                    <span className="ml-2 bg-yellow-700 text-white text-xs rounded-full px-2 py-1">{countAll}</span>
                </button>
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`py-2 px-4 font-medium text-sm rounded-t-lg mr-2 flex items-center ${
                        activeTab === "pending" ? "bg-yellow-500 text-white border-b-2 border-yellow-700" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                >
                    <span className="mr-2">⏳</span>
                    Chờ Duyệt
                    <span className="ml-2 bg-yellow-700 text-white text-xs rounded-full px-2 py-1">{countPending}</span>
                </button>
                <button
                    onClick={() => setActiveTab("approved")}
                    className={`py-2 px-4 font-medium text-sm rounded-t-lg mr-2 flex items-center ${
                        activeTab === "approved" ? "bg-yellow-500 text-white border-b-2 border-yellow-700" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                >
                    <span className="mr-2">✅</span>
                    Đã Duyệt
                    <span className="ml-2 bg-yellow-700 text-white text-xs rounded-full px-2 py-1">{countApproved}</span>
                </button>
                <button
                    onClick={() => setActiveTab("rejected")}
                    className={`py-2 px-4 font-medium text-sm rounded-t-lg flex items-center ${
                        activeTab === "rejected" ? "bg-yellow-500 text-white border-b-2 border-yellow-700" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                >
                    <span className="mr-2">❌</span>
                    Từ Chối
                    <span className="ml-2 bg-yellow-700 text-white text-xs rounded-full px-2 py-1">{countRejected}</span>
                </button>
            </div>

            {/* Danh sách đơn */}
            <div className="bg-white shadow-md rounded-lg p-6">
                {filteredRequests.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredRequests.map((req) => (
                            <li key={req.IDDon} className="p-4 border rounded bg-yellow-50 hover:bg-yellow-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-yellow-800">{req.hoTenHocSinh}</p>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <p>
                                                <span className="font-medium text-gray-700">Ngày bắt đầu:</span> {new Date(req.ngayBatDau).toLocaleDateString()}
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-700">Ngày kết thúc:</span> {new Date(req.ngayKetThuc).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="mt-2">
                                            <span className="font-medium text-gray-700">Lý do:</span> {req.lyDo}
                                        </p>
                                        <p className="mt-2">
                                            <span className="font-medium text-gray-700">Ngày tạo:</span> {new Date(req.ngayTao).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                req.trangThai === "Chờ duyệt"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : req.trangThai === "Đã duyệt"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-red-200 text-red-800"
                                            }`}
                                        >
                                            {req.trangThai}
                                        </span>
                                    </div>
                                </div>

                                {req.trangThai === "Chờ duyệt" && (
                                    <div className="flex space-x-4 mt-4 justify-end">
                                        <button
                                            onClick={() => handleApprove(req.IDDon, true)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
                                        >
                                            <span className="mr-1">✓</span> Duyệt
                                        </button>
                                        <button
                                            onClick={() => handleApprove(req.IDDon, false)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
                                        >
                                            <span className="mr-1">✗</span> Từ Chối
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-yellow-800 text-lg">Không có đơn xin nghỉ nào trong trạng thái này.</p>
                        <p className="text-gray-500 mt-2">Hãy chọn tab khác để xem các đơn xin nghỉ khác.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveLeaveRequest;
