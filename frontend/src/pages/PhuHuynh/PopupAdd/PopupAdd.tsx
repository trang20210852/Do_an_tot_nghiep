import React, { useEffect, useState } from "react";
import "./popup.scss";
import { toast } from "react-toastify";

import { Box, Button, InputBase, Typography } from "@mui/material";
import { PhuHuynh, postAddPhuHuynh, TNewPhuHuynh } from "../../../services/apiPhuHuynh";

type Props = {
    data?: PhuHuynh;
};

export default function PopupAdd(props: Props) {
    const { data } = props;
    const [phuHuynh, setPhuHuynh] = useState<TNewPhuHuynh>({
        hoTen: data?.hoTen || "",
        soDienThoai: data?.soDienThoai || "",
        email: data?.email || "",
        diaChi: data?.diaChi || "",
        matKhau: data?.matKhau || "",
        idHocSinh: data?.idHocSinh || null,
    });

    function handleChangePhuHuynh(key: keyof TNewPhuHuynh, value: string | number | null) {
        setPhuHuynh((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmitPhuHuynh() {
        try {
            const response = await postAddPhuHuynh(phuHuynh);
            data ? toast.success("Edit parent information succeeded!") : toast.success("Add parent succeeded!");
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error((error as Error).message);
        }
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                margin: "10px auto",
                borderRadius: "5px",
                backgroundColor: "#ddddf3",
                fontSize: "20px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: "330px",
                    margin: "auto",
                    textAlign: "left",
                }}
            >
                {["Họ Tên", "Số Điện Thoại", "Email", "Địa Chỉ", "Mật Khẩu"].map((field) => (
                    <Typography
                        variant="body1"
                        sx={{
                            margin: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                        key={field}
                    >
                        {field.charAt(0).toUpperCase() + field.slice(1)} :
                        <InputBase
                            type="text"
                            value={(phuHuynh as any)[field]}
                            onChange={(e) => handleChangePhuHuynh(field as keyof TNewPhuHuynh, e.target.value)}
                            sx={{
                                backgroundColor: "#fff",
                                color: "#2a2185",
                                borderRadius: "5px",
                            }}
                        ></InputBase>
                    </Typography>
                ))}

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    ID Học Sinh :
                    <InputBase
                        type="number"
                        value={phuHuynh.idHocSinh || ""}
                        onChange={(e) => handleChangePhuHuynh("idHocSinh", Number(e.target.value))}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    ></InputBase>
                </Typography>
            </Box>
            <Button
                onClick={handleSubmitPhuHuynh}
                style={{
                    backgroundColor: "#2a2185",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "5px",
                    borderRadius: "5px",
                }}
            >
                Tạo
            </Button>
        </Box>
    );
}
