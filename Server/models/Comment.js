const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
		trim: true,
	},
	userId: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Comment, CommentSchema };
