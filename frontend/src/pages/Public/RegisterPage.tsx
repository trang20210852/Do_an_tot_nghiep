import React, { useState } from "react";
import RoleSelection from "../../components/RoleSelection";
import RegisterForm from "../../components/RegisterForm";

const RegisterPage = () => {
    const [role, setRole] = useState<string | null>(null);

    return role ? <RegisterForm role={role} /> : <RoleSelection onSelectRole={setRole} availableRoles={["Trường Học", "Cán Bộ", "Phụ Huynh"]} />;
};

export default RegisterPage;
