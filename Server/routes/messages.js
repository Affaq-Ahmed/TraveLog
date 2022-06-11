const router = require("express").Router();
const Message = require("../models/Message");

//ADD Message
router.post("/", async (req, res) => {
	const newMessage = new Message({
		conversationId: req.body.conversationId,
		sender: req.body.senderId,
		text: req.body.text,
	});
	try {
		const message = await newMessage.save();
		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET Messages of a conversation
router.get("/:conversationId", async (req, res) => {
	try {
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		});
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
