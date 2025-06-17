import axios from "axios";

const API_URL = "http://localhost:3000/api/room";

// Lấy danh sách phòng học theo trường
export const getRooms = async (idTruong: number) => {
    const res = await axios.get(`${API_URL}/${idTruong}`);
    return res.data;
};

// Thêm phòng học mới
export const createRoom = async (roomData: any) => {
    const res = await axios.post(`${API_URL}/create`, roomData);
    return res.data;
};

// Lấy thông tin chi tiết phòng học
export const getRoomDetail = async (idPhongHoc: number) => {
    const res = await axios.get(`${API_URL}/detail/${idPhongHoc}`);
    return res.data;
};

// Cập nhật thông tin phòng học
export const updateRoom = async (idPhongHoc: number, roomData: any) => {
    const res = await axios.put(`${API_URL}/update/${idPhongHoc}`, roomData);
    return res.data;
};

// Xóa phòng học
export const deleteRoom = async (idPhongHoc: number) => {
    const res = await axios.delete(`${API_URL}/${idPhongHoc}`);
    return res.data;
};
