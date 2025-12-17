import { Router } from "express";
import upload from "../middlewares/uploads.middleware.js";
import { fileUploadController } from "../controller/pdf.controller.js";

const router = Router();

router.post("/upload",upload.single("file"),fileUploadController);

export default router;
