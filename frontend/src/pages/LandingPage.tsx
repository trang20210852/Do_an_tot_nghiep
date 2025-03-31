import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Chào mừng bạn đến với Hệ thống Quản lý</h1>
            <h1 className="text-3xl font-bold mb-6">Mầm Non Xanh</h1>

            <div className="space-x-4">
                <Link to="/login" className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                    Đăng nhập
                </Link>
                <Link to="/register" className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                    Đăng ký
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
