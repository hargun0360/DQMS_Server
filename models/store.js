const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  storeName: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  longitude: {
    type: String,
    require: true,
  },
  latitude: {
    type: String,
    require: true,
  },
  counters: {
    type: Number,
    require: true,
  },
  customers: {
    type: Number,
    require: true,
  },
  waitingTime: {
    type: String,
    require: true,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  avgTimePerPerson: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    require: true,
  },
  openTime: {
    type: String,
    require: true,
  },
  closeTime: {
    type: String,
    require: true,
  },
  image: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("store", userSchema);
