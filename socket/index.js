const io = require("socket.io")(8900, {
	cors: {
		origin: "http://localhost:3000",
	},
});

let users = [];

const addUser = (userId, socketId, mounted) =>
	!users.some((user) => user.userId === userId) &&
	users.push({ userId, socketId, mounted });

const removeUser = (socketId) =>
	(users = users.filter((user) => user.socketId !== socketId));

const getUser = (userId) => users.find((user) => user.userId === userId);

io.on("connection", (socket) => {
	//when connect
	console.log("a user connected");
	console.log(users);
	// take userId and socket id from user
	socket.on("addUser", ({ id: userId, mounted }) => {
		addUser(userId, socket.id, mounted);
		io.emit("getUsers", users);
		//console.log(users);
	});

	socket.on("mountUser", (userId) => {
		users = users.map((user) =>
			user.userId === userId ? { ...user, mounted: true } : user,
		);
		console.log("mount");
		console.log(users);
	});

	socket.on("unMountUser", (userId) => {
		users = users.map((user) =>
			user.userId === userId ? { ...user, mounted: false } : user,
		);
		console.log("unMount");
		console.log(users);
	});

	socket.on("notifiUnmounted", ({ receiverId, type, sender, ref }) => {
		const user = getUser(receiverId);
		console.log(receiverId);
		if (!user?.mounted) {
			io.to(user.socketId).emit("getNotification", {
				type,
				sender,
				ref,
			});
		}
	});

	//send and get message
	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		const sender = getUser(senderId);

		console.log("sendmsg");
		// console.log(user);
		// console.log(sender);
		io.to(sender.socketId).emit("getPartener", {
			user,
		});

		if (user) {
			io.to(user.socketId).emit("getMessage", {
				senderId,
				text,
			});
		}
	});

	//when diconnect
	socket.on("disconnect", () => {
		console.log("a user disconnected");
		removeUser(socket.id);
		io.emit("getUsers", users);
	});
});
