import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaSchool,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaChild,
    FaBookOpen,
    FaCalendarAlt,
    FaBell,
    FaAngleRight,
    FaQuoteLeft,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface TestimonialCardProps {
    name: string;
    role: string;
    quote: string;
    avatar: string;
}

interface StatItemProps {
    count: string;
    label: string;
    icon: React.ReactNode;
}

const LandingPage: React.FC = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navigation */}
            <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-600 text-white p-2 rounded-lg">
                            <FaSchool size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Hệ Thống Quản Lý Mầm Non <span className="text-amber-600">TinyCare</span>
                        </h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                            Tính năng
                        </a>
                        <a href="#about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                            Giới thiệu
                        </a>
                        <a href="#testimonials" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                            Đánh giá
                        </a>
                        <Link to="/search-school" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
                            Tìm kiếm
                        </Link>
                        <div className="flex space-x-3">
                            <Link to="/login" className="px-5 py-2 bg-white border border-amber-600 text-amber-600 rounded-md hover:bg-amber-50 transition-colors font-medium">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="px-5 py-2 bg-amber-600 text-white rounded-md shadow-md hover:bg-amber-700 transition-colors font-medium">
                                Đăng ký
                            </Link>
                        </div>
                    </nav>
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-amber-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 md:py-28 bg-amber-50 overflow-hidden">
                <div className="absolute inset-0 pattern-dots-lg opacity-5 text-amber-900"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                            <span className="inline-block bg-amber-100 text-amber-800 font-medium px-4 py-1 rounded-full text-sm mb-6">Nền tảng quản lý giáo dục mầm non</span>
                            <h3 className="text-4xl md:text-4xl font-bold text-gray-900  leading-tight">
                                Kết nối nhà trường với <span className="text-amber-600">gia đình</span>
                            </h3>
                            <h3 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">vì sự phát triển toàn diện của trẻ</h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">Nền tảng toàn diện giúp nhà trường, giáo viên và phụ huynh đồng hành cùng sự phát triển của trẻ mầm non.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link
                                    to="/register"
                                    className="px-8 py-3.5 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 transition-colors text-base font-medium flex items-center justify-center"
                                >
                                    Bắt đầu ngay
                                    <FaAngleRight className="ml-2" />
                                </Link>
                                <Link to="/login" className="px-8 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium">
                                    Đăng nhập
                                </Link>
                            </div>
                            <div className="mt-10 flex items-center justify-center md:justify-start">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img
                                            key={i}
                                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${20 + i}.jpg`}
                                            alt="User"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="md:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-xl blur-xl opacity-30"></div>
                                <img
                                    src="https://i.pinimg.com/736x/53/2b/ce/532bce3c195959c75f29fba985fc00d2.jpg"
                                    alt="Hệ Thống Quản Lý Mầm Non TinyCare"
                                    className="relative rounded-xl shadow-2xl w-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">Tính năng nổi bật</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giải pháp toàn diện cho quản lý trường mầm non</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Hệ Thống Quản Lý Mầm Non TinyCare cung cấp đầy đủ các tính năng để kết nối và phối hợp hiệu quả giữa nhà trường và gia đình
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FaUserGraduate className="text-amber-600" size={28} />}
                            title="Quản lý học sinh"
                            description="Theo dõi thông tin chi tiết về học sinh, tiến độ học tập và quá trình phát triển kỹ năng."
                        />

                        <FeatureCard
                            icon={<FaChalkboardTeacher className="text-amber-600" size={28} />}
                            title="Quản lý giáo viên"
                            description="Phân công giảng dạy, theo dõi lịch làm việc và đánh giá hiệu quả công việc."
                        />

                        <FeatureCard
                            icon={<FaChild className="text-amber-600" size={28} />}
                            title="Theo dõi phát triển"
                            description="Đánh giá toàn diện về sự phát triển thể chất, tinh thần và kỹ năng xã hội của trẻ."
                        />

                        <FeatureCard
                            icon={<FaBookOpen className="text-amber-600" size={28} />}
                            title="Chương trình giáo dục"
                            description="Quản lý kế hoạch giảng dạy, chương trình học và các hoạt động phát triển đa dạng."
                        />

                        <FeatureCard
                            icon={<FaBell className="text-amber-600" size={28} />}
                            title="Hệ thống thông báo"
                            description="Trao đổi thông tin trực tiếp giữa giáo viên và phụ huynh về các hoạt động và sự kiện."
                        />

                        <FeatureCard
                            icon={<FaCalendarAlt className="text-amber-600" size={28} />}
                            title="Quản lý sự kiện"
                            description="Theo dõi lịch học, tổ chức sự kiện và các hoạt động đặc biệt của nhà trường."
                        />
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl -z-10 transform -rotate-3"></div>
                                <img
                                    src="https://img.freepik.com/free-vector/kindergarten-kids-playing-classroom-with-teacher_1308-26704.jpg"
                                    alt="Về Hệ Thống Quản Lý Mầm Non TinyCare"
                                    className="rounded-lg shadow-lg"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <FaChild className="text-amber-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Học sinh phát triển</p>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                                                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="order-1 md:order-2">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">Về chúng tôi</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Cải thiện chất lượng giáo dục mầm non</h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Hệ Thống Quản Lý Mầm Non TinyCare được xây dựng với sứ mệnh hỗ trợ các trường mầm non quản lý hiệu quả và xây dựng mối quan hệ chặt chẽ với phụ huynh. Chúng tôi tin
                                    rằng mỗi đứa trẻ đều xứng đáng nhận được sự giáo dục tốt nhất.
                                </p>

                                <div className="space-y-5">
                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-2 rounded-full mr-4">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Hỗ trợ đội ngũ giáo viên</h3>
                                            <p className="text-gray-600">Giúp giáo viên giảm bớt công việc hành chính, tập trung vào giảng dạy và phát triển giáo án chất lượng.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-2 rounded-full mr-4">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Tăng cường giao tiếp hiệu quả</h3>
                                            <p className="text-gray-600">Kênh liên lạc trực tiếp giữa giáo viên và phụ huynh, đảm bảo thông tin được cập nhật kịp thời.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-amber-100 p-2 rounded-full mr-4">
                                            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Đánh giá phát triển toàn diện</h3>
                                            <p className="text-gray-600">Công cụ đánh giá tiên tiến giúp theo dõi và phân tích sự tiến bộ của từng trẻ một cách chi tiết.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <a href="#features" className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700 transition-colors">
                                        Khám phá thêm tính năng
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">Đánh giá từ người dùng</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Khách hàng nói gì về chúng tôi</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Trải nghiệm thực tế từ những người đã và đang sử dụng nền tảng Hệ Thống Quản Lý Mầm Non TinyCare</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Nguyễn Thị Hồng"
                            role="Hiệu trưởng"
                            quote="Hệ Thống Quản Lý Mầm Non TinyCare đã giúp chúng tôi tiết kiệm hơn 60% thời gian quản lý hành chính và tập trung vào phát triển chương trình giảng dạy chất lượng cao."
                            avatar="https://randomuser.me/api/portraits/women/32.jpg"
                        />

                        <TestimonialCard
                            name="Trần Văn Minh"
                            role="Phụ huynh"
                            quote="Tôi luôn được cập nhật về hoạt động hàng ngày và sự tiến bộ của con. Nền tảng này thực sự đã mang lại cảm giác an tâm và gắn kết với nhà trường."
                            avatar="https://randomuser.me/api/portraits/men/46.jpg"
                        />

                        <TestimonialCard
                            name="Lê Thị Ngọc"
                            role="Giáo viên"
                            quote="Việc ghi nhận đánh giá và theo dõi sự phát triển của từng học sinh trở nên dễ dàng hơn rất nhiều. Tôi có thể tập trung vào việc dạy học thay vì công việc giấy tờ."
                            avatar="https://randomuser.me/api/portraits/women/65.jpg"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-amber-600 text-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-amber-700 to-amber-600 rounded-2xl shadow-xl p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 opacity-20 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-500 opacity-20 rounded-full"></div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nâng cao chất lượng giáo dục mầm non</h2>
                            <p className="text-xl text-amber-100 mb-10 max-w-3xl mx-auto">
                                Tham gia cùng hàng nghìn trường học đã và đang sử dụng Hệ Thống Quản Lý Mầm Non TinyCare để cải thiện quy trình quản lý và chất lượng giáo dục
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-white text-amber-600 rounded-lg shadow-md hover:bg-gray-100 transition-colors text-lg font-medium flex items-center justify-center"
                                >
                                    Đăng ký miễn phí
                                    <FaAngleRight className="ml-2" />
                                </Link>

                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-600 transition-colors text-lg font-medium"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-amber-600 text-white p-2 rounded-lg">
                                    <FaSchool size={24} />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Hệ Thống Quản Lý Mầm Non <span className="text-amber-500">TinyCare</span>
                                </h3>
                            </div>
                            <p className="text-gray-400 mb-4">Nền tảng toàn diện kết nối nhà trường, giáo viên và phụ huynh vì sự phát triển của trẻ.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-gray-800 hover:bg-amber-600 transition-colors p-2 rounded-full text-white">
                                    <FaFacebookF size={16} />
                                </a>
                                <a href="#" className="bg-gray-800 hover:bg-amber-600 transition-colors p-2 rounded-full text-white">
                                    <FaTwitter size={16} />
                                </a>
                                <a href="#" className="bg-gray-800 hover:bg-amber-600 transition-colors p-2 rounded-full text-white">
                                    <FaInstagram size={16} />
                                </a>
                                <a href="#" className="bg-gray-800 hover:bg-amber-600 transition-colors p-2 rounded-full text-white">
                                    <FaYoutube size={16} />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#features" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Tính năng
                                    </a>
                                </li>
                                <li>
                                    <a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Giới thiệu
                                    </a>
                                </li>
                                <li>
                                    <a href="#testimonials" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a href="#stats" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Thống kê
                                    </a>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Đăng nhập
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Đăng ký
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Dịch vụ</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Quản lý học sinh
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Quản lý giáo viên
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Theo dõi phát triển
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Chương trình học
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                                        <FaAngleRight className="mr-2 text-amber-600" size={14} />
                                        Thông báo và lịch
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Thông tin liên hệ</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start">
                                    <FaMapMarkerAlt className="mt-1 mr-3 text-amber-600" size={18} />
                                    <span>123 Đường Lê Lợi, Quận 1, TP.HCM, Việt Nam</span>
                                </li>
                                <li className="flex items-center">
                                    <FaPhone className="mr-3 text-amber-600" size={18} />
                                    <span>(84) 123 456 789</span>
                                </li>
                                <li className="flex items-center">
                                    <FaEnvelope className="mr-3 text-amber-600" size={18} />
                                    <span>info@mamnonxanh.edu.vn</span>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <h5 className="text-sm font-semibold text-gray-300 mb-3">Đăng ký nhận tin</h5>
                                <div className="flex">
                                    <input type="email" placeholder="Email của bạn" className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-1 focus:outline-none" />
                                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                                        <FaAngleRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
                        <p>© 2023 Hệ Thống Quản Lý Mầm Non TinyCare. Bản quyền thuộc về trường mầm non.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Component con FeatureCard
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
            <div className="mb-5 inline-block bg-amber-50 p-3 rounded-lg">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
};

// Component con TestimonialCard
const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, quote, avatar }) => {
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 border border-gray-100 hover:shadow-md">
            <FaQuoteLeft className="text-amber-200 mb-4" size={32} />
            <p className="text-gray-700 italic mb-6">{quote}</p>
            <div className="flex items-center">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full border-2 border-amber-100 mr-4 object-cover" />
                <div>
                    <h4 className="font-bold text-gray-800">{name}</h4>
                    <p className="text-amber-600 text-sm">{role}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Component con StatItem
const StatItem: React.FC<StatItemProps> = ({ count, label, icon }) => {
    return (
        <div className="text-center p-6 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mb-4">{icon}</div>
            <h4 className="text-3xl font-bold text-gray-900 mb-2">{count}</h4>
            <p className="text-gray-600">{label}</p>
        </div>
    );
};

export default LandingPage;
