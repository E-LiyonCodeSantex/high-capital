const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true }, // Reference to the User model
    name: { type: String, required: true },
    dailyProfit: { type: String, required: true },
    amount: { type: Number, required: true },
    asset: { type: String, required: true }, // e.g., USDT, BTC
    depositAddress: { type: String, required: true }, // Simulated or static address
    duration: { type: Number, required: true },
    referralBonus: { type: String, required: true },
    totalProfit: { type: Number, required: true },
    transactionReceipt: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }, // Default status is 'pending'
    txId: { type: String }, // Optional for tracking on explorer
    startDate: { type: Date }, // <-- Add this line
    endDate: { type: Date, required: true }, // End date of the investment
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Deposit', depositSchema);


