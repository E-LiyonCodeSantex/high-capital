const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const InvestmentPlan = require('../models/investmentPlanModel');
const Deposit = require('../models/depositModel'); // Import the Deposit model
const WalletAdress = mongoose.models.WalletAdress; // Use the existing WalletAdress model from mongoose.models
const { authenticateUser } = require('../middleware/authMiddleware');
const { upload, normalizeFilePath } = require('../middleware/upload');


// Create a deposit
exports.createDeposit = async (req, res) => {
  try {
    const {planId, name, amount, asset } = req.body;

    const planExists = await InvestmentPlan.findById(planId);

    // Simulate deposit address
    const fakeAddress = '0x' + Math.random().toString(36).substr(2, 38);

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      asset,
      depositAddress: fakeAddress,
    });

    res.render('user/depositSuccess', { deposit });
  } catch (error) {
    console.error(error);
    res.status(500).send('Deposit failed');
  }
};

// Show user's deposit page
exports.getDepositPage = async (req, res) => {
  const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.render('user/deposit', { deposits });
};


/*
// Handle deposit confirmation
exports.makeDeposit = async (req, res) => {
    try {
        const {planId, name, coinType, dailyProfit, amount, duration, referralBonus, totalProfit } = req.query;

        const plans = await InvestmentPlan.find();
        const wallets = await WalletAdress.find();

        // Validate that the name and coinType match existing plans and wallets
        const planExists = await InvestmentPlan.findById(planId);
        const walletExists = await WalletAdress.findOne({ name: coinType });

        if (!planExists) {
            return res.render('user/deposit', {
                planErrorMessage: 'Invalid investment plan selected.',
                plans,
                wallets,
            });
        }
        if (!walletExists) {
            return res.render('user/deposit', {
                walletErrorMessage: 'Invalid coin type selected.',
                plans,
                wallets,
            });
        }
        // Redirect to confirmDeposit.hbs with the wallet address,name, coinType, dailyProfit, amount, duration, and referralBonus
        const wallet = await WalletAdress.findOne({ name: coinType });
        return res.render('user/confirmDeposit', {
            name,
            coinType,
            dailyProfit,
            amount,
            duration,
            referralBonus,
            totalProfit,
            adress: wallet.adress,
        });
    } catch (error) {
        console.error('Error creating deposit:', error);
        res.status(500).json({ error: 'An error occurred while creating the deposit.' });
    }
}; 

// Function to update a deposit with a transaction receipt
exports.updateDeposit = async (req, res) => {
    try {
        console.log('Authenticated user:', req.user);
        const { name, coinType, dailyProfit, amount, duration, referralBonus, totalProfit } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Transaction receipt is required.' });
        }

        // Create a new deposit object
        const newDeposit = new deposit({
            user: req.user._id, // Associate the deposit with the logged-in user
            name,
            coinType,
            dailyProfit,
            amount,
            duration, //: durationString, // Ensure duration is a string
            referralBonus,
            totalProfit,
            transactionReceipt: `/${req.file.path.replace(/\\/g, '/')}`,
            status: 'unconfirmed',
            date: new Date(),
            // FIX: Calculate endDate
            endDate: new Date(Date.now() + Number(req.body.duration) * 24 * 60 * 60 * 1000)
        });

        console.log('New deposit:', newDeposit);
        //deposit.date = new Date();
        // Save the new deposit to the database
        await newDeposit.save();

        res.redirect('/user/dashboard'); // Redirect to the deposit page after successful deposit
    } catch (err) {
        console.error('Error in deposit route:', err);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

// Function to activate a deposit
exports.activateDeposit = async (req, res) => {
    try {
        const depositId = req.params.id;
        const depositRecord = await deposit.findById(depositId);

        if (!depositRecord) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        // Only activate if not already confirmed or completed
        if (depositRecord.status === 'confirmed' || depositRecord.status === 'completed') {
            return res.json({ endDate: depositRecord.endDate, startDate: depositRecord.startDate });
        }

        // Set startDate to now
        const now = new Date();
        depositRecord.startDate = now;

        // Calculate endDate based on duration (in days)
        if (typeof depositRecord.duration !== 'number' || isNaN(depositRecord.duration)) {
            return res.status(400).json({ error: 'Invalid duration value' });
        }
        depositRecord.endDate = new Date(now.getTime() + depositRecord.duration * 24 * 60 * 60 * 1000);

        // Update status
        depositRecord.status = 'confirmed';
        await depositRecord.save();

        res.json({ message: 'Deposit activated successfully', endDate: depositRecord.endDate, startDate: depositRecord.startDate });
    } catch (error) {
        console.error('Error activating deposit:', error);
        res.status(500).json({ error: 'Failed to activate deposit' });
    }
};
*/

//function to get all users
exports.getAllDeposit = async (req, res) => {
    try {
        // Fetch all deposits and populate the user field
        const deposits = await Deposit.find().populate('user', 'name email profilePhoto');

        //console.log('Fetched deposits:', deposits);

        // Render the admin/User.hbs view and pass the users
        res.render('admin/deposit', {
            deposits, // Pass users as an array for Handlebars
            depositsJSON: JSON.stringify(deposits) // Pass users as a JSON string for JavaScript
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users.');
    }
};


