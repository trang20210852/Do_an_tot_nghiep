import axios from "axios";

export const API_URL = "http://localhost:3000/api/auth";

// export const login = async (emailOrPhone: string, matKhau: string, role: string) => {
//     return await axios.post(
//         `${API_URL}/login`,
//         { emailOrPhone, matKhau, role },
//         {
//             headers: { "Content-Type": "application/json" },
//         }
//     );
// };

export const login = async (emailOrPhone: string, matKhau: string, role: string) => {
    const response = await axios.post(`${API_URL}/login`, { emailOrPhone, matKhau, role }, { headers: { "Content-Type": "application/json" } });

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("idTruong", response.data.idTruong); // key phải giống với cách bạn lấy ra sau này
    }
    return response;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idTruong"); // Xóa ID trường khi đăng xuất
    window.location.href = "/";
};

export const registerTruongHoc = async (data: any) => {
    return await axios.post(`${API_URL}/register-truong`, data);
};

export const registerCanBo = async (data: any) => {
    return await axios.post(`${API_URL}/register-canbo`, data);
};

export const registerPhuHuynh = async (data: any) => {
    return await axios.post(`${API_URL}/register-phuhuynh`, data);
};

// export const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
// };
