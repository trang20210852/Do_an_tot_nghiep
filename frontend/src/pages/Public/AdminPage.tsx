import React, { useEffect, useState } from "react";
import { approveTruongHoc, banTruongHoc, getDanhSachTruong } from "../../services/school/apiSchool";

const AdminPage: React.FC = () => {
    const [truongHocList, setTruongHocList] = useState<any[]>([]); // Khai báo state để lưu danh sách trường học
    const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái loading

    // Hàm lấy danh sách trường học
    const fetchTruongHocList = async () => {
        try {
            setIsLoading(true);
            const data = await getDanhSachTruong(); // Gọi API lấy danh sách trường học
            setTruongHocList(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách trường học:", error);
            alert("Không thể tải danh sách trường học!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTruongHocList(); // Gọi hàm lấy danh sách trường học khi component được render
    }, []);

    const handleApprove = async (idTruong: number) => {
        try {
            await approveTruongHoc(idTruong);
            alert("Trường học đã được duyệt thành công!");
            fetchTruongHocList(); // Cập nhật danh sách sau khi duyệt
        } catch (error) {
            console.error("Lỗi khi duyệt trường học:", error);
            alert("Không thể duyệt trường học!");
        }
    };

    const handleBan = async (idTruong: number) => {
        try {
            await banTruongHoc(idTruong);
            alert("Trường học đã bị ban thành công!");
            fetchTruongHocList(); // Cập nhật danh sách sau khi ban
        } catch (error) {
            console.error("Lỗi khi ban trường học:", error);
            alert("Không thể ban trường học!");
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Đang tải danh sách trường học...</p>
            ) : (
                truongHocList.map((truong) => (
                    <div key={truong.IDTruong} className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold">{truong.tenTruong}</h3>
                        <p>Địa chỉ: {truong.diaChi}</p>
                        <p>Trạng thái: {truong.duyet ? "Đã duyệt" : "Chưa duyệt"}</p>
                        <div className="flex space-x-2 mt-4">
                            {!truong.duyet && (
                                <button onClick={() => handleApprove(truong.IDTruong)} className="px-4 py-2 bg-green-500 text-white rounded">
                                    Duyệt
                                </button>
                            )}
                            <button onClick={() => handleBan(truong.IDTruong)} className="px-4 py-2 bg-red-500 text-white rounded">
                                Dừng hoạt động
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminPage;
