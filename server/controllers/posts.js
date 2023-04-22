const Comments = require("../models/Comment");
const Posts = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

//post: /posts/create
exports.createPost = async (req, res) => {
	const { body, tags, title, images } = req.body;
	const approved = req.user.role === "admin";
	const count = await Posts.countDocuments({ title });
	if (count > 0)
		return res
			.status(400)
			.json({ message: "Please enter a title that haven't been used" });
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
					approved,
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
		if (error.code === "11000")
			return res
				.status(400)
				.json({ message: "Please enter a title that haven't been used" });
		throw error;
	}
};

//get: /posts
exports.getAllPosts = async (req, res) => {
	const q = req.query;
	let query;

	let page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	let total = Posts.countDocuments({ approved: true, display: true });

	query = Posts.find({ approved: true, display: true }).lean();
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
		query = query.sort(sortFormatted);
	}
	if (q.search) {
		query = query.find({
			title: { $regex: q.search, $options: "i" },
		});
		total = total.countDocuments({
			title: { $regex: q.search, $options: "i" },
		});
	}
	if (q?.tags && q?.tags?.length > 0) {
		const tags = q.tags.split(",");
		query = query.find({ tags: { $in: tags } });
		total = total.countDocuments({ tags: { $in: tags } });
	}

	const posts = await query
		.populate("user", "username image")
		.skip(skip)
		.limit(pageSize)
		.lean();
	total = await total;
	const pages = Math.ceil(total / pageSize);
	if (page > pages) {
		page = pages;
	}
	return res.status(200).json({
		message: "Post delivered successfully",
		posts,
		count: posts.length,
		total,
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
			const deleteComRes = await Comments.deleteMany({
				post: mongoose.Types.ObjectId(postId),
			});
			return res.status(200).json({
				message: `Post with ${postId} deleted successfully`,
				deletedPost,
			});
		}
	} else {
		const deletedPost = await Posts.findByIdAndDelete(postId).lean();
		const deleteComRes = await Comments.deleteMany({
			post: mongoose.Types.ObjectId(postId),
		});
		return res.status(200).json({
			message: `Post with ${postId} deleted successfully`,
			deletedPost,
		});
	}
};

//put /posts/:postId
exports.updatePost = async (req, res) => {
	const { postId } = req.params;
	const { title, tags, body, images } = req.body;
	const approved = req.user.role === "admin";

	const count = await Posts.countDocuments({
		title,
		_id: { $ne: mongoose.Types.ObjectId(postId) },
	});
	if (count > 0)
		return res
			.status(400)
			.json({ message: "Please enter a title that haven't been used" });

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
						$set: {
							title,
							tags,
							body,
							images: uplodRes,
							approved,
							display: false,
						},
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
				$set: { title, tags, body, approved, display: false },
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

	let page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	let total;
	// const pages = Math.ceil(total / pageSize);

	if (q.notApproved === "false") {
		if (q.notDisplayed === "false") {
			query = Posts.find({ user: userId });
			total = Posts.countDocuments({ user: userId });
		} else {
			query = Posts.find({ user: userId, display: false });
			total = Posts.countDocuments({ user: userId, display: false });
		}
	} else {
		if (q.notDisplayed === "false") {
			query = Posts.find({ user: userId, approved: false });
			total = Posts.countDocuments({
				user: userId,
				approved: false,
			});
		} else {
			query = Posts.find({ user: userId, approved: false, display: false });
			total = Posts.countDocuments({
				user: userId,
				approved: false,
				display: false,
			});
		}
	}
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
		sortFormatted.forEach((e) => {
			query = query.sort([e]);
		});
	}
	if (q.search) {
		query = query.find({
			title: { $regex: q.search, $options: "i" },
		});
		total = total.countDocuments({
			title: { $regex: q.search, $options: "i" },
		});
	}
	if (q?.tags && q?.tags?.length > 0) {
		const tags = q.tags.split(",");
		query = query.find({ tags: { $in: tags } });
		total = total.countDocuments({ tags: { $in: tags } });
	}

	const posts = await query
		.populate("user", "username image")
		.skip(skip)
		.limit(pageSize)
		.lean();
	total = await total;
	const pages = Math.ceil(total / pageSize);
	if (page > pages) {
		page = pages;
	}
	res.status(200).json({
		message: "User's posts received",
		posts,
		count: posts.length,
		total,
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
	const post = await Posts.findById(postId).select("likes");
	if (post.likes.includes(userId)) {
		post.likes = post.likes.filter((e) => e !== userId.toString());
		await post.save();
	} else {
		await Posts.findByIdAndUpdate(postId, {
			$addToSet: { likes: userId },
			$pull: { dislikes: userId },
		}).lean();
	}

	res
		.status(200)
		.json({ message: `Post with id ${postId} was liked succesfully` });
};

//put: /posts/action/dislikes/:postId
exports.dislikePost = async (req, res) => {
	const userId = req.user._id;
	const { postId } = req.params;
	const post = await Posts.findById(postId).select("dislikes");
	if (post.dislikes.includes(userId)) {
		post.dislikes = post.dislikes.filter((e) => e !== userId.toString());
		await post.save();
	} else {
		await Posts.findByIdAndUpdate(postId, {
			$addToSet: { dislikes: userId },
			$pull: { likes: userId },
		});
	}
	res
		.status(200)
		.json({ message: `Post with id ${postId} was disliked succesfully` });
};

//get: /posts/admin
exports.getAllPostsAdmin = async (req, res) => {
	const { limit = 20, notApproved, notDisplayed } = req.query;
	const user = req.user;
	if (user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });
	let query;
	let total;
	if (notApproved === "false") {
		if (notDisplayed === "false") {
			query = Posts.find().populate("user");
			total = Posts.countDocuments();
			if (req.query.search) {
				query = query.find({
					title: { $regex: req.query.search, $options: "i" },
				});
				total = Posts.countDocuments({
					title: { $regex: req.query.search, $options: "i" },
				});
			}
		} else {
			query = Posts.find({ display: false }).populate("user");
			total = Posts.countDocuments({ display: false });

			if (req.query.search) {
				query = query.find({
					title: { $regex: req.query.search, $options: "i" },
					display: false,
				});
				total = Posts.countDocuments({
					title: { $regex: req.query.search, $options: "i" },
					display: false,
				});
			}
		}
	} else {
		if (notDisplayed === "false") {
			query = Posts.find({ approved: false }).populate("user");
			total = Posts.countDocuments({ approved: false });
			if (req.query.search) {
				query = query.find({
					title: { $regex: req.query.search, $options: "i" },
					approved: false,
				});
				total = Posts.countDocuments({
					title: { $regex: req.query.search, $options: "i" },
					approved: false,
				});
			}
		} else {
			query = Posts.find({ approved: false, display: false }).populate("user");
			total = Posts.countDocuments({ approved: false, display: false });
			if (req.query.search) {
				query = query.find({
					title: { $regex: req.query.search, $options: "i" },
					approved: false,
					display: false,
				});
				total = Posts.countDocuments({
					title: { $regex: req.query.search, $options: "i" },
					approved: false,
					display: false,
				});
			}
		}
	}
	// if (req.query.search) {
	// 	query = query.find({
	// 		title: { $regex: req.query.search, $options: "i" },
	// 	});
	// 	total = Posts.countDocuments({
	// 		title: { $regex: req.query.search, $options: "i" },
	// 	});
	// }
	const posts = await query.limit(limit).lean();
	total = await total;
	// console.log({ total });
	return res.status(200).json({ message: "Posts retrived", posts, total });
};
//put /posts/admin/approve
exports.approvePosts = async (req, res) => {
	if (req.user.role !== "admin") {
		res.status(401).json({ message: "You are not authorized" });
	}
	const { postId } = req.body;
	const count = await Posts.countDocuments({
		_id: mongoose.Types.ObjectId(postId),
	});
	if (count == 0) {
		res.status(400).json({ message: `No post with id ${postId} exsists` });
	}
	const post = await Posts.findById(postId).select("approved display");
	post.approved = !post.approved;
	if (post.approved === false) {
		post.display = false;
	}
	await post.save();
	res.status(201).json({
		message: `Post with id ${postId} approved`,
	});
};
//put /posts/display
exports.displayPost = async (req, res) => {
	const { postId } = req.body;
	const count = await Posts.countDocuments({
		_id: mongoose.Types.ObjectId(postId),
	});
	if (count === 0) {
		res.status(400).json({ message: `No training with id ${postId} exsists` });
	}
	const post = await Posts.findById(postId).select("display user");
	if (
		req.user.role !== "admin" &&
		req.user._id.toString() !== post.user.toString()
	) {
		return res.status(401).json({ message: "You are not authorized" });
	}
	post.display = !post.display;
	console.log(post);
	await post.save();
	res.status(201).json({
		message: `Training with id ${postId} display is ${post.display}`,
	});
};
