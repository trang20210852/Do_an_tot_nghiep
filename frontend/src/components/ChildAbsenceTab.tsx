import { FaFileAlt } from "react-icons/fa";

interface Props {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    isFilterActive: boolean;
    setIsFilterActive: (val: boolean) => void;
    filteredDonNghiHoc: any[];
    setIsModalOpen: (val: boolean) => void;
}

const ChildAbsenceTab: React.FC<Props> = ({ searchTerm, setSearchTerm, isFilterActive, setIsFilterActive, filteredDonNghiHoc, setIsModalOpen }) => (
    <div>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-3">Xin Nghỉ Học</h2>

            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
                <FaFileAlt /> Tạo Đơn Xin Nghỉ
            </button>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-amber-50 rounded-lg">
            <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo lý do..."
                        className="w-full p-2 pl-9 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo trạng thái</label>
                <select className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" onChange={(e) => setIsFilterActive(!!e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="pending">Đang chờ duyệt</option>
                    <option value="rejected">Đã từ chối</option>
                </select>
            </div>
        </div>

        {/* Danh sách đơn xin nghỉ */}
        <div className="overflow-x-auto">
            {filteredDonNghiHoc.length > 0 ? (
                <table className="w-full border-collapse">
                    <thead className="bg-amber-100">
                        <tr>
                            <th className="border border-amber-200 px-4 py-3 text-left">STT</th>
                            <th className="border border-amber-200 px-4 py-3 text-left">Ngày Bắt Đầu</th>
                            <th className="border border-amber-200 px-4 py-3 text-left">Ngày Kết Thúc</th>
                            <th className="border border-amber-200 px-4 py-3 text-left">Lý Do</th>
                            <th className="border border-amber-200 px-4 py-3 text-left">Trạng Thái</th>
                            <th className="border border-amber-200 px-4 py-3 text-center">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDonNghiHoc.map((don, index) => (
                            <tr key={don.IDDon} className={index % 2 === 0 ? "bg-white" : "bg-amber-50"}>
                                <td className="border border-amber-200 px-4 py-3 text-center">{index + 1}</td>
                                <td className="border border-amber-200 px-4 py-3">{new Date(don.ngayBatDau).toLocaleDateString()}</td>
                                <td className="border border-amber-200 px-4 py-3">{new Date(don.ngayKetThuc).toLocaleDateString()}</td>
                                <td className="border border-amber-200 px-4 py-3">{don.lyDo}</td>
                                <td className="border border-amber-200 px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-white ${don.trangThai === "Đã duyệt" ? "bg-green-500" : don.trangThai === "Đã từ chối" ? "bg-red-500" : "bg-amber-500"}`}>
                                        {don.trangThai}
                                    </span>
                                </td>
                                <td className="border border-amber-200 px-4 py-3 text-center">
                                    <button className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition">Chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Chưa có đơn xin nghỉ nào.</p>
                </div>
            )}
        </div>
    </div>
);

export default ChildAbsenceTab;
