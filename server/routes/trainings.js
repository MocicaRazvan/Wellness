const express = require("express");
const trainingsController = require("../controllers/trainings");
const verifyJwt = require("../middleware/verifyJwt");
const router = express.Router();

router.route("/").get(trainingsController.getAllTrainings);
router.route("/create").post(verifyJwt, trainingsController.createTraining);
router.route("/display").put(verifyJwt, trainingsController.displayTraining);
router
	.route("/admin/approve")
	.put(verifyJwt, trainingsController.approveTrianing);
router
	.route("/user/bought")
	.get(verifyJwt, trainingsController.getBoughtUserTrainings);
router.route("/user").get(verifyJwt, trainingsController.getAllUserTrainings);
router.route("/user/:userId").get(trainingsController.getTrainingsByUser);
router
	.route("/:trainingId")
	.put(verifyJwt, trainingsController.updateTraining)
	.delete(verifyJwt, trainingsController.deleteTraining)
	.get(trainingsController.getSingleTraining);
router
	.route("/action/likes/:trainingId")
	.put(verifyJwt, trainingsController.likeTraining);
router
	.route("/action/dislikes/:trainingId")
	.put(verifyJwt, trainingsController.dislikeTraining);
router.route("/orders/:orderId").get(trainingsController.getTrainingsByOrder);

module.exports = router;
