const express = require('express');
const router = express.Router();
const {renderRegisterPage} = require('../controllers/user.controller');
const {registerUser} = require("../controllers/auth.controller");


router.route('/')
    .get(renderRegisterPage)
    .post(registerUser)


module.exports = router;