const router = require('express').Router()

const { optionalAuthentication } = require('../middleware/auth')
const { saveOrder } = require('../controllers/order.controller')

router.post('/', optionalAuthentication, saveOrder)
