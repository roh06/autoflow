const express = require('express');
const router = express.Router();
const { getGarageProfile, addStaff, getStaff } = require('../controllers/garageController');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, getGarageProfile);
router.post('/staff', auth, addStaff);
router.get('/staff', auth, getStaff);

module.exports = router;
