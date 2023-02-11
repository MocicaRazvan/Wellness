const express = require("express");
const stripeController = require("../controllers/stripe");
const router = express.Router();

router.route("/create-checkout-session").post(stripeController.stripeCheckout);
router
	.route("/webhook")
	.post(express.raw({ type: "application/json" }), stripeController.webhook);

module.exports = router;
