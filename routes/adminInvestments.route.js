const express = require('express');
const { renderAdminInvestments } = require('../controllers/admin.controller');
const router = express.Router();

router.route("/")
    .get(renderAdminInvestments)


module.exports = router;