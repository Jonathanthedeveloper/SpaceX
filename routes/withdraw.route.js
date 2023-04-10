const express = require('express');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');
const { handleWithdrawal } = require('../controllers/user.controller')


router.route('/')
    .get(fetchUserData, function (req, res) {
        res.render('withdraw', { user: req.user, status: req.flash('status').join() });
    })
    .post(handleWithdrawal)


module.exports = router;