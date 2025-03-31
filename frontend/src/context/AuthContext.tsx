import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
    idTruong: number | null;
    setIdTruong: (id: number) => void;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider để bọc ứng dụng và cung cấp context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [idTruong, setIdTruong] = useState<number | null>(null);

    // Lấy idTruong từ localStorage khi app load
    useEffect(() => {
        const storedIdTruong = localStorage.getItem("idTruong");
        console.log("Lấy idTruong từ localStorage:", storedIdTruong);
        if (storedIdTruong) {
            setIdTruong(Number(storedIdTruong));
        }
    }, []);

    return <AuthContext.Provider value={{ idTruong, setIdTruong }}>{children}</AuthContext.Provider>;
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
    }
    return context;
};
