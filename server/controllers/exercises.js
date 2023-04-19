const Exercises = require("../models/Exercise");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const Trainings = require("../models/Training");

//post: /exercises/create
exports.createExercise = async (req, res) => {
	const { body, muscleGroups, title, videos } = req.body;
	const count = await Exercises.countDocuments({
		title,
		user: { $eq: mongoose.Types.ObjectId(req.user._id) },
	});
	if (count > 0)
		return res
			.status(400)
			.json({ message: "Please enter a title that you havent used!" });
	// video upload to cloudinary
	try {
		if (videos && videos.length > 0) {
			const uplodRes = await Promise.all(
				videos.map(
					async (videos) =>
						await cloudinary.uploader.upload_large(videos, {
							upload_preset: "welnessExercises",
							resource_type: "video",
							chunk_size: 6000000,
						}),
				),
			);
			if (uplodRes && uplodRes.length > 0) {
				const exercise = new Exercises({
					body,
					muscleGroups,
					title,
					videos: uplodRes,
					user: req.user._id,
				});

				const savedExercise = await exercise.save();
				//console.log(savedExercise);

				return res.status(200).json({
					message: "Exercise Created Successfully",
					exercise: savedExercise,
				});
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

//get: /exercises/user/:userId
exports.getExercisesByUser = async (req, res) => {
	const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
	const { userId } = req.params;
	const generateSort = () => {
		const sortParsed = JSON.parse(sort);
		const sortFormatted = {
			[sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
		};
		return sortFormatted;
	};
	const sortFormatted = Boolean(sort) ? generateSort() : {};

	const exercises = await Exercises.find({
		user: userId,
		$or: [
			{
				title: new RegExp(search, "i"),
			},
			{
				muscleGroups: { $in: new RegExp(search, "i") },
			},
		],
	})
		.sort(sortFormatted)
		.skip(page * pageSize)
		.limit(pageSize);

	const total = await Exercises.countDocuments({
		user: userId,
		title: { $regex: search, $options: "i" },
	});

	res.status(200).json({
		total,
		exercises,
	});
};
// //get: /exercises/user/:userId
// exports.getExercisesByUser = async (req, res) => {
// 	const q = req.query;
// 	let query;
// 	const { userId } = req.params;

// 	const page = parseInt(q.page) || 1;
// 	const pageSize = parseInt(q.limit) || 20;
// 	const skip = (page - 1) * pageSize;
// 	const total = await Exercises.countDocuments();
// 	const pages = Math.ceil(total / pageSize);

// 	query = Exercises.find({ user: userId });
// 	if (q.sort) {
// 		query = query.sort(q.sort);
// 	}
// 	if (q.search) {
// 		query = query.find({
// 			title: { $regex: q.search, $options: "i" },
// 		});
// 	}
// 	if (q?.muscleGroups && q?.muscleGroups?.length > 0) {
// 		const muscleGroups = q.muscleGroups.split(",");
// 		query = query.find({ muscleGroups: { $in: muscleGroups } });
// 	}

// 	const exercises = await query.skip(skip).limit(pageSize);
// 	res.status(200).json({
// 		message: "User's exercises received",
// 		exercises,
// 		count: exercises.length,
// 		page,
// 		pages,
// 	});
// };

//get: /exercises
exports.getAllExercises = async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(401).json({ message: "You are not authorized" });
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

	const exercises = await Exercises.find({
		$or: [
			{
				title: new RegExp(search, "i"),
			},
			{
				muscleGroups: { $in: new RegExp(search, "i") },
			},
		],
	})
		.sort(sortFormatted)
		.skip(page * pageSize)
		.limit(pageSize);

	const total = await Exercises.countDocuments({
		title: { $regex: search, $options: "i" },
	});

	res.status(200).json({
		total,
		exercises,
	});
};
// //get: /exercises
// exports.getAllExercises = async (req, res) => {
// 	if (req.user.role !== "admin") {
// 		return res.status(401).json({ message: "You are not authorized" });
// 	}

// 	const q = req.query;
// 	let query;

// 	const page = parseInt(q.page) || 1;
// 	const pageSize = parseInt(q.limit) || 20;
// 	const skip = (page - 1) * pageSize;
// 	const total = await Exercises.countDocuments();
// 	const pages = Math.ceil(total / pageSize);

// 	query = Exercises.find();
// 	if (q.sort) {
// 		query = query.sort(q.sort);
// 	}
// 	if (q.search) {
// 		query = query.find({
// 			title: { $regex: q.search, $options: "i" },
// 		});
// 	}
// 	if (q?.muscleGroups && q?.muscleGroups?.length > 0) {
// 		const muscleGroups = q.muscleGroups.split(",");
// 		query = query.find({ muscleGroups: { $in: muscleGroups } });
// 	}

// 	const exercises = await query.skip(skip).limit(pageSize);
// 	res.status(200).json({
// 		message: "All exercises received",
// 		exercises,
// 		count: exercises.length,
// 		page,
// 		pages,
// 	});
// };
//put: /exercises/:exerciseId
exports.updateExercise = async (req, res) => {
	const { exerciseId } = req.params;
	const { title, muscleGroups, body, videos } = req.body;
	const admin = req.user.role === "admin";

	const count = await Exercises.countDocuments({
		title,
		user: { $eq: mongoose.Types.ObjectId(req.user._id) },
		_id: { $ne: mongoose.Types.ObjectId(exerciseId) },
	});
	console.log({ count, _id: req.user._id, exerciseId });
	if (count > 0)
		return res
			.status(400)
			.json({ message: "Please enter a title that you havent used!" });

	if (videos && videos.length > 0) {
		const exercise = await Exercises.findById(exerciseId).lean();

		if (!exercise)
			return res
				.status(400)
				.json({ message: `No exercise with ${exerciseId} exists` });
		const destroyResponse = await Promise.all(
			exercise.videos.map(
				async (video) =>
					await cloudinary.uploader.destroy(video.public_id, {
						resource_type: "video",
					}),
			),
		);
		if (destroyResponse) {
			console.log(destroyResponse);
			const uplodRes = await Promise.all(
				videos.map(
					async (videos) =>
						await cloudinary.uploader.upload_large(videos, {
							upload_preset: "welnessExercises",
							resource_type: "video",
							chunk_size: 6000000,
						}),
				),
			);
			if (uplodRes) {
				const updatedExercise = await Exercises.findByIdAndUpdate(
					exerciseId,
					{
						$set: { title, muscleGroups, body, videos: uplodRes },
					},
					{ new: true },
				);
				await Trainings.updateMany(
					{ exercises: mongoose.Types.ObjectId(exerciseId) },
					{ approved: admin, display: false },
				);
				return res.status(200).json({
					message: `Exercise with id ${exerciseId} was updated succesfully`,
					updatedExercise,
				});
			}
		}
	} else {
		const updatedExercise = await Exercises.findByIdAndUpdate(
			exerciseId,
			{
				$set: { title, muscleGroups, body },
			},
			{ new: true },
		);
		 await Trainings.updateMany(
			{ exercises: mongoose.Types.ObjectId(exerciseId) },
			{ approved: admin, display: false },
		);
		
		return res.status(200).json({
			message: `Post with id ${exerciseId} was updated succesfully`,
			updatedExercise,
		});
	}
};
//delete /exercises/:exerciseId
exports.deleteExercise = async (req, res) => {
	const { exerciseId } = req.params;
	const exercise = await Exercises.findById(exerciseId);
	if (!exercise)
		return res
			.status(404)
			.json({ message: `Exercise with ${exerciseId} does not exists` });

	if (exercise.videos && exercise.videos.length > 0) {
		const destroyResponse = await Promise.all(
			exercise.videos.map(
				async (video) =>
					await cloudinary.uploader.destroy(video.public_id, {
						resource_type: "video",
					}),
			),
		);
		console.log(destroyResponse);
		if (destroyResponse) {
			const deletedExercise = await Exercises.findByIdAndDelete(
				exerciseId,
			).lean();
			return res.status(200).json({
				message: `Exercise with ${exerciseId} deleted successfully`,
				deletedExercise,
			});
		}
	} else {
		const deletedExercise = await Exercises.findByIdAndDelete(
			exerciseId,
		).lean();
		return res.status(200).json({
			message: `Exercise with ${exerciseId} deleted successfully`,
			deletedExercise,
		});
	}
};
//get /exercises/:exerciseId
exports.getExerciseById = async (req, res) => {
	const { exerciseId } = req.params;

	const exercise = await Exercises.findById(exerciseId).lean();
	if (!exercise) {
		return res
			.status(400)
			.json({ message: `No exercises with id ${exerciseId} exsists` });
	}
	if (
		exercise.user.toString() !== req.user._id.toString() &&
		req.user.role !== "admin"
	) {
		return res.status(401).json({ message: "You are not authorized" });
	}
	return res
		.status(200)
		.json({ message: "Exercise delivered successfully", exercise });
};
// get: exercises/user/ids/:userId
exports.getExercisesIdsByUser = async (req, res) => {
	const { userId } = req.params;
	console.log(userId);

	const ids = await Exercises.find({
		user: mongoose.Types.ObjectId(userId),
	}).select({ _id: 1, title: 1 });

	return res
		.status(200)
		.json({ ids, message: `Ids of exercises for user ${userId}` });
};
