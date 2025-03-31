import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-[#08183a] flex flex-col">
            {/* Header */}
            <div className="h-16 w-full">
                <Header />
            </div>

            {/* Main content */}
            <div className="flex flex-grow w-full">
                <Sidebar />
                {/* </div> */}

                {/* Nội dung chính (Outlet) */}
                <div className="w-full p-6 bg-gray-100 min-h-screen max-w-full overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
