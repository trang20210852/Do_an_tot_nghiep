const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "giayPhepTruong",
        allowedFormats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage: storage });

router.post("/register-truong", upload.single("giayPhepHoatDong"), authController.registerTruongHoc);

router.post("/register-canbo", authController.registerCanBo);
router.post("/register-phuhuynh", authController.registerPhuHuynh);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
module.exports = router;
