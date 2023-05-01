require('dotenv').config()
const bcrypt = require('bcrypt');
const scheduler = require('node-schedule')
const saltRounds = 10;
const {
    starterDuration,
    platinumDuration,
    premiumDuration,
    zenithDuration,
    starterPercent,
    platinumPercent,
    premiumPercent,
    zenithPercent,
    referralEarning
} = require('../config')

const userService = require('../services/user.service');
const transactionService = require('../services/transaction.service');
const User = require('../models/user.model');
const Email = require('../utils/mail.util');
const splitTransactions = require("../utils/splitTransactions.util");
const getWallet = require('../utils/getWallet.util');


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

        try {
            const updateData = { ...req.body }
            delete updateData.password;


            const user = await userService.update({ _id: req.user._id }, updateData, {
                new: true, runValidators: true
            });


            if (req.body.password && req.body.password.length > 3) {
                user.password = req.body.password;
                await user.save()
            }

            req.flash("success", "Your Profile Was Updated Successfully")
            res.redirect('/user/profile')
        }
        catch (error) {
            req.flash("fail", "Failed To Update  Your Profile. Please Try Again")
            res.redirect('/user/profile')
        }

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
        res.render('create', { referral, role })
    }

    async handleWithdrawal(req, res) {
        try {

            if (req.body.amount > req.user.balance) {
                return res.redirect('/user/deposit')
            }
            const transactionData = {
                user: req.user._id, type: 'withdrawal', amount: req.body.amount, account: {
                    walletType: req.body.wallet, address: req.body.address
                }
            }

            const withdrawal = await transactionService.create(transactionData);
            const user = await userService.findOne({ _id: req.user._id })
            user.withdrawals.push(withdrawal._id)
            await user.save()


            req.flash('success', 'Your Withdrawal Request Was Placed Successfully.');
            res.redirect('/user/withdraw')
        } catch (error) {
            req.flash('fail', 'Something Went Wrong, Please Try Again Later.')
            res.redirect('/user/withdraw')
        }
    }

    async handleDeposit(req, res) {

        try {

            if (req.body.medium === "bank") {
                res.render('checkout', { amount: req.body.amount, medium: req.body.medium, wallet: "" });
            }
            else if (req.body.medium == "crypto") {
                res.render('checkout', { amount: req.body.amount, medium: req.body.medium, wallet: getWallet(req.body.coin) });
            }


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/deposit')
        }

    }

    async handleCheckout(req, res) {
        try {

            if (req.body.action === 'cancel') {
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


            req.flash('success', 'Your Deposit Was Placed Successfully')
            res.redirect('/user/deposit')


        } catch (error) {
            req.flash('fail', 'deposit failed')
            res.redirect('/user/deposit')
        }
    }

    async renderInvestment(req, res) {
        try {
            const userData = await User.findById(req.user._id).populate("transactions");

            const { investments } = splitTransactions(userData.transactions)

            const activeInvestments = investments.filter(investment => Date.now() < investment.expiresAt);

            res.render('invest', { investments: activeInvestments })
        } catch (error) {
            // res.redirect('/user/invest')
            console.log(error)
        }
    }

    async handleInvestment(req, res) {
        try {


            if (req.body.amount > req.userData.balance) {
                return res.redirect('/user/deposit')
            }

            let payoutDuration;

            switch (req.body.plan) {
                case 'starter':
                    payoutDuration = starterDuration;
                    break;
                case 'regular':
                    payoutDuration = regularDuration;
                    break;
                case 'pro':
                    payoutDuration = proDuration;
                    break;
                case 'elite':
                    payoutDuration = zenithDuration;
                    break;
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
                    user: transaction.user._id, type: 'earning', amount, status: 'successful', plan: transaction.plan
                }


                await transactionService.create(earningData)

            });

            const user = await User.findById(req.user._id);

            new Email(user, "", transactionData.amount).sendInvestment()

            req.flash('success', 'Your Investment Request Has Been Submitted Successfully');
            res.redirect('/user/invest')


        } catch (error) {
            req.flash('error', error.message)
            res.redirect('/user/invest')
        }
    }


}

module.exports = new UserController()