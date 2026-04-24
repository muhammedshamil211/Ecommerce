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

// Functional routes (must be above /:category wildcard)
router.post("/like/:id", protect, likeCount);
router.post("/user/wishlist", protect, wishlist);

// Public routes
router.post("/viewall", viewAll);
router.post("/latest", recentProducts);
router.post("/mostViewed", mostVisitedProducts);

// Wildcard MUST be last — catches /electronics, /clothing etc.
router.post("/:category", getByCategory);




export default router;