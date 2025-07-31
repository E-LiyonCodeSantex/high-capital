const mongoose = require('mongoose');
const User = require('../models/userModel');
const WalletAndAccountDetails = require('../models/walletModel');


// Get all investment plans
exports.getWalletAndAccontAddresses = async (req, res) => {
  try {
    const allRecords = await WalletAndAccountDetails.find();

    const wallets = allRecords.filter(record => record.name && record.address);
    const accounts = allRecords.filter(record => record.bankName && record.account && record.number);

    res.render('admin/WalletManagement', {
      wallets,
      accounts
    });
  } catch (error) {
    console.error('Error fetching wallet and account details:', error);
    res.status(500).send('An error occurred while fetching wallet and account details.');
  }
};


// Get a single investment plan by ID
exports.getWalletAndAccountAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const walletAndAccount = await WalletAndAccountDetails.findById(id);

        if (!walletAndAccount) {
            return res.status(404).json({ error: 'Investment wallet adress and account not found.' });
        }

        res.json(walletAndAccount);
    } catch (error) {
        console.error('Error fetching wallet adress or account detail:', error);
        res.status(500).json({ error: 'An error occurred while fetching the wallet adress or account detail.' });
    }
};

// Create a new investment plan
exports.createWalletAndAccountAddress = async (req, res) => {
    try {
        const { name, address, bankName, account, number } = req.body;

        const newAddress = new WalletAndAccountDetails({
            name,
            address,
            bankName,
            account,
            number
        });

        await newAddress.save();
        res.status(201).json({ message: 'Wallet adress created successfully', walletAndAccount: newAddress });
    } catch (error) {
        console.error('Error uploading wallet:', error);
        res.status(500).json({ error: 'An error occurred while uploading wallet.' });
    }
};

// Edit an existing wallet adress
exports.editWalletAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, bankName, account, number } = req.body;

        const updatedWalletAndAccount = await WalletAndAccountDetails.findByIdAndUpdate(
            id,
            { name, address, bankName, account, number },
            { new: true, runValidators: true }
        );

        if (!updatedWalletAndAccount) {
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        res.status(200).json({ message: 'Wallet updated successfully', walletAndAccount: updatedWalletAndAccount });
    } catch (error) {
        console.error('Error editing wallet:', error);
        res.status(500).json({ error: 'An error occurred while editing the wallet.' });
    }
};

//delete existing investment plan
exports.deleteWalletAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWalletAndAccount = await WalletAndAccountDetails.findByIdAndDelete(id);

        if (!deletedWalletAndAccount) {
            return res.status(404).json({ error: 'Wallet or account not found.' });
        }

        res.status(200).json({ message: 'Wallet deleted successfully.' });
    } catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ error: 'An error occurred while deleting the wallet.' });
    }
};

// Update an existing investment plan
exports.updateWalletAddress = async (req, res) => {
    const { name, address, bankName, account, number } = req.body;
    await WalletAndAccountDetails.findByIdAndUpdate(req.params.id, { name, address, bankName, account, number });
    res.status(200).send('Wallet or account updated successfully');
};