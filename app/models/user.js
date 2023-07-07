const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  accessToken: {
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
