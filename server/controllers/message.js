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
	const messages = await Message.find({
		conversation: req.params.conversationId,
	});

	return res.status(200).json({ messages, message: "Messages reetrived" });
};
