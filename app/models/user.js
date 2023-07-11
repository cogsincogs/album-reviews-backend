const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
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
