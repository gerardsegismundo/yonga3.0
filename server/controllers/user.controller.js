//  USER CONTROLLERS
//  Base URL: /api/user

const cloudinary = require('cloudinary')
const fs = require('fs')

const User = require('../models/user.model')

//  @route    POST  user/update
//  @access   PRIVATE
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
    runValidators: true
  })

  res.json({ user })
}

//  @route    POST  user/upload_avatar
//  @access   PRIVATE
exports.uploadAvatar = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  })

  const file = req.files.file

  if (req.body.deleteId) {
    cloudinary.v2.uploader.destroy(req.body.deleteId, error => {
      if (error) return res.status(400).json({ error })
    })
  }

  const uploadOptions = {
    folder: 'avatars',
    width: 150,
    height: 150,
    crop: 'fill'
  }

  cloudinary.v2.uploader.upload(file.tempFilePath, uploadOptions, async (error, result) => {
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
