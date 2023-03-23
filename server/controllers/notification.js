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

	const notifications = await Notification.find({ receiver })
		.populate("sender", "username")
		.limit(10);

	return res.status(200).json({
		message: `Notifications for user ${receiver} retrived`,
		notifications,
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

//delete notifications/receiver/:senderId
exports.deleteNotificaionsBySender = async (req, res) => {
	const { senderId } = req.params;

	const ids = await Notification.find({ sender: senderId }).select("_id");
	if (!ids)
		return res.status(400).json({
			message: `Notifications with sender ${senderId} is not valid`,
		});

	const deleteRes = await Notification.deleteMany({ sender: senderId });

	if (!deleteRes?.acknowledged)
		return res.status(400).json({
			message: `Notifications with sender ${senderId} is not valid`,
		});

	return res.status(200).json({
		message: `Notifications with sender ${senderId} deleted`,
		ids,
	});
};
