const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		type: {
			type: String,
			enum: [
				"message",
				"post/approve",
				"post/disapprove",
				"post/delete",
				"training/approve",
				"training/disapprove",
				"training/delete",
			],
		},
		ref: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
