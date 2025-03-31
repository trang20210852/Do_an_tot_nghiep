INSERT INTO PhongBan (TenPhongBan, VaiTro) VALUES 
('Ban Giám Hiệu', 'Quản lý'),
('Giáo Viên', 'Dạy học'),
('Nhân Viên Hành Chính', 'Quản lý hành chính'),
('Nhân Viên Y Tế', 'Chăm sóc sức khỏe'),
('Nhân Viên Quản Trị', 'Quản lý hệ thống');

INSERT INTO MonHoc (TenMonHoc, NoiDungMonHoc) VALUES
('Học Chữ Cái', 'Giới thiệu và luyện tập nhận biết chữ cái, chữ viết và phát âm cho trẻ em từ 2-6 tuổi.'),
('Học Số', 'Dạy trẻ nhận biết các con số và luyện tập đếm từ 1 đến 10, 1 đến 20.'),
('Màu Sắc', 'Giới thiệu các màu sắc cơ bản và giúp trẻ nhận diện màu sắc qua các hoạt động vẽ tranh, chơi đồ chơi.'),
('Hình Dạng', 'Giúp trẻ nhận diện các hình dạng cơ bản như hình vuông, hình tròn, hình tam giác và học cách phân biệt chúng.'),
('Nhạc và Âm Thanh', 'Giới thiệu các loại nhạc cụ, các âm thanh đơn giản và giúp trẻ làm quen với âm nhạc qua các trò chơi âm thanh.'),
('Thể Dục', 'Khuyến khích trẻ tham gia các hoạt động thể chất đơn giản như chạy, nhảy, và các bài tập vận động cơ bản.'),
('Trò Chơi Nhóm', 'Hướng dẫn trẻ tham gia các trò chơi nhóm giúp phát triển kỹ năng giao tiếp và hợp tác.'),
('Khám Phá Động Vật', 'Giới thiệu một số loài động vật cơ bản, âm thanh và đặc điểm của chúng để trẻ hiểu về thế giới động vật.'),
('Khám Phá Cây Cối', 'Giới thiệu các loài cây, đặc điểm và môi trường sống của chúng, giúp trẻ nhận diện cây cối.'),
('Cảm Xúc và Tình Cảm', 'Dạy trẻ cách nhận diện và diễn đạt cảm xúc cơ bản như vui, buồn, giận, sợ.'),
('Vẽ và Sáng Tạo', 'Khuyến khích trẻ vẽ tranh và sáng tạo hình ảnh đơn giản qua các hoạt động nghệ thuật.'),
('Giới Thiệu Gia Đình', 'Giúp trẻ nhận diện các thành viên trong gia đình và học cách diễn tả các mối quan hệ trong gia đình.'),
('Công Việc Nhà', 'Giới thiệu các công việc nhà đơn giản mà trẻ có thể tham gia như lau bàn, dọn dẹp đồ chơi.'),
('Chúc Mừng Sinh Nhật', 'Giới thiệu các hoạt động vui chơi trong lễ sinh nhật, như thổi nến, hát bài hát sinh nhật.'),
('Giới Thiệu Các Ngày Trong Tuần', 'Giúp trẻ nhận diện các ngày trong tuần và các hoạt động gắn liền với từng ngày.'),
('Khám Phá Thực Phẩm', 'Dạy trẻ nhận diện các loại thực phẩm cơ bản và ý nghĩa của dinh dưỡng.'),
('Chăm Sóc Thú Cưng', 'Giới thiệu cách chăm sóc và chơi với thú cưng như chó, mèo, qua các câu chuyện và trò chơi.'),
('Trò Chuyện và Kể Chuyện', 'Khuyến khích trẻ tham gia kể chuyện và trò chuyện với bạn bè để phát triển kỹ năng ngôn ngữ.'),
('An Toàn Giao Thông', 'Giới thiệu các quy tắc an toàn cơ bản khi tham gia giao thông như đi bộ qua đường, mặc áo phản quang.'),
('Chơi Cùng Nước', 'Các hoạt động liên quan đến nước như đổ nước vào chai, chơi với bóng nước giúp trẻ phát triển giác quan.'); 

INSERT INTO NhanVien (HoTen, ChucVu, NgaySinh, DiaChi, SoDienThoai, Email, MatKhau) VALUES
('Nguyễn Văn A', 1, '1980-01-01', '123 Đường A', '0900000001', 'a@example.com', 'matkhau1'),
('Lê Thị B', 2, '1985-02-02', '456 Đường B', '0900000002', 'b@example.com', 'matkhau2'),
('Phạm Văn C', 3, '1990-03-03', '789 Đường C', '0900000003', 'c@example.com', 'matkhau3'),
('Đặng Thị D', 4, '1983-04-04', '101 Đường D', '0900000004', 'd@example.com', 'matkhau4'),
('Hoàng Văn E', 5, '1979-05-05', '202 Đường E', '0900000005', 'e@example.com', 'matkhau5'),
('Lý Thị F', 1, '1988-06-06', '303 Đường F', '0900000006', 'f@example.com', 'matkhau6'),
('Ngô Văn G', 2, '1982-07-07', '404 Đường G', '0900000007', 'g@example.com', 'matkhau7'),
('Vũ Thị H', 3, '1992-08-08', '505 Đường H', '0900000008', 'h@example.com', 'matkhau8'),
('Tô Văn I', 4, '1985-09-09', '606 Đường I', '0900000009', 'i@example.com', 'matkhau9'),
('Lê Văn J', 5, '1980-10-10', '707 Đường J', '0900000010', 'j@example.com', 'matkhau10'),
('Đỗ Thị K', 1, '1975-11-11', '808 Đường K', '0900000011', 'k@example.com', 'matkhau11'),
('Trịnh Văn L', 2, '1984-12-12', '909 Đường L', '0900000012', 'l@example.com', 'matkhau12'),
('Trần Thị M', 3, '1993-01-13', '1010 Đường M', '0900000013', 'm@example.com', 'matkhau13'),
('Phạm Văn N', 4, '1981-02-14', '1111 Đường N', '0900000014', 'n@example.com', 'matkhau14'),
('Nguyễn Thị O', 5, '1986-03-15', '1212 Đường O', '0900000015', 'o@example.com', 'matkhau15'),
('Bùi Thị P', 1, '1990-04-16', '1313 Đường P', '0900000016', 'p@example.com', 'matkhau16'),
('Ngô Văn Q', 2, '1983-05-17', '1414 Đường Q', '0900000017', 'q@example.com', 'matkhau17'),
('Trần Văn R', 3, '1988-06-18', '1515 Đường R', '0900000018', 'r@example.com', 'matkhau18'),
('Vũ Thị S', 4, '1979-07-19', '1616 Đường S', '0900000019', 's@example.com', 'matkhau19'),
('Đặng Văn T', 5, '1982-08-20', '1717 Đường T', '0900000020', 't@example.com', 'matkhau20');

INSERT INTO LopHoc (TenLop, IDGiaoVien, DoTuoi, SoLuongHocSinh) VALUES
('Lớp Mầm Non 2-3', 1, 2, 10),
('Lớp Mầm Non 3-4', 2, 3, 10),
('Lớp Mầm Non 4-5', 3, 4, 10),
('Lớp Mầm Non 5-6', 4, 5, 10),
('Lớp Mầm Non 6+', 5, 6, 10);

INSERT INTO HocSinh (HoTen, NgaySinh, GioiTinh, IDLopHoc, ThongTinSucKhoe, TinhHinhHocTap)
VALUES 
    ('Nguyen Van A', '2018-05-12', 'Nam', 1, 'Khỏe mạnh', 'Đang học tốt'),
    ('Tran Thi B', '2019-07-08', 'Nữ', 2, 'Dị ứng nhẹ', 'Cần cải thiện'),
    ('Le Van C', '2018-09-15', 'Nam', 1, 'Khỏe mạnh', 'Xuất sắc'),
    ('Pham Thi D', '2019-12-22', 'Nữ', 3, 'Suyễn', 'Trung bình'),
    ('Nguyen Thi E', '2020-03-10', 'Nữ', 2, 'Khỏe mạnh', 'Tiến bộ rõ rệt'),
    ('Vu Van F', '2018-06-05', 'Nam', 1, 'Cận thị nhẹ', 'Xuất sắc'),
    ('Dang Thi G', '2019-10-13', 'Nữ', 2, 'Khỏe mạnh', 'Tiến bộ rõ rệt'),
    ('Hoang Van H', '2018-08-01', 'Nam', 3, 'Hen suyễn', 'Trung bình'),
    ('Bui Thi I', '2019-11-25', 'Nữ', 2, 'Khỏe mạnh', 'Đang học tốt'),
    ('Tran Van J', '2020-01-30', 'Nam', 1, 'Khỏe mạnh', 'Cần cải thiện'),
    ('Nguyen Thi K', '2018-03-20', 'Nữ', 3, 'Dị ứng nặng', 'Đang học tốt'),
    ('Pham Van L', '2019-09-10', 'Nam', 2, 'Khỏe mạnh', 'Xuất sắc'),
    ('Le Thi M', '2020-07-18', 'Nữ', 1, 'Khỏe mạnh', 'Trung bình'),
    ('Nguyen Van N', '2019-05-17', 'Nam', 2, 'Dị ứng nhẹ', 'Tiến bộ rõ rệt'),
    ('Tran Thi O', '2018-10-14', 'Nữ', 3, 'Suyễn', 'Đang học tốt'),
    ('Vu Thi P', '2019-04-06', 'Nữ', 1, 'Cận thị nhẹ', 'Cần cải thiện'),
    ('Hoang Van Q', '2018-12-03', 'Nam', 2, 'Khỏe mạnh', 'Xuất sắc'),
    ('Dang Thi R', '2020-09-22', 'Nữ', 3, 'Khỏe mạnh', 'Đang học tốt'),
    ('Bui Van S', '2019-11-19', 'Nam', 1, 'Cận thị nặng', 'Trung bình'),
    ('Pham Thi T', '2018-02-08', 'Nữ', 3, 'Khỏe mạnh', 'Tiến bộ rõ rệt'),
    ('Nguyen Van U', '2019-06-25', 'Nam', 2, 'Khỏe mạnh', 'Đang học tốt'),
    ('Le Thi V', '2020-04-02', 'Nữ', 1, 'Dị ứng nhẹ', 'Xuất sắc'),
    ('Tran Van W', '2018-11-14', 'Nam', 3, 'Khỏe mạnh', 'Cần cải thiện'),
    ('Hoang Thi X', '2019-03-19', 'Nữ', 2, 'Suyễn', 'Trung bình'),
    ('Vu Van Y', '2018-09-07', 'Nam', 1, 'Cận thị nhẹ', 'Tiến bộ rõ rệt'),
    ('Bui Thi Z', '2020-05-23', 'Nữ', 3, 'Khỏe mạnh', 'Đang học tốt'),
    ('Pham Van AA', '2019-01-12', 'Nam', 2, 'Cận thị nặng', 'Xuất sắc'),
    ('Nguyen Thi BB', '2018-04-05', 'Nữ', 1, 'Khỏe mạnh', 'Cần cải thiện'),
    ('Le Van CC', '2020-07-30', 'Nam', 2, 'Khỏe mạnh', 'Trung bình'),
    ('Dang Thi DD', '2019-10-21', 'Nữ', 3, 'Dị ứng nhẹ', 'Tiến bộ rõ rệt'),
    ('Vu Van EE', '2018-06-11', 'Nam', 1, 'Khỏe mạnh', 'Đang học tốt');

INSERT INTO PhuHuynh (Avatar,HoTen, SoDienThoai, Email, DiaChi, MatKhau, IDHocSinh,status)
VALUES 
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Nguyen Van F', '0933556611', 'nguyenvanf@example.com', '303 Duong MNO, Quan 6, TP HCM', 'matkhau6', 6,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Le Thi G', '0911445566', 'lethig@example.com', '404 Duong PQR, Quan 7, TP HCM', 'matkhau7', 7,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Tran Van H', '0922778899', 'tranvanh@example.com', '505 Duong STU, Quan 8, TP HCM', 'matkhau8', 8,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Pham Thi I', '0905566778', 'phamthii@example.com', '606 Duong VWX, Quan 9, TP HCM', 'matkhau9', 9,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Do Van J', '0933772299', 'dovanj@example.com', '707 Duong YZA, Quan 10, TP HCM', 'matkhau10', 10,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Hoang Thi K', '0912667788', 'hoangthik@example.com', '808 Duong BCD, Quan 11, TP HCM', 'matkhau11', 11,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Nguyen Van L', '0933775566', 'nguyenvanl@example.com', '909 Duong EFG, Quan 12, TP HCM', 'matkhau12', 12,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Le Thi M', '0909887766', 'lethim@example.com', '111 Duong HIJ, Quan 1, TP HCM', 'matkhau13', 13,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Tran Van N', '0911223344', 'tranvann@example.com', '222 Duong KLM, Quan 2, TP HCM', 'matkhau14', 14,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Pham Thi O', '0908776655', 'phamthio@example.com', '333 Duong NOP, Quan 3, TP HCM', 'matkhau15', 15,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Do Van P', '0933882211', 'dovanp@example.com', '444 Duong QRS, Quan 4, TP HCM', 'matkhau16', 16,'active'),
('https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg','Do Van E', '0933221100', 'dovane@example.com', '202 Duong JKL, Quan 5, TP HCM', 'matkhau5', 5,'active');



INSERT INTO LichHoc (IDLopHoc, IDMonHoc, NgayHoc, ThoiGianBatDau, ThoiGianKetThuc) VALUES
(1, 1, '2024-11-08', '06:30:00', '07:30:00'),  
(1, 2, '2024-11-08', '07:45:00', '08:45:00'),  
(1, 3, '2024-11-08', '09:00:00', '10:00:00'),  
(1, 4, '2024-11-08', '10:15:00', '11:15:00'), 
(1, 5, '2024-11-08', '11:30:00', '12:30:00'),  
(1, 6, '2024-11-08', '13:00:00', '14:00:00'),  
(1, 7, '2024-11-08', '14:15:00', '15:15:00'), 
(2, 1, '2024-11-08', '06:30:00', '07:30:00'),  
(2, 8, '2024-11-08', '07:45:00', '08:45:00'),  
(2, 9, '2024-11-08', '09:00:00', '10:00:00'),  
(2, 10, '2024-11-08', '10:15:00', '11:15:00'), 
(2, 11, '2024-11-08', '11:30:00', '12:30:00'), 
(2, 12, '2024-11-08', '13:00:00', '14:00:00'), 
(2, 13, '2024-11-08', '14:15:00', '15:15:00'), 
(3, 14, '2024-11-08', '06:30:00', '07:30:00'), 
(3, 15, '2024-11-08', '07:45:00', '08:45:00'),
(3, 16, '2024-11-08', '09:00:00', '10:00:00'), 
(3, 17, '2024-11-08', '10:15:00', '11:15:00'), 
(3, 18, '2024-11-08', '11:30:00', '12:30:00'), 
(3, 19, '2024-11-08', '13:00:00', '14:00:00'), 
(3, 20, '2024-11-08', '14:15:00', '15:15:00'), 
(4, 1, '2024-11-08', '06:30:00', '07:30:00'),  
(4, 2, '2024-11-08', '07:45:00', '08:45:00'),  
(4, 3, '2024-11-08', '09:00:00', '10:00:00'),  
(4, 4, '2024-11-08', '10:15:00', '11:15:00'),  
(4, 5, '2024-11-08', '11:30:00', '12:30:00'),  
(4, 6, '2024-11-08', '13:00:00', '14:00:00'),  
(4, 7, '2024-11-08', '14:15:00', '15:15:00'),  
(5, 8, '2024-11-08', '06:30:00', '07:30:00'),  
(5, 9, '2024-11-08', '07:45:00', '08:45:00'),  
(5, 10, '2024-11-08', '09:00:00', '10:00:00'), 
(5, 11, '2024-11-08', '10:15:00', '11:15:00'), 
(5, 12, '2024-11-08', '11:30:00', '12:30:00'), 
(5, 13, '2024-11-08', '13:00:00', '14:00:00'), 
(5, 14, '2024-11-08', '14:15:00', '15:15:00'); 

INSERT INTO ChamCong (IDNhanVien, NgayLamViec, TrangThai) VALUES
(1, '2024-11-01', 'Có mặt'),   -- Nhân viên 1, ngày 1 tháng 11, có mặt
(1, '2024-11-02', 'Nghỉ'),     -- Nhân viên 1, ngày 2 tháng 11, nghỉ
(1, '2024-11-03', 'Có mặt'),   -- Nhân viên 1, ngày 3 tháng 11, có mặt
(2, '2024-11-01', 'Có mặt'),   -- Nhân viên 2, ngày 1 tháng 11, có mặt
(2, '2024-11-02', 'Có mặt'),   -- Nhân viên 2, ngày 2 tháng 11, có mặt
(2, '2024-11-03', 'Đi công tác'), -- Nhân viên 2, ngày 3 tháng 11, đi công tác
(3, '2024-11-01', 'Có mặt'),   -- Nhân viên 3, ngày 1 tháng 11, có mặt
(3, '2024-11-02', 'Nghỉ'),     -- Nhân viên 3, ngày 2 tháng 11, nghỉ
(3, '2024-11-03', 'Có mặt'),   -- Nhân viên 3, ngày 3 tháng 11, có mặt
(4, '2024-11-01', 'Có mặt'),   -- Nhân viên 4, ngày 1 tháng 11, có mặt
(4, '2024-11-02', 'Đi công tác'), -- Nhân viên 4, ngày 2 tháng 11, đi công tác
(4, '2024-11-03', 'Có mặt'),   -- Nhân viên 4, ngày 3 tháng 11, có mặt
(5, '2024-11-01', 'Có mặt'),   -- Nhân viên 5, ngày 1 tháng 11, có mặt
(5, '2024-11-02', 'Có mặt'),   -- Nhân viên 5, ngày 2 tháng 11, có mặt
(5, '2024-11-03', 'Nghỉ');     -- Nhân viên 5, ngày 3 tháng 11, nghỉ

INSERT INTO BaoCao (LoaiBaoCao, NgayTao, NhanVienID, NoiDung) VALUES
('Báo cáo tuần', '2024-11-01', 1, 'Báo cáo tổng kết công việc tuần 1 tháng 11, bao gồm các dự án đang thực hiện, tiến độ công việc và các khó khăn gặp phải.'),
('Báo cáo dự án', '2024-11-02', 2, 'Báo cáo chi tiết tiến độ dự án ABC, bao gồm các mốc hoàn thành, tình hình nhân lực, và các vấn đề cần giải quyết.'),
('Báo cáo nhân sự', '2024-11-03', 3, 'Báo cáo về tình hình nhân sự trong công ty, số lượng nhân viên mới, các đợt huấn luyện và sự thay đổi trong bộ máy.'),
('Báo cáo tuần', '2024-11-04', 4, 'Báo cáo tổng kết công việc tuần 2 tháng 11, kết quả các cuộc họp và kế hoạch tuần tới.'),
('Báo cáo dự án', '2024-11-05', 5, 'Báo cáo về tiến độ dự án XYZ, bao gồm các vấn đề phát sinh và kế hoạch điều chỉnh.'),
('Báo cáo nhân sự', '2024-11-06', 1, 'Báo cáo về tình hình đào tạo nhân viên, các khóa học đã triển khai và kết quả đạt được.'),
('Báo cáo tuần', '2024-11-07', 2, 'Báo cáo tổng hợp công việc của tuần, bao gồm các hoạt động chính và kết quả đạt được.'),
('Báo cáo dự án', '2024-11-08', 3, 'Báo cáo về tiến độ dự án, bao gồm tình hình tài chính, các thay đổi trong kế hoạch và các bước tiếp theo.'),
('Báo cáo nhân sự', '2024-11-09', 4, 'Báo cáo nhân sự, bao gồm các thay đổi về lương thưởng, phúc lợi và các sáng kiến phát triển nhân sự.'),
('Báo cáo tuần', '2024-11-10', 5, 'Báo cáo tuần 3 tháng 11, bao gồm kết quả công việc, các mục tiêu hoàn thành và kế hoạch cho tuần tới.'),
('Báo cáo dự án', '2024-11-11', 1, 'Báo cáo về tiến độ dự án DEF, tình hình triển khai và các vấn đề cần xử lý.'),
('Báo cáo nhân sự', '2024-11-12', 2, 'Báo cáo về việc tuyển dụng và đào tạo nhân viên mới, các thông tin liên quan đến phúc lợi và các thay đổi trong công ty.'),
('Báo cáo tuần', '2024-11-13', 3, 'Báo cáo tổng kết công việc của tuần 4 tháng 11, tình hình làm việc và các dự án đang triển khai.'),
('Báo cáo dự án', '2024-11-14', 4, 'Báo cáo tiến độ dự án GHI, các bước hoàn thành và vấn đề cần được giải quyết ngay lập tức.'),
('Báo cáo nhân sự', '2024-11-15', 5, 'Báo cáo về tình hình phúc lợi cho nhân viên, bao gồm các lợi ích và các yêu cầu trong việc thay đổi chế độ đãi ngộ.'),
('Báo cáo tuần', '2024-11-16', 1, 'Báo cáo tuần cuối tháng 11, kết quả công việc và các dự án hoàn thành trong tháng.'),
('Báo cáo dự án', '2024-11-17', 2, 'Báo cáo về các mốc quan trọng trong dự án LMN, tiến độ triển khai và các thay đổi cần thực hiện.'),
('Báo cáo nhân sự', '2024-11-18', 3, 'Báo cáo về các hoạt động phát triển nghề nghiệp cho nhân viên, các chương trình đào tạo đã triển khai trong tháng.'),
('Báo cáo tuần', '2024-11-19', 4, 'Báo cáo tổng kết tuần 5 tháng 11, các nhiệm vụ đã hoàn thành và kế hoạch cho tháng tiếp theo.'),
('Báo cáo dự án', '2024-11-20', 5, 'Báo cáo về dự án PQR, các thay đổi trong kế hoạch triển khai và các thử thách đã vượt qua.'),
('Báo cáo nhân sự', '2024-11-21', 1, 'Báo cáo về tình hình nhân sự trong công ty, bao gồm các chỉ số quan trọng về nhân viên, sự hài lòng và các thay đổi gần đây.');

INSERT INTO ThongBaoPhuHuynh (IDHocSinh, LoaiThongBao, NoiDung, NgayGui, GiaoVienID) VALUES
(1, 'Kết quả học tập', 'Học sinh Trần Văn U đã hoàn thành tốt các bài kiểm tra trong tháng, kết quả học tập đạt mức xuất sắc. Vui lòng theo dõi thêm quá trình học tập của bé.', '2024-11-01', 1),
(2, 'Lịch học', 'Học sinh Nguyễn Thị V sẽ tham gia lớp học Thể dục vào các ngày thứ 2 và thứ 5, bắt đầu từ tuần sau.', '2024-11-02', 2),
(3, 'Thông báo sức khỏe', 'Học sinh Phạm Văn W gặp vấn đề về dị ứng, cần chú ý khi thay đổi thức ăn hoặc môi trường. Mong phụ huynh theo dõi tình trạng sức khỏe của bé.', '2024-11-03', 3),
(4, 'Kết quả học tập', 'Học sinh Trần Thị X có kết quả học tập khá tốt nhưng cần cải thiện khả năng tập trung trong giờ học. Vui lòng trao đổi thêm với giáo viên về cách hỗ trợ bé.', '2024-11-04', 4),
(5, 'Lịch học', 'Học sinh Nguyễn Thị Y sẽ tham gia lớp học Tiếng Anh vào thứ 3 và thứ 6 hằng tuần, bắt đầu từ tuần này.', '2024-11-05', 5),
(6, 'Thông báo sức khỏe', 'Học sinh Đoàn Thị Z bị cảm nhẹ, vui lòng theo dõi sức khỏe bé và thông báo khi có thay đổi.', '2024-11-06', 1),
(7, 'Kết quả học tập', 'Học sinh Lê Thanh A đã hoàn thành các bài kiểm tra cuối kỳ và đạt kết quả khá cao. Tuy nhiên, cần duy trì sự tập trung trong học tập.', '2024-11-07', 2),
(8, 'Lịch học', 'Học sinh Nguyễn Minh B sẽ tham gia lớp học Nhạc vào thứ 4 và thứ 7 hằng tuần. Đảm bảo bé có đầy đủ đồ dùng cần thiết.', '2024-11-08', 3),
(9, 'Thông báo sức khỏe', 'Học sinh Trần Văn C đã hồi phục sau cơn bệnh và có thể tham gia lớp học bình thường. Chú ý đến sức khỏe bé trong thời gian tới.', '2024-11-09', 4),
(10, 'Kết quả học tập', 'Học sinh Phạm Minh D có tiến bộ trong việc học nhưng cần cải thiện khả năng làm bài tập về nhà.', '2024-11-10', 5),
(11, 'Lịch học', 'Học sinh Lê Thị E sẽ tham gia lớp học Toán vào thứ 2 và thứ 5 hằng tuần, bắt đầu từ tuần sau.', '2024-11-11', 1),
(12, 'Thông báo sức khỏe', 'Học sinh Vũ Quang F cần kiểm tra sức khỏe định kỳ vì có dấu hiệu yếu tố di truyền. Vui lòng theo dõi tình trạng sức khỏe của bé.', '2024-11-12', 2),
(13, 'Kết quả học tập', 'Học sinh Trần Thị G có kết quả học tập tốt trong học kỳ này, nhưng cần cải thiện khả năng giao tiếp nhóm.', '2024-11-13', 3),
(14, 'Lịch học', 'Học sinh Nguyễn Thị H sẽ tham gia lớp học Mỹ thuật vào thứ 3 và thứ 6 hằng tuần.', '2024-11-14', 4),
(15, 'Thông báo sức khỏe', 'Học sinh Đoàn Thị I cần nghỉ ngơi do bị cảm cúm nhẹ. Vui lòng cho bé nghỉ học cho đến khi khỏe.', '2024-11-15', 5),
(16, 'Kết quả học tập', 'Học sinh Lê Thị J có kết quả học tập rất tốt trong tuần qua. Chúc mừng bé đã đạt được các mục tiêu học tập.', '2024-11-16', 1),
(17, 'Lịch học', 'Học sinh Nguyễn Minh K sẽ tham gia lớp học Khoa học vào thứ 2 và thứ 4. Đảm bảo bé chuẩn bị sách vở đầy đủ.', '2024-11-17', 2),
(18, 'Thông báo sức khỏe', 'Học sinh Trần Văn L có tình trạng sức khỏe bình thường, nhưng cần chú ý đến chế độ ăn uống và nghỉ ngơi.', '2024-11-18', 3),
(19, 'Kết quả học tập', 'Học sinh Lê Thị M có kết quả học tập tốt trong tuần qua, nhưng cần duy trì sự chăm chỉ và kiên trì trong việc học.', '2024-11-19', 4),
(20, 'Lịch học', 'Học sinh Phạm Minh N sẽ tham gia lớp học Tiếng Anh vào thứ 2 và thứ 5 hằng tuần. Lịch học sẽ bắt đầu từ tuần này.', '2024-11-20', 5);

INSERT INTO DanhGia (IDPhuHuynh, IDGiaoVien, IDHocSinh, MucDoHaiLong, NhanXet, NgayDanhGia) VALUES
(1, 1, 1, 5, 'Con tôi Trần Văn U đã có sự tiến bộ rõ rệt trong học tập. Tôi rất hài lòng với kết quả và sự nỗ lực của bé.', '2024-11-01'),
(2, 2, 2, 4, 'Nguyễn Thị V đã cải thiện trong việc học nhưng vẫn cần thêm sự động viên để tập trung hơn.', '2024-11-02'),
(3, 3, 3, 3, 'Phạm Văn W cần cải thiện về mặt sức khỏe, nhưng tôi thấy bé đang cố gắng trong học tập.', '2024-11-03'),
(4, 4, 4, 4, 'Trần Thị X có tiến bộ trong học tập, nhưng cần chú ý hơn đến khả năng làm bài tập về nhà.', '2024-11-04'),
(5, 5, 5, 5, 'Nguyễn Thị Y là một học sinh ngoan ngoãn, chăm chỉ. Tôi rất hài lòng với kết quả học tập của bé.', '2024-11-05'),
(6, 1, 6, 4, 'Đoàn Thị Z có sức khỏe tốt hơn nhưng cần cải thiện kỹ năng giao tiếp trong lớp.', '2024-11-06'),
(7, 2, 7, 5, 'Lê Thanh A rất nỗ lực trong học tập và có kết quả rất tốt. Tôi rất vui mừng vì sự tiến bộ của bé.', '2024-11-07'),
(8, 3, 8, 3, 'Nguyễn Minh B cần sự hỗ trợ thêm về mặt học tập, nhất là trong các môn khoa học.', '2024-11-08'),
(9, 4, 9, 4, 'Trần Văn C có khả năng học hỏi nhanh chóng, tuy nhiên cần duy trì sự tập trung trong lớp.', '2024-11-09'),
(10, 5, 10, 5, 'Phạm Minh D đã có sự thay đổi rất tích cực, kết quả học tập ngày càng tốt hơn.', '2024-11-10'),
(11, 1, 11, 4, 'Lê Thị E học tập khá tốt, tuy nhiên bé cần cải thiện khả năng giao tiếp và làm việc nhóm.', '2024-11-11'),
(12, 2, 12, 5, 'Vũ Quang F là một học sinh xuất sắc trong lớp, có thành tích học tập tốt và luôn giúp đỡ bạn bè.', '2024-11-12'),
(13, 3, 13, 4, 'Trần Thị G có kết quả học tập ổn định, tuy nhiên cần duy trì sự nỗ lực không ngừng.', '2024-11-13'),
(14, 4, 14, 3, 'Nguyễn Thị H cần sự hỗ trợ thêm trong các môn Toán và Văn.', '2024-11-14'),
(15, 5, 15, 5, 'Đoàn Thị I có kết quả học tập tốt, sức khỏe cũng đã cải thiện nhiều.', '2024-11-15'),
(16, 1, 16, 4, 'Lê Thị J là một học sinh chăm chỉ, nhưng cần thêm sự kiên nhẫn trong học tập.', '2024-11-16'),
(17, 2, 17, 5, 'Nguyễn Minh K rất xuất sắc trong học tập, luôn hoàn thành tốt mọi bài tập và có thái độ học tập tích cực.', '2024-11-17'),
(18, 3, 18, 4, 'Trần Văn L cần chú ý đến các bài tập về nhà, nhưng bé vẫn có tiến bộ trong học tập.', '2024-11-18'),
(19, 4, 19, 3, 'Lê Thị M cần cải thiện sự tự tin trong giao tiếp và tăng cường khả năng tập trung hơn.', '2024-11-19'),
(20, 5, 20, 5, 'Phạm Minh N có thành tích học tập xuất sắc và rất tham gia các hoạt động của lớp.', '2024-11-20');
