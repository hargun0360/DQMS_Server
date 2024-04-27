const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  avgTimePerPerson: {
    type: Number,
    required: true,
  },
  customers: {
    type: [String],
    required: true,
  },
});

const storeSchema = new Schema({
  storeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  counters: [counterSchema],
  numberOfCounters: {
    type: Number,
    required: true,
  },
  billingTime: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  openTime: {
    type: Date,
    required: true,
  },
  closeTime: {
    type: Date,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model("store", storeSchema);
