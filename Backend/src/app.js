import express from "express";
import authRoutes from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";
// import { globalLimiter } from "./middleware/rateLimitMiddleware.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

export default app;