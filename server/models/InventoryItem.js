const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        unique: true,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        default: 'General',
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    lowStockThreshold: {
        type: Number,
        default: 5,
    }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
