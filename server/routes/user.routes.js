const router = require('express').Router()

const {
  register,
  activate,
  login,
  getAccessToken,
  logout,
  getCurrentUser,
  forgotPassword,
  validateResetToken,
  resetPassword,
  updateUser,
  uploadAvatar
} = require('../controllers/user.controller')

const { protect } = require('../middleware/auth')
const validateImage = require('../middleware/validateImage')

// Authentication
router.post('/register', register)
router.post('/activate', activate)
router.post('/login', login)
router.post('/currentuser', protect, getCurrentUser)
router.get('/access_token', getAccessToken)
router.post('/forgotpassword', forgotPassword)
router.get('/validatereset_token', validateResetToken)
router.post('/resetpassword', resetPassword)
router.get('/logout', logout)

// User details
router.post('/update', protect, updateUser)
router.post('/upload_avatar', protect, validateImage, uploadAvatar)

module.exports = router
