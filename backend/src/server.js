const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 3000;

// Middleware
app.use(express.json());

// Import routes
const nhanvienRoutes = require("./routes/nhanvienRoutes");
const hocsinhRoutes = require("./routes/hocsinhRoutes");
const lophocRoutes = require("./routes/lophocRoutes");
const phongbanRoutes = require("./routes/phongbanRoutes");
const monhocRoutes = require("./routes/monhocRoutes");
const phuhuynhRoutes = require("./routes/phuhuynhRoutes");
const lichhocRoutes = require("./routes/lichhocRoutes");
const chamcongRoutes = require("./routes/chamcongRoutes");
const baocaoRoutes = require("./routes/baocaoRoutes");
const thongbaophuhuynhRoutes = require("./routes/thongbaophuhuynhRoutes");
const danhgiaRoutes = require("./routes/danhgiaRoutes");

// Use routes
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/hocsinh", hocsinhRoutes);
app.use("/api/lophoc", lophocRoutes);
app.use("/api/thongbaophuhuynh", thongbaophuhuynhRoutes);
app.use("/api/phongban", phongbanRoutes);
app.use("/api/monhoc", monhocRoutes);
app.use("/api/phuhuynh", phuhuynhRoutes);
app.use("/api/lichhoc", lichhocRoutes);
app.use("/api/chamcong", chamcongRoutes);
app.use("/api/baocao", baocaoRoutes);
app.use("/api/danhgia", danhgiaRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
