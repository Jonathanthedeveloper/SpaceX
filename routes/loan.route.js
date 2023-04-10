const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('loan');
});


module.exports = router;