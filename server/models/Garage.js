const mongoose = require('mongoose');

const GarageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'trial'],
        default: 'active'
    },
    stripeCustomerId: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Garage', GarageSchema);
