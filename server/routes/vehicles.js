const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles } = require('../controllers/vehicleController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createVehicle);
router.get('/', auth, getVehicles);

module.exports = router;
