const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, trackByPhone } = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createCustomer);
router.get('/', auth, getCustomers);
// Public route for tracking (no auth middleware required for initial lookup, strictly by phone)
router.get('/track/:phone', trackByPhone);

module.exports = router;
