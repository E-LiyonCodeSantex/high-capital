const mongoose = require('mongoose');

const walletAdressSchema = new mongoose.Schema({
    name: { type: String},
    address: { type: String },
    bankName: { type: String },
    account: { type: String },
    number: { type: Number }
});

module.exports = mongoose.models.WalletAdress || mongoose.model('WalletAndAccountDetails', walletAdressSchema);