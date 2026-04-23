import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        title: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        orderId: {
            type: String,
            unique: true,
        },

        items: [orderItemSchema],

        shippingAddress: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pin: { type: String, required: true },
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "card", "upi"],
            required: true,
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
            default: "placed",
        },

        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Auto-generate a human-readable orderId before save
orderSchema.pre("save", function () {
    if (!this.orderId) {
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.orderId = `ORD-${rand}`;
    }
});

orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
