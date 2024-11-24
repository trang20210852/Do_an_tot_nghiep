import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export default function Layout() {
    const [activeSidebar, setActiveSidebar] = useState<boolean>(false);

    useEffect(() => {
        let sidebar = document.querySelector(".sidebarContainer");
        console.log(sidebar);
        let button = document.querySelector(".toggle");
        console.log(button);
        if (button) {
            button.addEventListener("click", () => {
                if (sidebar) {
                    // console.log(sidebar.attributes);

                    sidebar.classList.toggle("active");
                    console.log(sidebar.attributes.item(1));
                }
            });
        }
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "fixed" }}>
                <Sidebar active={activeSidebar} />
            </div>
            <div style={{ marginLeft: activeSidebar ? "60px" : "210px" }}>
                <Header
                    toggle={() => {
                        setActiveSidebar((prev) => {
                            return !prev;
                        });
                    }}
                    activeMenu={activeSidebar}
                />
                <Outlet />
            </div>
        </div>
    );
}
