const PORT = process.env.PORT || 3000;
const starterDuration = 604800000;
const platinumDuration = 604800000;
const premiumDuration = 604800000;
const zenithDuration = 604800000;
// 604800000 7day
// const payoutDuration = 300000; // 5mins
// const payoutDuration = 60000; // 6 secs
const starterPercent = 0.02;
const platinumPercent = 0.025;
const premiumPercent = 0.03;
const zenithPercent = 0.04;
const referralEarningPercent = 0.1;


module.exports = { PORT, starterPercent, platinumPercent, premiumPercent, zenithPercent, referralEarningPercent, starterDuration, platinumDuration, premiumDuration, zenithDuration }