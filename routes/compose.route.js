const express = require('express');
const router = express.Router();
const { renderCompose, collectNewPost } = require('../controllers/news.controller');


router.route('/')
    .get(renderCompose)
    .post(collectNewPost)


module.exports = router;