const bcrypt = require('bcrypt');
const { query } = require('express');
const Product = require('../models/product');
const { verifyTokenAndAdmin, verifyToken } = require('./verifyAuth');

const router = require('express').Router();


// Create product

router.post("/", verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new Product(req.body);
    console.log(newProduct)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// Update a product

router.put("/:productId", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Delete a product

router.delete("/:productId", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Find a product

router.get("/:productId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" })
        }
        else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


// Get all products

router.get("/", async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    const querySubCategory = req.query.subCategory;
    try {
        let products;

        if (queryNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (queryCategory) {
            products = await Product.find({
                category: {
                    $in: [queryCategory]
                },
            })
        } else if (querySubCategory) {
            products = await Product.find({
                category: {
                    $in: [querySubCategory]
                },
            })
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


module.exports = router