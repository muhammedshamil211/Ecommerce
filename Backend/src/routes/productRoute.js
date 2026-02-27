import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addProduct, deleteProduct, getByCategory, getMyProduct, mostVisitedProducts, recentProducts, updateProduct, viewAll } from "../controllers/productController.js";
import { checkProductOwner } from "../middleware/productOwnerMiddleware.js";

const router = express.Router();


// Private routes
router.post("/myproduct",protect,getMyProduct);
router.post("/add", protect, addProduct);
router.post("/update/:id", protect, checkProductOwner, updateProduct);
router.post("/delete/:id", protect, checkProductOwner, deleteProduct);


// Public routes
router.post("/viewall", viewAll);
router.post("/latest",recentProducts);
router.post("/mostViewed",mostVisitedProducts);
router.post("/:category",getByCategory);



export default router;