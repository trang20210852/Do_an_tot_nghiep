import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDanhSachTruong, searchTruongHoc } from "../../services/school/apiSchool";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaArrowRight, FaSpinner, FaFilter, FaSchool, FaBook, FaGraduationCap } from "react-icons/fa";

interface TruongHoc {
    IDTruong: number;
    tenTruong: string;
    diaChi: string;
    SDT: string;
    email_business: string;
    rating: number | string | null;
    Avatar: string | null;
}

const SearchSchool: React.FC = () => {
    const [diaChi, setDiaChi] = useState("");
    const [results, setResults] = useState<TruongHoc[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllSchools = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getDanhSachTruong();
                setResults(data);
            } catch (err: any) {
                setError("Không thể tải danh sách trường học.");
                console.error("Lỗi khi tải danh sách trường học:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSchools();
    }, []);

    const handleSearch = async () => {
        if (!diaChi.trim()) {
            const data = await getDanhSachTruong();
            setResults(data);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await searchTruongHoc(diaChi);
            setResults(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi tìm kiếm trường học.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (idTruong: number, state: string) => {
        navigate(`/${idTruong}/${state}`);
    };

    // Định dạng rating an toàn
    const formatRating = (rating: number | string | null | undefined) => {
        if (rating === null || rating === undefined) return "N/A";
        if (typeof rating === "number") return rating.toFixed(1);
        return rating;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
            {/* Hero Section */}
            {/* Enhanced Hero Section */}
            <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-white py-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-400"></div>
                    <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-amber-300"></div>
                    <div className="absolute bottom-10 left-1/3 w-48 h-48 rounded-full bg-amber-500"></div>
                    <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-amber-400"></div>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-10 md:mb-0 md:w-1/2">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
                                Tìm Kiếm <span className="text-amber-300">Trường Học</span> Phù Hợp
                            </h1>
                            <p className="text-amber-100 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                                Khám phá hàng ngàn trường học chất lượng. Tìm kiếm dễ dàng theo địa điểm và xem đánh giá từ phụ huynh.
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-amber-500 rounded-full">
                                        <FaBook className="text-white" />
                                    </div>
                                    <span className="ml-2 text-amber-100">Hơn 1000+ trường học</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-amber-500 rounded-full">
                                        <FaStar className="text-white" />
                                    </div>
                                    <span className="ml-2 text-amber-100">Đánh giá từ phụ huynh</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Image - Optional */}
                        <div className="hidden md:block md:w-1/3">
                            <div className="relative">
                                <div className="absolute -top-5 -left-5 w-full h-full bg-amber-400 rounded-xl transform rotate-3"></div>
                                <div className="relative overflow-hidden rounded-xl shadow-xl border-4 border-white">
                                    <img src="https://i.pinimg.com/736x/05/82/ba/0582ba3e823a654317bca8587ccd0822.jpg" alt="Tìm kiếm trường học" className="w-full h-64 object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Box - Moved below hero section with negative margin */}
            <div className="max-w-6xl mx-auto px-6 relative z-20 -mt-8">
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">Địa chỉ hoặc tên trường</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-amber-500" />
                                </div>
                                <input
                                    type="text"
                                    value={diaChi}
                                    onChange={(e) => setDiaChi(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-4 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                                    placeholder="Nhập địa chỉ hoặc tên trường cần tìm..."
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md font-medium"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Đang tìm...
                                </>
                            ) : (
                                <>
                                    <FaSearch className="mr-2" /> Tìm Kiếm
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-sm text-gray-500">Tìm kiếm phổ biến:</span>
                        <button onClick={() => setDiaChi("Hà Nội")} className="text-sm bg-gray-100 hover:bg-amber-100 text-gray-700 px-3 py-1 rounded-full transition-colors">
                            Hà Nội
                        </button>
                        <button onClick={() => setDiaChi("Hồ Chí Minh")} className="text-sm bg-gray-100 hover:bg-amber-100 text-gray-700 px-3 py-1 rounded-full transition-colors">
                            Hồ Chí Minh
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {loading && results.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-amber-500 text-4xl mb-4" />
                        <p className="text-gray-600">Đang tìm kiếm trường học phù hợp...</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Kết quả tìm kiếm</h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-800 py-1 px-3 rounded-full font-medium">{results.length} trường học</span>
                                <button className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors">
                                    <FaFilter />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.map((school) => (
                                <div
                                    key={school.IDTruong}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-amber-200 group"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        {school.Avatar ? (
                                            <img src={school.Avatar} alt={school.tenTruong} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-yellow-100 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                                                <FaSchool size={60} />
                                            </div>
                                        )}
                                        {/* <img
                                            src={school.Avatar || "https://i.pinimg.com/736x/05/82/ba/0582ba3e823a654317bca8587ccd0822.jpg"}
                                            alt={school.tenTruong}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        /> */}
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 rounded-bl-lg flex items-center font-medium">
                                            <FaStar className="mr-1 text-amber-200" />
                                            <span>{formatRating(school.rating)}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{school.tenTruong}</h3>
                                        <div className="flex items-start gap-2 text-gray-600 mb-2">
                                            <FaMapMarkerAlt className="mt-1 text-amber-500 flex-shrink-0" />
                                            <p className="line-clamp-2 text-sm">{school.diaChi}</p>
                                        </div>
                                        {school.SDT && (
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <FaPhone className="mr-2 text-amber-500" />
                                                <p className="text-sm">{school.SDT}</p>
                                            </div>
                                        )}
                                        {school.email_business && (
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <FaEnvelope className="mr-2 text-amber-500" />
                                                <p className="truncate text-sm">{school.email_business}</p>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleViewDetails(school.IDTruong, "details")}
                                            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                                        >
                                            Xem chi tiết <FaArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    !loading && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 my-8">
                            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaSchool className="text-amber-500 text-3xl" />
                            </div>
                            <h3 className="text-2xl font-medium mb-3 text-gray-800">{diaChi ? `Không tìm thấy trường học phù hợp với "${diaChi}"` : "Chưa có kết quả tìm kiếm"}</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">Hãy thử tìm kiếm với địa chỉ khác hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
                            <button onClick={() => setDiaChi("")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium">
                                Xem tất cả trường
                            </button>
                        </div>
                    )
                )}
            </div>

            {/* Footer info */}
            <div className="bg-amber-50 border-t border-amber-100 py-8">
                <div className="max-w-6xl mx-auto px-6 text-center text-amber-800">
                    <p>© {new Date().getFullYear()} Hệ thống tìm kiếm trường học. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    );
};

export default SearchSchool;
