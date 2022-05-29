const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const app = express();

dotenv.config();

app.use(
	cookieSession({
		name: "session",
		keys: [process.env.COOKIE_KEY],
		maxAge: 24 * 60 * 60 * 1000,
	})
);

app.use(passport.initialize());
app.use(passport.session());

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
app.use(helmet());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET, POST, PUT, DELETE",
		credentials: true,
	})
);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(8800, () => {
	console.log("Server is running on port 8800");
});
