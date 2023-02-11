const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
	windowMs: 60 * 1000, //1 min
	max: 5, // Limit each IP to 5 login requests per `window` per minut
	message: {
		message:
			"Too many attempts from this IP, please try again after 60 seconds",
	},
	handler: (req, res, next, options) => {
		// only handles the failed case
		logEvents(
			`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			"errLog.log",
		);
		res.status(options.statusCode).json(options.message);
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
