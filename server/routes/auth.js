const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgotPassowrd);
router.route("/resetPassword/:resetToken").put(authController.resetPassword);

module.exports = router;
