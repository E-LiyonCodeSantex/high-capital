const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true }, // Reference to the User model
    name: { type: String, required: true },
    dailyProfit: { type: String, required: true },
    amount: { type: Number, required: true },
    asset: { type: String, required: true }, // e.g., USDT, BTC
    depositAddress: { type: String }, // Simulated or static address
    duration: { type: Number, required: true },
    referralBonus: { type: String, required: true },
    transactionReceipt: { type: String, required: true },
    status: { type: String, enum: ['pending', 'running', 'completed'], default: 'pending' }, // Default status is 'pending'
    totalProfit:{type: String, required: true},
    txId: { type: String }, // Optional for tracking on explorer
    date: { type: Date }, // <-- Add this line
    endDate: { type: Date, required: true }, // End date of the investment
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Investment', investmentSchema);


