const userService = require("../services/user.service");
const crypto = require("crypto");
const Email = require("../utils/mail.util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



class AuthController {

    async handleForgotPassword(req, res) {
        const user = await userService.findOne({email: req.body.email});
        if (!user) {
            req.flash('status', 'fail')
            return res.redirect('/user/forgot-password')
        }

        try {
            const token = crypto.randomBytes(20).toString('hex');
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 1000 * 60 * 10;
            await user?.save();


            const link = `${req.protocol}://${req.get('host')}/user/reset-password/${token}`;
            new Email(user, link).sendForgotPassword()

        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save()
            req.flash('status', 'fail')
            res.redirect('/user/forgot-password')
            return
        }
        req.flash('status', 'success')
        res.redirect('/user/forgot-password')
    }


    async handlePasswordReset(req, res) {
        try {

            const user = userService.findOne({
                $and: [{passwordResetToken: req.body.resetToken}, {passwordResetExpires: {$gte: Date.now()}}]
            })

            if (!user) {
                req.flash('status', 'fail')
                return res.redirect('/user/forgot-password')
            }

            const hash = await bcrypt.hash(req.body.password, saltRounds)

            user.password = hash;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

            cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60})
            req.flash('status', 'success')
            res
                .cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60})
                .redirect('/user/dashboard')

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }

    async renderPasswordReset(req, res) {

        try {
            res.render('resetPassword', {resetToken: req.params.token})
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }
}

module.exports = new AuthController()