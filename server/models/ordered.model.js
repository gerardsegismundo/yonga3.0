const mongoose = require('mongoose')

const OrderedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nonRegisteredUserDetails: {
      name: { type: String, required: true },
      companyName: { type: String },
      country: { type: String, required: true },
      houseNumAndStrtName: { type: String, required: true },
      apartment: { type: String, required: true },
      town: { type: String, required: true },
      postcode: { type: String, required: true },
      phone: { type: String, required: true },
      email: {
        type: String,
        required: true
      }
    },
    totalPrice: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    cartProducts: [
      {
        name: { type: String, required: true },
        imageURL: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Ordered', OrderedSchema)
