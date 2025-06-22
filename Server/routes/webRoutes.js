const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose
const { registerUser, loginUser, } = require('../controllers/userController'); // Import the user controller
const upload = require('../middleware/upload'); // Import the upload middleware
const User = require('../models/userModel'); // Import the User model
const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails

// Middleware to set default layout for all user routes
router.use((req, res, next) => {
    res.locals.layout = 'webLayout'; // Set default layout to user layout
    next();
});

// Example page routes
router.get('/', (req, res) => res.render('user/index')); // Home page
router.get('/contact', (req, res) => res.render('user/contact')); // Contact page

// POST contact form
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Set up Nodemailer transporter with Gmail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use App Password, not your main password
        }
    });

    // Email options
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'bosssantexdlyon@gmail.com',
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('user/contact', { message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.render('user/contact', { message: 'Error sending message. Please try again.' });
    }
});

router.get('/FAQ', (req, res) => res.render('user/FAQ')); // FAQ page
router.get('/about', (req, res) => res.render('user/about')); // About page
router.get('/errorPage', (req, res) => res.render('user/errorPage')); // User page
router.get('/market', (req, res) => res.render('user/market')); // Market page
router.get('/service', (req, res) => res.render('user/service')); // Our Services page
router.get('/investment', (req, res) => res.render('user/investment')); // Investment page
router.get('/buyAndSell', (req, res) => res.render('user/buyAndSell')); // Buy and Sell page
router.get('/legal', (req, res) => res.render('user/legal')); // Legal page
router.get('/termOfUse', (req, res) => res.render('user/termOfUse')); // Terms of Use page
router.get('/team', (req, res) => res.render('user/team')); // Team page
router.get('/passwordReset', (req, res) => res.render('user/passwordReset')); // Password Reset page


module.exports = router; // Export the router