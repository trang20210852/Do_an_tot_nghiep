const express = require("express");
const router = express.Router();
const chamCongController = require("../controllers/chamcongController");

// Define routes for ChamCong
router.get("/getAllChamCong", chamCongController.getAllChamCong);
router.post("/addChamCong", chamCongController.createChamCong);
router.put("/updateChamCong/:IDChamCong", chamCongController.updateChamCong);
router.delete("/deleteChamCong/:IDChamCong", chamCongController.deleteChamCong);

module.exports = router;
