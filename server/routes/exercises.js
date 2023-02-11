const express = require("express");
const verifyJwt = require("../middleware/verifyJwt");
const exerciseController = require("../controllers/exercises");
const router = express.Router();

router.route("/create").post(verifyJwt, exerciseController.createExercise);
router
	.route("/user/:userId")
	.get(verifyJwt, exerciseController.getExercisesByUser);
router.route("/").get(verifyJwt, exerciseController.getAllExercises);
router
	.route("/:exerciseId")
	.put(verifyJwt, exerciseController.updateExercise)
	.delete(verifyJwt, exerciseController.deleteExercise)
	.get(verifyJwt, exerciseController.getExerciseById);
router
	.route("/user/ids/:userId")
	.get(verifyJwt, exerciseController.getExercisesIdsByUser);

module.exports = router;
