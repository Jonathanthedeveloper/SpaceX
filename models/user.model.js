

const { Schema, model, default: mongoose } = require('mongoose');
const { generateUserId } = require('../utils/utils');
const splitTransactions = require("../utils/splitTransactions.util")








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
        default: generateUserId()
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
    phoneNumber: String,
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
    passwordResetExpires: Date,
    passwordResetToken: String,

}, {
    timestamps: true, toObject: {
        virtuals: true
    }, toJSON: {
        virtuals: true
    },
});


userSchema.virtual("transactions", {
    ref: "Transaction",
    localField: "_id",
    foreignField: "user"
});



userSchema.virtual("balance").get(function () {


    const { deposits, withdrawals, investments, earnings } = splitTransactions(this.transactions)

    return (deposits + earnings) - (withdrawals + investments)
})



const User = model('User', userSchema);
module.exports = { User };
