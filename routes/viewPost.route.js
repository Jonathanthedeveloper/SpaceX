const express = require('express');
const router = express.Router();
const { renderIndividualNews } = require('../controllers/news.controller');

router.get('/:requestedPostId', renderIndividualNews);


module.exports = router;