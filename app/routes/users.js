const express = require('express')
const router = express.Router()
const User = require('../models/user')

// get all
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// get one
router.get('/:id', getUser, (req, res) => {
  res.send(res.user)
})
// create one
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    id: req.body.id,
    accessToken: req.body.accessToken
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
// update one
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.id != null) {
        res.user.id = req.body.id
    }
    if (req.body.accessToken != null) {
        res.user.accessToken = req.body.accessToken
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
// delete one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await User.deleteOne({ _id: res.user._id })
        res.json({ message: 'Deleted user' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user'})
        }
    } catch (err) {
       return res.status(500).json({ message: err.message }) 
    }
    res.user = user;
    next()
}

module.exports = router
