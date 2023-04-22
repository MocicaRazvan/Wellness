const { default: mongoose } = require("mongoose");
const Exercises = require("../models/Exercise");
const Order = require("../models/Order");
const Trainings = require("../models/Training");
const cloudinary = require("../utils/cloudinary");

//post: /trainings/create
exports.createTraining = async (req, res) => {
	const { title, tags, exercises, price, images, description } = req.body;
	const approved = req.user.role === "admin";

	// image upload to cloudinary
	const count = await Trainings.countDocuments({ title });
	if (count > 0)
		return res
			.status(400)
			.json({ message: "Please enter a title that haven't been used" });
	try {
		if (images && images.length > 0) {
			const uplodRes = await Promise.all(
				images.map(
					async (image) =>
						await cloudinary.uploader.upload(image, {
							upload_preset: "wellnessTrainings",
						}),
				),
			);
			if (uplodRes && uplodRes.length > 0) {
				const training = new Trainings({
					title,
					tags,
					exercises,
					price,
					description,
					images: uplodRes,
					user: req.user._id,
					approved,
				});

				const savedTraining = await training.save();

				await Exercises.updateMany(
					{ _id: { $in: exercises } },
					{ $inc: { occurrences: 1 } },
				);

				return res.status(200).json({
					message: "Training Created Successfully",
					training: savedTraining,
				});
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

//get: /trainings/user
exports.getAllUserTrainings = async (req, res) => {
	const {
		page = 1,
		pageSize = 20,
		sort = null,
		search = "",
		userId = null,
	} = req.query;
	const generateSort = () => {
		const sortParsed = JSON.parse(sort);
		const sortFormatted = {
			[sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
		};
		return sortFormatted;
	};
	const sortFormatted = Boolean(sort) ? generateSort() : {};
	if (userId) {
		const trainings = await Trainings.find({
			user: userId,
			$or: [
				{
					title: new RegExp(search, "i"),
				},
				// {
				// 	muscleGroups: { $in: new RegExp(search, "i") },
				// },
			],
		})
			.sort(sortFormatted)
			.skip(page * pageSize)
			.limit(pageSize)
			.lean();
		const total = await Trainings.countDocuments({
			user: userId,
			title: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			total,
			trainings,
		});
	} else {
		const trainings = await Trainings.find({
			$or: [
				{
					title: new RegExp(search, "i"),
				},
			],
		})
			.sort(sortFormatted)
			.skip(page * pageSize)
			.limit(pageSize)
			.lean();
		const total = await Trainings.countDocuments({
			title: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			total,
			trainings,
		});
	}
};
//get: /trainings
exports.getAllTrainings = async (req, res) => {
	const q = req.query;
	let query;

	let page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	// let total =  Trainings.countDocuments();
	let total;
	if (req.query?.admin) {
		query = Trainings.find().lean();
		total = Trainings.countDocuments();
	} else {
		query = Trainings.find({ approved: true, display: true }).lean();
		total = Trainings.countDocuments({ approved: true, display: true });
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
		// console.log(sortFormatted);
		// query = query.sort(sortFormatted);
		// sortFormatted.forEach((e) => {
		// 	query = query.sort([e]);
		// });
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

	const trainings = await query
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
		message: "Training delivered successfully",
		trainings,
		count: trainings.length,
		total,
		page,
		pages,
	});
};

//get: /trainings/user/:userId
exports.getTrainingsByUser = async (req, res) => {
	const q = req.query;
	let query;

	const { userId } = req.params;
	console.log({ l: q.limit });
	const page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	const total = await Trainings.countDocuments();
	const pages = Math.ceil(total / pageSize);

	if (page > pages) {
		return res.status(400).json({ message: "No page found" });
	}

	query = Trainings.find({ user: userId }).lean();
	if (q.sort) {
		query = query.sort(q.sort);
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

	const trainings = await query.skip(skip).limit(pageSize);

	return res.status(200).json({
		message: "Trainings delivered successfully",
		trainings,
		count: trainings.length,
		total,
		page,
		pages,
	});
};

//delete: /trainings/:trainingId
exports.deleteTraining = async (req, res) => {
	const { trainingId } = req.params;
	const training = await Trainings.findById(trainingId);
	const exercises = training?.exercises;
	if (!training)
		return res
			.status(404)
			.json({ message: `Training with ${trainingId} does not exists` });

	if (training.images && training.images.length > 0) {
		const destroyResponse = await Promise.all(
			training.images.map(
				async (image) => await cloudinary.uploader.destroy(image.public_id),
			),
		);
		console.log(destroyResponse);
		if (destroyResponse) {
			const deletedTraining = await Trainings.findByIdAndDelete(
				trainingId,
			).lean();

			await Exercises.updateMany(
				{ _id: { $in: exercises } },
				{ $inc: { occurrences: -1 } },
			);

			return res.status(200).json({
				message: `Training with ${trainingId} deleted successfully`,
				deletedTraining,
			});
		}
	} else {
		const deletedTraining = await Trainings.findByIdAndDelete(
			trainingId,
		).lean();
		await Exercises.updateMany(
			{ _id: { $in: exercises } },
			{ $inc: { occurrences: -1 } },
		);
		return res.status(200).json({
			message: `Training with ${trainingId} deleted successfully`,
			deletedTraining,
		});
	}
};

//put: /trainings/:trainingId
exports.updateTraining = async (req, res) => {
	const { trainingId } = req.params;
	const { price, images, description, tags } = req.body;
	const admin = req.user.role === "admin";
	console.log({ tags });
	if (images && images.length > 0) {
		const training = await Trainings.findById(trainingId).lean();
		if (!training)
			return res
				.status(400)
				.json({ message: `No training with ${trainingId} exists` });
		const destroyResponse = await Promise.all(
			training.images.map(
				async (image) => await cloudinary.uploader.destroy(image.public_id),
			),
		);
		if (destroyResponse) {
			const uplodRes = await Promise.all(
				images.map(
					async (image) =>
						await cloudinary.uploader.upload(image, {
							upload_preset: "wellnessTrainings",
						}),
				),
			);
			if (uplodRes) {
				const updatedTraining = await Trainings.findByIdAndUpdate(
					trainingId,
					{
						$set: {
							price,
							description,
							images: uplodRes,
							tags,
							approved: admin,
							display: false,
						},
					},
					{ new: true },
				);
				return res.status(200).json({
					message: `Training with id ${trainingId} was updated succesfully`,
					updatedTraining,
				});
			}
		}
	} else {
		const updatedTraining = await Trainings.findByIdAndUpdate(
			trainingId,
			{
				$set: { price, description, tags, approved: admin, display: false },
			},
			{ new: true },
		);
		return res.status(200).json({
			message: `Training with id ${trainingId} was updated succesfully`,
			updatedTraining,
		});
	}
};

//put: /trainings/action/likes/:trainingId
exports.likeTraining = async (req, res) => {
	const userId = req.user._id;
	const { trainingId } = req.params;
	const training = await Trainings.findById(trainingId).select("likes");
	if (training.likes.includes(userId)) {
		training.likes = training.likes.filter((e) => e !== userId.toString());
		await training.save();
	} else {
		await Trainings.findByIdAndUpdate(trainingId, {
			$addToSet: { likes: userId },
			$pull: { dislikes: userId },
		});
	}
	res.status(200).json({
		message: `Training with id ${trainingId} was liked succesfully`,
	});
};
//put: /trainings/action/dislikes/:trainingId
exports.dislikeTraining = async (req, res) => {
	const userId = req.user._id;
	const { trainingId } = req.params;
	const training = await Trainings.findById(trainingId).select("dislikes");
	if (training.dislikes.includes(userId)) {
		training.dislikes = training.dislikes.filter(
			(e) => e !== userId.toString(),
		);
		await training.save();
	} else {
		await Trainings.findByIdAndUpdate(trainingId, {
			$addToSet: { dislikes: userId },
			$pull: { likes: userId },
		});
	}

	res.status(200).json({
		message: `Training with id ${trainingId} was disliked succesfully`,
	});
};

//get: /trainings/:trainingId
exports.getSingleTraining = async (req, res) => {
	const { trainingId } = req.params;

	const training = await Trainings.findById(trainingId).populate("exercises");

	if (!training) {
		return res
			.status(404)
			.json({ message: `Training with id ${trainingId} does not exist` });
	}

	res
		.status(200)
		.json({ message: "Training delivered successfully", training });
};

//get: /trainings/user/bought
exports.getBoughtUserTrainings = async (req, res) => {
	const { subscriptions } = req.user;

	// const orders = await Order.find({ user: userId });
	// // .populate("trainings")
	// // .select("trainings -_id")
	// // .lean();
	// // console.log(orders.map(({ trainings }) => trainings).flat(1));
	// // console.log(orders);
	// console.log(orders[0].total);
	// const trainings = Trainings.find({ _id: { $in: subscriptions } });
	const {
		page = 1,
		pageSize = 20,
		sort = null,
		search = "",
		userId = null,
	} = req.query;
	const generateSort = () => {
		const sortParsed = JSON.parse(sort);
		const sortFormatted = {
			[sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
		};
		return sortFormatted;
	};
	const sortFormatted = Boolean(sort) ? generateSort() : {};

	const trainings = await Trainings.find({
		$or: [
			{
				title: new RegExp(search, "i"),
			},
		],
		_id: { $in: subscriptions },
	})
		.sort(sortFormatted)
		.skip(page * pageSize)
		.limit(pageSize)
		.populate("user", "username")
		.lean();
	const total = await Trainings.countDocuments({
		title: { $regex: search, $options: "i" },
		_id: { $in: subscriptions },
	});
	return res.status(200).json({
		total,
		trainings,
	});
};

// get:/trainings/orders/:orderId
exports.getTrainingsByOrder = async (req, res) => {
	const { orderId } = req.params;
	if (!orderId) {
		return res.status(500).json({ message: "No order id was found" });
	}

	const { trainings, total, user } = await Order.findById(orderId)
		.populate("trainings")
		.select("trainings total user -_id");

	return res.status(200).json({
		trainings,
		total,
		user,
		message: `Trainings for order ${orderId} were delivered`,
	});
};

//put /trainings/admin/approve
exports.approveTrianing = async (req, res) => {
	if (req.user.role !== "admin") {
		res.status(401).json({ message: "You are not authorized" });
	}
	const { trainingId } = req.body;
	const count = await Trainings.countDocuments({
		_id: mongoose.Types.ObjectId(trainingId),
	});
	if (count == 0) {
		return res
			.status(400)
			.json({ message: `No training with id ${trainingId} exsists` });
	}
	const training = await Trainings.findById(trainingId).select(
		"approved display",
	);
	training.approved = !training.approved;
	if (training.approved === false) {
		training.display = false;
	}
	await training.save();
	res.status(201).json({
		message: `Training with id ${trainingId} approved`,
	});
};
//put /trainings/display
exports.displayTraining = async (req, res) => {
	const { trainingId } = req.body;
	const count = await Trainings.countDocuments({
		_id: mongoose.Types.ObjectId(trainingId),
	});
	if (count == 0) {
		res
			.status(400)
			.json({ message: `No training with id ${trainingId} exsists` });
	}
	const training = await Trainings.findById(trainingId).select("display user");
	if (
		req.user.role !== "admin" &&
		req.user._id.toString() !== training.user.toString()
	) {
		return res.status(401).json({ message: "You are not authorized" });
	}

	training.display = !training.display;

	await training.save();
	res.status(201).json({
		message: `Training with id ${trainingId} display is ${training.display}`,
	});
};
