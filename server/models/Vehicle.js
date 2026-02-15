const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    plateNumber: { type: String, required: true }, // Removed global unique: true
    color: { type: String },
    vin: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    garage: { type: mongoose.Schema.Types.ObjectId, ref: 'Garage', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound unique index: Plate must be unique PER GARAGE
VehicleSchema.index({ plateNumber: 1, garage: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
