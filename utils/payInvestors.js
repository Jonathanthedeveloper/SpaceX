const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const userService = require('../services/user.service')
const transactionService = require('../services/transaction.service')
const {
    starterPercent,
    platinumPercent,
    premiumPercent,
    zenithPercent,
    referralEarningPercent,
    starterDuration,
    platinumDuration,
    premiumDuration,
    zenithDuration
} = require('../config')


const _getPayoutAmount = (plan, amount) => {

    switch (plan) {
        case 'starter':
            return (amount + ((starterPercent * amount)) * 7).toFixed(2);
            break;
        case 'platinum':
            return (amount + ((platinumPercent * amount)) * 7).toFixed(2);
            break;
        case 'premium':
            return (amount + ((premiumPercent * amount)) * 7).toFixed(2);
            break;
        case 'zenith':
            return (amount + ((zenithPercent * amount)) * 7).toFixed(2);
            break;
        default:
            return 0;
            break;
    }
}

const payInvestors = async () => {
    try {
// fetch all investments where there status is active and have not been fulfilled 
        const pendingInvestments = await Transaction.find({$and: [{type: 'investment'}, {isFulfilled: {$ne: true}}, {expiresAt: {$lte: Date.now()}}]})

// console.log(pendingInvestments)


        await pendingInvestments.forEach(async investment => {


            try {
                const amount = _getPayoutAmount(investment.plan, investment.amount)


                const earningData = {
                    user: investment.user._id,
                    type: 'earning',
                    amount,
                    status: 'successful',
                    plan: investment.plan
                }


                await transactionService.create(earningData)

                // update investment
                await Transaction.findByIdAndUpdate(investment._id, {isFulfilled : true, active: false}, {
                    upsert: true,
                    new: true
                })



            } catch (e) {
                console.log(e)
            }

        })
        console.log(`Investors last paid at ${(new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(Date.now()))}`)


    } catch (error) {
        console.error(error)
    }
}


module.exports = payInvestors