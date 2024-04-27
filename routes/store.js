const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store");
const queueController = require("../controllers/JoinQueue");

router.post("/makestore", storeController.makestore);
router.post("/joinqueue", queueController.joinqueue);

module.exports = router;
