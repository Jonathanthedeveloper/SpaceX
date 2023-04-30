const express = require('express');
const router = express.Router();
const { renderAdminKyc, handleKycApproval } = require('../controllers/kyc.controller');


router.route('/')
    .get(renderAdminKyc)
    .put(handleKycApproval)


module.exports = router;