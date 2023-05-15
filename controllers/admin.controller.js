const userService = require("../services/user.service");
const transactionService = require("../services/transaction.service");
const User = require("../models/user.model");
const {referralEarningPercent} = require("../config");
const Email = require("../utils/mail.util");
const CronJob = require("cron").CronJob;
const payInvestors = require("../utils/payInvestors");
const splitTransactions = require("../utils/splitTransactions.util");
const calcUserBalance = require("../utils/calcUserBalance");
const Transaction = require("../models/transaction.model");

class AdminController {
    constructor() {
        const job = new CronJob(
            "0 0 * * *",
            async function () {
                await payInvestors();
            },
            null,
            true,
            "America/Los_Angeles"
        );
    }

    async renderAdminDashboard(req, res) {
        // fetching user data
        const transactions = await transactionService.findAll({});
        const users = await userService.findAll({});

        const recents = transactions.slice(0, 5)

        const {deposits, withdrawals, investments, earnings} = splitTransactions(transactions)


        res.render("adminDashboard", {
            users,
            deposits,
            withdrawals,
            investments,
            earnings,
            transactions,
            recents
        });
    }

    async renderAdminDeposit(req, res) {
        const transactions = await transactionService.findAll({});
        const deposits = transactions.filter((transaction) => {
            return transaction.type === "deposit";
        });

        deposits.sort((a, b) => b.createdAt - a.createdAt);

        res.render("adminDeposit", {deposits});
    }

    async renderAdminWithdrawal(req, res) {
        const transactions = await transactionService.findAll({});
        const withdrawals = transactions.filter((transaction) => {
            return transaction.type === "withdrawal";
        });

        withdrawals.sort((a, b) => b.createdAt - a.createdAt);
        res.render("adminWithdraw", {withdrawals});
    }

    async handleApproval(req, res) {
        try {
            const {id, approve} = req.body;
            const status = approve === "confirm" ? "successful" : "failed";
            const transaction = await transactionService.update(
                {_id: id},
                {status}
            );

            if (transaction.type === "deposit") {

                if (transaction.user.referredBy && !transaction.user.hasDeposited) {
                    const referralEarnings = {
                        from: transaction.user._id,
                        user: transaction.user.referredBy,
                        type: "referral earnings",
                        status: "successful",
                        amount: referralEarningPercent * transaction.amount,
                    };

                    await transactionService.create(referralEarnings);


                }
                new Email(transaction.user, ".", transaction.amount).sendDeposit();

                req.flash("success", "Transaction Approved")
                res.redirect("/user/admin/deposit");
            } else if (transaction.type === "withdrawal") {
                new Email(transaction.user, ".", transaction.amount).sendWithdrawal();
                req.flash("success", "Transaction Approved")
                res.redirect("/user/admin/withdraw");
            }
        } catch (error) {
            req.flash("error", error.message)
            res.redirect(req.originalUrl);
        }
    }

    async renderReferrals(req, res) {
        const users = await User.find({}).populate("referredBy");

        const referredUsers = users.filter((user) => user.referredBy);

        // res.send(referredUsers)

        res.render("adminRefer", {referredUsers});
    }

    async renderAdminUsers(req, res) {
        const users = await User.find({}).populate("referredBy transactions")

        users.forEach(user => {
            user.balance = calcUserBalance(user.transactions)
        })

        res.render("adminUser", {users});
    }

    async renderAdminUsersProfile(req, res) {
        const user = await userService.findOne({_id: req.params.user});


        user.balance = calcUserBalance(user.transactions)


        res.render("adminPersonalProfile", {user});
    }


    async handleBonus(req, res) {
        try {
            const user = await userService.findOne({email: req.body.email});

            if (!user) {
                req.flash("status", "fail");
                res.redirect("/user/admin/bonus");
                return;
            }

            const transactionData = {
                user: user._id,
                type: req.body.action,
                amount: req.body.amount,
                status: "successful",
            };

            const transaction = await transactionService.create(transactionData);

            if (transaction.type === "deposit") {
                new Email(user, "", req.body.amount).sendDeposit();
            } else {
                new Email(user, "", req.body.amount).sendBonus();
            }

            await user.save();

            req.flash("success", `${transaction.type} Added Successfully`);
            res.redirect("/user/admin/bonus");
        } catch (error) {
            req.flash("error", `Failed To Add Bonus ${user.name ? `To ${user.name}'s Account` : ""}`);
            res.redirect("/user/admin/bonus");
        }
    }

    async handlePenalty(req, res) {
        try {

            // email amount

            const user = await User.findOne({email: req.body.email});

            if (!user) {
                throw new Error("user not found");
            }

            const transactionData = {
                user: user._id,
                type: "penalty",
                amount: req.body.amount,
                status: "successful",
            }

            const transaction = await transactionService.create(transactionData);
            new Email(user, "", req.body.amount).sendPenalty();
            req.flash("success", "penalty added successfully");
            res.redirect("/user/admin/penalty");

        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/user/admin/penalty");
        }
    }

    async renderAdminInvestments(req, res) {

        const investments = await Transaction.find({type: "investment"}).populate({
            path: "user",
            select: "name email"
        }).sort({createdAt: -1})

        res.render('adminInvestments', {investments});
    }

    async verifyUser(req, res) {
        try {
            await User.findByIdAndUpdate(req.body.user, {isVerified: true})
            req.flash('success', 'user verified successfully')
            res.redirect('/user/admin/user')
        } catch (error) {
            req.flash('error', 'failed to verify user')
            res.redirect('/user/admin/user')
        }

    }

    async deleteUser(req, res) {
        try {
            await User.findByIdAndDelete(req.body.user)
            req.flash('success', 'user deleted successfully')
            res.redirect('/user/admin/user')
        } catch (error) {
            req.flash('error', 'failed to delete user')
            res.redirect('/user/admin/user')
        }
    }


}

module.exports = new AdminController();
