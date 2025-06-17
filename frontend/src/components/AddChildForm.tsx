import React, { useState } from "react";
import {
    FaChild,
    FaUserCircle,
    FaCalendarAlt,
    FaSchool,
    FaIdCard,
    FaImage,
    FaFileAlt,
    FaHome,
    FaRunning,
    FaStar,
    FaExclamationTriangle,
    FaNotesMedical,
    FaArrowRight,
    FaArrowLeft,
    FaCheck,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface AddChildFormProps {
    onSubmit: (formData: any) => void;
}

const AddChildForm: React.FC<AddChildFormProps> = ({ onSubmit }) => {
    const [form, setForm] = useState({
        hoTen: "",
        nickname: "",
        gioiTinh: "Nam",
        ngaySinh: "",
        
        thongTinSucKhoe: "",
        tinhHinhHocTap: "",
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

    // Quản lý step hiện tại
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
   // Thêm state cho file
    const [giayKhaiSinh, setGiayKhaiSinh] = useState<File | null>(null);
    const [hoKhau, setHoKhau] = useState<File | null>(null);

   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (name === "giayKhaiSinh") setGiayKhaiSinh(files[0]);
            if (name === "hoKhau") setHoKhau(files[0]);
        }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (giayKhaiSinh) formData.append("giayKhaiSinh", giayKhaiSinh);
        if (hoKhau) formData.append("hoKhau", hoKhau);
        onSubmit(formData);
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Animation variants
    const pageVariants = {
        initial: {
            opacity: 0,
            x: 100,
        },
        in: {
            opacity: 1,
            x: 0,
        },
        out: {
            opacity: 0,
            x: -100,
        },
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.3,
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex justify-between">
                    {[...Array(totalSteps)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-1/4 text-center text-sm font-medium ${currentStep > index + 1 ? "text-amber-600" : currentStep === index + 1 ? "text-amber-500" : "text-gray-400"}`}
                        >
                            {index + 1 === 1 && "Thông tin cơ bản"}
                            {index + 1 === 2 && "Giấy tờ"}
                            {index + 1 === 3 && "Sức khỏe"}
                            {index + 1 === 4 && "Thông tin bổ sung"}
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form header */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white">
                        <h2 className="text-xl font-semibold flex items-center">
                            <FaChild className="mr-2" />
                            {currentStep === 1 && "Thông tin cơ bản của học sinh"}
                            {currentStep === 2 && "Thông tin giấy tờ và hồ sơ"}
                            {currentStep === 3 && "Thông tin sức khỏe"}
                            {currentStep === 4 && "Thông tin bổ sung"}
                        </h2>
                        <p className="text-amber-100 text-sm mt-1">
                            Bước {currentStep} trên {totalSteps}
                        </p>
                    </div>

                    {/* Form content */}
                    <div className="p-5 min-h-[350px]">
                        {/* Step 1: Thông tin cơ bản */}
                        {currentStep === 1 && (
                            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ tên <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaChild className="text-amber-500" />
                                            </div>
                                            <input
                                                name="hoTen"
                                                onChange={handleChange}
                                                value={form.hoTen}
                                                placeholder="Họ và tên của học sinh"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên gọi ở nhà</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUserCircle className="text-amber-500" />
                                            </div>
                                            <input
                                                name="nickname"
                                                onChange={handleChange}
                                                value={form.nickname}
                                                placeholder="Biệt danh hoặc tên gọi ở nhà"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giới tính <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUserCircle className="text-amber-500" />
                                            </div>
                                            <select
                                                name="gioiTinh"
                                                onChange={handleChange}
                                                value={form.gioiTinh}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                                            >
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày sinh <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaCalendarAlt className="text-amber-500" />
                                            </div>
                                            <input
                                                type="date"
                                                name="ngaySinh"
                                                onChange={handleChange}
                                                value={form.ngaySinh}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Độ tuổi</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaChild className="text-amber-500" />
                                            </div>
                                            <input
                                                name="doTuoi"
                                                type="number"
                                                onChange={handleChange}
                                                value={form.doTuoi}
                                                placeholder="Độ tuổi của trẻ"
                                                min="1"
                                                max="10"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mối quan hệ <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUserCircle className="text-amber-500" />
                                            </div>
                                            <select
                                                name="moiQuanHe"
                                                onChange={handleChange}
                                                value={form.moiQuanHe}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                                                required
                                            >
                                                <option value="Bố">Bố</option>
                                                <option value="Mẹ">Mẹ</option>
                                                <option value="Ông">Ông</option>
                                                <option value="Bà">Bà</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Thông tin giấy tờ */}
                        {currentStep === 2 && (
                            <motion.div initial="initial" animate="in" exit="out" /*...*/>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CCCD <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaIdCard className="text-amber-500" />
                                            </div>
                                            <input
                                                name="cccd"
                                                onChange={handleChange}
                                                value={form.cccd}
                                                placeholder="Số căn cước công dân"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giấy khai sinh (ảnh/pdf)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaFileAlt className="text-amber-500" />
                                            </div>
                                            <input
                                                name="giayKhaiSinh"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hộ khẩu (ảnh/pdf)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaHome className="text-amber-500" />
                                            </div>
                                            <input
                                                name="hoKhau"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={handleFileChange}
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {/* Step 3: Thông tin sức khỏe */}
                        {currentStep === 3 && (
                            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin sức khỏe chung</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaNotesMedical className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="thongTinSucKhoe"
                                                onChange={handleChange}
                                                value={form.thongTinSucKhoe}
                                                placeholder="Tình trạng sức khỏe chung của trẻ"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[120px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh tật (nếu có)</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaNotesMedical className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="benhTat"
                                                onChange={handleChange}
                                                value={form.benhTat}
                                                placeholder="Các bệnh lý, dị ứng hoặc vấn đề sức khỏe cần lưu ý"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[120px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Thông tin bổ sung */}
                        {currentStep === 4 && (
                            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tình hình học tập</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaSchool className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="tinhHinhHocTap"
                                                onChange={handleChange}
                                                value={form.tinhHinhHocTap}
                                                placeholder="Mô tả tình hình học tập trước đây nếu có"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sở thích</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaRunning className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="soThich"
                                                onChange={handleChange}
                                                value={form.soThich}
                                                placeholder="Các sở thích, hoạt động yêu thích của trẻ"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ưu điểm</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaStar className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="uuDiem"
                                                onChange={handleChange}
                                                value={form.uuDiem}
                                                placeholder="Điểm mạnh, ưu điểm của trẻ"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhược điểm</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FaExclamationTriangle className="text-amber-500" />
                                            </div>
                                            <textarea
                                                name="nhuocDiem"
                                                onChange={handleChange}
                                                value={form.nhuocDiem}
                                                placeholder="Điểm yếu, nhược điểm cần cải thiện"
                                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 min-h-[80px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Form navigation buttons */}
                    <div className="bg-gray-50 px-5 py-4 flex justify-between border-t border-gray-200">
                        <button
                            type="button"
                            onClick={prevStep}
                            className={`px-4 py-2 flex items-center rounded transition-colors ${currentStep === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                            disabled={currentStep === 1}
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại
                        </button>

                        {currentStep < totalSteps ? (
                            <button type="button" onClick={nextStep} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors flex items-center">
                                Tiếp tục <FaArrowRight className="ml-2" />
                            </button>
                        ) : (
                            <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors flex items-center">
                                Hoàn tất <FaCheck className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Step indicators */}
            <div className="flex justify-center mt-4">
                {[...Array(totalSteps)].map((_, index) => (
                    <div key={index} className={`h-2 w-2 mx-1 rounded-full ${currentStep > index ? "bg-amber-500" : "bg-gray-300"}`} />
                ))}
            </div>

            <div className="bg-amber-50 p-3 rounded-lg mt-5 flex items-center">
                <FaFileAlt className="text-amber-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích quản lý học sinh.</p>
            </div>
        </div>
    );
};

export default AddChildForm;
