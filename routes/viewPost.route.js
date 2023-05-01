const express = require('express');
const router = express.Router();
const { renderIndividualNews } = require('../controllers/news.controller');

router.get('/:postId', renderIndividualNews);


module.exports = router;