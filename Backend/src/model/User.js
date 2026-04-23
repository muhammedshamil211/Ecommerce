import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        phoneNumber: {
            type: Number,
        }, address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        },
        avathar: {
            type: String
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },
    },
    { timestamps: true }
);



userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;