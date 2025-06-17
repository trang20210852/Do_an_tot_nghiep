import axios from "axios";
import { baseURL } from "./baseURL";

// Lấy danh sách học sinh của một lớp do giáo viên chủ nhiệm
export const getHocSinhByLop = async (token: string, IDLopHoc: number) => {
    try {
        const response = await axios.post(`${baseURL}/giaovien/lop/${IDLopHoc}/hocsinh`, IDLopHoc, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token để xác thực
            },
        });
        return response.data; // Trả về danh sách học sinh
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Thêm nhận xét học sinh
export const addNhanXetHocSinh = async (token: string, data: { IDHocSinh: number; noiDung: string , hocTap: string, sucKhoe: string}) => {
    try {
        const response = await axios.post(`${baseURL}/giaovien/nhan-xet`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm nhận xét học sinh:", error);
        throw error;
    }
};

// Gửi thông báo tới phụ huynh
export const sendThongBao = async (token: string, data: { IDPhuHuynh: number; tieuDe: string; noiDung: string; loaiThongBao: string; mucDoUuTien: string }) => {
    try {
        const response = await axios.post(`${baseURL}/giaovien/thong-bao`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
        throw error;
    }
};

// Lấy danh sách đơn xin nghỉ học của lớp do giáo viên chủ nhiệm
export const getDonNghiHocByLop = async (token: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/giaovien/donnghihoc`, // Endpoint API
            {}, // Body rỗng vì không cần gửi dữ liệu trong body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                },
            }
        );
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn xin nghỉ học:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Duyệt đơn xin nghỉ học
export const approveDonNghiHoc = async (token: string, idDon: number, approve: boolean) => {
    try {
        const response = await axios.put(
            `${baseURL}/giaovien/donnghihoc/${idDon}`,
            { approve },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi duyệt đơn xin nghỉ học:", error);
        throw error;
    }
};

export const diemDanhHocSinh = async (token: string, data: { IDHocSinh: number; ngay: string; trangThai: string }) => {
    try {
        const response = await axios.post(`${baseURL}/giaovien/diem-danh`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi điểm danh học sinh:", error);
        throw error;
    }
};

export const getLopChuNhiem = async (token: string): Promise<any[]> => {
    try {
        const response = await axios.post(
            `${baseURL}/giaovien/lop-chu-nhiem`,
            {}, // Body rỗng vì không cần gửi dữ liệu trong body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                },
            }
        );

        if (!Array.isArray(response.data)) {
            throw new Error("Dữ liệu trả về không phải là mảng.");
        }

        return response.data; // Trả về danh sách lớp chủ nhiệm
    } catch (error) {
        console.error("Lỗi khi lấy thông tin lớp chủ nhiệm:", error);

        // Xử lý lỗi và ném lỗi để xử lý ở nơi gọi hàm
        throw error;
    }
};

export const updateAvatarCanBo = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put(`${baseURL}/giaovien/avatar`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateThongTinGiaoVien = async (token: string, data: any) => {
    const response = await axios.put(`${baseURL}/giaovien/update-info`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changePasswordGiaoVien = async (token: string, oldPassword: string, newPassword: string) => {
    const response = await axios.put(`${baseURL}/giaovien/change-password`, { oldPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};
