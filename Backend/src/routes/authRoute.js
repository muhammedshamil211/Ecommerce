import express from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser, editUser } from "../controllers/authController.js";
import { loginValidator, registerValidator, updateUserValidator } from "../validator/authValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",registerValidator,validate, registerUser);
router.post("/login",loginLimiter ,loginValidator,validate, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

router.post("/updateUser",protect,updateUserValidator,validate,editUser);

export default router;