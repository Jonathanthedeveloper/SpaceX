const splitTransactions = require('./splitTransactions.util')

function calcUserBalance(transactions) {
    const { deposits, withdrawals, investments, earnings, penalties, bonuses } = splitTransactions(transactions);

    const depositTotal = deposits.reduce((acc, curr) => acc + curr.amount, 0);

    const investmentTotal = investments.reduce((acc, curr) => acc + curr.amount, 0);

    const withdrawalTotal = withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

    const earningsTotal = earnings.reduce((acc, curr) => acc + curr.amount, 0);

    const penaltyTotal = penalties.reduce((acc, curr) => acc + curr.amount, 0);

    const bonusTotal = bonuses.reduce((acc, curr) => acc + curr.amount, 0);

    return (depositTotal + earningsTotal + bonusTotal) - (investmentTotal + withdrawalTotal + penaltyTotal)
}

module.exports = calcUserBalance