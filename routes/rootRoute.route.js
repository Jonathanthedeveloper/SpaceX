const express = require("express");
const router = express.Router();

const userRoute = require('./user.route')
// const adminRoute = require('./admin.route')

//Importing routes
// const aDashboard = require('./adminDashboard.route')
const aboutRoute = require("./about.route");
const contactRoute = require("./contact.route");
const faqRoute = require("./faq.route");
const indexRoute = require("./index.route");
const helpRoute = require("./help.route");
const newsRoute = require("./news.route");
const composeRoute = require("./compose.route");
const marketRoute = require("./market.route");
const viewPost = require("./viewPost.route")


// configuring routes

// router.use("/adminDashboard", aDashboard);
// router.use("/admin", adminRoute);
router.use("/", indexRoute);
router.use("/aboutUs", aboutRoute);
router.use("/contact", contactRoute);
router.use("/faq", faqRoute);
router.use("/index", indexRoute);
router.use("/market", marketRoute);
router.use('/support', helpRoute);
router.use("/news", newsRoute);
router.use("/compose", composeRoute);
router.use("/user", userRoute);
router.use("/post", viewPost);


// exporting router middleware
module.exports = router;
