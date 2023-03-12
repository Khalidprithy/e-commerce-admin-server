const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        title: { type: String, require: true, unique: true },
        tagline: { type: String, require: true },
        image: { type: String, require: true },
        description: { type: Array },
        price: { type: Number, require: true },
        stock: { type: Number, require: true },
        discount: { type: Number },
        category: { type: Array },
        subCategory: { type: String },
        sold: { type: Number },
        offer: { type: Boolean, default: false, },
        reviews: { type: Array },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);