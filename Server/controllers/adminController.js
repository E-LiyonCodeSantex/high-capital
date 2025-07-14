const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const InvestmentPlan = require('../models/investmentPlanModel');
const nodemailer = require('nodemailer');

const createAdmin = async () => {
    const existingAdmin = await Admin.findOne({ email: 'bosssantexdlyon@gmail.com' });
    if (existingAdmin) {
        //console.log('Admin account already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash('Patromia@135321', 10);
    //console.log('Hashed password during admin creation:', hashedPassword); // Debug log

    const admin = new Admin({
        name: 'Admin',
        email: 'bosssantexdlyon@gmail.com',
        password: hashedPassword,
    });

    await admin.save();
    //console.log('Admin account created successfully');
};

// Admin login function
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        console.log('Admin document retrieved:', admin);
        if (!admin) {
            //console.log('Admin not found'); // Debug log
            return res.status(401).render('admin/login', { errorMessage: 'Invalid email', email, layout: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);

        if (!isPasswordMatch) {
            return res.status(401).render('admin/login', { errorMessage: 'Invalid password', layout: false });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.redirect('/admin');
    } catch (error) {
        res.redirect('/admin/login?error=LoginFailed');
    }
};

exports.adminResetPassword = async (req, res, next) => {
    const email = req.body.passwordReset;
    if (!email) {
        return res.render('admin/adminPasswordReset', { error: 'Email is required', layout: false });
    }

    // 1. Check if user exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.render('admin/adminPasswordReset', { error: 'No account with that email.', layout: false });
    }

    // 2. Generate a reset code (6-digit)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save code and expiry to user (optional, for real implementation)
    admin.resetPasswordCode = resetCode;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();
    //console.log('Saved user after reset:', user);

    // 4. Send email with code (using nodemailer)
    // Configure your transporter (use your real email credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // set in your .env
            pass: process.env.EMAIL_PASS  // set in your .env
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your High Capital Password Reset Code',
        text: `Your High Capital password reset code is: ${resetCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.render('admin/adminVerifyResetCode', { email, layout: false });
    } catch (err) {
        console.error('Nodemailer error:', err);
        return res.render('user/passwordReset', { error: 'Failed to send email. Please try again.', layout: false });
    }
};

exports.verifyResetCode = async (req, res, next) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;
    if (!email || !resetCode || !newPassword || !confirmPassword) {
        return res.render('admin/adminVerifyResetCode', { email, error: 'All fields are required', layout: false });
    }
    if (newPassword !== confirmPassword) {
        return res.render('admin/adminVerifyResetCode', { email, error: 'Passwords do not match', layout: false });
    }
    //console.log('Submitted:', email, resetCode);
    const admins = await Admin.find({ email: email.toLowerCase() });
    //console.log('admin with this email:', admins);
    const admin = await Admin.findOne({ email: email.toLowerCase(), resetPasswordCode: resetCode.trim() });
    //console.log('admin found:', admin);
    if (!admin || admin.resetPasswordExpires < Date.now()) {
        return res.render('admin/adminVerifyResetCode', { email, error: 'Admin not found ', layout: false });
    }
    if (admin) {
        console.log('Code in DB:', admin.resetPasswordCode, 'Expires:', admin.resetPasswordExpires, 'Now:', Date.now());
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordCode = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    return res.redirect('/admin/login');
};




exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find(); // Fetch transactions from the database
        res.render('admin/userHistory', { transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('An error occurred while fetching transactions.');
    }
};

// Get all investment plans
exports.getInvestmentPlans = async (req, res) => {
    try {
        const plans = await InvestmentPlan.find(); // Fetch all investment plans from the database
        res.render('admin/investment-plans', { plans }); // Pass the plans to the template
    } catch (error) {
        console.error('Error fetching investment plans:', error);
        res.status(500).send('An error occurred while fetching investment plans.');
    }
};

// Get a single investment plan by ID
exports.getInvestmentPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await InvestmentPlan.findById(id);

        if (!plan) {
            return res.status(404).json({ error: 'Investment plan not found.' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Error fetching investment plan:', error);
        res.status(500).json({ error: 'An error occurred while fetching the investment plan.' });
    }
};

// Create a new investment plan
exports.createInvestmentPlan = async (req, res) => {
    try {
        const { name, minDeposit, maxDeposit, dailyProfit, duration, referralBonus } = req.body;

        const newPlan = new InvestmentPlan({
            name,
            minDeposit,
            maxDeposit,
            dailyProfit,
            duration,
            referralBonus
        });

        await newPlan.save();
        res.status(201).json({ message: 'Investment plan created successfully', plan: newPlan });
    } catch (error) {
        console.error('Error creating investment plan:', error);
        res.status(500).json({ error: 'An error occurred while creating the investment plan.' });
    }
};

// Edit an existing investment plan
exports.editInvestmentPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, minDeposit, maxDeposit, dailyProfit, duration, referralBonus } = req.body;

        const updatedPlan = await InvestmentPlan.findByIdAndUpdate(
            id,
            { name, minDeposit, maxDeposit, dailyProfit, duration, referralBonus },
            { new: true, runValidators: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ error: 'Investment plan not found.' });
        }

        res.status(200).json({ message: 'Investment plan updated successfully', plan: updatedPlan });
    } catch (error) {
        console.error('Error editing investment plan:', error);
        res.status(500).json({ error: 'An error occurred while editing the investment plan.' });
    }
};

//delete existing investment plan
exports.deleteInvestmentPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await InvestmentPlan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ error: 'Investment plan not found.' });
        }

        res.status(200).json({ message: 'Investment plan deleted successfully.' });
    } catch (error) {
        console.error('Error deleting investment plan:', error);
        res.status(500).json({ error: 'An error occurred while deleting the investment plan.' });
    }
};

// Update an existing investment plan
exports.updateInvestmentPlan = async (req, res) => {
    const { name, minDeposit, maxDeposit, dailyProfit, duration, referralBonus } = req.body;
    await InvestmentPlan.findByIdAndUpdate(req.params.id, { name, minDeposit, maxDeposit, dailyProfit, duration, referralBonus });
    res.status(200).send('Plan updated successfully');
};

module.exports.createAdmin = createAdmin;