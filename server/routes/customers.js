const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers } = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createCustomer);
router.get('/', auth, getCustomers);

module.exports = router;
