const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
	{
		body: {
			type: String,
			required: [true, "Please Provide a body"],
		},
		muscleGroups: {
			type: [String],
			default: [],
		},
		title: {
			type: String,
			required: [true, "Please Provide a title"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		approved: {
			type: Boolean,
			default: false,
		},
		videos: { type: [Object] },
		occurrences: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const Exercises = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercises;
