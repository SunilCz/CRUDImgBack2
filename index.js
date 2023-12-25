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
    origin: ["http://localhost:3000", "https://crudimg.netlify.app"],
  })
);

// Add this line after initializing your express app
app.use("/uploads", express.static("uploads"));

// using routes
app.use("/api/blog", BlogRouter);

// Add the following middleware to ensure the 'Access-Control-Allow-Origin' header is included
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://crudimg.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(port, () => {
  console.log("App is running on port: ", port);
});
