const { v2: cloudinary } = require("cloudinary");

const FOLDER = process.env.CLOUDINARY_FOLDER || "wedding-gallery";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = { cloudinary, FOLDER };
