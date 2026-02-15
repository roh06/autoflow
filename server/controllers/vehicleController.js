const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

const createVehicle = async (req, res) => {
    try {
        const { make, model, year, plateNumber, color, vin, customerId } = req.body;
        const normalizedPlate = plateNumber.toUpperCase().replace(/\s/g, '');

        // Verify customer exists and belongs to this garage
        const customer = await Customer.findOne({ _id: customerId, garage: req.user.garageId });
        if (!customer) return res.status(404).json({ message: 'Customer not found or access denied' });

        // Check for existing vehicle in this garage
        let vehicle = await Vehicle.findOne({
            plateNumber: normalizedPlate,
            garage: req.user.garageId
        });

        if (vehicle) {
            // Update owner if needed? For now, just return existing to link history.
            // Possibly update other fields if provided?
            // Let's keep it simple: Return existing.
            return res.status(200).json(vehicle);
        }

        vehicle = new Vehicle({
            make, model, year,
            plateNumber: normalizedPlate,
            color, vin,
            owner: customerId,
            garage: req.user.garageId
        });

        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        // Handle duplicate key error gracefully just in case race condition
        if (err.code === 11000) {
            try {
                const existing = await Vehicle.findOne({
                    plateNumber: req.body.plateNumber.toUpperCase().replace(/\s/g, ''),
                    garage: req.user.garageId
                });
                if (existing) return res.status(200).json(existing);
            } catch (e) {
                // ignore
            }
        }
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
