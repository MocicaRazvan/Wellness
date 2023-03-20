const express = require("express");
const nftController = require("../controllers/nft");
const router = express.Router();

router.route("/").post(nftController.uploadNftImage);

module.exports = router;
