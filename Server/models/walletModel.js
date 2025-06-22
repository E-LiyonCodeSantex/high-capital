const mongoose = require('mongoose');

const walletAdressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adress: { type: String, required: true },
});

module.exports = mongoose.models.WalletAdress || mongoose.model('WalletAdress', walletAdressSchema);