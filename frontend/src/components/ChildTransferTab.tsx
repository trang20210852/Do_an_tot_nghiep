import { FaSchool } from "react-icons/fa";

interface Props {
    hocSinh: any;
    lichSuChuyenTruong: any[];
    handleOpenTransferForm: () => void;
    setIsNhapHocModalOpen: (val: boolean) => void;
    navigateToSchoolDetail: (idTruongHoc: number | undefined, state: string) => void;
    isTransferFormOpen: boolean;
    handleCloseTransferForm: () => void;
    idHocSinh: number;
    TransferForm: React.FC<{ onClose: () => void; studentId: number }>;
}

const ChildTransferTab: React.FC<Props> = ({
    hocSinh,
    lichSuChuyenTruong,
    handleOpenTransferForm,
    setIsNhapHocModalOpen,
    navigateToSchoolDetail,
    isTransferFormOpen,
    handleCloseTransferForm,
    idHocSinh,
    TransferForm,
}) => (
   <div>
     <div className="flex justify-between items-center">
                                   <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-3">Chuyển Trường</h2>
   
                                   {/* <button onClick={handleOpenTransferForm} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2">
                                       <FaSchool /> Tạo Đơn Chuyển Trường
                                   </button> */}
   
                                   {/* <div className="flex justify-end mt-4">
                                       {lichSuChuyenTruong.length === 0 ? (
                                           // Nút Nhập Học
                                           <button onClick={() => setIsNhapHocModalOpen(true)} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
                                               Nhập Học
                                           </button>
                                       ) : (
                                           // Nút Tạo Đơn Chuyển Trường
                                           <button onClick={handleOpenTransferForm} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
                                               Tạo Đơn Chuyển Trường
                                           </button>
                                       )}
                                   </div> */}
   
                                   <div className="flex justify-end mt-4">
                                       {hocSinh?.IDTruongHoc ? (
                                           // Nút Tạo Đơn Chuyển Trường
                                           <button onClick={handleOpenTransferForm} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
                                               Tạo Đơn Chuyển Trường
                                           </button>
                                       ) : (
                                           // Nút Nhập Học
                                           <button onClick={() => setIsNhapHocModalOpen(true)} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
                                               Nhập Học
                                           </button>
                                       )}
                                   </div>
                               </div>
   
                               {/* Trường hiện tại */}
                               <div className="bg-amber-50 p-6 rounded-lg shadow-sm mb-8">
                                   <h3 className="text-xl font-semibold text-amber-700 mb-4 border-l-4 border-amber-500 pl-3">Trường Hiện Tại</h3>
   
                                   <div className="flex flex-col md:flex-row gap-6">
                                       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-amber-600 shadow-sm">
                                           <FaSchool />
                                       </div>
   
                                       <div className="flex-grow">
                                           <h4 className="text-lg font-bold text-gray-800 mb-2">{hocSinh?.tenTruongHoc || "Chưa có thông tin"}</h4>
                                           <p className="text-gray-600 mb-1">
                                               <span className="font-medium">Địa chỉ:</span> {hocSinh?.diaChiTruong || "Chưa có thông tin"}
                                           </p>
                                           <p className="text-gray-600 mb-1">
                                               <span className="font-medium">Thời gian học:</span>{" "}
                                               {hocSinh?.ngayNhapHoc ? `Từ ${new Date(hocSinh.ngayNhapHoc).toLocaleDateString()} đến nay` : "Chưa có thông tin"}
                                           </p>
                                           <p className="text-gray-600">
                                               <span className="font-medium">Lớp:</span> {hocSinh?.tenLop || "Chưa có thông tin"}
                                           </p>
                                       </div>
                                   </div>
   
                                   {/* Nút Xem Chi Tiết */}
                                   {/* <div className="mt-4 text-right">
                                       <button
                                           onClick={() => navigate(`/school-profile/${hocSinh?.IDTruongHoc}`, { state: { source: "school" } })} // Điều hướng đến trang profile trường
                                           className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                                           disabled={!hocSinh?.IDTruongHoc} // Vô hiệu hóa nếu không có ID trường
                                       >
                                           Xem Chi Tiết Trường
                                       </button>
                                   </div> */}
                                   <div className="mt-4 text-right">
                                       <button
                                           onClick={() => navigateToSchoolDetail(hocSinh?.IDTruongHoc, "review")} // Gọi hàm điều hướng
                                           className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                                           disabled={!hocSinh?.IDTruongHoc} // Vô hiệu hóa nếu không có ID trường
                                       >
                                           Xem Chi Tiết Trường
                                       </button>
                                   </div>
                               </div>
                               {/* Hiển thị TransferForm */}
                               {isTransferFormOpen && (
                                   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                                       <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl relative">
                                           <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl" onClick={handleCloseTransferForm}>
                                               ×
                                           </button>
                                           <TransferForm onClose={handleCloseTransferForm} studentId={Number(idHocSinh)} />
                                       </div>
                                   </div>
                               )}
                               {/* Lịch sử chuyển trường */}
                               <h3 className="text-xl font-semibold text-amber-700 mb-4 border-l-4 border-amber-500 pl-3">Lịch Sử Chuyển Trường</h3>
   
                               {lichSuChuyenTruong.length > 0 ? (
                                   <div className="overflow-x-auto">
                                       <table className="w-full border-collapse">
                                           <thead className="bg-amber-100">
                                               <tr>
                                                   <th className="border border-amber-200 px-4 py-3 text-left">STT</th>
                                                   <th className="border border-amber-200 px-4 py-3 text-left">Trường Hiện Tại</th>
                                                   <th className="border border-amber-200 px-4 py-3 text-left">Trường Muốn Chuyển</th>
                                                   <th className="border border-amber-200 px-4 py-3 text-left">Lý Do</th>
                                                   <th className="border border-amber-200 px-4 py-3 text-left">Trạng Thái</th>
                                                   <th className="border border-amber-200 px-4 py-3 text-center">Thao Tác</th>
                                               </tr>
                                           </thead>
                                           <tbody>
                                               {lichSuChuyenTruong.map((don, index) => (
                                                   <tr key={don.IDDon} className={index % 2 === 0 ? "bg-white" : "bg-amber-50"}>
                                                       <td className="border border-amber-200 px-4 py-3 text-center">{index + 1}</td>
                                                       <td className="border border-amber-200 px-4 py-3">{don.truongHienTai}</td>
                                                       <td className="border border-amber-200 px-4 py-3">{don.truongMuonChuyen}</td>
                                                       <td className="border border-amber-200 px-4 py-3">{don.lyDo}</td>
                                                       <td className="border border-amber-200 px-4 py-3">
                                                           <div className="space-y-1">
                                                               <div className="flex items-center gap-2">
                                                                   <span className="text-sm font-medium">Trường hiện tại:</span>
                                                                   <span
                                                                       className={`px-2 py-1 rounded text-white text-xs ${
                                                                           don.trangThaiTruongHienTai === "Đã duyệt"
                                                                               ? "bg-green-500"
                                                                               : don.trangThaiTruongHienTai === "Đã từ chối"
                                                                               ? "bg-red-500"
                                                                               : "bg-amber-500"
                                                                       }`}
                                                                   >
                                                                       {don.trangThaiTruongHienTai}
                                                                   </span>
                                                               </div>
                                                               <div className="flex items-center gap-2">
                                                                   <span className="text-sm font-medium">Trường muốn chuyển:</span>
                                                                   <span
                                                                       className={`px-2 py-1 rounded text-white text-xs ${
                                                                           don.trangThaiTruongMuonChuyen === "Đã duyệt"
                                                                               ? "bg-green-500"
                                                                               : don.trangThaiTruongMuonChuyen === "Đã từ chối"
                                                                               ? "bg-red-500"
                                                                               : "bg-amber-500"
                                                                       }`}
                                                                   >
                                                                       {don.trangThaiTruongMuonChuyen}
                                                                   </span>
                                                               </div>
                                                           </div>
                                                       </td>
                                                       <td className="border border-amber-200 px-4 py-3 text-center">
                                                           <button className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition">Chi tiết</button>
                                                       </td>
                                                   </tr>
                                               ))}
                                           </tbody>
                                       </table>
                                   </div>
                               ) : (
                                   <div className="text-center py-8 bg-gray-50 rounded-lg">
                                       <p className="text-gray-600">Chưa có lịch sử chuyển trường.</p>
                                   </div>
                               )}
   
                               {/* Thông tin hướng dẫn */}
                               <div className="mt-8 bg-amber-50 p-6 rounded-lg border border-amber-200">
                                   <h3 className="text-lg font-semibold text-amber-700 mb-3">Thủ tục chuyển trường</h3>
                                   <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                       <li>Tạo đơn chuyển trường trên hệ thống.</li>
                                       <li>Chờ duyệt từ trường hiện tại.</li>
                                       <li>Chờ duyệt từ trường muốn chuyển đến.</li>
                                       <li>Sau khi được duyệt, liên hệ với cả hai trường để hoàn tất thủ tục.</li>
                                   </ol>
                               </div>
                        
                       
                   </div>
);

export default ChildTransferTab;
