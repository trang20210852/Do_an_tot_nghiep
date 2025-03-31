const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register-truong", authController.registerTruongHoc);
router.post("/register-canbo", authController.registerCanBo);
router.post("/register-phuhuynh", authController.registerPhuHuynh);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
module.exports = router;
