import React, { Children, ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./popup.scss";
import { CloseCircleOutline } from "react-ionicons";
import { Box, Typography } from "@mui/material";
export type Props = {
    title: string;
    showPopup: boolean;
    onClose: (e: boolean) => void;
    children?: ReactNode;
};
export default function PopupComponent(props: Props) {
    const { title, showPopup, onClose, children } = props;
    const [show, setShow] = useState<boolean>(false);
    function closeHandle() {
        setShow(false);
        onClose(false);
    }

    useEffect(() => {
        setShow(showPopup);
    }, []);
    return (
        <Box
            sx={{
                visibility: showPopup ? "visible" : "hidden",
                opacity: showPopup ? "1" : "0",
                position: "fixed",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                background: "rgba(0, 0, 0, 0.7)",
                transition: "opacity 150ms",
            }}
        >
            <Box
                sx={{
                    margin: "90px auto",
                    backgroundColor: "#2a2185",
                    borderRadius: "5px",
                    width: "30%",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        right: "15px",
                        transition: "all 200ms",
                        fontSize: "30px",
                        "&:hover": {
                            cursor: "pointer",
                            color: "#000",
                        },
                    }}
                    onClick={closeHandle}
                >
                    <CloseCircleOutline color={"#fff"}></CloseCircleOutline>
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        height: "50px",
                        textAlign: "center",
                        paddingTop: "25px",
                        color: "#fff",
                    }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        maxHeight: "30%",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
