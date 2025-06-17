create database school_management;
drop database school_management;
use school_management;

-- Bảng Trường Học
CREATE TABLE TruongHoc (
    IDTruong INT PRIMARY KEY AUTO_INCREMENT,
    tenTruong VARCHAR(255) NOT NULL,
    diaChi TEXT NOT NULL,
    SDT VARCHAR(15) NOT NULL UNIQUE,
    email_business VARCHAR(100) NOT NULL UNIQUE,
    email_hieutruong VARCHAR(100) NOT NULL UNIQUE,
    ngayThanhLap DATE NOT NULL,
   
    moTa TEXT,
    Status ENUM('Hoạt động', 'Dừng') DEFAULT 'Hoạt động',
    Avatar TEXT,
    background TEXT
);

-- Bảng Nhân Viên
CREATE TABLE NhanVien (
    IDNhanVien INT PRIMARY KEY AUTO_INCREMENT,
    hoTen VARCHAR(255) NOT NULL,
    gioiTinh ENUM('Nam', 'Nữ') NOT NULL,
    ngaySinh DATE NOT NULL,
    diaChi TEXT NOT NULL,
    SDT VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    Avatar TEXT,
    Status ENUM('Hoạt động', 'Dừng') DEFAULT 'Hoạt động'
);

-- Bảng liên kết Nhân Viên - Trường Học
CREATE TABLE TruongHoc_NhanVien (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    IDTruong INT NOT NULL,
    IDNhanVien INT NOT NULL,
    chucVu ENUM('Chưa phân', 'Hiệu trưởng', 'Cán bộ') DEFAULT 'Chưa phân',
	ngayVaoLam DATE DEFAULT (CURDATE()),
    ngayNghiViec DATE,
    phongBan VARCHAR(100),
    duyet BOOLEAN DEFAULT FALSE,
	luong DECIMAL(10,2) DEFAULT 0.00,
    Status ENUM('Hoạt động', 'Dừng') DEFAULT 'Hoạt động',
    FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) ON DELETE CASCADE,
    FOREIGN KEY (IDNhanVien) REFERENCES NhanVien(IDNhanVien) ON DELETE CASCADE
);


-- Bảng Lớp Học
CREATE TABLE LopHoc (
    IDLopHoc INT PRIMARY KEY AUTO_INCREMENT,
    IDTruong INT NOT NULL,
    tenLop VARCHAR(255) NOT NULL,
    doTuoi INT NOT NULL,
    siSo INT DEFAULT 0,
    IDGiaoVien INT,
    namHoc TEXT,
    linkZaloGroup TEXT,
    FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) ON DELETE CASCADE,
    FOREIGN KEY (IDGiaoVien) REFERENCES NhanVien(IDNhanVien) ON DELETE SET NULL
);


-- Bảng Phụ Huynh
CREATE TABLE PhuHuynh (
    IDPhuHuynh INT PRIMARY KEY AUTO_INCREMENT,
    hoTen VARCHAR(255) NOT NULL,
    gioiTinh ENUM('Nam', 'Nữ') NOT NULL,
    ngaySinh DATE NOT NULL,
    diaChi TEXT NOT NULL,
    SDT VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    matKhau VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255),
     nhanThongBao BOOLEAN DEFAULT TRUE,
    Status ENUM('Hoạt động', 'Dừng') DEFAULT 'Hoạt động',
     CCCD VARCHAR(20) UNIQUE NOT NULL
      
);

-- Bảng Học Sinh
CREATE TABLE HocSinh (
    IDHocSinh INT PRIMARY KEY AUTO_INCREMENT,
    hoTen VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    gioiTinh ENUM('Nam', 'Nữ') NOT NULL,
    ngaySinh DATE NOT NULL,
    ngayNhapHoc DATE ,
    ngayRaTruong DATE,
    thongTinSucKhoe TEXT,
    tinhHinhHocTap TEXT,
    Avatar VARCHAR(255),
    duyet BOOLEAN DEFAULT FALSE,
    Status ENUM('Đang học', 'Đã tốt nghiệp', 'Chờ duyệt') DEFAULT 'Chờ duyệt',
    IDTruong INT ,
    IDLopHoc INT,
	cccd VARCHAR(20) UNIQUE NOT NULL,
    giayKhaiSinh TEXT,
    hoKhau TEXT,
    soThich TEXT,
    uuDiem TEXT,
    nhuocDiem TEXT,
    benhTat TEXT,
    doTuoi INT NOT NULL,
	
    FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) ON DELETE CASCADE,
    FOREIGN KEY (IDLopHoc) REFERENCES LopHoc(IDLopHoc) ON DELETE SET NULL
   
);

-- Bảng trung gian Phụ Huynh - Học Sinh
CREATE TABLE PhuHuynh_HocSinh (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    IDPhuHuynh INT NOT NULL,
    IDHocSinh INT NOT NULL,
    moiQuanHe ENUM('Bố', 'Mẹ') DEFAULT 'Mẹ',
    rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh) ON DELETE CASCADE,
    FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh) ON DELETE CASCADE,
    UNIQUE(IDPhuHuynh, IDHocSinh)
);

ALTER TABLE HocSinh AUTO_INCREMENT = 1;



-- Bảng Phòng Học
CREATE TABLE PhongHoc (
    IDPhongHoc INT PRIMARY KEY AUTO_INCREMENT,
    IDTruong INT NOT NULL,
    tenPhong VARCHAR(255) NOT NULL,
    sucChua INT NOT NULL,
    Status ENUM('Hoạt động', 'Bảo trì', 'Ngừng sử dụng') DEFAULT 'Hoạt động',
    moTa TEXT,
    IDGVCN INT,
    IDLopHoc INT,
    FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) ON DELETE CASCADE,
    FOREIGN KEY (IDGVCN) REFERENCES NhanVien(IDNhanVien) ON DELETE SET NULL,
    FOREIGN KEY (IDLopHoc) REFERENCES LopHoc(IDLopHoc) ON DELETE SET NULL
);

CREATE TABLE DonNhapHoc (
    IDDon INT PRIMARY KEY AUTO_INCREMENT,
    IDPhuHuynh INT NOT NULL,
    hoTenHocSinh VARCHAR(255) NOT NULL,
    gioiTinh ENUM('Nam', 'Nữ') NOT NULL,
    ngaySinh DATE NOT NULL,
    diaChi TEXT NOT NULL,
    trangThai ENUM('Chờ xử lý', 'Đã duyệt', 'Từ chối') DEFAULT 'Chờ xử lý',
    IDTruongMuonDangKy INT,
    ngayTao DATE DEFAULT (CURDATE()),
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh),
    FOREIGN KEY (IDTruongMuonDangKy) REFERENCES TruongHoc(IDTruong)
);

CREATE TABLE DonNghiHoc (
    IDDon INT PRIMARY KEY AUTO_INCREMENT,
    IDHocSinh INT NOT NULL,
    IDPhuHuynh INT NOT NULL,
    ngayBatDau DATE NOT NULL,
    ngayKetThuc DATE,
    lyDo TEXT,
    trangThai ENUM('Chờ duyệt', 'Đã duyệt', 'Từ chối') DEFAULT 'Chờ duyệt',
    ngayTao DATE DEFAULT (CURDATE()),
    FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh),
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh)
);

CREATE TABLE DonChuyenTruong (
    IDDon INT PRIMARY KEY AUTO_INCREMENT,
    IDHocSinh INT NOT NULL,
    IDPhuHuynh INT NOT NULL,
    IDTruongHienTai INT NOT NULL,
    IDTruongMuonChuyen INT NOT NULL,
    lyDo TEXT,
     minhChung TEXT,
    ngayTao DATE DEFAULT (CURDATE()),
    FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh),
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh),
    FOREIGN KEY (IDTruongHienTai) REFERENCES TruongHoc(IDTruong),
    FOREIGN KEY (IDTruongMuonChuyen) REFERENCES TruongHoc(IDTruong)
);

-- Bảng Nhận Xét Học Sinh
CREATE TABLE NhanXetHocSinh (
    IDNhanXet INT PRIMARY KEY AUTO_INCREMENT,
    IDHocSinh INT NOT NULL,
    IDGiaoVien INT NOT NULL,
    ngayNhanXet DATE DEFAULT (CURDATE()),
    noiDung TEXT NOT NULL,
     sucKhoe TEXT,
    hocTap TEXT,
    FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh) ON DELETE CASCADE,
    FOREIGN KEY (IDGiaoVien) REFERENCES NhanVien(IDNhanVien) ON DELETE CASCADE
);

-- Bảng Thông Báo
CREATE TABLE ThongBao (
    IDThongBao INT PRIMARY KEY AUTO_INCREMENT,
    IDNguoiGui INT NOT NULL,
    IDPhuHuynh INT NOT NULL,
    tieuDe VARCHAR(255) NOT NULL,
    noiDung TEXT NOT NULL,
    loaiThongBao  TEXT NOT NULL,
    mucDoUuTien  TEXT NOT NULL,
    ngayGui DATE DEFAULT (CURDATE()),
    trangThai ENUM('Đã đọc', 'Chưa đọc') DEFAULT 'Chưa đọc',
    FOREIGN KEY (IDNguoiGui) REFERENCES NhanVien(IDNhanVien) ON DELETE CASCADE,
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh) ON DELETE CASCADE
);


CREATE TABLE DiemDanh (
    IDDiemDanh INT AUTO_INCREMENT PRIMARY KEY,
    IDHocSinh INT NOT NULL,
    ngay DATE NOT NULL,
    trangThai ENUM('Có mặt', 'Vắng mặt', 'Vắng có phép') NOT NULL,
    UNIQUE (IDHocSinh, ngay),
    FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh) ON DELETE CASCADE
);
ALTER TABLE TruongHoc ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0.00;

CREATE TABLE HocPhi (
  IDHocPhi INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính
  IDHocSinh INT NOT NULL, -- Liên kết với học sinh
   IDTruong INT NOT NULL, -- Liên kết với học sinh
  thang INT NOT NULL, -- Tháng của học phí
  nam INT NOT NULL, -- Năm của học phí
  soTien DECIMAL(12,2) NOT NULL, -- Số tiền học phí
  trangThai VARCHAR(50) DEFAULT 'Chưa thanh toán', -- Trạng thái học phí (Chưa thanh toán, Đã thanh toán)
  hanCuoi DATE NOT NULL, -- Hạn cuối thanh toán
  ngayThanhToan DATETIME, -- Ngày thanh toán (nếu đã thanh toán)
  maGiaoDich VARCHAR(100), -- Mã giao dịch duy nhất
  maGiaoDichMoMo VARCHAR(100), -- Mã giao dịch từ MoMo
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo học phí
  noiDung TEXT, -- Nội dung thanh toán
  ghiChu TEXT, -- Ghi chú bổ sung
  FOREIGN KEY (IDHocSinh) REFERENCES HocSinh(IDHocSinh), -- Liên kết với bảng học sinh
  UNIQUE KEY (maGiaoDich), -- Đảm bảo mã giao dịch là duy nhất
FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) 
);

    

CREATE TABLE DanhGiaTruong (
    IDDanhGia INT PRIMARY KEY AUTO_INCREMENT,
    IDPhuHuynh INT NOT NULL,
    IDTruong INT NOT NULL,
    rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5), -- Đánh giá từ 1 đến 5
    comment TEXT, -- Bình luận
    ngayDanhGia DATE DEFAULT (CURDATE()), -- Ngày đánh giá
    FOREIGN KEY (IDPhuHuynh) REFERENCES PhuHuynh(IDPhuHuynh) ON DELETE CASCADE,
    FOREIGN KEY (IDTruong) REFERENCES TruongHoc(IDTruong) ON DELETE CASCADE
);

ALTER TABLE NhanVien ADD COLUMN role ENUM('Admin', 'Hiệu trưởng', 'Cán bộ') DEFAULT 'Cán bộ';
ALTER TABLE TruongHoc ADD COLUMN duyet BOOLEAN DEFAULT FALSE;
ALTER TABLE TruongHoc ADD COLUMN giayPhepHoatDong TEXT;
ALTER TABLE TruongHoc ADD COLUMN loaiHinh ENUM("Công lập", "Tư thục");


INSERT INTO BieuPhi (doTuoi, IDTruong, mucPhi, ghiChu)
VALUES 
    ("3-4", 1, 1200000, "Học phí cho trẻ 3-4 tuổi tại trường 1"),
    ("4-5", 1, 1300000, "Học phí cho trẻ 4-5 tuổi tại trường 1"),
    ("5-6", 1, 1400000, "Học phí cho trẻ 5-6 tuổi tại trường 1"),
    ("3-4", 2, 1500000, "Học phí cho trẻ 3-4 tuổi tại trường 2"),
    ("4-5", 2, 1600000, "Học phí cho trẻ 4-5 tuổi tại trường 2"),
    ("5-6", 2, 1700000, "Học phí cho trẻ 5-6 tuổi tại trường 2");

INSERT INTO NhanVien (hoTen, gioiTinh, ngaySinh, diaChi, SDT, email, matKhau, role, Status)
VALUES ('Admin', 'Nam', '1990-01-01', 'Hệ thống', '0123456789', 'admin@system.com', '123', 'Admin', 'Hoạt động');
SELECT * FROM HocSinh ;
SELECT * FROM TruongHoc_NhanVien WHERE  IDTruong = 1;
SELECT * FROM PhuHuynh WHERE email = 'email@domain.com' OR SDT = '0123456789';
SELECT * FROM NhanVien ;
SELECT * FROM TruongHoc ;
SELECT * FROM HocPhi ;
SELECT * FROM PhongHoc ;
SELECT * FROM DonChuyenTruong ;
SELECT * FROM GiaoDichThanhToan ;
SELECT * FROM PhuHuynh ;
SELECT * FROM LopHoc ;
SELECT * FROM NhanXetHocSinh ;
SELECT * FROM ThongBao;
UPDATE HocSinh
        SET IDTruong = 2, duyet = FALSE, Status = 'Chờ duyệt'
        WHERE IDHocSinh = 2;

INSERT INTO HocSinh (
    hoTen,
    nickname,
    gioiTinh,
    ngaySinh,
    ngayNhapHoc,
    thongTinSucKhoe,
    tinhHinhHocTap,
    Avatar,
    IDTruong,
    IDLopHoc,
    cccd,
    giayKhaiSinh,
    hoKhau,
    soThich,
    uuDiem,
    nhuocDiem,
    benhTat,
    doTuoi
)
VALUES (
    'Nguyễn Văn A',
    'Bin',
    'Nam',
    '2018-05-15',
    '2023-09-05',
    'Bình thường',
    'Học tốt',
    'avatar_url.jpg',
    1, -- IDTruong phải có sẵn
    2, -- IDLopHoc có thể NULL hoặc có sẵn
    '123456789012',
    'Giấy khai sinh số 00123',
    'Hộ khẩu số 456',
    'Bóng đá, vẽ tranh',
    'Hiền lành, lễ phép',
    'Chậm thích nghi môi trường mới',
    'Không có',
    6
);

SELECT 
            hs.IDHocSinh, 
            hs.hoTen, 
            hs.gioiTinh, 
            hs.ngaySinh, 
            hs.Avatar, 
            hs.IDTruong, 
            hs.IDLopHoc, 
            hs.cccd, 
            hs.doTuoi, 
            p_hs.moiQuanHe
        FROM HocSinh hs
        INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        WHERE p_hs.IDPhuHuynh = 4;
        
SELECT  hs.IDHocSinh, 
            hs.hoTen, 
            hs.gioiTinh, 
            hs.ngaySinh, 
            hs.Avatar, 
            hs.IDTruong, 
            hs.IDLopHoc, 
            hs.cccd, 
            hs.doTuoi, 
            p_hs.moiQuanHe
        FROM HocSinh hs
        INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        WHERE p_hs.IDPhuHuynh = 1;
        
-- Kiểm tra dữ liệu trong bảng PhuHuynh_HocSinh
SELECT * FROM PhuHuynh_HocSinh WHERE IDPhuHuynh = 1;

-- Kiểm tra dữ liệu trong bảng HocSinh
SELECT * FROM HocSinh WHERE IDHocSinh IN (SELECT IDHocSinh FROM PhuHuynh_HocSinh WHERE IDPhuHuynh = 1);

-- Kiểm tra dữ liệu trong bảng PhuHuynh_HocSinh
SELECT * FROM LopHoc WHERE IDPhuHuynh = 1;

SELECT 
            hs.IDHocSinh, 
            hs.hoTen, 
            hs.gioiTinh, 
            hs.ngaySinh, 
            hs.Avatar, 
            hs.IDTruong, 
            hs.IDLopHoc, 
            hs.cccd, 
            hs.doTuoi, 
            p_hs.moiQuanHe
        FROM HocSinh hs
        INNER JOIN PhuHuynh_HocSinh p_hs ON hs.IDHocSinh = p_hs.IDHocSinh
        WHERE p_hs.IDPhuHuynh = 1;
SELECT 
    hs.*, -- tất cả thông tin học sinh
    ph.IDPhuHuynh,
    ph.hoTen AS tenPhuHuynh,
    ph.gioiTinh AS gioiTinhPhuHuynh,
    ph.ngaySinh AS ngaySinhPhuHuynh,
    ph.diaChi AS diaChiPhuHuynh,
    ph.SDT AS SDTPhuHuynh,
    ph.email AS emailPhuHuynh,
    ph.nhanThongBao,
    ph.Status AS StatusPhuHuynh,
    ph.CCCD AS CCCDPhuHuynh,
    phhs.moiQuanHe,
    phhs.rating,
    phhs.comment
FROM LopHoc lh
INNER JOIN HocSinh hs ON lh.IDLopHoc = hs.IDLopHoc
INNER JOIN PhuHuynh_HocSinh phhs ON hs.IDHocSinh = phhs.IDHocSinh
INNER JOIN PhuHuynh ph ON phhs.IDPhuHuynh = ph.IDPhuHuynh
WHERE lh.IDGiaoVien = 1;  -- đây là ID của giáo viên hiện tại

