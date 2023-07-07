const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
//    User.findOrCreate({ googleId: profile.id }, function (err, user) {
//      return cb(err, user);
//    });
  }
));

passport.serializeUser(function(user, cb) {
    // Choose which info about user to enter into session
    cb(null, user)
})

passport.deserializeUser(function(user, cb) {
    // Find user by ID
    cb(null, user)
})