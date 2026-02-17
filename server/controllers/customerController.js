const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        console.log("Creating Customer:", { name, phone, email, garageId: req.user.garageId });

        // Check if customer exists IN THIS GARAGE
        let customer = await Customer.findOne({ phone, garage: req.user.garageId });

        if (customer) return res.status(400).json({ message: 'Customer already exists in this garage' });

        customer = new Customer({
            name,
            phone,
            email,
            garage: req.user.garageId
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        console.error("Customer Creation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ garage: req.user.garageId });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const Job = require('../models/Job');

const trackByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        // Find customer by phone (across any garage for now, or refine if needed)
        const customer = await Customer.findOne({ phone });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find the MOST RECENT active job for this customer
        const job = await Job.findOne({ customer: customer._id, active: true })
            .sort({ createdAt: -1 });

        if (!job) {
            return res.status(404).json({ message: 'No active jobs found for this number' });
        }

        res.json({ jobId: job._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createCustomer, getCustomers, trackByPhone };
