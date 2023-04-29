const Message = require("../models/Message");

// post : /messages
exports.createMessage = async (req, res) => {
	const newMessage = new Message(req.body);
	const savedMessage = await newMessage.save();
	//console.log("msg");
	return res.status(201).json({ savedMessage, message: "Message created" });
};

//get : /messages/:conversationId

exports.getMessagesFromAConversation = async (req, res) => {
	const conversationId = req.params?.conversationId;
	if (conversationId !== "null") {
		const messages = await Message.find({
			conversation: conversationId,
		});
		return res.status(200).json({ messages, message: "Messages reetrived" });
	}
	return res.status(400).json({ message: "No conversation", messages: [] });
};
