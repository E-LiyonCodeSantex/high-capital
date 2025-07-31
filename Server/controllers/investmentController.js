const mongoose = require('mongoose');
const User = require('../models/userModel');
const InvestmentPlan = require('../models/investmentPlanModel');
const Investment = require('../models/investmentModel'); // Import the Deposit model
const WalletAdress = mongoose.models.WalletAdress; // Use the existing WalletAdress model from mongoose.models
const { authenticateUser } = require('../middleware/authMiddleware');
const { upload, normalizeFilePath } = require('../middleware/upload');




// Handle deposit confirmation
exports.placeInvestment = async (req, res) => {
    try {
        const { planId, name, asset, dailyProfit, amount, duration, referralBonus, totalProfit } = req.query;

        const plans = await InvestmentPlan.find();
        const wallets = await WalletAdress.find();

        // Validate that the name and asset match existing plans and wallets
        const planExists = await InvestmentPlan.findById(planId);
        const walletExists = await WalletAdress.findOne({ name: asset });

        if (!planExists) {
            return res.render('user/invest', {
                planErrorMessage: 'Invalid investment plan selected.',
                plans,
                wallets,
            });
        }
        if (!walletExists) {
            return res.render('user/invest', {
                walletErrorMessage: 'Invalid asset selected.',
                plans,
                wallets,
            });
        }
        // Redirect to confirmDeposit.hbs with the wallet address,name, coinType, dailyProfit, amount, duration, and referralBonus
        const wallet = await WalletAdress.findOne({ name: asset });
        return res.render('user/confirmInvestment', {
            name,
            asset,
            dailyProfit,
            amount,
            duration,
            referralBonus,
            adress: wallet.adress,
        });
    } catch (error) {
        console.error('Error creating deposit:', error);
        res.status(500).json({ error: 'An error occurred while creating the deposit.' });
    }
};

// Function to update a deposit with a transaction receipt
exports.updateinvestment = async (req, res) => {
    try {
        console.log('Authenticated user:', req.user);
        const { name, asset, dailyProfit, amount, duration, referralBonus } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Transaction receipt is required.' });
        }

        // Create a new deposit object
        const newInvestment = new Investment({
            user: req.user._id, // Associate the deposit with the logged-in user
            name,
            asset,
            dailyProfit,
            amount,
            duration, //: durationString, // Ensure duration is a string
            referralBonus,
            transactionReceipt: `/${req.file.path.replace(/\\/g, '/')}`,
            status: 'pending',
            date: new Date(),
            // FIX: Calculate endDate
            endDate: new Date(Date.now() + Number(req.body.duration) * 24 * 60 * 60 * 1000)
        });

        console.log('New Investment:', Investment);
        //deposit.date = new Date();
        // Save the new deposit to the database

        const savedInvestment = await newInvestment.save(); // After saving
        res.redirect(`/user/invest#investment-${savedInvestment._id}`);
    } catch (err) {
        console.error('Error in investment route:', err.message);
        res.status(500).json({ error: 'An unexpected error occurred. please try again' });
    }
};

// Function to activate a deposit
exports.activateinvestment = async (req, res) => {
    try {
        const investmentId = req.params.id;
        const investmentRecord = await Investment.findById(investmentId);

        if (!investmentRecord) {
            return res.status(404).json({ error: 'No investment found' });
        }

        // Only activate if not already confirmed or completed
        if (investmentRecord.status === 'running' || investmentRecord.status === 'completed') {
            return res.json({ endDate: investmentRecord.endDate, startDate: investmentRecord.startDate });
        }

        // Set startDate to now
        const now = new Date();
        investmentRecord.startDate = now;

        // Calculate endDate based on duration (in days)
        if (typeof investmentRecord.duration !== 'number' || isNaN(investmentId.duration)) {
            return res.status(400).json({ error: 'Invalid duration value' });
        }
        investmentId.endDate = new Date(now.getTime() + investmentId.duration * 24 * 60 * 60 * 1000);

        // Calculate total profit
        if (typeof investmentId.dailyProfit !== 'number' || isNaN(investmentId.dailyProfit)) {
            return res.status(400).json({ error: 'Invalid profit percentage value' });
        }
        investmentId.totalProfit = investmentId.amount * (investmentId.dailyProfit / 100);


        // Update status
        investmentId.status = 'running';
        await investmentId.save();

        res.json({ message: 'Investment activated successfully', endDate: investmentId.endDate, startDate: investmentId.startDate });
    } catch (error) {
        console.error('Error activating deposit:', error);
        res.status(500).json({ error: 'Failed to activate deposit' });
    }
};


exports.getAllInvestment = async (req, res) => {
  try {
    const investments = await Investment.find().populate('user', 'name email profilePhoto');
    res.render('admin/investment', {
      investments,
      investmentsJSON: JSON.stringify(investments)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('admin/errorPage', { layout: false });
  }
};

