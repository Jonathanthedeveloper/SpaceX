const userService = require("../services/user.service");
const Email = require("../utils/mail.util");
const jwt = require("jsonwebtoken");


class AuthController {


    /**
     * Registers a new User to the database
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async registerUser(req, res) {


        // creating a user object
        const userData = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role || 'user'
        }


        // checking if referral exists
        let referral;
        if (req.body.referredBy !== "") {
            referral = await userService.findOne({userId: req.body.referredBy})
            if (referral) {
                userData.referredBy = referral._id;
            }
        }


        // checking if user already exists
        const userAlreadyExists = await userService.findOne({email: userData.email});
        if (userAlreadyExists) {
            // throw an error message saying user already exists
            req.flash('error', "user already exists");
            res.redirect('/user/login')
            return;
        }


        const user = await userService.create(userData);

        // adding user to his uplines array
        if (referral) {
            referral.referrals.push(user._id);
            await referral.save()
        }


        const token = jwt.sign({
            _id: user._id, email: user.email, role: user.role
        }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});


        new Email(user).sendWelcome()


        // redirect to dashboard
        req.flash('success', "your account has been successfully created");
        res
            .cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60})
            .redirect('/user/dashboard')

    }

    /**
     * Logins in a user when then provide their username and password
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async loginUser(req, res) {

        // check if user exists and also compare passwords
        const foundUser = await userService.findOne({email: req.body.email});
        if (!foundUser || !(await foundUser.isPasswordCorrect(req.body.password, foundUser.password))) {
            // throw an error with incorrect email or password
            req.flash("error", "Invalid username or password");

            return res.redirect('/user/login')

        }


        // generate and sign token
        const token = jwt.sign({
            _id: foundUser._id, email: foundUser.email, role: foundUser.role
        }, process.env.JWT_SECRET_KEY);


        res
            .cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60})
            .redirect('/user/dashboard')

    }


    /**
     * Logout out the currently authenticated user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async logoutUser(req, res) {
        res.clearCookie('token').redirect('/user/login')
    }


    async handleForgotPassword(req, res) {
        const user = await userService.findOne({email: req.body.email});
        if (!user) {
            req.flash('fail', 'user with that email does not exist')
            return res.redirect('/user/forgot-password')
        }

        try {
            const token = await user.genPasswordResetToken();


            const link = `${req.protocol}://${req.get('host')}/user/reset-password/${user._id}/${token}`;
            new Email(user, link).sendForgotPassword()

        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save()
            req.flash('fail', 'password reset failed. Please try again')
            return res.redirect('/user/forgot-password')

        }
        req.flash('success', 'Please check email for password reset link')
        res.redirect('/user/forgot-password')
    }


    async handlePasswordReset(req, res) {
        try {

            const user = await userService.findOne({
                $and: [{_id: req.body.user}, {passwordResetExpires: {$gte: Date.now()}}]
            })

            if (!user || !(await user.isPasswordCorrect(req.body.resetToken, user.passwordResetToken))) {
                req.flash('fail', 'user not found')
                return res.redirect('/user/forgot-password')
            }

            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            const token = jwt.sign({
                _id: user._id, email: user.email, role: user.role
            }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});


            req.flash('success', 'password reset successful')
            res
                .cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60})
                .redirect('/user/dashboard')

        } catch (error) {
            console.log(error)
            req.flash('fail', 'password reset failed. Please try again')
            res.redirect('/user/dashboard')
        }
    }

    async renderPasswordReset(req, res) {

        try {
            res.render('resetPassword', {resetToken: req.params.token, user : req.params.userId})
        } catch (error) {
            req.flash('fail', 'something went wrong. please try again')
            res.redirect('/user/dashboard')
        }
    }
}

module.exports = new AuthController()