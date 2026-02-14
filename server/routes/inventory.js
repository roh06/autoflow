const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/authMiddleware');

// All routes protected by admin auth
router.get('/', auth, inventoryController.getItems);
router.post('/', auth, inventoryController.addItem);
router.put('/:id', auth, inventoryController.updateItem);
router.delete('/:id', auth, inventoryController.deleteItem);

module.exports = router;
