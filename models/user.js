const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        require: true,
    },
    mobile: {
        type: String,
        require: true,
    },
    lattitude: {
        type: String,
        require: true,
    },
    longitude: {
        type: Number,
        require: true,
    },
    queue: {
        type: Array,
        require: true,
    },
    isSpam: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    cancelationCharge: {
        type: Number,
        require: true,
    },
});

module.exports = mongoose.model("user", userSchema);
