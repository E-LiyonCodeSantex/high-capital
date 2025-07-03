const Deposit = require('../models/depositModel');
const Withdrawal = require('../models/withdrawalModel');
const WalletAdress = require('../models/walletModel');

// Helper to filter by month/year
function filterByDate(items, month, year) {
    if (!month && !year) return items;
    return items.filter(item => {
        const date = new Date(item.date || item.requestedAt);
        const itemMonth = (date.getMonth() + 1).toString().padStart(2, '0');
        const itemYear = date.getFullYear().toString();
        return (!month || itemMonth === month) && (!year || itemYear === year);
    });
}


exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        //console.log('User ID:', userId);

        const { type = 'all', currency = 'all', month = '', year = '' } = req.query;

        // Fetch all wallet names for currency filter
        const wallets = await WalletAdress.find().lean();

        // Fetch deposits and withdrawals
        let deposits = await Deposit.find({ user: userId }).lean();
        //console.log('Deposits:', deposits);
        let withdrawals = await Withdrawal.find({ user: userId }).lean();
        //console.log('Withdrawals:', withdrawals);

        // Filter by currency if selected
        if (currency !== 'all') {
            deposits = deposits.filter(d => d.coinType === currency);
            withdrawals = withdrawals.filter(w => w.method === currency || w.walletName === currency);
        }

        // Normalize transactions
        let transactions = [
            ...deposits.map(tx => ({
                date: tx.date,
                type: 'deposit',
                amount: tx.amount,
                status: tx.status,
                reference: tx._id,
                currency: tx.coinType,
                transactionReceipt: tx.transactionReceipt, // <-- add this
                name: tx.name,
                dailyProfit: tx.dailyProfit,
                duration: tx.duration,
                totalProfit: tx.totalProfit,
                endDate: tx.endDate
            })),
            ...withdrawals.map(tx => ({
                date: tx.requestedAt,
                type: 'withdrawal',
                amount: tx.amount,
                method: tx.method,
                walletName: tx.walletName,
                walletAddress: tx.walletAddress,
                acountNumber: tx.acountNumber,
                acountName: tx.acountName,
                bankName: tx.bankName,
                status: tx.status,
                reference: tx._id,
                processedAt: tx.processedAt,
                transactionReceipt: tx.transactionReceipt,
                endDate: tx.processedAt
            })),
            // Add profit and referral commission here if you have those models/data
        ];

        // Filter by type
        if (type !== 'all') {
            transactions = transactions.filter(tx => tx.type === type);
        }

        // Filter by date
        transactions = filterByDate(transactions, month, year);

        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.render('user/history', {
            transactions,
            wallets,
            selected: { type, currency, month, year }
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).send('Error loading transaction history.');
    }
};
