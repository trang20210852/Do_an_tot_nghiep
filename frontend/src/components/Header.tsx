import React from "react";

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md flex justify-between items-center p-4">
            <div className="text-lg font-bold">Mầm Non Xanh</div>
            <div className="flex items-center gap-4">
                <span className="text-yellow-500 font-semibold"></span>
                <button className="text-blue-600 font-semibold"></button>
                <div className="flex items-center gap-2">
                    <span>Hiệu Trưởng</span>
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
