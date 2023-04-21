const express = require('express');
const router = express.Router()

const { logoutUser } = require('../controllers/auth.controller');

router.post('/', logoutUser)

module.exports = router