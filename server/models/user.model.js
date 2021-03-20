const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    access_type: {
      type: String
    },
    password: {
      type: String,
      minlength: 6
    },
    avatar: {
      url: {
        type: String
      },
      public_id: {
        type: String
      }
    },
    companyName: {
      type: String
    },
    country: {
      type: String
    },
    houseNumAndStrtName: {
      type: String
    },
    apartment: {
      type: String
    },
    town: {
      type: String
    },
    postcode: {
      type: String
    },
    phone: {
      type: String
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ordered' }]
  },
  { timestamps: true }
)

// JWT  refresh_token
UserSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: process.env.JWT_EXPIRE_REFRESH
  })
}

// JWT  access_token
UserSchema.methods.getAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.JWT_EXPIRE_ACCESS
  })
}

// JWT  reset_token
UserSchema.methods.getResetToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_RESET, {
    expiresIn: process.env.JWT_EXPIRE_RESET
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
