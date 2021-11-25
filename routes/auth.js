const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// REGISTER
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing username or/and password',
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
    res.status(200).json({
      success: true,
      message: 'Successful !',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      massage: 'Missing email or/and password',
    })
  }
  try {
    const user = await User.findOne({email})
    !user &&
      res.status(404).json({
        success: false,
        message: 'User not found !',
      })

    const validPassword = await bcrypt.compare(password, user.password)
    !validPassword &&
      res.status(400).json({
        success: false,
        message: 'Wrong password!',
      })

    res.status(200).json({
      success: true,
      message: 'Successful!',
      user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

module.exports = router
