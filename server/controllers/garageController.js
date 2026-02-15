const Garage = require('../models/Garage');
const User = require('../models/User');

const getGarageProfile = async (req, res) => {
    try {
        const garage = await Garage.findById(req.user.garageId).populate('owner', '-password');
        if (!garage) return res.status(404).json({ message: 'Garage not found' });

        res.json(garage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getGarageProfile };
