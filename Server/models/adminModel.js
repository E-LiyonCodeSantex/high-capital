const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define admin schema
const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'admin' }, // Default role is 'admin'
        resetPasswordCode: { type: String, default: null }, // Code for password reset
        resetPasswordExpires: { type: Date, default: null },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Check if the password is already hashed
    if (this.password.startsWith('$2b$')) {
        return next(); // Skip hashing if the password is already hashed
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('Admin', adminSchema, 'admins');