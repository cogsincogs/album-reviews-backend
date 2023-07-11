'use strict'

const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
require('dotenv').config()

require('./auth')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'
const URI = process.env.ATLAS_URI

// App
const app = express()

main().catch(err => console.log(err))
async function main () {
  await mongoose.connect(URI, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to database'))
}

function isLoggedIn (req, res, next) {
  req.user ? next() : res.sendStatus(401)
}

app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(passport.initialize())
app.use(passport.session())

const usersRouter = require('./routes/users.js')
app.use('/user', usersRouter)

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
    res.redirect('/protected')
  }
)

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.username}`)
})

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong')
})

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.session.destroy()
    res.send('Goodbye!')
  })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})
