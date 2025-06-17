import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getThongTinCanBo } from "../../services/school/apiSchool";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaBriefcase, FaBuilding, FaEnvelope, FaPhone, FaIdCard, FaGenderless, FaBirthdayCake, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

interface StaffDetail {
    id: string;
    hoTen: string;
    chucVu: string;
    phongBan: string;
    email: string;
    SDT: string;
    Status: string;
    gioiTinh?: string;
    ngaySinh?: string;
    diaChi?: string;
    ngayVaoLam?: string;
    luong?: number;
    avatar?: string;
}

const StaffDetail: React.FC = () => {
    const { idTruong, idNhanVien } = useParams<{ idTruong?: string; idNhanVien?: string }>();
    const navigate = useNavigate();

    const [canBo, setCanBo] = useState<StaffDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThongTinCanBo = async () => {
            if (!idTruong || !idNhanVien) {
                setError("Thiếu thông tin ID trường hoặc ID nhân viên.");
                setLoading(false);
                return;
            }

            try {
                const data = await getThongTinCanBo(idTruong, idNhanVien);
                if (!data) {
                    setError("Không tìm thấy thông tin cán bộ.");
                } else {
                    setCanBo(data);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin cán bộ:", err);
                setError("Không thể tải thông tin cán bộ.");
            } finally {
                setLoading(false);
            }
        };

        fetchThongTinCanBo();
    }, [idTruong, idNhanVien]);

    const handleBack = () => {
        navigate(-1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Được duyệt":
                return "bg-green-100 text-green-800";
            case "Chờ duyệt":
                return "bg-amber-100 text-amber-800";
            case "Không được duyệt":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-amber-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-500 rounded-full mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Đã xảy ra lỗi</h2>
                    <p className="text-center text-gray-600 mb-6">{error}</p>
                    <button onClick={handleBack} className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center">
                        <FaArrowLeft className="mr-2" /> Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-amber-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={handleBack} className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors inline-flex items-center shadow-md">
                    <FaArrowLeft className="mr-2" /> Quay lại
                </button>

                {canBo && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header section */}
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                    <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white shadow-md">
                                        {canBo.avatar ? (
                                            <img src={canBo.avatar} alt={canBo.hoTen} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-3xl font-bold">{canBo.hoTen.charAt(0)}</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{canBo.hoTen}</h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center">
                                            <FaBriefcase className="mr-1" />
                                            <span>{canBo.chucVu || "Chưa phân công"}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBuilding className="mr-1" />
                                            <span>{canBo.phongBan || "Chưa phân công"}</span>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(canBo.Status)}`}>{canBo.Status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b border-amber-200 pb-2">Thông tin liên hệ</h2>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-800">{canBo.email || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <FaPhone />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-800">{canBo.SDT || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    {canBo.diaChi && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                                <p className="font-medium text-gray-800">{canBo.diaChi}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b border-amber-200 pb-2">Thông tin cá nhân</h2>

                                    {canBo.gioiTinh && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <FaGenderless />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium text-gray-800">{canBo.gioiTinh}</p>
                                            </div>
                                        </div>
                                    )}

                                    {canBo.ngaySinh && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <FaBirthdayCake />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                                <p className="font-medium text-gray-800">{new Date(canBo.ngaySinh).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {canBo.ngayVaoLam && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <FaCalendarAlt />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày vào làm</p>
                                                <p className="font-medium text-gray-800">{new Date(canBo.ngayVaoLam).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    {canBo.luong && (
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Lương</p>
                                                <p className="font-medium text-gray-800">{canBo.luong.toLocaleString()} VND</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StaffDetail;
