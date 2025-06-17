// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { getLopChuNhiem } from "../../services/apiGiaoVien";
// import { FaChalkboardTeacher, FaSpinner } from "react-icons/fa";

// const LopChuNhiem: React.FC = () => {
//     const [lopChuNhiem, setLopChuNhiem] = useState<any | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate(); // Khởi tạo useNavigate

//     useEffect(() => {
//         const fetchLopChuNhiem = async () => {
//             setIsLoading(true);
//             setError(null);

//             try {
//                 const token = localStorage.getItem("token"); // Lấy token từ localStorage
//                 if (!token) {
//                     setError("Bạn chưa đăng nhập!");
//                     setIsLoading(false);
//                     return;
//                 }

//                 const data = await getLopChuNhiem(token); // Gọi API lấy danh sách lớp chủ nhiệm
//                 setLopChuNhiem(data);
//             } catch (err: any) {
//                 console.error("Lỗi khi lấy danh sách lớp chủ nhiệm:", err);
//                 setError("Không thể tải danh sách lớp chủ nhiệm.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchLopChuNhiem();
//     }, []);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <FaSpinner className="animate-spin text-amber-500" size={40} />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-red-500 font-medium">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách lớp chủ nhiệm</h1>
//             {lopChuNhiem ? (
//                 <div className="bg-white shadow rounded-lg p-6">
//                     <h2 className="text-xl font-semibold text-gray-800 mb-4">{lopChuNhiem.tenLop}</h2>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="flex items-center">
//                             <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
//                             <span className="text-gray-700">Sĩ số: {lopChuNhiem.siSo}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
//                             <span className="text-gray-700">Độ tuổi: {lopChuNhiem.doTuoi}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
//                             <span className="text-gray-700">Năm học: {lopChuNhiem.namHoc}</span>
//                         </div>
//                         {lopChuNhiem.linkZaloGroup && (
//                             <div className="flex items-center">
//                                 <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
//                                 <a href={lopChuNhiem.linkZaloGroup} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//                                     Nhóm Zalo
//                                 </a>
//                             </div>
//                         )}
//                     </div>
//                     <div className="mt-4">
//                         <button
//                             onClick={() => navigate(`/dashboard/giaovien/student-list/${lopChuNhiem.IDLopHoc}`)} // Chuyển hướng đến trang StudentList
//                             className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
//                         >
//                             Xem chi tiết
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">Bạn không có lớp chủ nhiệm nào.</p>
//             )}
//         </div>
//     );
// };

// export default LopChuNhiem;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLopChuNhiem } from "../../services/apiTeacher";
import { FaCalendarAlt, FaChalkboardTeacher, FaEye, FaGraduationCap, FaSpinner, FaTrashAlt, FaUsers } from "react-icons/fa";
import { getClassDetail } from "../../services/school/apiClass";

interface LopChuNhiem {
    IDLopHoc: number;
    tenLop: string;
    siSo: number;
    doTuoi: string;
    namHoc: string;
    linkZaloGroup?: string;
}

const LopChuNhiem: React.FC = () => {
    const [lopChuNhiem, setLopChuNhiem] = useState<LopChuNhiem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLopChuNhiem = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Bạn chưa đăng nhập!");
                    setIsLoading(false);
                    return;
                }

                const data = await getLopChuNhiem(token); // Gọi API lấy danh sách lớp chủ nhiệm
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

                setLopChuNhiem(formattedClasses);
            } catch (err: any) {
                console.error("Lỗi khi lấy danh sách lớp chủ nhiệm:", err);
                setError("Không thể tải danh sách lớp chủ nhiệm.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLopChuNhiem();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-amber-500" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách lớp chủ nhiệm</h1>
            {/* {lopChuNhiem && lopChuNhiem.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lopChuNhiem.map((lop) => (
                        <div key={lop.IDLopHoc} className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">{lop.tenLop}</h2>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center">
                                    <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
                                    <span className="text-gray-700">Sĩ số: {lop.siSo}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
                                    <span className="text-gray-700">Độ tuổi: {lop.doTuoi}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
                                    <span className="text-gray-700">Năm học: {lop.namHoc}</span>
                                </div>
                                {lop.linkZaloGroup && (
                                    <div className="flex items-center">
                                        <FaChalkboardTeacher className="text-amber-500 mr-2" size={20} />
                                        <a href={lop.linkZaloGroup} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Nhóm Zalo
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <button onClick={() => navigate(`/dashboard/giaovien/student-list/${lop.IDLopHoc}`)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))} */}
            {lopChuNhiem && lopChuNhiem.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lopChuNhiem.map((cls) => (
                        <div key={cls.IDLopHoc} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-amber-500">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{cls.tenLop}</h3>
                                <div className="space-y-4 mb-2">
                                    <div className="flex items-center text-gray-700">
                                        <div className="bg-amber-100 p-2 rounded-full mr-2">
                                            <FaUsers className="text-amber-600" />
                                        </div>
                                        <span className="font-medium">Sĩ số:</span>
                                        <span className="text-sm text-gray-500 mr-1">{cls.siSo} học sinh</span>
                                    </div>
                                    {cls.doTuoi && (
                                        <div className="flex items-center text-gray-700">
                                            <div className="bg-amber-100 p-2 rounded-full mr-2">
                                                <FaCalendarAlt className="text-amber-600" />
                                            </div>
                                            <span className="font-medium">Độ tuổi:</span>
                                            <span className="text-sm text-gray-500 mr-1">{cls.doTuoi}</span>
                                        </div>
                                    )}
                                    {cls.namHoc && (
                                        <div className="flex items-center text-gray-700">
                                            <div className="bg-amber-100 p-2 rounded-full mr-2">
                                                <FaGraduationCap className="text-amber-600" />
                                            </div>
                                            <span className="font-medium">Năm học:</span>
                                            <span className="text-sm text-gray-500 mr-1">{cls.namHoc}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-3 border-t border-gray-100">
                                    <div className="mt-2">
                                        <button
                                            onClick={() => navigate(`/dashboard/giaovien/student-list/${cls.IDLopHoc}`)}
                                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Bạn không có lớp chủ nhiệm nào.</p>
            )}
        </div>
    );
};

export default LopChuNhiem;
