const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  msisdn: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: 'NOT_VERIFIED',
  },
  isStoreOwner: {
    type: Boolean,
    default: false,
  },
  cancellationCharge: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("user", userSchema);
