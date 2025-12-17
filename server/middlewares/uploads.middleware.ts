import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { Request } from "express";
import cloudinary from "../configs/cloudinary.js";

/**
 * Allowed file types
 */
const allowedTypes = [
  "application/pdf",
  "text/plain",
  // "image/png",
  // "image/jpeg",
  // "image/jpg",
];

/**
 * Multer file filter
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
   cb(new Error("Unsupported file type") as any, false);
  }
};

/**
 * Cloudinary storage config
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    const isImage = file.mimetype.startsWith("image/");

    return {
      folder: "pdfqueryai",
      resource_type: "raw", // 
      public_id: file.originalname.replace(/\.[^/.]+$/, ""), // removes any extension
    };
  },
});

/**
 * Multer upload middleware
 */
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
