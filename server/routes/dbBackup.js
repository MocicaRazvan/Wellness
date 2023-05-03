const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const pathFile = path.join(__dirname, "../../../WelnessImages/db");
const Exercises = require("../models/Exercise");
const Orders = require("../models/Order");
const Trainings = require("../models/Training");
const Posts = require("../models/Post");
const Users = require("../models/User");
const Comments = require("../models/Comment");
const Conversations = require("../models/Conversation");
const Messages = require("../models/Message");

const createFile = async ({ name, MNG }) => {
	const data = await MNG.find().lean();
	const parsed = JSON.stringify(data);

	const dataPath = path.join(pathFile, `${name}.json`);
	await fs.writeFile(dataPath, parsed);
};

const updateDb = async ({ name, MNG }) => {
	const dataPath = path.join(pathFile, `${name}.json`);
	const data = await fs.readFile(dataPath);
	const parsed = JSON.parse(data);
	const insertRes = await MNG.insertMany(parsed);
	if (insertRes) console.log("inserted");
};

router.get("/exercises", async (req, res) => {
	console.log("herer");
	// const exercises = await Exercises.find().lean();
	// const parsed = JSON.stringify(exercises);

	// const exercisesPath = path.join(pathFile, "Exercieses.json");
	// await fs.writeFile(exercisesPath, parsed);

	await createFile({ name: "Exercises", MNG: Exercises });
	res.send();
});

router.get("/exercises/put", async (req, res) => {
	// const exercisesPath = path.join(pathFile, "Exercieses.json");
	// const exercises = await fs.readFile(exercisesPath);
	// const parsed = JSON.parse(exercises);
	// // const insertRes = await Exercises.insertMany(parsed);
	// console.log({ insertRes });
	// await updateDb({name:"Exercises",MNG:Exercises});
	res.send();
});

router.get("/orders", async (req, res) => {
	await createFile({ name: "Orders", MNG: Orders });
	res.send();
});
router.get("/trainings", async (req, res) => {
	await createFile({ name: "Trainings", MNG: Trainings });
	res.send();
});
router.get("/posts", async (req, res) => {
	await createFile({ name: "Posts", MNG: Posts });
	res.send();
});
router.get("/users", async (req, res) => {
	await createFile({ name: "Users", MNG: Users });
	res.send();
});
router.get("/comments", async (req, res) => {
	await createFile({ name: "Comments", MNG: Comments });
	res.send();
});
router.get("/conversations", async (req, res) => {
	await createFile({ name: "Conversations", MNG: Conversations });
	res.send();
});
router.get("/messages", async (req, res) => {
	await createFile({ name: "Messages", MNG: Messages });
	res.send();
});
module.exports = router;
