import type { Request, Response } from "express";
import { Pdf } from "../model/pdf.model.js";
import { PdfChunk } from "../model/pdfChunk.model.js";
import { extractText } from "../utils/pdfTextExtractor.js";
import { splitText } from "../utils/textSplitter.js";
import { generateEmbedding } from "../utils/embedding.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export const fileUploadController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text } = req.body; 
    const file = req.file;
    if (!text) {
      res.status(400).json({ message: "Question is required" });
      return;
    }

    if (!file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const fileUrl =
      (file as any).path ||
      (file as any).secure_url ||
      (file as any).url;

    if (!fileUrl?.startsWith("http")) {
      res.status(500).json({ message: "Invalid file URL" });
      return;
    }
    const fileDoc = await Pdf.create({
      text,
      fileUrl,
      aiResponse: "",
    });

    const fullText = await extractText(file);
    if (!fullText || !fullText.trim()) {
      res.status(400).json({ message: "Failed to extract text from file" });
      return;
    }

    
    const chunks = splitText(fullText);
    if (!chunks.length) {
      res.status(400).json({ message: "No chunks created" });
      return;
    }

    const questionEmbedding = await generateEmbedding(text);
    const scoredChunks: { text: string; score: number }[] = [];

    for (const chunkText of chunks) {
      const chunkEmbedding = await generateEmbedding(chunkText);

      await PdfChunk.create({
        pdfId: fileDoc._id,
        chunkText,
        embedding: chunkEmbedding,
      });

      const score = cosineSimilarity(questionEmbedding, chunkEmbedding);
      scoredChunks.push({ text: chunkText, score });
    }

    // select top chunks
    const topChunks = scoredChunks
      .filter(c => c.score > 0.25)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(c => c.text)
      .join("\n\n");

   
    const prompt = `
You are an intelligent and knowledgeable AI assistant.

You are given content extracted from a file uploaded by the user.
The file may be a PDF, text file, or an image.

Instructions:
1. Use the extracted content as a base.
2. Enrich the answer using your own general knowledge when helpful.
3. Add explanations, real-world examples, and missing insights.
4. Do NOT mention whether something is present or missing in the document.
5. Provide a clear, informative, and value-adding response.

Extracted Content:
${topChunks || fullText}

User Question:
${text}

Answer:
`;

    
 const result = await genAI.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

const answer =
  result.candidates?.[0]?.content?.parts?.[0]?.text ||
  "Unable to generate answer";
    fileDoc.aiResponse = answer;
    await fileDoc.save();

    res.status(201).json({
      success: true,
      message: "File uploaded and answered successfully",
      data: fileDoc,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};
