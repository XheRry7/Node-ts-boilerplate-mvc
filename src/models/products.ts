import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    category: { type: String, enum: ["men's", "women's", 'children', 'sports', 'toys', 'watches', 'groceries'], required: true },
    brandName: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true
    },
    images: [{
        type: String,
    }]
});

export const Products = mongoose.model("product", productSchema);