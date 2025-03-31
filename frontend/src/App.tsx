import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./index.css"; // Đảm bảo Tailwind được load
import MainLayout from "./layouts/MainLayout";
import AddBranch from "./pages/TruongHoc/AddBranch";
import Staff from "./pages/TruongHoc/Staff";
import StaffDetail from "./pages/TruongHoc/StaffDetail";
import TruongProfile from "./pages/TruongHoc/SchoolProfile";
import ClassesPage from "./pages/TruongHoc/Classes";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<MainLayout />}>
                    <Route path="add-branch" element={<AddBranch />} />
                    <Route path="staff" element={<Staff />} />
                    <Route path="staff/:idTruong/:idNhanVien" element={<StaffDetail />} />
                    <Route path="truong/:idTruong/profile" element={<TruongProfile />} />
                    <Route path="classes" element={<ClassesPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
