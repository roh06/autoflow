const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
    status: { type: String, required: true },
    note: { type: String },
    photos: [{ type: String }], // Array of photo URLs
    timestamp: { type: Date, default: Date.now }
});

const JobSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },

    serviceType: {
        type: [String], // Changed to Array of Strings
        required: true,
    },
    adminNotes: {
        type: String,
        default: ''
    },
    estimatedCost: { type: Number },
    estimatedCompletion: { type: Date },

    // Dynamic Workflow
    workflow: {
        type: [String],
        default: ['Pending', 'In Progress', 'Ready', 'Delivered']
    },
    currentStageIndex: {
        type: Number,
        default: 0
    },

    // High-level bucket for Kanban
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Ready', 'Delivered'],
        default: 'Pending'
    },
    updates: [UpdateSchema],
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
