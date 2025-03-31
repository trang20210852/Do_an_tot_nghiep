const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "truonghoc-avatars", // thư mục trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 300, height: 300, crop: "limit" }],
    },
});

const upload = multer({ storage });

module.exports = upload;
