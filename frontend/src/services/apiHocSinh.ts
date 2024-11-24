// import axios from "axios";
// import { apiURL } from "./apiURL";

// export type HocSinh = {
//     id: number;
//     hoTen: string;
//     ngaySinh: string;
//     gioiTinh: string;
//     idLopHoc: number;
//     thongTinSucKhoe: string;
//     tinhHinhHocTap: string;
// };

// export async function getAllHocSinh(): Promise<HocSinh[]> {
//     const response = await axios.get(apiURL.getAllHocSinh);
//     console.log(response);
//     const data = response.data as any[];

//     return data.map((item) => {
//         return {
//             id: item.IDHocSinh,
//             hoTen: item.HoTen || "Unknown",
//             ngaySinh: item.NgaySinh || "",
//             gioiTinh: item.GioiTinh || "N/A",
//             idLopHoc: item.IDLopHoc || 0,
//             thongTinSucKhoe: item.ThongTinSucKhoe || "N/A",
//             tinhHinhHocTap: item.TinhHinhHocTap || "N/A",
//         } as HocSinh;
//     });
// }
// export type TNewHocSinh = {
//     hoTen: string;
//     ngaySinh?: string;
//     gioiTinh?: string;
//     idLopHoc?: number;
//     thongTinSucKhoe?: string;
//     tinhHinhHocTap?: string;
// };

// export async function postAddHocSinh(dataPost: TNewHocSinh) {
//     const response = await axios.post(apiURL.postAddHocSinh, {
//         hoTen: dataPost.hoTen,
//         ngaySinh: dataPost.ngaySinh,
//         gioiTinh: dataPost.gioiTinh,
//         idLopHoc: dataPost.idLopHoc,
//         thongTinSucKhoe: dataPost.thongTinSucKhoe,
//         tinhHinhHocTap: dataPost.tinhHinhHocTap,
//     });

//     return response;
// }

// export async function putUpdateHocSinh(ids: string[], dataUpdate: TNewHocSinh) {
//     const response = await axios.put(apiURL.putUpdateHocSinh(ids), {
//         hoTen: dataUpdate.hoTen,

//         ngaySinh: dataUpdate.ngaySinh,
//         gioiTinh: dataUpdate.gioiTinh,
//         idLopHoc: dataUpdate.idLopHoc,
//         thongTinSucKhoe: dataUpdate.thongTinSucKhoe,
//         tinhHinhHocTap: dataUpdate.tinhHinhHocTap,
//     });

//     return response;
// }

import axios from "axios";
import { apiURL } from "./apiURL";

export type HocSinh = {
    id: string;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    idLopHoc: string;
    thongTinSucKhoe: string;
    tinhHinhHocTap: string;
};

export async function getListAllHocSinh(): Promise<HocSinh[]> {
    const response = await axios.get(apiURL.getAllHocSinh);
    console.log(response);
    const data = response.data as any[];
    return data.map((item, index) => {
        return {
            id: item.IDHocSinh || "#" + index,
            hoTen: item.HoTen || "Unknown Name",
            ngaySinh: item.NgaySinh || "",
            gioiTinh: item.GioiTinh || "N/A",
            idLopHoc: item.IDLopHoc?.toString() || "0",
            thongTinSucKhoe: item.ThongTinSucKhoe || "N/A",
            tinhHinhHocTap: item.TinhHinhHocTap || "N/A",
        } as HocSinh;
    });
}

export async function getHocSinhByIDs(ids: string[]): Promise<HocSinh[]> {
    const response = await axios.get(apiURL.getListOfHocSinhByIDs(ids));
    console.log(response);
    const data = response.data as any[];
    return data.map((item, index) => {
        return {
            id: item.IDHocSinh || "#" + index,
            hoTen: item.HoTen || "Unknown Name",
            ngaySinh: item.NgaySinh || "",
            gioiTinh: item.GioiTinh || "N/A",
            idLopHoc: item.IDLopHoc?.toString() || "0",
            thongTinSucKhoe: item.ThongTinSucKhoe || "N/A",
            tinhHinhHocTap: item.TinhHinhHocTap || "N/A",
        } as HocSinh;
    });
}

export type TNewHocSinh = {
    hoTen: string;
    ngaySinh?: string;
    gioiTinh?: string;
    idLopHoc?: string;
    thongTinSucKhoe?: string;
    tinhHinhHocTap?: string;
};

export async function postAddHocSinh(dataPost: TNewHocSinh) {
    const response = await axios.post(apiURL.postAddHocSinh, {
        hoTen: dataPost.hoTen,
        data: {
            ngaySinh: dataPost.ngaySinh,
            gioiTinh: dataPost.gioiTinh,
            idLopHoc: dataPost.idLopHoc,
            thongTinSucKhoe: dataPost.thongTinSucKhoe,
            tinhHinhHocTap: dataPost.tinhHinhHocTap,
        },
    });

    return response;
}

export async function putUpdateHocSinh(ids: string[], dataUpdate: TNewHocSinh) {
    const response = await axios.put(apiURL.putUpdateHocSinh(ids), {
        hoTen: dataUpdate.hoTen,
        data: {
            ngaySinh: dataUpdate.ngaySinh,
            gioiTinh: dataUpdate.gioiTinh,
            idLopHoc: dataUpdate.idLopHoc,
            thongTinSucKhoe: dataUpdate.thongTinSucKhoe,
            tinhHinhHocTap: dataUpdate.tinhHinhHocTap,
        },
    });
    return response;
}
