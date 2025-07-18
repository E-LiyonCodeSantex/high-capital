const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/authMiddleware'); // Import both middlewares
const adminController = require('../controllers/adminController');
const adminUserController = require('../controllers/adminUserController');
const { adminResetPassword, verifyResetCode } = require('../controllers/adminController');
const { getAllDeposit, activateDeposit } = require('../controllers/depositController');
const { getAllWithdrawal, activateWithdrawal } = require('../controllers/withdrawalController');
const walletController = require('../controllers/walletController');
const { adminGetTransactionHistory } = require('../controllers/historyController');
const Deposit = require('../models/depositModel');
const withdrawal = require('../models/withdrawalModel'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/receipts/' });


// Middleware to set default layout for all admin routes
router.use((req, res, next) => {
  res.locals.layout = 'adminLayout'; // Set default layout to adminLayout
  next();
});

// Override layout for login route
router.get('/login', (req, res) => res.render('admin/login', { layout: false })); // Render the login page without layout

router.post('/login', adminController.adminLogin);

router.get('/adminPasswordReset', (req, res) => {
    res.render('admin/adminPasswordReset', { layout: false });
});
router.post('/adminPasswordReset', async (req, res, next) => {
    try {
        await adminResetPassword(req, res, next); // Call the resetPassword function
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});
router.post('/adminVerifyResetCode', async (req, res, next) => {
    try {
        await verifyResetCode(req, res, next); // Call the resetPassword function
    } catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});

router.get('/', authenticateAdmin, adminUserController.getDashboardStats);

router.get('/user', authenticateAdmin, adminUserController.getAllUsers);

router.get('/user/:userId/transactions', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const deposits = await deposit.find({ user: userId }).sort({ createdAt: -1 });
    const withdrawals = await withdrawal.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ deposits, withdrawals });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

router.get('/userDeposit', authenticateAdmin, async (req, res) => {
  try {
    await getAllDeposit(req, res); // Call the makeDeposit function
  } catch (err) {
    console.error('Error in getAllDeposit route:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post('/activateDeposit/:id', async (req, res) => {
  try {
    await activateDeposit(req, res); // Call the activateDeposit function
  } catch (err) {
    console.error('Error activating deposit:', err);
    res.status(500).json({ error: 'Failed to activate deposit' });
  }
});

router.delete('/deleteDeposit/:id', async (req, res) => {
  try {
    const depositId = req.params.id;
    await deposit.findByIdAndDelete(depositId);
    res.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    res.status(500).json({ error: 'Failed to delete deposit' });
  }
});
router.get('/userWithdrawal', authenticateAdmin, async (req, res) => {
  try {
    await getAllWithdrawal(req, res); // Call the getAllWithdrawal function
  } catch (err) {
    console.error('Error in getAllWithdrawal route:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post('/ProcessWithdrawal/:id', upload.single('withdrawal-receipt'), async (req, res) => {
  try {
    await activateWithdrawal(req, res); // Call the activateWithdrawal function
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.render('user/deposit', { fileSizeError: 'File size exceeds the limit of 2MB.' });
    }
    console.error('Error processing withdrawal:', err);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

//router.get('/user/:id', authenticateadmin, isAdmin, adminController.getUserById); // Get user by ID
router.get('/history', authenticateAdmin, async (req, res) => {
  try {
    await adminGetTransactionHistory(req, res);
  } catch (err) {
    console.error('Error in adminGetTransactionHistory route:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.get('/adminHistory', authenticateAdmin, (req, res) => res.render('admin/adminHistory'));
router.get('/Notifications', authenticateAdmin, (req, res) => res.render('admin/Notifications'));
router.get('/uncomfirmedDeposit', authenticateAdmin, (req, res) => res.render('admin/uncomfirmedDeposit'));

router.get('/setting', authenticateAdmin, (req, res) => res.render('admin/setting')); // Settings

//routes for investment plans
router.get('/investmentPlans', authenticateAdmin, adminController.getInvestmentPlans);
router.get('/investment-plans', authenticateAdmin, adminController.getInvestmentPlans);
router.get('/investment-plans/:id', authenticateAdmin, adminController.getInvestmentPlanById);
router.post('/investment-plans', authenticateAdmin, adminController.createInvestmentPlan);
router.put('/investment-plans/:id', authenticateAdmin, adminController.updateInvestmentPlan);
router.delete('/investment-plans/:id', authenticateAdmin, adminController.deleteInvestmentPlan);

//routes for admin wallets
router.get('/walletAdresses', authenticateAdmin, walletController.getWalletAdresses);
router.get('/WalletManagement', authenticateAdmin, walletController.getWalletAdresses);
router.get('/WalletManagement/:id', authenticateAdmin, walletController.getWalletAdressById);
router.post('/WalletManagement', authenticateAdmin, walletController.createWalletAdress);
router.delete('/WalletManagement/:id', authenticateAdmin, walletController.deleteWalletAdress);
router.put('/WalletManagement/:id', authenticateAdmin, walletController.updateWalletAdress);

module.exports = router;