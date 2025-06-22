const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/authMiddleware'); // Import both middlewares
const adminController = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/adminUserController');
const { getAllDeposit, activateDeposit } = require('../controllers/depositController');
const { getAllWithdrawal, activateWithdrawal } = require('../controllers/withdrawalController');
const walletController = require('../controllers/walletController');
const deposit = require('../models/depositModel');
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
router.get('/', authenticateAdmin, (req, res) => res.render('admin/index')); // Admin dashboard

router.get('/user', authenticateAdmin, async (req, res) => {
  try {
    await getAllUsers(req, res); // Call the makeDeposit function
  } catch (err) {
    console.error('Error in getAllUsers route:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.get('/user/:userId/transactions', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const deposits = await deposit.find({ user: userId }).sort({ createdAt: -1 });
    //const withdrawals = await Withdrawal.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ deposits });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Error fetching transactions' });
    res.json({ deposits: [], withdrawals: [], error: 'Error fetching transactions' });
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
router.get('/user-history', adminController.getTransactionHistory);
router.get('/history', (req, res) => res.render('admin/userHistory')); // History
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