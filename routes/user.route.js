const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate.middleware")
const authorize = require('../middlewares/authorize.middleware')


//Importing routes
const transactionRoute = require('./transaction.route');
const dashboardRoute = require("./dashboard.route");
const loginRoute = require("./login.route");
const forgotPasswordRoute = require("./forgot-password.route");
const registerRoute = require("./register.route");
const notFoundRoute = require("./notfound.route");
const depositRoute = require("./deposit.route")
const checkoutRoute = require("./checkout.route")
const investRoute = require("./invest.route");
const loanRoute = require("./loan.route");
const kycRoute = require("./kyc.route");
const withdrawRoute = require("./withdraw.route")
const profileRoute = require("./profile.route");
const referralRoute = require("./referral.route");
const logoutRoute = require('./logout.route');
const adminRoute = require('./admin.route');
const resetPasswordRoute = require('./reset-password.route');
const depositFrontendRoute = require('./depositFrontEnd.route');
const bankDepositRoute = require('./bankDeposit.route');
const bankCheckoutRoute = require('./bankCheckout.route');





// configuring routes
router.use("/login", loginRoute);
router.use("/logout", logoutRoute);
router.use("/forgot-password", forgotPasswordRoute);
router.use("/reset-password", resetPasswordRoute);
router.use("/create", registerRoute);
router.use("/notfound", notFoundRoute);


router.use(authenticate)

router.use("/transactions", transactionRoute)
router.use("/dashboard", dashboardRoute);
router.use("/checkout",  checkoutRoute);
router.use("/invest",  investRoute);
router.use("/loan",  loanRoute);
router.use("/kyc",  kycRoute);
router.use("/deposit",  depositRoute);
router.use("/withdraw",  withdrawRoute);
router.use("/profile",  profileRoute);
router.use("/referral",  referralRoute);
router.use("/choose-deposit",  depositFrontendRoute);
router.use("/bank",  bankDepositRoute);
router.use("/bankCheckout",  bankCheckoutRoute)

// ADMIN
router.use('/admin', authorize('admin'), adminRoute)



// exporting router middleware
module.exports = router;