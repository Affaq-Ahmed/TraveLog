const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//CREATE Post
router.post("/", async (req, res) => {
	const newPost = new Post({
		description: req.body.description,
		image: req.body.image,
		userId: req.body.userId,
	});
	try {
		const post = await newPost.save();
		// console.log(post);
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
router.delete("/:postId/:userId", async (req, res) => {
	// console.log(req.params);
	try {
		const post = await Post.findById(req.params.postId);
		if (post.userId === req.params.userId) {
			await post.remove();
			res.status(200).json("Post deleted");
		} else {
			// console.log(req.body.userId, " ", post.userId);
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
router.get("/timeline/:userId", async (req, res) => {
	const PAGE_SIZE = 10;
	const page = parseInt(req.query.page);
	const userId = req.params.userId;
	// console.log("user----", userId);
	let timeLinePosts = [];
	try {
		const currentUser = await User.findById(userId);
		// console.log("user ----- ", currentUser);
		const posts = await Post.find({ userId: currentUser._id });
		// console.log("posts ---- ", posts);
		const postsOfFollowing = await Post.find({
			userId: { $in: currentUser.following },
		});

		timeLinePosts = [...posts, ...postsOfFollowing];
		
		const total = timeLinePosts.length;
		const totalPages = Math.ceil(total / PAGE_SIZE);
		const postsToReturn = [];
		timeLinePosts
			.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
			.map((post) => {
				postsToReturn.push(post);
			});
		// console.log(postsToReturn);
		postsToReturn.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		// console.log("timeLinePosts ---- ", timeLinePosts);
		res
			.status(200)
			.json({ postsToReturn: postsToReturn, totalPages: totalPages });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//GET POSTS OF USER
router.get("/profile/:username", async (req, res) => {
	const PAGE_SIZE = 10;
	const page = parseInt(req.query.page);
	try {
		const user = await User.findOne({ username: req.params.username });
		total = await Post.countDocuments({ userId: user._id });
		const postsToReturn = await Post.find({ userId: user._id })
			.limit(PAGE_SIZE)
			.skip(PAGE_SIZE * page);
		const totalPages = Math.ceil(total / PAGE_SIZE);
		postsToReturn.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		res.status(200).json({ postsToReturn, totalPages });
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
		res.status(201).json("Comment added");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
