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
const usersRouter = require("./routers/users");
const orderRouter = require("./routers/orders");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());

app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, orderRouter)

// app.use(function (req, res, next) {
//     if (!req.route)
//         return next(new Error('404'));
//     next();
// });


app.use(errorHandler)
mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
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