const Notification = require("../models/Notification");
//post:notifications
exports.createNotification = async (req, res) => {
	if (!Object.values(req.body).every(Boolean)) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const newNotification = new Notification(req.body);

	const savedNotification = await newNotification.save();

	console.log(savedNotification);
	return res
		.status(201)
		.json({ savedNotification, message: "Notification created" });
};

//get notifications/:receiverId
exports.getNotificationsByUser = async (req, res) => {
	const { receiverId: receiver } = req.params;
	//console.log(req.params);

	const notifications = await Notification.find({ receiver, type: "message" })
		.populate("sender", "username")
		.lean();
	// .limit(10);

	const postApprove = await Notification.find({
		receiver,
		type: "post/approve",
	});
	const postDisapprove = await Notification.find({
		receiver,
		type: "post/disapprove",
	});
	const postDelete = await Notification.find({
		receiver,
		type: "post/delete",
	});
	const trainingApprove = await Notification.find({
		receiver,
		type: "training/approve",
	});
	const trainingDisapprove = await Notification.find({
		receiver,
		type: "training/disapprove",
	});
	const trainingDelete = await Notification.find({
		receiver,
		type: "training/delete",
	});
	const trainingBought = await Notification.find({
		receiver,
		type: "training/bought",
	});

	console.log({ postApprove, postDisapprove });

	return res.status(200).json({
		message: `Notifications messages for user ${receiver} retrived`,
		notifications,
		postApprove,
		postDisapprove,
		postDelete,
		trainingApprove,
		trainingDisapprove,
		trainingDelete,
		trainingBought,
	});
};

// delete notifications/:notificationId
exports.deleteNotificationById = async (req, res) => {
	const { notificationId } = req.params;
	const notification = await Notification.findByIdAndDelete(notificationId);

	if (!notification)
		return res.status(400).json({
			message: `Notification with id ${notificationId} does not exist`,
		});

	return res.status(200).json({
		message: `Notification with id ${notificationId} deleted`,
		notification,
	});
};

//delete notifications/user/:receiverId
exports.deleteUserNotifications = async (req, res) => {
	const { receiverId } = req.params;
	console.log({ receiverId });
	const ids = await Notification.find({ receiver: receiverId }).select("_id");
	if (!ids)
		return res.status(400).json({
			message: `User with id ${receiverId} is not valid`,
		});

	const deleteRes = await Notification.deleteMany({ receiver: receiverId });

	if (!deleteRes?.acknowledged)
		return res.status(400).json({
			message: `User with id ${receiverId} is not valid`,
		});

	return res
		.status(200)
		.json({ message: `Notifications for user ${receiverId} deleted`, ids });
};
//delete notifications/user/approved/:type
exports.deleteUserApproved = async (req, res) => {
	const { type } = req.params;
	let types = [];
	if (type === "post") {
		types = ["post/approve", "post/disapprove", "post/delete"];
	} else if (type === "training") {
		types = [
			"training/approve",
			"training/disapprove",
			"training/delete",
			"training/bought",
		];
	}

	const ids = await Notification.find({
		receiver: req.user._id,
		type: { $in: types },
	}).select("_id");
	if (!ids)
		return res.status(400).json({
			message: `User with id ${req.user._id} is not valid`,
		});

	const deleteRes = await Notification.deleteMany({
		receiver: req.user._id,
		type: { $in: types },
	});

	if (!deleteRes?.acknowledged)
		return res.status(400).json({
			message: `User with id ${req.user._id} is not valid`,
		});

	return res
		.status(200)
		.json({ message: `Notifications for user ${req.user._id} deleted`, ids });
};

//delete notifications/receiver/:senderId
exports.deleteNotificaionsBySender = async (req, res) => {
	const { senderId } = req.params;
	console.log({ senderId });

	const ids = await Notification.find({
		sender: senderId,
		type: "message",
	}).select("_id");
	if (!ids)
		return res.status(400).json({
			message: `Notifications with sender ${senderId} is not valid`,
		});

	const deleteRes = await Notification.deleteMany({
		sender: senderId,
		type: "message",
	});

	if (!deleteRes?.acknowledged)
		return res.status(400).json({
			message: `Notifications with sender ${senderId} is not valid`,
		});

	return res.status(200).json({
		message: `Notifications with sender ${senderId} deleted`,
		ids,
	});
};
