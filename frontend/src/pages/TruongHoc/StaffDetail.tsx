import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getThongTinCanBo } from "../../services/apiTruongHoc";

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
}

const StaffDetail = () => {
    const { idTruong, idNhanVien } = useParams<{ idTruong?: string; idNhanVien?: string }>();
    const navigate = useNavigate();

    // State quản lý dữ liệu
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

    // Xử lý quay lại trang trước
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                {/* Nút quay lại */}
                <button onClick={handleBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    ← Quay lại
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Thông tin cán bộ</h2>

                {/* Hiển thị trạng thái tải */}
                {loading && <p className="text-gray-600">Đang tải thông tin...</p>}

                {/* Hiển thị lỗi nếu có */}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Hiển thị thông tin cán bộ */}
                {canBo && (
                    <div className="space-y-3">
                        <p className="text-lg">
                            <strong>Họ tên:</strong> {canBo.hoTen}
                        </p>
                        <p>
                            <strong>Chức vụ:</strong> {canBo.chucVu}
                        </p>
                        <p>
                            <strong>Phòng ban:</strong> {canBo.phongBan}
                        </p>
                        <p>
                            <strong>Email:</strong> {canBo.email}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> {canBo.SDT}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>

                            {canBo.Status}
                        </p>
                        {canBo.gioiTinh && (
                            <p>
                                <strong>Giới tính:</strong> {canBo.gioiTinh}
                            </p>
                        )}
                        {canBo.ngaySinh && (
                            <p>
                                <strong>Ngày sinh:</strong> {new Date(canBo.ngaySinh).toLocaleDateString()}
                            </p>
                        )}
                        {canBo.diaChi && (
                            <p>
                                <strong>Địa chỉ:</strong> {canBo.diaChi}
                            </p>
                        )}
                        {canBo.ngayVaoLam && (
                            <p>
                                <strong>Ngày vào làm:</strong> {new Date(canBo.ngayVaoLam).toLocaleDateString()}
                            </p>
                        )}
                        {/* {canBo.luong && (
                            <p>
                                <strong>Lương:</strong> {canBo.luong.toLocaleString()} VND
                            </p>
                        )} */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDetail;
