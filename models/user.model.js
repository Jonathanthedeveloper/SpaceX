const { Schema, model, default: mongoose } = require('mongoose');
const { generateUserId } = require('../utils/utils');
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
    country: String,
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
    isVerified: {
        type: Boolean,
        default: false
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
    kyc: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        country: String,
        gender: String,
        governmentIssuedId: {
            idType: String,
            picture: [String]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        awaitingVerification: {
            type: Boolean,
        },
        subbmittedAt: {
            type: Date,
            default: Date.now()
        }
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

userSchema.methods.genPasswordResetToken = async function () {
    const token = crypto.randomBytes(20).toString('hex');

    // hash token
    const hash = bcrypt.hash(token, 5);

    this.passwordResetToken = hash;
    this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

    await this.save();

    return token
}


const User = model('User', userSchema);

module.exports = User;

