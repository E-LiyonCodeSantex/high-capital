const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Deposit = require('../models/investmentModel');
const Withdrawal = require('../models/withdrawalModel');


//function to get all users
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find().select('-password'); // Exclude passwords for security

        // Render the admin/User.hbs view and pass the users
        res.render('admin/User', {
            users, // Pass users as an array for Handlebars
            usersJSON: JSON.stringify(users) // Pass users as a JSON string for JavaScript
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users.');
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, activeUsers, depositAgg, withdrawalAgg, unconfirmedDepositsCount, unconfirmedWithdrawalsCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Deposit.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
            Withdrawal.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
            Deposit.countDocuments({ status: 'unconfirmed' }),
            Withdrawal.countDocuments({ status: { $ne: 'unconfirmed' } })
        ]);
        const totalDeposits = depositAgg[0]?.total || 0;
        const totalWithdrawals = withdrawalAgg[0]?.total || 0;
        res.render('admin/index', {
            totalUsers,
            activeUsers,
            totalDeposits,
            totalWithdrawals,
            unconfirmedDepositsCount,
            unconfirmedWithdrawalsCount
        });
    } catch (err) {
        res.status(500).render('admin/index', { error: 'Server error' });
    }
};