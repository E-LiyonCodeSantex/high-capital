const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // e.g., 'bank', 'crypto'
  walletName: {type: String},
  walletAddress: { type: String }, // For crypto
  bankName: { type: String },   // For bank
  acountNumber: { type: Number }, // For bank
  acountName: { type: String }, // For bank
  status: { type: String, enum: ['pending', 'Successful', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  wihdrawalReceipt: {type: String},
  processedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('withdrawal', withdrawalSchema);

