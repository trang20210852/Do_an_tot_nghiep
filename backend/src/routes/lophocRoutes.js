const express = require("express");
const router = express.Router();
const lopHocController = require("../controllers/lophocController");

// Define routes for LopHoc
router.get("/getAllLopHoc", lopHocController.getAllLopHoc);
router.post("/addLopHoc", lopHocController.createLopHoc);
router.put("/updateLopHoc/:IDLopHoc", lopHocController.updateLopHoc);
router.delete("/deleteLopHoc/:IDLopHoc", lopHocController.deleteLopHoc);

module.exports = router;
