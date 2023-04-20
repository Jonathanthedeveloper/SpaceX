const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/user.controller')

router.route('/')
    .get(function (req, res) {

        res.render('login')

    })
    .post(loginUser)


module.exports = router;