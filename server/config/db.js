const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline.bold)

  // console.log('Connected to mongodb')
}

module.exports = connectDB
