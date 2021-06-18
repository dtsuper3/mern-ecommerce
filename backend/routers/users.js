const express = require("express");
const { validationResult } = require("express-validator");
const { User } = require("../models/user");
const { registerValidator, loginValidator } = require("../validators/users");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", registerValidator(), async (req, res) => {
    const errorsResult = validationResult(req);

    // If some error occurs, then this
    // block of code will run
    if (!errorsResult.isEmpty()) {
        console.error(errorsResult.errors);
        return res.status(404).json({
            status: false,
            message: "User cannot be created!",
            errors: errorsResult.errors
        });
    }
    const {
        name,
        email,
        password,
        phone,
        isAdmin = false,
        street = "",
        apartment = "",
        zip = "",
        city = "",
        country = ""
    } = req.body;

    try {
        const passwordHash = bcryptjs.hashSync(password, 10);
        let user = new User({
            name,
            email,
            phone,
            passwordHash,
            isAdmin,
            street,
            apartment,
            zip,
            city,
            country
        })
        user = await user.save();
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User cannot be created!"
            });
        }
        res.status(200).json({
            success: true,
            message: "User register successfully",
            data: user
        })
    } catch (error) {
        console.error(error.message)
        res.status(404).json({
            status: false,
            message: "User cannot be created!"
        });
    }
})

router.get("/", async (req, res) => {
    try {
        const userList = await User.find().select("-passwordHash");
        if (!userList) {
            return res.status(404).json({
                success: false,
                message: ""
            })
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: userList
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: ""
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-passwordHash");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: ""
            })
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: ""
        })
    }
})

router.post("/login", loginValidator(), async (req, res) => {
    const errorsResult = validationResult(req);

    // If some error occurs, then this
    // block of code will run
    if (!errorsResult.isEmpty()) {
        console.error(errorsResult.errors);
        return res.status(404).json({
            status: false,
            message: "User cannot authenticate",
            errors: errorsResult.errors
        });
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (user && bcryptjs.compareSync(password, user.passwordHash)) {
            const jwt_secret = process.env.JWT_SECRET;
            const jwt_expires_in = process.env.JWT_EXPIRES_IN;
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                jwt_secret,
                {
                    expiresIn: jwt_expires_in
                }
            )
            res.status(200).json({
                success: true,
                message: "Login successfully",
                data: { token }
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Wrong password"
            })
        }
    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            success: false,
            message: "User not found"
        })
    }
})

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments(count => count);
        if (!userCount) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
                data: 0
            });
        }
        res.status(200).json({
            status: true,
            message: "fetched successfully",
            data: { userCount }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            data: 0
        });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    // console.log(req.user.userId, id)    
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400)
                .json({
                    status: false,
                    message: "Invalid User ID"
                })
        }
        const user = await User.findByIdAndRemove(id);
        if (user) {
            return res.status(200).json({
                status: true,
                message: "User is deleted"
            });
        }
        return res.status(404).json({
            status: false,
            message: "User not found"
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