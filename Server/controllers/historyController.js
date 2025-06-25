const Deposit = require('../models/depositModel');
const Withdrawal = require('../models/withdrawalModel');

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch deposits and withdrawals
        const deposits = await Deposit.find({ user: userId }).lean();
        const withdrawals = await Withdrawal.find({ user: userId }).lean();

        // Normalize and combine transactions
        const transactions = [
            ...deposits.map(tx => ({
                date: tx.date,
                type: 'deposit',
                amount: tx.amount,
                status: tx.status || 'success',
                reference: tx._id
            })),
            ...withdrawals.map(tx => ({
                date: tx.date,
                type: 'withdrawal',
                amount: tx.amount,
                status: tx.status || 'pending',
                reference: tx._id
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

        res.render('user/history', { transactions });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).send('Error loading transaction history.');
    }
};

module.exports = {
    getTransactionHistory,
};