const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passportLocalMongoose = require("passport-local-mongoose");

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

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// GET /auth/google/callback
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login/failed" }),
	(req, res) => {
		// Successful authentication, redirect secrets.
		res.redirect(process.env.CLIENT_URL + "/login/success");
	}
);

// GET /auth/logout
router.get("/logout", async (req, res) => {
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
