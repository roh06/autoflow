const InventoryItem = require('../models/InventoryItem');

// Get all items
// Get all items for the authenticated user's garage
exports.getItems = async (req, res) => {
    try {
        const items = await InventoryItem.find({ garage: req.user.garageId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add new item
// Add new item
exports.addItem = async (req, res) => {
    const { name, sku, quantity, price, category, lowStockThreshold } = req.body;
    try {
        const newItem = new InventoryItem({
            name,
            sku,
            quantity,
            price,
            category,
            lowStockThreshold,
            garage: req.user.garageId
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update item (e.g. quantity adjustment)
// Update item (e.g. quantity adjustment)
exports.updateItem = async (req, res) => {
    try {
        // Enforce garage ownership check implicitly by query
        const updatedItem = await InventoryItem.findOneAndUpdate(
            { _id: req.params.id, garage: req.user.garageId },
            req.body,
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found or access denied' });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete item
// Delete item
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await InventoryItem.findOneAndDelete({ _id: req.params.id, garage: req.user.garageId });
        if (!deletedItem) return res.status(404).json({ message: 'Item not found or access denied' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
