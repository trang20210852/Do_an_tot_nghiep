const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
    cloud_name: "dgkfmvxat",
    api_key: "138379397558513",
    api_secret: "8xNy5L9dtZXRF1S2cNv_133PntI", // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;