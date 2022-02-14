const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver');
const { authentication } = require('../utils');

router
	.post('/register', driverController.register)
	.post('/login/username', driverController.login)
	.get('/profile/:id', driverController.getDriverProfile)
	.get('/dashboard', authentication, driverController.getDriverDashboard)
	.post('/login/email', driverController.loginByEmail)
	.post('/login/email/verify', driverController.loginVerifyOTP);

module.exports = router;
