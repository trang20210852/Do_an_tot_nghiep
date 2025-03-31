import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        school: false,
        staff: false,
    });

    const location = useLocation();

    // Hàm toggle mở rộng/collapse danh mục
    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <aside className="w-[300px] min-h-screen p-4 bg-[#0b1e42] text-white">
            <h2 className="text-lg font-semibold mb-4">Xin Chào </h2>
            <nav>
                <ul className="space-y-2">
                    {/* Trường Học */}
                    <li>
                        <button className="w-full text-left py-2 px-3 flex justify-between items-center bg-yellow-500 hover:bg-gray-700 rounded-md" onClick={() => toggleSection("school")}>
                            🏫 Trường Học
                            <span>{openSections.school ? "▲" : "▼"}</span>
                        </button>
                        {openSections.school && (
                            <ul className="ml-4 space-y-1">
                                <li>
                                    <Link to="/dashboard" className={`block py-2 px-3 rounded-md ${location.pathname === "/dashboard" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}>
                                        📊 Trang Chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/staff" className={`block py-2 px-3 rounded-md ${location.pathname === "/dashboard/staff" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}>
                                        📚 Cán Bộ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/add-branch"
                                        className={`block py-2 px-3 rounded-md ${location.pathname === "/dashboard/add-branch" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}
                                    >
                                        👨‍🏫 Học Sinh
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/dashboard/classes"
                                        className={`block py-2 px-3 rounded-md ${location.pathname === "/dashboard/classes" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}
                                    >
                                        ⏳ Lớp
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard/truong/:idTruong/profile"
                                        className={`block py-2 px-3 rounded-md ${location.pathname === "/truong/:idTruong/profile" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}
                                    >
                                        🏫 Hồ Sơ Trường
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Cán Bộ */}
                    <li>
                        <button className="w-full text-left py-2 px-3 flex justify-between items-center bg-yellow-500 hover:bg-gray-700 rounded-md" onClick={() => toggleSection("staff")}>
                            👨‍🏫 Cán Bộ
                            <span>{openSections.staff ? "▲" : "▼"}</span>
                        </button>
                        {openSections.staff && (
                            <ul className="ml-4 space-y-1">
                                <li>
                                    <Link
                                        to="/staff-management"
                                        className={`block py-2 px-3 rounded-md ${location.pathname === "/staff-management" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}
                                    >
                                        📋 Quản Lý Cán Bộ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/staff-attendance"
                                        className={`block py-2 px-3 rounded-md ${location.pathname === "/staff-attendance" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}
                                    >
                                        ⏳ Chấm Công
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/staff-salary" className={`block py-2 px-3 rounded-md ${location.pathname === "/staff-salary" ? "bg-yellow-500 text-black" : "hover:bg-gray-700"}`}>
                                        💰 Lương
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
