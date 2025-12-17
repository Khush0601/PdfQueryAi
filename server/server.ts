import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import AppConfig from "./configs/app_config.js";
import DBConfig from "./configs/db_config.js";
import mongoose from "mongoose";
import pdfRoutes from "./routes/pdf.routes.js"


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/pdfQueryAi", pdfRoutes);



mongoose.connect(DBConfig.DB_URL)
const db = mongoose.connection;
db.on("error", () => {
  console.error("Error while connecting to the database");
});
db.once("open", () => {
  console.log("Connected to MongoDB successfully");
});


app.listen(AppConfig.PORT, () => {
  console.log(`Server running on port ${AppConfig.PORT}`);
});
