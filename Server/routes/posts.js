const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE Post
router.post("/", async (req, res) => {
	const newPost = new Post({
		title: req.body.title,
		description: req.body.description,
		image: req.body.image,
		userId: req.body.userId,
	});
	try {
		const post = await newPost.save();
		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//UPDATE Post
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.updateOne(
				{ $set: req.body },
				{
					new: true,
				}
			);
			res.status(200).json("Post updated");
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//DELETE Post
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.remove();
			res.status(200).json("Post deleted");
		} else {
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET Post
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//LIKE Post
router.put("/like/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.likes.includes(req.body.userId)) {
			await post.updateOne(
				{ $pull: { likes: req.body.userId } },
				{
					new: true,
				}
			);
			res.status(200).json("Post unliked");
		} else {
			await post.updateOne(
				{ $push: { likes: req.body.userId } },
				{
					new: true,
				}
			);
			res.status(200).json("Post liked");
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET TIMELINE Posts
router.get("/timeline/:id", async (req, res) => {
	let timeLinePosts = [];
	try {
		const currentUser = await User.findById(req.params.id);

		const posts = await Post.find({ userId: currentUser._id });
		const postsOfFollowing = await Post.find({
			userId: { $in: currentUser.following },
		});

		timeLinePosts = [...posts, ...postsOfFollowing];
		res.status(200).json(timeLinePosts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET POSTS OF USER
router.get("/user/:id", async (req, res) => {
	try {
		const posts = await Post.find({ userId: req.params.id });
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//COMMENT ON POST
router.put("/comment/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const comment = {
			userId: req.body.userId,
			description: req.body.description,
		};
		await post.updateOne(
			{ $push: { comments: comment } },
			{
				new: true,
			}
		);
		res.status(200).json("Comment added");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
