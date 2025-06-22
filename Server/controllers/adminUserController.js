const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


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
