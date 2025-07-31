const mongoose = require('mongoose');
const Deposit = require('../models/depositModel'); // Import the Deposit model
const WalletAndAccountDetails = require('../models/walletModel'); // Import the WalletAddress model

exports.getDepositPage = async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID

        const walletRecords = await WalletAndAccountDetails.find();

        const wallets = walletRecords.filter(record => record.name && record.address);
        const bankNames = walletRecords.filter(record => record.bankName && record.account && record.number);

        const deposits = await Deposit.find({ user: userId })
            .populate('user', 'name email')
            .sort({ date: -1 });

        res.render('user/deposit', {
            user: req.user,
            deposits,
            wallets, // Pass the deposits to the view
            bankNames,
            walletJSON: JSON.stringify(wallets),// Pass the wallets to the viewa as JSON
            bankNamesJSON: JSON.stringify(bankNames),
            depositsJSON: JSON.stringify(deposits)
        });
    } catch (error) {
        console.error('Error fetching deposit page:', error);
        res.status(500).render('user/errorPage', {
            layout: false,
            errorMessage: 'Something went wrong while fetching the deposit page.'
        });
    };
};

exports.makeDeposit = async (req, res) => {
    try {
        const { amount, bankName, method, bankAccount, asset, depositAddress } = req.body;

        const userId = req.user?._id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).render('user/errorPage', {
                layout: false,
                errorMessage: 'Invalid user ID.'
            });
        }
        const transactionReceipt = req.file?.filename || null;
        const newDeposit = new Deposit({
            user: userId,
            amount,
            method,
            bankName,
            bankAccount,
            asset,
            depositAddress,
            transactionReceipt,
            status: 'pending'
        });
        const savedDeposit = await newDeposit.save();
        // Redirect to user invest section after saving
        res.redirect(`/user/deposit#deposit-${savedDeposit._id}`);
    } catch (error) {
        console.error('Error creating deposit:', error);
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        res.status(500).render('user/errorPage', {
            layout: false,
            errorMessage: 'Something went wrong while processing your deposit.'
        });
    }
};
