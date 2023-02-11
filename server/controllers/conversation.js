const Conversation = require("../models/Conversation");
const User = require("../models/User");

// post : /conversations
exports.createConversation = async (req, res) => {
	const newConversation = new Conversation({
		members: [req.body.senderId, req.body.receiverId],
	});
	const savedConversation = await newConversation.save();
	return res
		.status(201)
		.json({ savedConversation, message: "Conversation created" });
};

//post: /conversations/support
exports.createConversationSupport = async (req, res) => {
	const conversation = await Conversation.findOne({
		members: { $in: [req.body.senderId] },
	});
	if (conversation)
		return res.status(200).json({
			savedConversation: conversation,
			message: "Converastion already exists",
		});

	const rereceiver = await User.findOne({ role: "admin" }).lean();

	const newConversation = new Conversation({
		members: [req.body.senderId, rereceiver._id],
	});
	const savedConversation = await newConversation.save();
	return res
		.status(201)
		.json({ savedConversation, message: "Conversation created" });
};

//get : /conversations/:userId
exports.getConversationsByUser = async (req, res) => {
	const userConversations = await Conversation.find({
		members: { $in: [req.params.userId] },
	});
	console.log(userConversations);
	res
		.status(200)
		.json({ userConversations, message: "User conversation retrived" });
};

//get: /conversations/find/:conversationId
exports.getConversationById = async (req, res) => {
	const conversation = await Conversation.findById(req.params.conversationId);

	res.status(200).json({
		conversation,
		message: `Converastion with id ${req.params.conversationId} retrived`,
	});
};
