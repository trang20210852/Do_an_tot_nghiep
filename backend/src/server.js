const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();
const truongRoutes = require("./routes/truongRoutes");
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json()); // Quan trọng để đọc dữ liệu JSON
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/truonghoc", truongRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});
