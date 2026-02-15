const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }, // Removed global unique: true
    email: { type: String },
    // Simple auth using OTP (mocked for now)
    otp: { type: String },
    otpExpires: { type: Date },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound unique index: Phone must be unique PER GARAGE
CustomerSchema.index({ phone: 1, garage: 1 }, { unique: true });

module.exports = mongoose.model('Customer', CustomerSchema);
