import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Optional: manual type for safety
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;

