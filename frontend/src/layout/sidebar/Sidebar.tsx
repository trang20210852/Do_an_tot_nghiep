import React from "react";
import {
    ApertureOutline,
    CalendarClearOutline,
    CalendarOutline,
    ChatbubbleOutline,
    CheckmarkOutline,
    DocumentsOutline,
    EyedropOutline,
    HelpOutline,
    HomeOutline,
    LibraryOutline,
    LogoApple,
    LogOutOutline,
    MedkitOutline,
    NewspaperOutline,
    PeopleOutline,
    SettingsOutline,
} from "react-ionicons";

import "./sidebar.scss";
import MenuItem from "./MenuItem/MenuItem";
export default function Sidebar({ active }: { active: boolean }) {
    return (
        <div className={`sidebarContainer ${active ? "active" : ""}`}>
            <div style={{ marginTop: " 0px", marginBottom: "40px" }}>
                <MenuItem linkPage="#" icon={ApertureOutline} name="Quản lí trường mẫu giáo" />
            </div>
            <div style={{ width: "120px", margin: "auto" }}>
                <MenuItem linkPage="/trangchu" icon={HomeOutline} name="Trang chủ" />
                <MenuItem linkPage="/nhanvien" icon={PeopleOutline} name="Nhân viên" />
                <MenuItem linkPage="/hocsinh" icon={PeopleOutline} name="Học sinh" />
                <MenuItem linkPage="/phuhuynh" icon={PeopleOutline} name="Phụ huynh" />
                <MenuItem linkPage="/phongban" icon={MedkitOutline} name="Phòng ban" />

                <MenuItem linkPage="/monhoc" icon={LibraryOutline} name="Môn học" />
                <MenuItem linkPage="/lichhoc" icon={CalendarClearOutline} name="Lịch học" />

                <MenuItem linkPage="/baocao" icon={DocumentsOutline} name="Báo cáo" />

                <MenuItem linkPage="/thongbao" icon={ChatbubbleOutline} name="Thông báo" />
                <MenuItem linkPage="/chamcong" icon={CheckmarkOutline} name="Chấm công" />
                <MenuItem linkPage="/danhgia" icon={EyedropOutline} name="Đánh giá" />

                <MenuItem linkPage="/caidat" icon={SettingsOutline} name="Cài đặt" />
            </div>
        </div>
    );
}
