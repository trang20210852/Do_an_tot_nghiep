// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getThongTinTruongHoc } from "../../services/apiTruongHoc";
// import { useAuth } from "../../context/AuthContext";

// interface TruongHoc {
//     IDTruong: number;
//     tenTruong: string;
//     diaChi: string;
//     SDT: string;
//     email_business: string;
//     email_hieutruong: string;
//     ngayThanhLap: string;
//     soLuongLop: number;
//     tongSoHocSinh: number;
//     tongSoCanBo: number;
//     Status: "Hoạt động" | "Dừng";
//     Avatar: string | null;
// }

// const TruongProfile: React.FC = () => {
//     const { idTruong } = useAuth(); // Lấy IDTruong từ context
//     const idTruongStr = idTruong ? String(idTruong) : "";
//     const [thongTinTruong, setThongTinTruong] = useState<TruongHoc | null>(null);

//     useEffect(() => {
//         if (idTruongStr) {
//             getThongTinTruongHoc(idTruongStr).then(setThongTinTruong).catch(console.error);
//         }
//     }, [idTruongStr]);

//     if (!thongTinTruong) return <p>Đang tải thông tin trường học...</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
//             <div className="flex items-center space-x-6">
//                 {thongTinTruong.Avatar ? (
//                     <img src={thongTinTruong.Avatar} alt="Avatar Trường" className="w-32 h-32 object-cover rounded-full" />
//                 ) : (
//                     <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">No Avatar</div>
//                 )}

//                 <div>
//                     <h1 className="text-3xl font-bold">{thongTinTruong.tenTruong}</h1>
//                     <p className="text-gray-600">Địa chỉ : {thongTinTruong.diaChi}</p>
//                     <p className="text-gray-500 text-sm">Thành lập: {new Date(thongTinTruong.ngayThanhLap).toLocaleDateString()}</p>
//                 </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                     <strong>Số điện thoại:</strong> {thongTinTruong.SDT}
//                 </div>
//                 <div>
//                     <strong>Email doanh nghiệp:</strong> {thongTinTruong.email_business}
//                 </div>
//                 <div>
//                     <strong>Email hiệu trưởng:</strong> {thongTinTruong.email_hieutruong}
//                 </div>
//                 <div>
//                     <strong>Số lượng lớp:</strong> {thongTinTruong.soLuongLop}
//                 </div>
//                 <div>
//                     <strong>Tổng học sinh:</strong> {thongTinTruong.tongSoHocSinh}
//                 </div>
//                 <div>
//                     <strong>Tổng cán bộ:</strong> {thongTinTruong.tongSoCanBo}
//                 </div>
//                 <div>
//                     <strong>Trạng thái:</strong>
//                     <span className={`ml-2 px-2 py-1 rounded-full text-white ${thongTinTruong.Status === "Hoạt động" ? "bg-green-500" : "bg-red-500"}`}>{thongTinTruong.Status}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TruongProfile;

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getThongTinTruongHoc, updateThongTinTruongHoc } from "../../services/apiTruongHoc";
import Modal from "../../components/Modal";

interface TruongHoc {
    IDTruong: number;
    tenTruong: string;
    diaChi: string;
    SDT: string;
    email_business: string;
    email_hieutruong: string;
    ngayThanhLap: string;
    soLuongLop: number;
    tongSoHocSinh: number;
    tongSoCanBo: number;
    Status: "Hoạt động" | "Dừng";
    Avatar: string | null;
}

const TruongProfile: React.FC = () => {
    const { idTruong } = useAuth();
    const idTruongStr = idTruong ? String(idTruong) : "";
    const [thongTinTruong, setThongTinTruong] = useState<TruongHoc | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<TruongHoc | null>(null);

    useEffect(() => {
        if (idTruongStr) {
            getThongTinTruongHoc(idTruongStr).then(setThongTinTruong).catch(console.error);
        }
    }, [idTruongStr]);

    const handleEditClick = () => {
        setEditedData(thongTinTruong);
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedData) {
            setEditedData({ ...editedData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (editedData) {
            try {
                await updateThongTinTruongHoc(editedData);
                setThongTinTruong(editedData);
                setIsEditing(false);
            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin", error);
            }
        }
    };

    if (!thongTinTruong) return <p>Đang tải thông tin trường học...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
            <div className="flex items-center space-x-6">
                {thongTinTruong.Avatar ? (
                    <img src={thongTinTruong.Avatar} alt="Avatar Trường" className="w-32 h-32 object-cover rounded-full" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">No Avatar</div>
                )}
                <div>
                    <h1 className="text-3xl font-bold">{thongTinTruong.tenTruong}</h1>
                    <p className="text-gray-600">Địa chỉ : {thongTinTruong.diaChi}</p>
                    <p className="text-gray-500 text-sm">Thành lập: {new Date(thongTinTruong.ngayThanhLap).toLocaleDateString()}</p>
                </div>
                <button onClick={handleEditClick} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg">
                    Cập nhật thông tin
                </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <strong>Số điện thoại:</strong> {thongTinTruong.SDT}
                </div>
                <div>
                    <strong>Email doanh nghiệp:</strong> {thongTinTruong.email_business}
                </div>
                <div>
                    <strong>Email hiệu trưởng:</strong> {thongTinTruong.email_hieutruong}
                </div>
                <div>
                    <strong>Số lượng lớp:</strong> {thongTinTruong.soLuongLop}
                </div>
                <div>
                    <strong>Tổng học sinh:</strong> {thongTinTruong.tongSoHocSinh}
                </div>
                <div>
                    <strong>Tổng cán bộ:</strong> {thongTinTruong.tongSoCanBo}
                </div>
                <div>
                    <strong>Trạng thái:</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-white ${thongTinTruong.Status === "Hoạt động" ? "bg-green-500" : "bg-red-500"}`}>{thongTinTruong.Status}</span>
                </div>
            </div>

            {isEditing && editedData && (
                <Modal title="Cập nhật thông tin trường" onClose={() => setIsEditing(false)}>
                    <div className="space-y-4">
                        {/* Tên trường */}
                        <div>
                            <label className="block font-medium">Tên trường</label>
                            <input type="text" name="tenTruong" value={editedData.tenTruong} onChange={handleChange} className="border p-2 w-full" placeholder="Nhập tên trường" />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block font-medium">Địa chỉ</label>
                            <input type="text" name="diaChi" value={editedData.diaChi} onChange={handleChange} className="border p-2 w-full" placeholder="Nhập địa chỉ trường" />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block font-medium">Số điện thoại</label>
                            <input type="text" name="SDT" value={editedData.SDT} onChange={handleChange} className="border p-2 w-full" placeholder="Nhập số điện thoại" />
                        </div>

                        {/* Email doanh nghiệp */}
                        <div>
                            <label className="block font-medium">Email doanh nghiệp</label>
                            <input type="email" name="email_business" value={editedData.email_business} onChange={handleChange} className="border p-2 w-full" placeholder="Nhập email doanh nghiệp" />
                        </div>

                        {/* Email hiệu trưởng */}
                        <div>
                            <label className="block font-medium">Email hiệu trưởng</label>
                            <input
                                type="email"
                                name="email_hieutruong"
                                value={editedData.email_hieutruong}
                                onChange={handleChange}
                                className="border p-2 w-full"
                                placeholder="Nhập email hiệu trưởng"
                            />
                        </div>

                        {/* Nút lưu */}
                        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg w-full">
                            Lưu
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TruongProfile;
