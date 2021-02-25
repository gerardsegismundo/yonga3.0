const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
// const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

require('mongoose-type-url')
require('express-async-errors')

// Routes
const userRoute = require('../routes/user.routes')
const productRoute = require('../routes/product.routes')

// Initialization
module.exports = app => {
  app.use(mongoSanitize())
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: false
  //   })
  // )
  app.use(cors())
  app.use(xss())
  app.use(cookieParser())
  app.use(express.json({ extended: false }))
  app.use(
    fileUpload({
      useTempFiles: true
    })
  )

  app.use('/api/user', userRoute)
  app.use('/api/product', productRoute)
}
