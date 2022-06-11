const mongoose = require("mongoose");
const {CommentSchema} = require( "./Comment" );

const PostSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			trim: true,
		},
		userId: {
			type: String,
			required: true,
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: {
			type: [CommentSchema],
			default: [],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", PostSchema);
