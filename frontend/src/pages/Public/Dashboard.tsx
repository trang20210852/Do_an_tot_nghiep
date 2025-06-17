import { logout } from "../../services/apiAuth";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Chào mừng đến với Dashboard</h1>
            <button onClick={logout} className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                Đăng xuất
            </button>
        </div>
    );
};

export default Dashboard;
