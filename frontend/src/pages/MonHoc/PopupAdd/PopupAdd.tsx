import React, { useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "./popupAdd.scss";
import { postAddHocSinh, TNewHocSinh } from "../../../services/apiHocSinh";

type Props = {
    data?: TNewHocSinh;
};

export default function PopupAdd(props: Props) {
    const { data } = props;
    const [student, setStudent] = useState<TNewHocSinh>({
        hoTen: data?.hoTen || "",
        ngaySinh: data?.ngaySinh || "",
        gioiTinh: data?.gioiTinh || "",
        idLopHoc: data?.idLopHoc || undefined,
        thongTinSucKhoe: data?.thongTinSucKhoe || "",
        tinhHinhHocTap: data?.tinhHinhHocTap || "",
    });

    function handleChangeStudent(key: keyof TNewHocSinh, value: string | number | undefined) {
        setStudent((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmitStudent() {
        try {
            const response = await postAddHocSinh(student);
            toast.success(data ? "Edit student succeeded!" : "Add student succeeded!");
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
                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Họ tên :
                    <InputBase
                        type="text"
                        value={student.hoTen}
                        onChange={(e) => {
                            handleChangeStudent("hoTen", e.target.value);
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Ngày sinh :
                    <InputBase
                        type="date"
                        value={student.ngaySinh}
                        onChange={(e) => {
                            handleChangeStudent("ngaySinh", e.target.value);
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Giới tính :
                    <InputBase
                        type="text"
                        value={student.gioiTinh}
                        onChange={(e) => {
                            handleChangeStudent("gioiTinh", e.target.value);
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Lớp học :
                    <InputBase
                        type="number"
                        value={student.idLopHoc}
                        onChange={(e) => {
                            handleChangeStudent("idLopHoc", Number(e.target.value));
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Thông tin sức khỏe :
                    <InputBase
                        type="text"
                        value={student.thongTinSucKhoe}
                        onChange={(e) => {
                            handleChangeStudent("thongTinSucKhoe", e.target.value);
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        margin: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    Tình hình học tập :
                    <InputBase
                        type="text"
                        value={student.tinhHinhHocTap}
                        onChange={(e) => {
                            handleChangeStudent("tinhHinhHocTap", e.target.value);
                        }}
                        sx={{
                            backgroundColor: "#fff",
                            color: "#2a2185",
                            borderRadius: "5px",
                        }}
                    />
                </Typography>
            </Box>

            <Button
                onClick={handleSubmitStudent}
                style={{
                    backgroundColor: "#2a2185",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "5px",
                    borderRadius: "5px",
                }}
            >
                Submit
            </Button>
        </Box>
    );
}
