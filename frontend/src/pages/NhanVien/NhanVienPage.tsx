import { useEffect, useState } from "react";

import { getAllNhanVien, NhanVien } from "../../services/apiNhanVien";
import { AddCircleOutline } from "react-ionicons";
import PopupComponent from "../../components/popup/PopupComponent";
import Loader from "../../components/loader/Loader";
import PopupAdd from "./PopupAdd/PopupAdd";
import "./nhanvienpage.scss";

export default function NhanVienPage() {
    const [data, setData] = useState<NhanVien[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<boolean>(false);

    const popupCloseHandler = (e: boolean) => {
        setVisibility(false);
    };

    async function getList() {
        try {
            const response = await getAllNhanVien();
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
        <div className="nhanvienpage">
            <div className="table">
                <h1 className="title">Danh sách nhân viên</h1>
                <div className="addProductActive">
                    <AddCircleOutline color={"#2a2185"} width={"20px"} height={"20px"} onClick={() => setVisibility(!visibility)} />
                    <span onClick={(e) => setVisibility(!visibility)}> Thêm Nhân Viên</span>
                </div>

                <PopupComponent title="Thêm nhân viên" showPopup={visibility} onClose={popupCloseHandler}>
                    <PopupAdd />
                </PopupComponent>

                <tr className="headerTable">
                    <th style={{ width: "40px" }}>ID</th>
                    <th>Họ tên</th>
                    {/* <th>Chức vụ</th> */}
                    <th>Ngày sinh</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    {/* <th>Mật khẩu</th> */}
                </tr>

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {data.map((nhanVien, index) => {
                            return (
                                <tr key={nhanVien.id} className="itemTable">
                                    <td style={{ width: "40px" }}>{nhanVien.id}</td>
                                    <td>{nhanVien.hoTen}</td>
                                    {/* <td>{nhanVien.chucVu}</td> */}
                                    <td>{nhanVien.ngaySinh}</td>
                                    <td>{nhanVien.diaChi}</td>
                                    <td>{nhanVien.soDienThoai}</td>
                                    <td>{nhanVien.email}</td>
                                    {/* <td>{nhanVien.matKhau}</td> */}
                                </tr>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
