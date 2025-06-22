const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true }, // Reference to the User model
    name: { type: String, required: true },
    coinType: { type: String, required: true },
    dailyProfit: { type: String, required: true },
    amount: { type: Number, required: true },
    duration: { type: Number, required: true },
    referralBonus: { type: String, required: true },
    totalProfit: { type: Number, required: true },
    transactionReceipt: { type: String, required: true },
    status: {type: String, default: 'unconfirmed'}, // Default status is 'unconfirmed'
    startDate: { type: Date }, // <-- Add this line
    endDate: { type: Date, required: true }, // End date of the investment
    date: { type: Date, default: Date.now }, // Automatically set the date to now
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('deposit', depositSchema); // Capitalized model name

