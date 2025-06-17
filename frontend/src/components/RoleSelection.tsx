import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaUserTie, FaSchool } from "react-icons/fa";

interface RoleSelectionProps {
    onSelectRole: (role: string) => void;
    availableRoles: string[];
}

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, availableRoles }) => {
    const getRoleIcon = (role: string) => {
        switch (role) {
            case "Cán Bộ":
                return <FaUserTie className="text-amber-500 text-3xl group-hover:text-white transition-colors" />;
            case "Phụ Huynh":
                return <FaUser className="text-amber-500 text-3xl group-hover:text-white transition-colors" />;
            case "Trường Học":
                return <FaSchool className="text-amber-500 text-3xl group-hover:text-white transition-colors" />;
            default:
                return <FaUser className="text-amber-500 text-3xl group-hover:text-white transition-colors" />;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8">
            <motion.div className="w-full max-w-5xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-2xl">
                    {/* Left side - Image with overlay */}
                    <div className="hidden md:block md:w-2/5 bg-black relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 to-black/80 z-10"></div>
                        <img
                            src="https://kidsactivitiesblog.com/wp-content/uploads/2013/02/Good-Friend.png"
                            alt="Hệ Thống Quản Lý Mầm Non TinyCare"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between z-20 p-8">
                            <div className="mb-auto">
                                <div className="flex items-center">
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <FaSchool className="text-amber-300 text-2xl" />
                                    </div>
                                    <h1 className="text-white font-bold ml-2 text-xl">Hệ Thống Quản Lý Mầm Non TinyCare</h1>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Nuôi dưỡng tương lai, vun đắp ước mơ</h2>
                                <p className="text-amber-200 mb-6">Hệ thống giáo dục mầm non chất lượng cao</p>
                                <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                                    <p className="text-white/80 text-sm">
                                        Chọn vai trò để tiếp tục đăng nhập hoặc tạo tài khoản mới. Thông tin của bạn sẽ được bảo mật và sử dụng theo các quy định của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Role selection */}
                    <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto max-h-[700px]">
                        <div className="text-center mb-12">
                            <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
                                <FaSchool className="text-amber-600 text-3xl" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Chào mừng đến với Hệ Thống Quản Lý Mầm Non</h2>
                            <h2 className="text-xl font-bold text-gray-800">TinyCare</h2>

                            <p className="text-gray-600 mt-2">Vui lòng chọn vai trò của bạn để tiếp tục</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {availableRoles.map((role) => (
                                <motion.div
                                    key={role}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSelectRole(role)}
                                    className="group bg-white border border-amber-200 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:border-transparent rounded-xl p-6 shadow-md hover:shadow-lg cursor-pointer transition-all"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-amber-50 group-hover:bg-white/20 p-4 rounded-full mb-4 transition-colors">{getRoleIcon(role)}</div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white">{role}</h3>
                                        <p className="text-gray-500 text-sm mt-2 group-hover:text-white/80">
                                            {role === "Cán Bộ" && "Dành cho nhân viên, giáo viên, quản lý của trường"}
                                            {role === "Phụ Huynh" && "Dành cho phụ huynh có con theo học tại trường"}
                                            {role === "Trường Học" && "Dành cho quản trị viên cấp trường"}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-gray-500 text-sm">
                                Bạn đã có tài khoản? Vui lòng chọn vai trò để đăng nhập.
                                <br />
                                Nếu bạn không chắc chắn, vui lòng liên hệ quản trị viên.
                            </p>
                            <div className="mt-4 flex justify-center space-x-4">
                                <span className="text-xs text-gray-400">© 2023 Hệ Thống Quản Lý Mầm Non TinyCare</span>
                                <span className="text-xs text-amber-500 hover:underline cursor-pointer">Chính sách bảo mật</span>
                                <span className="text-xs text-amber-500 hover:underline cursor-pointer">Điều khoản sử dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleSelection;
