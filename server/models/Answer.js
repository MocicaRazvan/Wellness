const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
			index: true,
		},
		body: {
			type: String,
			required: [true, "Please provide a body to the answer"],
		},
	},
	{ timestamps: true },
);

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
