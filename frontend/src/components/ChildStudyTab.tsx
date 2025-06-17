import React from "react";

interface DiemDanh {
    ngay: string;
    trangThai: string;
}
interface NhanXet {
    ngayNhanXet: string;
    noiDung: string;
    giaoVien: string;
    sucKhoe?: string;
    hocTap?: string;
}
interface Props {
    attendanceStats: { present: number; absent: number; excused: number };
    currentMonth: Date;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    daysInMonth: Date[];
    getDayStatus: (day: Date) => any;
    handleMouseEnter: (e: React.MouseEvent, dayStatus: any, day: Date) => void;
    setHoveredDay: (val: any) => void;
    handleDayClick: (dayStatus: any, day: Date) => void;
    nhanXet: NhanXet[];
}

const ChildStudyTab: React.FC<Props> = ({ attendanceStats, currentMonth, handlePrevMonth, handleNextMonth, daysInMonth, getDayStatus, handleMouseEnter, setHoveredDay, handleDayClick, nhanXet }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-3">Học Tập & Điểm Danh</h2>

        {/* Thống kê điểm danh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-green-600 mb-1">Có mặt</p>
                <p className="text-3xl font-bold text-green-700">{attendanceStats.present}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-red-600 mb-1">Vắng mặt</p>
                <p className="text-3xl font-bold text-red-700">{attendanceStats.absent}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-amber-600 mb-1">Vắng có phép</p>
                <p className="text-3xl font-bold text-amber-700">{attendanceStats.excused}</p>
            </div>
        </div>

        {/* Điều hướng tháng */}
        <div className="bg-amber-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition flex items-center gap-1">
                    ← Tháng Trước
                </button>
                <h2 className="text-xl font-bold text-gray-800">
                    {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition flex items-center gap-1">
                    Tháng Sau →
                </button>
            </div>

            {/* Chú thích */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded-full"></div>
                    <span className="text-sm">Có mặt</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded-full"></div>
                    <span className="text-sm">Vắng mặt</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-200 rounded-full"></div>
                    <span className="text-sm">Vắng có phép</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <span className="text-sm">Không có thông tin</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm">Có nhận xét</span>
                </div>
            </div>

            {/* Lịch */}
            <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow-sm">
                {/* Hiển thị tiêu đề các ngày trong tuần */}
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                    <div key={day} className="text-center font-bold text-amber-700">
                        {day}
                    </div>
                ))}

                {/* Hiển thị các ô trống cho các ngày trước tháng hiện tại */}
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, index) => (
                    <div key={`empty-start-${index}`} className="p-4"></div>
                ))}

                {/* Hiển thị các ngày trong tháng */}
                {daysInMonth.map((day, index) => {
                    const dayStatus = getDayStatus(day);

                    return (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg text-center cursor-pointer transition-all transform hover:scale-105 ${
                                dayStatus.status === "Có mặt"
                                    ? "bg-green-100 hover:bg-green-200"
                                    : dayStatus.status === "Vắng mặt"
                                    ? "bg-red-100 hover:bg-red-200"
                                    : dayStatus.status === "Vắng có phép"
                                    ? "bg-amber-100 hover:bg-amber-200"
                                    : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            title={dayStatus.details.length > 0 ? "Có nhận xét" : ""}
                            onMouseEnter={(e) => handleMouseEnter(e, dayStatus, day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => handleDayClick(dayStatus, day)}
                        >
                            <p className={`font-bold ${day.getDay() === 0 ? "text-red-500" : day.getDay() === 6 ? "text-blue-500" : "text-gray-700"}`}>{day.getDate()}</p>
                            {dayStatus.details.length > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>}
                        </div>
                    );
                })}

                {/* Hiển thị các ô trống cho các ngày sau tháng hiện tại */}
                {Array.from({
                    length: (7 - ((daysInMonth.length + new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()) % 7)) % 7,
                }).map((_, index) => (
                    <div key={`empty-end-${index}`} className="p-4"></div>
                ))}
            </div>
        </div>

        {/* Nhận xét gần đây */}
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-amber-700 mb-4 border-l-4 border-amber-500 pl-3">Nhận Xét Gần Đây</h3>

            {nhanXet.length > 0 ? (
                <div className="space-y-4">
                    {nhanXet.slice(0, 3).map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
                            <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-800">{item.noiDung}</p>
                                <span className="text-sm bg-amber-100 px-2 py-1 rounded">{new Date(item.ngayNhanXet).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Giáo viên: {item.giaoVien}</p>
                        </div>
                    ))}

                    {nhanXet.length > 3 && (
                        <div className="text-center mt-4">
                            <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">Xem tất cả nhận xét</button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-600 italic">Chưa có nhận xét nào.</p>
            )}
        </div>
    </div>
);

export default ChildStudyTab;
