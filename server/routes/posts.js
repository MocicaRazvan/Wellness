const express = require("express");
const postController = require("../controllers/posts");
const verifyJwt = require("../middleware/verifyJwt");
const router = express.Router();

router.route("/create").post(verifyJwt, postController.createPost);
router.route("/").get(postController.getAllPosts);
router.route("/display").put(verifyJwt, postController.displayPost);
router.route("/admin").get(verifyJwt, postController.getAllPostsAdmin);
router.route("/admin/approve").put(verifyJwt, postController.approvePosts);
router.route("/find/:postId").get(postController.getPostById);
router
	.route("/:postId")
	.delete(verifyJwt, postController.deletePost)
	.put(verifyJwt, postController.updatePost);
router.route("/user/:userId").get(verifyJwt, postController.getPostsByUser);
router.route("/action/likes/:postId").put(verifyJwt, postController.likePost);
router
	.route("/action/dislikes/:postId")
	.put(verifyJwt, postController.dislikePost);

module.exports = router;
