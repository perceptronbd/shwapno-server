/* eslint-disable @typescript-eslint/no-unused-vars */
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.cwd() + "/uploads/";
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix;
    cb(null, filename);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    cb(null, true); // Accept file
  },
});

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
