const express = require("express");
const router = express.Router();
const baoCaoController = require("../controllers/baocaoController");

// Define routes for BaoCao
router.get("/getAllBaoCao", baoCaoController.getAllBaoCao);
router.post("/addBaoCao", baoCaoController.createBaoCao);
router.put("/updateBaoCao/:IDBaoCao", baoCaoController.updateBaoCao);
router.delete("/deleteBaoCao/:IDBaoCao", baoCaoController.deleteBaoCao);

module.exports = router;
