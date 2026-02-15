const Invoice = require('../models/Invoice');
const Job = require('../models/Job');
const Garage = require('../models/Garage');

// Helper to generate next invoice number
const generateInvoiceNumber = async (garageId) => {
    const lastInvoice = await Invoice.findOne({ garage: garageId }).sort({ createdAt: -1 });
    if (!lastInvoice) return 'INV-001';

    const lastNum = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    return `INV-${String(lastNum + 1).padStart(3, '0')}`;
};

const createInvoice = async (req, res) => {
    try {
        const { jobId } = req.body;
        const garageId = req.user.garageId;

        // Verify Job belongs to Garage
        const job = await Job.findOne({ _id: jobId, garage: garageId }).populate('customer');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (!job.customer) {
            return res.status(400).json({ message: 'Job does not have a valid linked customer' });
        }

        // Check if invoice already exists for this job
        const existingInvoice = await Invoice.findOne({ job: jobId });
        if (existingInvoice) return res.status(200).json(existingInvoice);

        // Auto-generate items from Job service types
        const items = job.serviceType.map(service => ({
            description: service,
            quantity: 1,
            unitPrice: 0, // Admin must edit this
            total: 0
        }));

        if (job.estimatedCost > 0 && items.length > 0) {
            items[0].unitPrice = job.estimatedCost;
            items[0].total = job.estimatedCost;
        }

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxRate = 18;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;

        const invoiceNumber = await generateInvoiceNumber(garageId);

        const invoice = new Invoice({
            garage: garageId,
            job: jobId,
            customer: job.customer._id,
            invoiceNumber,
            items,
            subtotal,
            taxRate,
            taxAmount,
            total,
            status: 'Draft',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due in 7 days
        });

        await invoice.save();
        res.status(201).json(invoice);

    } catch (err) {
        console.error("Error creating invoice:", err);
        res.status(500).json({ error: err.message });
    }
};

const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, garage: req.user.garageId })
            .populate('customer')
            .populate('job')
            .populate('garage');

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { items, status, taxRate } = req.body;

        let invoice = await Invoice.findOne({ _id: req.params.id, garage: req.user.garageId });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        if (items) {
            invoice.items = items;
            invoice.subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        }

        if (taxRate !== undefined) invoice.taxRate = taxRate;

        // Recalculate
        invoice.taxAmount = (invoice.subtotal * invoice.taxRate) / 100;
        invoice.total = invoice.subtotal + invoice.taxAmount;

        if (status) invoice.status = status;

        await invoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createInvoice, getInvoice, updateInvoice };
