const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    icon: {
        type: String
    },
    image: {
        type: String
    }
})

categorySchema.virtual("id").get(function () {
    return this._id.toHexString();
})

categorySchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
})

exports.Category = mongoose.model("Category", categorySchema);