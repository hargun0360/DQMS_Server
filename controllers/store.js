const Store = require("../models/store.js");

exports.makestore = async (req, res, next) => {
  const {
    storeName,
    address,
    longitude,
    latitude,
    numberOfCounters,
    about,
    openTime,
    closeTime,
    billingTime,
    image,
  } = req.body;

  if (
    !storeName ||
    !address ||
    !longitude ||
    !latitude ||
    !about ||
    !openTime ||
    !closeTime ||
    !numberOfCounters ||
    !billingTime
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingStore = await Store.findOne({
      storeName,
      address,
      longitude,
      latitude,
    });
    if (existingStore) {
      return res.status(409).json({ message: "Store already exists." });
    }

    const counters = Array.from({ length: numberOfCounters }, (_, index) => ({
      avgTimePerPerson: 0,
      customers: [],
    }));

    const newStore = new Store({
      storeName,
      address,
      longitude,
      latitude,
      counters: counters,
      numberOfCounters,
      about,
      openTime,
      closeTime,
      image,
      billingTime,
      isVerified: false,
    });

    const savedStore = await newStore.save();
    res.status(201).json({
      message: "Store created successfully",
      storeId: savedStore._id,
      store: savedStore,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
    next(error);
  }
};
