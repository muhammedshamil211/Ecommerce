import Product from "../model/Product.js";
import mongoose from "mongoose";


// Add products only  logged user can only add products
export const addProduct = async (req, res) => {
    try {
        console.log("I am here");
        const product = await Product.create({
            ...req.body,
            owner: req.user.id,
        })

        res.status(201).json({
            success: true,
            message: "product added successfully",
            product
        });
    } catch (err) {
        console.error("ADD PRODUCT ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Server errror"
        });
    }
}



// Update products only the owner can only update the product he can only update his product only
export const updateProduct = async (req, res) => {
    try {
        req.product.set(req.body);

        await req.product.save();

        res.status(200).json({
            success: true,
            message: "product updated successfully",
            product: req.product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


// delete product only owner has the access to do this action 
export const deleteProduct = async (req, res) => {
    try {
        await req.product.deleteOne();

        res.status(200).json({
            success: true,
            message: "product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Servor issue"
        })
    }
}



// view all products

export const viewAll = async (req, res) => {
    try {
        const products = await Product.find().populate("owner", "_id name");

        res.status(200).json({
            success: true,
            message: "All products",
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server issue"
        });
    }
}
export const getProductData = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { returnDocument: 'after' }
        ).populate("owner", "_id name email createdAt");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Success",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}
export const getMyProduct = async (req, res) => {
    try {
        const products = await Product.find({
            owner: req.user.id
        }).sort({ ceatedAt: -1 }).populate("owner", "_id name");

        res.status(200).json({
            success: true,
            message: "successfully fetch my products",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server issue"
        });
    }
}


export const recentProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-likedBy").populate("owner", "_id name");

        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            page,
            totalPage: Math.ceil(total / limit),
            totalProducts: total,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent products"
        });
    }
}


export const mostVisitedProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit)
            .select("-likedBy").populate("owner", "_id name");

        const total = await Product.countDocuments();

        res.status(200).json({
            success: true,
            page,
            totalPage: Math.ceil(total / limit),
            totalProducts: total,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch most viewed products"
        });
    }
}



export const getByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find({ category })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-likedBy").populate("owner", "_id name");

        const total = await Product.countDocuments({ category });

        res.status(200).json({
            success: true,
            category,
            page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            products,
            message: "Iam here for u"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category products",
        });
    }
};


export const likeCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const alreadyLiked = product.likes.includes(userId);

        if (alreadyLiked) {
            product.likes.pull(userId);
        } else {
            product.likes.push(userId);
        }

        await product.save();

        res.status(200).json({
            success: true,
            liked: !alreadyLiked,
            likeCount: product.likes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
}



export const wishlist = async (req, res) => {
    try {
        const products = await Product.find({
            likes: req.user.id
        }).populate("owner", "_id name");

        res.status(200).json({
            success: true,
            message: "trueeeeeeee",
            products
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
};