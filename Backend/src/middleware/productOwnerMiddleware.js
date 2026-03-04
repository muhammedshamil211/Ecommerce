import Product from "../model/Product.js";

export const checkProductOwner = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log("PRODUCT",product);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  if (product.owner.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  req.product = product;
  next();
};