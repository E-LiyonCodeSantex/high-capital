const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose
const { registerUser, loginUser, resetPassword, verifyResetCode, verifyPassword, updateUserSettings, logoutUser } = require('../controllers/userController'); // Import the user controller
const InvestmentPlan = require('../models/investmentPlanModel');
const { authenticateUser } = require('../middleware/authMiddleware');
const WalletAdress = require('../models/walletModel'); // Correct the casing of the file name
const { makeDeposit, updateDeposit } = require('../controllers/depositController');
const { getUserDashboard } = require('../controllers/userDashboardController'); // Import the user dashboard controller
const { upload } = require('../middleware/upload'); // Import the upload middleware
const { requireSettingsConfirmation, setUserLocals } = require('../middleware/userSettingsMiddleware');
const User = require('../models/userModel'); // Import the User model
const updateLastActive = require('../middleware/updateLastActive');
const withdrawalController = require('../controllers/withdrawalController');
const deposit = require('../models/depositModel');
const { getTransactionHistory } = require('../controllers/historyController');


// Middleware to set default layout for all user routes
router.use((req, res, next) => {
    res.locals.layout = 'userLayout'; // Set default layout to user layout
    next();
});

router.get('/signUp', (req, res) => res.render('user/signUp', { layout: false })); // Sign-up page

router.post('/register', upload.single('profilePhoto'), async (req, res) => {
    try {
        await registerUser(req, res);
    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.render('user/signUp', { fileSizeError: 'File size exceeds the limit of 2MB.' });
        }
        console.error('Error in registration route:', error);
        res.status(500).render('errorPage', { errorMessage: 'An unexpected error occurred. Please try again.' });
    }
});

router.get('/login', (req, res) => res.render('user/login', { layout: false })); // Login page

router.post('/login', async (req, res, next) => {
    try {
        const result = await loginUser(req, res, next);
        if (result === true) {
            return res.redirect('/user/dashboard');
        }
        // If result is not true, loginUser already handled the response (e.g., render error)
    } catch (err) {
        next(err);
    }
});

router.get('/passwordReset', (req, res) => {
    res.render('user/passwordReset', { layout: false });
});
router.post('/passwordReset', async (req, res, next) => {
    try {
        await resetPassword(req, res, next); // Call the resetPassword function
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.post('/verifyResetCode', async (req, res, next) => {
    try {
        await verifyResetCode(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.get('/dashboard', authenticateUser, setUserLocals, updateLastActive, async (req, res, next) => {
    try {
        await getUserDashboard(req, res, next); // Call the getUserDashboard function
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.get('/WalletManagement', authenticateUser, setUserLocals, updateLastActive, (req, res) => res.render('user/wallet'));
router.get('/settings/confirm', authenticateUser, setUserLocals, updateLastActive, (req, res) => res.render('user/settingsConfirm'));

router.post('/settings/confirm', authenticateUser, setUserLocals, updateLastActive, async (req, res, next) => {
    try {
        await verifyPassword(req, res, next); // loginUser handles all responses
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.get('/settings', authenticateUser, setUserLocals, updateLastActive, requireSettingsConfirmation, (req, res) => {
    res.render('user/settings', { user: req.user });
});
router.post('/settings', authenticateUser, setUserLocals, updateLastActive, upload.single('profilePhoto'), async (req, res, next) => {
    try {
        // You should create and import an updateUserSettings controller function
        await updateUserSettings(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.get('/makeDeposit', authenticateUser, setUserLocals, updateLastActive, async (req, res) => {
    try {
        const plans = await InvestmentPlan.find(); // Fetch all investment plans
        const wallets = await WalletAdress.find(); // Fetch all wallet addresses
        const userId = req.user._id;
        const deposits = await deposit.find({ user: userId }).sort({ date: -1 });
        let selectedPlan = null;
        if (req.query.planId) {
            selectedPlan = await InvestmentPlan.findById(req.query.planId);
        }
        res.render('user/deposit', { plans, wallets, selectedPlan, deposits, user: req.user }); // Pass plans and wallets to the template
    } catch (error) {
        console.log('Selected Plan:', selectedPlan); // Debug
        res.status(500).send('Error loading deposit page.');
    }
});

// Use makeDeposit for creating a deposit
router.get('/confirmDeposit', authenticateUser, setUserLocals, updateLastActive, async (req, res) => {
    try {
        await makeDeposit(req, res); // Call the makeDeposit function
    } catch (err) {
        console.error('Error in makeDeposit route:', err);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// Use updateDeposit for updating a deposit with a transaction receipt
router.post('/deposit', authenticateUser, setUserLocals, updateLastActive, upload.single('deposit_receipt'), async (req, res) => {
    try {
        await updateDeposit(req, res);
    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.render('user/deposit', { fileSizeError: 'File size exceeds the limit of 2MB.' });
        }
        console.error('Error in deposit route:', error);
        res.status(500).render('errorPage', { errorMessage: 'An unexpected error occurred. Please try again.' });
    }
});

router.get('/withdrawal', authenticateUser, setUserLocals, updateLastActive, withdrawalController.getUserWithdrawals);
router.post('/withdrawal', authenticateUser, setUserLocals, updateLastActive, withdrawalController.createWithdrawal);

router.get('/investmentPlans', authenticateUser, setUserLocals, updateLastActive, async (req, res) => {
    try {
        const plans = await InvestmentPlan.find(); // Fetch all investment plans
        const wallets = await WalletAdress.find(); // Fetch all wallet addresses
        res.render('user/investmentPlans', { plans, wallets }); // Pass plans and wallets to the template
    } catch (error) {
        console.error('Error fetching data for deposit page:', error);
        res.status(500).send('An error occurred while fetching data for the deposit page.');
    }
});

//router.get('/history', authenticateUser, setUserLocals, updateLastActive, getTransactionHistory);
router.get('/history', authenticateUser, setUserLocals, updateLastActive, getTransactionHistory);
router.get('/logout', async (req, res, next) => {
    try {
        await logoutUser(req, res, next);
    } catch (err) {
        next(err); 
    }
});

module.exports = router; // Export the router
