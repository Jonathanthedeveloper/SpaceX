const express = require('express');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');
const { handleWithdrawal } = require('../controllers/user.controller')


router.route('/')
    .get(fetchUserData, function (req, res) {
        res.render('withdraw', { user: req.userData});
    })
    .post(fetchUserData,handleWithdrawal)


module.exports = router;