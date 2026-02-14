const express = require('express');
const router = express.Router();
const { register, login, customerLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/customer-login', customerLogin);

module.exports = router;
