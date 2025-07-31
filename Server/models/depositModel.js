const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true },
        amount: { type: Number, required: true },
        method: { type: String, required: true }, // e.g., 'bank', 'crypto'
        bankName:{ type: String }, // e.g., Bank of America
        bankAccount: { type: String }, // e.g., 123456789
        bankAccountName: { type: String }, // e.g., John Doe
        asset: { type: String}, // e.g., USDT, BTC
        depositAddress: { type: String }, // Simulated or static address
        transactionReceipt: { type: String, required: true },
        status: { type: String, enum: ['failed', 'pending', 'successful'], default: 'pending' },
        txId: { type: String }, // Optional for tracking on explorer
        date: { type: Date, default: Date.now }, // Automatically set to current date
        confrimedDate: { type: Date }, // Date when the deposit is confirmed
});

module.exports = mongoose.model('Deposit', depositSchema);