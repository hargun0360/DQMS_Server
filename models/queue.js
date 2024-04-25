const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  storeId: {
    type: String,
    require: true,
  },
  waitingTime: {
    type: String,
    require: true,
  },
  counterAlloted: {
    type: Number,
    require: true,
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  isPayment: {
    type: Boolean,
    default: false,
  },
  numberOfAbsent: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("queue", userSchema);
