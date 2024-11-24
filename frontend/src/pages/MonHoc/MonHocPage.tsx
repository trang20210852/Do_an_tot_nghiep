import { useEffect, useState } from "react";
import { getAllMonHoc, MonHoc } from "../../services/apiMonHoc";
import { AddCircleOutline } from "react-ionicons";
import PopupComponent from "../../components/popup/PopupComponent";
import Loader from "../../components/loader/Loader";
import PopupAdd from "./PopupAdd/PopupAdd"; // Giả định rằng bạn có một component PopupAddMonHoc cho form thêm môn học
import "./monhocpage.scss";

export default function MonHocPage() {
    const [data, setData] = useState<MonHoc[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<boolean>(false);

    const popupCloseHandler = (e: boolean) => {
        setVisibility(false);
    };

    async function getList() {
        try {
            const response = await getAllMonHoc();
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
        <div className="monhocpage">
            <div className="table">
                <h1 className="title">Danh sách môn học</h1>
                <div className="addProductActive">
                    <AddCircleOutline color={"#2a2185"} width={"20px"} height={"20px"} onClick={() => setVisibility(!visibility)} />
                    <span onClick={() => setVisibility(!visibility)}> Thêm Môn Học</span>
                </div>

                <PopupComponent title="Thêm môn học" showPopup={visibility} onClose={popupCloseHandler}>
                    <PopupAdd />
                </PopupComponent>

                <tr className="headerTable">
                    <th style={{ width: "40px" }}>ID</th>
                    <th>Tên môn học</th>
                    <th>Nội dung môn học</th>
                </tr>

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {data.map((monHoc) => (
                            <tr key={monHoc.id} className="itemTable">
                                <td style={{ width: "40px" }}>{monHoc.id}</td>
                                <td>{monHoc.tenMonHoc}</td>
                                <td>{monHoc.noiDungMonHoc}</td>
                            </tr>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
