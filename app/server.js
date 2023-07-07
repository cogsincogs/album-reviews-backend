'use strict'

const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

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
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to database'))
}

app.use(express.json())

const usersRouter = require('./routes/users.js')
app.use('/user', usersRouter)

const Cat = mongoose.model('Cat', { name: String })

app.get('/', (req, res) => {
  const kitty = new Cat({ name: 'Louis' })
  kitty.save()

  res.send(kitty)
})

app.get('/cats', (req, res) => {
  Cat.find({ name: 'Louis' })
    .then(cats => {
      res.send(cats)
    })
    .catch(err => {
      res.send('Error: ' + err)
    })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
})
