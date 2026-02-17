const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'garage_admin', 'staff', 'technician'], default: 'staff' },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage' }, // Null for Super Admin

    // Technician/Staff Profile
    name: { type: String },
    specialization: { type: String }, // e.g. "Engine", "Body Work", "PPF"
    phone: { type: String },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
