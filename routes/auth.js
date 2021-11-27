const express = require('express')
const router = express.Router()
const User = require('../models/User')
const argon2 = require('argon2')

// REGISTER
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body

  if (!username) {
    return res.status(400).json({
      success: false,
      massage: 'Missing username !',
    })
  }
  if (!email) {
    return res.status(400).json({
      success: false,
      massage: 'Missing email !',
    })
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing password !',
    })
  }

  try {
    // check username exists
    const checkExistUser = await User.findOne({username})
    if (checkExistUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken !',
      })
    }

    // check email exists
    const checkExistEmail = await User.findOne({email})
    if (checkExistEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already taken !',
      })
    }

    // Generate new password
    const hashedPassword = await argon2.hash(password)

    // Create new user
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    })

    // Save user
    const user = await newUser.save()
    res.status(200).json({
      success: true,
      message: 'Account created successfully !',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error !',
      error: err.message,
    })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const {email, password} = req.body
  if (!email) {
    return res.status(400).json({
      success: false,
      massage: 'Missing email !',
    })
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing password !',
    })
  }
  try {
    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect email or password !',
      })
    }

    const validPassword = await argon2.verify(user.password, password)
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect email or password !',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully !',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error !',
      error: err.message,
    })
  }
})

module.exports = router
