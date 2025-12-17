import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

const MAX_RETRIES = 3;

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!text?.trim()) {
    throw new Error("Text cannot be empty for embedding generation");
  }

  const MAX_CHARS = 5000;
  const inputText = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result: any = await genAI.models.embedContent({
        model: "text-embedding-004",
        contents: {
          role: "user",
          parts: [{ text: inputText }],
        },
      });

     
      if (
        !result.embeddings ||
        !Array.isArray(result.embeddings) ||
        !Array.isArray(result.embeddings[0]?.values)
      ) {
        throw new Error("Invalid embedding response from Gemini");
      }

      return result.embeddings[0].values;
    } catch (err: any) {
      console.warn(
        `Embedding attempt ${attempt + 1} failed: ${err.message || err}`
      );

      if (attempt === MAX_RETRIES - 1) {
        throw new Error(
          `Failed to generate embedding after ${MAX_RETRIES} attempts`
        );
      }

    
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("Unexpected error in generateEmbedding");
};
