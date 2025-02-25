const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		conversation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			index: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
