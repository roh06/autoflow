const express = require('express');
const router = express.Router();
const { getGarageProfile } = require('../controllers/garageController');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, getGarageProfile);

module.exports = router;
