const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store");

router.post("/makestore", storeController.makestore);

module.exports = router;
