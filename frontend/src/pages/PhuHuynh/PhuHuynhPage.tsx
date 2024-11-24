import { getAllPhuHuynh, PhuHuynh } from "../../services/apiPhuHuynh";
import { AddCircleOutline } from "react-ionicons";
import PopupComponent from "../../components/popup/PopupComponent";
import Loader from "../../components/loader/Loader";
import PopupAdd from "./PopupAdd/PopupAdd";
import "./phuhuynhpage.scss";
import { useEffect, useState } from "react";

export default function PhuHuynhPage() {
    const [data, setData] = useState<PhuHuynh[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<boolean>(false);

    const popupCloseHandler = (e: boolean) => {
        setVisibility(false);
    };

    async function getList() {
        try {
            const response = await getAllPhuHuynh();
            setData(response);
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getList();
    }, []);

    return (
        <div className="phuhuynhpage">
            <div className="table">
                <h1 className="title">Danh sách phụ huynh</h1>
                <div className="addProductActive">
                    <AddCircleOutline color={"#2a2185"} width={"20px"} height={"20px"} onClick={() => setVisibility(!visibility)} />
                    <span onClick={(e) => setVisibility(!visibility)}> Thêm Phụ Huynh</span>
                </div>

                <PopupComponent title="Thêm phụ huynh" showPopup={visibility} onClose={popupCloseHandler}>
                    <PopupAdd />
                </PopupComponent>

                <tr className="headerTable">
                    <th style={{ width: "40px" }}>ID</th>
                    <th>Họ tên</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>ID Học sinh</th>
                </tr>

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {data.map((phuHuynh, index) => {
                            return (
                                <tr key={phuHuynh.id} className="itemTable">
                                    <td style={{ width: "40px" }}>{phuHuynh.id}</td>
                                    <td>{phuHuynh.hoTen}</td>
                                    <td>{phuHuynh.diaChi}</td>
                                    <td>{phuHuynh.soDienThoai}</td>
                                    <td>{phuHuynh.email}</td>
                                    <td>{phuHuynh.idHocSinh}</td>
                                </tr>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
