const express = require('express');
const router = express.Router();
const { showNews } = require('../controllers/news.controller');


router.route('/')
    .get(showNews)



module.exports = router;