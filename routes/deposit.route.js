const express = require('express');
const { handleDeposit } = require('../controllers/user.controller');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');

router.get('/', function (req, res) {
    res.render('deposit', { status: req.flash('status').join() });
});

router.post('/', fetchUserData, handleDeposit)


module.exports = router;