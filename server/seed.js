require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Garage = require('./models/Garage');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garage-jira')
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error(err));

const seed = async () => {
    try {
        await User.deleteMany({});
        await Customer.deleteMany({});
        await Garage.deleteMany({}); // Clear garages too

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const admin = new User({
            username: 'admin',
            password: passwordHash,
            role: 'garage_admin' // Updated role
        });
        await admin.save();
        console.log('Admin user created');

        // 2. Create Default Garage
        const garage = new Garage({
            name: 'Demo Garage',
            owner: admin._id,
            subscriptionStatus: 'active'
        });
        await garage.save();
        console.log('Default garage created');

        // 3. Link Garage to Admin
        admin.garage = garage._id;
        await admin.save();

        // 4. Create Sample Customer linked to Garage
        const customer = new Customer({
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com',
            garage: garage._id
        });
        await customer.save();
        console.log('Sample customer created');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
