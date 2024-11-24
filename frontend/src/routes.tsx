import React from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./layout/Layout";
import App from "./App";
import NhanVienPage from "./pages/NhanVien/NhanVienPage";
import PhongBanPage from "./pages/PhongBan/PhongBanPage";
import TrangChuPage from "./pages/TrangChu/TrangChuPage";
import HocSinhPage from "./pages/HocSinh/HocSinhPage";
import PhuHuynhPage from "./pages/PhuHuynh/PhuHuynhPage";
import MonHocPage from "./pages/MonHoc/MonHocPage";
import CaiDatPage from "./pages/CaiDat/CaiDatPage";
import LichHocPage from "./pages/LichHoc/LichHocPage";
import BaoCaoPage from "./pages/BaoCao/BaoCaoPage";
import ThongBaoPage from "./pages/ThongBao/ThongBaoPage";
import ChamCongPage from "./pages/ChamCong/ChamCongPage";
import DanhGiaPage from "./pages/DanhGia/DanhGiaPage";

export default function RouterUrl() {
    return useRoutes([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/trangchu",
                    element: <TrangChuPage />,
                },
                {
                    path: "/phongban",
                    element: <PhongBanPage />,
                    children: [],
                },
                {
                    path: "/nhanvien",
                    element: <NhanVienPage />,
                    children: [],
                },
                {
                    path: "/hocsinh",
                    element: <HocSinhPage />,
                    children: [],
                },
                {
                    path: "/phuhuynh",
                    element: <PhuHuynhPage />,
                    children: [],
                },
                {
                    path: "/lichhoc",
                    element: <LichHocPage />,
                    children: [],
                },
                {
                    path: "/baocao",
                    element: <BaoCaoPage />,
                    children: [],
                },
                {
                    path: "/thongbao",
                    element: <ThongBaoPage />,
                    children: [],
                },
                {
                    path: "/chamcong",
                    element: <ChamCongPage />,
                    children: [],
                },
                {
                    path: "/danhgia",
                    element: <DanhGiaPage />,
                    children: [],
                },
                {
                    path: "/monhoc",
                    element: <MonHocPage />,
                    children: [],
                },

                // {
                //     path: "/help/:idObj",
                //     element: <DetailObj />,
                //     children: [],
                // },
                {
                    path: "/caidat",
                    element: <CaiDatPage />,
                    children: [],
                },
            ],
        },
    ]);
}
