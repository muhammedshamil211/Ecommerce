import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },
        offer:{
            type:Number,
            default:0
        },
        category: {
            type: String,
            required: true,
            index: true,
        },

        images: [String],

        stock: {
            type: Number,
            default: 0,
        },

        views: {
            type: Number,
            default: 0,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }

)

productSchema.index({ createdAt: -1 });
productSchema.index({ views: -1 });

const Product = mongoose.model("Product",productSchema);

export default Product;