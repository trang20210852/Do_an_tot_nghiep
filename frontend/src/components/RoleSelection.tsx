interface RoleSelectionProps {
    onSelectRole: (role: string) => void;
    availableRoles: string[];
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, availableRoles }) => {
    return (
        <div className="flex justify-center  items-center min-h-screen bg-[#f8f1e8] bg-orange-50">
            <div className="flex max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden max-h-[650px] ">
                {/* Cột hình ảnh */}
                <div className="hidden md:block w-1/2 relative">
                    <img src="https://kidsactivitiesblog.com/wp-content/uploads/2013/02/Good-Friend.png" alt="Login Background" className="h-full w-full" />
                </div>

                {/* Cột chọn vai trò */}
                <div className="w-1/2 p-12 flex flex-col justify-center bg-[#fff7eb] max-h-[650px]">
                    <h2 className="text-2xl text-center font-bold mb-4">BẠN LÀ AI?</h2>
                    <h3 className="text-center mb-5 mt-5">Chào mừng đến với hệ thống quản lí Mầm Non Xanh</h3>
                    <div className="flex space-x-4 text-center justify-center mb-5 mt-5">
                        {availableRoles.map((role) => (
                            <button key={role} onClick={() => onSelectRole(role)} className="px-6 py-2 bg-black text-white rounded">
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
