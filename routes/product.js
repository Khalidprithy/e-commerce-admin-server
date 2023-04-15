const bcrypt = require('bcrypt');
const { query } = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { verifyTokenAndAdmin, verifyToken } = require('./verifyAuth');

const router = require('express').Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now();

        cb(null, fileName + fileExt)
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB file size limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
            return cb(new Error('Only PNG, JPEG, and GIF images are allowed'))
        }
        cb(null, true)
    }
});


// Create a product

router.post("/", verifyTokenAndAdmin, upload.single('image'), async (req, res) => {
    try {
        // Check if product with the same title already exists
        const existingProduct = await Product.findOne({ title: req.body.title });
        if (existingProduct) {
            return res.status(400).json({ message: "A Product with same title already exists" });
        }

        const newProduct = new Product({
            ...req.body,
            image: req.file.path
        });
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


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