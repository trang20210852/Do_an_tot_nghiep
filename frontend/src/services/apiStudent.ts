import axios from "axios";
import { baseURL } from "./baseURL";

// Lấy danh sách học sinh của trường theo ID trường
export const getDanhSachHocSinh = async (idTruong: string) => {
    try {
        const response = await axios.get(`${baseURL}/student/${idTruong}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
        return [];
    }
};

// Lấy danh sách học sinh đã duyệt của trường theo ID trường
export const getDanhSachHocSinhDuyet = async (idTruong: string) => {
    try {
        const response = await axios.get(`${baseURL}/student/${idTruong}/approved`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh đã duyệt:", error);
        return [];
    }
};

// Lấy danh sách học sinh chưa duyệt của trường theo ID trường
export const getDanhSachHocSinhChuaDuyet = async (idTruong: string) => {
    try {
        const response = await axios.get(`${baseURL}/student/${idTruong}/pending`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh chưa duyệt:", error);
        return [];
    }
};

// Duyệt hoặc từ chối danh sách học sinh
export const approveHocSinh = async (idTruong: string, danhSachHocSinh: string[], duyet: boolean) => {
    try {
        const response = await axios.put(`${baseURL}/student/${idTruong}/approve`, {
            danhSachHocSinh,
            duyet,
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi duyệt học sinh:", error);
        throw error;
    }
};

// Lấy thông tin chi tiết học sinh
export const getThongTinHocSinh = async (idTruong: string, idHocSinh: string) => {
    try {
        const response = await axios.get(`${baseURL}/student/${idTruong}/${idHocSinh}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin học sinh:", error);
        throw error;
    }
};

// Cập nhật thông tin học sinh
export const updateThongTinHocSinh = async (idTruong: string, idHocSinh: string, data: any) => {
    try {
        const response = await axios.put(`${baseURL}/student/${idTruong}/${idHocSinh}`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin học sinh:", error);
        throw error;
    }
};

export const updateHocSinh = async (idHocSinh: number, data: any) => {
    const res = await axios.put(`${baseURL}/student/update/${idHocSinh}`, data);
    return res.data;
};

export const deleteHocSinh = async (idHocSinh: string, status: string) => {
    try {
        const response = await axios.put(`${baseURL}/student/status/${idHocSinh}`, {
            status: status, // viết thường!
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xoá học sinh:", error);
        throw error;
    }
};
export const getHocSinhDetail = async (idTruong: number, idHocSinh: number) => {
    const response = await axios.get(`${baseURL}/student/${idTruong}/${idHocSinh}`);
    return response.data.hocSinh[0];
};

// Lấy danh sách học sinh theo phụ huynh
export const getHocSinhByPhuHuynh = async (token: string) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/listStudentOfParent`,
            {}, // Body rỗng vì API không yêu cầu dữ liệu trong body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh theo phụ huynh:", error);
        throw error;
    }
};

// Thêm học sinh mới
export const themHocSinh = async (token: string, data: any) => {
    const response = await axios.post(`${baseURL}/student/them-hocsinh`, data, {
        headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
    });
    return response.data;
};

// Lấy thông tin chi tiết học sinh
export const getThongTinHocSinhByPhuHuynh = async (token: string, idHocSinh: number) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/parent/${idHocSinh}`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết học sinh:", error);
        throw error;
    }
};

// Xóa học sinh bởi phụ huynh
export const deleteHocSinhByPhuHuynh = async (token: string, idHocSinh: number) => {
    try {
        const response = await axios.delete(`${baseURL}/student/delete/${idHocSinh}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa học sinh:", error);
        throw error;
    }
};

export const getDonNghiHocByHocSinh = async (token: string, idHocSinh: number) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/${idHocSinh}/donnghihoc`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn xin nghỉ:", error);
        throw error;
    }
};

export const createDonNghiHoc = async (token: string, data: { IDHocSinh: number; ngayBatDau: string; ngayKetThuc: string; lyDo: string }) => {
    try {
        const response = await axios.post(`${baseURL}/student/createDonXinNghi`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn xin nghỉ:", error);
        throw error;
    }
};

// Tạo đơn chuyển trường

// export const createDonChuyenTruong = async (token: string, formData: FormData) => {
//     const response = await axios.post(`${baseURL}/createDonChuyenTruong`, formData, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//         },
//     });
//     return response.data;
// };

// API: Lấy danh sách đơn chuyển trường theo ID phụ huynh
export const getDonChuyenTruongByPhuHuynh = async (token: string) => {
    try {
        const response = await axios.get(`${baseURL}/student/listDonChuyenTruong`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("[ERROR] Lỗi khi gọi API getDonChuyenTruongByPhuHuynh:", error);
        throw error;
    }
};

// API: Tạo đơn chuyển trường
export const createDonChuyenTruong = async (token: string, formData: FormData) => {
    try {
        const response = await axios.post(`${baseURL}/student/createDonChuyenTruong`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("[ERROR] Lỗi khi gọi API createDonChuyenTruong:", error);
        throw error;
    }
};

// Lấy danh sách đơn chuyển trường theo con của phụ huynh
export const getDonChuyenTruongByCon = async (token: string, IDHocSinh: number) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/${IDHocSinh}/donchuyentruongbycon`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn chuyển trường:", error);
        throw error;
    }
};
// Lấy danh sách lịch sử chuyển trường của học sinh
// export const getLichSuChuyenTruong = async (token: string, IDHocSinh: number) => {
//     try {
//         const response = await axios.post(
//             `${baseURL}/student/${IDHocSinh}/getListDonChuyenTruong`,
//             {}, // Body rỗng
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi lấy lịch sử chuyển trường:", error);
//         throw error;
//     }
// };

// Lấy danh sách đơn chuyển trường
export const getDanhSachDonChuyenTruong = async (idTruong: string, isCurrentSchool: boolean) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${baseURL}/student/${idTruong}/donChuyenTruong?isCurrentSchool=${isCurrentSchool}`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo token được gửi đúng
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn chuyển trường:", error);
        throw error;
    }
};

// // Duyệt hoặc từ chối đơn chuyển trường
// export const approveChuyenTruong = async (idDon: string, trangThai: string, isCurrentSchool: boolean) => {
//     try {
//         const token = localStorage.getItem("token");
//         const response = await axios.put(
//             `${baseURL}/student/donChuyenTruong/${idDon}`,
//             { trangThai, isCurrentSchool },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi duyệt đơn chuyển trường:", error);
//         throw error;
//     }
// };

// Lấy danh sách điểm danh của học sinh
export const getDiemDanhByHocSinh = async (token: string, IDHocSinh: number) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/${IDHocSinh}/diemdanh`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo token được gửi đúng
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách điểm danh:", error);
        throw error;
    }
};

// Lấy danh sách nhận xét của giáo viên về học sinh
export const getNhanXetByHocSinh = async (token: string, IDHocSinh: number) => {
    try {
        const response = await axios.post(
            `${baseURL}/student/${IDHocSinh}/nhanxet`,
            {}, // Body rỗng
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhận xét của giáo viên:", error);
        throw error;
    }
};

// // Cập nhật thông tin nhập học của học sinh
// export const updateNhapHoc = async (token: string, data: { IDHocSinh: number; IDTruong: string }) => {
//     try {
//         const response = await axios.put(`${baseURL}/student/nhap-hoc`, data, {
//             headers: {
//                 Authorization: `Bearer ${token}`, // Gửi token để xác thực
//             },
//         });
//         return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//         console.error("Lỗi khi cập nhật thông tin nhập học:", error);
//         throw error; // Ném lỗi để xử lý ở nơi gọi hàm
//     }
// };

export const updateNhapHoc = async (token: string, data: { IDHocSinh: number; IDTruong: string | null }) => {
    try {
        const response = await axios.put(`${baseURL}/student/nhap-hoc`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token để xác thực
            },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin nhập học:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const updateAvatarHocSinh = async (idHocSinh: number, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.put(`${baseURL}/student/${idHocSinh}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
