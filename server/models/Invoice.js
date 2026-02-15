const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
    }],
    subtotal: {
        type: Number,
        required: true
    },
    taxRate: {
        type: Number,
        default: 18 // 18% GST default
    },
    taxAmount: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid', 'Void'],
        default: 'Draft'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    }
});

// Compound index to ensure unique invoice numbers per garage
InvoiceSchema.index({ garage: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
