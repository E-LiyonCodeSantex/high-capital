const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Define user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, default: 'No user name Provided' },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    bitcoinWallet: { type: String, default: 'No Bitcoin Wallet Provided' },
    usdtWallet: { type: String, default: 'No USDT Wallet Provided' },
    ethereumWallet: { type: String, default: 'No Ethereum Wallet Provided' },
    profilePhoto: { type: String, default: '/photos/default-user.jpg' }, // Default profile photo
    phoneNumber: { type: String, default: 'No Phone Number Provided' },
    isActive: { type: Boolean, default: false }, // Active status
    role: { type: String, default: 'user' },
    lastLogin: { type: Date, default: null },
    lastActiveAt: { type: Date, default: Date.now },
    resetPasswordCode: {type: String, default: null }, // Code for password reset
    resetPasswordExpires: {type: Date, default: null },
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  // Ensure the password is only hashed if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

    // Only hash if not already hashed (bcrypt hashes are always 60 chars and start with $2)
  if (this.password && this.password.startsWith('$2b$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next(); // Proceed to save the document
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});


// Create and export the collection
const user = mongoose.model('userData', userSchema);

module.exports = user;
