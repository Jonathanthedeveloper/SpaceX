
const User = require("../models/user.model");
const userService = require("../services/user.service");
const calcUserBalance = require("../utils/calcUserBalance");
const splitTransactions = require("../utils/splitTransactions.util");

const fetchUserData = async (req, res, next) => {

    const user = req.user

    if (!user) {
        req.flash("error", "Something Went Very wrong please login again");
        res.redirect('/user/login');
        return;
    }

    // console.log(user);


    const userInformation = await User.findById(user._id).populate('transactions');

    if (!userInformation) {
        req.flash("error", "Something Went Very wrong please login again");
        res.redirect('/user/login');
        return;
    }

    // claculating user balance
    userInformation.balance = calcUserBalance(userInformation.transactions);


    req.userData = userInformation
    next()
}


module.exports = fetchUserData