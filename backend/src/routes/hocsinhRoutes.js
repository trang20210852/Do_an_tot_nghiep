const express = require("express");
const router = express.Router();
const hocSinhController = require("../controllers/hocsinhController");

// Define routes for HocSinh
// router.get("/getAllHocSinh", hocSinhController.getAllHocSinh);
// router.post("/addHocSinh", hocSinhController.createHocSinh);

// router.put("/updateHocSinh/:IDHocSinh", hocSinhController.updateHocSinh);
// router.delete("/deleteHocSinh/:IDHocSinh", hocSinhController.deleteHocSinh);
router.get("/getAllHocSinh", hocSinhController.getAllHocSinh);
router.get("/getAllHocSinh/by-ids", hocSinhController.getHocSinhByIDs);
router.post("/addHocSinh", hocSinhController.addHocSinh);
router.put("/updateHocSinh", hocSinhController.updateHocSinh);

module.exports = router;
