//const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const User = require('../models/userModel'); // Import the MongoDB collection
const comparePasswords = require('../utils/passwordHelpers');


//check what this code means later
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register user function
const upload = require('../middleware/upload');

const registerUser = async (req, res) => {
    try {
        const { name, userName, email, password, confirmPassword, bitcoinWallet, usdtWallet, ethereumWallet } = req.body;

        if (password !== confirmPassword) {
            return res.render('user/signUp', { confirmPasswordError: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('user/signUp', { headerError: 'User already exists' });
        }

        const profilePhoto = req.file ? `/uploads/${req.file.filename}` : '/photos/default-user.jpg';

        const user = await User.create({
            name,
            userName,
            email: email.toLowerCase(),
            password,
            bitcoinWallet,
            usdtWallet,
            ethereumWallet,
            profilePhoto
        });

        // After saving user to DB:
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to SimpliNestle!',
            text: `Hello ${name},\n\nThank you for registering at SimpliNestle! We're glad to have you.\n\nBest regards,\nThe SimpliNestle Team`
        };

        await transporter.sendMail(mailOptions);

        if (user) {
            res.redirect('/user/login');
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).render('errorPage', { errorMessage: 'An unexpected error occurred. Please try again.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.render('user/login', { emailError: 'Email is required', email, layout: false });
        }
        if (!password) {
            return res.render('user/login', { passwordError: 'Password is required', email, layout: false });
        }

        // Find the user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.render('user/login', { emailError: 'User not found', email, layout: false });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.render('user/login', { passwordError: 'Invalid password', email, layout: false });
        }

        // Update lastLogin field
        user.lastLogin = new Date();
        // Update the isActive field to true
        user.isActive = true;
        user.lastActiveAt = new Date();
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Set the token in a cookie (optional)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // **Do not send a response here!**
        return true;
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).render('errorPage', { errorMessage: 'An unexpected error occurred. Please try again.' });
    }
};

const resetPassword = async (req, res, next) => {
    const email = req.body.passwordReset;
    if (!email) {
        return res.render('user/passwordReset', { error: 'Email is required', layout: false });
    }

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.render('user/passwordReset', { error: 'No account with that email.', layout: false });
    }

    // 2. Generate a reset code (6-digit)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save code and expiry to user (optional, for real implementation)
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log('Saved user after reset:', user);

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
        subject: 'Your Simpli nestle Password Reset Code',
        text: `Your Simpli nestle password reset code is: ${resetCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.render('user/verifyResetCode', { email, layout: false });
    } catch (err) {
        console.error('Nodemailer error:', err);
        return res.render('user/passwordReset', { error: 'Failed to send email. Please try again.', layout: false });
    }
};

const verifyResetCode = async (req, res, next) => {
    const { email, resetCode, newPassword, confirmPassword } = req.body;
    if (!email || !resetCode || !newPassword || !confirmPassword) {
        return res.render('user/verifyResetCode', { email, error: 'All fields are required', layout: false });
    }
    if (newPassword !== confirmPassword) {
        return res.render('user/verifyResetCode', { email, error: 'Passwords do not match', layout: false });
    }
    console.log('Submitted:', email, resetCode);
    const users = await User.find({ email: email.toLowerCase() });
    console.log('Users with this email:', users);
    const user = await User.findOne({ email: email.toLowerCase(), resetPasswordCode: resetCode.trim() });
    console.log('User found:', user);
    if (!user || user.resetPasswordExpires < Date.now()) {
        return res.render('user/verifyResetCode', { email, error: 'Invalid or expired code', layout: false });
    }
    if (user) {
        console.log('Code in DB:', user.resetPasswordCode, 'Expires:', user.resetPasswordExpires, 'Now:', Date.now());
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.redirect('/user/login');
};

const verifyPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        // Fetch user with password field
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.render('user/settingsConfirm', { error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password); //bcrypt.compare(password, user.password)
        if (isMatch) {
            req.session.settingsConfirmed = true;
            return res.redirect('/user/settings');
        } else {
            return res.render('user/settingsConfirm', { error: 'Incorrect password' });
        }
    } catch (err) {
        next(err);
    }
};

const updateUserSettings = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updateFields = {
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber, // Make sure this matches your form and schema!
            bitcoinWallet: req.body.bitcoinWallet,
            usdtWallet: req.body.usdtWallet,
            ethereumWallet: req.body.ethereumWallet,
        };

        // Handle password change if provided
        if (req.body.newPassword && req.body.newPassword === req.body.confirmPassword) {
            updateFields.password = await bcrypt.hash(req.body.newPassword, 10);
        }

        // Handle profile photo if using file upload
        if (req.file && req.file.path) {
            updateFields.profilePhoto = `/uploads/${req.file.filename}`;
        }

        console.log('Updating user:', userId, updateFields); // <-- Add this line

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        console.log('Updated user:', updatedUser); // <-- Add this line

        res.redirect('/user/dashboard');
    } catch (err) {
        next(err);
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.render('user/logout', { layout: false });
    });
};


module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    verifyResetCode,
    verifyPassword,
    updateUserSettings,
    logoutUser,
};