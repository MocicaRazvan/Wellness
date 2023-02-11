const Orders = require("../models/Order");
const getCountryIso3 = require("country-iso-2-to-3");
//const ObjectId = require("mongoose").mongo.BSONPure.ObjectID.fromHexString;

//get: /orders
// exports.getAllOrders = async (req, res) => {
// 	if (req?.user?.role !== "admin")
// 		return res.status(401).json({ message: "You are not authorized" });

// 	const orders = await Orders.find().lean();

// 	return res.status(200).json({ message: "Orders delivered success", orders });
// };
exports.getAllOrders = async (req, res) => {
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
		const orders = await Orders.find({
			user: userId,
			$or: [
				{
					deliveryStatus: new RegExp(search, "i"),
				},
				// {
				// 	muscleGroups: { $in: new RegExp(search, "i") },
				// },
			],
		})
			.sort(sortFormatted)
			.skip(page * pageSize)
			.limit(pageSize);
		console.log(orders.length);
		const total = await Orders.countDocuments({
			user: userId,
			deliveryStatus: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			total,
			orders,
		});
	} else {
		const orders = await Orders.find({
			$or: [
				{
					deliveryStatus: new RegExp(search, "i"),
				},
				// {
				// 	muscleGroups: { $in: new RegExp(search, "i") },
				// },
			],
		})
			.sort(sortFormatted)
			.skip(page * pageSize)
			.limit(pageSize)
			.populate("user", "username");
		const total = await Orders.countDocuments({
			deliveryStatus: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			total,
			orders,
		});
	}
};

//get: orders/find/:userId
exports.getOrdersByUser = async (req, res) => {
	const { userId } = req.params;

	const orders = await Orders.find({ user: userId })
		.populate("trainings", "title")
		.lean();

	return res
		.status(200)
		.json({ message: `Orders for ${userId} delivered success`, orders });
};

//get: orders/find/admin/:userId
exports.getOrdersByUserAdmin = async (req, res) => {
	const { userId } = req.params;
	console.log(userId);

	const orders = await Orders.find({ user: userId })
		.populate("user")
		.populate("trainings", "title")
		.lean();

	return res
		.status(200)
		.json({ message: `Orders for ${userId} delivered success`, orders });
};
//get: orders/:orderId
exports.getSingleOrder = async (req, res) => {
	const { orderId } = req.params;

	const order = await Orders.findById(orderId)
		//.populate("user")
		.populate("trainings");

	if (!order)
		return res
			.status(404)
			.json({ message: `Order with id ${orderId} does not exist` });
	if (order?.user?._id === req.user._id && req.user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });

	return res
		.status(200)
		.json({ message: `Order with id ${orderId} delivered success`, order });
};

//get: orders/admin/:orderId
exports.getSingleOrderAdmin = async (req, res) => {
	const { orderId } = req.params;

	if (req.user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });

	const order = await Orders.findById(orderId)
		.populate("user")
		.populate("trainings");

	if (!order)
		return res
			.status(404)
			.json({ message: `Order with id ${orderId} does not exist` });

	return res
		.status(200)
		.json({ message: `Order with id ${orderId} delivered success`, order });
};

//put: orders/admin/:orderId
exports.changeOrderStatus = async (req, res) => {
	const { orderId } = req.params;

	if (req.user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });

	const { deliveryStatus } = req.body;

	const newOrder = await Orders.findByIdAndUpdate(
		orderId,
		{ deliveryStatus },
		{ new: true },
	);

	return res.status(201).json({
		message: `Order with id ${orderId} status changed to ${deliveryStatus}`,
		order: newOrder,
	});
};

//delete: orders/admin/:orderId
exports.deleteOrder = async (req, res) => {
	if (req.user.role !== "admin")
		return res.status(401).json({ message: "You are not authorized" });

	const { orderId } = req.params;

	const order = await Orders.findById(orderId).lean();

	if (!order)
		return res
			.status(404)
			.json({ message: `Order with id ${orderId} does not exist` });

	const deletedOrder = await Orders.findByIdAndDelete(orderId).lean();

	return res.status(201).json({
		message: `Order with id ${orderId} deleted success`,
		order: deletedOrder,
	});
};

//get /orders/admin/:month
exports.getOrdersByMonth = async (req, res) => {
	const { month } = req.params;

	if (!month)
		return res.status(400).json({ message: `No month param was found` });
	const orders = await Orders.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
				day: { $dayOfMonth: "$createdAt" },
			},
		},
		{ $match: { month: Number(month) } },
		{ $group: { _id: "$day", total: { $sum: 1 } } },
		{ $sort: { _id: 1 } },
	]);
	console.log(orders);
	res
		.status(200)
		.json({ message: `Orders by month ${month} retrived`, orders });
};
// get: /admin/get/total
exports.getEarnings = async (req, res) => {
	const total = await Orders.aggregate([
		{
			$addFields: {
				month: { $month: "$createdAt" },
				year: { $year: "$createdAt" },
				units: 1,
			},
		},
		{ $match: { year: new Date().getFullYear() } },
		{
			$group: {
				_id: "$month",
				totalSales: { $sum: "$total" },
				totalUnits: { $sum: "$units" },
			},
		},
	]).sort("_id");

	res.status(200).json({ message: "Total retrived", total });
};
// get: /admin/get/dailyTotal
exports.getDailyEarnings = async (req, res) => {
	const total = await Orders.aggregate([
		{
			$addFields: {
				date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				year: { $year: "$createdAt" },
				units: 1,
			},
		},
		{ $match: { year: new Date().getFullYear() } },
		{
			$group: {
				_id: "$date",
				totalSales: { $sum: "$total" },
				totalUnits: { $sum: "$units" },
			},
		},
	]).sort("_id");

	res.status(200).json({ message: "Total retrived", total });
};
// get: /admin/get/tagsStats
exports.getTagsStats = async (req, res) => {
	const stats = await Orders.aggregate([
		{
			$lookup: {
				from: "trainings",
				localField: "trainings",
				foreignField: "_id",
				as: "doc",
			},
		},
		{ $unwind: "$doc" },
		{ $unwind: "$doc.tags" },
		{ $group: { _id: "$doc.tags", total: { $sum: 1 } } },
	]);
	res.status(200).json({ message: "Tag Stats retrived", stats });
};

//get: /admin/all
exports.getAllOrdersAdmin = async (req, res) => {
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
	const orders = await Orders.find({
		$or: [
			{
				deliveryStatus: new RegExp(search, "i"),
			},
			// {
			// 	_id: { $regex: new RegExp(search, "i") },
			// },
		],
	})
		.sort(sortFormatted)
		.skip(page * pageSize)
		.limit(pageSize);
	const total = await Orders.countDocuments({
		deliveryStatus: { $regex: search, $options: "i" },
	});
	console.log(orders);
	return res.status(200).json({
		total,
		orders,
	});
};
//get: /orders/admin/location/country
exports.getOrdersCountry = async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(401).json({ message: "Your are not authorized" });
	}

	const orders = await Orders.find();

	const mappedLocations = orders.reduce(
		(
			acc,
			{
				shipping: {
					address: { country },
				},
			},
		) => {
			const countryISO3 = getCountryIso3(country);
			if (!acc[countryISO3]) {
				acc[countryISO3] = 0;
			}
			acc[countryISO3]++;
			return acc;
		},
		{},
	);

	const locations = Object.entries(mappedLocations).map(([country, count]) => ({
		id: country,
		value: count,
	}));

	return res.status(200).json({ message: "Locations returned", locations });
};
