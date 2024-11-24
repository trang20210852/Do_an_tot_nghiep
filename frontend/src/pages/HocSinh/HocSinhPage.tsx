// import { useEffect, useState } from "react";
// import { getAllHocSinh, HocSinh } from "../../services/apiHocSinh";
// import { AddCircleOutline } from "react-ionicons";
// import PopupComponent from "../../components/popup/PopupComponent";
// import Loader from "../../components/loader/Loader";
// import PopupAdd from "./PopupAdd/PopupAdd";
// import "./hocsinhpage.scss";

// export default function HocSinhPage() {
//     const [data, setData] = useState<HocSinh[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [visibility, setVisibility] = useState<boolean>(false);

//     const popupCloseHandler = (e: boolean) => {
//         setVisibility(false);
//     };

//     async function getList() {
//         try {
//             const response = await getAllHocSinh();
//             setData(response);
//             console.log(response);
//             setIsLoading(false);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         setIsLoading(true);
//         getList();
//     }, []);

//     return (
//         <div className="hocsinhpage">
//             <div className="table">
//                 <h1 className="title">Danh sách học sinh</h1>
//                 <div className="addProductActive">
//                     <AddCircleOutline color={"#2a2185"} width={"20px"} height={"20px"} onClick={() => setVisibility(!visibility)} />
//                     <span onClick={(e) => setVisibility(!visibility)}> Thêm Học Sinh</span>
//                 </div>

//                 <PopupComponent title="Thêm học sinh" showPopup={visibility} onClose={popupCloseHandler}>
//                     <PopupAdd />
//                 </PopupComponent>

//                 <tr className="headerTable">
//                     <th style={{ width: "40px" }}>ID</th>
//                     <th>Họ tên</th>
//                     <th>Ngày sinh</th>
//                     <th>Giới tính</th>
//                     <th>Lớp học</th>
//                     <th>Thông tin sức khỏe</th>
//                     <th>Tình hình học tập</th>
//                 </tr>

//                 {isLoading ? (
//                     <Loader />
//                 ) : (
//                     <>
//                         {data.map((hocSinh, index) => {
//                             return (
//                                 <tr key={hocSinh.id} className="itemTable">
//                                     <td style={{ width: "40px" }}>{hocSinh.id}</td>
//                                     <td>{hocSinh.hoTen}</td>
//                                     <td>{hocSinh.ngaySinh}</td>
//                                     <td>{hocSinh.gioiTinh}</td>
//                                     <td>{hocSinh.idLopHoc}</td>
//                                     <td>{hocSinh.thongTinSucKhoe}</td>
//                                     <td>{hocSinh.tinhHinhHocTap}</td>
//                                 </tr>
//                             );
//                         })}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { AddCircleOutline } from "react-ionicons";
import PopupComponent from "../../components/popup/PopupComponent";
import Loader from "../../components/loader/Loader";
import PopupAdd from "./PopupAdd/PopupAdd";
import "./hocsinhpage.scss";
import { getListAllHocSinh, HocSinh } from "../../services/apiHocSinh";

export default function HocSinhPage() {
    const [data, setData] = useState<HocSinh[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<boolean>(false);

    const popupCloseHandler = (e: boolean) => {
        setVisibility(false);
    };

    async function getList() {
        try {
            const response = await getListAllHocSinh();
            setData(response);
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getList();
    }, []);

    return (
        <div>
            <div className="table">
                <div className="addProductActive">
                    <AddCircleOutline color={"#2a2185"} width={"20px"} height={"20px"} onClick={() => setVisibility(!visibility)} />
                    <span onClick={() => setVisibility(!visibility)}>Thêm Học Sinh</span>
                </div>

                <PopupComponent title="Thêm học sinh" showPopup={visibility} onClose={popupCloseHandler}>
                    <PopupAdd />
                </PopupComponent>

                <tr className="headerTable">
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Lớp học</th>
                    <th>Thông tin sức khỏe</th>
                    <th>Tình hình học tập</th>
                </tr>

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {data.map((hocSinh) => (
                            <tr key={hocSinh.id} className="itemTable">
                                <td>{hocSinh.id}</td>
                                <td>{hocSinh.hoTen}</td>
                                <td>{hocSinh.ngaySinh}</td>
                                <td>{hocSinh.gioiTinh}</td>
                                <td>{hocSinh.idLopHoc}</td>
                                <td>{hocSinh.thongTinSucKhoe}</td>
                                <td>{hocSinh.tinhHinhHocTap}</td>
                            </tr>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
