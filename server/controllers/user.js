const Posts = require("../models/Post");
const Exercises = require("../models/Exercise");
const Training = require("../models/Training");
const User = require("../models/User");
const Comment = require("../models/Comment");
const cloudinary = require("../utils/cloudinary");
const sendEmail = require("../utils/email/sendEmail");
const makeAdmin = require("../utils/email/adminTemplate");

//get /user/countStats
exports.getCountStats = async (req, res) => {
	const userId = req.user._id;

	const posts = await Posts.countDocuments({ user: userId });
	const exercises = await Exercises.countDocuments({ user: userId });
	const trainings = await Training.countDocuments({ user: userId });
	const comments = await Comment.countDocuments({ user: userId });

	return res.status(200).json({
		message: "Count stats returned succes",
		stats: { posts, exercises, trainings, comments },
	});
};
//get /user/admin/totalMonth
exports.getTotalMonth = async (req, res) => {
	const total = await User.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $group: { _id: "$month", total: { $sum: 1 } } },
	]);
	console.log(total);
	res.status(200).json({ message: "User total month retrived", total });
};

// get /user/:userId
exports.getUserById = async (req, res) => {
	const user = await User.findById(req.params.userId).lean();
	return res
		.status(200)
		.json({ user, message: `User with id ${req.params.userId} retrived` });
};

//put /user
exports.updateUser = async (req, res) => {
	const userId = req.user._id;
	const { image, password, ...rest } = req.body;

	const user = await User.findById(userId).select("+password");
	if (!user)
		return res.status(400).json({ message: `No user with ${userId} exists` });

	const isMatch = await user.mathcPasswords(password);

	if (!isMatch || rest.email !== user.email) {
		return res
			.status(401)
			.json({ message: "Credentials are not valid", update: true });
	}

	if (image) {
		let destroyRespone = true;
		if (user?.image?.public_id) {
			destroyRespone = await cloudinary.uploader.destroy(
				user?.image?.public_id,
			);
		}
		// console.log(destroyRespone);

		if (destroyRespone) {
			const uplodRes = await cloudinary.uploader.upload(image, {
				upload_preset: "wellnessUser",
			});
			console.log(uplodRes);
			if (uplodRes) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: userId },
					{
						...rest,
						image: uplodRes,
					},
					{ new: true },
				);
				const token = updatedUser.getSignedToken();
				console.log(updatedUser.image);
				res
					.status(201)
					.json({ message: "User updated", token, user: updatedUser });
			}
		}
	} else {
		const updatedUser = await User.findByIdAndUpdate(
			{ _id: userId },
			{
				...rest,
			},
			{ new: true },
		);
		const token = updatedUser.getSignedToken();
		res.status(201).json({ message: "User updated", token, user: updatedUser });
	}
};

//get: users/admin/all
exports.getAllUsersAdmin = async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(401).json({ message: "Your are not authorized" });
	}
	const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
	const generateSort = () => {
		const sortParsed = JSON.parse(sort);
		const sortFormatted = {
			[sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
		};
		return sortFormatted;
	};
	const sortFormatted = Boolean(sort) ? generateSort() : {};
	const users = await User.find({
		$or: [
			{
				username: new RegExp(search, "i"),
			},
			// {
			// 	_id: { $regex: new RegExp(search, "i") },
			// },
		],
	})
		.sort(sortFormatted)
		.skip(page * pageSize)
		.limit(pageSize);
	const total = await User.countDocuments({
		username: { $regex: search, $options: "i" },
	});

	return res.status(200).json({
		total,
		users,
	});
};

// get: user/admin/month/all
exports.getAllMonthlyStats = async (req, res) => {
	const month = new Date().getMonth() + 1;
	const users = await User.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const posts = await Posts.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const trainings = await Training.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const exercises = await Exercises.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);

	res
		.status(200)
		.json({ message: "Total retrived", users, posts, trainings, exercises });
};
// get: /users/admin/relativeStats
exports.getAdminRelativeStats = async (req, res) => {
	const month = new Date().getMonth() + 1;
	const prevMonth = month - 1;
	const users2 = await User.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const users1 = await User.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month: prevMonth } },
	]);
	// console.log({ users1, users2 });
	const relativeUsers =
		users1.length > 0
			? (users2.length - users1.length) / users1.length
			: users2.length;
	const posts2 = await Posts.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const posts1 = await Posts.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month: prevMonth } },
	]);
	const relativePosts =
		posts1.length > 0
			? (posts2.length - posts1.length) / posts1.length
			: posts2.length;

	const trainings2 = await Training.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const trainings1 = await Training.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month: prevMonth } },
	]);

	const relativeTrainings =
		trainings1.length > 0
			? (trainings2.length - trainings1.length) / trainings1.length
			: trainings2.length;

	const exercises2 = await Exercises.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month } },
	]);
	const exercises1 = await Exercises.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
			},
		},
		{ $match: { month: prevMonth } },
	]);
	const relativeExercises =
		exercises1.length > 0
			? (exercises2.length - exercises1.length) / exercises1.length
			: exercises2.length;
	res.status(200).json({
		message: "Relative Stats retrived",
		relativeUsers,
		relativePosts,
		relativeTrainings,
		relativeExercises,
	});
};
//get: /users/admin/countStats
exports.getAllCountsAdmin = async (req, res) => {
	const posts = await Posts.countDocuments();
	const exercises = await Exercises.countDocuments();
	const trainings = await Training.countDocuments();
	const users = await User.countDocuments();

	return res.status(200).json({
		message: "Count stats returned succes",
		stats: { posts, exercises, trainings, users },
	});
};

//get: /users/single

exports.getSingleUser = async (req, res) => {
	const user = await User.findById(req.user._id).lean();
	// console.log(user);
	return res.status(200).json({ user, message: "User retrived" });
};

//put: /users/admin/trainer/:userId
exports.makeUserTrainer = async (req, res) => {
	if (req.user.role !== "admin") {
		return req.status(401).json({ message: "You are not authorized" });
	}

	await User.findByIdAndUpdate(req.params.userId, {
		role: "trainer",
	}).lean();

	return res
		.status(200)
		.json({ message: `User with id ${req.params.userId} was made trainer` });
};
//put: /users/admin/email
exports.sendEmailAdmin = async (req, res) => {
	if (req.user.role !== "admin") {
		return req.status(401).json({ message: "You are not authorized" });
	}
	try {
		await sendEmail({
			to: req.body.email,
			subject: req.body.subject,
			text: makeAdmin(req.body.body),
		});
		res.status(201).json({ message: "Email sent" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Email could not be sent!" });
	}
};
