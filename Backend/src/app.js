import express from "express";
import authRoutes from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js"
import cookieParser from "cookie-parser";
import { globalLimiter } from "./middleware/rateLimitMiddleware.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/product",productRoute);

export default app;