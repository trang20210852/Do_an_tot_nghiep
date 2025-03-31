import React, { useEffect, useState } from "react";
import { registerTruongHoc, registerCanBo, registerPhuHuynh } from "../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { getDanhSachTruong } from "../services/apiTruongHoc";

interface RegisterFormProps {
    role: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
    const [formData, setFormData] = useState<any>({
        tenTruong: "",
        diaChi: "",
        SDT: "",
        email: "",
        ngayThanhLap: "",
        matKhau: "",
        nhapLaiMatKhau: "",
        hoTen: "",
        gioiTinh: "",
        ngaySinh: "",
        IDTruong: "",
    });
    const [gioiTinh, setGioiTinh] = useState("");

    const [error, setError] = useState("");
    const navigate = useNavigate(); // Dùng để chuyển trang
    const [showPassword, setShowPassword] = useState(false);

    const [danhSachTruong, setDanhSachTruong] = useState<{ IDTruong: number; tenTruong: string }[]>([]);
    const [truongDuocChon, setTruongDuocChon] = useState<number | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDanhSachTruong();
            setDanhSachTruong(data);
        };
        fetchData();
    }, []);
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleGioiTinhChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGioiTinh(e.target.value);
        setFormData({ ...formData, gioiTinh: e.target.value });
    };
    const handleTruongChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruongDuocChon(Number(e.target.value));
        setFormData({ ...formData, IDTruong: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.matKhau !== formData.nhapLaiMatKhau) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }
        setError("");
        console.log("Giá trị gioiTinh trước khi gửi:", gioiTinh);
        console.log("Giá trị truong trước khi gửi:", truongDuocChon);

        try {
            let response;
            if (role === "Trường Học") {
                response = await registerTruongHoc({
                    tenTruong: formData.tenTruong,
                    diaChi: formData.diaChi,
                    SDT: formData.SDT,
                    email_business: formData.email_business,
                    email_hieutruong: formData.email_hieutruong,
                    ngayThanhLap: formData.ngayThanhLap,
                });
            } else if (role === "Cán Bộ") {
                response = await registerCanBo({
                    hoTen: formData.hoTen,
                    gioiTinh: formData.gioiTinh,
                    ngaySinh: formData.ngaySinh,
                    diaChi: formData.diaChi,
                    SDT: formData.SDT,
                    email: formData.email,
                    IDTruong: Number(formData.IDTruong),
                    matKhau: formData.matKhau,
                });

                alert("Đăng ký thành công, vui lòng chờ duyệt.");
                navigate("/"); // Quay về landing page
                return;
            } else if (role === "Phụ Huynh") {
                response = await registerPhuHuynh({
                    hoTen: formData.hoTen,
                    gioiTinh: formData.gioiTinh,
                    ngaySinh: formData.ngaySinh,
                    diaChi: formData.diaChi,
                    SDT: formData.SDT,
                    email: formData.email,
                    matKhau: formData.matKhau,
                });
            }

            alert("Đăng ký thành công!");
            navigate("/dashboard"); // Chuyển đến dashboard nếu không phải Cán bộ
        } catch (err: any) {
            setError(err.response?.data?.error || "Đăng ký thất bại");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f8f1e8] bg-orange-50">
            <div className="flex max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden max-h-[650px]">
                {/* Cột hình ảnh */}
                <div className="hidden md:block  w-1/2 relative">
                    <img
                        src="https://kidsactivitiesblog.com/wp-content/uploads/2013/02/Good-Friend.png" // 🔥 Sử dụng ảnh bạn đã tải lên
                        alt="Login Background"
                        className="h-full w-full"
                    />
                </div>
                <div className="w-2/3 p-12 flex flex-col justify-center bg-[#fff7eb] max-h-[650px]">
                    <h2 className="text-2xl font-bold text-center mb-6">Đăng Kí - {role}</h2>
                    <h3 className="text-center mb-2 mt-1">Chào mừng đến với hệ thống quản lí Mầm non Xanh</h3>
                    <form onSubmit={handleSubmit}>
                        {role === "Trường Học" && (
                            <>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Tên trường :</label>
                                    <input type="text" name="tenTruong" placeholder="Tên trường" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Địa chỉ :</label>
                                    <input type="text" name="diaChi" placeholder="Địa chỉ" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Số điện thoại :</label>
                                    <input type="text" name="SDT" placeholder="Số điện thoại" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Email trường:</label>
                                    <input type="email" name="email_business" placeholder="Email Trường" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Email hiệu trưởng:</label>
                                    <input type="email" name="email_hieutruong" placeholder="Email Hiệu Trưởng" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Ngày thành lập :</label>
                                    <input type="date" name="ngayThanhLap" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                            </>
                        )}

                        {role === "Cán Bộ" && (
                            <>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Họ tên :</label>
                                    <input type="text" name="hoTen" placeholder="Họ tên" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Giới tính :</label>

                                    <select name="gioiTinh px-6" value={gioiTinh} onChange={handleGioiTinhChange} className="border rounded-lg px-4 py-2 w-3/4">
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Ngày sinh :</label>
                                    <input type="date" name="ngaySinh" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Địa chỉ :</label>
                                    <input type="text" name="diaChi" placeholder="Địa chỉ" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Số điện thoại :</label>
                                    <input type="text" name="SDT" placeholder="Số điện thoại" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Email :</label>
                                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Tên Trường :</label>

                                    <select name="IDTruong" className="border rounded-lg px-4 py-2 w-3/4" value={truongDuocChon || ""} onChange={handleTruongChange}>
                                        <option value="">Chọn trường học</option>
                                        {danhSachTruong.map((truong) => (
                                            <option key={truong.IDTruong} value={truong.IDTruong}>
                                                {truong.tenTruong}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Mật khẩu :</label>
                                    <input type="password" name="matKhau" placeholder="Mật khẩu" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Nhập lại mật khẩu </label>
                                    <input type="password" name="nhapLaiMatKhau" placeholder="Nhập lại mật khẩu" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                            </>
                        )}

                        {role === "Phụ Huynh" && (
                            <>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Họ tên :</label>
                                    <input type="text" name="hoTen" placeholder="Họ tên" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-5 mb-5 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Giới tính :</label>
                                    <select name="gioiTinh px-6" value={gioiTinh} onChange={handleGioiTinhChange} className="border rounded-lg px-4 py-2 w-3/4">
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Ngày sinh :</label>
                                    <input type="date" name="ngaySinh" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Địa chỉ :</label>
                                    <input type="text" name="diaChi" placeholder="Địa chỉ" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Số điện thoại :</label>
                                    <input type="text" name="SDT" placeholder="Số điện thoại" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Email :</label>
                                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Mật khẩu :</label>
                                    <input type="password" name="matKhau" placeholder="Mật khẩu" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                <div className="mt-2 mb-2 w-full flex items-center justify-between">
                                    <label className="w-1/2 px-6">Nhập lại mật khẩu </label>
                                    <input type="password" name="nhapLaiMatKhau" placeholder="Nhập lại mật khẩu" onChange={handleChange} className="border rounded-lg px-4 py-2 w-3/4" />
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                            </>
                        )}

                        <div className="flex justify-center">
                            <button type="submit" className="w-3/4 bg-black text-white font-semibold rounded-md px-4 py-3 hover:bg-gray-800 transition duration-200">
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
