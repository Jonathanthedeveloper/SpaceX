
function getWallet(coin) {
    switch (coin.toLowerCase()) {
        case "bitcoin": return "1P4PiX2EsjeiX8PaBYLsfR3eAQ4MizRmyk";
        case "ethereum": return "0x9EA7750Be23D5C34Df3646c391A0388291339f9f";
        case "usdt": return "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
        case "dogecoin": return "DREBZME23eHTvKb7N5PdqxN9U3NvLMhSWW";
        default: return "you did not select a deposit method";
    }

}

module.exports = getWallet;