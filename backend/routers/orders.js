const express = require("express");
const { validationResult } = require("express-validator");
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { postOrderValidator } = require("../validators/ordersValidator");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const orderList = await Order.find()
            .populate("user", "name")
            .sort({ "dateOrdered": -1 })

        if (!orderList) {
            return res.status(500).json({ status: false, message: "Order not found" });
        }
        res.status(200).json({
            status: true,
            data: {
                orders: orderList
            },
            message: "Order found"
        });
    } catch (error) {
        console.error(error.message)
        res.status(500)
            .json({
                status: false,
                message: "Order not found",
                data: []
            });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate("user", "name")
            .populate({
                path: "orderItems",
                populate: {
                    path: "product",
                    populate: "category"
                }
            })

        if (!order) {
            return res.status(500).json({ status: false, message: "Order not found" });
        }
        res.status(200).json({
            status: true,
            data: {
                order: order
            },
            message: "Order found"
        });
    } catch (error) {
        console.error(error.message)
        res.status(500)
            .json({
                status: false,
                message: "Order not found",
                data: []
            });
    }
})

router.post("/", postOrderValidator(), async (req, res) => {
    const {
        orderItems,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status,
        user
    } = req.body;
    try {
        const errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            console.error(errorsResult.errors);
            return res.status(404).json({
                status: false,
                message: "Please add correct information",
                errors: errorsResult.errors
            });
        }
        const orderItemsIds = Promise.all(orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }))
        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
        // console.log(orderItemsIdsResolved)
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1,
            shippingAddress2,
            city,
            zip,
            country,
            phone,
            status,
            totalPrice,
            user
        })
        order = await order.save();
        if (!order) {
            return res.status(404).json({
                status: false,
                message: "order cannot be created!"
            });
        }
        res.status(200).json({
            status: false,
            message: "order place successfully",
            data: {
                order
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(404).json({
            status: false,
            message: "order cannot be created!"
        });
    }
})

router.put("/:id", async (req, res) => {
    const {
        status
    } = req.body;
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, {
            status
        }, {
            new: true
        })
        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }
        res.status(200).json({
            status: true,
            message: "Order update",
            data: { order }
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
        const order = await Order.findByIdAndRemove(id);
        if (order) {
            for (const orderItem of order.orderItems) {
                await OrderItem.findByIdAndRemove(orderItem)
            }
            return res.status(200).json({
                status: true,
                message: "Order is deleted"
            });
        }
        return res.status(404).json({
            status: false,
            message: "Order not found"
        })
    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            status: false,
            message: "Something went wrong"
        })
    }
})

router.get("/get/totalsales", async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ])
        if (!totalSales) {
            return res.status(400).json({
                status: false,
                message: "The order sales cannot be generated"
            })
        }
        res.status(200).json({
            data: { totalsales: totalSales.pop().totalsales }
        })
    } catch (error) {

    }
})

router.get("/get/count", async (req, res) => {
    try {
        const orderCount = await Order.countDocuments(count => count)
        if (!orderCount) {
            return res.status(400).json({
                status: false,
                message: "No order place"
            })
        }
        res.status(200).json({
            data: { orderCount }
        })
    } catch (error) {

    }
})

router.get("/get/userorders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const userOrderList = await Order.find({ user: userId })
            .populate("user", "name")
            .populate({
                path: "orderItems",
                populate: {
                    path: "product",
                    populate: "category"
                }
            })
            .sort({ "dateOrdered": -1 })

        if (!userOrderList) {
            return res.status(500).json({ status: false, message: "Order not found" });
        }
        res.status(200).json({
            status: true,
            data: {
                orders: userOrderList
            },
            message: "Order found"
        });
    } catch (error) {
        console.error(error.message)
        res.status(500)
            .json({
                status: false,
                message: "Order not found",
                data: []
            });
    }
})

module.exports = router;