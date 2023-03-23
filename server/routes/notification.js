const express = require("express");
const verifyJwt = require("../middleware/verifyJwt");
const notificationsController = require("../controllers/notification");

const router = express.Router();

router
	.route("/:receiverId")
	.get(verifyJwt, notificationsController.getNotificationsByUser);

router
	.route("/:notificationId")
	.delete(verifyJwt, notificationsController.deleteNotificationById);

router
	.route("/user/:receiverId")
	.delete(verifyJwt, notificationsController.deleteUserNotifications);

router
	.route("/receiver/:senderId")
	.delete(verifyJwt, notificationsController.deleteNotificaionsBySender);

router.route("/").post(verifyJwt, notificationsController.createNotification);

module.exports = router;
