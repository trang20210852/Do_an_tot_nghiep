import axios from "axios";
import { baseURL } from "../baseURL";

// Lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem("token");
};

// Duyệt trường
export const approveTruongHoc = async (idTruong: number) => {
    const token = getAuthToken();
    const response = await axios.put(
        `${baseURL}/truonghoc/${idTruong}/approve`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Ban trường
export const banTruongHoc = async (idTruong: number) => {
    const token = getAuthToken();
    const response = await axios.put(
        `${baseURL}/truonghoc/${idTruong}/ban`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const getDanhSachTruong = async () => {
    try {
        const response = await axios.get(`${baseURL}/truonghoc/danhsachtruonghoc`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách trường:", error);
        return [];
    }
};

//Lấy danh sách nhân viên chính thức của trường theo ID
export const getApprovedNhanVien = async (idTruong: string) => {
    try {
        const response = await axios.get(`${baseURL}/truonghoc/${idTruong}/approved`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên chính thức:", error);
        return [];
    }
};

// Lấy danh sách nhân viên chờ duyệt của trường theo ID
export const getPendingNhanVien = async (idTruong: string) => {
    try {
        const response = await axios.get(`${baseURL}/truonghoc/${idTruong}/pending`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên chờ duyệt:", error);
        return [];
    }
};

export const approveNhanVien = async (idTruong: string, danhSachCanBo: string[], duyet: boolean) => {
    try {
        const response = await axios.put(`${baseURL}/truonghoc/${idTruong}/approve-canbo`, {
            danhSachCanBo,
            duyet,
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi duyệt nhân viên:", error);
        throw error;
    }
};

export const getThongTinCanBo = async (idTruong: string, idNhanVien: string) => {
    try {
        const response = await axios.get(`${baseURL}/truonghoc/${idTruong}/canbo/${idNhanVien}`);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi lấy thông tin cán bộ:", error);
        if (error.response) {
            console.error("Phản hồi từ server:", error.response.data);
        } else if (error.request) {
            console.error("Không nhận được phản hồi từ server:", error.request);
        } else {
            console.error("Lỗi khi cấu hình request:", error.message);
        }
        throw error;
    }
};

export const deleteStaff = async (idTruong: string, idNhanVien: string) => {
    const response = await fetch(`${baseURL}/truonghoc/${idTruong}/canbo/${idNhanVien}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Không thể xóa nhân viên");
    }

    return response.json();
};

export const updateChucVuPhongBan = async (idTruong: string, idNhanVien: string, data: { chucVu: string; phongBan: string }) => {
    try {
        const response = await axios.put(`${baseURL}/truonghoc/${idTruong}/canbo/${idNhanVien}/update-role`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật chức vụ và phòng ban:", error);
        throw error;
    }
};

export const getThongTinTruongHoc = async (idTruong: string) => {
    const response = await axios.get(`${baseURL}/truonghoc/${idTruong}/thongtin`);
    return response.data;
};

export const updateThongTinTruongHoc = async (data: any) => {
    const response = await axios.put(`${baseURL}/truonghoc/${data.IDTruong}/update`, data);
    return response.data;
};

export const searchTruongHoc = async (diaChi: string) => {
    try {
        const response = await axios.get(`${baseURL}/truonghoc/search`, {
            params: { diaChi }, // Chỉ gửi `diaChi`
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm trường học:", error);
        throw error;
    }
};

export const updateAvatar = async (idTruong: number, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put(`${baseURL}/truonghoc/${idTruong}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const updateBackground = async (idTruong: number, file: File) => {
    const formData = new FormData();
    formData.append("background", file);

    const response = await axios.put(`${baseURL}/truonghoc/${idTruong}/background`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
