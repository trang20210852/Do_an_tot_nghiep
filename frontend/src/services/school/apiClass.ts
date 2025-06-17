import axios from "axios";
import { baseURL } from "../baseURL";

const API_URL = "http://localhost:3000/api/class";

export const getClasses = async (idTruong: number) => {
    const res = await axios.get(`${API_URL}/list?idTruong=${idTruong}`);
    return res.data;
};

export const createClass = async (classData: any) => {
    const res = await axios.post(`${API_URL}/create`, classData);
    return res.data;
};

export const getClassDetail = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Lấy chi tiết lớp học
export const getLopHocDetail = async (idLopHoc: number) => {
    const response = await axios.get(`${baseURL}/class/${idLopHoc}`);
    return response.data;
};

// Phân giáo viên chủ nhiệm
export const assignGiaoVien = async (idLopHoc: number, idGiaoVien: number) => {
    const response = await axios.put(`${baseURL}/class/assign-giao-vien`, {
        IDLopHoc: idLopHoc,
        IDGiaoVien: idGiaoVien,
    });
    return response.data;
};

// Chia học sinh vào lớp
export const assignHocSinhToLop = async (danhSachHocSinh: number[], idLopHoc: number) => {
    const response = await axios.put(`${baseURL}/class/assign-lop`, {
        danhSachHocSinh,
        IDLopHoc: idLopHoc,
    });
    return response.data;
};

export const createZaloGroup = async (idLopHoc: number, linkZaloGroup: string) => {
    const response = await axios.post(`${baseURL}/class/${idLopHoc}/zalo-group`, { linkZaloGroup });
    return response.data;
};
// Xóa lớp học
export const deleteClass = async (idLopHoc: number) => {
    const response = await axios.delete(`${API_URL}/${idLopHoc}`);
    return response.data;
};
