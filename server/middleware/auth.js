const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// Protect routes
exports.protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: { msg: 'Not authorized to access this route' } })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)

    req.user = await User.findById(decoded.client_id)

    next()
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
