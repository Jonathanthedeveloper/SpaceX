const express = require('express');
const {handleForgotPassword} = require('../controllers/auth.controller');
const router = express.Router();


router.route('/')
    .get(function (req, res) {
        res.render('forgotPassword')
    })
    .post(handleForgotPassword)


module.exports = router;