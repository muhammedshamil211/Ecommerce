import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addProduct, deleteProduct, getByCategory, getMyProduct, getProductData, likeCount, mostVisitedProducts, recentProducts, updateProduct, viewAll, wishlist } from "../controllers/productController.js";
import { checkProductOwner } from "../middleware/productOwnerMiddleware.js";

const router = express.Router();


// Private routes
router.post("/myproduct", protect, getMyProduct);
router.post("/add", protect, addProduct);
router.post("/update/:id", protect, checkProductOwner, updateProduct);
router.post("/delete/:id", protect, checkProductOwner, deleteProduct);
router.post("/edit/:id", getProductData);


// Public routes
router.post("/viewall", viewAll);
router.post("/latest", recentProducts);
router.post("/mostViewed", mostVisitedProducts);
router.post("/:category", getByCategory);

// Functional routes
router.post("/like/:id", protect, likeCount);
router.post("/user/wishlist",protect,wishlist);



export default router;