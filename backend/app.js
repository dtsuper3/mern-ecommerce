const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv/config");
const api = process.env.API_URL;
const PORT = process.env.PORT || 3200;
const productRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoriesRouter)

app.use(function (req, res, next) {
    if (!req.route)
        return next(new Error('404'));
    next();
});
function errorHandler(err, req, res, next) {
    console.error(err.message)
    res.status(404).json({ message: "Not Found" })
}

app.use(errorHandler)
mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: "ecommerce"
})
    .then(res => {
        console.log("Databse connection is ready")
    }).catch(err => {
        console.log(err)
    })

app.listen(PORT, () => {
    console.log(`server is running on port: http://localhost:${PORT}`)
})