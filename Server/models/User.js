const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 20,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 100,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			maxlength: 50,
		},
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		dateOfBirth: { type: Date, trim: true },
		profilePicture: { type: String, default: "", trim: true },
		coverPicture: { type: String, default: "", trim: true },
		description: { type: String, default: "", trim: true },
		city: { type: String, default: "", trim: true },
		from: { type: String, default: "", trim: true },
		followers: { type: Array, default: [] },
		following: { type: Array, default: [] },
		isAdmin: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

User.plugin(passportLocalMongoose);
User.plugin(findOrCreate);

module.exports = mongoose.model("User", User);
