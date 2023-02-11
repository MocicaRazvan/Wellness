const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please provide a username"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 6,
			select: false, // the password wont be returned if not specified directly
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		role: {
			type: String,
			enum: ["user", "trainer", "admin"],
			default: "user",
		},
		subscriptions: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Training" }],
			default: [],
		},
		image: {
			type: Object,
			default: {},
		},
		location: { type: String, default: "" },
		occupation: { type: String, default: "" },
		phoneNumber: { type: String, default: "" },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next(); // so we wont rehash the passowrd
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.mathcPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
	const id = this.id;
	const {
		username,
		role,
		email,
		subscriptions,
		image,
		location,
		occupation,
		phoneNumber,
	} = this;
	return jwt.sign(
		{
			id,
			username,
			role,
			email,
			subscriptions,
			//image,
			// location,
			// occupation,
			// phoneNumber,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		},
	);
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); //now + 10min

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
