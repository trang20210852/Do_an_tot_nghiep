import React from "react";
import "./header.scss";
import { MenuOutline, NotificationsOutline, SearchOutline } from "react-ionicons";
type Props = {
    toggle: () => void;
    activeMenu: boolean;
};
export default function Header(props: Props) {
    const { toggle, activeMenu } = props;
    return (
        <div className="headerContainer">
            <div>
                <div className={`toggle ${activeMenu ? "activeMenu" : ""}`} style={{ cursor: "pointer" }} onClick={toggle}>
                    <MenuOutline width="30px" height="40px" style={{ opacity: "0%" }} />
                </div>
            </div>

            <div className="search">
                <SearchOutline color={"#2a2185"} width="20px" height="20px" style={{ transform: "translate(25px,3px)" }} />
                <input
                    type="text"
                    placeholder="     Search here"
                    style={{
                        fontSize: "15px",
                        padding: "5px",
                        borderColor: "#2a2185",

                        borderRadius: "20px",
                    }}
                ></input>
            </div>
            <div className="user">
                <NotificationsOutline color={"#2a2185"} title={"Thông báo"} height="35px" width="35px" />
                <img src="./src/assets/avatar.jpg" style={{ width: "40px", borderRadius: "100px" }}></img>
            </div>
        </div>
    );
}
