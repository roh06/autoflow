const express = require('express');
const router = express.Router();
const { createInvoice, getInvoice, updateInvoice } = require('../controllers/invoiceController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createInvoice);
router.get('/:id', auth, getInvoice);
router.put('/:id', auth, updateInvoice);

module.exports = router;
