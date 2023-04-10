

const { Schema, model, default: mongoose } = require('mongoose');
const { generateUserId } = require('../utils/utils');



const secretSchema = new Schema({
    question: {
        type: String,
        default: ""
    },
    answer: {
        type: String,
        trim: true,
        default: ""
    }
});


const depositSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },

}, { timestamps: true })


const withdrawalSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true })


const earningSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const investmentSchema = new Schema({
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true })


const walletSchema = new Schema({ //done
    balance: {
        type: Number,
        required: true,
        default: 0.00
    }
})

const accountSchema = new Schema({ //done
    bitcoinAddress: {
        type: String,
        trim: true,
        default: ""
    },
    bitcoinAddress: {
        type: String,
        trim: true,
        default: ""
    },
    ethereumAddress: {
        type: String,
        trim: true,
        default: ""
    },
    bitcoinCashAddress: {
        type: String,
        trim: true,
        default: ""
    },
    tronAddress: {
        type: String,
        trim: true,
        default: ""
    },
    bnbBEP2Address: {
        type: String,
        trim: true,
        default: ""
    },
    bnbBEP20Address: {
        type: String,
        trim: true,
        default: ""
    },
    usdtERC20Address: {
        type: String,
        trim: true,
        default: ""
    },
    usdtTRC20Address: {
        type: String,
        trim: true,
        default: ""
    },
});


referralSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    }
})



const userSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    secret: {
        type: secretSchema,
        required: true,
    },
    account: {
        type: accountSchema,
        default: {},
    },
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    withdrawals: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    deposits: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    investments: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    earnings: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    passwordResetExpires: Date,
    passwordResetToken: String,

}, {
    timestamps: true, toObject: {
        virtual: true
    }, toJSON: {
        virtual: true
    },
});




userSchema.virtual("balance").get(function () {

    const withdrawals = this.withdrawals.filter(withdrawal => withdrawal.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const deposits = this.deposits.filter(deposit => deposit.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const investments = this.investments.filter(investment => investment.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const earnings = this.earnings.filter(earning => earning.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)

    return (deposits + earnings) - (withdrawals + investments)
})


const Withdrawal = model("Withdrawal", withdrawalSchema)
const Deposit = model("Deposit", depositSchema)
const Earning = model("Earning", earningSchema)
const Investment = model("Investment", investmentSchema)
const Wallet = model("Wallet", walletSchema)
// const Transaction = model("Transaction", transactionSchema)
const Secret = model('Secret', secretSchema);
const Account = model('Account', accountSchema);
const User = model('User', userSchema);
module.exports = { User, Withdrawal, Deposit, Investment };

// const { User, Withdrawal, Deposit, Investment } = require('../models/user.model')