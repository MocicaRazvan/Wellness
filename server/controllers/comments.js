const Comments = require("../models/Comment");

//post: /comments

exports.createComment = async (req, res) => {
	const { body, post, training } = req.body;

	if (!body) {
		return res.status(400).json({ message: "Comment body was not found" });
	}
	if (!post && !training) {
		return res
			.status(400)
			.json({ message: "Comment post or training was not found" });
	}

	if (post) {
		const comment = new Comments({ body, post, user: req.user._id });

		const savedComment = await comment.save();

		res.status(201).json({
			message: `Comment to post ${post}  created successfully`,
			comment: savedComment,
		});
	}
	if (training) {
		const comment = new Comments({ body, training, user: req.user._id });

		const savedComment = await comment.save();

		res.status(201).json({
			message: `Comment to training ${training}  created successfully`,
			comment: savedComment,
		});
	}
};

//put: /comments/action/like/:commentId
exports.likeComment = async (req, res) => {
	const userId = req.user._id;
	const { commentId } = req.params;
	const comment = await Comments.findById(commentId).select("likes");
	if (comment.likes.includes(userId)) {
		comment.likes = comment.likes.filter((e) => e !== userId.toString());
		await comment.save();
	} else {
		await Comments.findByIdAndUpdate(commentId, {
			$addToSet: { likes: userId },
			$pull: { dislikes: userId },
		});
	}
	res
		.status(200)
		.json({ message: `Post with id ${commentId} was liked succesfully` });
};

//put: /comments/action/dislike/:commentId
exports.dislikeComment = async (req, res) => {
	const userId = req.user._id;
	const { commentId } = req.params;
	const comment = await Comments.findById(commentId).select("dislikes");
	if (comment.dislikes.includes(userId)) {
		comment.dislikes = comment.dislikes.filter((e) => e !== userId.toString());
		await comment.save();
	} else {
		await Comments.findByIdAndUpdate(commentId, {
			$addToSet: { dislikes: userId },
			$pull: { likes: userId },
		});
	}
	res
		.status(200)
		.json({ message: `Post with id ${commentId} was disliked succesfully` });
};

//get: /comments

exports.getComments = async (req, res) => {
	const q = req.query;

	let query = Comments.find();

	if (q.post) {
		query = query.find({ post: q.post });
	}
	if (q.user) {
		query = query.find({ user: q.user });
	}
	if (q.training) {
		query = query.find({ training: q.training });
	}

	const comments = await query.populate("user", "username image").lean();

	res.status(200).json({ message: "Comments delivered", comments });
};

// put: /comments/:commentId
exports.updateComment = async (req, res) => {
	//console.log(req.body);
	const { _id: userId, role } = req.user;
	const { commentId } = req.params;
	const { body } = req.body;
	console.log(body);
	const comment = await Comments.findById(commentId);

	if (!comment) {
		return res
			.status(404)
			.json({ message: `No comment with id ${commentId} was found` });
	}

	if (comment.user.toString() !== userId.toString() && role !== "admin") {
		return res.status(401).json({ message: "You are not authorized" });
	}

	comment.body = body;

	const newComment = await comment.save();

	return res
		.status(200)
		.json({ message: "Comment updated successfully", comment: newComment });
};

//delete: /comments/:commentId

exports.deleteComment = async (req, res) => {
	const { _id: userId, role } = req.user;
	const { commentId } = req.params;
	const comment = await Comments.findById(commentId);

	if (!comment) {
		return res
			.status(404)
			.json({ message: `No comment with id ${commentId} was found` });
	}
	if (comment.user.toString() !== userId.toString() && role !== "admin") {
		return res.status(401).json({ message: "You are not authorized" });
	}

	await comment.delete();

	return res.status(200).json({ message: "Comment deleted successfully" });
};
