const express = require("express");
const router = express.Router();
const thongBaoPhuHuynhController = require("../controllers/thongbaophuhuynhController");

// Define routes for ThongBaoPhuHuynh
router.get("/getAllThongBaoPhuHuynh", thongBaoPhuHuynhController.getAllThongBaoPhuHuynh);
router.post("/addThongBaoPhuHuynh", thongBaoPhuHuynhController.createThongBaoPhuHuynh);
router.put("/updateThongBaoPhuHuynh/:IDThongBao", thongBaoPhuHuynhController.updateThongBaoPhuHuynh);
router.delete("/deleteThongBaoPhuHuynh/:IDThongBao", thongBaoPhuHuynhController.deleteThongBaoPhuHuynh);

module.exports = router;
