const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const InvestmentPlan = require('../models/investmentPlanModel');

const createAdmin = async () => {
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
        //console.log('Admin account already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash('Patromia@135321', 10);
    //console.log('Hashed password during admin creation:', hashedPassword); // Debug log

    const admin = new Admin({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
    });

    await admin.save();
    //console.log('Admin account created successfully');
};

// Admin login function
exports.adminLogin = async (req, res) => {
    try {
        //console.log('Login request received:', req.body); // Debug log

        const { email, password } = req.body;

        //console.log('Email used for login:', email); // Debug log
        //console.log('Password used for login:', password); // Debug log

        const admin = await Admin.findOne({ email });
        console.log('Admin document retrieved:', admin);
        if (!admin) {
            //console.log('Admin not found'); // Debug log
            return res.status(401).render('admin/login', { errorMessage: 'Invalid email', email });
        }

        // Compare passwords directly in the adminLogin function
        //console.log('Entered password:', password); // Debug log
        //console.log('Stored hashed password:', admin.password); // Debug log
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        //console.log('Password comparison result:', isPasswordMatch); // Debug log

        if (!isPasswordMatch) {
            //console.log('Password mismatch'); // Debug log
            return res.status(401).render('admin/login', { errorMessage: 'Invalid password' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.redirect('/admin');
    } catch (error) {
        //console.error('Error during admin login:', error);
        return res.status(500).render('errorPage', { errorMessage: 'An unexpected error occurred. Please try again.' });
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