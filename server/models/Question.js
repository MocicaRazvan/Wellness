const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		title: {
			type: String,
			required: [true, "Please provide a title to the question"],
		},
		body: {
			type: String,
			required: [true, "Please provide a body to the question"],
		},
		tags: {
			type: [String],
			default: [],
		},
		isOpen: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

const Questions = mongoose.model("Question", questionSchema);
module.exports = Questions;
