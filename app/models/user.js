const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  postsArray: {
    type: Array,
    required: true
  },
  loginCount: {
    type: Number,
    required: true
  },
  currentLoginDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lastLogin: {
    type: Date,
    required: false
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  signupDate: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model('User', userSchema)
