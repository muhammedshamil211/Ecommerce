import express from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/authController.js";
import { loginValidator, registerValidator } from "../validator/authValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register",registerValidator,validate, registerUser);
router.post("/login",loginLimiter ,loginValidator,validate, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;