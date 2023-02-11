const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation");
const verifyJwt = require("../middleware/verifyJwt");

router.route("/").post(verifyJwt, conversationController.createConversation);
router
	.route("/support")
	.post(verifyJwt, conversationController.createConversationSupport);
router
	.route("/find/:conversationId")
	.get(verifyJwt, conversationController.getConversationById);
router
	.route("/:userId")
	.get(verifyJwt, conversationController.getConversationsByUser);

module.exports = router;
