import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaFileInvoice, FaSpinner, FaCalendarAlt, FaCheck, FaRegStickyNote, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { MdDescription, MdCalendarToday, MdAttachMoney } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTuitionForStudent } from "../../services/apiPayment";
import { getClassDetail, getClasses } from "../../services/school/apiClass";
import { useAuth } from "../../context/AuthContext";

const TuitionManagement: React.FC = () => {
    const { idTruong } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [classLoading, setClassLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [dueDate, setDueDate] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [content, setContent] = useState<string>("Học phí tháng " + month + "/" + year);
    const [selectAll, setSelectAll] = useState(false);

    // Thiết lập ngày mặc định là ngày 10 của tháng tiếp theo
    useEffect(() => {
        const nextMonth = month === 12 ? 1 : month + 1;
        const yearOfNextMonth = month === 12 ? year + 1 : year;
        const due = `${yearOfNextMonth}-${nextMonth.toString().padStart(2, "0")}-10`;
        setDueDate(due);

        // Cập nhật nội dung khi thay đổi tháng/năm
        setContent(`Học phí tháng ${month}/${year}`);
    }, [month, year]);

    // Lấy danh sách lớp học của trường
    useEffect(() => {
        const fetchClasses = async () => {
            setClassLoading(true);
            try {
                const idTruong = localStorage.getItem("idTruong");
                if (!idTruong) {
                    toast.error("Không tìm thấy thông tin trường học. Vui lòng đăng nhập lại.");
                    return;
                }
                const data = await getClasses(Number(idTruong));
                // Lấy thông tin chi tiết từng lớp học để tính sĩ số
                const formattedClasses = await Promise.all(
                    data.map(async (cls: any) => {
                        const classDetail = await getClassDetail(cls.IDLopHoc);
                        return {
                            IDLopHoc: cls.IDLopHoc,
                            tenLop: cls.tenLop,
                            doTuoi: cls.doTuoi,
                            siSo: classDetail.danhSachHocSinh.length, // Đếm số học sinh
                            namHoc: cls.namHoc,
                        };
                    })
                );
                setClasses(formattedClasses);
            } catch (error: any) {
                console.error("Lỗi khi lấy danh sách lớp học:", error);
                toast.error("Không thể tải danh sách lớp học.");
            } finally {
                setClassLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Lấy danh sách học sinh của lớp được chọn
    const handleSelectClass = async (classId: number) => {
        setSelectedClass(classId);
        setLoading(true);
        setSelectAll(false);

        try {
            const data = await getClassDetail(classId);

            if (!data || !data.danhSachHocSinh) {
                toast.error("Không tìm thấy danh sách học sinh của lớp.");
                setStudents([]);
                return;
            }

            const updatedStudents = data.danhSachHocSinh.map((student: any) => ({
                IDHocSinh: student.IDHocSinh,
                hoTen: student.hoTen,
                gioiTinh: student.gioiTinh,
                ngaySinh: new Date(student.ngaySinh).toLocaleDateString("vi-VN"),
                soTien: 500000,
                selected: false,
            }));

            setStudents(updatedStudents);

            if (updatedStudents.length === 0) {
                toast.info(`Lớp ${data.tenLop} không có học sinh nào.`);
            } else {
                toast.success(`Đã tải ${updatedStudents.length} học sinh của lớp ${data.tenLop}.`);
            }
        } catch (error: any) {
            console.error("Lỗi khi lấy danh sách học sinh:", error);
            toast.error("Không thể tải danh sách học sinh.");
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số tiền học phí cho từng học sinh
    const updateTuitionAmount = (idHocSinh: number, amount: number) => {
        setStudents((prevStudents) => prevStudents.map((student) => (student.IDHocSinh === idHocSinh ? { ...student, soTien: amount } : student)));
    };

    // Chọn hoặc bỏ chọn học sinh
    const toggleStudentSelection = (idHocSinh: number) => {
        setStudents((prevStudents) => {
            const newStudents = prevStudents.map((student) => (student.IDHocSinh === idHocSinh ? { ...student, selected: !student.selected } : student));

            // Kiểm tra xem có phải tất cả học sinh đều được chọn không
            const allSelected = newStudents.every((student) => student.selected);
            setSelectAll(allSelected);

            return newStudents;
        });
    };

    // Chọn hoặc bỏ chọn tất cả học sinh
    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        setStudents((prevStudents) => prevStudents.map((student) => ({ ...student, selected: newSelectAll })));
    };

    // Tạo học phí cho các học sinh được chọn
    const createTuitionBills = async () => {
        const selected = students.filter((student) => student.selected);

        if (selected.length === 0) {
            toast.error("Vui lòng chọn ít nhất một học sinh để tạo học phí.");
            return;
        }

        setLoading(true);
        try {
            const promises = selected.map((student) => {
                const tuitionData = {
                    IDHocSinh: student.IDHocSinh,
                    thang: month,
                    nam: year,
                    soTien: student.soTien,
                    hanCuoi: dueDate,
                    ghiChu: note,
                    noiDung: content,
                };
                return createTuitionForStudent(tuitionData);
            });

            await Promise.all(promises);

            toast.success(`Đã tạo học phí cho ${selected.length} học sinh thành công!`);

            // Reset trạng thái của học sinh sau khi tạo thành công
            setStudents((prevStudents) =>
                prevStudents.map((student) => ({
                    ...student,
                    selected: false,
                }))
            );
            setSelectAll(false);
        } catch (error: any) {
            console.error("Lỗi khi tạo học phí:", error);
            toast.error("Không thể tạo học phí. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <div className="bg-amber-500 text-white p-3 rounded-xl shadow-md mr-4">
                            <FaMoneyBillWave className="text-2xl" />
                        </div>
                        Quản Lý Học Phí
                    </h1>
                </div>

                {/* Thông tin chung học phí */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-amber-100">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                        <h2 className="text-lg font-medium text-white flex items-center">
                            <MdDescription className="mr-2" /> Thông tin chung học phí
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MdCalendarToday className="mr-2 text-amber-500" /> Tháng/Năm học phí
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(parseInt(e.target.value))}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i + 1}>
                                                Tháng {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const yearValue = new Date().getFullYear() - 2 + i;
                                            return (
                                                <option key={i} value={yearValue}>
                                                    {yearValue}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-amber-500" /> Hạn thanh toán
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <MdAttachMoney className="mr-2 text-amber-500" /> Nội dung học phí
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    placeholder="Nhập nội dung học phí"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <FaRegStickyNote className="mr-2 text-amber-500" /> Ghi chú (tùy chọn)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    placeholder="Nhập ghi chú về khoản học phí này (nếu có)"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danh sách lớp học */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-amber-100">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                        <h2 className="text-lg font-medium text-white flex items-center">
                            <FaChalkboardTeacher className="mr-2" /> Chọn lớp học
                        </h2>
                    </div>

                    <div className="p-6">
                        {classLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <FaSpinner className="animate-spin text-amber-500 text-3xl" />
                                <span className="ml-3 text-amber-600 font-medium">Đang tải danh sách lớp học...</span>
                            </div>
                        ) : classes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.IDLopHoc}
                                        className={`p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            selectedClass === cls.IDLopHoc ? "bg-amber-100 border-amber-500 shadow-inner" : "border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                                        }`}
                                        onClick={() => handleSelectClass(cls.IDLopHoc)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg mr-3 ${selectedClass === cls.IDLopHoc ? "bg-amber-500" : "bg-amber-100"}`}>
                                                <FaChalkboardTeacher className={`text-lg ${selectedClass === cls.IDLopHoc ? "text-white" : "text-amber-500"}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{cls.tenLop}</h3>
                                                <p className="text-sm text-gray-500">Sĩ số: {cls.siSo} học sinh</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">Không có lớp học nào. Vui lòng thêm lớp học trước.</div>
                        )}
                    </div>
                </div>

                {/* Danh sách học sinh */}
                {selectedClass && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-amber-100">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                            <h2 className="text-lg font-medium text-white flex items-center">
                                <FaUserGraduate className="mr-2" /> Danh sách học sinh
                            </h2>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-16">
                                    <FaSpinner className="animate-spin text-amber-500 text-3xl" />
                                    <span className="ml-3 text-amber-600 font-medium">Đang tải danh sách học sinh...</span>
                                </div>
                            ) : students.length > 0 ? (
                                <>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={toggleSelectAll}
                                                    className="form-checkbox h-5 w-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                                                />
                                                <span className="ml-2 text-gray-700 font-medium">Chọn tất cả</span>
                                            </label>
                                            <span className="ml-4 text-sm text-gray-500">
                                                (Đã chọn {students.filter((s) => s.selected).length}/{students.length} học sinh)
                                            </span>
                                        </div>

                                        <div>
                                            <button
                                                onClick={() => {
                                                    setStudents((prevStudents) => prevStudents.map((student) => ({ ...student, soTien: 500000 })));
                                                    toast.info("Đã đặt lại học phí cho tất cả học sinh về 500,000 đồng");
                                                }}
                                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                                            >
                                                Đặt lại học phí
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-amber-50">
                                                    <th className="border border-amber-200 p-3 text-left w-16">Chọn</th>
                                                    <th className="border border-amber-200 p-3 text-left">Họ tên</th>
                                                    <th className="border border-amber-200 p-3 text-left">Giới tính</th>
                                                    <th className="border border-amber-200 p-3 text-left">Ngày sinh</th>
                                                    <th className="border border-amber-200 p-3 text-left">Số tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student) => (
                                                    <tr key={student.IDHocSinh} className={`hover:bg-amber-50 transition ${student.selected ? "bg-amber-50" : ""}`}>
                                                        <td className="border border-amber-200 p-3 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={student.selected}
                                                                onChange={() => toggleStudentSelection(student.IDHocSinh)}
                                                                className="form-checkbox h-5 w-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                                                            />
                                                        </td>
                                                        <td className="border border-amber-200 p-3 font-medium">{student.hoTen}</td>
                                                        <td className="border border-amber-200 p-3">{student.gioiTinh}</td>
                                                        <td className="border border-amber-200 p-3">{student.ngaySinh}</td>
                                                        <td className="border border-amber-200 p-3">
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="number"
                                                                    value={student.soTien}
                                                                    onChange={(e) => updateTuitionAmount(student.IDHocSinh, parseInt(e.target.value))}
                                                                    className="w-36 p-2 border border-amber-300 rounded focus:ring-amber-500 focus:border-amber-500"
                                                                />
                                                                <span className="ml-2 text-gray-500">VNĐ</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16 text-gray-500">Không có học sinh nào trong lớp này.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Nút tạo học phí */}
                {selectedClass && students.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={createTuitionBills}
                            disabled={loading || students.filter((s) => s.selected).length === 0}
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <FaFileInvoice className="mr-2 text-lg" />
                                    <span>
                                        Tạo học phí tháng {month}/{year}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </div>
    );
};

export default TuitionManagement;
