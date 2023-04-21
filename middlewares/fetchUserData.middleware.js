
const userService = require("../services/user.service")

const fetchUserData = async (req, res, next) => {

    const user = req.user

    if (!user) {
        req.flash("error", "Something Went Very wrong please login again");
        res.redirect('/user/login');
        return;
    }

    // console.log(user);


    const userInformation = await userService.findOne({ _id: user._id });

    if (!userInformation) {
        req.flash("error", "Something Went Very wrong please login again");
        res.redirect('/user/login');
        return;
    }

    req.userData = userInformation
    next()
}


module.exports = fetchUserData