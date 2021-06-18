const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

orderItemSchema.virtual("id").get(function () {
    return this._id.toHexString();
})

orderItemSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
})

exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);