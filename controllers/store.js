const Store = require("../models/store");

exports.makestore = async (req, res, next) => {
  const {
    storeName,
    address,
    longitude,
    latitude,
    counters,
    customers,
    waitingTime,
    avgTimePerPerson,
    about,
    openTime,
    closeTime,
  } = req.body;

  if (
    !storeName ||
    !address ||
    !longitude ||
    !latitude ||
    !counters ||
    !customers ||
    !waitingTime ||
    !avgTimePerPerson ||
    !about ||
    !openTime ||
    !closeTime
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const existingStore = await Store.findOne({
      storeName,
      longitude,
      latitude,
    });
    if (existingStore) {
      return res.status(409).json({ message: "Store already exists." });
    }

    const newStore = new Store(req.body);
    const savedStore = await newStore.save();
    res
      .status(201)
      .json({ message: "Store created successfully", storeId: savedStore._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    next(err);
  }
};
