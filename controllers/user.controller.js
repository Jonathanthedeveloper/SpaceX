require('dotenv').config()
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
const transactionService = require('../services/transaction.service');
const { User } = require('../models/user.model');
const Email = require('../utils/mail.util');
const splitTransactions = require("../utils/splitTransactions.util");



class UserController {





    async renderDashboard(req, res) {
        const userInformation = req.userData;
        // console.log(userInformation);
        if (userInformation.role === 'admin') {
            req.flash("success", "welcome back")
            return res.redirect('/user/admin')
        }

        const { deposits, earnings, investments, withdrawals } = splitTransactions(userInformation.transactions)

        return res.render('dashboard', { user: userInformation, deposits, withdrawals, investments, earnings });
    }

    async renderProfile(req, res) {
        const userInformation = req.userData;
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
        const userInformation = req.userData;
        res.render('referral', { user: userInformation })
    }

    async renderTransaction(req, res) {
        const { transactions } = req.userData;

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

            await transactionService.create(transactionData)


            req.flash('status', 'Deposit placed successfully')
            res.redirect('/user/deposit')


        } catch (error) {
            req.flash('status', 'deposit failed')
            res.redirect('/user/deposit')
        }
    }
    async renderInvestment(req, res) {
        try {
            const userData = await User.findOne({ _id: req.user._id }).populate("transactions");

            const { investments } = splitTransactions(userData.transactions)

            const activeInvestments = investments.filter(investment => Date.now() < investment.expiresAt);

            res.render('invest', { investments: activeInvestments })
        } catch (error) {
            console.log(error)
            // res.redirect('/user/invest')
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
                case 'elite': payoutDuration = zenithDuration; break;
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

            req.flash('success', 'Your investment request has been submitted successfully');
            res.redirect('/user/invest')


        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/user/invest')
            console.error(error)
        }
    }



}

module.exports = new UserController()