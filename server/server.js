require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const { logEvents, logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnect");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json({ limit: "100mb" }));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/exercises", require("./routes/exercises"));
app.use("/trainings", require("./routes/trainings"));
app.use("/user", require("./routes/user"));
app.use("/orders", require("./routes/orders"));
app.use("/conversations", require("./routes/conversation"));
app.use("/messages", require("./routes/message"));
app.use("/notifications", require("./routes/notification"));

app.use("/stripe", require("./routes/stripe"));

app.use("/backup", require("./routes/dbBackup"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log",
	);
});
