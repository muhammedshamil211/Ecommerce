import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

// GET /api/cart — Get logged-in user's cart (populated)
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: "items.product",
            select: "title images price offer stock owner",
            populate: { path: "owner", select: "_id name" },
        });

        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [] } });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("GET CART ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST /api/cart/add — Add item or increment qty
export const addToCart = async (req, res) => {
    try {
        const { productId, qty = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create fresh cart
            cart = await Cart.create({
                user: req.user.id,
                items: [{ product: productId, qty }],
            });
        } else {
            const existingIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (existingIndex > -1) {
                // Increment qty
                cart.items[existingIndex].qty += qty;
            } else {
                // Add new item
                cart.items.push({ product: productId, qty });
            }
            await cart.save();
        }

        // Return populated cart
        await cart.populate({
            path: "items.product",
            select: "title images price offer stock",
        });

        res.status(200).json({
            success: true,
            message: "Added to cart",
            cart,
            cartCount: cart.items.reduce((acc, i) => acc + i.qty, 0),
        });
    } catch (error) {
        console.error("ADD TO CART ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// PUT /api/cart/update — Set specific qty for an item
export const updateCartItem = async (req, res) => {
    try {
        const { productId, qty } = req.body;

        if (!productId || qty === undefined) {
            return res.status(400).json({ success: false, message: "productId and qty required" });
        }

        if (qty < 1) {
            return res.status(400).json({ success: false, message: "qty must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find((i) => i.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }

        item.qty = qty;
        await cart.save();

        await cart.populate({
            path: "items.product",
            select: "title images price offer stock",
        });

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart,
            cartCount: cart.items.reduce((acc, i) => acc + i.qty, 0),
        });
    } catch (error) {
        console.error("UPDATE CART ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE /api/cart/remove/:productId — Remove a single item
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        await cart.save();

        await cart.populate({
            path: "items.product",
            select: "title images price offer stock",
        });

        res.status(200).json({
            success: true,
            message: "Item removed",
            cart,
            cartCount: cart.items.reduce((acc, i) => acc + i.qty, 0),
        });
    } catch (error) {
        console.error("REMOVE FROM CART ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE /api/cart/clear — Remove all items
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error("CLEAR CART ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
