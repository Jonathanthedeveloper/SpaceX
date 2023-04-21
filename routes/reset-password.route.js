const express = require('express');
const router = express.Router();

const { renderPasswordReset, handlePasswordReset } = require('../controllers/auth.controller');

router.get('/:userId/:token', renderPasswordReset)
router.post('/', handlePasswordReset)

module.exports = router;