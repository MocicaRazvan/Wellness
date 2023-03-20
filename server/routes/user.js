const express = require("express");
const verifyJwt = require("../middleware/verifyJwt");
const userController = require("../controllers/user");

const router = express.Router();

router.route("/single").get(verifyJwt, userController.getSingleUser);
router.route("/countStats").get(verifyJwt, userController.getCountStats);
router.route("/admin/totalMonth").get(verifyJwt, userController.getTotalMonth);
router.route("/admin/all").get(verifyJwt, userController.getAllUsersAdmin);
router
	.route("/admin/month/all")
	.get(verifyJwt, userController.getAllMonthlyStats);
router
	.route("/admin/relativeStats")
	.get(verifyJwt, userController.getAdminRelativeStats);
router
	.route("/admin/countStats")
	.get(verifyJwt, userController.getAllCountsAdmin);
router.route("/update").put(verifyJwt, userController.updateUser);
router.route("/:userId").get(verifyJwt, userController.getUserById);
router
	.route("/admin/trainer/:userId")
	.put(verifyJwt, userController.makeUserTrainer);

module.exports = router;
