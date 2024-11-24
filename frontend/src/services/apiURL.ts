import { baseURL } from "./baseURL";

export const apiURL = {
    //Nhân viên
    getAllNhanVien: `${baseURL}/nhanvien/getAllNhanVien`,
    getListOfNhanVienByIDs: (ids: string[]) => `${baseURL}/nhanvien/getAllNhanVien?id=${ids.join("&id=")}`,
    postAddNhanVien: `${baseURL}/nhanvien`,
    putUpdateNhanVien: (ids: string[]) => `${baseURL}/nhanvien/${ids}`,
    //Phụ huynh
    getAllPhuHuynh: `${baseURL}/phuhuynh`,
    getListOfPhuHuynhByIDs: (ids: string[]) => `${baseURL}/phuhuynh/id=${ids.join("&id=")}`,
    postAddPhuHuynh: `${baseURL}/phuhuynh`,
    putUpdatePhuHuynh: (ids: string[]) => `${baseURL}/phuhuynh/${ids.join(",")}`, // PUT để cập nhật thông tin phụ huynh theo danh sách ID
    deletePhuHuynh: (ids: string[]) => `${baseURL}/phuhuynh/${ids.join(",")}`, // DELETE để xóa phụ huynh theo ID
    //Học Sinh
    // getAllHocSinh: `${baseURL}/hocsinh/getAllHocSinh`, // GET lấy tất cả học sinh
    // postAddHocSinh: `${baseURL}/hocsinh/addHocSinh`, // POST để thêm học sinh mới
    // putUpdateHocSinh: (id: string[]) => `${baseURL}/hocsinh/updateHocSinh/${id}`, // PUT để cập nhật học sinh theo ID
    // deleteHocSinh: (id: string[]) => `${baseURL}/hocsinh/deleteHocSinh/${id}`, // DELETE để xóa học sinh theo ID
    getAllHocSinh: `${baseURL}/hocsinh/getAllHocSinh`, // GET để lấy tất cả học sinh
    getListOfHocSinhByIDs: (ids: string[]) => `${baseURL}/hocsinh/getAllHocSinh?id=${ids.join("&id=")}`, // GET để lấy học sinh theo danh sách ID
    postAddHocSinh: `${baseURL}/hocsinh`, // POST để thêm học sinh mới
    putUpdateHocSinh: (ids: string[]) => `${baseURL}/hocsinh/${ids.join(",")}`, // PUT để cập nhật thông tin học sinh theo danh sách ID
    // deleteHocSinh: (ids: string[]) => `${baseURL}/hocsinh/${ids.join(",")}`, // DELETE để xóa học sinh theo danh sách ID

    //Môn học
    getAllMonHoc: `${baseURL}/monhoc/getAllMonHoc`,
    getListOfMonHocByIDs: (ids: string[]) => `${baseURL}/monhoc/getAllHocSinh?id=${ids.join("&id=")}`,
    postAddMonHoc: `${baseURL}/monhoc`,
    putUpdateMonHoc: (ids: string[]) => `${baseURL}/monhoc/${ids}`,
};
