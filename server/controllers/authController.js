const User = require('../models/User');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Garage = require('../models/Garage');

const register = async (req, res) => {
    try {
        const { username, password, garageName } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Create User (Role: garage_admin)
        user = new User({
            username,
            password: passwordHash,
            role: 'garage_admin'
        });
        await user.save();

        // 4. Create Garage
        const garage = new Garage({
            name: garageName || `${username}'s Garage`,
            owner: user._id
        });
        await garage.save();

        // 5. Link Garage to User
        user.garage = garage._id;
        await user.save();

        // 6. Return Token & Garage Info
        const token = jwt.sign(
            { id: user._id, role: user.role, garageId: garage._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Garage registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                garageId: garage._id,
                garageName: garage.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).populate('garage');
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Include garageId in token if it exists (it should for everyone except maybe super_admin in future)
        const payload = {
            id: user._id,
            role: user.role,
            garageId: user.garage?._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                garageId: user.garage?._id,
                garageName: user.garage?.name // Return Garage Name
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const customerLogin = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        // Mock OTP verification: Accept any OTP for now or specific '1234'
        if (otp !== '1234') return res.status(400).json({ message: 'Invalid OTP' });

        let customer = await Customer.findOne({ phone }).populate('garage');

        if (!customer) {
            return res.status(404).json({ message: 'Phone number not found. Please contact the garage.' });
        }

        // Safety check for garage
        const garageId = customer.garage ? customer.garage._id : null;
        const garageName = customer.garage ? customer.garage.name : 'Unknown Garage';

        const token = jwt.sign(
            { id: customer._id, role: 'customer', garageId, phone: customer.phone },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        res.json({
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone,
                garageId,
                garageName
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login, customerLogin };
