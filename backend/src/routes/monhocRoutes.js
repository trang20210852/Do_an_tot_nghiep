const express = require("express");
const router = express.Router();
const monHocController = require("../controllers/monhocController");

// Define routes for MonHoc
router.get("/getAllMonHoc", monHocController.getAllMonHoc);
router.post("/addMonHoc", monHocController.createMonHoc);
router.put("/updateMonHoc/:IDMonHoc", monHocController.updateMonHoc);
router.delete("/deleteMonHoc/:IDMonHoc", monHocController.deleteMonHoc);

module.exports = router;
