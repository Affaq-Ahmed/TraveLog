const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");

const app = express();
// dotenv.config();
// console.log(process.env.GOOGLE_CLIENT_ID);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const storage = multer.diskStorage({
	destination: "./public/uploads",
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});
const upload = multer({ storage: storage });

app.use(
	cookieSession({
		name: "session",
		keys: [process.env.COOKIE_KEY],
		maxAge: 24 * 60 * 60 * 1000,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET, POST, PUT, DELETE",
		credentials: true,
	})
);

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => {
		console.log("connected to mongo");
	}
);

app.use(express.json());
app.use(morgan("common"));
app.use(helmet({ crossOriginResourcePolicy: false }));

app.post("/api/upload", upload.single("image"), (req, res) => {
	try {
		console.log(req.body);
		return res.status(201).json("File uploaded");
	} catch (error) {
		console.log(error);
	}
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

app.listen(8800, () => {
	console.log("Server is running on port 8800");
});
