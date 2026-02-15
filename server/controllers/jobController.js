const Job = require('../models/Job');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

// Helper to determine high-level status based on workflow index
const deriveStatus = (workflow, index) => {
    if (index === 0) return 'Pending';
    if (index === workflow.length - 1) return 'Delivered';
    if (index === workflow.length - 2) return 'Ready';
    return 'In Progress';
};

// Get all jobs (for Kanban board)
// Get all jobs (for Kanban board)
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ garage: req.user.garageId })
            .populate('vehicle')
            .populate('customer')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new Job (Handle Vehicle/Customer creation if needed, simplifies for now)
// Create a new Job
const createJob = async (req, res) => {
    try {
        const { customerId, vehicleId, serviceType, estimatedCost, estimatedCompletion, adminNotes } = req.body;

        const job = new Job({
            customer: customerId,
            vehicle: vehicleId,
            serviceType,
            estimatedCost,
            estimatedCompletion,
            adminNotes,
            garage: req.user.garageId // Link to Garage
        });

        // Add initial history
        job.updates.push({
            status: 'Pending',
            note: 'Job created',
            timestamp: new Date()
        });

        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single job by ID
// Get single job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, garage: req.user.garageId })
            .populate('vehicle')
            .populate('customer');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get jobs by Vehicle ID (History)
const getJobsByVehicleId = async (req, res) => {
    try {
        const jobs = await Job.find({ vehicle: req.params.vehicleId, garage: req.user.garageId })
            .populate('customer')
            .populate('vehicle')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Job Status
const updateJobStatus = async (req, res) => {
    try {
        const { status, stageIndex } = req.body;
        const job = await Job.findOne({ _id: req.params.id, garage: req.user.garageId });

        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (stageIndex !== undefined) {
            // Update by Index
            if (stageIndex >= 0 && stageIndex < job.workflow.length) {
                job.currentStageIndex = stageIndex;
                job.status = deriveStatus(job.workflow, stageIndex);

                // Add an update log automatically
                job.updates.push({
                    status: job.workflow[stageIndex],
                    note: `Moved to ${job.workflow[stageIndex]}`,
                    timestamp: new Date()
                });
            }
        } else if (status) {
            // Update by High-Level Status (Drag & Drop on Kanban)
            // We need to find a suitable stage index for this status
            // If dragging to "Ready", set to N-2
            // If dragging to "Delivered", set to N-1
            // If dragging to "Pending", set to 0
            // If dragging to "In Progress", set to 1 (if available)

            if (status === 'Pending') job.currentStageIndex = 0;
            else if (status === 'Delivered') job.currentStageIndex = job.workflow.length - 1;
            else if (status === 'Ready') job.currentStageIndex = Math.max(0, job.workflow.length - 2);
            else if (status === 'In Progress') job.currentStageIndex = 1; // Default to first active step

            job.status = status;
            job.updates.push({
                status: status, // High-level status
                note: `Moved to ${status}`,
                timestamp: new Date()
            });
        }

        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add an Update (Photo/Comment)
const addJobUpdate = async (req, res) => {
    try {
        const { note, photos } = req.body;
        const job = await Job.findOne({ _id: req.params.id, garage: req.user.garageId });
        if (!job) return res.status(404).json({ message: 'Job not found' });

        job.updates.push({
            status: job.status, // Keep current status
            note,
            photos,
            timestamp: new Date()
        });

        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get jobs for authenticated customer (Unified View)
const getMyJobs = async (req, res) => {
    try {
        // 1. Find all Customer records for this phone number (across all garages)
        // If phone is in token, use it. Fallback to just ID if not (legacy tokens)
        let customerIds = [req.user.id];

        if (req.user.phone) {
            const customers = await Customer.find({ phone: req.user.phone });
            customerIds = customers.map(c => c._id);
        }

        // 2. Find jobs linked to ANY of these customer IDs
        const jobs = await Job.find({ customer: { $in: customerIds } })
            .populate('vehicle')
            .populate('garage', 'name') // Populate Garage Name for UI
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getJobs, createJob, getJobById, updateJobStatus, addJobUpdate, getMyJobs, getJobsByVehicleId };
