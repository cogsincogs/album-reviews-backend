const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./models/user')
const mongoose = require('mongoose')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ googleId: profile.id }).then(currentUser => {
      if (currentUser) {
        // User exists
        cb(null, currentUser)
      } else {
        // User doesn't exist, so create user
        new User({
          googleId: profile.id,
          username: profile.displayName,
          thumbnail: profile._json.picture,
          accessToken: accessToken,
          refreshToken: refreshToken
        }).save().then(newUser => {
          cb(null, newUser)
        })
      }
    })
  }
));

passport.serializeUser(function(user, cb) {
    // Choose which info about user to enter into session
    cb(null, {
      id: user._id,
      username: user.username,
      thumbnail: user.thumbnail
    })
})

passport.deserializeUser(function(user, cb) {
    // Find user by ID
//    User.findById(id).then((err, user) => {
//      cb(err, user)
//    })
    cb(null, user)
})