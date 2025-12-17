import { Schema, model, Document, Types } from "mongoose";

export interface IPdfChunk extends Document {
  pdfId: Types.ObjectId;      
  chunkText: string;         
  embedding: number[];      
}

const PdfChunkSchema = new Schema<IPdfChunk>(
  {
    pdfId: {
      type: Schema.Types.ObjectId,
      ref: "Pdf",
      required: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export const PdfChunk = model<IPdfChunk>(
  "PdfChunk",
  PdfChunkSchema
);
