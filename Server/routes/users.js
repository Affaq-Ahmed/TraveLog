const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//UPDATE User
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(req.body.password, salt);
				req.body.password = hash;
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		}
		try {
			const user = await User.findByIdAndUpdate(
				req.params.id,
				{ $set: req.body },
				{
					new: true,
				}
			);
			res.status(200).json("User updated");
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
});

//DELETE User
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("User deleted");
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
});

//GET User
router.get("/", async (req, res) => {
	const userId = req.query.userId;
	const username = req.query.username;
	try {
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username });
		const { password, updatedAt, ...userWithoutPassword } = user.toObject();
		res.status(200).json(userWithoutPassword);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET Friends
router.get("/friends/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const friends = await User.find({
			_id: { $in: user.following },
		});
		const friendList = [];
		friends.map((friend) => {
			const { _id, firstName, lastName, username, profilePicture } =
				friend.toObject();
			friendList.push({ _id, firstName, lastName, username, profilePicture });
		});
		res.status(200).json(friendList);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//FOLLOW User
router.put("/follow/:id", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); //user to follow
			const currentUser = await User.findById(req.body.userId); //current user
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({
					$push: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { following: req.params.id },
				});
				res.status(200).json("User followed");
			} else {
				res.status(400).json({ message: "User already followed" });
			}
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		return res.status(403).json({ message: "You can't follow yourself." });
	}
});

//UNFOLLOW User
router.put("/unfollow/:id", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); //user to unfollow
			const currentUser = await User.findById(req.body.userId); //current user
			if (user.followers.includes(req.body.userId)) {
				//if user is following
				await user.updateOne({
					$pull: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$pull: { following: req.params.id },
				});
				res.status(200).json("User unfollowed");
			} else {
				res.status(400).json({ message: "User not followed" });
			}
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		return res.status(403).json({ message: "You can't unfollow yourself." });
	}
});

//GET Followers
router.get("/followers/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const followers = await User.find({
			_id: { $in: user.followers },
		});
		const followerList = [];
		followers.map((follower) => {
			const { _id, firstName, lastName, username, profilePicture } =
				follower.toObject();
			followerList.push({ _id, firstName, lastName, username, profilePicture });
		});
		res.status(200).json(followerList);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//Search
router.get("/search", async (req, res) => {
	const search = req.query.search;
	try {
		const users = await User.find({
			$or: [
				{ firstName: { $regex: search, $options: "i" } },
				{ lastName: { $regex: search, $options: "i" } },
				{ username: { $regex: search, $options: "i" } },
			],
		});
		const userList = [];
		users.map((user) => {
			const { _id, firstName, lastName, username, profilePicture } =
				user.toObject();
			userList.push({ _id, firstName, lastName, username, profilePicture });
		});
		res.status(200).json(userList);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
