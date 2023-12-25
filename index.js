// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./db/database.js"; // Assuming this file contains your database connection setup
import BlogRouter from "./routes/blog.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());

// Specify the allowed origins in the cors middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://crudimg.netlify.app/"], // Add your frontend URL(s) here
  })
);

// Add this line after initializing your express app
app.use("/uploads", express.static("uploads"));

// using routes
app.use("/api/blog", BlogRouter);

app.listen(port, () => {
  console.log("App is running on port: ", port);
});
