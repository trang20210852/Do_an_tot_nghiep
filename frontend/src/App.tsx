import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Public/LandingPage";
import LoginPage from "./pages/Public/LoginPage";
import RegisterPage from "./pages/Public/RegisterPage";
import "./index.css"; // Đảm bảo Tailwind được load
import MainLayout from "./layouts/MainLayout";
import Staff from "./pages/School/Staff";
import StaffDetail from "./pages/School/StaffDetail";
import TruongProfile from "./pages/School/SchoolProfile";
import RoomPage from "./pages/School/RoomPage";
import StudentPage from "./pages/School/StudentPage";
import ClassesPage from "./pages/School/Classes";
import StudentDetailPage from "./pages/School/StudentDetailPage";
import ParentHome from "./pages/Parent/ParentHome";
import ChildDetail from "./pages/Parent/ChildDetail";
import ParentAccount from "./pages/Parent/ParentAccount";
import ClassDetail from "./pages/School/ClassDetail";
import StudentList from "./pages/Teacher/StudentList";
import StudentFeedback from "./pages/Teacher/StudentFeedback";
import SendNotification from "./pages/Teacher/SendNotification";
import ApproveLeaveRequest from "./pages/Teacher/ApproveLeaveRequest";
import Notification from "./pages/Parent/Notification";
import SchoolHomePage from "./pages/School/SchoolHomePage";
import SearchSchool from "./pages/Public/SearchSchool";
import TuitionPayment from "./pages/Parent/PaymentPage";
import TuitionManagement from "./pages/School/TuitionManagement";
import SchoolDetails from "./pages/Public/SchoolDetails";
import AdminSchoolList from "./components/AdminSchoolList";
import LopChuNhiem from "./pages/Teacher/ClassesManage";
import TeacherProfile from "./pages/Teacher/TeacherProfile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin" element={<AdminSchoolList />} />
                <Route path="/search-school" element={<SearchSchool />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/:idTruong/:state" element={<SchoolDetails />} />
                <Route path="/dashboard" element={<MainLayout />}>
                    {/* Quản lý học sinh */}
                    <Route path="student" element={<StudentPage />} />
                    <Route path="student/:idTruong/:idHocSinh" element={<StudentDetailPage />} />

                    {/* Quản lý cán bộ */}
                    <Route path="staff" element={<Staff />} />
                    <Route path="staff/:idTruong/:idNhanVien" element={<StaffDetail />} />

                    {/* Quản lý trường */}
                    <Route path="" element={<SchoolHomePage />} />

                    <Route path="truong/:idTruong/profile" element={<TruongProfile />} />
                    <Route path="classes" element={<ClassesPage />} />
                    <Route path="classes/:id" element={<ClassDetail />} />
                    <Route path="phonghoc" element={<RoomPage />} />

                    {/* Giáo viên */}
                    <Route path="giaovien/student-list/:IDLopHoc" element={<StudentList />} />
                    <Route path="giaovien/student-feedback" element={<StudentFeedback />} />
                    <Route path="giaovien/send-notification" element={<SendNotification />} />
                    <Route path="giaovien/approve-leave" element={<ApproveLeaveRequest />} />
                    <Route path="giaovien/lop-chu-nhiem" element={<LopChuNhiem />} />
                    <Route path="giaovien/profile" element={<TeacherProfile />} />
                    <Route path="tuition-management" element={<TuitionManagement />} />
                </Route>

                {/* Phụ huynh */}
                <Route path="/parents" element={<MainLayout />}>
                    <Route path="" element={<ParentHome />} />
                    <Route path="children/:idHocSinh" element={<ChildDetail />} />
                    <Route path="profile" element={<ParentAccount />} />
                    <Route path="notifications" element={<Notification />} />
                    <Route path="payment/:idHocSinh" element={<TuitionPayment />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
