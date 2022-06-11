const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const userSchema = new MSchema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    profession: {
        type: String
    }
})
const User = mongoose.model("user", userSchema, "user")
module.exports = User;