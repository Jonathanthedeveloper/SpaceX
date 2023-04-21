const express = require("express");
const router = express.Router();
const CronJob = require('cron').CronJob
const axios = require('axios')

const userRoute = require('./user.route')
// const adminRoute = require('./admin.route')

//Importing routes
// const aDashboard = require('./adminDashboard.route')
const aboutRoute = require("./about.route");
const contactRoute = require("./contact.route");
const faqRoute = require("./faq.route");
const servicesRoute = require("./service.route");
const indexRoute = require("./index.route");
const helpRoute = require("./help.route");
const legalRoute = require("./legal.route");
const marketRoute = require("./market.route");


// configuring routes

// router.use("/adminDashboard", aDashboard);
// router.use("/admin", adminRoute);
router.use("/", indexRoute);
router.use("/aboutUs", aboutRoute);
router.use("/contact", contactRoute);
router.use("/faq", faqRoute);
router.use("/index", indexRoute);
router.use("/legal", legalRoute);
router.use("/market", marketRoute);
router.use("/services", servicesRoute);
router.use('/support', helpRoute)
router.use("/user", userRoute)


// exporting router middleware
module.exports = router;
