import axios from "axios";

const baseURL = "http://localhost:3000/api";

export interface MoMoPaymentRequest {
    hoaDonId: number;
    amount: number;
    orderInfo: string;
    returnUrl: string;
    notifyUrl: string;
}

export interface HocPhi {
    IDHocPhi: number;
    IDHocSinh: number;
    tenHocSinh: string;
    thang: number;
    nam: number;
    soTien: number;
    trangThai: string;
    hanCuoi: string;
    ghiChu?: string;
}

export interface TuitionBillRequest {
    idTruong: string;
    thang: number;
    nam: number;
    hanCuoi: string;
    ghiChu?: string;
}

export interface NotificationRequest {
    idTruong: string;
    thang: number;
    nam: number;
    notificationType: "email" | "system" | "all";
}

// Gửi yêu cầu tạo học phí cho học sinh
export const createTuitionForStudent = async (tuitionData: { IDHocSinh: number; thang: number; nam: number; soTien: number; hanCuoi: string; ghiChu?: string }) => {
    try {
        const response = await axios.post(`${baseURL}/payment/tuition/create`, tuitionData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo học phí:", error.response?.data || error.message);
        throw error;
    }
};

// export const getUnpaidTuitionByParent = async (idPhuHuynh: number) => {
//     try {
//         const response = await axios.get(`${baseURL}/payment/tuition/unpaid/${idPhuHuynh}`);
//         return response.data;
//     } catch (error: any) {
//         console.error("Lỗi khi lấy danh sách học phí chưa thanh toán:", error.response?.data || error.message);
//         throw error;
//     }
// };
export const getUnpaidTuitionByParent = async (idHocSinh: number) => {
    try {
        const response = await axios.get(`${baseURL}/payment/tuition/unpaid/${idHocSinh}`, { headers: {} });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách học phí chưa thanh toán:", error.response?.data || error.message);
        throw error;
    }
};

export const getPaidTuitionByParent = async (idHocSinh: number) => {
    try {
        const res = await axios.get(`${baseURL}/payment/tuition/paid/${idHocSinh}`);
        return res.data;
    } catch (error) {
        return { success: false, data: [], error };
    }
};

// export const getUnpaidTuitionByParent = async (parentId: number) => {
//     const response = await axios.get(`/api/payment/tuition/unpaid/${parentId}`);
//     return response.data;
// };

export const createMoMoPayment = async (paymentRequest: any) => {
    const response = await axios.post(`${baseURL}/payment/tuition/pay`, paymentRequest);
    return response.data;
};

export const checkTransactionStatus = async (orderId: string) => {
    const response = await axios.post(`${baseURL}/payment/tuition/check-status`, { orderId });
    return response.data;
};
