const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("../passport-setup");

let transporter = nodemailer.createTransport({
	service: "hotmail",
	auth: {
		user: "affaqahmed165@outlook.com",
		pass: "Affaq165",
	},
});

//AUTH ROUTES
//REGISTER ROUTE
router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	try {
		const user = await User.findOne({ username });
		if (user) {
			res.status(400).json({ message: "Username already exists" });
		}
		const date = new Date(req.body.dateOfBirth);
		const newUser = new User({
			username: username,
			password: hash,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dateOfBirth: date,
			profilePicture: req.body.profilePicture,
		});

		const savedUser = await newUser.save();
		res.status(201).json("User created");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//LOGIN ROUTE
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//RESET PASSWORD ROUTE By Sending Mail to User
router.post("/reset-password", async (req, res) => {
	const { username } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const token = await crypto.randomBytes(20).toString("hex");
		user.resetPasswordToken = token;
		user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
		await user.save();
		const resetURL = `http://${process.env.CLIENT_URL}reset/${token}`;
		const email = {
			from: "affaqahmed165@outlook.com",
			to: user.email,
			subject: "Password Reset",
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
			Please click on the following link, or paste this into your browser to complete the process:\n\n
			${resetURL}\n\n
			If you did not request this, please ignore this email and your password will remain unchanged.\n`,
		};
		await transporter.sendMail(email, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log(info);
			}
		});
		res.status(200).json("Email has been sent");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//After Sent Mail to User, User can Reset Password
router.post("/reset-password/:token", async (req, res) => {
	const { password } = req.body;
	try {
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetTokenExpiration: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		user.password = hash;
		user.resetPasswordToken = undefined;
		user.resetTokenExpiration = undefined;
		await user.save();
		res.status(200).json("Password has been reset");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// const { username } = req.body;
// try {
// 	const user = await User.findOne({ username });
// 	if (!user) {
// 		return res.status(404).json({ message: "User not found" });
// 	}
// 	const token = user.generateResetPasswordToken();
// 	await user.save({ validateBeforeSave: false });
// 	const resetURL = `${req.protocol}://${req.get(
// 		"host"
// 	)}/api/users/reset-password/${token}`;
// 	const message = `Forgot your password? Submit a PATCH request with your new password and your new password to: \n\n ${resetURL}`;
// 	await sendEmail(user.email, message);
// 	res.status(200).json({ message: "Token sent to email" });
// } catch (error) {
// 	res.status(500).json({ error: error.message });
// }

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get("/login/failed", async (req, res) => {
	res.status(401).json({ success: false, message: "Login failed" });
});

router.get("/login/success", async (req, res) => {
	if (req.user)
		res.status(200).json({
			success: true,
			message: "Login success",
			user: req.user,
			cookies: req.cookies,
		});
});

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /auth/google/callback
router.get(
	"auth/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	}),
	(req, res) => {
		// Successful authentication, redirect secrets.
		res.redirect(process.env.CLIENT_URL + "/login/success");
	}
);

// GET /auth/logout
router.get("/logout", async (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
