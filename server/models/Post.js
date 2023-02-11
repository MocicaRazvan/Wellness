const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		body: {
			type: String,
			required: [true, "Please Provide a body"],
		},
		tags: {
			type: [String],
			default: [],
		},
		title: {
			type: String,
			required: [true, "Please Provide a title"],
			unique: true,
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
	},
	{ timestamps: true },
);

const Posts = mongoose.model("Post", postSchema);

module.exports = Posts;
