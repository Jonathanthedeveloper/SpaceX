const express = require('express');
const { handlePenalty } = require('../controllers/admin.controller');
const router = express.Router();

router.route("/")
    .get(function (req, res) {
        res.render('adminPenalty');
    })
    .post(handlePenalty)



module.exports = router;