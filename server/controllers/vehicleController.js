const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

const createVehicle = async (req, res) => {
    try {
        const { make, model, year, plateNumber, color, vin, customerId } = req.body;

        // Verify customer exists and belongs to this garage
        const customer = await Customer.findOne({ _id: customerId, garage: req.user.garageId });
        if (!customer) return res.status(404).json({ message: 'Customer not found or access denied' });

        const vehicle = new Vehicle({
            make, model, year, plateNumber, color, vin,
            owner: customerId,
            garage: req.user.garageId
        });

        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ garage: req.user.garageId }).populate('owner');
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createVehicle, getVehicles };
