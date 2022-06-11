const router = require("express").Router();
const Conversation = require("../models/Conversation");

// NEW Conversation
router.post("/", async (req, res) => {
	const newConversation = new Conversation({
		members: [req.body.senderId, req.body.receiverId],
	});
	try {
		const conversation = await newConversation.save();
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET Conversation of a user
router.get("/:userId", async (req, res) => {
	try {
		const conversations = await Conversation.find({
			members: { $in: [req.params.userId] },
		});
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET CONVERSATION of two users
router.get("/:firstUserId/:secondUserId", async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			members: { $all: [req.params.firstUserId, req.params.secondUserId] },
		});
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
