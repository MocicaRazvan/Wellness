const express = require("express");
const commentsController = require("../controllers/comments");
const verifyJwt = require("../middleware/verifyJwt");

const router = express.Router();

router
	.route("/")
	.get(commentsController.getComments)
	.post(verifyJwt, commentsController.createComment);

router
	.route("/action/likes/:commentId")
	.put(verifyJwt, commentsController.likeComment);
router
	.route("/action/dislikes/:commentId")
	.put(verifyJwt, commentsController.dislikeComment);

router
	.route("/:commentId")
	.put(verifyJwt, commentsController.updateComment)
	.delete(verifyJwt, commentsController.deleteComment);

module.exports = router;
