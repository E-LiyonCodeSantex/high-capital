const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    minDeposit: { type: Number, required: true },
    maxDeposit: { type: Number, required: true },
    dailyProfit: { type: Number, required: true },
    duration: { type: Number, required: true },
    referralBonus: { type: Number, required: true },
});

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema);