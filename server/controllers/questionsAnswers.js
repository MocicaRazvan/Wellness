const Question = require("../models/Question");
const Answer = require("../models/Answer");

// post: /questionsAnswers/questions
exports.createQuestion = async (req, res) => {
	const { body, tags,title } = req.body;
	if (!body) return res.status(400).json({ message: "Body is required" });
	const question = await Question.create({
		body,
		tags,
		user: req.user._id,
		title,
	});
	return res
		.status(201)
		.json({ question, message: "Question created succesfully" });
};
// post: /questionsAnswers/answers
exports.createAnswer = async (req, res) => {
	const { question, body } = req.body;
	if (!body || !question)
		return res.status(400).json({ message: "Answer fields are required" });
	const answer = await Answer.create({
		question,
		body,
		user: req.user._id,
	});
	return res.status(201).json({ answer, message: "Answer created success" });
};

//put: /qustionAnswers/answers/close
exports.closeQuestion = async (req, res) => {
	const { question } = req.body;
	if (!question)
		return res.status(400).json({ message: "Question id not found" });
	const updatedQuestion = await Question.findByIdAndUpdate(
		question,
		{ isOpen: false },
		{ new: true },
	);

	return res
		.status(201)
		.json({ updatedQuestion, message: "Question closed successfully" });
};
