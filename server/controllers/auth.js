const User = require("../models/User");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary");
const makeReset = require("../utils/email/reset");
const makeAuth = require("../utils/email/auth");

// post: /auth/register
exports.register = async (req, res) => {
	const { image, ...rest } = req.body;

	if (image) {
		const uplodRes = await cloudinary.uploader.upload(image, {
			upload_preset: "wellnessUser",
		});
		if (uplodRes) {
			const user = await User.create({
				...rest,
				image: uplodRes,
			});
			const token = user.getSignedToken();
			const verifyUser = await User.findById(user._id);

			await sendEmail({
				to: verifyUser?.email,
				subject: "Welcome to Wellness",
				text: makeAuth(verifyUser?.username),
			});

			res
				.status(201)
				.json({ message: "User created", token, user: verifyUser });
		}
	} else {
		const user = await User.create({ ...rest });
		const token = user.getSignedToken();
		const verifyUser = await User.findById(user._id);
		await sendEmail({
			to: verifyUser?.email,
			subject: "Welcome to Wellness",
			text: makeAuth(verifyUser?.username),
		});
		res.status(201).json({ message: "User created", token, user: verifyUser });
	}
};

// post: /auth/login
exports.login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return res.status(401).json({ message: "Credentials are not valid" });
	}

	const isMatch = await user.mathcPasswords(password);

	if (!isMatch) {
		return res.status(401).json({ message: "Credentials are not valid" });
	}

	const token = user.getSignedToken();

	const verifyUser = await User.findById(user._id);

	res.status(200).json({ message: "Login success", token, user: verifyUser });
};

// post: /auth/forgotPassword
exports.forgotPassowrd = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(401).json({ message: "Credentails are not valid" });
	}

	const resetToken = user.getResetPasswordToken();

	await user.save();

	const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

	// const message = `
	// 	<h1>You have requested a password reset </h1>
	// 	<p>Please go to this link to reset your passowrd </p>
	// 	<a href=${resetUrl} clicktracking=off> ${resetUrl}</a>
	// 	`;
	const message = makeReset(resetUrl);

	try {
		await sendEmail({
			to: user.email,
			subject: "Password Reset Request",
			text: message,
		});
		res.status(200).json({ message: "Email sent " });
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		throw error;
	}
};

// PUT: /auth/restepassword

exports.resetPassword = async (req, res) => {
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex"); // recreating the reset token

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return res.status(400).json({ message: "Reset Token is not valid" });
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	res.status(201).json({ success: true, message: "Passowrd Reset Success" });
};
