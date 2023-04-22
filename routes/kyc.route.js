const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer.middleware")

const {handleKycSubmit} = require("../controllers/kyc.controller")


router.route('/')
    .get(function (req, res) {
        res.render("kyc");
    })
    .put( upload.array("photo", 2), handleKycSubmit)


module.exports = router;