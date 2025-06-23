const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const WalletAdress = require('../models/walletModel');


// Get all investment plans
exports.getWalletAdresses = async (req, res) => {
    try {
        const wallets = await WalletAdress.find(); // Fetch all wallet adresses from the database
        res.render('admin/WalletManagement', { wallets }); // Pass the wallet adresses to the template
    } catch (error) {
        console.error('Error fetching wallet adresses:', error);
        res.status(500).send('An error occurred while fetching wallet adresses.');
    }
};

// Get a single investment plan by ID
exports.getWalletAdressById = async (req, res) => {
    try {
        const { id } = req.params;
        const wallet = await WalletAdress.findById(id);

        if (!wallet) {
            return res.status(404).json({ error: 'Investment wallet adress not found.' });
        }

        res.json(wallet);
    } catch (error) {
        console.error('Error fetching wallet adress:', error);
        res.status(500).json({ error: 'An error occurred while fetching the wallet adress.' });
    }
};

// Create a new investment plan
exports.createWalletAdress = async (req, res) => {
    try {
        const { name, adress } = req.body;

        const newAdress = new WalletAdress({
            name,
            adress
        });

        await newAdress.save();
        res.status(201).json({ message: 'Wallet adress created successfully', wallet: newAdress });
    } catch (error) {
        console.error('Error uploading wallet:', error);
        res.status(500).json({ error: 'An error occurred while uploading wallet.' });
    }
};

// Edit an existing wallet adress
exports.editWalletAdress = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, adress } = req.body;

        const updatedWallet = await WalletAdress.findByIdAndUpdate(
            id,
            { name, adress },
            { new: true, runValidators: true }
        );

        if (!updatedWallet) {
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        res.status(200).json({ message: 'Wallet updated successfully', wallet: updatedWallet });
    } catch (error) {
        console.error('Error editing wallet:', error);
        res.status(500).json({ error: 'An error occurred while editing the wallet.' });
    }
};

//delete existing investment plan
exports.deleteWalletAdress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWallet = await WalletAdress.findByIdAndDelete(id);

        if (!deletedWallet) {
            return res.status(404).json({ error: 'Wallet not found.' });
        }

        res.status(200).json({ message: 'Wallet deleted successfully.' });
    } catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ error: 'An error occurred while deleting the wallet.' });
    }
};

// Update an existing investment plan
exports.updateWalletAdress = async (req, res) => {
    const { name, adress } = req.body;
    await WalletAdress.findByIdAndUpdate(req.params.id, { name, adress });
    res.status(200).send('Wallet updated successfully');
};