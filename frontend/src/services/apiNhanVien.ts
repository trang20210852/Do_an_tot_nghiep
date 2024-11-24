import axios from "axios";
import { apiURL } from "./apiURL";

export type NhanVien = {
    id: number;
    hoTen: string;
    chucVu: number;
    ngaySinh: string;
    diaChi: string;
    soDienThoai: string;
    email: string;
    matKhau: string;
};

export async function getAllNhanVien(): Promise<NhanVien[]> {
    const response = await axios.get(apiURL.getAllNhanVien);
    console.log(response);
    const data = response.data as any[];

    return data.map((item) => {
        return {
            id: item.IDNhanVien,
            hoTen: item.HoTen || "Unknown",
            chucVu: item.ChucVu || 0,
            ngaySinh: item.NgaySinh || "",
            diaChi: item.DiaChi || "N/A",
            soDienThoai: item.SoDienThoai || "N/A",
            email: item.Email || "N/A",
            matKhau: item.MatKhau || "",
        } as NhanVien;
    });
}
