const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// REGISTER
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body

  try {
    // Generate new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    })

    // Save user
    const user = await newUser.save()
    res.status(200).json({message: 'Successful !', user})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findOne({email})
    !user && res.status(404).json({message: 'User not found !'})

    const validPassword = await bcrypt.compare(password, user.password)
    !validPassword && res.status(400).json({message: 'Wrong password!'})

    res.status(200).json({message: 'Successful!', user})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

module.exports = router
