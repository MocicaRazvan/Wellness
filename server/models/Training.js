const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please Provide a title"],
			// unique: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		exercises: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
			required: [true, "Please provide a list of exercises"],
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
		description: {
			type: String,
			default: "",
		},
		price: { type: Number, required: [true, "Please provide a price"] },
		// userids who like post and who dislike them
		likes: {
			type: [String],
			defualt: [],
		},
		dislikes: {
			type: [String],
			defualt: [],
		},
		images: { type: [Object], required: true },
		occurrences: {
			type: Number,
			default: 0,
		},
		display: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const Trainings = mongoose.model("Training", trainingSchema);

module.exports = Trainings;
