const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel'); // Import the Admin model

const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the role is admin
        if (decoded.role !== 'admin') {
            return res.redirect('/admin/login');
        }

        // Fetch the admin user from the database
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            return res.redirect('/admin/login');
        }

        req.user = admin; // Attach the admin user to the request
        //console.log('Authenticated admin:', req.user);
        next();
    } catch (error) {
        //console.error('Invalid token:', error);
        return res.redirect('/admin/login'); // Redirect to login page
    }
};

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    //console.log('Token received:', token);

    if (!token) {
        //console.log('No token provided');
        return res.redirect('/user/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log('Decoded token:', decoded);

        // Fetch the user from the database
        const user = await User.findById(decoded.id).select('-password'); // Exclude the password field
        if (!user) {
            //console.log('User not found in the database');
            return res.redirect('/user/login');
        }

        // Check if the role is user
        if (decoded.role !== 'user') {
            return res.redirect('/user/login');
        }

        req.user = user; // Attach the user to the request
        //console.log('Authenticated user:', req.user);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        //console.error('Invalid token:', error);
        return res.status(400).redirect('/user/login'); // Redirect to login page if token is invalid
    }
};

module.exports = { authenticateUser, authenticateAdmin, };
