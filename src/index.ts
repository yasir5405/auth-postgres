import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
import express from "express";
import { authRouter } from "./routes/auth.route";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

connectDB();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to backend",
  });
});

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
