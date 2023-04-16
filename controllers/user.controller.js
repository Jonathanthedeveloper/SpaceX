require('dotenv').config()
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const scheduler = require('node-schedule')
const saltRounds = 10;
const {
    starterDuration, platinumDuration, premiumDuration, zenithDuration,
    starterPercent,
    platinumPercent,
    premiumPercent,
    zenithPercent,
    referralEarning
} = require('../config')

const userService = require('../services/user.service');
const AdminService = require('../services/admin.service')
const { generateUserId } = require('../utils/utils')
const transactionService = require('../services/transaction.service');
const { User } = require('../models/user.model');
const Email = require('../utils/mail.util');
const Transaction = require('../models/transaction.model')
class UserController {

    // registering a user 
    async registerUser(req, res) {

        const userData = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            secret: {
                question: req.body.secretQuestion,
                answer: req.body.secretAnswer
            },
            role: req.body.role || 'user',
            withdrawals: [],
            deposits: [],
            investments: [],
            earnings: []
        }

        // checking if referral exists 
        const referral = await userService.findOne({ userId: req.body.referredBy })
        if (referral) {
            userData.referredBy = referral._id;
        }

        // checking if user already exists
        const userAlreadyExists = await userService.findOne({ email: userData.email });
        if (userAlreadyExists) {
            // throw an errow message saying user already exists
            req.flash('alert', JSON.stringify({ "message": "User already Exists, Please login in", "status": "info" }));
            res.redirect('/user/login')
            return;
        }


        // hashing users password
        const hash = await bcrypt.hash(userData.password, saltRounds);

        // saving it to thier user data object
        userData.password = hash;
        userData.userId = generateUserId()

        const user = await userService.create(userData)

        // adding user to his uplines array
        if (referral) {
            referral.referrals.push(user._id);
            await referral.save()
        }

        // const admin = await AdminService.findAll({})
        // admin.users.push(user._id);
        // await admin.save()


        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });


        new Email(user).sendWelcome()

        res
            .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            .header('Authorization', token)
            .redirect('/user/dashboard')

    }

    async loginUser(req, res) {

        const userCredentials = req.body;


        // check if user exists
        const foundUser = await userService.findOne({ email: userCredentials.email });
        if (!foundUser) {
            // throw an error with incorrect email or password
            req.flash('alert', JSON.stringify({ "message": "Invalid Username or Password", "status": "error" }));
            res.redirect('/user/login')
            console.error("user does not exist");
            return;
        }

        // comparing passwords
        const isCorrectPassword = await bcrypt.compare(userCredentials.password, foundUser.password);

        if (!isCorrectPassword) {
            // throw an error with incorrect email or password;
            req.flash('alert', JSON.stringify({ "message": "Invalid Username or Password", "status": "error" }));
            res.redirect('/user/login')
            console.error('incorrect email or password')
            return;
        }

        const token = jwt.sign({
            _id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role
        }, process.env.JWT_SECRET_KEY);


        res
            .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            .header('Authorization', token)
            .redirect('/user/dashboard')

    }

    async logoutUser(req, res) {
        res.clearCookie('token').redirect('/user/login')
    }

    async renderDashboard(req, res) {
        const userInformation = req.user
        // console.log(userInformation);
        if (userInformation.role === 'admin') {
            return res.redirect('/user/admin')
        }


        const deposits = userInformation.deposits.filter(deposit => deposit.status === "successful")

        const withdrawals = userInformation.withdrawals.filter(withdrawal => withdrawal.status === "successful")

        const investments = userInformation.investments.filter(investment => investment.status === "successful")

        const earnings = userInformation.earnings.filter(earning => earning.status === "successful")

        // console.log(deposits, withdrawals, investments, earnings);


        return res.render('dashboard', { user: userInformation, deposits, withdrawals, investments, earnings });
    }

    async renderProfile(req, res) {
        const userInformation = req.user;
        res.render('profile', { user: userInformation })
    }

    async editUserProfile(req, res) {


        const updateData = {
            name: req.body.name || req.user.name,
            email: req.body.email || req.user.email,
            username: req.body.username || req.user.username,
        }

        if (req.body.password) {
            try {
                const hash = await bcrypt.hash(req.body.password, saltRounds);
                updateData.password = hash

            } catch (error) {
                console.error(error)
            }
        }

        await userService.update({ _id: req.user.id }, updateData);

        res.redirect('/user/profile')

    }

    async renderReferral(req, res) {
        const userInformation = req.user;
        res.render('referral', { user: userInformation })
    }

    async renderTransaction(req, res) {
        const userInformation = req.user;

        // console.log(userInformation);


        const transactions = [...userInformation.withdrawals, ...userInformation.deposits, ...userInformation.earnings, ...userInformation.investments]

        transactions.sort((a, b) => b.createdAt - a.createdAt)


        res.render('history', { transactions })
    }

    async renderRegisterPage(req, res) {
        const { role, ref: referral } = req.query
        // if(!role) return console.log('user')
        res.render('create', { referral, role })
    }

    async handleWithdrawal(req, res) {
        try {
            
            if (req.body.amount > req.user.balance) {
                return res.redirect('/user/deposit')
            }
            const transactionData = {
                user: req.user._id,
                type: 'withdrawal',
                amount: req.body.amount,
                account: {
                    walletType: req.body.wallet,
                    address: req.body.address
                }
            }

            const withdrawal = await transactionService.create(transactionData);
            const user = await userService.findOne({ _id: req.user._id })
            user.withdrawals.push(withdrawal._id)
            await user.save()


            req.flash('status', 'success');
            res.redirect('/user/withdraw')
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/withdraw')
        }
    }

    async handleDeposit(req, res) {

        try {

            let wallet;

            switch (req.body.medium) {
                case "Bitcoin":
                    wallet = "1P4PiX2EsjeiX8PaBYLsfR3eAQ4MizRmyk";
                    break;
                case "Ethereum":
                    wallet = "0x9EA7750Be23D5C34Df3646c391A0388291339f9f";
                    break;
                case "usdt":
                    wallet = "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
                    break;
                case "dogecoin":
                    wallet = "DREBZME23eHTvKb7N5PdqxN9U3NvLMhSWW";
                    break;
                case "place":
                    wallet = "place";
                    break;
                case "place":
                    wallet = "place";
                    break;
                default:
                    wallet = "you did not select a deposit method";
                    break;
            }


            res.render('checkout', { amount: req.body.amount, medium: req.body.medium, wallet });


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/deposit')
        }

    }

    async handleCheckout(req, res) {
        try {

            if (req.body.action === 'cancel') {
                req.flash('status', 'fail')
                return res.redirect('/user/deposit')
            }

            const transactionData = {
                user: req.user._id,
                type: 'deposit',
                amount: req.body.amount,
                medium: req.body.medium,
                transactionID: req.body.transactionID
            }

            const deposit = await transactionService.create(transactionData)
            const user = await userService.findOne({ _id: req.user._id })
            user.deposits.push(deposit._id)
            await user.save()


            req.flash('status', 'success')
            res.redirect('/user/deposit')


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/deposit')
        }
    }
    async renderInvestment(req, res) {
        try {
            const investments = await User.findOne({ _id: req.user._id }).populate('investments').select('investments -_id')
            const activeInvestments = investments.investments.filter(investment => Date.now() < investment.expiresAt);

            res.render('invest', { investments: activeInvestments, status: req.flash('status').join() })
        } catch (error) {
            res.redirect('/user/invest')
        }
    }

    async handleInvestment(req, res) {
        try {


            if (req.body.amount > req.user.balance) {
                return res.redirect('/user/deposit')
            }

            let payoutDuration;

            switch (req.body.plan) {
                case 'starter': payoutDuration = starterDuration; break;
                case 'regular': payoutDuration = regularDuration; break;
                case 'pro': payoutDuration = proDuration; break;
                case 'elite': payoutDuration = eliteDuration; break;
            }

            const transactionData = {
                user: req.user._id,
                type: 'investment',
                amount: req.body.amount,
                status: "successful",
                plan: req.body.plan,
                active: true,
                expiresAt: Date.now() + payoutDuration,
               
            }

            const investment = await transactionService.create(transactionData);
            const user = await userService.findOne({ _id: req.user._id })
            user.investments.push(investment._id)
            await user.save()


            const payoutDate = new Date(investment.expiresAt)

            // Schedule user's  investment
            const job = scheduler.scheduleJob(payoutDate, async function () {


                const transaction = await transactionService.update({ _id: investment._id }, { active: false });

                let amount;


                switch (transaction.plan) {
                    case 'starter':
                        amount = (transaction.amount + ((starterPercent * transaction.amount) * 7)).toFixed(2);
                        break;
                    case 'platinum':
                        amount = (transaction.amount + ((platinumPercent * transaction.amount) * 7)).toFixed(2);
                        break;
                    case 'premium':
                        amount = (transaction.amount + ((premiumPercent * transaction.amount) * 7)).toFixed(2);
                        break;
                    case 'zenith':
                        amount = (transaction.amount + ((zenithPercent * transaction.amount) * 7)).toFixed(2);
                        break;
                    default:
                        amount = 0;
                        break;
                }


                const earningData = {
                    user: transaction.user._id,
                    type: 'earning',
                    amount,
                    status: 'successful',
                    plan: transaction.plan
                }


                const earning = await transactionService.create(earningData)

                const user = await userService.findOne({ _id: earning.user._id });
                user.earnings.push(earning._id)
                await user.save()
            });

            new Email(user, "", transactionData.amount).sendInvestment()

            req.flash('status', 'success');
            res.redirect('/user/invest')


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/invest')
            console.error(error)
        }
    }

    async handleForgotPassword(req, res) {
        const user = await userService.findOne({ email: req.body.email });
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
                $and: [{ passwordResetToken: req.body.resetToken }, { passwordResetExpires: { $gte: Date.now() } }]
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
            }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

            cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            req.flash('status', 'success')
            res
                .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
                .redirect('/user/dashboard')

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }

    async renderPasswordReset(req, res) {

        try {
            res.render('resetPassword', { resetToken: req.params.token })
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }


}

module.exports = new UserController()