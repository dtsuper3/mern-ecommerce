const mongoose = require("mongoose");
const { User } = require("../../models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    "_id": userOneId,
    "name": "Deepak Thapa",
    "email": "deepakthapa1@gmail.com",
    "passwordHash": "12345678",
    "phone": "7838626816",
};

async function setupDatabase() {
    await User.deleteMany();
    await new User(userOne).save();
};

async function resetDatabase() {
    await User.deleteMany();
};



module.exports = {
    setupDatabase,
    userOne,
    resetDatabase
}