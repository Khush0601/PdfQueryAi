import { Schema, model, Document } from "mongoose";

export interface IPdf extends Document {
  text: string;          
  fileUrl: string;        
  aiResponse?: string;    
  createdAt: Date;        
  updatedAt: Date;      
}

const PdfSchema = new Schema<IPdf>(
  {
    text: { type: String, required: true },    
    fileUrl: { type: String, required: true }, 
    aiResponse: { type: String },              
  },
  { timestamps: true } 
);

export const Pdf = model<IPdf>("Pdf", PdfSchema);
