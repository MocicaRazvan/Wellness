const express = require("express");
const verifyJwt = require("../middleware/verifyJwt");
const ordersController = require("../controllers/orders");
const router = express.Router();

router.use(verifyJwt);

router.route("/").get(ordersController.getAllOrders);
router.route("/find/:userId").get(ordersController.getOrdersByUser);
router.route("/find/admin/:userId").get(ordersController.getOrdersByUserAdmin);
router.route("/:orderId").get(ordersController.getSingleOrder);
router.route("/admin/all").get(verifyJwt, ordersController.getAllOrdersAdmin);
router
	.route("/admin/location/country")
	.get(verifyJwt, ordersController.getOrdersCountry);
router
	.route("/admin/:orderId")
	.get(ordersController.getSingleOrderAdmin)
	.delete(ordersController.deleteOrder);
router.route("/bought/:orderId").put(ordersController.changeOrderStatus);
router
	.route("/admin/month/:month")
	.get(verifyJwt, ordersController.getOrdersByMonth);
router
	.route("/admin/get/total/:year/:admin")
	.get(verifyJwt, ordersController.getEarnings);
router
	.route("/admin/get/dailyTotal/:admin")
	.get(verifyJwt, ordersController.getDailyEarnings);
router
	.route("/admin/get/tagsStats")
	.get(verifyJwt, ordersController.getTagsStats);
router
	.route("/session/:session")
	.get(verifyJwt, ordersController.updateSession);
router
	.route("/user/month/:year/:userId")
	.get(verifyJwt, ordersController.getTotalUserMonth);
router
	.route("/trainer/month/earnings/:userId/:year")
	.get(verifyJwt, ordersController.getUserMonthEarnings);
router
	.route("/trainer/daily/earnings/:userId")
	.get(verifyJwt, ordersController.getUserDailyEarnings);

module.exports = router;
