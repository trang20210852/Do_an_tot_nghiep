import React, { useState } from "react";
import axios from "axios";

interface AddChildFormProps {
    onSuccess?: () => void;
}

const AddChildForm: React.FC<AddChildFormProps> = ({ onSuccess }) => {
    const [form, setForm] = useState({
        hoTen: "",
        nickname: "",
        gioiTinh: "Nam",
        ngaySinh: "",
        ngayNhapHoc: "",
        thongTinSucKhoe: "",
        tinhHinhHocTap: "",
        Avatar: "",
        IDTruong: 1,
        IDLopHoc: 1,
        cccd: "",
        giayKhaiSinh: "",
        hoKhau: "",
        soThich: "",
        uuDiem: "",
        nhuocDiem: "",
        benhTat: "",
        doTuoi: 6,
        moiQuanHe: "Bố",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:3000/api/student/them-hocsinh", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            alert("Thêm con thành công!");
            onSuccess?.();
        } catch (err: any) {
            setError(err.response?.data?.error || "Có lỗi xảy ra khi thêm con.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-orange-50">
            <div className="flex max-w-5xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Cột hình ảnh */}
                <div className="hidden md:block w-1/2">
                    <img src="https://img.freepik.com/free-vector/kids-world-abstract-concept_335657-3032.jpg" alt="Child Form" className="h-full w-full object-cover" />
                </div>

                {/* Cột form */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[95vh] bg-[#fffaf0]">
                    <h2 className="text-2xl font-bold text-center mb-6">Thêm Thông Tin Bé</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="hoTen" onChange={handleChange} placeholder="Họ tên" className="input" required />
                            <input name="nickname" onChange={handleChange} placeholder="Tên gọi ở nhà" className="input" />
                            <select name="gioiTinh" onChange={handleChange} className="input">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            <input type="date" name="ngaySinh" onChange={handleChange} className="input" required />
                            <input type="date" name="ngayNhapHoc" onChange={handleChange} className="input" required />
                            <input name="cccd" onChange={handleChange} placeholder="CCCD Con" className="input" required />
                            <input name="Avatar" onChange={handleChange} placeholder="Link avatar" className="input" />
                            <input name="giayKhaiSinh" onChange={handleChange} placeholder="Link giấy khai sinh" className="input" />
                            <input name="hoKhau" onChange={handleChange} placeholder="Link hộ khẩu" className="input" />
                            <input name="doTuoi" type="number" onChange={handleChange} placeholder="Độ tuổi" className="input" />
                            <input name="moiQuanHe" onChange={handleChange} placeholder="Mối quan hệ (Bố/Mẹ)" className="input" />
                        </div>

                        <textarea name="thongTinSucKhoe" onChange={handleChange} placeholder="Thông tin sức khỏe" className="input" />
                        <textarea name="tinhHinhHocTap" onChange={handleChange} placeholder="Tình hình học tập" className="input" />
                        <textarea name="soThich" onChange={handleChange} placeholder="Sở thích" className="input" />
                        <textarea name="uuDiem" onChange={handleChange} placeholder="Ưu điểm" className="input" />
                        <textarea name="nhuocDiem" onChange={handleChange} placeholder="Nhược điểm" className="input" />
                        <textarea name="benhTat" onChange={handleChange} placeholder="Bệnh tật nếu có" className="input" />

                        {/* Hiển thị lỗi nếu có */}
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {/* Nút gửi */}
                        <div className="flex justify-center">
                            <button type="submit" disabled={loading} className="w-2/3 bg-green-600 text-white font-semibold rounded-md px-4 py-3 hover:bg-green-700 transition duration-200">
                                {loading ? "Đang gửi..." : "Gửi Thông Tin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddChildForm;
