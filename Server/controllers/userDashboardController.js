
const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const InvestmentPlan = require('../models/investmentPlanModel');
const deposit = require('../models/depositModel'); // Import the Deposit model
const WalletAdress = mongoose.models.WalletAdress; // Use the existing WalletAdress model from mongoose.models
const { authenticateUser } = require('../middleware/authMiddleware');
const { upload, normalizeFilePath } = require('../middleware/upload');
const withdrawal = require('../models/withdrawalModel');

exports.getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const now = new Date();
        await deposit.updateMany(
            { user: userId, status: 'confirmed', endDate: { $lte: now } },
            { $set: { status: 'completed' } }
        );

        // Fetch all deposits and withdrawals for the user
        const deposits = await deposit.find({ user: userId });
        const withdrawals = await withdrawal.find({ user: userId, status: 'Successful' }); // Only successful withdrawals


        // Calculate total deposit
        const totalDeposit = deposits.reduce((sum, dep) => sum + dep.amount, 0);

        // Calculate total withdrawal
        const totalWithdraw = withdrawals.reduce((sum, w) => sum + w.amount, 0);

        // Calculate available balance (completed deposits + profit, minus withdrawals)
        let availableBalance = deposits
            .filter(dep => dep.status === 'completed')
            .reduce((sum, dep) => {
                let profit = 0;
                if (dep.dailyProfit && dep.duration) {
                    profit = dep.amount * (Number(dep.dailyProfit) / 100) * dep.duration;
                }
                return sum + dep.amount + profit + (dep.oldBalance || 0);
            }, 0) - totalWithdraw;

        // Calculate total balance (all deposits + accrued profit so far, minus withdrawals)
        let totalBalance = deposits
            .filter(dep => dep.status === 'confirmed' || dep.status === 'completed')
            .reduce((sum, dep) => {
                let profit = 0;
                if (dep.dailyProfit && dep.startDate) {
                    const now = new Date();
                    const start = new Date(dep.startDate);
                    const end = dep.endDate ? new Date(dep.endDate) : null;
                    let elapsedDays = 0;
                    if (dep.status === 'completed' && dep.duration) {
                        elapsedDays = dep.duration;
                    } else if (dep.status === 'active' && end) {
                        elapsedDays = Math.floor((Math.min(now, end) - start) / (1000 * 60 * 60 * 24));
                    }
                    profit = dep.amount * (Number(dep.dailyProfit) / 100) * elapsedDays;
                }
                return sum + dep.amount + profit + (dep.oldBalance || 0);
            }, 0); - totalWithdraw;

        res.render('user/dashboard', {
            availableBalance,
            totalBalance,
            totalDeposit,
            totalWithdraw,
            user: req.user
        });
    } catch (err) {
        next(err);
    }
};

