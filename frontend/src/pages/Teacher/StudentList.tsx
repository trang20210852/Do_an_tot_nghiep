import React, { useEffect, useState } from "react";
import { getHocSinhByLop, addNhanXetHocSinh, diemDanhHocSinh, getLopChuNhiem } from "../../services/apiTeacher";
import { FaSearch, FaSort, FaFilter, FaFileExport, FaUserCheck, FaCommentAlt, FaInfoCircle, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getDiemDanhByHocSinh, getNhanXetByHocSinh } from "../../services/apiStudent";

interface Student {
    IDHocSinh: number;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    Avatar: string | null;
    Status: string;
    diemDanh?: {
        ngay: string;
        trangThai: "Có mặt" | "Vắng mặt" | "Vắng có phép";
    };
}

interface ClassInfo {
    IDLopHoc: number;
    tenLop: string;
    namHoc: string;
    doTuoi: string; // Có thể có hoặc không, tùy vào dữ liệu lớp
}

const StudentList: React.FC = () => {
    const params = useParams();
    console.log("IDLopHoc:", params.IDLopHoc);
    // State cho danh sách học sinh và thông tin lớp
    const [students, setStudents] = useState<Student[]>([]);
    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [recentEvaluations, setRecentEvaluations] = useState<any[]>([]);
    const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
    // State cho các chức năng lọc và tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterGender, setFilterGender] = useState<"all" | "Nam" | "Nữ">("all");

    // State cho modal nhận xét
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [evaluation, setEvaluation] = useState("");
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [study, setStudy] = useState("");
    const [health, setHealth] = useState("");
    // State cho modal điểm danh
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [attendanceStatus, setAttendanceStatus] = useState<"Có mặt" | "Vắng mặt" | "Vắng có phép">("Có mặt");
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

    // State cho modal thông tin chi tiết học sinh
    const [isStudentDetailModalOpen, setIsStudentDetailModalOpen] = useState(false);

    // Lấy thông tin lớp và học sinh khi component được mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

                // Lấy danh sách lớp chủ nhiệm
                const classData: any[] = await getLopChuNhiem(token);

                if (classData.length === 0) {
                    setError("Không có lớp chủ nhiệm nào.");
                    setLoading(false);
                    return;
                }

                // Chọn lớp đầu tiên hoặc lớp phù hợp
                const selectedClass = classData.find((cls) => cls.IDLopHoc === Number(params.IDLopHoc)) || classData[0];

                // Gán dữ liệu vào state classInfo
                setClassInfo({
                    IDLopHoc: selectedClass.IDLopHoc,
                    tenLop: selectedClass.tenLop,
                    doTuoi: selectedClass.doTuoi,
                    namHoc: selectedClass.namHoc || "Chưa cập nhật",
                });

                // Lấy danh sách học sinh
                const studentData = await getHocSinhByLop(token, selectedClass.IDLopHoc);
                setStudents(studentData);
            } catch (err: any) {
                console.error("Lỗi khi lấy dữ liệu:", err);
                setError(err.message || "Không thể lấy dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.IDLopHoc]);

    // Xử lý nhận xét học sinh
    const handleOpenEvaluationModal = (student: Student) => {
        setSelectedStudent(student);
        setIsEvaluationModalOpen(true);
    };

    const handleCloseEvaluationModal = () => {
        setSelectedStudent(null);
        setEvaluation("");
        setIsEvaluationModalOpen(false);
    };

    const handleSubmitEvaluation = async () => {
        if (!selectedStudent || !evaluation.trim()) {
            alert("Vui lòng nhập nội dung nhận xét!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await addNhanXetHocSinh(token, {
                IDHocSinh: selectedStudent.IDHocSinh,
                noiDung: evaluation,
                hocTap: study || "Chưa cập nhật",
                sucKhoe: health || "Chưa cập nhật",
            });

            alert("Nhận xét đã được gửi thành công!");
            handleCloseEvaluationModal();
        } catch (err) {
            console.error("Lỗi khi gửi nhận xét:", err);
            alert("Không thể gửi nhận xét.");
        }
    };

    // Xử lý điểm danh học sinh
    const handleOpenAttendanceModal = (student: Student) => {
        setSelectedStudent(student);
        setIsAttendanceModalOpen(true);
    };

    const handleCloseAttendanceModal = () => {
        setSelectedStudent(null);
        setAttendanceStatus("Có mặt");
        setIsAttendanceModalOpen(false);
    };

    const handleSubmitAttendance = async () => {
        if (!selectedStudent) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            await diemDanhHocSinh(token, {
                IDHocSinh: selectedStudent.IDHocSinh,
                ngay: attendanceDate,
                trangThai: attendanceStatus,
            });

            // Cập nhật state với thông tin điểm danh mới
            setStudents(students.map((student) => (student.IDHocSinh === selectedStudent.IDHocSinh ? { ...student, diemDanh: { ngay: attendanceDate, trangThai: attendanceStatus } } : student)));

            alert("Điểm danh thành công!");
            handleCloseAttendanceModal();
        } catch (err) {
            console.error("Lỗi khi điểm danh:", err);
            alert("Không thể điểm danh học sinh.");
        }
    };

    const handleOpenStudentDetail = async (student: Student) => {
        setSelectedStudent(student);
        setIsStudentDetailModalOpen(true);

        // Gọi API lấy nhận xét
        try {
            setIsLoadingEvaluations(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
            const data = await getNhanXetByHocSinh(token, student.IDHocSinh);
            setRecentEvaluations(data); // data là mảng nhận xét
        } catch (err) {
            setRecentEvaluations([]);
        } finally {
            setIsLoadingEvaluations(false);
        }

        // Lấy điểm danh
        try {
            setIsLoadingAttendance(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
            const data = await getDiemDanhByHocSinh(token, student.IDHocSinh);
            setAttendanceHistory(data); // data là mảng điểm danh
        } catch {
            setAttendanceHistory([]);
        } finally {
            setIsLoadingAttendance(false);
        }
    };
    const handleCloseStudentDetail = () => {
        setSelectedStudent(null);
        setIsStudentDetailModalOpen(false);
    };

    // Lọc và sắp xếp danh sách học sinh
    const filteredStudents = students
        .filter((student) => {
            const matchesSearch = student.hoTen.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGender = filterGender === "all" || student.gioiTinh === filterGender;
            return matchesSearch && matchesGender;
        })
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a.hoTen.localeCompare(b.hoTen);
            } else {
                return b.hoTen.localeCompare(a.hoTen);
            }
        });

    // Xuất danh sách học sinh ra file CSV
    const exportToCSV = () => {
        const header = "ID,Họ tên,Giới tính,Ngày sinh,Trạng thái\n";
        const csv = students.map((student) => `${student.IDHocSinh},"${student.hoTen}","${student.gioiTinh}","${new Date(student.ngaySinh).toLocaleDateString()}","${student.Status}"`).join("\n");

        const blob = new Blob([header + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", `danh_sach_hoc_sinh_${classInfo?.tenLop || "lop"}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );

    if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

    return (
        <div className="min-h-screen bg-yellow-50 p-6 rounded-lg">
            {/* Header - Thông tin lớp học */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-md mb-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Danh Sách Học Sinh</h1>
                {classInfo && (
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-yellow-700 bg-opacity-30 px-4 py-2 rounded-lg">
                            <span className="font-semibold">Lớp:</span> {classInfo.tenLop}
                        </div>
                        <div className="bg-yellow-700 bg-opacity-30 px-4 py-2 rounded-lg">
                            <span className="font-semibold">Độ tuổi:</span> {classInfo.doTuoi} tuổi
                        </div>
                        <div className="bg-yellow-700 bg-opacity-30 px-4 py-2 rounded-lg">
                            <span className="font-semibold">Năm học:</span> {classInfo.namHoc}
                        </div>
                        <div className="bg-yellow-700 bg-opacity-30 px-4 py-2 rounded-lg">
                            <span className="font-semibold">Sĩ số:</span> {students.length} học sinh
                        </div>
                    </div>
                )}
            </div>

            {/* Thanh công cụ */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tìm kiếm */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm học sinh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-yellow-500" />
                    </div>

                    {/* Bộ lọc */}
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <select
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value as "all" | "Nam" | "Nữ")}
                                className="w-full p-2 pl-10 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
                            >
                                <option value="all">Tất cả</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            <FaFilter className="absolute left-3 top-3 text-yellow-500" />
                        </div>

                        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="p-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 flex items-center">
                            <FaSort className="mr-2" />
                            {sortOrder === "asc" ? "A-Z" : "Z-A"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Danh sách học sinh */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map((student) => (
                            <div key={student.IDHocSinh} className="border border-yellow-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 bg-yellow-50">
                                <div className="bg-yellow-100 p-3 flex items-center space-x-3">
                                    <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center text-white
                                                ${student.gioiTinh.toLowerCase() === "nam" ? "bg-amber-500" : "bg-yellow-300"}`}
                                            >
                                        {student.Avatar ? <img src={student.Avatar} alt={student.hoTen} className="w-full h-full rounded-full object-cover" /> : student.hoTen.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-yellow-800">{student.hoTen}</h3>
                                        <p className="text-sm text-yellow-600">
                                            {student.gioiTinh} - {new Date(student.ngaySinh).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                student.Status === "Đang học"
                                                    ? "bg-green-100 text-green-800"
                                                    : student.Status === "Đã tốt nghiệp"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {student.Status}
                                        </span>
                                    </div>
                                </div>

                                {/* Điểm danh hôm nay */}
                                {student.diemDanh && (
                                    <div className="px-3 py-2 bg-yellow-50 border-t border-yellow-100">
                                        <p className="text-sm">
                                            <span className="font-medium">Điểm danh hôm nay:</span>{" "}
                                            <span
                                                className={`${
                                                    student.diemDanh.trangThai === "Có mặt" ? "text-green-600" : student.diemDanh.trangThai === "Vắng mặt" ? "text-red-600" : "text-orange-600"
                                                }`}
                                            >
                                                {student.diemDanh.trangThai}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="p-3 flex justify-between bg-white">
                                    <button
                                        onClick={() => handleOpenAttendanceModal(student)}
                                        className="flex items-center text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                    >
                                        <FaUserCheck className="mr-1" /> Điểm danh
                                    </button>

                                    <button
                                        onClick={() => handleOpenEvaluationModal(student)}
                                        className="flex items-center text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                    >
                                        <FaCommentAlt className="mr-1" /> Nhận xét
                                    </button>

                                    <button onClick={() => handleOpenStudentDetail(student)} className="flex items-center text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                                        <FaInfoCircle className="mr-1" /> Chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-yellow-800 text-lg">Không tìm thấy học sinh nào.</p>
                        <p className="text-gray-500 mt-2">Vui lòng thử lại với từ khóa tìm kiếm khác.</p>
                    </div>
                )}
            </div>

            {/* Modal nhận xét học sinh */}
            {isEvaluationModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yellow-800">Nhận Xét Học Sinh</h2>
                            <button onClick={handleCloseEvaluationModal} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-md mb-4">
                            <p>
                                <strong>Học sinh:</strong> {selectedStudent.hoTen}
                            </p>
                            <p>
                                <strong>Ngày nhận xét:</strong> {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700 mb-2">Nhận xét chung</label>
                            <textarea
                                value={evaluation}
                                onChange={(e) => setEvaluation(e.target.value)}
                                className="w-full p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={2}
                                placeholder="Nhập nội dung nhận xét..."
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 mb-2">Tình hình học tập</label>
                            <textarea
                                value={study}
                                onChange={(e) => setStudy(e.target.value)}
                                className="w-full p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={2}
                                placeholder="Nhập tình hình học tập..."
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 mb-2">Thông tin sức khỏe</label>
                            <textarea
                                value={health}
                                onChange={(e) => setHealth(e.target.value)}
                                className="w-full p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={2}
                                placeholder="Nhập thông tin sức khỏe..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={handleCloseEvaluationModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Hủy
                            </button>
                            <button onClick={handleSubmitEvaluation} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                Gửi nhận xét
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal điểm danh học sinh */}
            {isAttendanceModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yellow-800">Điểm Danh Học Sinh</h2>
                            <button onClick={handleCloseAttendanceModal} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-md mb-4">
                            <p>
                                <strong>Học sinh:</strong> {selectedStudent.hoTen}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 flex items-center">
                                <FaCalendarAlt className="mr-2 text-yellow-500" />
                                Ngày điểm danh
                            </label>
                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="w-full p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Trạng thái</label>
                            <div className="space-y-2">
                                <label className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-yellow-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="Có mặt"
                                        checked={attendanceStatus === "Có mặt"}
                                        onChange={() => setAttendanceStatus("Có mặt")}
                                        className="mr-2 accent-yellow-500"
                                    />
                                    <FaCheckCircle className="mr-2 text-green-500" />
                                    <span>Có mặt</span>
                                </label>

                                <label className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-yellow-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="Vắng mặt"
                                        checked={attendanceStatus === "Vắng mặt"}
                                        onChange={() => setAttendanceStatus("Vắng mặt")}
                                        className="mr-2 accent-yellow-500"
                                    />
                                    <FaTimesCircle className="mr-2 text-red-500" />
                                    <span>Vắng mặt</span>
                                </label>

                                <label className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-yellow-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="Vắng có phép"
                                        checked={attendanceStatus === "Vắng có phép"}
                                        onChange={() => setAttendanceStatus("Vắng có phép")}
                                        className="mr-2 accent-yellow-500"
                                    />
                                    <FaCalendarAlt className="mr-2 text-orange-500" />
                                    <span>Vắng có phép</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={handleCloseAttendanceModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Hủy
                            </button>
                            <button onClick={handleSubmitAttendance} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                Lưu điểm danh
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thông tin chi tiết học sinh */}
            {isStudentDetailModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yellow-800">Thông Tin Chi Tiết Học Sinh</h2>
                            <button onClick={handleCloseStudentDetail} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center">
                                    <div className="w-32 h-32 bg-yellow-300 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-800 mb-4">
                                        {selectedStudent.Avatar ? (
                                            <img src={selectedStudent.Avatar} alt={selectedStudent.hoTen} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            selectedStudent.hoTen.charAt(0)
                                        )}
                                    </div>
                                    <h3 className="font-bold text-xl text-center mb-1">{selectedStudent.hoTen}</h3>
                                    <p className="text-yellow-600 text-center mb-2">
                                        {selectedStudent.gioiTinh} - {new Date(selectedStudent.ngaySinh).toLocaleDateString()}
                                    </p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                                            selectedStudent.Status === "Đang học"
                                                ? "bg-green-100 text-green-800"
                                                : selectedStudent.Status === "Đã tốt nghiệp"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedStudent.Status}
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-bold text-yellow-800 mb-3">Thông tin học tập</h4>
                                    <div className="space-y-2">
                                        <p>
                                            <strong>Mã học sinh:</strong> {selectedStudent.IDHocSinh}
                                        </p>
                                        <p>
                                            <strong>Lớp:</strong> {classInfo?.tenLop || "Chưa có thông tin"}
                                        </p>
                                        <p>
                                            <strong>Năm học:</strong> {classInfo?.namHoc || "Chưa có thông tin"}
                                        </p>
                                        <p>
                                            <strong>Trạng thái:</strong> {selectedStudent.Status}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-yellow-800 mb-3">Lịch sử đi học (5 ngày gần đây)</h4>
                                    <div className="overflow-x-auto">
                                        {isLoadingAttendance ? (
                                            <div className="text-gray-500">Đang tải lịch sử điểm danh...</div>
                                        ) : attendanceHistory.length === 0 ? (
                                            <div className="text-gray-500">Chưa có dữ liệu điểm danh.</div>
                                        ) : (
                                            <table className="min-w-full bg-white border border-yellow-200">
                                                <thead>
                                                    <tr className="bg-yellow-100">
                                                        <th className="py-2 px-4 border-b border-r border-yellow-200 text-left">Ngày</th>
                                                        <th className="py-2 px-4 border-b border-yellow-200 text-left">Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attendanceHistory.slice(0, 5).map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="py-2 px-4 border-b border-r border-yellow-200">{new Date(item.ngay).toLocaleDateString()}</td>
                                                            <td
                                                                className={`py-2 px-4 border-b border-yellow-200 ${
                                                                    item.trangThai === "Có mặt" ? "text-green-600" : item.trangThai === "Vắng mặt" ? "text-red-600" : "text-orange-600"
                                                                }`}
                                                            >
                                                                {item.trangThai}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-bold text-yellow-800 mb-3">Nhận xét gần đây</h4>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                {isLoadingEvaluations ? (
                                    <div className="text-gray-500">Đang tải nhận xét...</div>
                                ) : recentEvaluations.length === 0 ? (
                                    <div className="text-gray-500">Chưa có nhận xét nào.</div>
                                ) : (
                                    recentEvaluations.slice(0, 5).map((nx, idx) => (
                                        <div key={idx} className={idx !== recentEvaluations.length - 1 ? "border-b border-yellow-200 pb-3 mb-3" : ""}>
                                            <p className="text-gray-800">{nx.noiDung}</p>
                                            <p className="text-sm text-gray-500 mt-1">{new Date(nx.ngayNhanXet).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={handleCloseStudentDetail} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
