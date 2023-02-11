const express = require("express");
const questionsAnswersController = require("../controllers/questionsAnswers");
const verifyJwt = require("../middleware/verifyJwt");
const router = express.Router();

router
	.route("/questions")
	.post(verifyJwt, questionsAnswersController.createQuestion);
router
	.route("/answers")
	.post(verifyJwt, questionsAnswersController.createAnswer);
router
	.route("/answers/close")
	.post(verifyJwt, questionsAnswersController.closeQuestion);

module.exports = router;
