/**
 *    AUTHENTICATION && USER DETAILS CONTROLLERS
 *    Base URL: /api/user
 *    1 - AUTHENTICATION
 *    2 - USER DETAILS
 */

const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

const sendEmail = require('../utils/sendEmail')
const createURL = require('../utils/createURL')
const hashPassword = require('../utils/hashPassword')
const cloudinary = require('cloudinary')
const fs = require('fs')

/*
 *  AUTHENTICATION
 *  1.0 - Register account
 *  1.1 - Activate account
 *  1.2 - Login
 *  1.3 - Get access token
 *  1.4 - Get current user
 *  1.5 - Logout
 *  1.6 - Forgot password
 *  1.7 - Validate reset token
 *  1.8 - Reset password
 */

//  1.0   POST  ->  /register
exports.register = async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(403).json({
      error: {
        key: 'email',
        value: 'Account already exists.'
      }
    })
  }

  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)

  const activationURL = createURL.activateAccount(nameCapitalized, email, await hashPassword(password))

  sendEmail.createAccount(nameCapitalized, email, activationURL)

  res.status(200).json({ msg: 'Account confirmation link sent to email.' })
}

//  1.1   POST  ->  /activate
exports.activate = async (req, res) => {
  const { activation_token } = req.body

  try {
    const user = jwt.verify(activation_token, process.env.JWT_SECRET_ACTIVATE)
    const userExists = await User.findOne({ email: user.email })
    if (userExists) return res.status(400).json({ msg: 'User already exists.' })

    const newUser = new User({ ...user })

    await newUser.save()

    res.status(201).json({ msg: 'Account has been created.' })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

//  1.2   POST  ->  /login
exports.login = async (req, res) => {
  const { email, password } = req.body

  console.log(req.body.email)
  const user = await User.findOne({ email: req.body.email })
  const user2 = await User.findOne({ email: email }).exec()

  console.log(user)
  console.log(user2)

  if (!user) {
    return res.status(400).json({
      error: { key: 'email', value: 'This email does not exist.' }
    })
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return res.status(401).json({
      error: {
        key: 'password',
        value: 'Your password is incorrect.'
      }
    })
  }

  const refresh_token = user.getRefreshToken()
  const access_token = user.getAccessToken()

  const expires = new Date(Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000)

  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: '/api/user/access_token',
    expires
  })

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.json({
    refresh_token,
    access_token,
    expiresIn: process.env.JWT_EXPIRE_REFRESH
  })
}

//  1.3   GET  ->  /access_token
exports.getAccessToken = async (req, res) => {
  const refresh_token = req.cookies.refreshtoken
  if (!refresh_token) return res.status(401).json({ msg: 'User unauthorized.' })

  jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH, async (err, claims) => {
    if (err) return res.status(401).json({ msg: err.response })

    try {
      const user = await User.findById(claims.client_id)
      const access_token = user.getAccessToken()
      res.json({ access_token })
    } catch (error) {
      res.status(400).json({ error })
    }
  })
}

//  1.4   GET  ->  /currentuser
//      PRIVATE
exports.getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')

  res.status(200).json({ user })
}

//  1.5   POST  ->  /logout
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    msg: 'User Logged out.'
  })
}

//  1.6   POST  ->  /forgotpassword
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  }).select('name email _id')

  if (!user) {
    return res.status(404).json({ error: 'There is no user with that email.' })
  }

  const resetToken = user.getResetToken()

  const { name, email, _id } = user
  const resetURL = createURL.resetPassword(_id, resetToken)
  sendEmail.resetPassword(name, email, resetURL)

  res.status(200).json({ msg: 'Reset link sent to email.' })
}

//  1.7    GET  ->  /validatereset_token
exports.validateResetToken = async (req, res) => {
  if (!req.query || !req.query.reset_token) {
    return res.stauts(401).json({ msg: 'Reset token required.' })
  }

  const { reset_token } = req.query

  try {
    const decoded = jwt.verify(reset_token, process.env.JWT_SECRET_RESET)

    return res.json({ client_id: decoded.id })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Session timed out.' })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' })
    } else {
      return res.status(400).json({ error })
    }
  }
}

//  1.8    POST  ->  /resetpassword
exports.resetPassword = async (req, res) => {
  const { clientId, password } = req.body

  await User.findByIdAndUpdate(clientId, {
    password: await hashPassword(password)
  })

  res.json({ msg: 'Password updated.' })
}

/*
 *  USER DETAILS
 *  2.0 - Update user
 *  2.1 - Upload avatar
 */

//  2.0   POST  ->  /update
//        PRIVATE
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    runValidators: true
  })

  res.json({ user })
}

//  2.1   POST  ->  /upload_avatar
//        PRIVATE
exports.uploadAvatar = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  })

  const file = req.files.file

  if (req.body.deleteId) {
    cloudinary.v2.uploader.destroy(req.body.deleteId, (error, result) => {
      if (error) return res.status(400).json({ error })
    })
  }

  const options = {
    folder: 'avatars',
    width: 150,
    height: 150,
    crop: 'fill'
  }

  cloudinary.v2.uploader.upload(file.tempFilePath, options, async (error, result) => {
    if (error) return res.status(400).json({ error })

    // Delete tmp file
    fs.unlink(file.tempFilePath, err => {
      if (err) throw err
    })

    const avatar = {
      url: result.secure_url,
      public_id: result.public_id
    }

    await User.findByIdAndUpdate(req.user._id, { avatar })

    res.json(avatar)
  })
}
