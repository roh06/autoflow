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

const addStaff = async (req, res) => {
    try {
        const { username, password, name, specialization, phone } = req.body;
        const garageId = req.user.garageId;

        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Name, Username, and Password are required' });
        }

        // Check if username exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'Username already taken' });

        // Hash password (reusing logic, ideally shared)
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: passwordHash,
            role: 'technician',
            garage: garageId,
            name,
            specialization,
            phone
        });
        await user.save();

        res.status(201).json({
            message: 'Staff member created',
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
                specialization: user.specialization
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getStaff = async (req, res) => {
    try {
        const staff = await User.find({ garage: req.user.garageId, role: 'technician' }).select('-password');
        res.json(staff || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getGarageProfile, addStaff, getStaff };
