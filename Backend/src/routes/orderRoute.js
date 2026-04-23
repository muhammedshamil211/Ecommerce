import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// All order routes require authentication
router.post("/place", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
