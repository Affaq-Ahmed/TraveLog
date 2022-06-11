const passport = require("passport");
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.use(User.createStrategy());
// console.log(process.env.GOOGLE_CLIENT_ID);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			// assReqToCallback: true,
			// userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile);
			User.findOrCreate(
				{ googleId: profile.id, username: profile.id, avatar: profile.picture },
				function (err, user) {
					return cb(err, user);
				}
			);
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
