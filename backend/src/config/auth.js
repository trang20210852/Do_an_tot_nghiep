const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // 👈 Log 1

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ Không có Bearer token");
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("✅ Token hợp lệ:", decoded); // 👈 Log 2
        next();
    } catch (err) {
        console.log("❌ Lỗi giải mã token:", err.message); // 👈 Log 3
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }
};
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("[DEBUG] Authorization header:", authHeader); // 👈 Log 1

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("[DEBUG] ❌ Không có Bearer token hoặc định dạng không hợp lệ"); // 👈 Log 2
        return res.status(401).json({ message: "Không có token hoặc định dạng không hợp lệ!" });
    }

    const token = authHeader.split(" ")[1];
    console.log("[DEBUG] Extracted token:", token); // 👈 Log 3

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("[DEBUG] ✅ Token decoded:", decoded); // 👈 Log 4

        // Kiểm tra role con (SubRole)
        if (decoded.Role !== "Cán Bộ" || decoded.SubRole !== "Admin") {
            console.log("[DEBUG] ❌ Người dùng không phải Admin. SubRole:", decoded.SubRole); // 👈 Log 5
            return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
        }

        req.user = decoded; // Lưu thông tin người dùng vào request
        console.log("[DEBUG] ✅ Người dùng được xác thực là Admin:", decoded); // 👈 Log 6
        next();
    } catch (error) {
        console.log("[DEBUG] ❌ Lỗi giải mã token:", error.message); // 👈 Log 7
        return res.status(403).json({ message: "Token không hợp lệ!" });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin,
};

module.exports = {
    verifyToken,
    verifyAdmin,
};
