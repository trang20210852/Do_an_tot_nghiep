import axios from "axios";
import { baseURL } from "./baseURL";

// Lấy thông tin chi tiết phụ huynh
export const getThongTinPhuHuynh = async (token: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/phuhuynh/me`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin phụ huynh:", error);
        throw error;
    }
};
export const getThongBaoPhuHuynh = async (token: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/phuhuynh/thong-bao`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông báo phụ huynh:", error);
        throw error;
    }
};

// Thêm đánh giá

export const addDanhGia = async (IDTruong: number, rating: number, comment: string) => {
    try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.post(
            `${baseURL}/phuhuynh/rate`,
            { IDTruong, rating, comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm đánh giá:", error);
        throw error;
    }
};

// Lấy danh sách đánh giá của một trường
export const getDanhGiaByTruong = async (IDTruong: number) => {
    try {
        const response = await axios.get(`${baseURL}/phuhuynh/rate/${IDTruong}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
        throw error;
    }
};

export const updateAvatarPhuHuynh = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put(`${baseURL}/phuhuynh/avatar`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const markThongBaoAsRead = async (token: string, idThongBao: number) => {
    const response = await axios.put(
        `${baseURL}/phuhuynh/${idThongBao}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getThongBaoByTrangThai = async (token: string, trangThai: string) => {
    const response = await axios.get(`${baseURL}/phuhuynh/thongbao`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { trangThai },
    });

    return response.data;
};

export const deleteThongBao = async (idThongBao: number) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    const response = await axios.delete(`${baseURL}/phuhuynh/thongbao/${idThongBao}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });

    return response.data;
};

export const updateThongTinPhuHuynh = async (token: string, data: any) => {
    const response = await axios.put(`${baseURL}/phuhuynh/update-info`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changePasswordPhuHuynh = async (token: string, oldPassword: string, newPassword: string) => {
    const response = await axios.put(`${baseURL}/phuhuynh/change-password`, { oldPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};
