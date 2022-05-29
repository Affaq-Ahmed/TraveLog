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
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...userWithoutPassword } = user.toObject();  
		res.status(200).json(userWithoutPassword);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//FOLLOW User
router.put("/follow/:id", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);  //user to follow
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
      const user = await User.findById(req.params.id);  //user to unfollow
      const currentUser = await User.findById(req.body.userId); //current user
      if (user.followers.includes(req.body.userId)) { //if user is following
        await user.updateOne({ 
          $pull: { followers: req.body.userId }
        });
        await currentUser.updateOne({
          $pull: { following: req.params.id }
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

module.exports = router;
