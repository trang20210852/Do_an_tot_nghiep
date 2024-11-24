const express = require("express");
const router = express.Router();
const phuHuynhController = require("../controllers/phuhuynhController");

// Define routes for PhuHuynh
router.get("/", phuHuynhController.getAllPhuHuynh);
router.post("/", phuHuynhController.createPhuHuynh);
router.put("/:IDPhuHuynh", phuHuynhController.updatePhuHuynh);
router.delete("/:IDPhuHuynh", phuHuynhController.deletePhuHuynh);

module.exports = router;
