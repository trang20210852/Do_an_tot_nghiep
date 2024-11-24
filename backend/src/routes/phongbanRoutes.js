const express = require("express");
const router = express.Router();
const phongBanController = require("../controllers/phongbanController");

// Define routes for PhongBan
router.get("/getAllPhongBan", phongBanController.getAllPhongBan);
router.post("/addPhongBan", phongBanController.createPhongBan);
router.put("/updatePhongBan/:IDPhongBan", phongBanController.updatePhongBan);
router.delete("/deletePhongBan/:IDPhongBan", phongBanController.deletePhongBan);

module.exports = router;
