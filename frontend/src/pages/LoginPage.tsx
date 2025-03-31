import React, { useState } from "react";
import RoleSelection from "../components/RoleSelection";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
    const [role, setRole] = useState<string | null>(null);

    return role ? <AuthForm role={role} /> : <RoleSelection onSelectRole={setRole} availableRoles={["Cán Bộ", "Phụ Huynh"]} />;
};

export default LoginPage;
