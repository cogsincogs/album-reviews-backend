'use strict'

const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const User = require('./models/user')
require('dotenv').config()

require('./auth')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'
const URI = process.env.ATLAS_URI

// App
const app = express()

// CORS options
const options = {
  allowedHeaders: [
    'X-ACCESS_TOKEN',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Origin',
    'x-requested-with',
    'Content-Type',
    'Content-Range',
    'Content-Disposition',
    'Content-Description',
],
credentials: true,
methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
origin: [
    'http://localhost:3000',
],
preflightContinue: false,
}

main().catch(err => console.log(err))
async function main () {
  await mongoose.connect(URI, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to database'))
}

app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors(options))

const usersRouter = require('./routes/users.js')
const postsRouter = require('./routes/posts')
app.use('/user', usersRouter)
app.use('/posts', postsRouter)

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>')
})

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    accessType: 'offline' // This property is required for Google to provide a refresh token
  })
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  function(req, res) {
    // Success
    incrementLoginCount(req.user.id, req.user.loginCount)
    getLastLogin(req.user.id).then(res => console.log("Last login: " + res))
    updateCurrentLoginDate(req.user.id)
    res.redirect('http://localhost:3000/home')
  }
)

async function incrementLoginCount(userId, count) {
  await User.updateOne({ _id: userId }, { loginCount: count + 1 })
}

async function getLastLogin(userId) {
  const user = await User.findById(userId)
  const lastLogin = user.lastLogin
  if (lastLogin === undefined) return false
  return lastLogin
}

async function updateLastLogin(userId) {
  const user = await User.findById(userId)
  const date = user.currentLoginDate
  await User.updateOne({ _id: userId }, { lastLogin: date })
}

async function updateCurrentLoginDate(userId) {
  const date = Date.now()
  await User.updateOne({ _id: userId }, { currentLoginDate: date })
}

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong')
})

app.get('/user_data', (req, res) => {
  if (req.user === undefined) {
    // Not logged in
    res.json("")
  } else {
    // Logged in
    res.json({
      user: req.user
    })
  }
})

app.get('/logout', (req, res) => {

  // Don't try to update user if user is not logged in
  if(req.user != undefined) {
    updateLastLogin(req.user.id)
  }

  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.session.destroy()
    res.redirect('http://localhost:3000')
  })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})
