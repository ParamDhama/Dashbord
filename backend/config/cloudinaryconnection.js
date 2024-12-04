const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log('cloudinary.config', process.env.CLOUDINARY_CLOUD_NAME,
   process.env.API_KEY, 
  process.env.API_SECRET)
module.exports = cloudinary;
