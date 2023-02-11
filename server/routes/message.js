const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message");

router
	.route("/:conversationId")
	.get(messageController.getMessagesFromAConversation);
router.route("/").post(messageController.createMessage);

module.exports = router;
