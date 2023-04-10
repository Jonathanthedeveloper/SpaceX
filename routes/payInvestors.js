const express = require('express')
const router = express.Router()
const { handlePayouts } = require('../controllers/admin.controller');


router.patch('/', handlePayouts)

module.exports = router