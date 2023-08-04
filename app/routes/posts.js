const express = require('express')
const router = express.Router()
const User = require('../models/user')

// get all posts for user
router.get('/:userId', getUser, (req, res) => {

    // If no post index specified, return entire array
    if (!req.body.postIndex) return res.json(res.user.postsArray)

    // If post index specified, return only the one post
    res.json(res.user.postsArray[req.body.postIndex])
})

// push new post to user's posts array
router.post('/:userId', getUser, async (req, res) => {

  const newPost = {
    date: Date.now(),
    content: req.body.content
  }

  res.user.postsArray.push(newPost)

  try {
    res.user.save()
    res.status(201).json({ message: "Successfully posted",
                           userId: res.user._id,
                           post: newPost })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// edit post
router.patch('/:userId', getUser, async (req, res) => {
    
    if (!req.body.postIndex) return res.status(500).json({ message: "Invalid post index" })

    let postsArray = res.user.postsArray
    const updatedPost = {
        date: postsArray[req.body.postIndex].date,
        content: req.body.content
    }
    postsArray[req.body.postIndex] = updatedPost

    res.user.postsArray = postsArray

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
// delete post
router.delete('/:userId', getUser, async (req, res) => {

    if (!req.body.postIndex) return res.status(500).json({ message: "Invalid post index" })

    res.user.postsArray.splice(req.body.postIndex, 1)

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.userId)
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
