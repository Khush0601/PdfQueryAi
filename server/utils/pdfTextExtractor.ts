import fs from "fs";
import axios from "axios";
import { PDFParse } from "pdf-parse";
// import OCR function when ready
// import { extractTextFromImage } from "./imageOCR";

/**
 * Extract text from ANY uploaded file
 */
export const extractText = async (file: Express.Multer.File): Promise<string> => {
  const fileUrl = (file as any).path || (file as any).secure_url;

  if (!fileUrl) {
    throw new Error("File URL not found");
  }

  if (file.mimetype === "application/pdf") {
    return extractPdfText(fileUrl);
  }

  if (file.mimetype === "text/plain") {
    const response = await axios.get(fileUrl);
    return response.data;
  }


  throw new Error("Unsupported file type");
};

/**
 * Extract text from PDF (Cloudinary URL)
 */
export const extractPdfText = async (pdfUrl: string): Promise<string> => {
  try {
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const parser = new PDFParse({ data: response.data });
    const result = await parser.getText();

    return result.text || "";
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
