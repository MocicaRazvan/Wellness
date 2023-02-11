const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},
		training: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Training",
		},
		body: {
			type: String,
			required: [true, "Please provide a body to the comment"],
		},
		// userids who like comments and who dislike them
		likes: {
			type: [String],
			defualt: [],
		},
		dislikes: {
			type: [String],
			defualt: [],
		},
	},
	{ timestamps: true },
);

const Comments = mongoose.model("Comment", commentSchema);

module.exports = Comments;
