const Withdrawal = require('../models/withdrawalModel');
const deposit = require('../models/depositModel');
const WalletAdress = require('../models/walletmodel');

exports.getUserWithdrawals = async (req, res, next) => {
  try {
    const wallets = await WalletAdress.find();
    const userId = req.user._id;
    const withdrawals = await Withdrawal.find({ user: userId }).sort({ requestedAt: -1 });
    res.render('user/withdrawal', { wallets, withdrawals, user: req.user });
  } catch (err) {
    next(err);
  }
};

exports.createWithdrawal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { amount, method, walletAddress, bankName, acountNumber, acountName, status } = req.body;
    const walletName = method === 'crypto' && req.body.walletName !== 'selectWallet' ? req.body.walletName : null;

    // Optional: Check if user has enough available balance
    // (You should implement a robust check here)
    // Example: Calculate available balance as in your dashboard controller

    const withdrawal = new Withdrawal({
      user: userId,
      amount,
      method,
      walletName,
      walletAddress,
      bankName,
      acountNumber,
      acountName,
      status,
    });
    await withdrawal.save();
    res.redirect('/user/withdrawal');
  } catch (err) {
    next(err);
  }
};

//function to get all users and each of their withdrawals for admin
exports.getAllWithdrawal = async (req, res) => {
  try {
    // Fetch all deposits and populate the user field
    const withdrawals = await Withdrawal.find().populate('user', 'name email profilePhoto');

    ///console.log('Fetched withdrawal:', withdrawals);

    // Render the admin/withdrawal.hbs view and pass the users
    res.render('admin/withdrawal', {
      withdrawals, // Pass users as an array for Handlebars
      withdrawalsJSON: JSON.stringify(withdrawals) // Pass users as a JSON string for JavaScript
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('An error occurred while fetching users.');
  }
};

// Function to activate a Withdrawal
exports.activateWithdrawal = async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const withdrawalRecord = await Withdrawal.findById(withdrawalId);

    if (!withdrawalRecord) {
      return res.status(404).json({ error: 'withdrawal request not found' });
    }

    if (req.file) {
      withdrawalRecord.wihdrawalReceipt = '/uploads/receipts/' + req.file.filename;
      console.log('Receipt file path:', withdrawalRecord.wihdrawalReceipt);
    } else {
      return res.status(400).json({ error: 'Receipt file is required.' });
    }

    withdrawalRecord.processedAt = new Date();
    withdrawalRecord.status = 'Successful';
    await withdrawalRecord.save();

    res.json({
      message: 'withdrawal processed successfully',
      status: withdrawalRecord.status,
      processedAt: withdrawalRecord.processedAt
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
};
