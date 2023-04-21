const {Schema, model, default: mongoose} = require('mongoose');
const {generateUserId} = require('../utils/utils');
const splitTransactions = require("../utils/splitTransactions.util")
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const accountSchema = new Schema({ //done
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


    const {deposits, withdrawals, investments, earnings} = splitTransactions(this.transactions)

    return (deposits + earnings) - (withdrawals + investments)
})

/**
 * hash user's password on save
 */
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {

        // hashing users password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password, salt);

        // saving it to their user data object
        this.password = hash;
        next()
    }
})


userSchema.methods.isPasswordCorrect = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword)
}

userSchema.methods.genPasswordResetToken = async function (){
    const token = crypto.randomBytes(20).toString('hex');

    // hash token
    const hash = bcrypt.hash(token,5);

    this.passwordResetToken = hash;
    this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

    await this.save();

    return token
}

<<<<<<< HEAD
const Withdrawal = model("Withdrawal", withdrawalSchema)
const Deposit = model("Deposit", depositSchema)
const Earning = model("Earning", earningSchema)
const Investment = model("Investment", investmentSchema)
const Wallet = model("Wallet", walletSchema)
const Secret = model('Secret', secretSchema);
const Account = model('Account', accountSchema);
const User = model('User', userSchema);
module.exports = { User, Withdrawal, Deposit, Investment };
=======
const User = model('User', userSchema);
module.exports = {User};
>>>>>>> 061a37c3814f392474413208982620f755e543c7
