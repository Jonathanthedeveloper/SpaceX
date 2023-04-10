const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate.middleware');
const { renderAdminDashboard, renderReferrals } = require('../controllers/admin.controller')

//Importing Routes
// const adminDashboard = require("./adminDashboard.route");

// configuring routes
// router.use("/adminDashboard", authenticate, adminDashboard);

const adminDepositRoute = require('./adminDeposit.route')
const adminWithdrawRoute = require('./adminWithdraw.route')
const adminRefferralRoute = require('./adminRefer.route')
const adminUserRoute = require('./adminUser.route')
const adminProfileRoute = require('./adminPersonalProfile.route')
const adminBonusRoute = require('./addBonus.route')
const adminInvestmentsRoute = require('./adminInvestments.route')
const adminKYCRoute = require('./adminKYC.route')
const adminLoanRoute = require('./adminLoan.route')
const adminPenaltyRoute = require('./adminPenalty.route')

router.use('/deposit', adminDepositRoute)
router.use('/withdraw', adminWithdrawRoute)
router.use('/referral', adminRefferralRoute)
router.use('/user', adminUserRoute)
router.use('/profile', adminProfileRoute)
router.use('/bonus', adminBonusRoute)
router.use('/investments', adminInvestmentsRoute)
router.use('/kyc', adminKYCRoute)
router.use('/loan', adminLoanRoute)
router.use('/penalty', adminPenaltyRoute)

router.get('/', renderAdminDashboard)

module.exports = router