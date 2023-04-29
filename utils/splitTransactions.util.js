function splitTransactions(transactions) {
    const deposits = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "deposit")

    const withdrawals = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "withdrawal")

    const investments = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "investment")

    const earnings = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "earning")

    const penalties = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "penalty")

    const bonuses = transactions?.filter(transaction => transaction.status === "successful" && transaction.type === "bonus")


    return { deposits, withdrawals, investments, earnings, penalties, bonuses }
}


module.exports = splitTransactions