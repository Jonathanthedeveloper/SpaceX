function splitTransactions(transactions) {
    const deposits = transactions?.filter(transaction => { transaction.status === "successful" && transaction.type === "deposit" })

    const withdrawals = transactions?.filter(transaction => { transaction.status === "successful" && transaction.type === "withdrawal" })

    const investments = transactions?.filter(transaction => { transaction.status === "successful" && transaction.type === "investment" })

    const earnings = transactions?.filter(transaction => { transaction.status === "successful" && transaction.type === "earning" })


    return { deposits, withdrawals, investments, earnings }
}


module.exports = splitTransactions