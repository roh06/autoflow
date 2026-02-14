const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'garage_admin', 'staff'], default: 'staff' },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage' }, // Null for Super Admin
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
