const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// UPDATE USER
router.put('/:id', async (req, res) => {
  const {userId, isAdmin, password} = req.body
  if (userId === req.params.id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(password, salt)
      } catch (err) {
        res.status(500).json({message: err.message})
      }
    }
    try {
      const user = await User.findByIdAndUpdate(userId, {$set: req.body})
      res.status(200).json({message: 'Account has been updated !'})
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  } else {
    res.status(403).json('You can update only your account !')
  }
})

// DELETE USER
router.delete('/:id', async (req, res) => {
  const {userId, isAdmin} = req.body
  if (userId === req.params.id || isAdmin) {
    try {
      const user = await User.findByIdAndDelete(userId)
      res.status(200).json({message: 'Account has been deleted !'})
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  } else {
    res.status(403).json('You can delete only your account !')
  }
})

// GET A USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json({message: 'Successful !', user: other})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
  const {userId} = req.body
  const {id} = req.params
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (!user.followers.includes(userId)) {
        await user.updateOne({$push: {followers: userId}})
        await currentUser.updateOne({$push: {followings: id}})
        res.status(200).json({message: 'User has been followed !'})
      } else {
        res.status(403).json({message: 'You allready follow this user !'})
      }
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  } else {
    res.status(403).json({message: 'You can not follow yourself !'})
  }
})

// UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
  const {userId} = req.body
  const {id} = req.params
  if (userId !== id) {
    try {
      const user = await User.findById(id)
      const currentUser = await User.findById(userId)
      if (user.followers.includes(userId)) {
        await user.updateOne({$pull: {followers: userId}})
        await currentUser.updateOne({$pull: {followings: id}})
        res.status(200).json({message: 'User has been unfollowed !'})
      } else {
        res.status(403).json({message: 'You are not following this user !'})
      }
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  } else {
    res.status(403).json({message: 'You can not unfollow yourself !'})
  }
})

module.exports = router
