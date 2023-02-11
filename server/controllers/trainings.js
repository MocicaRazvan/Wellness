const Trainings = require("../models/Training");
const cloudinary = require("../utils/cloudinary");

//post: /trainings/create
exports.createTraining = async (req, res) => {
	const { title, tags, exercises, price, images, description } = req.body;
	// image upload to cloudinary
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
				});

				const savedTraining = await training.save();
				//console.log(savedTraining);

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
			.limit(pageSize);
		console.log(trainings.length);
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
				// {
				// 	muscleGroups: { $in: new RegExp(search, "i") },
				// },
			],
		})
			.sort(sortFormatted)
			.skip(page * pageSize)
			.limit(pageSize);
		const total = await Trainings.countDocuments({
			title: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			total,
			trainings,
		});
	}
};
exports.getAllTrainings = async (req, res) => {
	const q = req.query;
	let query;

	const page = parseInt(q.page) || 1;
	const pageSize = parseInt(q.limit) || 20;
	const skip = (page - 1) * pageSize;
	const total = await Trainings.countDocuments();
	const pages = Math.ceil(total / pageSize);

	if (page > pages) {
		return res.status(400).json({ message: "No page found" });
	}

	query = Trainings.find().lean();
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
		// sortFormatted.forEach((e) => {
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

	const trainings = await query
		.populate("user", "username")
		.skip(skip)
		.limit(pageSize);

	return res.status(200).json({
		message: "Training delivered successfully",
		trainings,
		count: trainings.length,
		page,
		pages,
	});
};

//get: /trainings/user/:userId
exports.getTrainingsByUser = async (req, res) => {
	const q = req.query;
	let query;

	const { userId } = req.params;

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
		message: "Post delivered successfully",
		trainings,
		count: trainings.length,
		page,
		pages,
	});
};

//delete: /trainings/:trainingId
exports.deleteTraining = async (req, res) => {
	const { trainingId } = req.params;
	const training = await Trainings.findById(trainingId);
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
			return res.status(200).json({
				message: `Training with ${trainingId} deleted successfully`,
				deletedTraining,
			});
		}
	} else {
		const deletedTraining = await Trainings.findByIdAndDelete(
			trainingId,
		).lean();
		return res.status(200).json({
			message: `Training with ${trainingId} deleted successfully`,
			deletedTraining,
		});
	}
};

//put: /trainings/:trainingId
exports.updateTraining = async (req, res) => {
	const { trainingId } = req.params;
	const { title, tags, exercises, price, images, description } = req.body;

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
							title,
							tags,
							exercises,
							price,
							description,
							images: uplodRes,
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
				$set: { title, tags, exercises, price, description },
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
	await Trainings.findByIdAndUpdate(trainingId, {
		$addToSet: { likes: userId },
		$pull: { dislikes: userId },
	});
	res
		.status(200)
		.json({ message: `Training with id ${trainingId} was liked succesfully` });
};
//put: /trainings/action/dislikes/:trainingId
exports.dislikeTraining = async (req, res) => {
	const userId = req.user._id;
	const { trainingId } = req.params;
	await Trainings.findByIdAndUpdate(trainingId, {
		$addToSet: { dislikes: userId },
		$pull: { likes: userId },
	});
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
