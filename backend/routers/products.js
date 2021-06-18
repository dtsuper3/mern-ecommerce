const express = require('express');
const mongoose = require('mongoose');
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require("../models/product");
const multer = require('multer');
const { createFolder } = require('../helpers/lib');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const path = process.env.FILE_PATH;
            createFolder(path)
            cb(null, path);
        } catch (error) {
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const filename = file.originalname.split(" ").join("-");
        cb(null, filename + "-" + uniqueSuffix)
    }
})

const uploadOptions = multer({ storage })

router.get("/", async (req, res) => {
    try {
        const { categories } = req.query;
        // console.log(categories);
        let filter = {};
        if (categories) {
            filter = {
                category: categories.split(',')
            }
        }
        const productList = await Product.find(filter)
            .populate("category");
        if (!productList) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: {
                products: productList
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null
        });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category");
        if (!product) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: []
            });
        }
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            data: []
        });
    }
})

router.post("/", uploadOptions.single("image"), async (req, res) => {
    const {
        name,
        description,
        richDescription,
        brand,
        price,
        category: categoryId,
        countInStock,
        rating,
        numReviews,
        isFeatured
    } = req.body;
    const filename = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}${process.env.FILE_PATH}`;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400)
                .json({
                    status: false,
                    message: "Invalid Category"
                })
        }
        let product = new Product({
            name,
            description,
            richDescription,
            image: `${basePath}${filename}`,
            brand,
            price,
            category: categoryId,
            countInStock,
            rating,
            numReviews,
            isFeatured
        })
        product = await product.save();
        if (!product) {
            return res.status(500)
                .json({
                    status: false,
                    message: "Product cannot be created"
                });
        }
        res.status(200)
            .json({
                status: true,
                message: "Product created",
                data: product
            })
    } catch (error) {
        console.log(error.message)
        res.status(500)
            .json({
                status: false,
                message: "Product cannot be created"
            });
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400)
                .json({
                    status: false,
                    message: "Invalid Product ID"
                })
        }
        const {
            name,
            description,
            richDescription,
            image,
            brand,
            price,
            category: categoryId,
            countInStock,
            rating,
            numReviews,
            isFeatured
        } = req.body;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400)
                .json({
                    status: false,
                    message: "Invalid Category"
                })
        }
        const product = await Product.findByIdAndUpdate(id, {
            name,
            description,
            richDescription,
            image,
            brand,
            price,
            category: categoryId,
            countInStock,
            rating,
            numReviews,
            isFeatured
        }, {
            new: true
        })
        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            status: true,
            message: "Product updated",
            data: product
        });
    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            status: 400,
            message: "Something went wrong"
        });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400)
                .json({
                    status: false,
                    message: "Invalid Product ID"
                })
        }
        const product = await Product.findByIdAndRemove(id);
        if (product) {
            return res.status(200).json({
                status: true,
                message: "Product is deleted"
            });
        }
        return res.status(404).json({
            status: false,
            message: "Product not found"
        })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            status: false,
            message: "Something went wrong"
        })
    }
})

router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments(count => count);
        if (!productCount) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: 0
            });
        }
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: { productCount }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            data: 0
        });
    }
})

router.get('/get/featured/:count', async (req, res) => {
    try {
        let { count } = req.params;
        count = count ? +count : 0;
        const featuredProductList = await Product.find({
            isFeatured: true
        }).limit(count);
        if (!featuredProductList) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: []
            });
        }
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: featuredProductList
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            data: []
        });
    }
})

module.exports = router;