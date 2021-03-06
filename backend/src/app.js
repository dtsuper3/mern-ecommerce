const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const api = process.env.API_URL;
const productRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const orderRouter = require("./routers/orders");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options("*", cors());
app.use(express.json());
if (process.env.ENV !== "test") {
    app.use(morgan("tiny"));
}
app.use(authJwt());
// console.log(path.join(__dirname, 'public/uploads'))
// app.use(express.static(path.join(__dirname, '/public')));
app.use('/public/uploads', express.static(path.join(__dirname, '/public/uploads')));
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
    useCreateIndex: true
})
    .then(res => {
        console.log("Databse connection is ready")
    }).catch(err => {
        console.log(err)
    })



module.exports = app;