const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJwt = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(403).json({ message: "Forbidden" });
		}
		const user = await User.findById(decoded.id);
		req.user = user;
		next();
	});
};
module.exports = verifyJwt;
