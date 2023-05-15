const PORT = process.env.PORT || 3000;
// const starterDuration = 86400000;
const starterDuration = 1000;
const regularDuration = 172800000;
const proDuration = 518400000;
const eliteDuration = 2592000000;
// 604800000 7day
// const payoutDuration = 300000; // 5mins
// const payoutDuration = 60000; // 6 secs
const starterPercent = 0.05;
const regularPercent = 0.1;
const proPercent = 0.25;
const elitePercent = 0.37;


const referralEarningPercent = 0.1;


module.exports = { PORT, starterPercent, regularPercent, proPercent, elitePercent, referralEarningPercent, starterDuration, regularDuration, proDuration, eliteDuration }