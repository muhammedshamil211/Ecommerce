import Order from "../model/Order.js";
import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

// POST /api/orders/place — Create order from cart, then clear cart
export const placeOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod = "cod" } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: "Shipping address is required" });
        }

        // Fetch user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "items.product",
            "title images price offer stock"
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Build order items snapshot, ignoring items whose products were fully deleted from DB
        const validItems = cart.items.filter(item => item.product);

        if (validItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart contains invalid products" });
        }

        const orderItems = validItems.map((item) => ({
            product: item.product._id,
            title: item.product.title,
            image: item.product.images?.[0] || "",
            price: item.product.offer || item.product.price,
            qty: item.qty,
        }));

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
        });

        // Clear cart after successful order
        await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("PLACE ORDER ERROR:", error);

        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, message });
        }

        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// GET /api/orders/my — Get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            total,
            orders,
        });
    } catch (error) {
        console.error("GET MY ORDERS ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET /api/orders/:id — Get a single order (owner only)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Ensure only the owner can view
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("GET ORDER ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// PUT /api/orders/:id/cancel — Cancel order (only if placed or processing)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        if (!["placed", "processing"].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled at this stage",
            });
        }

        order.orderStatus = "cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled",
            order,
        });
    } catch (error) {
        console.error("CANCEL ORDER ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
