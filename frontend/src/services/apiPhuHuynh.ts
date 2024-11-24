import axios from "axios";
import { apiURL } from "./apiURL";

export type PhuHuynh = {
    id: number;
    hoTen: string;
    soDienThoai: string;
    email: string;
    diaChi: string;
    matKhau: string;
    idHocSinh: number;
};

export async function getAllPhuHuynh(): Promise<PhuHuynh[]> {
    const response = await axios.get(apiURL.getAllPhuHuynh);
    console.log(response);
    const data = response.data as any[];

    return data.map((item) => {
        return {
            id: item.IDPhuHuynh,
            hoTen: item.HoTen || "Unknown",
            soDienThoai: item.SoDienThoai || "N/A",
            email: item.Email || "N/A",
            diaChi: item.DiaChi || "N/A",
            matKhau: item.MatKhau || "",
            idHocSinh: item.IDHocSinh || 0,
        } as PhuHuynh;
    });
}
export type TNewPhuHuynh = {
    hoTen: string;
    soDienThoai?: string;
    email?: string;
    diaChi?: string;
    matKhau?: string;
    idHocSinh?: number | null;
};

export async function postAddPhuHuynh(dataPost: TNewPhuHuynh) {
    const response = await axios.post(apiURL.postAddPhuHuynh, {
        hoTen: dataPost.hoTen,

        soDienThoai: dataPost.soDienThoai,
        email: dataPost.email,
        diaChi: dataPost.diaChi,
        matKhau: dataPost.matKhau,
        idHocSinh: dataPost.idHocSinh,
    });

    return response;
}

// export async function putUpdatePhuHuynh(ids: string[], dataUpdate: TNewPhuHuynh) {
//     const response = await axios.put(apiURL.putUpdatePhuHuynh(ids), {
//         hoTen: dataUpdate.hoTen,
//         data: {
//             soDienThoai: dataUpdate.soDienThoai,
//             email: dataUpdate.email,
//             diaChi: dataUpdate.diaChi,
//             matKhau: dataUpdate.matKhau,
//             idHocSinh: dataUpdate.idHocSinh,
//         },
//     });

//     return response;
// }

// export async function putUpdatePhuHuynh(id: number, dataUpdate: TNewPhuHuynh) {
//     const response = await axios.put(`${apiURL.putUpdatePhuHuynh([id.toString()])}`, {
//         hoTen: dataUpdate.hoTen,
//         soDienThoai: dataUpdate.soDienThoai,
//         email: dataUpdate.email,
//         diaChi: dataUpdate.diaChi,
//         matKhau: dataUpdate.matKhau,
//         idHocSinh: dataUpdate.idHocSinh,
//     });
//     return response;
// }

// export async function deletePhuHuynh(id: number) {
//     const response = await axios.delete(`${apiURL.deletePhuHuynh([id.toString()])}`);
//     return response;
// }
