const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", async (req, res) => {
    try {
        const productList = await Product.find();
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: productList
        });
    } catch (error) {

    }
})

router.post("/", async (req, res) => {
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
            image,
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



module.exports = router;