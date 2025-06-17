import { FaFileAlt, FaHome } from "react-icons/fa";

interface Props {
    hocSinh: any;
    setImagePopup: (popup: { url: string; title: string }) => void;
}

const ChildInfoTab: React.FC<Props> = ({ hocSinh, setImagePopup }) => (
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-3">Thông Tin Của Con</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-amber-50 p-6 rounded-lg shadow-sm space-y-4">
                                    <h3 className="text-xl font-semibold text-amber-700 mb-4">Thông Tin Cơ Bản</h3>
                                    <p className="flex justify-between border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Giới tính:</strong>
                                        <span>{hocSinh?.gioiTinh}</span>
                                    </p>
                                    <p className="flex justify-between border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Ngày sinh:</strong> {new Date(hocSinh?.ngaySinh).toLocaleDateString()}
                                    </p>

                                    {/* Bổ sung hiển thị giấy khai sinh và hộ khẩu */}
                                    <p className="flex justify-between border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700 mb-1">Giấy khai sinh:</strong>
                                        {hocSinh?.giayKhaiSinh ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="text-amber-900 bg-yellow-200 underline break-all"
                                                    onClick={() => {
                                                        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(hocSinh.giayKhaiSinh)) {
                                                            setImagePopup({ url: hocSinh.giayKhaiSinh, title: "Giấy khai sinh" });
                                                        } else {
                                                            window.open(hocSinh.giayKhaiSinh, "_blank");
                                                        }
                                                    }}
                                                >
                                                    Xem giấy khai sinh
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Chưa có giấy khai sinh</span>
                                        )}
                                    </p>

                                    <p className="flex justify-between border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700 mb-1">Hộ khẩu:</strong>
                                        {hocSinh?.hoKhau ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="text-amber-900 bg-yellow-200 underline break-all"
                                                    onClick={() => {
                                                        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(hocSinh.hoKhau)) {
                                                            setImagePopup({ url: hocSinh.hoKhau, title: "Hộ khẩu" });
                                                        } else {
                                                            window.open(hocSinh.hoKhau, "_blank");
                                                        }
                                                    }}
                                                >
                                                    Xem hộ khẩu
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Chưa có hộ khẩu</span>
                                        )}
                                    </p>
                                </div>

                                <div className="bg-amber-50 p-6 rounded-lg shadow-sm space-y-4">
                                    <h3 className="text-xl font-semibold text-amber-700 mb-4">Thông Tin Phát Triển</h3>
                                    <p className="flex flex-col border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Sức khỏe:</strong>
                                        <span className="mt-1">{hocSinh?.thongTinSucKhoe || "Không có thông tin"}</span>
                                    </p>
                                    <p className="flex flex-col border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Tình hình học tập:</strong>
                                        <span className="mt-1">{hocSinh?.tinhHinhHocTap || "Không có thông tin"}</span>
                                    </p>
                                    <p className="flex flex-col border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Sở thích:</strong>
                                        <span className="mt-1">{hocSinh?.soThich || "Không có thông tin"}</span>
                                    </p>
                                    <p className="flex flex-col border-b border-amber-200 pb-2">
                                        <strong className="text-gray-700">Bệnh tật:</strong>
                                        <span className="mt-1">{hocSinh?.benhTat || "Không có thông tin"}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-amber-700 mb-4 border-l-4 border-amber-500 pl-3">Thông Tin Khẩn Cấp</h3>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700 mb-2">
                                        <strong>Lưu ý:</strong> Vui lòng cập nhật thông tin liên hệ khẩn cấp để chúng tôi có thể liên lạc khi cần thiết.
                                    </p>
                                    <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">Cập nhật thông tin khẩn cấp</button>
                                </div>
                            </div>

    </div>
);

export default ChildInfoTab;
