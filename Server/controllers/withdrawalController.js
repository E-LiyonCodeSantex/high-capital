const Withdrawal = require('../models/withdrawalModel');
const deposit = require('../models/investmentModel');
const WalletAdress = require('../models/walletModel');

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

    // Calculate available balance
    const deposits = await deposit.find({ user: userId, status: 'completed' });
    const withdrawals = await Withdrawal.find({ user: userId });
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    const successfulWithdrawals = withdrawals.filter(w => w.status === 'Successful');

    const totalWithdraw = successfulWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const totalPending = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    let availableBalance = deposits.reduce((sum, dep) => {
      let profit = 0;
      if (dep.dailyProfit && dep.duration) {
        profit = dep.amount * (Number(dep.dailyProfit) / 100) * dep.duration;
      }
      return sum + dep.amount + profit + (dep.oldBalance || 0);
    }, 0) - totalWithdraw - totalPending;

    // Too many pending requests
    if (pendingWithdrawals.length >= 2) {
      const wallets = await WalletAdress.find();
      return res.render('user/withdrawal', {
        errorMessage: 'Too many unprocessed withdrawal requests, please try again later.',
        wallets,
        withdrawals,
        user: req.user
      });
    }

    // Insufficient balance
    if (availableBalance <= 0 || Number(amount) > availableBalance) {
      const wallets = await WalletAdress.find();
      return res.render('user/withdrawal', {
        errorMessage: 'Insufficient balance for withdrawal.',
        wallets,
        withdrawals,
        user: req.user
      });
    }

    // Proceed with withdrawal
    const withdrawalDoc = new Withdrawal({
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
    await withdrawalDoc.save();
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
