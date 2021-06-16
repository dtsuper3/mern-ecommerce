const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            return res.status(500).json({ status: false, message: "Category not found" });
        }
        res.status(200).json({
            status: true,
            data: categoryList,
            message: "Category found"
        });
    } catch (error) {
        console.error(error.message)
        res.status(500)
            .json({
                status: false,
                message: "Category not found",
                data: []
            });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(500).json({
                status: false,
                message: "The Category with the given ID was not found.",
                data: []
            });
        }
        res.status(200)
            .json({
                status: true,
                message: "Category found.",
                data: category
            });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "The Category with the given ID was not found.",
            data: []
        });
    }
})

router.post("/", async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    try {
        category = await category.save();
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "category cannot be created!"
            });
        }
        res.send(category);
    } catch (err) {
        console.error(error.message)
        res.status(404).json({
            status: false,
            message: "category cannot be created!"
        });
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }, {
            new: true
        })
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "category not found"
            });
        }
        res.status(200).json({
            status: true,
            message: "category update",
            data: category
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
        const category = await Category.findByIdAndRemove(id);
        if (category) {
            return res.status(200).json({
                status: true,
                message: "Category is deleted"
            });
        }
        return res.status(404).json({
            status: false,
            message: "Category not found"
        })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            status: false,
            message: "Something went wrong"
        })
    }
})

module.exports = router;