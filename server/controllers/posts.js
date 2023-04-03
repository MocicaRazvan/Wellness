const Posts = require("../models/Post");
const cloudinary = require("../utils/cloudinary");

//post: /posts/create
exports.createPost = async (req, res) => {
	const { body, tags, title, images } = req.body;
	// image upload to cloudinary
	try {
		if (images && images.length > 0) {
			const uplodRes = await Promise.all(
				images.map(
					async (image) =>
						await cloudinary.uploader.upload(image, {
							upload_preset: "wellnessPosts",
						}),
				),
			);
			if (uplodRes && uplodRes.length > 0) {
				const post = new Posts({
					body,
					tags,
					title,
					images: uplodRes,
					user: req.user._id,
				});

				const savedPost = await post.save();
				//console.log(savedPost);

				return res.status(200).json({
					message: "Product Created Successfully",
					product: savedPost,
				});
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

//get: /posts
exports.getAllPosts = async (req, res) => {
	const q = req.query;
	let query;

	const page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	const total = await Posts.countDocuments();
	const pages = Math.ceil(total / pageSize);

	if (page > pages) {
		return res.status(400).json({ message: "No page found" });
	}

	query = Posts.find().lean();
	if (q.sort) {
		const generateSort = () => {
			const sortParsed = JSON.parse(q.sort);
			const sortFormatted = Object.entries(sortParsed).map(([k, v]) => [
				k,
				v === "asc" ? 1 : -1,
			]);
			return sortFormatted;
		};
		const sortFormatted = generateSort();

		// console.log(sortFormatted);

		// sortFormatted.forEach((e) => {
		// 	// if (e[0] === "createdAt") {
		// 	// 	console.log("object");
		// 	// 	// query.sort({})
		// 	// 	query = query.aggregate([
		// 	// 		{
		// 	// 			$group: {
		// 	// 				_id: {
		// 	// 					month: { $month: "$createdAt" },
		// 	// 					year: { $year: "$createdAt" },
		// 	// 					day: { $dayOfYear: "$createdAt" },
		// 	// 				},
		// 	// 				transactions: { $push: "$$ROOT" },
		// 	// 			},
		// 	// 		},
		// 	// 		{ $sort: { month: e[1], year: e[1], day: e[1] } },
		// 	// 	]);
		// 	// } else {
		// 	// 	query = query.sort([e]);
		// 	// }
		// 	query = query.sort([e]);
		// });
		query = query.sort(sortFormatted);
	}
	if (q.search) {
		query = query.find({
			title: { $regex: q.search, $options: "i" },
		});
	}
	if (q?.tags && q?.tags?.length > 0) {
		const tags = q.tags.split(",");
		query = query.find({ tags: { $in: tags } });
	}

	const posts = await query
		.populate("user", "username image")
		.skip(skip)
		.limit(pageSize);

	return res.status(200).json({
		message: "Post delivered successfully",
		posts,
		count: posts.length,
		page,
		pages,
	});
};

//delete: /posts/:postId
exports.deletePost = async (req, res) => {
	const { postId } = req.params;
	const post = await Posts.findById(postId);
	if (!post)
		return res
			.status(404)
			.json({ message: `Post with ${postId} does not exists` });

	if (post.images && post.images.length > 0) {
		const destroyResponse = await Promise.all(
			post.images.map(
				async (image) => await cloudinary.uploader.destroy(image.public_id),
			),
		);

		if (destroyResponse) {
			const deletedPost = await Posts.findByIdAndDelete(postId).lean();
			return res.status(200).json({
				message: `Post with ${postId} deleted successfully`,
				deletedPost,
			});
		}
	} else {
		const deletedPost = await Posts.findByIdAndDelete(postId).lean();
		return res.status(200).json({
			message: `Post with ${postId} deleted successfully`,
			deletedPost,
		});
	}
};

//put" /posts/:postId
exports.updatePost = async (req, res) => {
	const { postId } = req.params;
	const { title, tags, body, images } = req.body;

	console.log(postId);

	if (images && images.length > 0) {
		const post = await Posts.findById(postId).lean();
		console.log(post);
		if (!post)
			return res.status(400).json({ message: `No post with ${postId} exists` });
		const destroyResponse = await Promise.all(
			post.images.map(
				async (image) => await cloudinary.uploader.destroy(image.public_id),
			),
		);
		if (destroyResponse) {
			const uplodRes = await Promise.all(
				images.map(
					async (image) =>
						await cloudinary.uploader.upload(image, {
							upload_preset: "wellnessPosts",
						}),
				),
			);
			if (uplodRes) {
				const updatedPost = await Posts.findByIdAndUpdate(
					postId,
					{
						$set: { title, tags, body, images: uplodRes },
					},
					{ new: true },
				);
				return res.status(200).json({
					message: `Post with id ${postId} was updated succesfully`,
					updatedPost,
				});
			}
		}
	} else {
		const updatedPost = await Posts.findByIdAndUpdate(
			postId,
			{
				$set: { title, tags, body },
			},
			{ new: true },
		);
		return res.status(200).json({
			message: `Post with id ${postId} was updated succesfully`,
			updatedPost,
		});
	}
};

//get: /posts/user/:userId
exports.getPostsByUser = async (req, res) => {
	//const posts = await Posts.find({ user: req.user._id }).lean();

	const q = req.query;
	let query;
	const { userId } = req.params;

	const page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	const total = await Posts.countDocuments();
	const pages = Math.ceil(total / pageSize);

	query = Posts.find({ user: userId });
	if (q.sort) {
		const generateSort = () => {
			const sortParsed = JSON.parse(q.sort);
			// const sortFormatted = {
			// 	[sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
			// };
			const sortFormatted = Object.entries(sortParsed).map(([k, v]) => [
				k,
				v === "asc" ? 1 : -1,
			]);
			return sortFormatted;
		};
		const sortFormatted = generateSort();
		// console.log(sortFormatted);
		// query = query.sort(sortFormatted);
		sortFormatted.forEach((e) => {
			query = query.sort([e]);
		});
	}
	if (q.search) {
		query = query.find({
			title: { $regex: q.search, $options: "i" },
		});
	}
	if (q?.tags && q?.tags?.length > 0) {
		const tags = q.tags.split(",");
		query = query.find({ tags: { $in: tags } });
	}

	const posts = await query
		.populate("user", "username image")
		.skip(skip)
		.limit(pageSize);
	res.status(200).json({
		message: "User's posts received",
		posts,
		count: posts.length,
		page,
		pages,
	});
};

//get: /post/find/:postId
exports.getPostById = async (req, res) => {
	const { postId } = req.params;
	const post = await Posts.findById(postId)
		.populate("user", "username image")
		.lean();
	if (!post)
		return res.status(400).json({ message: `No post with ${postId} exists` });
	res
		.status(200)
		.json({ message: `Post with id ${postId} deliverd successfully`, post });
};

//put: /posts/action/likes/:postId
exports.likePost = async (req, res) => {
	const userId = req.user._id;
	const { postId } = req.params;
	await Posts.findByIdAndUpdate(postId, {
		$addToSet: { likes: userId },
		$pull: { dislikes: userId },
	}).lean();

	res
		.status(200)
		.json({ message: `Post with id ${postId} was liked succesfully` });
};

//put: /posts/action/dislikes/:postId
exports.dislikePost = async (req, res) => {
	const userId = req.user._id;
	const { postId } = req.params;
	await Posts.findByIdAndUpdate(postId, {
		$addToSet: { dislikes: userId },
		$pull: { likes: userId },
	});
	res
		.status(200)
		.json({ message: `Post with id ${postId} was disliked succesfully` });
};

//get: /posts/admin
exports.getAllPostsAdmin = async (req, res) => {
	const { limit = 5 } = req.query;
	const user = req.user;
	if (user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });
	let query = Posts.find().populate("user");
	let total = Posts.countDocuments();
	if (req.query.search) {
		query = query.find({
			title: { $regex: req.query.search, $options: "i" },
		});
		total = Posts.countDocuments({
			title: { $regex: req.query.search, $options: "i" },
		});
	}
	const posts = await query.limit(limit);
	total = await total;
	console.log(total);
	return res.status(200).json({ message: "Posts retrived", posts, total });
};
